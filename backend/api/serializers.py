from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Asset, Transaction, Portfolio, HistoricalPortfolioValue, JournalEntry
from rest_framework.validators import UniqueValidator

# --- Serializery Użytkownika i Aktywów (z drobnymi poprawkami) ---

class UserSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(
        required=True,
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="Account with this email already exists"
            )
        ]
    )
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class AssetSerializer(serializers.ModelSerializer):
    """Ten serializer pozostaje bez zmian. Służy do wyświetlania danych o aktywach."""
    class Meta:
        model = Asset
        fields = ['symbol', 'name', 'type']

class AssetInputSerializer(serializers.Serializer):
    """Ten serializer również pozostaje bez zmian. Służy do przyjmowania danych o nowym aktywie."""
    symbol = serializers.CharField(max_length=10)
    name = serializers.CharField(max_length=100)
    type = serializers.CharField(max_length=20)


# --- GŁÓWNE ZMIANY TUTAJ ---

class TransactionSerializer(serializers.ModelSerializer):
    """
    ZNACZNIE UPROSZCZONY serializer transakcji.
    Nie przejmuje się już portfelem - to zadanie dla widoku.
    """
    # Pole do ODCZYTU: Pokazuje pełne dane assetu
    asset = AssetSerializer(read_only=True)
    
    # Pole do ZAPISU: Przyjmuje obiekt z danymi o nowym aktywie
    asset_data = AssetInputSerializer(write_only=True)

    class Meta:
        model = Transaction
        # Zniknęło pole 'portfolio'!
        fields = ['id', 'asset', 'asset_data', 'transaction_type', 'quantity', 'price', 'transaction_date']
        read_only_fields = ['id', 'asset']

    def create(self, validated_data):
        asset_data = validated_data.pop('asset_data')
        symbol = asset_data.get('symbol').upper()

        type_from_finnhub = asset_data.get('type')

        # 2. Zdefiniuj mapowanie
        #    Klucz = Co wysyła Finnhub, Wartość = Co jest w Twoim modelu
        TYPE_MAPPING = {
            'Common Stock': 'STOCK',
            'ETF': 'ETF',
            'Cryptocurrency': 'CRYPTO',
            # Możesz dodać więcej typów z Finnhub w przyszłości
            'ADR': 'STOCK', 
            'Preferred Stock': 'STOCK',
            'ETP' : 'ETF'
        }

        mapped_type = TYPE_MAPPING.get(type_from_finnhub, 'STOCK')

        asset, created = Asset.objects.get_or_create(
            symbol=symbol,
            defaults={
                'name': asset_data.get('name'),
                'type': mapped_type  # <--- Użyj nowej, zmapowanej zmiennej
            }
        )
        # Tworzymy transakcję bez informacji o portfelu.
        # Widok doda portfel użytkownika tuż przed zapisem.
        transaction = Transaction.objects.create(asset=asset, **validated_data)
        return transaction


from .services.portfolio_services import calculate_portfolio_details

class PortfolioSerializer(serializers.ModelSerializer):
    transactions = TransactionSerializer(many=True, read_only=True)
    total_value = serializers.SerializerMethodField()
    assets_summary = serializers.SerializerMethodField()
    type_allocation = serializers.SerializerMethodField()

    class Meta:
        model = Portfolio
        fields = ['id', 'name', 'total_value', 'assets_summary', 'transactions', 'type_allocation']
    
    def get_portfolio_details(self, portfolio_instance):
        """
        Pomocnicza metoda, aby obliczyć dane tylko raz i przechować je w kontekście.
        """
        if not hasattr(self, '_details_cache'):
            # Wywołaj serwis TYLKO RAZ
            self._details_cache = calculate_portfolio_details(portfolio_instance)
        return self._details_cache

    def get_total_value(self, portfolio_instance):
        """Pobiera całkowitą wartość z obliczonych danych."""
        details = self.get_portfolio_details(portfolio_instance)
        return details.get('total_value')

    def get_assets_summary(self, portfolio_instance):
        """Pobiera podsumowanie aktywów z obliczonych danych."""
        details = self.get_portfolio_details(portfolio_instance)
        return details.get('assets_summary')
    
    def get_type_allocation(self, portfolio_instance):
        """Pobiera dane alokacji z obliczonych detali."""
        details = self.get_portfolio_details(portfolio_instance) 
        return details.get('type_allocation', [])
    

class HistoricalValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoricalPortfolioValue
        fields = ['value', 'profit_loss', 'date']

from .models import InvestorProfile

class InvestorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvestorProfile
        fields = ['profile_type', 'updated_at']


class JournalEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry
        fields = ['id', 'date', 'category', 'symbol', 'content']