from django.db import models

# Create your models here.
class Cliente(models.Model):
    nombre = models.CharField(max_length=100, blank=False, null=False)
    apellidos = models.CharField(max_length=100, blank=False, null=False)
    def __str__(self):
        return f"{self.nombre} {self.apellidos}"