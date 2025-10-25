# shop/management/commands/clear_cache.py
from django.core.management.base import BaseCommand
from django.core.cache import cache


class Command(BaseCommand):
    help = 'Очистка всего кеша приложения'

    def add_arguments(self, parser):
        parser.add_argument(
            '--key',
            type=str,
            help='Очистить конкретный ключ кеша',
        )

    def handle(self, *args, **options):
        if options['key']:
            cache.delete(options['key'])
            self.stdout.write(
                self.style.SUCCESS(f'Кеш для ключа "{options["key"]}" очищен')
            )
        else:
            cache.clear()
            self.stdout.write(
                self.style.SUCCESS('Весь кеш успешно очищен!')
            )
