const chatToggleBtn = document.getElementById("chat-toggle-btn");
const chatCloseBtn = document.getElementById("chat-close-btn");
const chatContainer = document.getElementById("chatbot-container");
const chatSendBtn = document.getElementById("chat-send-btn");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

// Historique de session pour le cache et la détection de répétition
const conversationCache = [];

const repeatPunchlines = [
  "Petite impression de déjà-vu... 😉 Comme mentionné plus haut :",
  "Tu as un doute ou tu testes ma mémoire ? 😄 Revoici l'information :",
  "Rien n'a changé depuis tout à l'heure ! 🚀 :",
  "Pas de souci, revoici un petit rappel :",
  "Je confirme ce que je disais un peu plus haut 👆 :",
];

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

  // 1. Message utilisateur
  addMessage(text, "user-message");
  chatInput.value = "";
  chatInput.disabled = true;
  chatSendBtn.disabled = true;

  // 2. Indicateur de chargement
  const loadingDiv = createLoadingIndicator();

  // 3. Vérifier si une question identique ou très similaire a déjà été posée
  const cachedMatch = findSimilarQuestion(text);

  if (cachedMatch) {
    // Économie de tokens : réponse instantanée avec clin d'œil après un léger délai réaliste
    setTimeout(() => {
      loadingDiv.classList.remove("loading");
      const randomIntro =
        repeatPunchlines[Math.floor(Math.random() * repeatPunchlines.length)];
      loadingDiv.innerHTML = formatMarkdown(
        `${randomIntro}\n\n${cachedMatch.reply}`,
      );

      chatInput.disabled = false;
      chatSendBtn.disabled = false;
      chatInput.focus();
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 450);
    return;
  }

  // 4. Appel API si nouvelle question
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const data = await res.json().catch(() => ({}));
    loadingDiv.classList.remove("loading");

    if (!res.ok) {
      loadingDiv.innerHTML = formatMarkdown(
        data.reply || data.error || "Erreur de communication avec l'API.",
      );
      return;
    }

    const replyText =
      data.reply || "Désolé, je n'ai pas pu générer de réponse.";
    loadingDiv.innerHTML = formatMarkdown(replyText);

    // Enregistrement dans le cache pour les futures questions
    conversationCache.push({
      original: text,
      keywords: extractKeywords(text),
      reply: replyText,
    });
  } catch (err) {
    loadingDiv.classList.remove("loading");
    loadingDiv.textContent = "Erreur de connexion au serveur.";
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
  msgDiv.innerHTML = formatMarkdown(text);
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

/**
 * Normalise un texte (sans accents, minuscules, sans ponctuation)
 */
function cleanText(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .trim();
}

/**
 * Extrait les mots-clés significatifs (en filtrant les petits mots d'arrêt)
 */
function extractKeywords(str) {
  const stopWords = new Set([
    "le",
    "la",
    "les",
    "un",
    "une",
    "des",
    "du",
    "de",
    "d",
    "c",
    "ce",
    "cet",
    "cette",
    "ces",
    "est",
    "sont",
    "qui",
    "que",
    "quoi",
    "comment",
    "quand",
    "ou",
    "quel",
    "quelle",
    "quelles",
    "quels",
    "pour",
    "dans",
    "sur",
    "avec",
    "par",
    "quentin",
    "tibo",
    "ton",
    "sa",
    "son",
    "ses",
    "tes",
    "mes",
    "faire",
    "fait",
    "a",
    "au",
    "aux",
    "peux",
    "peut",
    "estce",
    "moi",
    "lui",
  ]);

  return cleanText(str)
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));
}

/**
 * Cherche dans l'historique si une question similaire a déjà été posée
 */
function findSimilarQuestion(newQuestion) {
  const newClean = cleanText(newQuestion);
  const newWords = extractKeywords(newQuestion);

  for (const item of conversationCache) {
    const itemClean = cleanText(item.original);

    // 1. Correspondance exacte ou quasi exacte du texte nettoyé
    if (newClean === itemClean) {
      return item;
    }

    // 2. Correspondance par similarité des mots-clés (Jaccard)
    if (newWords.length > 0 && item.keywords.length > 0) {
      const intersection = newWords.filter((w) => item.keywords.includes(w));
      const union = new Set([...newWords, ...item.keywords]);
      const similarity = intersection.length / union.size;

      // Si au moins 60% de mots-clés communs ou 2+ mots-clés forts identiques
      if (
        similarity >= 0.55 ||
        (intersection.length >= 2 && intersection.length === newWords.length)
      ) {
        return item;
      }
    }
  }

  return null;
}

/**
 * Convertit le markdown (liens, emails, listes, gras) en HTML sécurisé
 */
function formatMarkdown(text) {
  if (!text) return "";

  // 1. Échappement anti-XSS
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 2. Liens markdown: [texte](https://...) ou [texte](mailto:...)
  html = html.replace(
    /\[([^\]]+)\]\(((?:https?:\/\/|mailto:)[^\s)]+)\)/g,
    (match, label, url) => {
      const target = url.startsWith("mailto:")
        ? ""
        : ' target="_blank" rel="noopener noreferrer"';
      return `<a href="${url}"${target}>${label}</a>`;
    },
  );

  // 3. Adresses e-mail brutes (non déjà transformées en balise <a>)
  html = html.replace(
    /(?<!href="|mailto:|>)([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?![^<]*<\/a>)/g,
    '<a href="mailto:$1">$1</a>',
  );

  // 4. Liens URL bruts (non déjà transformés en balise <a>)
  html = html.replace(
    /(?<!href="|">)(https?:\/\/[^\s<)]+)(?![^<]*<\/a>)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>',
  );

  // 5. Gras
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__(.*?)__/g, "<strong>$1</strong>");

  // 6. Italique
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // 7. Listes à puces
  html = html.replace(/^[•\-\*]\s+(.*)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, "<ul>$1</ul>");
  html = html.replace(/<\/ul>\s*<ul>/g, "");

  // 8. Retours à la ligne
  html = html.replace(/\n/g, "<br>");
  html = html.replace(/<br>\s*<ul>/g, "<ul>");
  html = html.replace(/<\/ul>\s*<br>/g, "</ul>");
  html = html.replace(/<br>\s*<li>/g, "<li>");
  html = html.replace(/<\/li>\s*<br>/g, "</li>");

  return html;
}
