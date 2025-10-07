from django.db import transaction
from rest_framework import serializers
from .models import Pedido, DetallePedido
from cliente.models import Cliente
from producto.models import Producto
from cliente.serializers import ClienteSerializer
from producto.serializers import ProductoSerializer

# Serializer para DetallePedido
class DetallePedidoSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(read_only=True)
    producto_id = serializers.PrimaryKeyRelatedField(
        queryset=Producto.objects.all(),
        source='producto',
        write_only=True
    )

    class Meta:
        model = DetallePedido
        fields = ['id', 'producto', 'producto_id', 'precio', 'cantidad']

    def validate_cantidad(self, value):
        if value <= 0:
            raise serializers.ValidationError("La cantidad debe ser mayor a 0")
        return value

    def validate_precio(self, value):
        if value < 0:
            raise serializers.ValidationError("El precio no puede ser negativo")
        return value

# Serializer para Pedido
class PedidoSerializer(serializers.ModelSerializer):
    cliente = ClienteSerializer(read_only=True)
    cliente_id = serializers.PrimaryKeyRelatedField(
        queryset=Cliente.objects.all(),
        source='cliente',
        write_only=True
    )
    detalles = DetallePedidoSerializer(many=True)

    class Meta:
        model = Pedido
        fields = ['id', 'codigo', 'cliente', 'cliente_id', 'fecha', 'detalles']

    def validate(self, data):
        detalles = data.get('detalles', [])
        if len(detalles) == 0:
            raise serializers.ValidationError("Un pedido debe tener al menos un detalle")
        
        productos = [d['producto'] for d in detalles]
        if len(productos) != len(set(productos)):
            raise serializers.ValidationError("No puede haber productos repetidos en un mismo pedido")
        return data

    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles')
        errores = []

        with transaction.atomic():
            pedido = Pedido.objects.create(**validated_data)

            for detalle_data in detalles_data:
                producto = detalle_data['producto']
                cantidad = detalle_data['cantidad']
                precio = detalle_data['precio']

                if cantidad > producto.stock:
                    errores.append(f"No hay suficiente stock para {producto.nombre} (Stock: {producto.stock})")
                else:
                    producto.stock -= cantidad
                    producto.save()
                    DetallePedido.objects.create(
                        pedido=pedido,
                        producto=producto,
                        precio=precio,
                        cantidad=cantidad
                    )

            if errores:
                # Si hay errores, se cancela toda la transacción
                raise serializers.ValidationError({"detalles": errores})

        return pedido

    def update(self, instance, validated_data):
        detalles_data = validated_data.pop('detalles')
        errores = []

        with transaction.atomic():
            # Actualizar campos básicos
            instance.codigo = validated_data.get('codigo', instance.codigo)
            instance.cliente = validated_data.get('cliente', instance.cliente)
            instance.save()

            # Restaurar stock de detalles antiguos
            for detalle in instance.detalles.all():
                detalle.producto.stock += detalle.cantidad
                detalle.producto.save()
            instance.detalles.all().delete()

            # Crear nuevos detalles
            for detalle_data in detalles_data:
                producto = detalle_data['producto']
                cantidad = detalle_data['cantidad']
                precio = detalle_data['precio']

                if cantidad > producto.stock:
                    errores.append(f"No hay suficiente stock para {producto.nombre} (Stock: {producto.stock})")
                else:
                    producto.stock -= cantidad
                    producto.save()
                    DetallePedido.objects.create(
                        pedido=instance,
                        producto=producto,
                        precio=precio,
                        cantidad=cantidad
                    )

            if errores:
                raise serializers.ValidationError({"detalles": errores})

        return instance
