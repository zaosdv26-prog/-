import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

interface Order {
  id: string;
  playerId: string;
  packageName: string;
  packageUc: number;
  priceUsd: number;
  priceYer: number;
  paymentMethod: "credit_card" | "bank_transfer" | "cash";
  paymentDetails: any;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

const ORDERS_FILE = path.join(process.cwd(), "orders.json");

// Helper to load orders
function loadOrders(): Order[] {
  try {
    if (!fs.existsSync(ORDERS_FILE)) {
      const initialOrders: Order[] = [
        {
          id: "HN-551023",
          playerId: "518293740",
          packageName: "660 UC + 60 مجاناً",
          packageUc: 720,
          priceUsd: 9.99,
          priceYer: 15000,
          paymentMethod: "bank_transfer",
          paymentDetails: { bankName: "الكريمي", transferNo: "88349201" },
          status: "completed",
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
          updatedAt: new Date(Date.now() - 3600000 * 3.5).toISOString(),
        },
        {
          id: "HN-982104",
          playerId: "773210499",
          packageName: "325 UC",
          packageUc: 325,
          priceUsd: 4.99,
          priceYer: 7500,
          paymentMethod: "credit_card",
          paymentDetails: { cardHolder: "أحمد علي", last4: "4321" },
          status: "processing",
          createdAt: new Date(Date.now() - 600000).toISOString(), // 10 mins ago
          updatedAt: new Date(Date.now() - 300000).toISOString(),
        },
        {
          id: "HN-104928",
          playerId: "518293740",
          packageName: "8100 UC + 1000 مجاناً",
          packageUc: 9100,
          priceUsd: 99.99,
          priceYer: 150000,
          paymentMethod: "cash",
          paymentDetails: { contactName: "علي اليافعي", agentName: "One Cash" },
          status: "pending",
          createdAt: new Date(Date.now() - 60000).toISOString(), // 1 min ago
          updatedAt: new Date(Date.now() - 60000).toISOString(),
        },
      ];
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(initialOrders, null, 2), "utf8");
      return initialOrders;
    }
    const data = fs.readFileSync(ORDERS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading orders file:", error);
    return [];
  }
}

// Helper to save orders
function saveOrders(orders: Order[]) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing orders file:", error);
  }
}

// Initialize file
loadOrders();

// Simulated background updates to make the orders move dynamically
// This makes the demo extremely realistic and satisfying!
setInterval(() => {
  const orders = loadOrders();
  let updated = false;
  
  orders.forEach((order) => {
    if (order.status === "pending") {
      order.status = "processing";
      order.updatedAt = new Date().toISOString();
      updated = true;
    } else if (order.status === "processing") {
      // 70% chance to complete
      if (Math.random() > 0.3) {
        order.status = "completed";
        order.updatedAt = new Date().toISOString();
        updated = true;
      }
    }
  });
  
  if (updated) {
    saveOrders(orders);
    console.log("Simulated order statuses updated automatically.");
  }
}, 20000); // Check and update every 20 seconds

// API Routes
app.get("/api/orders", (req, res) => {
  const orders = loadOrders();
  res.json(orders);
});

app.get("/api/orders/:id", (req, res) => {
  const orders = loadOrders();
  const order = orders.find(o => o.id.toLowerCase() === req.params.id.toLowerCase());
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ error: "Order not found" });
  }
});

app.get("/api/orders/player/:playerId", (req, res) => {
  const orders = loadOrders();
  const playerOrders = orders.filter(o => o.playerId === req.params.playerId);
  res.json(playerOrders);
});

