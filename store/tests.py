import json

from django.core import mail
from django.core.urlresolvers import reverse
from django.db.models import Sum
from django.test import TestCase

from ert import settings
from store.models import Beer, Brewery, Style, SupplyUnit, Order, OrderItem
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


class OrdersApi(TestCase):
    """
    Test that the front-end can submit a post request with a new beer order.
    """
    fixtures = ['store-data']
    def setUp(self):
        self.url = reverse('OrderApi')
        self.dummy_order = {
            'order_data': {
                'company_name': 'Nuclear Power Plant',
                'email': 'homer@example.com',
                'f_name': 'Homer',
                'l_name': 'Simpson',
                'phone': '1-800-555-5555',
                'preferred_language': 'zh_TW',
                'shipping_address': '742 Evergreen Trc\nSpringfield NA 99999',
            },
            'order_items': [
                {
                    'beer': {'id': 1},
                    'quantity': 3
                }
            ]
        }

    def test_creates_order(self):
        response = self.client.post(self.url,
                                    json.dumps(self.dummy_order),
                                    content_type="application/json")
        r = json.loads(response.content)
        # Find the saved order instance
        order = Order.objects.get(pk=r['order_id'])
        self.assertEqual(
            order.company_name,
            self.dummy_order['order_data']['company_name']
        )
        self.assertEqual(
            order.status,
            order.PENDING,
        )
        self.assertEqual(
            order.preferred_language,
            'zh_TW'
        )

    def test_creates_order_items(self):
        response = self.client.post(self.url,
                                    json.dumps(self.dummy_order),
                                    content_type="application/json")
        r = json.loads(response.content)
        # Find the saved OrderItem instances
        saved_items = OrderItem.objects.filter(order=r['order_id'])
        self.assertEqual(
            saved_items.count(),
            len(self.dummy_order['order_items'])
        )

    def test_rejects_empty_order(self):
        empty_order = {
            'order_data': self.dummy_order['order_data'],
            'order_items': []
        }
        response = self.client.post(self.url,
                                    json.dumps(empty_order),
                                    content_type="application/json")
        r = json.loads(response.content)
        self.assertEqual(
            response.status_code,
            400,
        )
        self.assertEqual(
            r['reason'],
            'order_items cannot be empty'
        )
        self.assertEqual(
            Order.objects.all().count(),
            0
        )


class OrderModel(TestCase):
    fixtures = ['store-data', 'order-test-data']
    def setUp(self):
        self.order = Order.objects.get(pk=1)

    def test_sends_admin_email(self):
        with self.assertTemplateUsed('email/order-notification.txt'):
            self.order.notify_ert()
        self.assertEqual(
            len(mail.outbox),
            1,
            'No messages sent'
        )
        # Check that the right fields are sent
        msg = mail.outbox[0]
        self.assertIn(
            self.order.f_name,
            msg.body,
        )
        self.assertIn(
            self.order.l_name,
            msg.body,
        )

    def test_sends_confirmation_email(self):
        with self.assertTemplateUsed('email/order-confirmation.txt'):
            self.order.send_confirmation()
        self.assertEqual(
            len(mail.outbox),
            1,
            'No messages sent'
        )
        # Check email sender, recipient, etc
        msg = mail.outbox[0]
        self.assertEqual(
            msg.recipients(),
            [self.order.from_email()]
        )
        self.assertEqual(
            msg.from_email,
            settings.CONTACT_EMAIL
        )
        self.assertEqual(
            msg.subject,
            'Your order quote and payment instructions'
        )

    def test_sends_html_confirmation_email(self):
        with self.assertTemplateUsed('email/order-confirmation.html'):
            self.order.send_confirmation()

    def test_from_email(self):
        order = Order(f_name="Homer",
                      l_name="Simpson",
                      email="homer@example.com")
        self.assertEqual(
            order.from_email(),
            "Homer Simpson <homer@example.com>"
        )
