from django.contrib import admin
from django.urls import path, include, re_path
from django.shortcuts import render

# 👇 IMPORTANTE para static
from django.conf import settings
from django.conf.urls.static import static


def index(request):
    return render(request, 'index.html')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/clientes/', include('cliente.urls')),
    path('api/productos/', include('producto.urls')),
    path('api/pedidos/', include('pedido.urls')),

    # 👇 MUY IMPORTANTE: excluir static correctamente
    re_path(r'^(?!static/).*$', index),
]

# 👇 ESTO ES CLAVE PARA QUE FUNCIONEN LOS STATIC
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)