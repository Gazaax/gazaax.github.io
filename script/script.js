const toggleBtn = document.getElementById("chat-toggle-btn");
const closeBtn = document.getElementById("chat-close-btn");
const container = document.getElementById("chatbot-container");
const sendBtn = document.getElementById("chat-send-btn");
const input = document.getElementById("chat-input");
const messages = document.getElementById("chat-messages");

toggleBtn.addEventListener("click", () =>
  container.classList.toggle("chat-hidden"),
);
closeBtn.addEventListener("click", () =>
  container.classList.add("chat-hidden"),
);

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user-message");
  input.value = "";

  const loadingDiv = addMessage("Réfléchit...", "bot-message");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    const data = await res.json();
    loadingDiv.textContent = data.reply;
  } catch (err) {
    loadingDiv.textContent = "Erreur de connexion.";
  }
}

function addMessage(text, className) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", className);
  msgDiv.textContent = text;
  messages.appendChild(msgDiv);
  messages.scrollTop = messages.scrollHeight;
  return msgDiv;
}
