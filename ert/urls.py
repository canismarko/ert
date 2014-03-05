from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.views.generic import TemplateView
admin.autodiscover()

urlpatterns = patterns(
    '',
    # Examples:
    # url(r'^$', 'ert.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', TemplateView.as_view(template_name='home.html'),
        name='home'),
    url(r'^contact/$', TemplateView.as_view(template_name='contact.html'),
        name='contact'),

    url(r'^admin/', include(admin.site.urls)),
)
