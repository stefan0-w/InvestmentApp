from ..models import Transaction
from ..services.market_data_services import get_finnhub_quote
from decimal import Decimal, DivisionByZero # Importuj DivisionByZero

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
                    # Użyj try-except na wypadek, gdyby quantity było 0 (choć if powinien wystarczyć)
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

    for symbol, data in holdings.items():
        # Przetwarzaj tylko te aktywa, które faktycznie są w portfelu
        if data['quantity'] > 0:
            try:
                # SUGESTIA 2: Oblicz i zapisz średnią cenę zakupu
                average_cost = data['total_cost_basis'] / data['quantity']
            except DivisionByZero:
                average_cost = Decimal('0') 
            
            # POPRAWKA 2: Bezpieczne pobieranie ceny z API
            price_data = get_finnhub_quote(symbol) 
            current_price_float = price_data['c'] if price_data is not None else 0.0 # Użyj 0.0 jeśli API zawiedzie
            current_price = Decimal(str(current_price_float))

            current_value = data['quantity'] * current_price
            total_value += current_value
            
            unrealized_gain = (current_price - average_cost) * data['quantity']

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

    # Zwróć też zrealizowany zysk
    return {
        "assets_summary": assets_summary,
        "total_value": total_value,
        "total_realized_gain": total_realized_gain 
    }