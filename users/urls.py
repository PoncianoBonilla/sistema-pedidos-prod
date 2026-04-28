from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, me_view
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    # JWT
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Usuario actual
    path('me/', me_view, name='me'),

    # Endpoints CRUD + custom actions (change_password) del ViewSet
    path('', include(router.urls)),
]
