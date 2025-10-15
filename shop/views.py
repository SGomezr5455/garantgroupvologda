from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from .models import Product, WorkPhoto, OrderRequest, CompanyInfo
from .forms import OrderForm


def index(request):
    """Главная страница"""
    featured_products = Product.objects.all()[:3]
    return render(request, 'shop/index.html', {'products': featured_products})


def about(request):
    """О компании"""
    info = CompanyInfo.objects.first()
    return render(request, 'shop/about.html', {'info': info})


def catalog(request):
    """Каталог товаров"""
    products = Product.objects.all()
    return render(request, 'shop/catalog.html', {'products': products})


def product_detail(request, pk):
    """Детальная страница товара"""
    product = get_object_or_404(Product, pk=pk)
    return render(request, 'shop/product_detail.html', {'product': product})


def works(request):
    """Галерея работ"""
    photos = WorkPhoto.objects.order_by('-created_at')
    return render(request, 'shop/works.html', {'photos': photos})


def contact(request):
    """Контакты"""
    return render(request, 'shop/contact.html')


def order(request):
    """Форма заказа"""
    success = False
    if request.method == 'POST':
        form = OrderForm(request.POST)
        if form.is_valid():
            OrderRequest.objects.create(
                fio=form.cleaned_data['fio'],
                phone=form.cleaned_data['phone'],
                email=form.cleaned_data['email'],
                message=form.cleaned_data['message']
            )
            success = True
            form = OrderForm()
    else:
        form = OrderForm()

    return render(request, 'shop/order.html', {'form': form, 'success': success})
