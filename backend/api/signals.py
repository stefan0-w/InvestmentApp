from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Portfolio

@receiver(post_save, sender=User)
def create_user_portfolio(sender, instance, created, **kwargs):
    """
    Automatycznie tworzy Portfolio za każdym razem, gdy nowy Użytkownik jest tworzony.
    """
    # Sprawdzamy, czy użytkownik został właśnie STWORZONY (a nie np. zaktualizowany)
    if created:
        # Tworzymy nowy obiekt Portfolio i łączymy go z nowym użytkownikiem
        Portfolio.objects.create(user=instance, name=f"{instance.first_name}'s Portfolio")