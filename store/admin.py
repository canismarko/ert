from django.contrib import admin

from store.models import (Beer, Brewery, Style, StyleFamily, SupplyUnit,
                          Order, OrderItem)

admin.site.register(Beer)
admin.site.register(Brewery)
admin.site.register(Style)
admin.site.register(StyleFamily)
admin.site.register(SupplyUnit)
admin.site.register(Order)
admin.site.register(OrderItem)
