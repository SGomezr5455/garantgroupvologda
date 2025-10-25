# shop/utils.py
"""
Утилиты для оптимизации проекта
"""
from django.core.cache import cache
from functools import wraps


def cache_result(timeout=300, key_prefix=''):
    """
    Декоратор для кеширования результатов функций

    Использование:
    @cache_result(timeout=600, key_prefix='my_func')
    def my_function(arg1, arg2):
        return expensive_operation(arg1, arg2)
    """

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Создаем ключ кеша из имени функции и аргументов
            cache_key = f"{key_prefix}:{func.__name__}:{str(args)}:{str(kwargs)}"

            # Пытаемся получить из кеша
            result = cache.get(cache_key)
            if result is not None:
                return result

            # Вычисляем и кешируем
            result = func(*args, **kwargs)
            cache.set(cache_key, result, timeout)
            return result

        return wrapper

    return decorator


def clear_model_cache(model_name):
    """Очистка кеша для конкретной модели"""
    patterns = {
        'Product': ['products_all', 'products_featured', 'products_catalog'],
        'GlobalOption': ['global_options_active', 'global_options_grouped'],
        'CompanyInfo': ['company_info'],
    }

    keys = patterns.get(model_name, [])
    cache.delete_many(keys)


def format_price(price):
    """Форматирование цены с пробелами"""
    return f"{price:,} ₽".replace(',', ' ')
