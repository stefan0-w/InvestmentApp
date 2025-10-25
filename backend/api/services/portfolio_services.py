from ..models import Transaction

def calculate_portfolio_details(portfolio):

  transactions = portfolio.transactions.all()

  holdings = {}

  for t in transactions:
    if t.asset.symbol not in holdings:
      holdings[t.asset.symbol] = {'quantity' : 0, 'asset' : t.asset, 'price' : t.price}

    if t.transaction_type == 'BUY':
            holdings[t.asset.symbol]['quantity'] += t.quantity
    elif t.transaction_type == 'SELL':
            holdings[t.asset.symbol]['quantity'] -= t.quantity  

  total_value = 0
  assets_summary = []

  for symbol, data in holdings.items():
    if data['quantity'] > 0:
        current_price = data['price'] #TUTAJ POTEM ZMIENIĆ NA POBIERANIE AKTUALNEJ CENY Z API
        current_value = data['quantity'] * current_price
        total_value += current_value
        
        assets_summary.append({
            'symbol': symbol,
            'name': data['asset'].name,
            'type': data['asset'].type,
            'quantity': data['quantity'],
            'current_price': current_price,
            'current_value': current_value
        })

  return({
      "assets_summary": assets_summary,
      "total_value" : total_value
  })