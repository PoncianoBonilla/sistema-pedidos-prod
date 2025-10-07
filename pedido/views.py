from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Pedido
from .serializers import PedidoSerializer

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"mensaje": "Pedido guardado exitosamente", "pedido": serializer.data},
            status=status.HTTP_201_CREATED
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(
            {"mensaje": "Pedido actualizado exitosamente", "pedido": serializer.data},
            status=status.HTTP_200_OK
        )
