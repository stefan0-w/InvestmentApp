from django.contrib.auth.models import User
from rest_framework import generics, viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import Portfolio, Transaction, HistoricalPortfolioValue
from .serializers import UserSerializer, TransactionSerializer, PortfolioSerializer, HistoricalValueSerializer

# Importujemy logikę z warstwy serwisowej
# (Zakładamy, że ten plik istnieje, zgodnie z naszymi ustaleniami)
from .services.market_data_services import search_finnhub_assets, get_finnhub_quote

# --- WIDOKI ZWIĄZANE Z UŻYTKOWNIKIEM I PORTFELEM ---

class CreateUserView(generics.CreateAPIView):
    """
    Ten widok pozostaje bez zmian. Służy do rejestracji nowych użytkowników.
    Sygnał Django w tle automatycznie stworzy dla nich portfel.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class PortfolioDetailView(generics.RetrieveAPIView):
    """
    NOWY, UPROSZCZONY WIDOK. Zawsze zwraca JEDEN portfel należący do zalogowanego użytkownika.
    Zastępuje cały skomplikowany `PortfolioViewSet`.
    """
    serializer_class = PortfolioSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Ta metoda jest nadpisana, aby zawsze zwracać portfel
        # powiązany z zalogowanym użytkownikiem.
        return self.request.user.portfolio


# --- WIDOKI ZWIĄZANE Z TRANSAKCJAMI I AKTYWAMI ---

class TransactionViewSet(viewsets.ModelViewSet):
    """
    ZNACZNIE UPROSZCZONY TransactionViewSet.
    Backend sam dba o przypisanie transakcji do portfela użytkownika.
    """
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """

        Zwraca transakcje tylko dla JEDYNEGO portfela należącego do użytkownika.
        """
        user_portfolio = self.request.user.portfolio
        return Transaction.objects.filter(portfolio=user_portfolio)

    def perform_create(self, serializer):
        """
        Automatycznie przypisuje tworzoną transakcję do portfela zalogowanego użytkownika.
        Frontend nie musi już wysyłać `portfolioId`.
        """
        user_portfolio = self.request.user.portfolio
        serializer.save(portfolio=user_portfolio)


# --- WIDOKI DO KOMUNIKACJI Z ZEWNĘTRZNYM API ---

class SearchAssetsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get("q")
        if not query:
            return Response({"error": "Missing query parameter ?q="}, status=status.HTTP_400_BAD_REQUEST)
        
        results = search_finnhub_assets(query)
        return Response(results)


class QuoteSymbolView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        symbol = request.query_params.get("symbol")
        if not symbol:
            return Response({"error": "Missing query parameter ?symbol="}, status=status.HTTP_400_BAD_REQUEST)
            
        price = get_finnhub_quote(symbol)
        return Response({"price": price})
    

class PortfolioHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        history = HistoricalPortfolioValue.objects.filter(
            portfolio=request.user.portfolio
        ).order_by('date')
        
        # Stwórz prosty serializer dla HistoricalPortfolioValue
        serializer = HistoricalValueSerializer(history, many=True) 
        return Response(serializer.data)
    

from .services.csv_import_service import import_xtb_transactions

class ImportXTBView(APIView):
    def post(self, request):
        file = request.FILES.get("file")
        if file is None:
            return Response({"error": "Brak pliku"}, status=400)

        import_xtb_transactions(file, request.user)

        return Response({"status": "OK"})