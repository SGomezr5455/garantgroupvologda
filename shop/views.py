from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from .models import Product, WorkPhoto, OrderRequest, CompanyInfo, ProductPrice
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
    for product in products:
        product.formatted_price = f"{product.price:,} ₽".replace(',', ' ')
    return render(request, 'shop/catalog.html', {'products': products})


def product_detail(request, pk):
    """Детальная страница товара с калькулятором"""
    product = get_object_or_404(Product, pk=pk)
    prices = product.prices.all()

    product.formatted_price = f"{product.price:,} ₽".replace(',', ' ')

    for price in prices:
        price.formatted_price = f"{price.price:,} ₽".replace(',', ' ')

    return render(request, 'shop/product_detail.html', {
        'product': product,
        'prices': prices
    })


def works(request):
    """Галерея работ"""
    photos = WorkPhoto.objects.order_by('-created_at')
    return render(request, 'shop/works.html', {'photos': photos})


def contact(request):
    """Контакты"""
    return render(request, 'shop/contact.html')


def order(request):
    """Форма заказа с предзаполненными данными из калькулятора"""
    success = False

    # Получаем данные из калькулятора через GET-параметры
    order_details = request.GET.get('details', '')

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
            order_details = ''  # Очищаем после успешной отправки
    else:
        # Предзаполняем поле сообщения данными из калькулятора
        initial_data = {'message': order_details} if order_details else {}
        form = OrderForm(initial=initial_data)

    return render(request, 'shop/order.html', {
        'form': form,
        'success': success,
        'order_details': order_details
    })


def additional_services(request):
    """Страница дополнительных услуг"""
    return render(request, 'shop/additional_services.html')
