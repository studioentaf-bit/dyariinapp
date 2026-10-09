import express from 'express';
import {
  generateTextWithGemini,
  generatePromptStudioWithGemini,
  generateImageWithGemini,
  generateTTSWithGemini,
  testGeminiApiKey,
  normalizeGeminiKey
} from '../lib/gemini.js';

const router = express.Router();

function extractSubjectAndEnglishContext(prompt) {
  const p = (prompt || '').toLowerCase();
  
  if (p.includes("sepatu") || p.includes("sneaker") || p.includes("shoes") || p.includes("footwear")) {
    return { subjectEn: "modern athletic running shoes sneakers footwear", category: "product_shoes" };
  }
  if (p.includes("baju") || p.includes("kaos") || p.includes("pakaian") || p.includes("jacket") || p.includes("hoodie") || p.includes("fashion")) {
    return { subjectEn: "stylish contemporary fashion apparel clothing streetwear", category: "product_fashion" };
  }
  if (p.includes("skincare") || p.includes("serum") || p.includes("kosmetik") || p.includes("cream") || p.includes("kulit")) {
    return { subjectEn: "luxury cosmetic skincare serum bottle with water droplets", category: "product_skincare" };
  }
  if (p.includes("makanan") || p.includes("kuliner") || p.includes("burger") || p.includes("mie") || p.includes("nasi") || p.includes("ayam") || p.includes("snack")) {
    return { subjectEn: "gourmet delicious appetizing food cuisine plated with fresh garnishes", category: "food" };
  }
  if (p.includes("kopi") || p.includes("minuman") || p.includes("boba") || p.includes("jus") || p.includes("tea")) {
    return { subjectEn: "refreshing iced beverage cup with condensation droplets and coffee beans", category: "drink" };
  }
  if (p.includes("tas") || p.includes("backpack") || p.includes("dompet")) {
    return { subjectEn: "premium luxury leather designer backpack bag", category: "product_bag" };
  }
  if (p.includes("jam") || p.includes("arloji") || p.includes("watch")) {
    return { subjectEn: "luxury Swiss precision chronometer wristwatch timepiece", category: "product_watch" };
  }
  if (p.includes("hp") || p.includes("ponsel") || p.includes("smartphone") || p.includes("iphone") || p.includes("gadget")) {
    return { subjectEn: "futuristic flagship sleek smartphone device with vibrant bezel-less screen", category: "tech" };
  }
  if (p.includes("mobil") || p.includes("car")) {
    return { subjectEn: "sleek modern aerodynamic sports car automotive driving on scenic highway", category: "automotive" };
  }
  if (p.includes("motor") || p.includes("bike")) {
    return { subjectEn: "high performance modern motorcycle sportbike", category: "automotive" };
  }
  if (p.includes("senja") || p.includes("sunset") || p.includes("sungai") || p.includes("danau") || p.includes("river") || p.includes("keheningan") || p.includes("kenangan") || p.includes("alam") || p.includes("pemandangan")) {
    return { subjectEn: "serene peaceful sunset golden hour glowing over gentle flowing river, solitary silhouette, cinematic warm amber lighting, reflective calm water", category: "cinematic_drama" };
  }
  
  const clean = prompt.replace(/[^\w\s]/gi, ' ').trim();
  return { subjectEn: clean || "commercial cinematic subject", category: "general" };
}

