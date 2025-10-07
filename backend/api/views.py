from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, viewsets, permissions
from .serializers import UserSerializer, TransactionSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Transaction

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Każdy user widzi tylko swoje transakcje
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # User przypisuje się automatycznie w serializerze
        serializer.save()

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings
import requests
from rest_framework import status

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_assets(request):
    query = request.query_params.get("q", "")
    if not query:
        return Response({"error": "Missing query parameter ?q="}, status=400)

    api_key = settings.FINNHUB_API_KEY
    # tu wymuszamy tylko US
    url = f"https://finnhub.io/api/v1/search?q={query}&exchange=US&token={api_key}"
    response = requests.get(url)

    if response.status_code != 200:
        return Response({"error": "Finnhub API error"}, status=response.status_code)

    results = response.json().get("result", [])

    # zwracamy tylko symbol i description
    return Response([
        {"symbol": r["symbol"], "description": r["description"]}
        for r in results if r.get("symbol")
    ])


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def quote_symbol(request):
    symbol = request.query_params.get("symbol")
    if not symbol:
        return Response({"error": "Missing query parameter ?symbol="}, status=400)
    

    api_key = settings.FINNHUB_API_KEY
    # tu wymuszamy tylko US
    url = f"https://finnhub.io/api/v1/quote?symbol={symbol}&token={api_key}"
    response = requests.get(url)

    if response.status_code != 200:
        return Response({"error": "Finnhub API error"}, status=response.status_code)

    result = response.json().get("c")

    return Response(result)
