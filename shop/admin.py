# shop/admin.py
from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Count
from .models import (
    Product, ProductImage, ProductPrice, GlobalOption,
    WorkPhoto, OrderRequest, CompanyInfo
)


@admin.register(GlobalOption)
class GlobalOptionAdmin(admin.ModelAdmin):
    list_display = ('name', 'category_display', 'formatted_price_display', 'preview_image', 'is_active', 'order')
    list_editable = ('is_active', 'order')
    list_filter = ('is_active', 'category')
    search_fields = ('name', 'description')
    list_per_page = 50

    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'price', 'category', 'is_active')
        }),
        ('Дополнительная информация', {
            'fields': ('description', 'image', 'order'),
            'classes': ('wide',)
        }),
    )

    def category_display(self, obj):
        return obj.get_category_display()

    category_display.short_description = 'Категория'
    category_display.admin_order_field = 'category'

    def formatted_price_display(self, obj):
        return obj.formatted_price

    formatted_price_display.short_description = 'Цена'
    formatted_price_display.admin_order_field = 'price'

    def preview_image(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 50px; max-width: 80px; border-radius: 4px;" loading="lazy"/>',
                obj.image.url
            )
        return '—'

    preview_image.short_description = 'Фото'


class ProductPriceInline(admin.TabularInline):
    model = ProductPrice
    extra = 1
    fields = ('name', 'price', 'description', 'order')
    ordering = ['order']


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image', 'preview', 'order')
    readonly_fields = ('preview',)
    ordering = ['order']

    def preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 80px; border-radius: 4px;" loading="lazy"/>',
                obj.image.url
            )
        return "Нет изображения"

    preview.short_description = 'Превью'


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'image_preview', 'images_count', 'prices_count')
    search_fields = ('title', 'description')
    inlines = [ProductPriceInline, ProductImageInline]
    list_per_page = 50

    def get_queryset(self, request):
        """Оптимизированный queryset с подсчетом связанных объектов"""
        qs = super().get_queryset(request)
        return qs.annotate(
            _images_count=Count('images', distinct=True),
            _prices_count=Count('prices', distinct=True)
        )

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 50px; border-radius: 4px;" loading="lazy"/>',
                obj.image.url
            )
        return '—'

    image_preview.short_description = 'Главное фото'

    def images_count(self, obj):
        return obj._images_count

    images_count.short_description = 'Доп. фото'
    images_count.admin_order_field = '_images_count'

    def prices_count(self, obj):
        return obj._prices_count

    prices_count.short_description = 'Размеры'
    prices_count.admin_order_field = '_prices_count'


@admin.register(WorkPhoto)
class WorkPhotoAdmin(admin.ModelAdmin):
    list_display = ('image_preview', 'created_at')
    list_display_links = ('image_preview', 'created_at')
    readonly_fields = ('created_at', 'image_preview_large')
    fields = ('image', 'image_preview_large', 'created_at')
    list_per_page = 50
    date_hierarchy = 'created_at'

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 80px; border-radius: 4px;" loading="lazy"/>',
                obj.image.url
            )
        return "Нет изображения"

    image_preview.short_description = 'Фото'

    def image_preview_large(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-width: 300px; border-radius: 8px;" loading="lazy"/>',
                obj.image.url
            )
        return "Изображение ещё не загружено"

    image_preview_large.short_description = 'Превью изображения'


@admin.register(OrderRequest)
class OrderRequestAdmin(admin.ModelAdmin):
    list_display = ('fio', 'phone', 'email', 'created_at', 'has_details')
    search_fields = ('fio', 'phone', 'email', 'order_details')
    readonly_fields = ('created_at',)
    list_filter = ('created_at',)
    date_hierarchy = 'created_at'
    list_per_page = 100

    fieldsets = (
        ('Контактная информация', {
            'fields': ('fio', 'phone', 'email')
        }),
        ('Детали заказа', {
            'fields': ('order_details', 'message'),
            'classes': ('wide',)
        }),
        ('Системная информация', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

    def has_details(self, obj):
        return bool(obj.order_details)

    has_details.boolean = True
    has_details.short_description = 'Есть детали'

from .models import CreditRequest

@admin.register(CreditRequest)
class CreditRequestAdmin(admin.ModelAdmin):
    list_display = ('fio', 'phone', 'created_at', 'status')
    list_filter = ('status', 'created_at')
    search_fields = ('fio', 'phone')
    readonly_fields = ('fio', 'phone', 'created_at') # Запрещаем менять данные клиента

    def get_queryset(self, request):
        # Оптимизация запросов
        return super().get_queryset(request)

@admin.register(CompanyInfo)
class CompanyInfoAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Основная информация', {
            'fields': ('description',),
            'classes': ('wide',)
        }),
        ('Контакты', {
            'fields': ('phone', 'email', 'address')
        }),
    )

    def has_add_permission(self, request):
        if CompanyInfo.objects.exists():
            return False
        return True

    def has_delete_permission(self, request, obj=None):
        return False
