// Google Gemini API Gateway (BYOK - Bring Your Own Key Support)
// Enhanced with AI-Tools-Manager architecture & normalization

export function normalizeGeminiKey(raw) {
  if (!raw) return "";
  let k = String(raw).trim().replace(/^["'`\\ \t\r\n]+|["'`\\ \t\r\n]+$/g, "");
  k = k.replace(/^(?:[a-zA-Z_-]*key\s*[:=]\s*|[0-9]+\.\s*)/i, "").trim();
  if (k.startsWith("Ab8RN6") && !k.startsWith("AQ.")) {
    k = "AQ." + k;
  } else if (k.startsWith("c5uW9n0r3ZZ35wgMXA0x8H409xZA7z0P7n6uk_MpCQ")) {
    k = "AQ.Ab8RN6Jn" + k;
  } else if (k.startsWith("n4Tc9Bq1_YaoJoChKEgV2WfyiAtU4gzr3BOa2VFCEA")) {
    k = "AQ.Ab8RN6KF" + k;
  } else if (k.startsWith("OXCxdL2Z15oq4gs9c3ZYiaqkPV4pCrQAg1YrjHug7A")) {
    k = "AQ.Ab8RN6LD" + k;
  } else if (k.startsWith("AQ") && !k.startsWith("AQ.")) {
    k = "AQ." + k.substring(2);
  }
  return k.trim();
}

export async function getAvailableGeminiModels(apiKey) {
  const cleanKey = normalizeGeminiKey(apiKey);
  if (!cleanKey) return [];
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(cleanKey)}`, {
      headers: { "User-Agent": "AKAAIToolsPilot-Android" }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.models)) {
        return data.models
          .filter((m) => {
            const methods = m.supportedGenerationMethods || [];
            if (!methods.includes("generateContent")) return false;
            const name = (m.name || "").replace(/^models\//, "").trim();
            if (!name) return false;
            const lower = name.toLowerCase();
            return !lower.includes("2.0-flash") &&
                   !lower.includes("2.5-flash") &&
                   !lower.includes("2.5-pro") &&
                   !lower.includes("-image") &&
                   !lower.includes("-tts") &&
                   !lower.includes("embedding") &&
                   !lower.includes("robotics") &&
                   !lower.includes("computer-use") &&
                   !lower.includes("veo") &&
                   !lower.includes("lyria");
          })
          .map((m) => m.name.replace(/^models\//, "").trim());
      }
    }
  } catch (e) {
    console.warn("Failed to fetch models from Google API:", e);
  }
  return [];
}

export async function testGeminiApiKey(apiKey) {
  const cleanKey = normalizeGeminiKey(apiKey);
  if (!cleanKey) {
    return { valid: false, message: "API key tidak boleh kosong." };
  }

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(cleanKey)}`, {
      headers: { "User-Agent": "AKAAIToolsPilot-Android" }
    });
    const code = res.status;
    const respStr = await res.text();

    if (code >= 200 && code <= 299) {
      let models = [];
      try {
        const data = JSON.parse(respStr);
        models = (data.models || [])
          .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
          .map((m) => m.name.replace(/^models\//, ""));
      } catch {}
      return {
        valid: true,
        message: `API Key valid dan siap digunakan! (${models.length} model aktif)`,
        models
      };
    } else if (code === 400 || respStr.includes("API_KEY_INVALID") || respStr.includes("API key not valid")) {
      return { valid: false, message: "API Key Tidak Valid (400). Periksa di Google AI Studio (aistudio.google.com)." };
    } else if (code === 403 || respStr.includes("PERMISSION_DENIED") || respStr.includes("denied access")) {
      return { valid: false, message: "API Key Ditolak Google (403: Project Denied). Akun Google Cloud ini dibatasi. Buat key baru dengan akun Google lain di aistudio.google.com" };
    } else if (code === 429) {
      return { valid: false, message: "Limit Kuota Gemini Tercapai (429). Coba gunakan akun Google lain atau tunggu beberapa saat." };
    } else {
      return { valid: false, message: `Error Google HTTP ${code}: ${respStr.substring(0, 100)}` };
    }
  } catch (error) {
    return { valid: false, message: error.message || "Gagal menghubungkan ke Google Gemini API." };
  }
}

export async function generateTextWithGemini(
  apiKey,
  prompt,
  systemInstruction,
  model = "gemini-3.8-flash"
) {
  const cleanKey = normalizeGeminiKey(apiKey);
  if (!cleanKey) {
    throw new Error("API Key belum diisi atau tidak valid.");
  }

  // 1. Fetch available dynamic models from Google for this key
  const availableModels = await getAvailableGeminiModels(cleanKey);

  // 2. Build prioritized candidate list matching AI-Tools-Manager architecture
  let candidates = [
    "gemini-3.5-flash",
    "gemini-3.6-flash",
    "gemini-3.8-flash",
    "gemini-3.5-flash-lite",
    "gemini-3-flash-preview",
    "gemini-flash-latest",
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro",
    "gemini-pro"
  ];

  if (model && model.trim()) {
    const cleanRequested = model.trim().replace(/^models\//, "");
    if (!candidates.includes(cleanRequested)) {
      candidates.unshift(cleanRequested);
    }
  }

  // Add available models discovered dynamically from Google
  if (availableModels.length > 0) {
    for (const d of availableModels) {
      if (!candidates.includes(d)) {
        candidates.push(d);
      }
    }
  }

  let lastError = null;

  // 3. Try each candidate until one succeeds (instant silent model failover)
  for (const cand of candidates) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${cand}:generateContent?key=${encodeURIComponent(cleanKey)}`;

      const body = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      };

      if (systemInstruction) {
        body.systemInstruction = {
          parts: [{ text: systemInstruction }],
        };
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "AKAAIToolsPilot-Android"
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const respStr = await response.text();
        if (response.status === 400 && (respStr.includes("API_KEY_INVALID") || respStr.includes("API key not valid"))) {
          throw new Error("API Key Google Gemini tidak valid atau belum aktif.");
        }
        if (response.status === 404) {
          // Model does not exist, quietly try next
          continue;
        }
        if (response.status === 429) {
          lastError = new Error("Limit kuota Gemini tercapai (429)");
          continue;
        }
        if (response.status === 503 || respStr.includes("high demand") || respStr.includes("overloaded")) {
          lastError = new Error("Server Google AI Studio sedang antrian trafik tinggi (HTTP 503)");
          continue;
        }
        lastError = new Error(`Google Error (${response.status}): ${respStr.substring(0, 100)}`);
        continue;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        console.log(`Berhasil generate teks menggunakan model: ${cand}`);
        return text;
      }
    } catch (e) {
      if (e.message && e.message.includes("API Key Google Gemini tidak valid")) {
        throw e;
      }
      console.warn(`Gagal fetch model ${cand}:`, e.message);
      lastError = e;
    }
  }

  throw lastError || new Error("Semua kandidat model Gemini gagal merespon. Pastikan API Key valid di Google AI Studio.");
}

export function cleanAndEnrichImagePrompt(rawPrompt) {
  let p = (rawPrompt || "").trim();
  p = p.replace(/\b(SFX|VO|Audio|Dialog|Dubbing)\s*:[^,\n.]*/gi, "");
  p = p.replace(/["'“”]/g, " ").trim();
  const lower = p.toLowerCase();

  // Shoes / Sneakers
  if (lower.includes("sepatu") || lower.includes("sneaker") || lower.includes("shoes") || lower.includes("footwear")) {
    return `Commercial studio product photography of athletic running shoes sneakers footwear, ${p}, elegantly placed on a smooth minimalist podium, soft dual softbox lighting, subtle reflections, clean gradient background, shallow depth of field, premium e-commerce advertisement aesthetic, photorealistic, 8k resolution, shot on 85mm prime lens f/2.8, sharp focus`;
  }
  // Fashion / Clothing
  if (lower.includes("baju") || lower.includes("kaos") || lower.includes("pakaian") || lower.includes("hoodie") || lower.includes("jacket") || lower.includes("fashion")) {
    return `Commercial fashion studio photoshoot of stylish contemporary streetwear apparel clothing, ${p}, premium textile texture, softbox lighting, clean studio background, shot on Hasselblad medium format camera, 8k resolution, photorealistic`;
  }
  // Skincare / Cosmetics
  if (lower.includes("skincare") || lower.includes("serum") || lower.includes("kosmetik") || lower.includes("cream")) {
    return `Commercial beauty product photography of luxury skincare cosmetic serum bottle, ${p}, with crystal clear frozen water splash droplets, soft diffused studio light, subtle reflection on minimalist marble surface, 8k resolution, ultra-realistic, shot on 85mm macro lens`;
  }
  // Food / Culinary
  if (lower.includes("makanan") || lower.includes("kuliner") || lower.includes("burger") || lower.includes("mie") || lower.includes("nasi") || lower.includes("ayam")) {
    return `Appetizing gourmet culinary dish, ${p}, plated with fresh herbs, steam rising, commercial food advertisement photography, 8k resolution, shallow depth of field, soft warm restaurant lighting, photorealistic`;
  }
  // Drink / Coffee
  if (lower.includes("kopi") || lower.includes("minuman") || lower.includes("boba") || lower.includes("tea") || lower.includes("jus")) {
    return `Commercial beverage photography of refreshing iced drink cup, ${p}, with glistening condensation droplets and ice cubes, dramatic rim lighting, vibrant colors, 8k resolution, ultra-clean aesthetic`;
  }
  // Bag / Backpack
  if (lower.includes("tas") || lower.includes("backpack") || lower.includes("dompet")) {
    return `Commercial product photography of premium designer leather backpack bag, ${p}, on modern pedestal, studio lighting, detailed leather stitching, 8k resolution, photorealistic`;
  }
  // Watch
  if (lower.includes("jam") || lower.includes("arloji") || lower.includes("watch")) {
    return `Extreme macro commercial luxury wristwatch chronometer timepiece photography, ${p}, sapphire crystal reflection, metallic bevels, dramatic studio lighting, 8k UHD, photorealistic`;
  }
  // Tech / Phone
  if (lower.includes("hp") || lower.includes("ponsel") || lower.includes("smartphone") || lower.includes("gadget")) {
    return `Commercial product reveal photography of sleek futuristic smartphone, ${p}, with edge-to-edge vibrant OLED screen, volumetric lighting, minimalist podium, 8k resolution, photorealistic`;
  }
  // Scenery / Nature / Sunset / River / Drama
  if (lower.includes("senja") || lower.includes("sunset") || lower.includes("sungai") || lower.includes("danau") || lower.includes("river") || lower.includes("alam")) {
    return `Cinematic landscape photography of peaceful river during sunset golden hour, ${p}, warm orange amber sky reflections on tranquil flowing water, moody contemplative atmosphere, shot on 35mm cinema lens, 8k resolution, photorealistic, sharp focus`;
  }

  return `${p}, commercial studio photography, soft dual softbox lighting, shallow depth of field, 8k resolution, photorealistic, shot on 85mm prime lens f/2.8`;
}

export async function generateImageWithGemini(
  apiKey,
  options = {}
) {
  const { prompt, aspectRatio = "1:1", negativePrompt } = options;
  const cleanKey = normalizeGeminiKey(apiKey);

  let width = 1024;
  let height = 1024;
  if (aspectRatio === "9:16") { width = 720; height = 1280; }
  else if (aspectRatio === "16:9") { width = 1280; height = 720; }
  else if (aspectRatio === "4:5") { width = 864; height = 1080; }

  // 1. Transform prompt into camera-grade English Masterpiece Prompt
  let masterPrompt = cleanAndEnrichImagePrompt(prompt);

  // 2. Try Google Gemini Native Image Generation via responseModalities: ["IMAGE"]
  if (cleanKey) {
    const geminiImageModels = [
      "gemini-2.0-flash-exp",
      "gemini-2.5-flash-image",
      "nano-banana"
    ];
    for (const imgMod of geminiImageModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${imgMod}:generateContent?key=${encodeURIComponent(cleanKey)}`;
        const imgRatio = aspectRatio === "9:16" ? "9:16" : (aspectRatio === "16:9" ? "16:9" : (aspectRatio === "4:5" ? "4:5" : "1:1"));
        const body = {
          contents: [{ parts: [{ text: masterPrompt }] }],
          generationConfig: {
            responseModalities: ["IMAGE"],
            imageConfig: {
              aspectRatio: imgRatio
            }
          }
        };
        const resp = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        if (resp.ok) {
          const data = await resp.json();
          const part = data?.candidates?.[0]?.content?.parts?.[0];
          const b64 = part?.inlineData?.data;
          const mime = part?.inlineData?.mimeType || "image/jpeg";
          if (b64) {
            console.log(`Berhasil generate gambar dengan Google Gemini API model: ${imgMod}`);
            return `data:${mime};base64,${b64}`;
          }
        }
      } catch (e) {
        // try next
      }
    }
  }

  // 3. Try Google Imagen 3 if available with provided key
  if (cleanKey) {
    try {
      const imagenUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${encodeURIComponent(cleanKey)}`;
      const imgRatio = aspectRatio === "4:5" ? "3:4" : (aspectRatio === "16:9" || aspectRatio === "9:16" ? aspectRatio : "1:1");
      const resp = await fetch(imagenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt: masterPrompt + (negativePrompt ? `, avoid: ${negativePrompt}` : '') }],
          parameters: { sampleCount: 1, aspectRatio: imgRatio }
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        const b64 = data?.predictions?.[0]?.bytesBase64Encoded;
        const mime = data?.predictions?.[0]?.mimeType || "image/jpeg";
        if (b64) return `data:${mime};base64,${b64}`;
      }
    } catch (e) {
      // fallback
    }
  }

  // 4. Server-Side Lightning-Fast Generation (model=turbo, 2-4 seconds)
  const finalPrompt = `${masterPrompt}${negativePrompt ? ` (exclude: ${negativePrompt})` : ''}`;
  const seed = Math.floor(Math.random() * 899999) + 100000;

  try {
    const turboUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?model=turbo&width=${width}&height=${height}&seed=${seed}&nologo=true`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const imgFetch = await fetch(turboUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (imgFetch.ok) {
      const buf = await imgFetch.arrayBuffer();
      const b64 = Buffer.from(buf).toString("base64");
      const contentType = imgFetch.headers.get("content-type") || "image/jpeg";
      return `data:${contentType};base64,${b64}`;
    }
  } catch (err) {
    console.warn("Turbo fetch fallback, trying flux:", err.message);
  }

  try {
    const fluxUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?model=flux&width=${width}&height=${height}&seed=${seed}&nologo=true`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    const imgFetch = await fetch(fluxUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (imgFetch.ok) {
      const buf = await imgFetch.arrayBuffer();
      const b64 = Buffer.from(buf).toString("base64");
      const contentType = imgFetch.headers.get("content-type") || "image/jpeg";
      return `data:${contentType};base64,${b64}`;
    }
  } catch (err) {
    console.warn("Flux fetch fallback:", err.message);
  }

  return `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?model=turbo&width=${width}&height=${height}&seed=${seed}&nologo=true`;
}

export async function generateTTSWithGemini(
  apiKey,
  text,
  voiceName = "Kore",
  language = "id"
) {
  const cleanText = (text || "").replace(/[*_#`~\[\]]/g, " ").trim();
  if (!cleanText) {
    throw new Error("Teks narasi wajib diisi.");
  }

  let langCode = "id";
  const lowerLang = (language || "").toLowerCase();
  const lowerVoice = (voiceName || "").toLowerCase();
  if (
    lowerLang.includes("en") ||
    lowerLang.includes("english") ||
    lowerVoice.includes("leda") ||
    lowerVoice.includes("puck")
  ) {
    langCode = "en";
  }

  const words = cleanText.split(/\s+/);
  const chunks = [];
  let current = "";
  for (const w of words) {
    if ((current + " " + w).trim().length <= 180) {
      current = (current + " " + w).trim();
    } else {
      if (current) chunks.push(current);
      current = w;
    }
  }
  if (current) chunks.push(current);

  const audioBuffers = [];
  for (const chunk of chunks) {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=${langCode}&client=tw-ob`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://translate.google.com/"
      }
    });
    if (!res.ok) {
      throw new Error(`Gagal menghasilkan audio TTS (Status ${res.status})`);
    }
    const arrayBuf = await res.arrayBuffer();
    audioBuffers.push(Buffer.from(arrayBuf));
  }

  const finalMp3Buffer = Buffer.concat(audioBuffers);
  return {
    audioBase64: finalMp3Buffer.toString("base64"),
    mimeType: "audio/mp3",
  };
}

export async function generatePromptStudioWithGemini(
  apiKey,
  options = {}
) {
  const { prompt, category = "foto", aspectRatio = "1:1", negativePrompt } = options;
  const cleanKey = normalizeGeminiKey(apiKey);

  const cleanPrompt = (prompt || "").trim();
  const safeNeg = negativePrompt && negativePrompt.trim() 
    ? negativePrompt.trim() 
    : "lowres, blurry, bad anatomy, extra limbs, distorted text, low quality, artifacts, watermark, logo";

  const baseMasterPrompt = cleanAndEnrichImagePrompt(cleanPrompt);
  const ratioLabel = aspectRatio === "9:16" ? "9:16 (Portrait / Reels / TikTok)" : (aspectRatio === "16:9" ? "16:9 (Landscape / YouTube)" : (aspectRatio === "4:5" ? "4:5 (Feed IG)" : "1:1 (Persegi)"));

  let lensSpec = "85mm Prime Lens f/2.8";
  let lightingSpec = "Studio Softbox Lighting dengan rim-light kontras halus";
  let styleSpec = "Commercial Ultra-HD Photography 8K";

  if (category === "thumbnail") {
    lensSpec = "24-70mm f/2.8 Cinematic Wide";
    lightingSpec = "High Contrast Vibrant Dramatic Lighting";
    styleSpec = "High CTR YouTube Visual Composition";
  } else if (category === "infographic") {
    lensSpec = "Vector Digital Studio Layout";
    lightingSpec = "Clean Uniform Graphic Lighting";
    styleSpec = "Modern Infographic Minimalist Aesthetic";
  } else if (category === "ugc") {
    lensSpec = "35mm Mobile Lens Aesthetic f/1.8";
    lightingSpec = "Natural Ambient Daylight";
    styleSpec = "Authentic UGC Creator Ad Aesthetic";
  } else if (category === "character") {
    lensSpec = "50mm Prime Portrait Lens f/2.0";
    lightingSpec = "Neutral 3-Point Studio Lighting";
    styleSpec = "Character Sheet Turnaround Model Sheet";
  } else if (category === "poster") {
    lensSpec = "Graphic Art Director Studio Framing";
    lightingSpec = "Dynamic Mood Lighting";
    styleSpec = "Commercial Poster Key Visual";
  }

  let result = {
    category,
    aspectRatio,
    title: `Kreasi ${category.toUpperCase()}: ${cleanPrompt.substring(0, 40)}`,
    masterPrompt: `${baseMasterPrompt}, aspect ratio ${aspectRatio}, photorealistic, 8k resolution`,
    conceptId: `Visual ${category} berfokus pada subjek utama: "${cleanPrompt}". Komposisi dirancang dengan penataan sudut yang seimbang, kontras warna yang tegas, dan hierarki visual yang mengarahkan perhatian audiens secara instan.`,
    negativePrompt: safeNeg,
    cameraSettings: {
      lens: lensSpec,
      lighting: lightingSpec,
      style: styleSpec,
      aspectRatio: ratioLabel,
      resolution: "8K UHD Photorealistic"
    },
    socialCaption: `🔥 Konsep visual terbaru untuk ${cleanPrompt.substring(0, 50)}! Dirancang dengan gaya ${styleSpec} dan pencahayaan ${lightingSpec} untuk memaksimalkan daya tarik visual. Apa tanggapan Anda? Tulis di kolom komentar! 👇`,
    hashtags: ["#StoryInAI", `#${category.replace(/[\s&]+/g, '')}`, "#PromptEngineering", "#AIArt", "#CommercialDesign", "#ContentCreator"]
  };

  if (cleanKey) {
    try {
      const systemInstruction = "You are an expert AI Art Director, Prompt Engineer, and Social Media Copywriter for 'Story In. AI'. Output ONLY valid JSON.";
      const userInstruction = `Generate complete creative visual prompts and social media copy for this request:
Category: "${category}"
Concept/Subject: "${cleanPrompt}"
Aspect Ratio: "${aspectRatio}"

Output a JSON object with this exact structure:
{
  "title": "Judul kreatif singkat dalam Bahasa Indonesia",
  "masterPrompt": "Highly detailed, camera-grade English masterpiece prompt for Imagen 3/Midjourney v6/Flux. Focus on subject, exact lens (${lensSpec}), studio lighting, shallow depth of field, 8k resolution. No markdown.",
  "conceptId": "Deskripsi detail tata visual, warna, dan komposisi subjek dalam Bahasa Indonesia (2-3 kalimat).",
  "negativePrompt": "lowres, blurry, bad anatomy, distorted, artifacts, watermark",
  "cameraSettings": {
    "lens": "${lensSpec}",
    "lighting": "${lightingSpec}",
    "style": "${styleSpec}",
    "aspectRatio": "${ratioLabel}",
    "resolution": "8K UHD Photorealistic"
  },
  "socialCaption": "Copywriting caption media sosial menarik dalam Bahasa Indonesia dengan hook dan CTA",
  "hashtags": ["#StoryInAI", "#AIArt", "#ContentCreator"]
}`;

      const aiText = await generateTextWithGemini(cleanKey, userInstruction, systemInstruction, "gemini-3.8-flash");
      const cleanedJson = aiText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
      const parsed = JSON.parse(cleanedJson);
      if (parsed.masterPrompt) {
        result = {
          category,
          aspectRatio,
          title: parsed.title || result.title,
          masterPrompt: parsed.masterPrompt || result.masterPrompt,
          conceptId: parsed.conceptId || result.conceptId,
          negativePrompt: parsed.negativePrompt || result.negativePrompt,
          cameraSettings: parsed.cameraSettings || result.cameraSettings,
          socialCaption: parsed.socialCaption || result.socialCaption,
          hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : result.hashtags
        };
      }
    } catch (e) {
      console.warn("AI prompt enhancement fallback to internal creative engine:", e.message);
    }
  }

  return result;
}
