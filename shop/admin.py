from django.contrib import admin
from django.utils.html import format_html
from .models import (Product, ProductImage, ProductPrice, GlobalOption,
                     WorkPhoto, OrderRequest, CompanyInfo)


@admin.register(GlobalOption)
class GlobalOptionAdmin(admin.ModelAdmin):
    list_display = ('name', 'category_emoji', 'formatted_price', 'preview_image', 'is_active', 'order')
    list_editable = ('is_active', 'order')
    list_filter = ('is_active', 'category')
    search_fields = ('name', 'description')
    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'price', 'category', 'is_active')
        }),
        ('Дополнительная информация', {
            'fields': ('description', 'image', 'order'),
            'classes': ('wide',)
        }),
    )

    def category_emoji(self, obj):
        emoji_map = {
            'architecture': '🏛️',
            'plumbing': '🚿',
            'electrical': '💡',
            'furniture': '🪑',
            'other': '✨'
        }
        return emoji_map.get(obj.category, '✨')
    category_emoji.short_description = 'Категория'

    def formatted_price(self, obj):
        return obj.formatted_price()
    formatted_price.short_description = 'Цена'

    def preview_image(self, obj):
        if obj.image and obj.pk:
            return format_html(
                '<img src="{}" width="60" height="60" style="object-fit: cover; border-radius: 4px;" />',
                obj.image.url
            )
        return "—"
    preview_image.short_description = 'Фото'


class ProductPriceInline(admin.TabularInline):
    model = ProductPrice
    extra = 1
    fields = ('name', 'price', 'description', 'order')


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 3
    fields = ('image', 'alt_text', 'order', 'preview')
    readonly_fields = ('preview',)

    def preview(self, obj):
        if obj.image and obj.pk:
            return format_html(
                '<img src="{}" width="60" height="60" style="object-fit: cover; border-radius: 4px;" />',
                obj.image.url
            )
        return "Нет изображения"
    preview.short_description = 'Превью'


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'formatted_price', 'main_image', 'gallery_count', 'prices_count')
    list_filter = ('price',)
    search_fields = ('title', 'description')
    inlines = [ProductPriceInline, ProductImageInline]

    def formatted_price(self, obj):
        return f"{obj.price:,} ₽".replace(',', ' ')
    formatted_price.short_description = 'Базовая цена'

    def main_image(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" width="50" height="50" style="object-fit: cover; border-radius: 4px;" />',
                obj.image.url
            )
        return "Нет изображения"
    main_image.short_description = 'Главное фото'

    def gallery_count(self, obj):
        count = obj.gallery.count()
        return f"+{count} фото" if count > 0 else "—"
    gallery_count.short_description = 'Галерея'

    def prices_count(self, obj):
        count = obj.prices.count()
        return f"{count} размеров"
    prices_count.short_description = 'Размеры'


@admin.register(WorkPhoto)
class WorkPhotoAdmin(admin.ModelAdmin):
    list_display = ('preview', 'title', 'created_at')
    list_filter = ('created_at',)
    readonly_fields = ('created_at', 'preview')
    fields = ('title', 'image', 'created_at', 'preview')

    def preview(self, obj):
        if obj.image and obj.pk:
            return format_html(
                '<img src="{}" width="100" height="100" style="object-fit: cover; border-radius: 4px;" />',
                obj.image.url
            )
        return "Нет изображения"
    preview.short_description = 'Превью'


@admin.register(OrderRequest)
class OrderRequestAdmin(admin.ModelAdmin):
    list_display = ('fio', 'phone', 'email', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('fio', 'email', 'phone')
    readonly_fields = ('created_at',)


@admin.register(CompanyInfo)
class CompanyInfoAdmin(admin.ModelAdmin):
    list_display = ('title',)

    def has_add_permission(self, request):
        if CompanyInfo.objects.exists():
            return False
        return super().has_add_permission(request)