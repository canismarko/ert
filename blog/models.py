from django.contrib.auth.models import User
from django.db import models

# Create your models here.
class Post(models.Model):
    title_en = models.CharField(max_length=100, blank=True)
    title_zh_TW = models.CharField(max_length=100, blank=True)
    author = models.ForeignKey(User)
    text_en = models.TextField(blank=True)
    text_zh_TW = models.TextField(blank=True)
    published_timestamp = models.DateTimeField(auto_now=True)
    draft = models.BooleanField(default=False)

    def __str__(self):
        # English title if available, otherwise, Chinese
        if self.title_en != '':
            return self.title_en
        elif self.title_zh_TW != '':
            return self.title_zh_TW
        else:
            return "[Untitled blog post]"
