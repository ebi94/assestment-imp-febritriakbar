FROM php:8.1-apache

# install extensions and composer
RUN apt-get update && apt-get install -y \
    zip unzip git libzip-dev sqlite3 libsqlite3-dev \
    && docker-php-ext-install pdo pdo_sqlite zip

# enable apache rewrite
RUN a2enmod rewrite

# install composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# copy app files
COPY . /var/www/html

# install composer dependencies (if composer.json exists)
RUN if [ -f composer.json ]; then composer install --no-interaction --prefer-dist --optimize-autoloader; fi

# set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache || true

EXPOSE 80
CMD ["apache2-foreground"]
