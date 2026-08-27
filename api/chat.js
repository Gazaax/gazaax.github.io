export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Clé API non configurée" });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const systemPrompt =
    "Tu es l'assistant virtuel du portfolio de Quentin. Réponds de manière courte et professionnelle aux recruteurs sur ses compétences (HTML, CSS, JS, PHP, WooCommerce, Git).";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${systemPrompt}\n\nQuestion du visiteur : ${message}` },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Désolé, je n'ai pas pu générer de réponse.";

    return res.status(200).json({ reply });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erreur lors de la communication avec le serveur" });
  }
}
