const Groq = require("groq-sdk");
const { getCachedPrompt, setCachedPrompt } = require("./promptCache");

const SUPPORTED_REFERENCE_IMAGE_HOSTS = new Set([
  "image.pollinations.ai",
  "pollinations.ai"
]);

const groqClient = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

const ratioMap = {
  "16:9": {
    label: "cinematic wide 16:9 YouTube thumbnail composition",
    width: 1280,
    height: 720
  },
  "1:1": {
    label: "balanced 1:1 square social media composition",
    width: 1080,
    height: 1080
  },
  "9:16": {
    label: "vertical 9:16 mobile-first video composition",
    width: 1080,
    height: 1920
  },
  "4:5": {
    label: "professional 4:5 portrait social media composition",
    width: 1080,
    height: 1350
  }
};

const sanitizeText = (value) => String(value || "").replace(/\s+/g, " ").trim();

const compactPrompt = (value) => {
  const cleaned = sanitizeText(value)
    .replace(/^["']+|["']+$/g, "")
    .replace(/\.\s+/g, ", ")
    .replace(/\s*,\s*/g, ", ");

  if (!cleaned) {
    return "";
  }

  const words = cleaned.split(" ").filter(Boolean).slice(0, 60);
  return words.join(" ").slice(0, 400).trim().replace(/[.,;:!?]+$/g, "");
};

const joinColors = (colors) => (
  colors && colors.length ? colors.join(", ") : "vibrant cinematic colors, high contrast"
);

const createPromptTemplate = (payload) => {
  const colors = joinColors(payload.colors);
  const style = payload.style || "Bold";
  const aspectConfig = ratioMap[payload.aspectRatio] || ratioMap["16:9"];
  const title = sanitizeText(payload.title);
  const extraPrompt = sanitizeText(payload.extraPrompt);
  const changeRequest = sanitizeText(payload.changeRequest);
  
  const modeInstruction = payload.mode === "recreate"
    ? "Refine and elevate this thumbnail. Make it more photorealistic, dramatic, and professional while keeping the original intent."
    : "Create a stunning, photorealistic thumbnail concept that stops the scroll and demands attention.";
    
  const sourceInstruction = payload.sourceImage
    ? "Reference image provided. Analyze the subject and lighting. Replicate the core subject with 10x better quality, ultra-realistic skin textures, and professional studio lighting."
    : "";

  return [
    `Task: Write one elite-tier image generation prompt for a ${aspectConfig.label}.`,
    `Subject/Topic: ${title}.`,
    `Style: ${style} - high-end, hyper-realistic, professional photography.`,
    `Atmosphere: Cinematic lighting, shallow depth of field, 8k resolution, highly detailed textures.`,
    `Color Palette: ${colors}.`,
    modeInstruction,
    sourceInstruction,
    extraPrompt ? `Specific Creative Direction: ${extraPrompt}.` : "",
    changeRequest ? `Change Request: ${changeRequest}.` : "",
    "Requirements: One dominant focal point, intense facial expressions if human, razor-sharp focus on the subject, dramatic rim lighting, clean background separation (bokeh), and clear space for potential text overlays.",
    "Strictly Avoid: Cartoony looks, generic stock photo vibes, flat lighting, blurry subjects, extra limbs, low resolution, and cluttered backgrounds.",
    "Format: Return ONLY the final prompt. NO commentary, NO quotes."
  ].filter(Boolean).join(" ");
};

const createFallbackPrompt = (payload) => {
  const aspectConfig = ratioMap[payload.aspectRatio] || ratioMap["16:9"];
  const direction = [
    `Photorealistic ${payload.style || "Bold"} thumbnail`,
    sanitizeText(payload.title),
    aspectConfig.label,
    "ultra-detailed",
    "professional studio lighting",
    "8k resolution",
    "masterpiece",
    joinColors(payload.colors),
    "clean subject separation",
    "dramatic bokeh",
    sanitizeText(payload.extraPrompt),
    payload.mode === "recreate" ? sanitizeText(payload.changeRequest) : ""
  ].filter(Boolean);

  return compactPrompt(direction.join(", "));
};

const normalizeSourceImageUrl = (value) => {
  const sourceImage = sanitizeText(value);

  if (!sourceImage) {
    return "";
  }

  try {
    const parsedUrl = new URL(sourceImage);

    if (parsedUrl.pathname.endsWith("/thumbnails/proxy")) {
      const proxiedUrl = parsedUrl.searchParams.get("url");

      if (!proxiedUrl) {
        return "";
      }

      const originalUrl = new URL(proxiedUrl);
      return ["http:", "https:"].includes(originalUrl.protocol) ? originalUrl.toString() : "";
    }

    return ["http:", "https:"].includes(parsedUrl.protocol) ? parsedUrl.toString() : "";
  } catch (error) {
    return "";
  }
};

const canUseSourceImageForGeneration = (value) => {
  const normalizedUrl = normalizeSourceImageUrl(value);

  if (!normalizedUrl) {
    return false;
  }

  try {
    const parsedUrl = new URL(normalizedUrl);
    return SUPPORTED_REFERENCE_IMAGE_HOSTS.has(parsedUrl.hostname);
  } catch (error) {
    return false;
  }
};

const optimizePrompt = async (payload) => {
  const cached = getCachedPrompt(payload);
  if (cached) {
    return cached;
  }

  const fallback = createFallbackPrompt(payload);

  if (!groqClient) {
    return setCachedPrompt(payload, fallback);
  }

  try {
    const completion = await groqClient.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      temperature: 0.6,
      max_tokens: 150,
      messages: [
        {
          role: "system",
          content: "You are a professional AI prompt engineer specializing in photorealistic, high-CTR YouTube thumbnails. You transform simple ideas into vivid, ultra-detailed, cinematic image prompts. Use descriptive keywords like 'hyper-realistic', 'photorealistic', 'studio lighting', 'bokeh', 'sharp focus', and 'vibrant'. Output only the prompt text. No quotes."
        },
        {
          role: "user",
          content: createPromptTemplate(payload)
        }
      ]
    });

    const prompt = compactPrompt(completion.choices?.[0]?.message?.content);
    return setCachedPrompt(payload, prompt || fallback);
  } catch (error) {
    return setCachedPrompt(payload, fallback);
  }
};

