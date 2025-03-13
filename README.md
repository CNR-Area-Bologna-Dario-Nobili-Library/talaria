# TALARIA
TALARIA is an open source Resource Sharing Management System  (RSMS) which library Resource Sharing communities can take, use and manage independently. 

An RSMS is designed to support libraries to share documents held in their own collections with other libraries. The concept of Resource Sharing (RS) has evolved from Interlibrary Lending (ILL) and Document Delivery (DD), a longstanding service enabling libraries to “lend and/or borrow” physical collection items between each other, and also limited “copy” of items, thus allowing users to access a much wider range of content than what's owned by the library with which they are affiliated.  

TALARIA supports digital resource sharing, it means allows libraries to share copies of book chapters, journal articles, thesis, maps or manuscripts digitally, either by scanning physical items or using born-digital documents. It uses a built-in Secure Electronic Delivery (SED) system, a method for transfer the digital copy, which is recognised and accepted by many scientific publishers. For PDF documents, the SED module allows the file to be uploaded to the system server. When the document is downloaded at the receiving library, the file is removed. 

## WHO CAN USE TALARIA? 
TALARIA software has been designed to be a flexible platform to support the different needs and policies of an RS community of libraries. Any international, national, regional RS community willing to use it as their technological platform may use it for resource sharing management. 

At present, an instance of TALARIA sofware, named  RSCVD App, is operational for the International Federation of Library Association (IFLA) Resource Sharing Collaborative and Voluntary Document Delivery (RSCVD) community, participated by libraries from all over the world. 

## WHO CAN INSTALL TALARIA? 
TALARIA source code can be installed in your server and be ready to start a new RS community. If you are a software developer and wish to start a new community of resource sharing libraries, then follow the instructions to configure TALARIA on your own server and to customize TALARIA's features for your community needs. 

Kindly inform us if you establish an RS community based on TALARIA. 
Our contacts: <talaria-help@area.bo.cnr.it> 


# SOFTWARE INSTALL AND CONFIGURATION

## REQUIREMENTS
To run the software you need docker is installed in your environment

## LICENSE
The software is licensed under the terms of the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html)


## INSTALL
1. Change settings in `.env.example` and rename it as `.env`
2. Check that your hostname matches `API_DOMAIN` and `FRONTEND_DOMAIN` as it was used for `traefik` load balancer; check also that the `UID` matches the user's ID running docker
3. Upload your server (and api-server) SSL certificates into `docker/certs` folder and update `SSL_CERT_PATH,SSL_KEY_PATH,SSL_API_CERT_PATH,SSL_API_KEY_PATH` variables in `.env` file accordingly
4. Run `docker-compose up -d` to start all needed containers

**NOTE for Apple Silicon (M1/M2) users**: use `docker-compose -f docker-compose-appleM1.yml <up/down>` instead of `-f docker-compose.yml` that will use `Dockerfile-appleM1` (instead of `Dockerfile` file) for both frontend and backend containers and loads configuration ready for Apple Silicon M1 processor otherwise application will not run!


## FRONTEND CONFIGURATION: ReactJS
The frontend don't need any configuration; it's based on a nodejs container
and it automatically downloads and installs every needed component using `npm`.

## BACKEND CONFIGURATION: Laravel 
Run these commands from `talaria-laravel` container ONLY THE FIRST TIME you run the application
```bash
composer install    #download vendor folder
php artisan migrate # create DB
php artisan passport:install # create oAuth2 auth keys used by API (you've to keep credentials provided and put in in your `.env` as described below)
composer dump-autoload
php artisan optimize
```
Then change `CLIENT_ID` and `CLIENT_SECRET` in your `.env` accordingly to ones generated by `php artisan passport:install` command used before.

All scheduled/queued jobs are managed by `laravelqueue` and `laravelscheduler` containers

### INITIAL SETUP
Run these commands from `talaria-laravel` container ONLY THE FIRST TIME you run the application
```bash
php artisan db:seed # DB init
```
This command will initialize DB with some usefull data likes countries, identifiers, institution-types, titles, roles ... and two user account to manage the system directly from web UI:
```
username: admin@talaria.local      password: password

username: manager@talaria.local    password: password
```

### DATABASE 
You can access DB data using PHPMyAdmin at `https://${API_DOMAIN}/phpmyadmin/`  (see `phpmyadmin` container for configuration). 

`dbbackup` container (see configuration parameters in `docker-compose.yml` ) automatically saved a local DB dump in the folder specified by `DB_BACKUP_FOLDER` variable defined in `.env` file 


## FILE STORAGE
All uploaded files are stored temporarly in the `/storage/app/public` folder and will be automatically removed everyday at 23:00 by a Laravel scheduled job (see `AutomaticDeleteUploadedFiles.php`).

# CUSTOMIZATION
All configuration settings are stored  in `.env`

If you change something in the Laravel configuration or in `.env` you've to rebuild Laravel cache runing these commands from `talaria-laravel` container:
```bash
php artisan cache:clear
php artisan optimize
```

## Logo
Used logo are stored in `/frontend/app/images/`, you can find `logo.png` (big) and `logo-mini.png` (small, used for mobile sidebar)

## Mobile App Icon
Used PWA icon is stored in `/frontend/app/images/icon-512x512.png`


# Credits
TALARIA has been developed under the frame of the European project HERMES “Streghtening Digital Resource Sharing during COVID and beyond” and continues to be developed at CNR Research Area of Bologna - Dario Nobili Library, Italy.

Links: 

TALARIA Knowledge base: <https://talaria.cnr.it/> (in progress) 

RSCVD community website: <https://rscvd.ifla.org/> 

RSCVD App powered by Talaria: <https://app.rscvd.ifla.org/> 


To learn more: 
- Document Delivery and Resource Sharing: Global Perspectives, edited by Peter Collins, IFLA Professional Reports : 140, The Hague, IFLA Headquarters, 2023. – 121p.  ISBN 978-90-77897-81-2 <https://repository.ifla.org/handle/20.500.14598/2704> 

- Designing TALARIA - A New Software to Support Resource Sharing of International Communities, Silvana Mangiaracina, Alessandro Tugnoli, Debora Mazza, Rabih Kahaleh , 17th IFLA Interlending and Document Supply Conference - Sharing to Heal: Resource Sharing Through the Pandemic and Beyond, Proceedings, IFLA, Qatar, 2022. <https://repository.ifla.org/handle/20.500.14598/2379> 
