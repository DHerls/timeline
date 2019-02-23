from rest_framework.generics import ListCreateAPIView, RetrieveAPIView

from api import serializers, models


class TimelineListCreateView(ListCreateAPIView):

    serializer_class = serializers.TimelineSerializer
    queryset = models.Timeline.objects.order_by('name')


class TimelineRetrieveView(RetrieveAPIView):

    serializer_class = serializers.TimelineSerializer
    queryset = models.Timeline.objects.all()


class EventTypeListCreateView(ListCreateAPIView):

    serializer_class = serializers.EventTypeSerializer

    def get_serializer_context(self):
        context = super(EventTypeListCreateView, self).get_serializer_context()
        context['timeline_id'] = self.kwargs['pk']
        return context

    def get_queryset(self):
        return models.SharedEventType.objects.filter(timeline_id=self.kwargs['pk'])
