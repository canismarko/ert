from rest_framework import serializers

from blog.models import Post

class PostSerializer(serializers.ModelSerializer):

    # Override Post fields to check for missing translations
    title_en = serializers.SerializerMethodField('get_title_en')
    text_en = serializers.SerializerMethodField('get_text_en')
    title_zh_TW = serializers.SerializerMethodField('get_title_zh_TW')
    text_zh_TW = serializers.SerializerMethodField('get_text_zh_TW')

    # Serializer methods for filling in missing translations
    def get_translation(self, obj, field, primary_lang, secondary_lang):
        """
        Helper method that returns the given field in the desired translation.
        If the field is defined in the primary_lang it gives that or otherwise,
        the secondary_lang.
        """
        primary_field = "{field}_{lang}".format(field=field, lang=primary_lang)
        secondary_field = "{field}_{lang}".format(
            field=field, lang=secondary_lang)
        if getattr(obj, primary_field) == "":
            string = getattr(obj, secondary_field)
        else:
            string = getattr(obj, primary_field)
        return string

    def get_title_en(self, obj):
        return self.get_translation(obj, 'title', 'en', 'zh_TW')

    def get_text_en(self, obj):
        return self.get_translation(obj, 'text', 'en', 'zh_TW')

    def get_title_zh_TW(self, obj):
        return self.get_translation(obj, 'title', 'zh_TW', 'en')

    def get_text_zh_TW(self, obj):
        return self.get_translation(obj, 'text', 'zh_TW', 'en')

    class Meta:
        model = Post
