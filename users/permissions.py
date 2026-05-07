# users/permissions.py

from rest_framework.permissions import BasePermission
from .permissions_map import PERMISSIONS

ACTION_MAP = {
    "list": "view",
    "retrieve": "view",
    "create": "create",
    "update": "update",
    "partial_update": "update",
    "destroy": "delete",
}

class HasModulePermissionViewSet(BasePermission):
    def has_permission(self, request, view):
        user = request.user

        if not user.is_authenticated:
            return False

        # 🔒 bloquear inactivos
        if hasattr(user, "profile") and user.profile.status != "Activo":
            return False

        role = getattr(user.profile, "role", None)

        module = getattr(view, "module", None)
        action = ACTION_MAP.get(getattr(view, "action", None))

        if not module or not action:
            return False

        allowed = PERMISSIONS.get(role, {})
        return action in allowed.get(module, [])