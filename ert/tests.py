import json

from django.core import mail
from django.core.urlresolvers import reverse
from django.test import TestCase

from ert import settings

class SendContactForm(TestCase):
    """
    Check that a submitted contact form gets e-mailed.
    """
    def test_sends_mail(self):
        response = self.client.post(
            reverse('contact'),
            content_type='application/json',
            data=json.dumps({
                'subject': 'I want to buy stuff',
                'email': 'user@example.com',
                'body': 'I am the walrus',
                'name': 'Duke of Earl'
            })
        )
        self.assertEqual(
            len(mail.outbox),
            1,
            'No mail items sent'
        )
        msg = mail.outbox[0]
        self.assertEqual(
            msg.recipients(),
            settings.CONTACT_EMAILS
        )
        self.assertEqual(
            msg.subject,
            'Website contact'
        )
        self.assertEqual(
            msg.from_email,
            'user@example.com'
        )
        self.assertIn(
            'I am the walrus',
            msg.body,
        )
