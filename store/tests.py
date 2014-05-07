import json

from django.core.urlresolvers import reverse
from django.db.models import Sum
from django.test import TestCase

from store.models import Beer, Brewery, Style, SupplyUnit
from store.serializers import BeerListSerializer

class BeerViewTests(TestCase):
    """Tests for the beer API"""
    fixtures = ['store-data']
    def test_returns_list(self):
        """Verify that the correct list of beers is returned"""
        expected = Beer.objects.all()
        response = self.client.get(reverse('BeerApi'))
        r = json.loads(response.content)
        # Make sure the right number of beers are returned
        self.assertEqual(
            expected.count(),
            len(r),
            'Did not return correct number of beers'
        )


class BreweriesViewTests(TestCase):
    """Tests for the breweries API"""
    fixtures = ['store-data']
    def test_returns_list(self):
        """
        Verify that the correct list of breweries is returned.
        Field data will be in the serializer tests.
        """
        expected = Brewery.objects.all()
        response = self.client.get(reverse('BreweryApi'))
        r = json.loads(response.content)
        # Make sure the right number of breweries are returned
        self.assertEqual(
            expected.count(),
            len(r),
            'Did not return correct number of breweries'
        )


class StylesViewTests(TestCase):
    """Tests for the styles API"""
    fixtures = ['store-data']
    def test_returns_list(self):
        """
        Verify that the correct list of styles is returned.
        Tests for correct fields will be in the serializer tests.
        """
        expected = Style.objects.all()
        response = self.client.get(reverse('BeerStyleApi'))
        r = json.loads(response.content)
        # Make sure the right number of beers are returned
        self.assertEqual(
            expected.count(),
            len(r),
            'Did not return correct number of styles'
        )


class BeerSerializerTests(TestCase):
    fixtures = ['store-data']
    def test_stock(self):
        """
        Check that the serializer returns the current stock of beer.
        """
        beer = Beer.objects.get(pk=1)
        # Calculate correct beer stock
        supplies = SupplyUnit.objects.filter(beer=beer)
        actual_stock = supplies.aggregate(Sum('quantity'))['quantity__sum']
        # Check that the serializers calculates the correct stock
        result = BeerListSerializer(beer).data
        self.assertEqual(
            result['stock'],
            actual_stock
        )

    def test_stock_num_queries(self):
        """
        Verify that the serializer uses the database responsibly.
        """
        beer = Beer.objects.all()
        def hit_db():
            result = BeerListSerializer(beer, many=True).data
        self.assertNumQueries(
            2,
            hit_db
        )
