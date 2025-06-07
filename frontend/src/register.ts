import './style.css';

const appDiv = document.querySelector<HTMLDivElement>('#app');
if (!appDiv) {
  throw new Error('Kein #app Element gefunden');
}

function renderRegisterForm() {
  appDiv.innerHTML = `
    <div>
      <h1>Registrierung</h1>
      <form id="registerForm">
        <div>
          <label for="username">Benutzername:</label>
          <input type="text" id="username" name="username" required>
        </div>
        <div>
          <label for="password">Passwort:</label>
          <input type="password" id="password" name="password" required>
        </div>
        <div>
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" required>
        </div>
        <div>
          <label for="age">Alter:</label>
          <input type="number" id="age" name="age" required>
        </div>
        <button type="submit">Registrieren</button>
      </form>
      <button id="backBtn">Zurück zum Login</button>
      <p id="error" style="color: red;"></p>
    </div>
  `;

  const registerForm = document.querySelector<HTMLFormElement>('#registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(registerForm);
      const username = formData.get('username') as string;
      const password = formData.get('password') as string;
      const name = formData.get('name') as string;
      const age = parseInt(formData.get('age') as string, 10);

      try {
        const response = await fetch('http://localhost:8000/register.php', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username,
            password,
            name,
            age
          })
        });

        if (response.ok) {
          alert('Registrierung erfolgreich! Du kannst dich jetzt einloggen.');
          window.location.href = '/';
        } else {
          const errorText = await response.text();
          const errorElement = document.querySelector<HTMLParagraphElement>('#error');
          if (errorElement) {
            try {
              const errorData = JSON.parse(errorText);
              errorElement.textContent = errorData.error || 'Registrierung fehlgeschlagen';
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

  const backBtn = document.querySelector<HTMLButtonElement>('#backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.href = '/';
    });
  }
}

renderRegisterForm();
