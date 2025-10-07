from rest_framework import serializers
from .models import Producto

class ProductoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'descripcion', 'stock', 'precio']
        extra_kwargs = {
            'nombre': {'required': True, 'error_messages': {'required': 'El campo nombre es requerido'}},
            'stock': {'required': True, 'error_messages': {'required': 'El campo stock es requerido'}},
            'precio': {'required': True, 'error_messages': {'required': 'El campo precio es requerido'}},
        }

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError("El stock no puede ser negativo")
        return value

    def validate_precio(self, value):
        if value < 0:
            raise serializers.ValidationError("El precio no puede ser negativo")
        return value
