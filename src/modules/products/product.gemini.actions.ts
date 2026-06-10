"use server";

export async function generateDescription(
  name: string,
  category: string,
  brand?: string,
) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { success: false, error: "Немає API ключа" };
  }
  const prompt = `
    Напиши короткий, але привабливий та професійний маркетинговий опис для товару українською мовою.
    Назва товару: ${name}
    Категорія: ${category}
    ${brand ? `Бренд: ${brand}` : ""}
    Опис має бути структурованим (можна використовувати маркований список для переваг), довжиною близько 2-4 речень. Не пиши нічого зайвого, тільки сам опис товару.
    `;
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    );
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return {
        success: false,
        error: data.error?.message || "Не вдалося згенерувати опис",
      };
    }
    return { success: true, data: text };
  } catch (error) {
    console.error("Помилка генерації опису:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Не вдалося згенерувати опис",
    };
  }
}
