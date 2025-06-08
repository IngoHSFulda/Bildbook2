// src/main.ts

// Beispiel-Imports
import './style.css';

// Hole das App-Div aus dem DOM
const appDiv = document.getElementById('app');

if (appDiv) {
  // Beispiel: Setze etwas HTML rein
  appDiv.innerHTML = `
    <h1>Hello, World!</h1>
    <p>Willkommen in meiner App.</p>
  `;

  // Beispiel: Füge dynamisch ein weiteres Element hinzu
  const childElement = document.createElement('div');
  childElement.textContent = 'Dies ist ein dynamisches Element.';
  appDiv.appendChild(childElement);

  // Optional: Event Listener
  const button = document.createElement('button');
  button.textContent = 'Klick mich!';
  button.addEventListener('click', () => {
    alert('Button geklickt!');
  });
  appDiv.appendChild(button);
} else {
  console.error("Element mit ID 'app' nicht gefunden.");
}
