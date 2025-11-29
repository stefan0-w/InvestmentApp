from ..models import Transaction
from ..services.market_data_services import get_finnhub_quote
from decimal import Decimal, DivisionByZero # Importuj DivisionByZero
from concurrent.futures import ThreadPoolExecutor

def calculate_portfolio_details(portfolio):

    # POPRAWKA 1: Sortuj transakcje chronologicznie!
    transactions = portfolio.transactions.order_by('transaction_date')

    holdings = {}
    total_realized_gain = Decimal('0.00') # Do śledzenia zrealizowanego zysku

    for t in transactions:
        current_symbol = t.asset.symbol
        if current_symbol not in holdings:
            # SUGESTIA 1: Usunięto niepotrzebne 'price'
            holdings[current_symbol] = {
                'quantity': Decimal('0'), 
                'asset': t.asset, 
                'total_cost_basis': Decimal('0')
            }

        holding_data = holdings[current_symbol] # Dla czytelności

        if t.transaction_type == 'BUY':
            cost_of_this_buy = t.quantity * t.price
            holding_data['total_cost_basis'] += cost_of_this_buy
            holding_data['quantity'] += t.quantity

        elif t.transaction_type == 'SELL':
            if holding_data['quantity'] > 0:
                try:
                    # try-except na wypadek, gdyby quantity było 0 (choć if powinien wystarczyć)
                    average_cost_before_sale = holding_data['total_cost_basis'] / holding_data['quantity']
                except DivisionByZero:
                    average_cost_before_sale = Decimal('0') # Lub inna obsługa błędu

                cost_removed = t.quantity * average_cost_before_sale
                holding_data['total_cost_basis'] -= cost_removed
                holding_data['quantity'] -= t.quantity

                # Obliczanie zrealizowanego zysku dla tej transakcji
                realized_gain_for_this_sale = (t.price - average_cost_before_sale) * t.quantity
                total_realized_gain += realized_gain_for_this_sale

            else:
                # Opcjonalnie: Obsłuż sytuację sprzedaży, gdy nie ma akcji (może logowanie błędu?)
                pass

    total_value = Decimal('0.00')
    assets_summary = []
    type_allocation = {}

    # 1. Zbierz wszystkie symbole, których ceny potrzebujesz
    symbols_to_fetch = [
        symbol for symbol, data in holdings.items() if data['quantity'] > 0
    ]
    
    price_map = {} # Słownik do przechowywania wyników {symbol: price_data}

    # 2. Użyj ThreadPoolExecutor do pobrania wszystkich cen równolegle
    # To wykona wszystkie wywołania API w tym samym czasie
    with ThreadPoolExecutor(max_workers=10) as executor:
        # map() zachowuje kolejność, więc łączymy symbole z wynikami
        # Używamy lambda, aby przekazać symbol do get_finnhub_quote
        results = executor.map(get_finnhub_quote, symbols_to_fetch)
        
        # Tworzymy mapę {symbol: wynik}
        price_map = dict(zip(symbols_to_fetch, results))

    for symbol, data in holdings.items():
        # Przetwarzaj tylko te aktywa, które faktycznie są w portfelu
        if data['quantity'] > 0:
            try:
                # SUGESTIA 2: Oblicz i zapisz średnią cenę zakupu
                average_cost = data['total_cost_basis'] / data['quantity']
            except DivisionByZero:
                average_cost = Decimal('0') 
            
            # POPRAWKA 2: Bezpieczne pobieranie ceny z API
            price_data = price_map.get(symbol) 
            current_price_float = price_data['c'] if price_data is not None else 0.0 # Użyj 0.0 jeśli API zawiedzie
            current_price = Decimal(str(current_price_float))

            current_value = data['quantity'] * current_price
            total_value += current_value
            
            unrealized_gain = (current_price - average_cost) * data['quantity']

            asset_type = data['asset'].type # Zakładając, że to pole istnieje
            if asset_type not in type_allocation:
                type_allocation[asset_type] = Decimal('0.00')
            type_allocation[asset_type] += current_value

            assets_summary.append({
                'symbol': symbol,
                'name': data['asset'].name,
                'type': data['asset'].type,
                'quantity': data['quantity'],
                'average_cost': average_cost, # Dodano
                'current_price': current_price,
                'current_value': current_value,
                'unrealized_gain': unrealized_gain, # Dodano
            })

    total_portfolio_value = total_value # To jest 'total_value' z Twojego obecnego kodu
    
    allocation_data_for_chart = []
    for asset_type, value in type_allocation.items():
        percentage = (value / total_portfolio_value * Decimal('100')) if total_portfolio_value > 0 else Decimal('0')
        allocation_data_for_chart.append({
            'name': asset_type,
            'value': float(value), # recharts często preferuje float
            'percentage': float(percentage)
        })
    # Zwróć też zrealizowany zysk
    return {
        "assets_summary": assets_summary,
        "total_value": total_value,
        "total_realized_gain": total_realized_gain,
        "type_allocation": allocation_data_for_chart, 
    }