import json

from django.core.mail import send_mail
from django.http import HttpResponse

from ert import settings

def contact_form(request):
    data = json.loads(request.body)
    message_str = 'From: {name} ({email})\nSubject: {subject}\n\n{body}'
    message = message_str.format(**data)
    send_mail(
        'Website contact',
        message,
        data['email'],
        settings.CONTACT_EMAILS
    )
    return HttpResponse('', content_type='application/json')
