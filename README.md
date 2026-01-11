# 🏨 TAGHAZOUT HUB – Plateforme de Réservation d’Hôtel

## 📌 Description

**TAGHAZOUT HUB** est une **plateforme web de réservation d’hôtel** destinée à promouvoir l’hôtel TAGHAZOUT HUB, situé dans la région de Taghazout.
L’application permet aux clients de **rechercher, réserver et payer des chambres en ligne**, et aux hôteliers de **gérer les chambres, réservations, promotions et statistiques** via un tableau de bord administrateur.

👉 Application **full-stack** (Frontend + Backend)
👉 Destinée aux visiteurs locaux et internationaux

---

## 🎯 Objectifs du Projet

* Simplifier le processus de réservation d’hôtel
* Améliorer la visibilité et l’image de TAGHAZOUT HUB
* Centraliser la gestion des chambres et des réservations
* Offrir une expérience utilisateur moderne et sécurisée
* Fournir des statistiques utiles pour la prise de décision

---

## 🧰 Technologies Utilisées

### 🔙 Backend

* **Langage** : PHP
* **Framework** : Laravel
* **API** : RESTful
* **Base de données** : MySQL
* **Authentification** : JWT
* **Sécurité** : bcrypt, protection CSRF & XSS

### 🌐 Frontend

* **Framework** : React.js
* **State Management** : Redux
* **Routing** : React Router
* **UI / Design** : Tailwind CSS, Material-UI
* **HTTP Client** : Axios
* **Cartographie** : Google Maps API

### 🚀 DevOps & Outils

* Git / GitHub
* GitHub Actions (CI/CD)
* Hébergement : Hostinger
* SSL / TLS
* Jira / Trello (gestion de projet Agile)

---

## 🏗️ Architecture

Architecture **full-stack découplée** :

```
Frontend (React)
   ↓ Axios
Backend (Laravel REST API)
   ↓
MySQL Database
```

* Séparation claire Frontend / Backend
* API REST sécurisée
* Logique métier centralisée côté backend

---

## 👥 Rôles Utilisateurs

### 👤 Client

* Inscription / Connexion
* Recherche et filtrage des chambres
* Réservation en ligne
* Paiement sécurisé
* Gestion du profil
* Historique des réservations
* Avis et notation

### 🛠️ Administrateur (Hôtelier)

* Gestion des chambres (CRUD)
* Gestion des disponibilités
* Configuration des tarifs et promotions
* Gestion des réservations (confirmation / annulation)
* Consultation des statistiques et rapports
* Gestion des demandes spéciales clients

---

## 📦 Fonctionnalités Principales

### 🔐 Authentification

* Inscription et connexion sécurisées
* Récupération de mot de passe
* Authentification sociale (Google / Facebook – optionnel)

---

### 🔍 Recherche & Réservation

* Recherche de chambres par date
* Filtres (prix, équipements)
* Calendrier interactif
* Ajout de services supplémentaires
* Paiement en ligne sécurisé (PayPal)

---

### 📊 Tableau de Bord Administrateur

* Suivi des réservations
* Taux d’occupation
* Revenus par période
* Statistiques clients
* Rapports personnalisables

---

## 🔐 Sécurité

* Authentification JWT
* Hashage des mots de passe (bcrypt)
* Protection contre CSRF et XSS
* Validation des données côté serveur et client
* Sauvegarde automatique de la base de données

---

## 🧪 Tests

* Tests unitaires backend
* Tests fonctionnels (parcours utilisateur)
* Tests de performance
* Tests de sécurité

---

## ▶️ Installation & Lancement

### Backend (Laravel)

```bash
git clone https://github.com/username/taghazout-hub-backend.git
cd taghazout-hub-backend
composer install
php artisan migrate
php artisan serve
```

### Frontend (React)

```bash
git clone https://github.com/username/taghazout-hub-frontend.git
cd taghazout-hub-frontend
npm install
npm start
```

---

## 📑 Livrables

* Code source (GitHub)
* Cahier des charges
* Diagrammes UML (Classes, ERD, Use Case)
* Maquettes UI
* Projet Jira / Trello
* Présentation du projet

---

## 👨‍💻 Auteur

**Ayoub Oumha**
Projet académique – Plateforme de réservation d’hôtel

---

## 📄 Licence

Projet à usage pédagogique.
