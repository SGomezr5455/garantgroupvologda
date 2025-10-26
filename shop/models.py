from django.db import models
from django.core.cache import cache
from django.utils.functional import cached_property


class Product(models.Model):
    title = models.CharField('Название', max_length=200, db_index=True)
    price = models.DecimalField('Цена', max_digits=10, decimal_places=0)
    description = models.TextField('Описание')
    image = models.ImageField('Главное изображение', upload_to='products/', blank=True, null=True)
    updated_at = models.DateTimeField('Дата обновления', auto_now=True)

    class Meta:
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'
        indexes = [
            models.Index(fields=['title']),
        ]

    def __str__(self):
        return self.title

    @cached_property
    def formatted_price(self):
        """Кешированное форматирование цены"""
        return f"{self.price:,} ₽".replace(',', ' ')

    def save(self, *args, **kwargs):
        """Очистка кеша при сохранении"""
        super().save(*args, **kwargs)
        # Очистка всех связанных кешей
        cache.delete_many([
            'products_all',
            'products_featured',
            'products_catalog',
            f'product_{self.pk}',
            f'product_detail_{self.pk}',
        ])


class ProductPrice(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='prices',
        verbose_name='Товар'
    )
    name = models.CharField('Название размера/услуги', max_length=200)
    price = models.DecimalField('Цена', max_digits=10, decimal_places=0)
    description = models.TextField('Описание размера', blank=True)
    order = models.PositiveIntegerField('Порядок', default=0, db_index=True)

    class Meta:
        verbose_name = 'Цена товара'
        verbose_name_plural = 'Цены товара'
        ordering = ['order', 'price']
        indexes = [
            models.Index(fields=['product', 'order']),
        ]

    def __str__(self):
        return f"{self.product.title} - {self.name} - {self.price} ₽"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Очистка кеша продукта при изменении цены
        cache.delete_many([
            f'product_detail_{self.product.pk}',
        ])


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name='Товар'
    )
    image = models.ImageField('Изображение', upload_to='product_images/')
    order = models.PositiveIntegerField('Порядок', default=0, db_index=True)

    class Meta:
        verbose_name = 'Изображение товара'
        verbose_name_plural = 'Изображения товара'
        ordering = ['order']
        indexes = [
            models.Index(fields=['product', 'order']),
        ]

    def __str__(self):
        return f"Фото для {self.product.title}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Очистка кеша продукта при добавлении изображения
        cache.delete_many([
            f'product_detail_{self.product.pk}',
        ])


class GlobalOption(models.Model):
    CATEGORY_CHOICES = [
        ('exterior', '🏗️ Внешняя отделка и конструкция'),
        ('electrical', '⚡ Электрика'),
        ('doors_windows', '🚪 Двери и окна'),
        ('lighting', '💡 Освещение'),
        ('interior', '🎨 Внутренняя отделка'),
        ('steam_furniture', '🔥 Мебель и оборудование парной'),
        ('lounge_furniture', '🛋️ Мебель комнаты отдыха'),
        ('heating', '🌡️ Отопление'),
        ('washing', '🚿 Помывочная'),
        ('additional', '✨ Дополнительно'),
    ]

    name = models.CharField('Название', max_length=200)
    price = models.DecimalField('Цена', max_digits=10, decimal_places=0)
    category = models.CharField(
        'Категория',
        max_length=50,
        choices=CATEGORY_CHOICES,
        default='additional',
        db_index=True
    )
    description = models.TextField('Описание', blank=True)
    image = models.ImageField('Изображение', upload_to='global_options/', blank=True, null=True)
    is_active = models.BooleanField('Активно', default=True, db_index=True)
    order = models.PositiveIntegerField('Порядок сортировки', default=0, db_index=True)

    class Meta:
        verbose_name = 'Глобальная дополнительная услуга'
        verbose_name_plural = 'Глобальные дополнительные услуги'
        ordering = ['category', 'order', 'name']
        indexes = [
            models.Index(fields=['is_active', 'category', 'order']),
        ]

    def __str__(self):
        return f"{self.get_category_display()} - {self.name}"

    @cached_property
    def formatted_price(self):
        """Кешированное форматирование цены"""
        return f"{self.price:,} ₽".replace(',', ' ')

    def save(self, *args, **kwargs):
        """Очистка кеша при сохранении"""
        super().save(*args, **kwargs)
        cache.delete('global_options_active')
        cache.delete('global_options_grouped')


class WorkPhoto(models.Model):
    image = models.ImageField('Фотография', upload_to='works/')
    created_at = models.DateTimeField('Дата создания', auto_now_add=True, db_index=True)

    class Meta:
        verbose_name = 'Фотография работы'
        verbose_name_plural = 'Фотографии работ'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        return f"Фото от {self.created_at.strftime('%d.%m.%Y %H:%M')}"


class OrderRequest(models.Model):
    fio = models.CharField('ФИО', max_length=200, db_index=True)
    phone = models.CharField('Телефон', max_length=20, db_index=True)
    email = models.EmailField('Email', db_index=True)
    message = models.TextField('Сообщение', blank=True)
    order_details = models.TextField('Детали заказа', blank=True)
    created_at = models.DateTimeField('Дата создания', auto_now_add=True, db_index=True)

    class Meta:
        verbose_name = 'Заявка'
        verbose_name_plural = 'Заявки'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['phone', 'email']),
        ]

    def __str__(self):
        return f"Заявка от {self.fio} - {self.created_at.strftime('%d.%m.%Y %H:%M')}"


class CompanyInfo(models.Model):
    description = models.TextField('Описание компании')
    phone = models.CharField('Телефон', max_length=20, blank=True)
    email = models.EmailField('Email', blank=True)
    address = models.CharField('Адрес', max_length=300, blank=True)

    class Meta:
        verbose_name = 'Информация о компании'
        verbose_name_plural = 'Информация о компании'

    def __str__(self):
        return "Информация о компании"

    def save(self, *args, **kwargs):
        if not self.pk and CompanyInfo.objects.exists():
            raise ValueError('Можно создать только одну запись информации о компании')
        super().save(*args, **kwargs)
        cache.delete('company_info')

    @classmethod
    def get_cached(cls):
        """Получить информацию о компании из кеша"""
        info = cache.get('company_info')
        if info is None:
            info = cls.objects.first()
            if info:
                cache.set('company_info', info, 60 * 60 * 24)  # 24 часа
        return info