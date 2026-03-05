from ..models import Transaction
from ..services.market_data_services import get_finnhub_quote
from decimal import Decimal, DivisionByZero
from concurrent.futures import ThreadPoolExecutor

def calculate_portfolio_details(portfolio):
    transactions = portfolio.transactions.order_by('transaction_date')

    holdings = {}
    total_realized_gain = Decimal('0.00')

    for t in transactions:
        current_symbol = t.asset.symbol
        if current_symbol not in holdings:
            holdings[current_symbol] = {
                'quantity': Decimal('0'), 
                'asset': t.asset, 
                'total_cost_basis': Decimal('0')
            }

        holding_data = holdings[current_symbol]

        if t.transaction_type == 'BUY':
            cost_of_this_buy = t.quantity * t.price
            holding_data['total_cost_basis'] += cost_of_this_buy
            holding_data['quantity'] += t.quantity

        elif t.transaction_type == 'SELL':
            if holding_data['quantity'] > 0:
                try:
                    average_cost_before_sale = holding_data['total_cost_basis'] / holding_data['quantity']
                except DivisionByZero:
                    average_cost_before_sale = Decimal('0') #obsługa błędu

                cost_removed = t.quantity * average_cost_before_sale
                holding_data['total_cost_basis'] -= cost_removed
                holding_data['quantity'] -= t.quantity

                # obliczanie zrealizowanego zysku
                realized_gain_for_this_sale = (t.price - average_cost_before_sale) * t.quantity
                total_realized_gain += realized_gain_for_this_sale

            else:
                pass

    total_value = Decimal('0.00')
    assets_summary = []
    type_allocation = {}

    symbols_to_fetch = [
        symbol for symbol, data in holdings.items() if data['quantity'] > 0
    ]
    
    price_map = {}
    symbol_allocation = {}
    #pobieranie cen równolegle
    with ThreadPoolExecutor(max_workers=10) as executor:
        results = executor.map(get_finnhub_quote, symbols_to_fetch)
        
        price_map = dict(zip(symbols_to_fetch, results))

    for symbol, data in holdings.items():
        if data['quantity'] > 0:
            try:
                average_cost = data['total_cost_basis'] / data['quantity']
            except DivisionByZero:
                average_cost = Decimal('0') 
            

            price_data = price_map.get(symbol) 
            current_price_float = 0.0

            price_available = False
            if isinstance(price_data, dict):
                fetched_price = price_data.get('c', 0.0)
                
                if fetched_price > 0:
                    current_price_float = fetched_price
                    price_available = True
            
            current_price = Decimal(str(current_price_float))
            
            if price_available:
                current_value = data['quantity'] * current_price
                total_value += current_value 
                
                #do wykresu kołowego składu portfela
                symbol_allocation[symbol] = current_value

                asset_type = data['asset'].type
                if asset_type not in type_allocation:
                    type_allocation[asset_type] = Decimal('0.00')
                type_allocation[asset_type] += current_value

                unrealized_gain = (current_price - average_cost) * data['quantity']
                
            else:
                current_value = Decimal('0.00')
                unrealized_gain = Decimal('0.00')

            assets_summary.append({
                'symbol': symbol,
                'name': data['asset'].name,
                'type': data['asset'].type,
                'quantity': data['quantity'],
                'average_cost': average_cost,
                'current_price': current_price,
                'current_value': current_value,
                'unrealized_gain': unrealized_gain,
                'price_available': price_available,
            })

    total_portfolio_value = total_value
    
    allocation_data_for_chart = []
    for asset_type, value in type_allocation.items():
        percentage = (value / total_portfolio_value * Decimal('100')) if total_portfolio_value > 0 else Decimal('0')
        allocation_data_for_chart.append({
            'name': asset_type,
            'value': float(value),
            'percentage': float(percentage)
        })

    symbol_allocation_chart = []
    for symbol, value in symbol_allocation.items():
        percentage = (value / total_portfolio_value * Decimal('100')) if total_portfolio_value > 0 else Decimal('0')
        symbol_allocation_chart.append({
            "name": symbol,
            "value": float(value),
            "percentage": float(percentage)
        })

    return {
        "assets_summary": assets_summary,
        "total_value": total_value,
        "total_realized_gain": total_realized_gain,
        "type_allocation": allocation_data_for_chart, 
        "symbol_allocation": symbol_allocation_chart,
    }