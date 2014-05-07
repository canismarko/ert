from datetime import datetime as dt

from django.db import models

class Beer(models.Model):
    """
    A brew made by a specific brewery. Eg Bell's Two-Hearted
    """
    name = models.CharField(max_length=50)
    brewery = models.ForeignKey('Brewery')
    style = models.ForeignKey('Style', null=True)
    # Price is in Taiwan New Dollars (NT)
    price = models.DecimalField(decimal_places=2, max_digits=6)
    abv = models.DecimalField(decimal_places=1, max_digits=3,
                              null=True, blank=True)
    ibu = models.IntegerField(null=True, blank=True)
    color_srm = models.IntegerField(null=True, blank=True)
    description_en = models.CharField(max_length=100, blank=True)
    description_zh_TW = models.CharField(max_length=100, blank=True)
    detail_en = models.TextField(blank=True)
    detail_zh_TW = models.TextField(blank=True)
    picture = models.ImageField(null=True, upload_to="beer")
    thumbnail = models.ImageField(null=True, upload_to="beer")

    def __str__(self):
        return "{brewery} - {name}".format(name=self.name,
                                         brewery=self.brewery.name)


class Brewery(models.Model):
    """
    A brewery in the United States whose beer we carry.
    """
    name = models.CharField(max_length=50)
    city = models.CharField(max_length=50, blank=True)
    state = models.CharField(max_length=50, blank=True)
    description_en = models.TextField(blank=True)
    description_zh_TW = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Style(models.Model):
    """
    A specific style of beer (eg IPA)
    """
    short_name_en = models.CharField(max_length=20)
    short_name_zh_TW = models.CharField(max_length=20)
    long_name_en = models.CharField(max_length=100, blank=True)
    long_name_zh_TW = models.CharField(max_length=100, blank=True)
    family = models.ForeignKey('StyleFamily')

    def __str__(self):
        return "{long} ({short})".format(long=self.long_name_en,
                                         short=self.short_name_en)


class StyleFamily(models.Model):
    """
    A generic style of beer (eg Ale, Lager)
    """
    name_en = models.CharField(max_length=20)
    name_zh_TW = models.CharField(max_length=20)

    def __str__(self):
        return self.name_en


class SupplyUnit(models.Model):
    """
    A specific batch of specific beer that was ordered together.
    """
    beer = models.ForeignKey(Beer, related_name='supplies')
    quantity = models.IntegerField()
    order_date = models.DateTimeField(null=True, default=dt.now)

    def __str__(self):
        return "{beer} - {date} ({quantity})".format(
            beer=self.beer.name,
            date=self.order_date.date(),
            quantity=self.quantity
        )


class Order(models.Model):
    """
    Describes the information of one common order. Specific line items
    are in the OrderItem model.
    """
    timestamp = models.DateTimeField(auto_now_add=True)
    f_name = models.CharField(max_length=50)
    l_name = models.CharField(max_length=50)
    phone = models.CharField(max_length=30)
    shipping_address = models.TextField()
    email = models.EmailField(max_length=254)
    company_name = models.CharField(max_length=100, blank=True)
    # Status handling
    PENDING = "A"
    APPROVED = "B"
    PAID = "C"
    SHIPPED = "D"
    status = models.CharField(
        max_length=5,
        choices=[
            (PENDING, "Pending"),
            (APPROVED, "Awaiting Payment"),
            (PAID, "Payment Received"),
            (SHIPPED, "Shipped/Closed")
        ]
    )

class OrderItem(models.Model):
    """
    A line-item for a customer's order.
    """
    order = models.ForeignKey('Order')
    beer = models.ForeignKey('Beer')
    quanitity = models.IntegerField()
