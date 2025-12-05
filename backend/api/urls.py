from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CreateUserView,
    PortfolioDetailView, 
    TransactionViewSet,
    SearchAssetsView,
    QuoteSymbolView,
    PortfolioHistoryView,
    ImportXTBView,
    InvestorProfileView
)
router = DefaultRouter()
router.register(r'transactions', TransactionViewSet, basename='transaction')

urlpatterns = [
    # Endpoint do rejestracji użytkownika
    path('user/register/', CreateUserView.as_view(), name='register'),

    # Endpoint do pobierania JEDYNEGO portfela zalogowanego użytkownika
    path('portfolio/', PortfolioDetailView.as_view(), name='portfolio-detail'),
    path('portfolio/history/', PortfolioHistoryView.as_view(), name='portfolio-history'),
    path('import-xtb/', ImportXTBView.as_view(), name='import-xtb'),
    # Endpointy do komunikacji z zewnętrznym API
    path('assets/search/', SearchAssetsView.as_view(), name='search-assets'),
    path('assets/quote/', QuoteSymbolView.as_view(), name='quote-symbol'),
    
    path('advisor/save-profile/', InvestorProfileView.as_view(), name='save_profile'),

    # Dołączamy URL-e wygenerowane przez router (dla /transactions/)
    path('', include(router.urls)),
]

