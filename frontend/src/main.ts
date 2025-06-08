import './style.css';

const appDiv = document.querySelector<HTMLDivElement>('#app');
if (!appDiv) {
  throw new Error('Kein #app Element gefunden');
}

// Ab hier weiß TypeScript: appDiv ist **definitiv** vorhanden
let username = '';

function renderLoginForm() {
  appDiv!.innerHTML = `
    <div>
      <h1>Login</h1>
      <form id="loginForm">
        <div>
          <label for="username">Benutzername:</label>
          <input type="text" id="username" name="username" required>
        </div>
        <div>
          <label for="password">Passwort:</label>
          <input type="password" id="password" name="password" required>
        </div>
        <button type="submit">Login</button>
      </form>
      <button id="registerBtn">Registrieren</button>
      <p id="error" style="color: red;"></p>
    </div>
  `;

  const loginForm = document.querySelector<HTMLFormElement>('#loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(loginForm);
      const usernameInput = formData.get('username') as string;
      const passwordInput = formData.get('password') as string;

      try {
        const response = await fetch('http://localhost:8000/login.php', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: usernameInput,
            password: passwordInput
          })
        });

        if (response.ok) {
          username = usernameInput;
          renderLoggedIn();
        } else {
          const errorText = await response.text();
          const errorElement = document.querySelector<HTMLParagraphElement>('#error');
          if (errorElement) {
            try {
              const errorData = JSON.parse(errorText);
              errorElement.textContent = errorData.error || 'Login fehlgeschlagen';
            } catch {
              errorElement.textContent = 'Unbekannter Fehler: ' + errorText;
            }
          }
        }
      } catch (error) {
        const errorElement = document.querySelector<HTMLParagraphElement>('#error');
        if (errorElement) {
          errorElement.textContent = 'Netzwerkfehler oder Server nicht erreichbar: ' + (error as Error).message;
        }
      }
    });
  }

  const registerBtn = document.querySelector<HTMLButtonElement>('#registerBtn');
  if (registerBtn) {
    registerBtn.addEventListener('click', () => {
      window.location.href = '/register.html';
    });
  }
}

function renderLoggedIn() {
  appDiv!.innerHTML = `
    <div>
      <h1>Willkommen, ${username}!</h1>
      <button id="logoutBtn">Logout</button>
      <div id="gallery">
        <h2>Pexels Bilder Galerie</h2>
        <div id="imagesContainer">Lade Bilder...</div>
      </div>
    </div>
  `;

  const logoutBtn = document.querySelector<HTMLButtonElement>('#logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await fetch('http://localhost:8000/logout.php', {
          credentials: 'include'
        });
      } catch {
        // Ignorieren
      }
      username = '';
      renderLoginForm();
    });
  }

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
      try {
        const errorData = JSON.parse(errorText);
        imagesContainer.textContent = errorData.error || 'Fehler beim Laden der Bilder';
      } catch {
        imagesContainer.textContent = 'Unbekannter Fehler: ' + errorText;
      }
      return;
    }

    const data = await response.json();
    const images = data.images;

    imagesContainer.innerHTML = images
      .map(
        (img: any) => `
          <div class="image-card">
            <img src="${img.src}" alt="Bild von ${img.photographer}">
            <p>Fotograf: ${img.photographer}</p>
            <a href="${img.url}" target="_blank">Original ansehen</a>
          </div>
        `
      )
      .join('');
  } catch (error) {
    imagesContainer.textContent = 'Netzwerkfehler oder Server nicht erreichbar: ' + (error as Error).message;
  }
}

// Initial-Render
renderLoginForm();
