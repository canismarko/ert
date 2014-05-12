from django.core.mail import EmailMessage
from django.db import models

from ert import settings

class ContactRequest(models.Model):
    """
    Represents a contact request, eg. submitted through the contact form.
    """
    email = models.TextField()
    subject = models.TextField()
    name = models.TextField(blank=True)
    body = models.TextField(blank=True)
    email = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "{sender} - {subject}".format(sender=(self.name or self.email),
                                             subject=self.subject)

    def from_email(self):
        """
        The sender of the contact request in "Dave <user@example.com>" format.
        """
        if self.name:
            sender = '{name} <{email}>'.format(name=self.name,
                                               email=self.email)
        else:
            sender = self.email
        return sender

    def notify_ert(self):
        """
        Send and e-mail to settings.CONTACT_EMAIL
        to notify them of this contact request.
        Addresses listed in settings.CONTACT_CC will be cc'd.
        """
        subject = '[Website] {}'.format(self.subject)
        message = 'From: {name} ({email})\nSubject: {subject}\n\n{body}'.format(
            name=self.name,
            email=self.email,
            subject=self.subject,
            body=self.body)
        sender = self.from_email()
        email = EmailMessage(
            subject=subject,
            body=message,
            from_email=sender,
            to=[settings.CONTACT_EMAIL],
            cc=settings.CONTACT_CC)
        return email.send()

    def send_confirmation(self):
        """
        Send an e-mail to the sender of the contact request
        confirming its receipt."""
        email = EmailMessage(
            to=[self.from_email()],
            subject="Thank you for contacting East Road Trading Company",
            from_email=settings.CONTACT_EMAIL,
            body="We will be in touch shortly.\n\n---\n\n{}".format(self.body)
            )
        return email.send()
