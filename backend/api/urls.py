from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransactionViewSet, search_assets, quote_symbol

router = DefaultRouter()
router.register(r'transactions', TransactionViewSet, basename='transaction')

urlpatterns = [
    path("quote/", quote_symbol, name ="quote_symbol"),
    path("assets/search/", search_assets, name="search-assets"),
    path('', include(router.urls)),
]

