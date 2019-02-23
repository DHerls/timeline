from django.db import models

RELATIONSHIP_ORIGINAL = 'O'
RELATIONSHIP_SHARED = 'S'
RELATIONSHIP_RESTRICTED = 'R'

CHOICES_RELATIONSHIP = (
    (RELATIONSHIP_ORIGINAL, 'Original'),
    (RELATIONSHIP_SHARED, 'Shared'),
    (RELATIONSHIP_RESTRICTED, 'Restricted'),
)


class Timeline(models.Model):
    """Represents a """

    name = models.CharField(max_length=255)
    event_types = models.ManyToManyField(to='api.EventType', through='api.SharedEventType', blank=True)
    events = models.ManyToManyField(to='api.Event', through='api.SharedEvent', blank=True)

    class Meta:
        ordering = ('name', )

    def __str__(self):
        return self.name


class EventType(models.Model):

    name = models.CharField(max_length=255)

    class Meta:
        ordering = ('name', )

    def __str__(self):
        return self.name


class SharedEventType(models.Model):

    event_type = models.ForeignKey('api.EventType', on_delete=models.CASCADE)
    timeline = models.ForeignKey('api.Timeline', on_delete=models.CASCADE)
    relationship = models.CharField(max_length=1, choices=CHOICES_RELATIONSHIP)
    color_primary = models.CharField(max_length=6, default='ffffff')
    color_secondary = models.CharField(max_length=6, default='000000')

    def __str__(self):
        return "{} - {} {}".format(self.event_type.name, self.get_relationship_display(), self.timeline.name)


class Event(models.Model):

    title = models.CharField(max_length=255)
    time_start = models.DateTimeField()
    time_end = models.DateTimeField()

    class Meta:
        ordering = ('title', 'time_start', 'time_end')

    def __str__(self):
        return "{} {}-{}".format(self.title, self.time_start, self.time_end)


class SharedEvent(models.Model):

    timeline = models.ForeignKey('api.Timeline', on_delete=models.CASCADE)
    event = models.ForeignKey('api.Event', on_delete=models.CASCADE)
    event_type = models.ForeignKey('api.EventType', on_delete=models.CASCADE)
    relationship = models.CharField(max_length=1, choices=CHOICES_RELATIONSHIP)
    color_primary = models.CharField(max_length=6, default='ffffff')
    color_secondary = models.CharField(max_length=6, default='000000')

