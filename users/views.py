# users/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import UserProfile
from .serializers import UserSerializer
from .permissions import HasModulePermissionViewSet


class UserViewSet(viewsets.ModelViewSet):
    """
    CRUD de usuarios con permisos dinámicos por módulo
    """

    queryset = User.objects.all().select_related('profile')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, HasModulePermissionViewSet]

    # 🔥 módulo que se valida
    module = "usuarios"

    def get_queryset(self):
        user = self.request.user

        # 🔐 si no es admin → solo se ve a sí mismo
        if (
            hasattr(user, 'profile') and
            user.profile.role != UserProfile.ROLE_ADMIN
        ):
            return User.objects.filter(id=user.id)

        return super().get_queryset()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        # 🔒 proteger Admin
        if (
            hasattr(instance, 'profile') and
            instance.profile.role == UserProfile.ROLE_ADMIN
        ):
            return Response(
                {"detail": "No se puede eliminar un usuario con rol Admin."},
                status=status.HTTP_403_FORBIDDEN
            )

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """
        Cambiar contraseña del usuario actual
        """

        user = request.user
        new_password = request.data.get("new_password")

        if not new_password:
            return Response(
                {"detail": "Debe proporcionar una nueva contraseña."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(new_password) < 8:
            return Response(
                {"detail": "La contraseña debe tener al menos 8 caracteres."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {"detail": "Contraseña actualizada correctamente."},
            status=status.HTTP_200_OK
        )


# ======================
# /me/
# ======================

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def me_view(request):
    user = request.user
    profile = user.profile

    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": profile.role,
        "status": profile.status,
    })