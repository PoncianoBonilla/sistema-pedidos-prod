from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('clientes/', include('cliente.urls')),   # API de clientes
    path('pedidos/', include('pedido.urls')),     # API de pedidos
    path('productos/', include('producto.urls')), # API de productos
]
