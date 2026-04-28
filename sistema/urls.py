# project/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/clientes/', include('cliente.urls')),
    path('api/productos/', include('producto.urls')),
    path('api/pedidos/', include('pedido.urls')),
]
