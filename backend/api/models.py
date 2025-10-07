from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Asset(models.Model):
  symbol = models.CharField(max_length=20, unique=True)
  description = models.CharField(max_length=100)

  def __str__(self):
    return f"{self.symbol} : {self.description}"

class Transaction(models.Model):
  TRANSACTION_TYPE = [
        ('BUY', 'Buy'),
        ('SELL', 'Sell'),
    ]
  
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
  quantity = models.DecimalField(max_digits=10, decimal_places=2)
  price = models.DecimalField(max_digits=10, decimal_places=2)
  type = models.CharField(max_length=4, choices=TRANSACTION_TYPE)
  date = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return f"{self.user} {self.type} {self.asset.symbol} {self.quantity} {self.price} {self.date}"
