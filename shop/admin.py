from django.contrib import admin
from django.utils.html import format_html
from .models import Product, ProductImage, WorkPhoto, OrderRequest, CompanyInfo


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 3
    fields = ('image', 'alt_text', 'order', 'preview')
    readonly_fields = ('preview',)

    def preview(self, obj):
        if obj.image and obj.pk:
            return format_html('<img src="{}" width="60" height="60" style="object-fit: cover; border-radius: 4px;" />',
                               obj.image.url)
        return "Нет изображения"

    preview.short_description = 'Превью'


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'main_image', 'gallery_count')
    list_filter = ('price',)
    search_fields = ('title', 'description')
    inlines = [ProductImageInline]

    def main_image(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover; border-radius: 4px;" />',
                               obj.image.url)
        return "Нет изображения"

    main_image.short_description = 'Главное фото'

    def gallery_count(self, obj):
        count = obj.gallery.count()
        return f"+{count} фото"

    gallery_count.short_description = 'Галерея'


@admin.register(WorkPhoto)
class WorkPhotoAdmin(admin.ModelAdmin):
    list_display = ('preview', 'created_at')
    list_filter = ('created_at',)
    readonly_fields = ('created_at', 'preview')
    fields = ('image', 'created_at', 'preview')

    def preview(self, obj):
        if obj.image and obj.pk:
            return format_html('<img src="{}" width="80" height="60" style="object-fit: cover; border-radius: 4px;" />',
                               obj.image.url)
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
