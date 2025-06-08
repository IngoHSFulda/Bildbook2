import './style.css';

const appDiv = document.querySelector<HTMLDivElement>('#app');
if (!appDiv) throw new Error('Kein #app Element gefunden');

let username: string | null = null;

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

function renderUploadForm() {
  const mainContent = document.querySelector<HTMLDivElement>('#mainContent');
  mainContent!.innerHTML = '<h1>Bilder hochladen</h1><p>Upload-Formular folgt noch.</p>';
}

function renderProfile() {
  const mainContent = document.querySelector<HTMLDivElement>('#mainContent');
  mainContent!.innerHTML = '<h1>Profil</h1><p>Hier kannst du dein Profil bearbeiten.</p>';
}

// Initial Start
renderLoginForm();
