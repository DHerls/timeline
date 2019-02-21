from rest_framework.generics import ListCreateAPIView, RetrieveAPIView

from api import serializers, models


class TimelineListCreateView(ListCreateAPIView):

    serializer_class = serializers.TimelineSerializer
    queryset = models.Timeline.objects.order_by('name')


class TimelineRetrieveView(RetrieveAPIView):

    serializer_class = serializers.TimelineSerializer
    queryset = models.Timeline.objects.all()
