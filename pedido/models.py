from django.db import models
from cliente.models import Cliente
from producto.models import Producto
# Create your models here.
class Pedido(models.Model):
    codigo = models.CharField(max_length=100, blank=False, null=False)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, blank=False, null=False)

class DetallePedido(models.Model):
   
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, blank=False, null=False)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, blank=False, null=False)
    precio = models.FloatField(default=0)
    cantidad = models.IntegerField(default=0)