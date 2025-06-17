import './style.css';

const appDiv = document.querySelector<HTMLDivElement>('#app');
if (!appDiv) throw new Error('Kein #app Element gefunden');

let username: string | null = null;
// Suche nach doppelten Definitionen
// Entferne die alte Version von renderUploadForm, zum Beispiel:
// function renderUploadForm() {
//     const mainContent = document.querySelector<HTMLDivElement>('#mainContent');
//     mainContent!.innerHTML = '<h1>Bilder hochladen</h1><p>Upload-Formular folgt noch.</p>';
// }

// Upload-Formular aktualisieren, sodass das Bild direkt darunter angezeigt wird
// Ersetze die bestehende renderUploadForm Funktion durch diese:
// Upload-Formular aktualisieren, sodass das Bild direkt darunter angezeigt wird
function renderUploadForm() {
  const mainContent = document.querySelector<HTMLDivElement>('#mainContent');
  if (!mainContent) return;

  mainContent.innerHTML = `
    <h1>Bilder hochladen</h1>
    <form id="uploadForm" enctype="multipart/form-data">
      <label for="image">Bild auswählen:</label><br>
      <input type="file" name="image" id="image" accept="image/*" required><br><br>
      <button type="submit">Hochladen</button>
    </form>
    <p id="uploadMessage" style="color: green;"></p>
    <div id="uploadedImageContainer"></div>
  `;

  const uploadForm = document.querySelector<HTMLFormElement>('#uploadForm');
  const uploadMessage = document.querySelector<HTMLParagraphElement>('#uploadMessage');
  const imageContainer = document.querySelector<HTMLDivElement>('#uploadedImageContainer');

  uploadForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(uploadForm);

    try {
      const response = await fetch('http://localhost:8000/upload.php', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const text = await response.text();

      let result;
      try {
        result = JSON.parse(text);
      } catch {
        if (uploadMessage) {
          uploadMessage.textContent = 'Ungültige Serverantwort: ' + text;
          uploadMessage.style.color = 'red';
        }
        return;
      }

      if (response.ok) {
        if (uploadMessage) {
          uploadMessage.textContent = 'Bild erfolgreich hochgeladen!';
          uploadMessage.style.color = 'green';
        }

        if (result.path && imageContainer) {
          const imageUrl = `http://localhost:8000/uploads/${result.path}`;
          imageContainer.innerHTML = `<img src="${imageUrl}" alt="Hochgeladenes Bild" style="max-width: 300px; margin-top: 10px;" />`;
        }
      } else {
        if (uploadMessage) {
          uploadMessage.textContent = result.error || 'Fehler beim Upload';
          uploadMessage.style.color = 'red';
        }
      }
    } catch (error) {
      if (uploadMessage) {
        uploadMessage.textContent = 'Serverfehler: ' + (error as Error).message;
        uploadMessage.style.color = 'red';
      }
    }
  });
}


function renderLayout() {
  appDiv!.innerHTML = `
    <div id="container">
      <nav id="sidebar">
        <h2>Navigation</h2>
        <ul>
          <li><button id="navHome">Startseite</button></li>
          <li><button id="navGallery">Meine Galerie</button></li>
          <li><button id="navUpload">Bilder hochladen</button></li>
          <li><button id="navProfile">Profil</button></li>
          <li><button id="logoutBtn">Logout</button></li>
        </ul>
      </nav>
      <main id="mainContent"></main>
    </div>
  `;

  const homeBtn = document.querySelector<HTMLButtonElement>('#navHome');
  homeBtn?.addEventListener('click', renderGallery);

  const galleryBtn = document.querySelector<HTMLButtonElement>('#navGallery');
  galleryBtn?.addEventListener('click', renderOwnGallery);

  const uploadBtn = document.querySelector<HTMLButtonElement>('#navUpload');
  uploadBtn?.addEventListener('click', renderUploadForm);

  const profileBtn = document.querySelector<HTMLButtonElement>('#navProfile');
  profileBtn?.addEventListener('click', renderProfile);

  const logoutBtn = document.querySelector<HTMLButtonElement>('#logoutBtn');
  logoutBtn?.addEventListener('click', async () => {
    await fetch('http://localhost:8000/logout.php', {
      credentials: 'include'
    });
    username = '';
    renderLoginForm();
  });

  console.log(`Aktueller Benutzer: ${username}`);
  renderGallery();
}

