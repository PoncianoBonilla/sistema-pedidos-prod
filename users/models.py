# users/models.py

from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):

    # ======================
    # ROLES
    # ======================
    ROLE_ADMIN = 'Admin'
    ROLE_VENDEDOR = 'Vendedor'
    ROLE_ALMACEN = 'Almacen'
    ROLE_COMPRADOR = 'Comprador'

    ROLE_CHOICES = [
        (ROLE_ADMIN, 'Administrador'),
        (ROLE_VENDEDOR, 'Vendedor'),
        (ROLE_ALMACEN, 'Almacén'),
        (ROLE_COMPRADOR, 'Comprador'),
    ]

    # ======================
    # ESTADO
    # ======================
    STATUS_ACTIVO = 'Activo'
    STATUS_INACTIVO = 'Inactivo'

    STATUS_CHOICES = [
        (STATUS_ACTIVO, 'Activo'),
        (STATUS_INACTIVO, 'Inactivo'),
    ]

    # ======================
    # RELACIÓN
    # ======================
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )

    # ======================
    # CAMPOS
    # ======================
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=ROLE_COMPRADOR
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default=STATUS_ACTIVO
    )
    city = models.CharField(max_length=50, blank=True)
    address = models.CharField(max_length=150, blank=True)

    # ======================
    # META
    # ======================
    class Meta:
        verbose_name = "Perfil de Usuario"
        verbose_name_plural = "Perfiles de Usuario"

    # ======================
    # REPRESENTACIÓN
    # ======================
    def __str__(self):
        return f"{self.user.username} ({self.role}) - {self.status}"