function buildCinematicMasterPrompt(subjectEn, category, sceneIdx, totalScenes, aspectRatio) {
  const ratioTag = aspectRatio === "9:16" ? "vertical portrait aspect ratio 9:16" : (aspectRatio === "16:9" ? "widescreen aspect ratio 16:9" : "square aspect ratio 1:1");
  
  if (category === "product_shoes") {
    if (sceneIdx === 1) {
      return `Epic dynamic hero shot of modern athletic running shoes sneakers suspended mid-air, dramatic volumetric neon rim lighting, floating dust particles, high-end commercial advertising photography, 8k resolution, photorealistic, sharp focus, ${ratioTag}`;
    } else if (sceneIdx === 2) {
      return `Extreme macro close-up detail shot of athletic running shoe, showing intricate breathable mesh texture and cushioned sole technology, studio softbox lighting, 8k UHD, clean reflection, photorealistic, ${ratioTag}`;
    } else if (sceneIdx === 3) {
      return `Action shot of athletic runner feet wearing running shoes sneakers sprinting dynamically on dark wet running track, water droplets splashing, cinematic motion blur background, sports commercial cinematography, 8k, ${ratioTag}`;
    } else {
      return `Hero showcase commercial shot of athletic running shoes sneakers displayed on modern sleek pedestal, glowing atmospheric lighting, premium product presentation, photorealistic, 8k, ${ratioTag}`;
    }
  }

  if (category === "cinematic_drama") {
    if (sceneIdx === 1) {
      return `Cinematic establishing shot of serene calm river at sunset golden hour, warm orange and violet horizon reflections in flowing water, quiet contemplative atmosphere, 35mm cinematic film lens, dramatic lighting, 8k resolution, ${ratioTag}`;
    } else if (sceneIdx === 2) {
      return `Emotional medium shot at riverside during twilight, gentle breeze rustling through tall riverside grass, warm golden sunlight rim lighting on water ripples, shallow depth of field, photorealistic, 8k, ${ratioTag}`;
    } else if (sceneIdx === 3) {
      return `Poetic close-up shot of water flowing gently around smooth river stones, catching the last amber rays of sunset, melancholic cinematic mood, high-end cinema camera, 8k, ${ratioTag}`;
    } else {
      return `Wide panoramic cinematic shot of sunset fading into dusk over peaceful winding river, soft gradient twilight sky, emotional narrative conclusion, 8k resolution, ${ratioTag}`;
    }
  }

  const sceneVariations = [
    `Cinematic dynamic opening hook shot of ${subjectEn}, dramatic volumetric lighting, 8k photorealistic photography, highly detailed, ${ratioTag}`,
    `Extreme macro close-up detailed shot highlighting features of ${subjectEn}, studio softbox lighting, shallow depth of field, 8k, ${ratioTag}`,
    `Dynamic action and motion shot featuring ${subjectEn} in active environment, cinematic commercial framing, 8k UHD, ${ratioTag}`,
    `Hero product showcase of ${subjectEn} on modern minimalist pedestal, premium advertising composition, rim light, 8k photorealistic, ${ratioTag}`
  ];

  return sceneVariations[(sceneIdx - 1) % sceneVariations.length];
}

