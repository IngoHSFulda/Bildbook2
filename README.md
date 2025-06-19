# 📷 BildBook

**BildBook** ist eine Webanwendung zum Hochladen und Verwalten persönlicher Bilder.  
Nutzer können sich registrieren, Bilder mit Titel und Beschreibung hochladen und in einer eigenen Galerie verwalten.

---

## 🌐 Live-Demo

- **Frontend:** [http://localhost:5173](http://localhost:5173)  
- **Backend:** [http://localhost:8000](http://localhost:8000)

---

## 🧰 Technologien

- Frontend: TypeScript, Vite, HTML, CSS, Fetch API  
- Backend: PHP 8 mit Sessions, SQLite  
- Speicherung: Lokale Bilder in `backend/src/uploads/` (aus `.gitignore` ausgeschlossen)

---

## 🚀 Features

- Login/Logout mit Session-Verwaltung  
- Bilder hochladen inkl. Name & Beschreibung  
- Galerieansicht pro Benutzer  
- Speicherung der Bildinfos in SQLite  
- Bilder sind nicht im Git-Repo

---
## ⚙️ Setup

```bash
# Backend starten
cd backend
php -S localhost:8000 -t src

# Frontend starten
cd frontend
npm install
npm run dev


📝 Lizenz


MIT License

Copyright (c) 2025

Hiermit wird jeder Person, die eine Kopie dieser Software und der zugehörigen Dokumentationsdateien (die "Software") erhält, die Erlaubnis erteilt, die Software uneingeschränkt zu nutzen, einschließlich und ohne Einschränkung des Rechts, sie zu verwenden, zu kopieren, zu modifizieren, zusammenzuführen, zu veröffentlichen, zu verbreiten, zu unterlizenzieren und/oder zu verkaufen, und Personen, denen die Software zur Verfügung gestellt wird, dies unter den folgenden Bedingungen zu gestatten:

Der obige Urheberrechtshinweis und dieser Genehmigungshinweis müssen in allen Kopien oder wesentlichen Teilen der Software enthalten sein.

DIE SOFTWARE WIRD OHNE JEDE AUSDRÜCKLICHE ODER IMPLIZIERTE GARANTIE BEREITGESTELLT, EINSCHLIESSLICH DER GARANTIEN DER MARKTGÄNGIGKEIT, DER EIGNUNG FÜR EINEN BESTIMMTEN ZWECK UND DER NICHTVERLETZUNG. IN KEINEM FALL SIND DIE AUTOREN ODER COPYRIGHTINHABER FÜR JEGLICHEN SCHADEN ODER ANDERE HAFTUNGSANSPRÜCHE VERANTWORTLICH.



