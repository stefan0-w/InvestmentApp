import yfinance as yf
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from ...models import Portfolio, Transaction, HistoricalPortfolioValue
from decimal import Decimal
from datetime import date, timedelta
import pandas as pd  # Upewnij się, że ten import jest na górze

class Command(BaseCommand):
    help = 'Oblicza i zapisuje historyczne wartości portfeli'

    def handle(self, *args, **options):
        all_portfolios = Portfolio.objects.all()

        for portfolio in all_portfolios:
            self.stdout.write(f"Przetwarzanie portfela dla {portfolio.user.username}...")
            
            transactions = portfolio.transactions.order_by('transaction_date')
            if not transactions.exists():
                self.stdout.write(f"Portfel {portfolio.user.username} jest pusty, pomijam.")
                continue

            start_date = transactions.first().transaction_date.date()
            today = date.today()

            symbols = list(transactions.values_list('asset__symbol', flat=True).distinct())
            if not symbols:
                continue

            try:
                # Dodajemy 1 dzień do 'end', aby na pewno pobrać dane z 'today' (jeśli są)
                data = yf.download(symbols, start=start_date, end=today + timedelta(days=1), auto_adjust=True)
                
                if data.empty:
                    self.stderr.write(f"Brak danych z yfinance dla symboli: {symbols}")
                    continue
                    
                prices_df = data['Close']
                
                # === KLUCZOWA POPRAWKA: Normalizacja indeksu ===
                
                # 1. Sprawdzamy, czy indeks jest typu DatetimeIndex (co powinien być)
                if isinstance(prices_df.index, pd.DatetimeIndex):
                    # .normalize() usuwa czas (ustawia na 00:00) i strefę czasową
                    # To jest kluczowe, aby dopasować do 'full_date_range'
                    prices_df.index = prices_df.index.normalize() 
                
                # 2. Stwórz pełny zakres dat (już znormalizowany)
                full_date_range = pd.date_range(start=start_date, end=today, freq='D')
                
                # 3. Rozciągnij pobrane ceny na pełny zakres dat
                if isinstance(prices_df, pd.Series):
                    prices_df = prices_df.reindex(full_date_range)
                else:
                    prices_df = prices_df.reindex(full_date_range)
                
                # 4. Wypełnij WSZYSTKIE luki (weekendy, święta, opóźnienia danych)
                prices_df = prices_df.ffill()
                
            except Exception as e:
                self.stderr.write(f"Błąd podczas pobierania danych z yfinance dla {symbols}: {e}")
                continue
                
            holdings = {} 
            current_date = start_date
            trans_idx = 0 

            while current_date <= today:
                
                while trans_idx < len(transactions) and transactions[trans_idx].transaction_date.date() == current_date:
                    t = transactions[trans_idx]
                    symbol = t.asset.symbol
                    
                    if symbol not in holdings:
                        holdings[symbol] = {'quantity': Decimal('0'), 'total_cost': Decimal('0')}
                    
                    if t.transaction_type == 'BUY':
                        holdings[symbol]['quantity'] += t.quantity
                        holdings[symbol]['total_cost'] += t.quantity * t.price
                    elif t.transaction_type == 'SELL':
                        holdings[symbol]['quantity'] -= t.quantity
                        # TODO: logika kosztu sprzedaży
                    
                    trans_idx += 1
                
                total_value_today = Decimal('0')
                total_cost_today = Decimal('0')
                
                lookup_date = pd.Timestamp(current_date)

                for symbol, data_dict in holdings.items():
                    if data_dict['quantity'] > 0:
                        total_cost_today += data_dict['total_cost']
                        try:
                            if isinstance(prices_df, pd.Series):
                                # Jeśli jest tylko 1 symbol, prices_df jest serią
                                price_today_float = prices_df.get(lookup_date)
                            else:
                                # Jeśli jest wiele symboli, jest to DataFrame
                                price_today_float = prices_df[symbol].get(lookup_date)

                            if price_today_float is not None and not pd.isna(price_today_float):
                                price_today = Decimal(str(price_today_float))
                                total_value_today += data_dict['quantity'] * price_today
                            
                        except (KeyError, TypeError, ValueError):
                            pass 

                profit_loss_today = total_value_today - total_cost_today

                HistoricalPortfolioValue.objects.update_or_create(
                    portfolio=portfolio,
                    date=current_date,
                    defaults={'value': total_value_today, 'profit_loss': profit_loss_today}
                )
                
                current_date += timedelta(days=1) 

            self.stdout.write(self.style.SUCCESS(f"Zakończono dla {portfolio.user.username}"))