# 📷 BildBook

**BildBook** ist eine einfache Webanwendung zum Hochladen und Verwalten von Bildern. Nutzer können sich anmelden, Bilder mit Titel und Beschreibung hochladen und ihre persönliche Galerie einsehen. Ideal als Grundlage für ein Bilder- oder Medienverwaltungssystem.

---

## 🧰 Technologien

- **Frontend:** TypeScript, Vite, HTML, CSS
- **Backend:** PHP (mit Sessions)
- **Datenbank:** SQLite
- **Bildspeicherung:** Lokaler Server-Ordner (`uploads/`)

---

## 🚀 Features

- 🔐 Benutzer-Login mit Session-Handling
- 🖼️ Bild-Upload (mit Name & Beschreibung)
- 🗃️ Speicherung der Bilddaten in SQLite
- 🧑‍🎨 Eigene Galerie-Ansicht für eingeloggte Nutzer
- 🖥️ Moderne UI mit Navigation und Seiten (Login, Galerie, Profil)
- 📂 Bilder werden **nicht** in Git eingecheckt (`uploads/` ist `.gitignore`-geschützt)

---


---

## 🛠️ Setup

### Voraussetzungen

- PHP ≥ 8.0
- Node.js & npm
- SQLite3

### Backend starten

```bash
cd backend
php -S localhost:8000 -t src

### Frontend starten

cd frontend
npm install
npm run dev

Frontend erreichbar unter: http://localhost:5173

Backend erreichbar unter: http://localhost:8000


## 📝 Lizenz

Dieses Projekt steht unter der **MIT-Lizenz** – frei zur Nutzung, Modifikation und Weiterverbreitung, auch für kommerzielle Zwecke. 

---

**MIT License**

Copyright (c) 2025

Hiermit wird jeder Person, die eine Kopie dieser Software und der zugehörigen Dokumentationsdateien (die "Software") erhält, die Erlaubnis erteilt, die Software uneingeschränkt zu nutzen, einschließlich und ohne Einschränkung des Rechts, sie zu verwenden, zu kopieren, zu modifizieren, zusammenzuführen, zu veröffentlichen, zu verbreiten, zu unterlizenzieren und/oder zu verkaufen, und Personen, denen die Software zur Verfügung gestellt wird, dies unter den folgenden Bedingungen zu gestatten:

Der obige Urheberrechtshinweis und dieser Genehmigungshinweis müssen in allen Kopien oder wesentlichen Teilen der Software enthalten sein.

DIE SOFTWARE WIRD OHNE JEDE AUSDRÜCKLICHE ODER IMPLIZIERTE GARANTIE BEREITGESTELLT, EINSCHLIESSLICH DER GARANTIEN DER MARKTGÄNGIGKEIT, DER EIGNUNG FÜR EINEN BESTIMMTEN ZWECK UND DER NICHTVERLETZUNG. IN KEINEM FALL SIND DIE AUTOREN ODER COPYRIGHTINHABER FÜR JEGLICHEN SCHADEN ODER ANDERE HAFTUNGSANSPRÜCHE VERANTWORTLICH, OB IN EINER VERTRAGS-, DELIKT- ODER ANDERWEITIGEN HAFTUNG, DER AUS DER SOFTWARE ODER DER BENUTZUNG ODER ANDEREN GESCHÄFTEN MIT DER SOFTWARE ENTSTEHT.

---

📌 Du darfst dieses Projekt also **frei verwenden, anpassen, teilen und veröffentlichen** – ganz ohne Verpflichtung, solange der obige Hinweis enthalten bleibt.
![MIT License](https://img.shields.io/badge/License-MIT-green.svg)