function renderLoginForm() {
  appDiv!.innerHTML = `
    <div class="centered-container">
      <div class="login-box">
        <h1>Login</h1>
        <form id="loginForm">
          <label for="username">Benutzername:</label>
          <input type="text" id="username" name="username" required><br>
          <label for="password">Passwort:</label>
          <input type="password" id="password" name="password" required><br>
          <button type="submit">Login</button>
        </form>
        <p id="error" style="color:red;"></p>
      </div>
    </div>
  `;

  const loginForm = document.querySelector<HTMLFormElement>('#loginForm');
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const usernameInput = formData.get('username') as string;
    const passwordInput = formData.get('password') as string;

    try {
      const response = await fetch('http://localhost:8000/login.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput
        })
      });

      if (response.ok) {
        username = usernameInput;
        renderLayout();
      } else {
        const errorData = await response.json();
        const errorElement = document.querySelector<HTMLParagraphElement>('#error');
        if (errorElement) {
          errorElement.textContent = errorData.error || 'Login fehlgeschlagen';
        }
      }
    } catch (error) {
      const errorElement = document.querySelector<HTMLParagraphElement>('#error');
      if (errorElement) {
        errorElement.textContent = 'Serverfehler: ' + (error as Error).message;
      }
    }
  });
}

function renderGallery() {
  const mainContent = document.querySelector<HTMLDivElement>('#mainContent');
  if (!mainContent) return;

  mainContent.innerHTML = `
    <h1>Galerie</h1>
    <div id="imagesContainer">Lade Bilder...</div>
  `;

  loadPexelsImages();
}

async function loadPexelsImages() {
  const imagesContainer = document.querySelector<HTMLDivElement>('#imagesContainer');
  if (!imagesContainer) return;

  try {
    const response = await fetch('http://localhost:8000/getPexelsImages.php', {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      imagesContainer.textContent = errorText;
      return;
    }

    const data = await response.json();
    const images = data.images;

    imagesContainer.innerHTML = images.map((img: any) => `
      <div class="image-card">
        <img src="${img.src}" alt="Bild von ${img.photographer}">
        <p>Fotograf: ${img.photographer}</p>
        <a href="${img.url}" target="_blank">Original ansehen</a>
      </div>
    `).join('');
  } catch (error) {
    imagesContainer.textContent = 'Fehler beim Laden der Bilder.';
  }
}

function renderOwnGallery() {
  const mainContent = document.querySelector<HTMLDivElement>('#mainContent');
  mainContent!.innerHTML = '<h1>Meine Galerie</h1><p>Hier kommen deine eigenen Bilder hin!</p>';
}

function renderProfile() {
  const mainContent = document.querySelector<HTMLDivElement>('#mainContent');
  if (!mainContent) return;

  mainContent.innerHTML = `<h1>Profil</h1><p>Lade Profildaten...</p>`;

  fetch('http://localhost:8000/profile.php', {
    method: 'GET',
    credentials: 'include'
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorText = await response.text();
        mainContent.innerHTML = `<p style="color:red;">${errorText}</p>`;
        return;
      }

      const data = await response.json();
      const user = data.user;

      mainContent.innerHTML = `
        <h1>Profil bearbeiten</h1>
        <form id="profileForm">
          <label for="username">Benutzername:</label>
          <input type="text" id="username" name="username" value="${user.username}" required><br>
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" value="${user.name}" required><br>
          <label for="age">Alter:</label>
          <input type="number" id="age" name="age" value="${user.age}" required><br>
          <label for="password">Passwort ändern:</label>
          <input type="password" id="password" name="password"><br>
          <button type="submit">Speichern</button>
        </form>
        <p id="profileMessage" style="color:green;"></p>
      `;

      const profileForm = document.querySelector<HTMLFormElement>('#profileForm');
      profileForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(profileForm);
        const updatedUser = {
          username: formData.get('username') as string,
          name: formData.get('name') as string,
          age: Number(formData.get('age')),
          password: formData.get('password') as string
        };

        try {
          const response = await fetch('http://localhost:8000/profile.php', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUser)
          });

          if (response.ok) {
            const msgElement = document.querySelector<HTMLParagraphElement>('#profileMessage');
            if (msgElement) {
              msgElement.textContent = 'Profil erfolgreich aktualisiert!';
            }
          } else {
            const errorData = await response.json();
            const msgElement = document.querySelector<HTMLParagraphElement>('#profileMessage');
            if (msgElement) {
              msgElement.textContent = errorData.error || 'Fehler beim Aktualisieren';
              msgElement.style.color = 'red';
            }
          }
        } catch (error) {
          const msgElement = document.querySelector<HTMLParagraphElement>('#profileMessage');
          if (msgElement) {
            msgElement.textContent = 'Serverfehler: ' + (error as Error).message;
            msgElement.style.color = 'red';
          }
        }
      });
    })
    .catch((error) => {
      mainContent.innerHTML = `<p style="color:red;">Serverfehler: ${error}</p>`;
    });
}

// Initial Start
renderLoginForm();
