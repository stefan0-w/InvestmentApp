from django.conf import settings
import requests
from django.core.cache import cache

api_key = settings.FINNHUB_API_KEY 

def search_finnhub_assets(query: str):
    if not api_key:
        print("Critical Error: Missing API key in env variables.")
        return {"error": "Server configuration error: Missing API key."}

    base_url = "https://finnhub.io/api/v1/search"
    params = {
        'q': query,
        'token': api_key
    }

    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status() 
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        print(f"Błąd HTTP: {http_err}")
        return {}
    except requests.exceptions.RequestException as err:
        # Ogólny błąd (np. brak połączenia)
        print(f"Błąd Requests: {err}")
        return {"error": "Could not connect to Finnhub API."}
    except Exception as e:
        print(f"Niespodziewany błąd: {e}")
        return {"error": "An unexpected server error occurred."}

def get_finnhub_quote(symbol: str):
    cache_key = f"finnhub_price_{symbol}" 
    cached_data = cache.get(cache_key)
    if cached_data:
        return cached_data

    if not api_key:
        print("Critical Error: Missing API key in env variables")
        return {"error": "Server configuration error: Missing API key."}

    base_url = "https://finnhub.io/api/v1/quote"
    params = {
        'symbol': symbol,
        'token': api_key
    }

    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status() 
        data = response.json()
        
        if data and data.get('c') != 0:
            cache.set(cache_key, data, timeout=60) 
            return data
        else:
            print(f"Otrzymano puste dane z Finnhub dla {symbol}, nie cache'uję.")
            return data
    
    except requests.exceptions.HTTPError as http_err:
        print(f"Błąd HTTP: {http_err}")
        return {"error": f"Finnhub API error: {http_err.response.status_code}"}
    except requests.exceptions.RequestException as err:
        print(f"Błąd Requests: {err}")
        return {"error": "Could not connect to Finnhub API."}
    except Exception as e:
        print(f"Niespodziewany błąd: {e}")
        return {"error": "An unexpected server error occurred."}  
    