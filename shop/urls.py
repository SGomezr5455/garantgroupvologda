# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('about/', views.about, name='about'),
    path('catalog/', views.catalog, name='catalog'),
    path('product/<int:pk>/', views.product_detail, name='product_detail'),
    path('works/', views.works, name='works'),
    path('contact/', views.contact, name='contact'),
    path('order/', views.order, name='order'),
    path('order/success/', views.order_success, name='order_success'),
    path('additional-services/', views.additional_services, name='additional_services'),
]