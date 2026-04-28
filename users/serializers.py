from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

ALLOWED_ROLES = ['Admin', 'Vendedor', 'Almacen', 'Comprador']
ALLOWED_STATUS = ['Activo', 'Inactivo']

class UserSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(source='profile.phone', allow_blank=True, required=False)
    role = serializers.ChoiceField(source='profile.role', choices=ALLOWED_ROLES, required=True)
    status = serializers.ChoiceField(source='profile.status', choices=ALLOWED_STATUS, required=True)
    city = serializers.CharField(source='profile.city', allow_blank=True, required=False)
    address = serializers.CharField(source='profile.address', allow_blank=True, required=False)
    password = serializers.CharField(write_only=True, required=False, min_length=8)
    username = serializers.CharField(required=True)  # 🔥 username ahora es obligatorio

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'password', 'phone', 'role', 'status', 'city', 'address'
        ]

    # --- Validaciones ---
    def validate_username(self, value):
        if not value:
            raise serializers.ValidationError("El nombre de usuario es obligatorio.")
        if ' ' in value:
            raise serializers.ValidationError("El nombre de usuario no puede contener espacios.")
        # Si está creando (no tiene instancia)
        if self.instance is None and User.objects.filter(username=value).exists():
            raise serializers.ValidationError("El nombre de usuario ya existe.")
        # Si está actualizando y el username pertenece a otro usuario
        if self.instance and User.objects.filter(username=value).exclude(id=self.instance.id).exists():
            raise serializers.ValidationError("El nombre de usuario ya está en uso.")
        return value

    def validate_email(self, value):
        if not value or "@" not in value:
            raise serializers.ValidationError("Debe ingresar un correo válido.")
        if self.instance is None and User.objects.filter(email=value).exists():
            raise serializers.ValidationError("El correo ya está registrado.")
        if self.instance and User.objects.filter(email=value).exclude(id=self.instance.id).exists():
            raise serializers.ValidationError("El correo ya está en uso.")
        return value

    def validate_role(self, value):
        if value not in ALLOWED_ROLES:
            raise serializers.ValidationError(f"El rol debe ser uno de: {', '.join(ALLOWED_ROLES)}.")
        return value

    def validate_status(self, value):
        if value not in ALLOWED_STATUS:
            raise serializers.ValidationError(f"El estado debe ser uno de: {', '.join(ALLOWED_STATUS)}.")
        return value

    # --- Crear usuario (password obligatorio) ---
    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})
        password = validated_data.pop('password', None)

        if not password:
            raise serializers.ValidationError({"password": "La contraseña es obligatoria al crear un usuario."})
        if not validated_data.get('username'):
            raise serializers.ValidationError({"username": "El nombre de usuario es obligatorio."})

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        UserProfile.objects.create(
            user=user,
            phone=profile_data.get('phone', ''),
            role=profile_data.get('role', 'Comprador'),
            status=profile_data.get('status', 'Activo'),
            city=profile_data.get('city', ''),
            address=profile_data.get('address', '')
        )
        return user

    # --- Actualizar usuario (password opcional) ---
    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        password = validated_data.pop('password', None)

        # 🔒 username siempre obligatorio
        username = validated_data.get('username')
        if not username:
            raise serializers.ValidationError({"username": "El nombre de usuario es obligatorio."})

        instance.username = username
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)

        if password:
            instance.set_password(password)

        instance.save()

        profile = instance.profile
        profile.phone = profile_data.get('phone', profile.phone)
        profile.role = profile_data.get('role', profile.role)
        profile.status = profile_data.get('status', profile.status)
        profile.city = profile_data.get('city', profile.city)
        profile.address = profile_data.get('address', profile.address)
        profile.save()

        return instance
