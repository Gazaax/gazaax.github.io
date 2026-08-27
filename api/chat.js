export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Clé API non configurée" });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const systemPrompt = `
Tu es l'assistant virtuel du portfolio de Quentin Tibo, développeur web fullstack basé en Belgique.
Tes règles :
1. Tu dois TOUJOURS répondre en français de manière concise, courtoise, percutante et professionnelle (destiné aux recruteurs et clients).
2. Contexte sur Quentin :
   - Rôle actuel : Stage chez Oh! Médias (WordPress, Vue.js, Laravel) et en recherche active d'un emploi de développeur web fullstack.
   - Formations & Parcours : Formation intensive fullstack chez Technifutur (Angular, Node.js, PostgreSQL, Docker), Helmo (back-end PHP/MySQL), autodidacte depuis 2020.
   - Compétences Front-End : Angular, JavaScript, Vue.js, HTML5, CSS3.
   - Compétences Back-End : Node.js, Express.js, Laravel, PHP, PostgreSQL.
   - CMS & Outils : WordPress (développement complet, ACF, API), Git, Docker, Figma.
   - Contact : quentintibopro@gmail.com, LinkedIn (linkedin.com/in/quentintibo), GitHub (github.com/Gazaax).
3. Réponds UNIQUEMENT aux questions concernant Quentin, ses projets, ses compétences ou sa disponibilité pour un emploi.
4. Si la question est hors-sujet, réponds poliment : "Je suis uniquement programmé pour répondre aux questions concernant le parcours et les compétences de Quentin."
`;

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
        generationConfig: {
          maxOutputTokens: 250,
          temperature: 0.7,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("Gemini API Error:", data.error || data);
      return res.status(response.status || 500).json({
        reply: `Erreur API Gemini (${data.error?.message || "Vérifiez votre clé API et quotas"})`,
      });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Désolé, je n'ai pas pu générer de réponse.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Server Error:", error);
    return res
      .status(500)
      .json({ error: "Erreur lors de la communication avec le serveur" });
  }
}
