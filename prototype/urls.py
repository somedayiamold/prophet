from django.conf.urls import url
from prototype import views

urlpatterns = [
    url(r'^$', views.index),
    url(r'test', views.test),
]
