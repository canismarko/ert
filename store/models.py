from datetime import datetime as dt

from django.core.mail import EmailMessage, EmailMultiAlternatives
from django.db import models
from django.template import Context
from django.template.loader import get_template

from ert import settings

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
    phone = models.CharField(max_length=30, blank=True)
    shipping_address = models.TextField()
    email = models.EmailField(max_length=254)
    company_name = models.CharField(max_length=100, blank=True)
    # Language handling
    ENGLISH = "en"
    CHINESE = "zh_TW"
    preferred_language = models.CharField(max_length=5, default=ENGLISH,
                                          choices=[
                                              (ENGLISH, "English"),
                                              (CHINESE, "Chinese"),
                                          ])
    # Status handling
    PENDING = "A"
    APPROVED = "B"
    PAID = "C"
    SHIPPED = "D"
    status = models.CharField(
        max_length=5,
        default=PENDING,
        choices=[
            (PENDING, "Pending"),
            (APPROVED, "Awaiting Payment"),
            (PAID, "Payment Received"),
            (SHIPPED, "Shipped/Closed")
        ]
    )

    def from_email(self):
        """
        Parse the order data into a from_email string.
        """
        return "{f_name} {l_name} <{email}>".format(f_name=self.f_name,
                                                   l_name=self.l_name,
                                                   email=self.email)

    def total_price(self):
        price = 0
        for item in self.orderitem_set.all():
            price += item.total_price()
        return price

    def notify_ert(self):
        """
        Send an e-mail to East Road Trading staff notifying them of the order.
        """
        # Prepare the message body from templates
        context = Context({'order': self})
        template = get_template('email/order-notification.txt')
        # Prepare and send the e-mail itself
        email = EmailMessage(
            from_email=self.from_email(),
            to=[settings.CONTACT_EMAIL],
            subject="New East Road Trading order",
            cc=settings.CONTACT_CC,
            body=template.render(context))
        return email.send()

    def send_confirmation(self):
        """
        Send a confirmation e-mail to the person requesting the order.
        """
        # Prepare the two bodies for a multi-part email
        context = Context({'order': self})
        template_txt = get_template('email/order-confirmation.txt')
        template_html = get_template('email/order-confirmation.html')
        # Send the actual confirmation e-mail
        email = EmailMultiAlternatives(
            to=[self.from_email()],
            subject='Your order quote and payment instructions',
            from_email=settings.CONTACT_EMAIL,
            body=template_txt.render(context)
        )
        email.attach_alternative(template_html.render(context), 'text/html')
        email.send()
        return None

    def __str__(self):
        if self.company_name:
            name_str = "[{status}] {f_name} {l_name} ({company}) - {time}"
        else:
            name_str = "[{status}] {f_name} {l_name} - {time}"
        name = name_str.format(
                status=self.get_status_display(),
                f_name=self.f_name,
                l_name=self.l_name,
                company=self.company_name,
                time=self.timestamp.date())
        return name

class OrderItem(models.Model):
    """
    A line-item for a customer's order.
    """
    order = models.ForeignKey('Order')
    beer = models.ForeignKey('Beer')
    quantity = models.IntegerField()

    def total_price(self):
        return self.beer.price * self.quantity

    def __str__(self):
        return "{quant} x {beer} for {order}".format(
            quant=self.quantity,
            beer=self.beer.__str__(),
            order=self.order.__str__())
