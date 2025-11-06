from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.core.cache import cache
from django.db.models import Prefetch
from django.http import JsonResponse
from collections import defaultdict

from .models import (
    Product, ProductImage, ProductPrice, WorkPhoto,
    OrderRequest, CompanyInfo, GlobalOption, CreditRequest
)
from .forms import OrderForm, CreditForm


def get_grouped_options():
    """Утилита для группировки опций по категориям с кешированием"""
    cached_data = cache.get('global_options_grouped')
    if cached_data:
        return cached_data
    global_options = GlobalOption.objects.filter(is_active=True).select_related().order_by('category', 'order', 'name')
    options_by_category = defaultdict(lambda: {'name': '', 'options': []})
    for option in global_options:
        category_key = option.category
        if not options_by_category[category_key]['name']:
            options_by_category[category_key]['name'] = option.get_category_display()
        options_by_category[category_key]['options'].append(option)
    result = dict(options_by_category)
    cache.set('global_options_grouped', result, 60 * 15)
    return result


def index(request):
    """Главная страница"""
    # ← ИСПРАВЛЕНО: Используем is_featured=True для популярных моделей
    popular_products = cache.get('products_featured')
    if not popular_products:
        popular_products = list(
            Product.objects
            .filter(is_featured=True)  # ← ТОЛЬКО отмеченные как популярные
            .select_related()
            .prefetch_related('prices', 'images')
            .order_by('-id')[:6]
        )
        cache.set('products_featured', popular_products, 60 * 5)

    credit_form = CreditForm()

    return render(request, 'shop/index.html', {
        'popular_products': popular_products,  # ← ИСПРАВЛЕНО: переменная совпадает с template
        'credit_form': credit_form,
    })


def about(request):
    info = CompanyInfo.get_cached()
    return render(request, 'shop/about.html', {'info': info})


def catalog(request):
    products = cache.get('products_catalog')
    if not products:
        products = list(
            Product.objects
            .select_related()
            .prefetch_related('prices', 'images')
            .all()
        )
        cache.set('products_catalog', products, 60 * 5)
    return render(request, 'shop/catalog.html', {'products': products})


def product_detail(request, pk):
    cache_key = f'product_detail_{pk}'
    cached_data = cache.get(cache_key)
    if cached_data:
        context = cached_data
    else:
        product = get_object_or_404(
            Product.objects
            .select_related()
            .prefetch_related(
                Prefetch('prices', queryset=ProductPrice.objects.order_by('order')),
                Prefetch('images', queryset=ProductImage.objects.order_by('order'))
            ),
            pk=pk
        )
        prices = product.prices.all()
        options_by_category = get_grouped_options()
        context = {
            'product': product,
            'prices': prices,
            'options_by_category': options_by_category,
        }
        cache.set(cache_key, context, 60 * 10)
    return render(request, 'shop/product_detail.html', context)


def works(request):
    photos = WorkPhoto.objects.all()[:50]
    return render(request, 'shop/works.html', {'photos': photos})


def contact(request):
    info = CompanyInfo.get_cached()
    return render(request, 'shop/contact.html', {'info': info})


def order(request):
    order_details = request.GET.get('details', '')
    if request.method == 'POST':
        form = OrderForm(request.POST)
        if not form.is_valid():
            print("=" * 50)
            print("ОШИБКИ ВАЛИДАЦИИ ФОРМЫ:")
            print(form.errors)
            print("=" * 50)
        if form.is_valid():
            OrderRequest.objects.create(
                fio=form.cleaned_data['fio'],
                phone=form.cleaned_data['phone'],
                email=form.cleaned_data['email'],
                message=form.cleaned_data['message'],
                order_details=order_details
            )
            messages.success(request, 'Заказ успешно отправлен!')
            return redirect('order_success')
    else:
        form = OrderForm()
    return render(request, 'shop/order.html', {
        'form': form,
        'order_details': order_details
    })


def order_success(request):
    return render(request, 'shop/order_success.html')


def credit_request_view(request):
    """AJAX обработчик формы кредита"""
    if request.method == 'POST':
        form = CreditForm(request.POST)
        if form.is_valid():
            CreditRequest.objects.create(
                fio=form.cleaned_data['fio'],
                phone=form.cleaned_data['phone']
            )
            return JsonResponse({'success': True, 'message': 'Заявка успешно отправлена!'})
        else:
            return JsonResponse({'success': False, 'errors': form.errors}, status=400)
    return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=405)


def additional_services(request):
    options_by_category = get_grouped_options()
    return render(request, 'shop/additional_services.html', {
        'options_by_category': options_by_category
    })