app.post("/api/orders", (req, res) => {
  const { playerId, packageName, packageUc, priceUsd, priceYer, paymentMethod, paymentDetails } = req.body;
  
  if (!playerId || !packageName || !packageUc || !priceUsd || !priceYer || !paymentMethod) {
    return res.status(400).json({ error: "Missing required order fields" });
  }
  
  const orders = loadOrders();
  const newOrder: Order = {
    id: `HN-${Math.floor(100000 + Math.random() * 900000)}`,
    playerId,
    packageName,
    packageUc,
    priceUsd,
    priceYer,
    paymentMethod,
    paymentDetails: paymentDetails || {},
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  orders.push(newOrder);
  saveOrders(orders);
  
  res.status(201).json(newOrder);
});

app.post("/api/orders/:id/force-complete", (req, res) => {
  const orders = loadOrders();
  const index = orders.findIndex(o => o.id.toLowerCase() === req.params.id.toLowerCase());
  if (index !== -1) {
    orders[index].status = "completed";
    orders[index].updatedAt = new Date().toISOString();
    saveOrders(orders);
    res.json(orders[index]);
  } else {
    res.status(404).json({ error: "Order not found" });
  }
});

// Helper function to call generateContent with retry and automatic model fallback
async function generateContentWithRetry(ai: any, params: { model: string, contents: any, config?: any }, maxRetries = 3): Promise<any> {
  let attempt = 0;
  let delay = 1000;
  
  while (true) {
    try {
      return await ai.models.generateContent(params);
    } catch (err: any) {
      attempt++;
      const errorMessage = err?.message || String(err);
      console.warn(`[Gemini API] Attempt ${attempt} failed: ${errorMessage}`);
      
      const isTransient = 
        errorMessage.includes("503") || 
        errorMessage.includes("UNAVAILABLE") || 
        errorMessage.includes("high demand") || 
        errorMessage.includes("429") || 
        errorMessage.includes("RESOURCE_EXHAUSTED") ||
        errorMessage.includes("overloaded");
        
      if (isTransient && attempt < maxRetries) {
        console.warn(`[Gemini API] Retrying attempt ${attempt + 1}/${maxRetries} after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // exponential backoff
        
        // Switch model as fallback if the current one is unavailable/overloaded
        if (params.model === "gemini-3.5-flash" && attempt >= 1) {
          console.log("[Gemini API] Switching model to gemini-2.5-flash for fallback retry.");
          params.model = "gemini-2.5-flash";
        } else if (params.model === "gemini-2.5-flash" && attempt >= 2) {
          console.log("[Gemini API] Switching model to gemini-1.5-flash for ultimate fallback retry.");
          params.model = "gemini-1.5-flash";
        }
        continue;
      }
      throw err;
    }
  }
}

app.post("/api/browser/search", async (req: any, res: any) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  const fallbackSites = [
    {
      title: "متجر حسين NAT",
      url: "https://hussein-nat.store",
      description: "المتجر الرسمي اليمني لشحن شدات ببجي موبايل والخدمات الرقمية بسرعة فائقة وبأسعار منافسة.",
      icon: "🔥",
      matchPercentage: 99,
      category: "ألعاب وخدمات"
    },
    {
      title: "يوتيوب العربي",
      url: "https://www.youtube.com",
      description: "أكبر منصة عالمية لمشاهدة الفيديوهات والبرامج التعليمية والترفيهية باللغة العربية.",
      icon: "📺",
      matchPercentage: 95,
      category: "ترفيه وميديا"
    },
    {
      title: "شات جي بي تي (ChatGPT)",
      url: "https://chatgpt.com",
      description: "مساعد الذكاء الاصطناعي الأقوى للإجابة على الأسئلة وكتابة النصوص والبرمجة باللغة العربية.",
      icon: "🤖",
      matchPercentage: 98,
      category: "ذكاء اصطناعي"
    },
    {
      title: "كورة (Kooora)",
      url: "https://www.kooora.com",
      description: "الموقع الرياضي العربي الأول لمتابعة نتائج مباريات اليوم وجداول الدوريات والأخبار الرياضية.",
      icon: "⚽",
      matchPercentage: 92,
      category: "أخبار ورياضة"
    },
    {
      title: "مترجم جوجل (Google Translate)",
      url: "https://translate.google.com",
      description: "أداة ترجمة فورية ممتازة للنصوص والصفحات بين العربية واللغات الأخرى مجاناً.",
      icon: "📝",
      matchPercentage: 90,
      category: "أدوات وخدمات"
    },
    {
      title: "ويكيبيديا العربية",
      url: "https://ar.wikipedia.org",
      description: "الموسوعة الحرة الشاملة التي توفر مقالات ومعلومات موثوقة في كافة العلوم والمجالات.",
      icon: "📚",
      matchPercentage: 88,
      category: "تعليم وبرمجة"
    },
    {
      title: "جيت هاب (GitHub)",
      url: "https://github.com",
      description: "المنصة الأولى عالمياً لاستضافة المشاريع البرمجية والتعاون بين المبرمجين حول العالم.",
      icon: "💻",
      matchPercentage: 85,
      category: "تعليم وبرمجة"
    },
    {
      title: "كانفا للتصميم (Canva)",
      url: "https://www.canva.com",
      description: "أداة رائعة وسهلة لتصميم الصور والشعارات والعروض التقديمية باحترافية وبدون خبرة سابقة.",
      icon: "🎨",
      matchPercentage: 87,
      category: "أدوات وخدمات"
    }
  ];

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("No GEMINI_API_KEY found, using intelligent fallback filter.");
    const normalized = query.toLowerCase();
    const filtered = fallbackSites.filter(site => 
      site.title.toLowerCase().includes(normalized) || 
      site.description.toLowerCase().includes(normalized) ||
      site.category.toLowerCase().includes(normalized) ||
      normalized.includes("موقع") ||
      normalized.length < 2
    );
    return res.json(filtered.length > 0 ? filtered : fallbackSites.slice(0, 5));
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const systemPrompt = `You are an expert Arabic Web Navigator and AI website opener.
Analyze the user's request (e.g., 'أريد موقعاً لمشاهدة الأفلام', 'موقع لتعلم البرمجة', 'موقع شحن شدات', etc.).
Return a structured JSON list of 4 to 6 real, highly relevant, existing, and popular websites that perfectly match the user's request.
Include a variety of popular global and regional platforms (always include real, active URLs starting with https://).

For each website, you MUST provide:
- title: The name of the website in Arabic (e.g., "تويتر / إكس", "موقع كورة", "مترجم جوجل").
- url: The absolute real web URL (e.g., "https://kooora.com").
- description: A useful 1-sentence description in Arabic explaining why this site matches their interest.
- icon: A single emoji that matches the site's function (e.g., '🎮', '🎓', '📺').
- matchPercentage: An integer between 75 and 99 representing the match accuracy.
- category: One of these Arabic categories: 'تعليم وبرمجة', 'ذكاء اصطناعي', 'ترفيه وميديا', 'أخبار ورياضة', 'أدوات وخدمات'.

Provide ONLY a clean, valid JSON array. Do not wrap in markdown or any conversational text.`;

    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.5-flash",
      contents: `User request: "${query}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              url: { type: Type.STRING },
              description: { type: Type.STRING },
              icon: { type: Type.STRING },
              matchPercentage: { type: Type.INTEGER },
              category: { type: Type.STRING },
            },
            required: ["title", "url", "description", "icon", "matchPercentage", "category"]
          }
        }
      }
    });

    const responseText = response.text || "[]";
    const parsed = JSON.parse(responseText.trim());
    return res.json(parsed);
  } catch (err: any) {
    console.error("Gemini search error, using fallback:", err);
    return res.json(fallbackSites.slice(0, 5));
  }
});

