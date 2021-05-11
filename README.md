# Install
1. change settings in `.env.example` and rename it as `.env`
2. check that your hostname matches `API_DOMAIN` and `FRONTEND_DOMAIN` as it was used for `traefik` load balancer 
3. run `docker-compose up -d` to start all needed containers

# Configuration
## Frontend
The frontend don't need any configuration; it's based on a nodejs container
running the application by command `npm start` as the container starts

## Laravel setup 
(run these from `laravel` container)
```bash
composer install
php artisan key:generate
php artisan migrate
php artisan passport:install

```
