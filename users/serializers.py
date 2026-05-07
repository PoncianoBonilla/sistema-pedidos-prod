# users/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile


class UserSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(source='profile.phone', allow_blank=True, required=False)
    role = serializers.ChoiceField(source='profile.role', choices=UserProfile.ROLE_CHOICES)
    status = serializers.ChoiceField(source='profile.status', choices=UserProfile.STATUS_CHOICES)
    city = serializers.CharField(source='profile.city', allow_blank=True, required=False)
    address = serializers.CharField(source='profile.address', allow_blank=True, required=False)

    password = serializers.CharField(write_only=True, required=False, min_length=8)
    username = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'password', 'phone', 'role', 'status', 'city', 'address'
        ]

    # ======================
    # VALIDACIONES
    # ======================
    def validate_username(self, value):
        if ' ' in value:
            raise serializers.ValidationError("El nombre de usuario no puede contener espacios.")

        if self.instance is None:
            if User.objects.filter(username=value).exists():
                raise serializers.ValidationError("El nombre de usuario ya existe.")
        else:
            if User.objects.filter(username=value).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError("El nombre de usuario ya está en uso.")

        return value

    def validate_email(self, value):
        if value and "@" not in value:
            raise serializers.ValidationError("Debe ingresar un correo válido.")

        if self.instance is None:
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("El correo ya está registrado.")
        else:
            if User.objects.filter(email=value).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError("El correo ya está en uso.")

        return value

    # ======================
    # CREATE
    # ======================
    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})
        password = validated_data.pop('password', None)

        if not password:
            raise serializers.ValidationError({"password": "La contraseña es obligatoria."})

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        # 🔥 NO creamos profile → lo hace el signal
        profile = user.profile

        # actualizar datos del profile
        profile.phone = profile_data.get('phone', '')
        profile.role = profile_data.get('role', UserProfile.ROLE_COMPRADOR)
        profile.status = profile_data.get('status', UserProfile.STATUS_ACTIVO)
        profile.city = profile_data.get('city', '')
        profile.address = profile_data.get('address', '')
        profile.save()

        return user

    # ======================
    # UPDATE
    # ======================
    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        password = validated_data.pop('password', None)

        instance.username = validated_data.get('username', instance.username)
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