from rest_framework import serializers

from api import models


class TimelineSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Timeline
        fields = ('id', 'name')


class EventTypeSerializer(serializers.ModelSerializer):

    name = serializers.CharField(max_length=255, source='event_type.name')

    def create(self, validated_data):
        event_type = models.EventType.objects.create(name=validated_data['event_type']['name'])
        shared_event_type = models.SharedEventType.objects.create(
            event_type=event_type, timeline_id=self.context['timeline_id'], relationship=validated_data['relationship'],
            color_primary=validated_data['color_primary'], color_secondary=validated_data['color_secondary']
        )
        return shared_event_type

    class Meta:
        model = models.SharedEventType
        fields = ('id', 'name', 'relationship', 'color_primary', 'color_secondary')
