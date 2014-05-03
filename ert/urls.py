from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.staticfiles import views
from django.views.generic import TemplateView
admin.autodiscover()

urlpatterns = patterns(
    '',
    # API for submitting contact form
    url(r'^contact-message/$', 'ert.views.contact_form',
        name='contact'),

    # Static files for WYSIWYG admin editor
    url(r'^summernote', include('django_summernote.urls')),

    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {
        'document_root': settings.MEDIA_ROOT
    }),

    # Jasmine front-end unit tests
    url(r'^test/jasmine/$', TemplateView.as_view(template_name='jasmine.html'),
        name='jasmine'),

    url(r'^admin/', include(admin.site.urls)),

    # # Default entry point for all angular pages
    url(r'^', TemplateView.as_view(template_name='base.html'),
        name='home'),

)
