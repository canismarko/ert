from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.views.generic import TemplateView
admin.autodiscover()

urlpatterns = patterns(
    '',
    # API for submitting contact form
    url(r'^contact-message/$', 'ert.views.contact_form',
        name='contact'),

    # Default entry point for all angular pages
    url(r'^', TemplateView.as_view(template_name='base.html'),
        name='home'),

    url(r'^admin/', include(admin.site.urls)),

)
