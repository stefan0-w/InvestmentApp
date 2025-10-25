from django.conf import settings
import requests

def search_finnhub_assets(query: str):
    """
    Wyszukuje aktywa w API Finnhub.
    """
    # 1. Pobierz swój klucz API ze zmiennych środowiskowych
    #    To o wiele bezpieczniejsze niż wklejanie go do kodu!
    api_key = settings.FINNHUB_API_KEY 

    if not api_key:
        print("BŁĄD KRYTYCZNY: Brak klucza FINNHUB_API_KEY w zmiennych środowiskowych.")
        # Zwróć błąd, który backend przekaże do frontendu
        return {"error": "Server configuration error: Missing API key."}

    # 2. Zdefiniuj URL i parametry zapytania
    base_url = "https://finnhub.io/api/v1/search"
    params = {
        'q': query,
        'token': api_key
    }

    # 3. Wykonaj zapytanie GET do Finnhub
    try:
        response = requests.get(base_url, params=params)
        
        # Sprawdź, czy zapytanie się powiodło (np. status 200)
        response.raise_for_status() 
        
        # 4. Zwróć dane JSON (Finnhub zwraca obiekt {"count": ..., "result": [...]})
        return response.json()

    except requests.exceptions.HTTPError as http_err:
        print(f"Błąd HTTP: {http_err}")
        return {"error": f"Finnhub API error: {http_err.response.status_code}"}
    except requests.exceptions.RequestException as err:
        # Ogólny błąd (np. brak połączenia)
        print(f"Błąd Requests: {err}")
        return {"error": "Could not connect to Finnhub API."}
    except Exception as e:
        print(f"Niespodziewany błąd: {e}")
        return {"error": "An unexpected server error occurred."}

def get_finnhub_quote(symbol: str):
    """
    Pobiera aktualną cenę dla danego symbolu.
    TODO: Zaimplementować logikę.
    """
    pass