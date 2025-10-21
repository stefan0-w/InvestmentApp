from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Asset, Transaction, Portfolio

# --- Serializery Użytkownika i Aktywów (z drobnymi poprawkami) ---

class UserSerializer(serializers.ModelSerializer):
    """
    Ulepszony UserSerializer bez walidacji hasła (to rola frontendu)
    i z bezpiecznym tworzeniem użytkownika.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'read_only': True}
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
    type = serializers.CharField(max_length=10)


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
        read_only_fields = ['id', 'transaction_date', 'asset']

    def create(self, validated_data):
        asset_data = validated_data.pop('asset_data')
        symbol = asset_data.get('symbol').upper()

        asset, created = Asset.objects.get_or_create(
            symbol=symbol,
            defaults={
                'name': asset_data.get('name'),
                'type': asset_data.get('type')
            }
        )
        # Tworzymy transakcję bez informacji o portfelu.
        # Widok doda portfel użytkownika tuż przed zapisem.
        transaction = Transaction.objects.create(asset=asset, **validated_data)
        return transaction


class PortfolioSerializer(serializers.ModelSerializer):
    """
    JEDYNY serializer dla portfela. Pokazuje wszystko: dane, podsumowanie i transakcje.
    Zastępuje `PortfolioDetailSerializer`.
    """
    # Zagnieżdżamy TransactionSerializer, aby pokazać wszystkie transakcje w portfelu
    transactions = TransactionSerializer(many=True, read_only=True)
    
    # Pola obliczane (tak jak wcześniej)
    total_value = serializers.SerializerMethodField()
    assets_summary = serializers.SerializerMethodField()

    class Meta:
        model = Portfolio
        fields = ['id', 'name', 'total_value', 'assets_summary', 'transactions']
    
    def get_total_value(self, portfolio_instance):
        # Tutaj w przyszłości będzie logika z serwisu
        # na razie możemy zwrócić prostą wartość
        return 0.00 

    def get_assets_summary(self, portfolio_instance):
        # Tutaj w przyszłości będzie logika z serwisu
        return []