function generateSmartContextualStoryboard(
  prompt,
  mode,
  sceneCount,
  duration,
  aspectRatio,
  language,
  audioMode
) {
  const scenes = [];
  const hooks = [
    "Hook pembuka visual yang menangkap perhatian 3 detik pertama dengan sinematografi tajam",
    "Pengenalan konflik atau rasa penasaran yang memicu empati penonton",
    "Transisi dinamis memperlihatkan solusi utama dan keunggulan konsep",
    "Detail eksplorasi aksi dan interaksi emosional antar karakter atau produk",
    "Klimaks visual dramatis dengan pencahayaan sinematik yang memukau",
    "Call to Action persuasif dengan penutup visual berkesan"
  ];

  const { subjectEn, category } = extractSubjectAndEnglishContext(prompt);

  for (let i = 1; i <= sceneCount; i++) {
    const hookIdx = (i - 1) % hooks.length;
    const masterImagePrompt = buildCinematicMasterPrompt(subjectEn, category, i, sceneCount, aspectRatio);

    scenes.push({
      sceneNumber: i,
      title: `Scene ${i}: ${i === 1 ? "Opening Hook" : (i === sceneCount ? "Climax & Call to Action" : "Story Progression")}`,
      duration: duration || "10s",
      shotsCount: 4,
      narrative: `${hooks[hookIdx]} berdasarkan konsep: "${prompt}". Kamera bergerak dinamis dan terarah.`,
      dialogue: audioMode.includes("No Voice")
        ? ""
        : (i === 1
            ? `Pernahkah Anda membayangkan: ${prompt.substring(0, 45)}? Simak rahasianya!`
            : (i === sceneCount
                ? "Dapatkan solusinya sekarang juga sebelum kehabisan!"
                : "Inilah titik balik penting yang mengubah segalanya.")),
      camera: i === 1 ? "Extreme Close-Up to Wide Angle dynamic zoom" : (i % 2 === 0 ? "Medium Shot with slow cinematic dolly" : "Low Angle heroic perspective"),
      lighting: "Studio Softbox dengan aksen rim-light sinematik dan palet warna kontras elegan",
      masterImagePrompt,
      masterVideoPrompt: `Smooth cinematic camera dolly motion around ${subjectEn}, 60fps professional video, photorealistic movement, cinematic lens flare`,
      continuityToNext: i < sceneCount ? `Transisi mulus pergerakan kamera menuju Scene ${i + 1}` : "Fade to black dengan logo dan call to action penutup"
    });
  }

  return {
    title: `Storyboard: ${prompt.substring(0, 45)}`,
    logline: `Rancangan video ${mode} dengan alur visual terarah untuk memaksimalkan retensi penonton dan konversi.`,
    targetAudience: "Audiens digital media sosial (TikTok, Instagram Reels, YouTube)",
    visualStyleBible: `Gaya visual sinematik tajam, palet warna elegan, rasio ${aspectRatio}, pencahayaan terarah.`,
    socialPack: {
      caption: `🎬 Saksikan visual video terbaru kami: ${prompt.substring(0, 80)}! Bagikan tanggapan Anda di kolom komentar.`,
      hashtags: ["#StoryInAI", "#VideoCreator", "#Storyboard", "#CinematicVideo", `#${mode.replace(/[\s&]+/g, '')}`]
    },
    scenes
  };
}

