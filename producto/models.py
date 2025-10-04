from django.db import models

# Create your models here.

class Producto(models.Model):
    nombre = models.CharField(max_length=100, blank=False, null=False)
    descripcion = models.CharField(max_length=100, blank=False, null=False)
    stock = models.IntegerField(default=0)
    precio = models.FloatField(default=0)
    
