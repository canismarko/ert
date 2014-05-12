import json

from django.core.mail import EmailMessage
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response

from ert import settings
from ert.models import ContactRequest

class ContactView(APIView):
    def post(self, request):
        data = request.DATA
        # Create a database entry for this contact
        contact_request = ContactRequest(**data)
        contact_request.save()
        # Send an e-mail to ERT staff and sender about the contact
        contact_request.notify_ert()
        contact_request.send_confirmation()
        return Response()
