from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

from store.models import Beer, Brewery, Style
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
