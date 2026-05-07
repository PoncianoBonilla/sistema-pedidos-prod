# users/permissions_map.py

from .models import UserProfile

PERMISSIONS = {
    UserProfile.ROLE_ADMIN: {
        "usuarios": ["view", "create", "update", "delete"],
    },
    UserProfile.ROLE_VENDEDOR: {
        "usuarios": ["view"],  # solo puede verse a sí mismo
    },
    UserProfile.ROLE_ALMACEN: {},
    UserProfile.ROLE_COMPRADOR: {},
}