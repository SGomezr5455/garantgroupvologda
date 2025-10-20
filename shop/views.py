# views.py
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from .models import Product, WorkPhoto, OrderRequest, CompanyInfo, ProductPrice, GlobalOption
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
    # Получаем ВСЕ активные глобальные опции
    global_options = GlobalOption.objects.filter(is_active=True).order_by('category', 'order')

    product.formatted_price = f"{product.price:,} ₽".replace(',', ' ')

    for price in prices:
        price.formatted_price = f"{price.price:,} ₽".replace(',', ' ')

    return render(request, 'shop/product_detail.html', {
        'product': product,
        'prices': prices,
        'global_options': global_options,
        'global_options_count': global_options.count()
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
            # Сохраняем заказ с данными из калькулятора
            order_request = OrderRequest.objects.create(
                fio=form.cleaned_data['fio'],
                phone=form.cleaned_data['phone'],
                email=form.cleaned_data['email'],
                message=order_details  # Используем данные из калькулятора
            )
            success = True
            messages.success(request, 'Ваш заказ успешно отправлен! Мы свяжемся с вами в ближайшее время.')
            # Редирект на страницу успеха
            return redirect('order_success')
    else:
        form = OrderForm()

    return render(request, 'shop/order.html', {
        'form': form,
        'success': success,
        'order_details': order_details
    })


def order_success(request):
    """Страница успешного заказа"""
    return render(request, 'shop/order_success.html')


def additional_services(request):
    """Страница дополнительных услуг"""
    global_options = GlobalOption.objects.filter(is_active=True).order_by('category', 'order')

    return render(request, 'shop/additional_services.html', {
        'global_options': global_options,
        'global_options_count': global_options.count()
    })