# FM Rent A Car

Application de location de voitures composée d'un frontend Angular et de trois microservices Spring Boot sécurisés.

## Architecture

- `frontend/` — Angular, pages publiques, authentification et interfaces admin.
- `backend/user-service/` — comptes, connexion, JWT et gestion des utilisateurs.
- `backend/cars-service/` — catalogue, ajout/suppression de voitures et images ImageKit.
- `backend/reservations-service/` — demandes client, téléphone de contact et validation administrateur.
- Neon PostgreSQL — une base `neondb` partagée, avec un schéma PostgreSQL par service.
- Nginx — sert Angular et route les API vers le bon microservice.

## Lancement Docker

```powershell
Copy-Item .env.example .env
# Configurez les valeurs de .env, puis :
docker compose up --build
```

Ouvrez `http://localhost`. Après connexion avec le compte administrateur défini dans `.env`, la page `/admin/cars` permet d'ajouter une voiture avec son image et de la supprimer.

## Variables importantes

- `NEON_DATABASE_URL` — URL JDBC PostgreSQL Neon complète, avec `sslmode=require`
- `JWT_SECRET` — même secret pour les deux microservices
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_FIRST_NAME`, `ADMIN_LAST_NAME`
- `IMAGEKIT_URL_ENDPOINT`, `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`

Ne committez jamais `.env` et ne placez jamais la clé privée ImageKit dans Angular. En hébergement, stockez toutes ces valeurs dans le gestionnaire de secrets de la plateforme. Les trois services utilisent `NEON_DATABASE_URL` et leurs migrations Flyway créent leurs tables dans leurs schémas dédiés (`user_service`, `cars_service`, `reservations_service`).

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/cars` — catalogue public
- `GET /api/cars/{id}` — détail public d'un véhicule
- `POST /api/reservations` — crée une demande pour l'utilisateur connecté
- `GET /api/reservations/mine` — réservations de l'utilisateur connecté
- `GET /api/admin/reservations` — toutes les demandes, administrateur uniquement
- `PATCH /api/admin/reservations/{id}/approve` — confirmation après appel
- `GET /api/reservations/availability/{carId}` — périodes indisponibles du véhicule

La réservation s'effectue depuis une modale du catalogue. Le serveur calcule le prix, refuse les périodes qui se chevauchent et stocke les photos CIN recto/verso et permis comme fichiers privés ImageKit.
- `POST /api/admin/cars` — multipart, administrateur uniquement
- `DELETE /api/admin/cars/{id}` — administrateur uniquement
- `GET /api/admin/users` — administrateur uniquement
- `DELETE /api/admin/users/{id}` — administrateur uniquement

Flyway crée et met à jour automatiquement les tables PostgreSQL dans Neon.
