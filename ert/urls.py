from django_browserid.admin import site as browserid_admin
from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.staticfiles import views
from django.views.generic import TemplateView

from ert.views import ContactView
from blog.views import BlogPostView

admin.autodiscover()
# browserid_admin.copy_registry(admin.site)

urlpatterns = patterns(
    '',
    # API for submitting contact form
    url(r'^contact-message/$', ContactView.as_view(),
        name='contact'),

    # API for beer store
    url(r'^api/store/', include('store.urls')),

    # API for blog
    url(r'^api/blog/posts/?$', BlogPostView.as_view(),
        name='blog-posts'),

    # Static files for WYSIWYG admin editor
    url(r'^summernote', include('django_summernote.urls')),

    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {
        'document_root': settings.MEDIA_ROOT
    }),

    # Jasmine front-end unit tests
    url(r'^test/jasmine/$', TemplateView.as_view(template_name='jasmine.html'),
        name='jasmine'),

    # Admin site login
    url(r'^admin/', include(admin.site.urls)),

    # Default entry point for all angular pages
    url(r'^', TemplateView.as_view(template_name='base.html'),
        name='home'),

)
