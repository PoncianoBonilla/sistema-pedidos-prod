# users/models.py
from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('Admin', 'Administrador'),
        ('Vendedor', 'Vendedor'),
        ('Almacen', 'Almacén'),
        ('Comprador', 'Comprador'),
    ]

    STATUS_CHOICES = [
        ('Activo', 'Activo'),
        ('Inactivo', 'Inactivo'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Comprador')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Activo')
    city = models.CharField(max_length=50, blank=True, null=True)
    address = models.CharField(max_length=150, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.role} - {self.status}"
