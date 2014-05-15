from rest_framework.views import APIView
from rest_framework.response import Response

from blog.models import Post
from blog.serializers import PostSerializer

class BlogPostView(APIView):
    def get(self, request):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)
