from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Asset, Transaction

class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'password2', 'first_name', 'last_name']
        read_only_fields = ['id']
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Hasła nie są takie same."})
        return attrs

    def create(self, validated_data):
        validated_data['username'] = validated_data['email']
        validated_data.pop('password2')  # usuwamy dodatkowe pole
        user = User.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.password = validated_data.get('password', instance.password)
        instance.save()
        return instance
    

class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = "__all__"


class TransactionSerializer(serializers.ModelSerializer):
    asset = serializers.CharField()  # przyjmujemy symbol z frontend

    class Meta:
        model = Transaction
        fields = ['id', 'asset', 'quantity', 'price', 'type', 'date']
        read_only_fields = ['id', 'date']

    def create(self, validated_data):
        user = self.context['request'].user
        symbol = validated_data.pop('asset').upper()

        # sprawdzamy czy Asset istnieje
        asset, created = Asset.objects.get_or_create(
            symbol=symbol,
            defaults={'description': symbol}  # opcjonalnie później możesz dodać pełną nazwę z Finnhub
        )

        transaction = Transaction.objects.create(
            user=user,
            asset=asset,
            **validated_data
        )
        return transaction
