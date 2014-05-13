from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from store.models import Beer, Brewery, Style, Order, OrderItem
from store.serializers import (BeerListSerializer, BrewerySerializer,
                               BeerStyleSerializer)


class BeerApi(APIView):
    """
    Viewing the list of currently available beers or the requested beer by pk.
    Also accepts a query param for deciding the language.
    """
    def get(self, request, pk=None):
        beer_list = Beer.objects.all()
        serializer = BeerListSerializer(beer_list, many=True)
        return Response(serializer.data)


class BreweryApi(APIView):
    """
    Viewing the breweries whose beer we carry.
    Also accepts a query param for deciding the language.
    """
    def get(self, request, pk=None):
        brewery_list = Brewery.objects.all()
        serializer = BrewerySerializer(brewery_list, many=True)
        return Response(serializer.data)


class BeerStyleApi(APIView):
    """
    Viewing the list of available beer styles.
    Also accepts a query param for deciding the language.
    """
    def get(self, request, pk=None):
        beer_style_list = Style.objects.all()
        serializer = BeerStyleSerializer(beer_style_list, many=True)
        return Response(serializer.data)


class OrderApi(APIView):
    """
    View for interacting with an order
    and the corresponding list of order items.
    """
    def post(self, request):
        is_valid = True
        # Validation on the submitted request
        if len(request.DATA['order_items']) == 0:
            # Failed due to empty order
            is_valid = False
            response_data = {
                'status': 'failed',
                'reason': 'order_items cannot be empty'
            }
        if is_valid:
            order = Order(**request.DATA['order_data'])
            order.save()
            # Create OrderItem instances from the submitted order
            order_items = request.DATA['order_items']
            for item in order_items:
                new_item = OrderItem()
                new_item.beer = Beer.objects.get(pk=item['beer']['id'])
                new_item.quantity = item['quantity']
                new_item.order = order
                new_item.save()
            # Send relevant emails
            order.notify_ert()
            order.send_confirmation()
            # Send API response
            response_data = {
                'status': 'success',
                'order_id': order.id
            }
            response = Response(response_data)
        else:
            response = Response(response_data,
                                status=status.HTTP_400_BAD_REQUEST)
        return response
