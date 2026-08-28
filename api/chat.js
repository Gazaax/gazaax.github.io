export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Clé API non configurée" });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;
  const systemPrompt = `
Tu es l'assistant virtuel du portfolio de Quentin Tibo, développeur web fullstack basé en Belgique.
Directives strictes :
1. Réponds directement, clairement et professionnellement en français, sans aucun préambule inutile ni méta-commentaire (pas de "Context check", "Bonjour" à chaque message, etc.).
2. Fais des réponses courtes mais COMPLÈTES (utilise des puces si on te demande une liste).
3. Contexte sur Quentin :
   - Statut actuel : Développeur web fullstack en recherche active d'emploi. Actuellement en stage chez Oh! Médias (WordPress, Vue.js, Laravel).
   - Formations : Formation intensive fullstack chez Technifutur (Angular, Node.js, PostgreSQL, Docker), Helmo (back-end PHP/MySQL), autodidacte passionné depuis 2020.
   - Compétences Front-End : Angular, JavaScript, Vue.js, HTML5, CSS3.
   - Compétences Back-End : Node.js, Express.js, Laravel, PHP, PostgreSQL.
   - CMS & Outils : WordPress (développement complet, ACF, API), Git, Docker, Figma.
   - Projet phare : Chess Tournament Manager (application fullstack de gestion de tournois d'échecs).
   - Contact : Email (quentintibopro@gmail.com), LinkedIn (https://linkedin.com/in/quentintibo), GitHub (https://github.com/Gazaax).
4. Fournis des liens markdown complets [Texte](https://...) lorsque l'on te demande ses contacts ou ses profils.
5. Réponds UNIQUEMENT aux questions liées à Quentin, ses projets, ses compétences ou son recrutement. Pour tout sujet hors-contexte, réponds simplement : "Je suis programmé pour répondre uniquement aux questions concernant le profil et les projets de Quentin."
6. Si une question est liée à Quentin mais que tu ne trouves pas la réponse, répond simplement : "Je n'ai pas la réponse à votre question mais vous pouvez contacter Quentin par email à [quentintibopro@gmail.com] ."
`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 800,
          temperature: 0.3,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("Gemini API Error:", data.error || data);
      return res.status(response.status || 500).json({
        reply: `Erreur: Veuillez réessayer plus tard.`,
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
