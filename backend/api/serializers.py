from rest_framework import serializers

from api import models


class TimelineSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Timeline
        fields = ('id', 'name')


class EventTypeSerializer(serializers.ModelSerializer):

    name = serializers.CharField(max_length=255, source='event_type.name')
    event_type_id = serializers.CharField(max_length=255, source='event_type.id', read_only=True)

    def create(self, validated_data):
        event_type = models.EventType.objects.create(name=validated_data['event_type']['name'])
        shared_event_type = models.SharedEventType.objects.create(
            event_type=event_type, timeline_id=self.context['timeline_id'], relationship=validated_data['relationship'],
            color_primary=validated_data['color_primary'], color_secondary=validated_data['color_secondary']
        )
        return shared_event_type

    class Meta:
        model = models.SharedEventType
        fields = ('event_type_id', 'name', 'relationship', 'color_primary', 'color_secondary')


class EventSerializer(serializers.ModelSerializer):

    def validate_type(self, value):
        """Raise an exception if the event type given is not originally on the timeline given."""
        if not value.sharedeventtype_set.filter(timeline_id=self.context['timeline_id'], relationship=models.RELATIONSHIP_ORIGINAL).exists():
            raise serializers.ValidationError('Invalid event type')
        return value

    def create(self, validated_data):
        return models.Event.objects.create(
            type=validated_data['type'], time_start=validated_data['time_start'],
            time_end=validated_data['time_end'], title=validated_data['title']
        )

    class Meta:
        model = models.Event
        fields = ('id', 'type', 'title', 'time_start', 'time_end')
