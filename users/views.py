from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import UserProfile
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    """
    CRUD completo de usuarios con control de roles.
    - Solo Admin puede listar, crear, actualizar o eliminar usuarios.
    - No se pueden eliminar usuarios con rol 'Admin'.
    - Cambio de contraseña sin requerir la actual.
    """
    queryset = User.objects.all().select_related('profile')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['list', 'create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'profile') and user.profile.role != 'Admin':
            return User.objects.filter(id=user.id)
        return super().get_queryset()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if hasattr(instance, 'profile') and instance.profile.role == 'Admin':
            return Response(
                {"detail": "No se puede eliminar un usuario con rol Admin."},
                status=status.HTTP_403_FORBIDDEN
            )
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """
        Cambiar contraseña del usuario actual sin pedir la actual.
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
        return Response({"detail": "Contraseña actualizada correctamente."}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def me_view(request):
    """ Devuelve los datos del usuario autenticado """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
