import 'dotenv/config';
import { NextRequest, NextResponse } from "next/server";

const allowedCategories = [
  "Robotics Competitions",
  "STEM Breakthroughs Made Simple",
  "Youth in Tech Spotlight",
  "Educator Resources",
  "Career Explorer",
  "Space",
  "Biology",
  "Technology"
];

const promptTemplate = `
Write an engaging, informative article for a STEM news site aimed at ages 14-25. The topic is: "{TOPIC}". Do not end with questions or prompts for further discussion. Write in a clear, factual, and enthusiastic tone.

Start the article with a bolded, catchy hook or first sentence using <b>...</b> tags. Then continue the article with informative content. Pick the single most relevant category for the article from this list: [${allowedCategories.map(c => '"' + c + '"').join(', ')}] and include it as a field in the JSON response.

Respond in valid JSON with two fields:
- "category": the single most relevant category from the list above
- "content": the full article body, using the following tags for formatting (do not use markdown or asterisks):
  - <b>...</b> for bold text
  - <i>...</i> for italics
  - <u>...</u> for underline
  - <br> for new paragraphs

Example:
{"category": "Space", "content": "<b>Mars Rover Perseverance Lands in Jezero Crater.</b><br><i>It is searching for signs of life.</i>"}

Do not use any other formatting. Do not include questions at the end. Only output the JSON object.
`;

function extractTitleFromContent(content: string): string {
  // Find the first <b>...</b> or first sentence up to a period or <br>
  const boldMatch = content.match(/<b>(.*?)<\/b>/i);
  if (boldMatch && boldMatch[1]) {
    // Remove trailing punctuation and whitespace
    return boldMatch[1].replace(/[.\s]+$/, "").trim();
  }
  // Fallback: first sentence up to period or <br>
  const plain = content.replace(/<[^>]+>/g, "");
  const firstSentence = plain.split(/[.\n]/)[0];
  return firstSentence.trim();
}

export async function POST(req: NextRequest) {
  const { prompt: userTopic } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing Gemini API key." }, { status: 500 });
  }
  if (!userTopic) {
    return NextResponse.json({ error: "Missing prompt." }, { status: 400 });
  }

  // Build the prompt for Gemini
  const prompt = promptTemplate.replace('{TOPIC}', userTopic);

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        })
      }
    );
    const geminiData = await geminiRes.json();
    if (!geminiRes.ok || !geminiData.candidates || !geminiData.candidates[0]?.content?.parts[0]?.text) {
      return NextResponse.json({
        error: "Gemini could not generate content.",
        raw: geminiData
      }, { status: 500 });
    }
    let content = "";
    let category = "";
    let parseError = null;
    let aiText = geminiData.candidates[0].content.parts[0].text || "";
    // Remove markdown code block if present
    aiText = aiText.trim();
    if (aiText.startsWith("```json")) {
      aiText = aiText.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (aiText.startsWith("```")) {
      aiText = aiText.replace(/^```/, "").replace(/```$/, "").trim();
    }
    try {
      const json = JSON.parse(aiText);
      content = json.content || "";
      category = json.category || "";
    } catch (err) {
      parseError = err;
      content = aiText;
      category = allowedCategories[0];
    }
    if (!content || !category) {
      return NextResponse.json({
        error: "AI could not generate content.",
        raw: geminiData,
        parseError: parseError ? String(parseError) : undefined,
      }, { status: 200 });
    }
    // Extract title from first bolded sentence or first sentence
    const title = extractTitleFromContent(content);

    // Robust image fetching from Pexels
    let imageUrl = "";
    try {
      const pexelsKey = process.env.PEXELS_API_KEY;
      if (pexelsKey) {
        const pexelsRes = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(userTopic)}&per_page=5`,
          { headers: { Authorization: pexelsKey } }
        );
        const pexelsData = await pexelsRes.json();
        // Find the first valid image
        const validPhoto = (pexelsData.photos || []).find((photo: any) => photo?.src?.large);
        imageUrl = validPhoto?.src?.large || "";
      }
    } catch {}
    if (!imageUrl) {
      imageUrl = "/placeholder-1.jpg";
    }

    return NextResponse.json({ title, content, category, image_url: imageUrl });
  } catch (err: unknown) {
    return NextResponse.json({
      error: (err as Error).message || "Failed to generate article.",
      raw: err
    }, { status: 500 });
  }
} 