# -*- coding: utf-8
from django.test import TestCase

from blog.models import Post
from blog.serializers import PostSerializer

class BlogPostTranslationsTest(TestCase):
    """Make sure that the PostSerializer object operates correctly."""
    def test_no_english_fields(self):
        post = Post(
            title_en="",
            title_zh_TW=u"我去聖安東尼奧",
            text_en="",
            text_zh_TW=u"火山口酒廠來自美國西岸的奧勒岡州"
        )
        serializer = PostSerializer(post)
        self.assertEqual(
            serializer.data['title_en'],
            post.title_zh_TW
        )
        self.assertEqual(
            serializer.data['text_en'],
            post.text_zh_TW
        )
        self.assertEqual(
            serializer.data['title_zh_TW'],
            post.title_zh_TW
        )
        self.assertEqual(
            serializer.data['text_zh_TW'],
            post.text_zh_TW
        )

    def test_no_chinese_fields(self):
        post = Post(
            title_en="Test blog post title",
            title_zh_TW="",
            text_en="I love my new blog post!",
            text_zh_TW=""
        )
        serializer = PostSerializer(post)
        self.assertEqual(
            serializer.data['title_zh_TW'],
            post.title_en
        )
        self.assertEqual(
            serializer.data['text_zh_TW'],
            post.text_en
        )
        self.assertEqual(
            serializer.data['title_en'],
            post.title_en
        )
        self.assertEqual(
            serializer.data['text_en'],
            post.text_en
        )
