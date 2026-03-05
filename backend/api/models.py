from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Asset(models.Model):

  ASSET_TYPES = [
        ('STOCK', 'Stock'),
        ('CRYPTO', 'Cryptocurrency'),
        ('ETF', 'ETF'),
    ]

  symbol = models.CharField(max_length=10, unique=True)
  name = models.CharField(max_length=100)
  type = models.CharField(max_length=10, choices=ASSET_TYPES, default='STOCK')

  def __str__(self):
    return self.name


class Portfolio(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='portfolio')
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.user.username})"


class Transaction(models.Model):
  TRANSACTION_TYPE = [
        ('BUY', 'Buy'),
        ('SELL', 'Sell'),
    ]
  
  portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='transactions')
  asset = models.ForeignKey(Asset, on_delete=models.PROTECT)
  quantity = models.DecimalField(max_digits=18, decimal_places=8)
  price = models.DecimalField(max_digits=18, decimal_places=8)
  transaction_type = models.CharField(max_length=4, choices=TRANSACTION_TYPE)
  transaction_date = models.DateTimeField()
  broker = models.CharField(max_length=50, null=True, blank=True)
  source = models.CharField(max_length=20, default="manual") 

  def __str__(self): 
    return f"{self.portfolio.user.username} - {self.transaction_type} {self.asset.symbol}"


class HistoricalPortfolioValue(models.Model):
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='history')
    date = models.DateField()
    value = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    profit_loss = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    class Meta:
        # Zapewnia, że masz tylko jeden wpis na portfel na dany dzień
        unique_together = ('portfolio', 'date')
        ordering = ['date']

class InvestorProfile(models.Model):
    PROFILE_CHOICES = [
        ('SAFE', 'Capital Protection'),
        ('CONSERVATIVE', 'Conservative'),
        ('BALANCED', 'Balanced'),
        ('DYNAMIC', 'Dynamic'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='investor_profile')
    profile_type = models.CharField(max_length=20, choices=PROFILE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.profile_type}"
    

class JournalEntry(models.Model):
    CATEGORY_CHOICES = [
        ('BUY', 'Buy'),
        ('SELL', 'Sell'),
        ('NOTE', 'Note'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='journal_entries')
    date = models.DateField()
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default='NOTE')
    symbol = models.CharField(max_length=10, blank=True, null=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.date} - {self.category} - {self.symbol}"