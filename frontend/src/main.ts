import './style.css';

const appDiv = document.querySelector<HTMLDivElement>('#app');
if (!appDiv) throw new Error('Kein #app Element gefunden');

let isLoggedIn = false;
let username = '';

function renderLoginForm() {
  appDiv.innerHTML = `
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
          credentials: 'include', // für Session-Cookies
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: usernameInput,
            password: passwordInput
          })
        });

        if (response.ok) {
          const data = await response.json();
          isLoggedIn = true;
          username = usernameInput;
          renderLoggedIn();
        } else {
          const errorData = await response.json();
          document.querySelector<HTMLParagraphElement>('#error')!.textContent = errorData.error || 'Login fehlgeschlagen';
        }
      } catch (error) {
        document.querySelector<HTMLParagraphElement>('#error')!.textContent = 'Serverfehler: ' + (error as Error).message;
      }
    });
  }
}

function renderLoggedIn() {
  appDiv.innerHTML = `
    <div>
      <h1>Willkommen, ${username}!</h1>
      <button id="logoutBtn">Logout</button>
    </div>
  `;

  const logoutBtn = document.querySelector<HTMLButtonElement>('#logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await fetch('http://localhost:8000/logout.php', {
        credentials: 'include'
      });
      isLoggedIn = false;
      username = '';
      renderLoginForm();
    });
  }
}

// Initial-Render
renderLoginForm();

