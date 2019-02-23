from django.contrib import admin
from django.urls import path

from api import views

urlpatterns = [
    path('timelines/', views.TimelineListCreateView.as_view()),
    path('timelines/<int:pk>', views.TimelineRetrieveView.as_view()),
    path('timelines/<int:pk>/event-types/', views.EventTypeListCreateView.as_view())
]
