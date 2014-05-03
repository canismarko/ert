from django.contrib import admin
from django_summernote.admin import SummernoteModelAdmin
from blog.models import Post

# Register your models here.
class PostAdmin(SummernoteModelAdmin):
    pass

admin.site.register(Post, PostAdmin)
