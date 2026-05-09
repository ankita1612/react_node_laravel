1.RUN :composer create-project laravel/laravel my-app
2.create .env file

3.RUN :php artisan migrate
4.RUN :composer require laravel/sanctum
5.RUN : php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
6.php artisan migrate
7.to upload file : php artisan storage:link
8.php artisan make:model Property -m
php artisan make:model Owner -m
php artisan make:model Amenity -m
php artisan make:model PropertyPhoto -m
php artisan make:migration create_amenity_property_table

9. in boostrap/app.php add this line
   api: **DIR**.'/../routes/api.php',

   10.RUN :chmod -R 775 storage bootstrap/cache //for linux
   11.create cors file
