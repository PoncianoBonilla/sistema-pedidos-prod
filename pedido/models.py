from django.db import models
from cliente.models import Cliente
from producto.models import Producto
# Create your models here.
class Pedido(models.Model):
    codigo = models.CharField(max_length=100, blank=False, null=False)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, blank=False, null=False)
   # aumentar la fecha y hora cuando se crea y actualiza el pedido
    fecha = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.codigo} - {self.cliente}"

class DetallePedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name="detalles")
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    precio = models.FloatField(default=0)
    cantidad = models.IntegerField(default=0)
    