const buildImageUrl = (prompt, aspectRatio, options = {}) => {
  const aspectConfig = ratioMap[aspectRatio] || ratioMap["16:9"];
  const seed = Math.floor(Math.random() * 1000000);
  const query = new URLSearchParams({
    width: String(aspectConfig.width),
    height: String(aspectConfig.height),
    seed: String(seed),
    model: options.sourceImage ? "kontext" : "flux-realism",
    enhance: "true",
    nologo: "true",
    private: "true",
    safe: "false",
    negative: "unrealistic, cartoon, anime, illustration, painting, drawing, sketches, low quality, blurry, distorted, extra limbs, bad anatomy, text, watermark, signature, cluttered, messy"
  });

  if (options.sourceImage) {
    query.set("image", options.sourceImage);
  }

  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${query.toString()}`;
};

const sleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const warmImageUrl = async (imageUrl, attempts = 3) => {
  for (let index = 0; index < attempts; index += 1) {
    try {
      const response = await fetch(imageUrl, {
        headers: {
          Accept: "image/*"
        }
      });

      if (response.ok) {
        await response.arrayBuffer();
        return imageUrl;
      }
    } catch (error) {
      // Ignore transient upstream failures and retry below.
    }

    await sleep(700 * (index + 1));
  }

  return imageUrl;
};

module.exports = {
  optimizePrompt,
  buildImageUrl,
  normalizeSourceImageUrl,
  canUseSourceImageForGeneration,
  warmImageUrl
};
