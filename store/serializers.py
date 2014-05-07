from django.db.models import Sum
from rest_framework import serializers

from store.models import Beer, Brewery, Style


class BeerListSerializer(serializers.ModelSerializer):
    """For creating a list of all beers we carry."""
    stock = serializers.SerializerMethodField('get_current_stock')

    def __init__(self, qs, *args, **kwargs):
        # Perform some database optimization
        if kwargs.get('many', False):
            qs = qs.prefetch_related('supplies')
        super(BeerListSerializer, self).__init__(qs, *args, **kwargs)

    def get_current_stock(self, data):
        sum = 0
        for supply in data.supplies.all():
            sum += supply.quantity
        return sum

    class Meta:
        model = Beer


class BrewerySerializer(serializers.ModelSerializer):
    """For creating a list of breweries whose beer."""
    class Meta:
        model = Brewery


class BeerStyleSerializer(serializers.ModelSerializer):
    """For creating a list of all beer styles we carry."""
    class Meta:
        model = Style
