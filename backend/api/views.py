from rest_framework.generics import ListCreateAPIView, RetrieveAPIView, RetrieveUpdateAPIView

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


class EventListCreateView(ListCreateAPIView):

    serializer_class = serializers.EventSerializer

    def get_serializer_context(self):
        context = super(EventListCreateView, self).get_serializer_context()
        context['timeline_id'] = self.kwargs['pk']
        return context

    def get_queryset(self):
        return models.Event.objects.filter(type__sharedeventtype__timeline=self.kwargs['pk'])


class EventRetrieveUpdateView(RetrieveUpdateAPIView):

    serializer_class = serializers.EventSerializer

    def get_serializer_context(self):
        context = super(EventRetrieveUpdateView, self).get_serializer_context()
        context['timeline_id'] = self.kwargs['timeline']
        return context

    def get_queryset(self):
        return models.Event.objects.filter(type__sharedeventtype__timeline=self.kwargs['timeline'])