app.post("/api/browser/summarize", async (req: any, res: any) => {
  const { url, title } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.json({
      summary: `هذا الموقع هو **${title || url}**. هو واحد من أشهر المواقع في فئته. يمكنك من خلاله تصفح المحتوى والخدمات التي يقدمها، والاستفادة من خيارات البحث، وتخصيص تجربتك الشخصية بحرية كاملة.`,
      features: [
        "تصفح تفاعلي فائق السرعة وبسيط",
        "الوصول السريع إلى الأقسام المختلفة للموقع",
        "إمكانية حفظ الصفحات المفضلة والعودة إليها لاحقاً"
      ]
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.5-flash",
      contents: `قم بتقديم ملخص ذكي وجذاب باللغة العربية لموقع الويب التالي:
الاسم: ${title || "غير معروف"}
الرابط: ${url}

الرجاء تقديم ملخص لطيف ومختصر (في حدود 2-3 جمل) وثلاث ميزات رئيسية تقدمها هذه المنصة للمستخدمين.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A beautiful 2-3 sentence summary in Arabic." },
            features: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 key features or things you can do on this site."
            }
          },
          required: ["summary", "features"]
        }
      }
    });

    const responseText = response.text || "{}";
    const parsed = JSON.parse(responseText.trim());
    return res.json(parsed);
  } catch (err) {
    console.error("Gemini summarize error, using fallback:", err);
    return res.json({
      summary: `هذا موقع ممتاز وموثوق يوفر للمستخدمين واجهات تفاعلية ومميزات متكاملة في مجاله.`,
      features: [
        "الوصول السريع والآمن لكافة خيارات المنصة",
        "محتوى متجدد ودعم مخصص للمستخدمين العرب",
        "سهولة الملاحة والتصفح السريع"
      ]
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", appName: "Hussein NAT" });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
