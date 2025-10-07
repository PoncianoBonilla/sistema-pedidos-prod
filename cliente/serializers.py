from rest_framework import serializers
from .models import Cliente

class ClienteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Cliente
        fields = ['id', 'nombre', 'apellidos']
        extra_kwargs = {
            'nombre': {'required': True, 'error_messages': {'required': 'El campo nombre es requerido'}},
            'apellidos': {'required': True, 'error_messages': {'required': 'El campo apellidos es requerido'}},
        }

