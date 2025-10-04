from django.db import models

# Create your models here.
class Cliente(models.Model):
    nombre = models.CharField(max_length=100, blank=False, null=False)
    apeliidos = models.CharField(max_length=100, blank=False, null=False)
    