// POST /api/ai/storyboard
router.post('/storyboard', async (req, res) => {
  try {
    const {
      prompt,
      mode = req.body.storyboardMode || "commercial",
      settings = {},
      references = {},
      customApiKey,
      apiKey: bodyApiKey,
      model = "gemini-3.8-flash",
    } = req.body;

    const rawApiKey =
      customApiKey ||
      bodyApiKey ||
      req.headers['x-gemini-key'] ||
      process.env.GEMINI_API_KEY;

    const apiKey = normalizeGeminiKey(rawApiKey || "");

    const sceneCount = Number(settings.sceneCount || req.body.sceneCount || 4);
    const duration = settings.duration || req.body.duration || "10s";
    const aspectRatio = settings.aspectRatio || req.body.aspectRatio || "9:16";
    const visualStyle = settings.visualStyle || req.body.visualStyle || "Sinematik Studio Realistis";
    const audioMode = settings.audioMode || req.body.audioMode || "Auto Director (Kontekstual)";
    const language = settings.language || req.body.language || "Bahasa Indonesia";

    if (!prompt || String(prompt).trim() === '') {
      return res.status(400).json({ error: "Prompt ide atau konsep cerita wajib diisi." });
    }

    const systemPrompt = `Anda adalah Sutradara & Produser AI handal berskala internasional.
Tugas Anda adalah merancang storyboard video profesional dengan format JSON terstruktur.
Output HARUS valid JSON murni tanpa markdown wrapper seperti \`\`\`json.

Format JSON yang diwajibkan:
{
  "title": "Judul Proyek / Video",
  "logline": "Ringkasan konsep 1 kalimat",
  "targetAudience": "Target audiens",
  "visualStyleBible": "Deskripsi gaya visual, palet warna, lighting",
  "socialPack": {
    "caption": "Caption menarik untuk postingan TikTok / Instagram Reels",
    "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
  },
  "scenes": [
    {
      "sceneNumber": 1,
      "title": "Nama Scene",
      "duration": "10s",
      "shotsCount": 4,
      "narrative": "Aksi utama dan gerakan di depan kamera",
      "dialogue": "Dialog atau narasi suara (VO) lengkap",
      "camera": "Shot size (e.g. Close-up, Wide shot) dan angle/pergerakan",
      "lighting": "Kondisi pencahayaan dan atmosfer",
      "masterImagePrompt": "Prompt visual lengkap dalam bahasa Inggris untuk image generation AI (sangat detail, karakter, produk, latar, lighting sinematik 8k)",
      "masterVideoPrompt": "Prompt video motion dan kamera lengkap dalam bahasa Inggris untuk video generator AI (Kling, Runway Gen-3, Luma, Sora)",
      "continuityToNext": "Catatan transisi dan pergerakan kamera menuju adegan berikutnya"
    }
  ]
}`;

    const userPrompt = `
Kategori/Mode: ${mode.toUpperCase()}
Konsep / Cerita / Brief: ${prompt}
Jumlah Adegan (Scenes): ${sceneCount}
Rasio Aspek: ${aspectRatio}
Gaya Visual: ${visualStyle}
Bahasa Audio: ${language}
Mode Audio: ${audioMode}
${
  references.hasCharacter
    ? "CATATAN REFERENSI KARAKTER: Pengguna menyertakan foto referensi karakter. Pertahankan konsistensi wajah, postur, dan pakaian di setiap scene."
    : ""
}
${
  references.hasProduct
    ? `CATATAN REFERENSI PRODUK: Pertahankan skala nyata dan ciri produk tetap konsisten di setiap scene. Ukuran produk: ${references.productSize || "Normal"}.`
    : ""
}
${
  references.hasLocation
    ? "CATATAN REFERENSI LOKASI: Kunci arsitektur latar belakang dan ambient lighting agar tidak berganti acak."
    : ""
}

Buatlah rancangan storyboard yang menarik, dinamis, dan siap dieksekusi produksi video!`;

    let parsedStoryboard;
    let noticeMessage = null;

    if (apiKey) {
      try {
        const rawResult = await generateTextWithGemini(
          apiKey,
          userPrompt,
          systemPrompt,
          model || "gemini-3.8-flash"
        );

        const cleaned = rawResult
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/```\s*$/i, "")
          .trim();

        try {
          parsedStoryboard = JSON.parse(cleaned);
        } catch {
          const match = cleaned.match(/\{[\s\S]*\}/);
          if (match) {
            parsedStoryboard = JSON.parse(match[0]);
          } else {
            throw new Error("Gagal menguraikan output storyboard dari AI.");
          }
        }
      } catch (apiError) {
        console.warn("Gemini API error, fallback to Director Engine:", apiError.message);
        parsedStoryboard = generateSmartContextualStoryboard(
          prompt,
          mode,
          sceneCount,
          duration,
          aspectRatio,
          language,
          audioMode
        );
        noticeMessage = `Info Kuota Google: (${apiError.message.substring(0, 80)}...). Storyboard berhasil dirancang menggunakan Director Engine internal!`;
      }
    } else {
      parsedStoryboard = generateSmartContextualStoryboard(
        prompt,
        mode,
        sceneCount,
        duration,
        aspectRatio,
        language,
        audioMode
      );
      noticeMessage = "Mode Storyboard Cerdas Aktif. Masukkan API Key Anda di menu Pengaturan API Key untuk kustomisasi AI tak terbatas.";
    }

    return res.json({
      success: true,
      storyboard: parsedStoryboard,
      data: parsedStoryboard,
      notice: noticeMessage,
      projectId: null
    });
  } catch (error) {
    console.error("Storyboard error:", error);
    return res.status(500).json({ error: error.message || "Gagal menghasilkan storyboard." });
  }
});

// POST /api/ai/image (Prompt Studio & Visual Generator)
router.post('/image', async (req, res) => {
  try {
    const {
      prompt,
      category = "foto",
      aspectRatio = "1:1",
      negativePrompt,
      customApiKey,
      apiKey: bodyApiKey
    } = req.body;

    const rawApiKey =
      bodyApiKey ||
      customApiKey ||
      req.headers['x-gemini-key'] ||
      process.env.GEMINI_API_KEY;

    const apiKey = normalizeGeminiKey(rawApiKey || "");

    if (!prompt || String(prompt).trim() === "") {
      return res.status(400).json({ error: "Prompt/Konsep wajib diisi." });
    }

    const studioResult = await generatePromptStudioWithGemini(apiKey, {
      prompt,
      category,
      aspectRatio,
      negativePrompt,
    });

    return res.json({
      success: true,
      data: studioResult,
      ...studioResult
    });
  } catch (error) {
    console.error("Generate prompt studio error:", error);
    return res.status(500).json({ error: error.message || "Gagal menghasilkan prompt studio." });
  }
});

// POST /api/ai/tts (Voice Over / TTS Generator)
router.post('/tts', async (req, res) => {
  try {
    const { text, voiceName = "Kore", language = "id", customApiKey } = req.body;

    const apiKey =
      customApiKey ||
      req.headers['x-gemini-key'] ||
      process.env.GEMINI_API_KEY ||
      "";

    if (!text || String(text).trim() === "") {
      return res.status(400).json({ error: "Teks sulih suara wajib diisi." });
    }

    const { audioBase64, mimeType } = await generateTTSWithGemini(apiKey, text, voiceName, language);

    return res.json({
      success: true,
      audioBase64,
      mimeType,
      voiceName,
    });
  } catch (error) {
    console.error("TTS error:", error);
    return res.status(500).json({ error: error.message || "Gagal menghasilkan sulih suara." });
  }
});

// POST /api/ai/test-key
router.post('/test-key', async (req, res) => {
  try {
    const { apiKey } = req.body;
    if (!apiKey) {
      return res.status(400).json({ valid: false, message: "API Key tidak boleh kosong." });
    }

    const result = await testGeminiApiKey(apiKey);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ valid: false, message: error.message || "Gagal melakukan tes koneksi." });
  }
});

// POST /api/ai/scriptwriter
router.post('/scriptwriter', async (req, res) => {
  try {
    const { productName, productDescription, targetAudience, tone = "Viral & Menarik", customApiKey } = req.body;

    const apiKey =
      customApiKey ||
      req.headers['x-gemini-key'] ||
      process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.trim() === "") {
      return res.status(400).json({
        error: "Google Gemini API Key belum disetel. Silakan masukkan API Key Anda di menu 'Pengaturan API Key'."
      });
    }

    const systemPrompt = `Anda adalah Copywriter Iklan & Scriptwriter Video Pendek (TikTok, Reels, Shorts) nomor 1 di Indonesia.
Format output HARUS JSON murni tanpa markdown wrapper:
{
  "hook": "Kalimat pembuka 3 detik yang memancing rasa penasaran ekstrim / menghentikan scroll",
  "problem": "Masalah nyata yang dihadapi audiens sehari-hari",
  "solution": "Bagaimana produk/topik ini menjadi solusi terbaik",
  "callToAction": "Instruksi tindakan akhir yang jelas dan persuasif",
  "fullScript": "Naskah narasi lengkap yang mengalir alami siap dibacakan untuk Voice Over (maks 150 kata)"
}`;

    const prompt = `
Nama Produk / Ide: ${productName}
Deskripsi & Keunggulan: ${productDescription}
Target Audiens: ${targetAudience || "Generasi muda Indonesia / pengguna medsos"}
Gaya Nada Bicara (Tone): ${tone}

Buatlah naskah script video iklan pendek yang konversi tinggi!`;

    const raw = await generateTextWithGemini(apiKey, prompt, systemPrompt, "gemini-1.5-flash");
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
      else throw new Error("Gagal menguraikan naskah dari AI.");
    }

    return res.json({
      success: true,
      script: parsed,
    });
  } catch (error) {
    console.error("Scriptwriter error:", error);
    return res.status(500).json({ error: error.message || "Gagal membuat naskah script." });
  }
});

export default router;
