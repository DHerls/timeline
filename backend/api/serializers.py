from rest_framework import serializers

from api import models


class TimelineSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Timeline
        fields = ('id', 'name')
