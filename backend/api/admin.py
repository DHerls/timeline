from django.contrib import admin
from . import models


class TimelineAdmin(admin.ModelAdmin):

    list_display = ('name', )
    search_fields = ('name', )


class SharedEventTypeAdmin(admin.ModelAdmin):

    list_display = ('event_type', 'timeline', 'color_primary', 'color_secondary')
    search_fields = ('event_type__name', 'timeline__name')
    list_select_related = ('timeline', )


admin.site.register(models.Timeline, TimelineAdmin)
admin.site.register(models.SharedEventType, SharedEventTypeAdmin)
