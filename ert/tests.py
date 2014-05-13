import json

from django.core import mail
from django.core.urlresolvers import reverse
from django.test import TestCase

from ert import settings
from ert.models import ContactRequest


class ContactRequestModel(TestCase):
    def setUp(self):
        self.contact = ContactRequest(email='user@example.com',
                                      subject='I want beer',
                                      body='I am the walrus')
    def test_from_email(self):
        self.assertEqual(
            self.contact.from_email(),
            'user@example.com'
        )
        self.contact.name = "Dave carpenter"
        self.assertEqual(
            self.contact.from_email(),
            'Dave carpenter <user@example.com>'
        )

    def test_notify_ert(self):
        self.contact.notify_ert()
        self.assertEqual(
            len(mail.outbox),
            1,
            'No mail items sent'
        )
        msg = mail.outbox[0]
        self.assertEqual(
            msg.recipients(),
            settings.CONTACT_CC + [settings.CONTACT_EMAIL]
        )
        self.assertEqual(
            msg.subject,
            '[Website] I want beer'
        )
        self.assertEqual(
            msg.from_email,
            'user@example.com'
        )
        self.assertIn(
            'I am the walrus',
            msg.body,
        )

    def test_send_confirmation(self):
        self.contact.send_confirmation()
        self.assertEqual(
            len(mail.outbox),
            1,
            'No mail items sent'
        )
        msg = mail.outbox[0]
        self.assertEqual(
            msg.recipients()[0],
            self.contact.email
        )
        self.assertEqual(
            msg.subject,
            'Thank you for contacting East Road Trading Company'
        )


class SendContactForm(TestCase):
    """
    Check that a submitted contact form gets e-mailed.
    """
    def setUp(self):
        self.request_data = {
            'subject': 'I want to buy stuff',
            'email': 'user@example.com',
            'body': 'I am the walrus',
            'name': ''
        }

    def test_stores_contact_request(self):
        response = self.client.post(
            reverse('contact'),
            json.dumps(self.request_data),
            content_type='application/json'
        )
        contact_request = ContactRequest.objects.all()[0]
        self.assertEqual(
            contact_request.subject,
            self.request_data['subject']
        )
