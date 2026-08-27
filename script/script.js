const chatToggleBtn = document.getElementById("chat-toggle-btn");
const chatCloseBtn = document.getElementById("chat-close-btn");
const chatContainer = document.getElementById("chatbot-container");
const chatSendBtn = document.getElementById("chat-send-btn");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

chatToggleBtn.addEventListener("click", () => {
  chatContainer.classList.toggle("chat-hidden");
  if (!chatContainer.classList.contains("chat-hidden")) {
    chatInput.focus();
  }
});

chatCloseBtn.addEventListener("click", () => {
  chatContainer.classList.add("chat-hidden");
});

chatSendBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  // Message utilisateur
  addMessage(text, "user-message");
  chatInput.value = "";
  chatInput.disabled = true;
  chatSendBtn.disabled = true;

  // Indicateur de chargement stylisé
  const loadingDiv = createLoadingIndicator();

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    if (!res.ok) throw new Error("API request failed");

    const data = await res.json();
    loadingDiv.classList.remove("loading");
    loadingDiv.innerHTML = "";
    loadingDiv.textContent = data.reply || "Désolé, je n'ai pas pu générer de réponse.";
  } catch (err) {
    loadingDiv.classList.remove("loading");
    loadingDiv.innerHTML = "";
    loadingDiv.textContent = "Désolé, une erreur est survenue lors de la connexion au serveur.";
  } finally {
    chatInput.disabled = false;
    chatSendBtn.disabled = false;
    chatInput.focus();
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

function addMessage(text, className) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", className);
  msgDiv.textContent = text;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return msgDiv;
}

function createLoadingIndicator() {
  const loadingDiv = document.createElement("div");
  loadingDiv.classList.add("message", "bot-message", "loading");
  loadingDiv.innerHTML = `
    <span class="typing-dot"></span>
    <span class="typing-dot"></span>
    <span class="typing-dot"></span>
  `;
  chatMessages.appendChild(loadingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return loadingDiv;
}
