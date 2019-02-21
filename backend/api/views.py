from rest_framework.generics import ListCreateAPIView

from api import serializers, models


class TimelineListCreateView(ListCreateAPIView):

    serializer_class = serializers.TimelineSerializer
    queryset = models.Timeline.objects.order_by('name')
