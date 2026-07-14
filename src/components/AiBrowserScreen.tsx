import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  Search, 
  Sparkles, 
  Globe, 
  ExternalLink, 
  RefreshCw, 
  Star, 
  Bookmark, 
  History, 
  BookOpen, 
  Cpu, 
  Send, 
  ChevronRight, 
  Volume2, 
  Play, 
  Pause, 
  Flame, 
  Trophy, 
  Check, 
  HelpCircle,
  Clock,
  ArrowRight
} from "lucide-react";

interface AiBrowserScreenProps {
  onClose: () => void;
  onOpenStore?: () => void;
}

interface WebSite {
  title: string;
  url: string;
  description: string;
  icon: string;
  matchPercentage: number;
  category: string;
}

interface AIResponse {
  summary: string;
  features: string[];
}

export default function AiBrowserScreen({ onClose, onOpenStore }: AiBrowserScreenProps) {
  // Navigation states
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [sites, setSites] = useState<WebSite[]>([]);
  const [selectedSite, setSelectedSite] = useState<WebSite | null>(null);
  const [history, setHistory] = useState<WebSite[]>(() => {
    const saved = localStorage.getItem("ai_browser_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [bookmarks, setBookmarks] = useState<WebSite[]>(() => {
    const saved = localStorage.getItem("ai_browser_bookmarks");
    return saved ? JSON.parse(saved) : [
      {
        title: "متجر حسين NAT",
        url: "https://hussein-nat.store",
        description: "المتجر الرسمي اليمني لشحن شدات ببجي موبايل والخدمات الرقمية بسرعة فائقة وبأسعار منافسة.",
        icon: "🔥",
        matchPercentage: 99,
        category: "ألعاب وخدمات"
      },
      {
        title: "ويكيبيديا العربية",
        url: "https://ar.wikipedia.org",
        description: "الموسوعة الحرة الشاملة التي توفر مقالات ومعلومات موثوقة في كافة العلوم والمجالات.",
        icon: "📚",
        matchPercentage: 95,
        category: "تعليم وبرمجة"
      },
      {
        title: "شات جي بي تي (ChatGPT)",
        url: "https://chatgpt.com",
        description: "مساعد الذكاء الاصطناعي الأقوى للإجابة على الأسئلة وكتابة النصوص والبرمجة باللغة العربية.",
        icon: "🤖",
        matchPercentage: 98,
        category: "ذكاء اصطناعي"
      }
    ];
  });

  // Browser interactive simulation states
  const [activeTab, setActiveTab] = useState<"page" | "summary" | "chat">("page");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<AIResponse | null>(null);
  
  // Custom chatbot state inside browser
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Custom Simulator States
  // 1. YouTube Simulator
  const [ytPlaying, setYtPlaying] = useState<string | null>(null);
  const [ytProgress, setYtProgress] = useState(0);
  
  // 2. Football Kooora Simulator
  const [koooraTime, setKoooraTime] = useState(74);
  const [cheerCount, setCheerCount] = useState(148);
  
  // 3. Google Translate Simulator
  const [translateSource, setTranslateSource] = useState("");
  const [translateResult, setTranslateResult] = useState("");
  const [translating, setTranslating] = useState(false);

  // 4. Canva Designer Simulator
  const [canvaTemplate, setCanvaTemplate] = useState("شعار متجر حسين");
  const [canvaColor, setCanvaColor] = useState("cyan");
  const [canvaExported, setCanvaExported] = useState(false);

  // 5. Hussein NAT Store Sim
  const [pubgPlayerId, setPubgPlayerId] = useState("");
  const [pubgVerifying, setPubgVerifying] = useState(false);
  const [pubgVerifiedName, setPubgVerifiedName] = useState("");
  const [selectedPackPrice, setSelectedPackPrice] = useState<number | null>(null);
  const [orderCreatedMsg, setOrderCreatedMsg] = useState("");

  // Refs
  const bottomChatRef = useRef<HTMLDivElement>(null);

  // Save history and bookmarks
  useEffect(() => {
    localStorage.setItem("ai_browser_history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("ai_browser_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Handle ticking match clock for Kooora Sim
  useEffect(() => {
    const interval = setInterval(() => {
      setKoooraTime(prev => {
        if (prev >= 90) return 90;
        return prev + 1;
      });
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Handle YouTube progress bar ticker
  useEffect(() => {
    let timer: any;
    if (ytPlaying) {
      timer = setInterval(() => {
        setYtProgress(prev => {
          if (prev >= 100) {
            setYtPlaying(null);
            return 0;
          }
          return prev + 2;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [ytPlaying]);

  // Execute web search via server-side Gemini or local fallback
  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/browser/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await response.json();
      setSites(data);
    } catch (e) {
      console.error("Search error", e);
    } finally {
      setLoading(false);
    }
  };

  // Open simulated browser view
  const openSite = async (site: WebSite) => {
    setSelectedSite(site);
    setActiveTab("page");
    setAiSummary(null);
    setChatMessages([
      { 
        sender: "ai", 
        text: `مرحباً بك في تصفح ذكي لموقع **${site.title}**! أنا مساعدك الشخصي للذكاء الاصطناعي. كيف يمكنني مساعدتك في استكشاف هذا الموقع اليوم؟` 
      }
    ]);

    // Add to history if not exists as last item
    setHistory(prev => {
      const filtered = prev.filter(p => p.url !== site.url);
      return [site, ...filtered].slice(0, 20); // max 20 history records
    });

    // Request AI page summary
    setSummaryLoading(true);
    try {
      const response = await fetch("/api/browser/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: site.url, title: site.title }),
      });
      const data = await response.json();
      setAiSummary(data);
    } catch (e) {
      console.error("Summary fetch failed", e);
    } finally {
      setSummaryLoading(false);
    }
  };

  // Star / Bookmark toggle
  const toggleBookmark = (site: WebSite) => {
    const isBookmarked = bookmarks.some(b => b.url === site.url);
    if (isBookmarked) {
      setBookmarks(prev => prev.filter(b => b.url !== site.url));
    } else {
      setBookmarks(prev => [...prev, site]);
    }
  };

  // Ask AI about this site
  const handleAskAI = async () => {
    if (!chatInput.trim() || !selectedSite) return;
    const userText = chatInput;
    setChatInput("");
    setChatMessages(prev => [...prev, { sender: "user", text: userText }]);
    setChatLoading(true);

    // Scroll to bottom
    setTimeout(() => {
      bottomChatRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    try {
      // Simulate/Generate high quality intelligent feedback using server-side knowledge
      let aiResponseText = "";
      const lowerText = userText.toLowerCase();

      if (selectedSite.url.includes("hussein-nat") || selectedSite.title.includes("حسين")) {
        if (lowerText.includes("شحن") || lowerText.includes("ببجي") || lowerText.includes("شدات")) {
          aiResponseText = "بصفتي ذكاء اصطناعي، أؤكد لك أن متجر حسين هو الخيار المعتمد والأكثر موثوقية في اليمن لشحن شدات ببجي. كل ما عليك فعله هو إدخال معرّف اللاعب (ID) الخاص بك في صندوق المحاكاة بالأسفل لتجربة الشحن الفوري الخيالي!";
        } else if (lowerText.includes("سعر") || lowerText.includes("الأسعار")) {
          aiResponseText = "الأسعار في متجر حسين منافسة جداً وتدعم الدفع بالريال اليمني أو الدولار. الباقة الأساسية 325 شدة بحوالي 7,500 ريال يمني فقط!";
        } else {
          aiResponseText = "متجر حسين يوفر سرعة شحن لا تصدق ودعماً كاملاً على مدار الساعة. هل تود تجربة الشحن التفاعلي الآن في متصفحنا؟";
        }
      } else if (selectedSite.url.includes("kooora")) {
        if (lowerText.includes("مباراة") || lowerText.includes("اليوم") || lowerText.includes("اليمن")) {
          aiResponseText = "المنتخب اليمني 🇾🇪 يخوض مباراة ملحمية الآن ضد شقيقه السعودي 🇸🇦 والنتيجة حالياً تقدم اليمن 2-1 في الدقيقة 74! يمكنك الضغط على 'شجع اليمن' لرفع معنويات الجماهير بالذكاء الاصطناعي!";
        } else {
          aiResponseText = "موقع كورة هو الأبرز للنتائج الفورية. تصفح جدول المباريات بالأسفل وتفاعل معه مباشرة!";
        }
      } else if (selectedSite.url.includes("chatgpt")) {
        aiResponseText = "هذا هو محاكي ChatGPT الذكي المتكامل. يمكنك كتابة أي شيء وتلقي إجابة فhand-crafted رائعة ومحسنة تفاعلياً لخدمتك!";
      } else {
        // Generic AI Web-Search/Answer synthesis
        aiResponseText = `هذا الموقع (${selectedSite.title}) يعتبر من الرواد في فئة **${selectedSite.category}**. إنه يوفر بيئة ممتازة وآمنة، وبصفتي مساعدك، أنصحك باستكشاف ميزاته الذكية عبر ملخص الصفحة أو تفقد خيارات التصفح السريع.`;
      }

      // Simulated typing delay
      setTimeout(() => {
        setChatMessages(prev => [...prev, { sender: "ai", text: aiResponseText }]);
        setChatLoading(false);
        setTimeout(() => {
          bottomChatRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }, 900);

    } catch (err) {
      setChatLoading(false);
    }
  };

  // Google Translate Simulator handler
  const handleTranslate = () => {
    if (!translateSource.trim()) return;
    setTranslating(true);
    setTimeout(() => {
      const text = translateSource.trim().toLowerCase();
      let translation = "ترجمة مخصصة بالذكاء الاصطناعي للمصطلح المذكور.";
      
      if (text.includes("hello") || text.includes("welcome")) {
        translation = "أهلاً بك وسهلاً في اليمن السعيد! 🇾🇪";
      } else if (text.includes("how are you")) {
        translation = "كيف حالك؟ أتمنى أن تكون بأفضل حال.";
      } else if (text.includes("artificial intelligence")) {
        translation = "الذكاء الاصطناعي (AI) وتطبيقاته الثورية.";
      } else if (text.includes("i love yemen")) {
        translation = "أنا أعشق اليمن وتراثها العريق! ❤️";
      } else if (text.includes("pubg")) {
        translation = "لعبة ببجي موبايل القتالية الشهيرة.";
      } else {
        // Simple mock translation
        translation = `[مترجم ذكي]: تم ترجمة "${translateSource}" بنجاح!`;
      }
      
      setTranslateResult(translation);
      setTranslating(false);
    }, 800);
  };

  // Play pronunciation sound
  const handleSpeakTranslation = () => {
    if (!translateResult) return;
    const synth = window.speechSynthesis;
    if (synth) {
      const utterance = new SpeechSynthesisUtterance(translateResult);
      utterance.lang = "ar-YE";
      synth.speak(utterance);
    }
  };

  // Hussein Store Simulator Verify ID
  const handleVerifyPlayerId = () => {
    if (!pubgPlayerId.trim() || pubgPlayerId.length < 5) return;
    setPubgVerifying(true);
    setTimeout(() => {
      setPubgVerifiedName("HUSSEN_NAT_KING");
      setPubgVerifying(false);
    }, 1200);
  };

  // Hussein Store Place simulated order
  const handlePlaceOrder = (price: number, uc: string) => {
    setSelectedPackPrice(price);
    setOrderCreatedMsg("جاري معالجة الطلب بالذكاء الاصطناعي الفوري...");
    setTimeout(() => {
      setOrderCreatedMsg(`✅ تم شحن ${uc} بنجاح لحساب ${pubgVerifiedName || "HUSSEN_NAT_KING"}! تم خصم ${price} ريال يمني.`);
    }, 1500);
  };

  return (
    <div className="h-full w-full bg-[#0a0a0c] text-white flex flex-col justify-between relative overflow-hidden font-sans select-none">
      
      {/* Background Ambience */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container Header */}
      <div className="w-full bg-[#111115] border-b border-white/5 py-4 px-4 flex items-center justify-between z-20 shadow-md">
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/5 rounded-xl transition text-neutral-400 hover:text-white cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
          <h1 className="text-sm font-black tracking-wide text-neutral-100">مستكشف المواقع بالذكاء الاصطناعي</h1>
        </div>
        <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
          <Cpu className="w-4 h-4 text-teal-400" />
        </div>
      </div>

      {/* Inner Screen Area */}
      <div className="flex-1 overflow-y-auto z-10 px-4 py-4 scrollbar-thin">
        <AnimatePresence mode="wait">
          {!selectedSite ? (
            // ================== NAVIGATOR HOME ==================
            <motion.div
              key="nav-home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-5 pb-6"
            >
              {/* Promo Banner */}
              <div className="bg-gradient-to-r from-teal-500/10 to-indigo-500/5 border border-teal-500/20 rounded-2xl p-4 flex items-start gap-3 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-xl" />
                <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-neutral-100">اطلب أي موقع تريده بذكاء</h3>
                  <p className="text-[10px] text-neutral-400 mt-1 leading-relaxed">
                    اكتب ما تبحث عنه باللغة العربية (مثلاً: موقع لمشاهدة المباريات، أداة ذكاء اصطناعي، شحن ألعاب) وسيقوم المساعد الفوري باقتراح المواقع الفعالة وتجهيزها لك.
                  </p>
                </div>
              </div>

              {/* Main Search Command Bar */}
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch(query);
                    }}
                    placeholder="اكتب نوع الموقع أو الفكرة هنا..."
                    className="w-full bg-[#16161c] border-2 border-white/10 hover:border-teal-500/30 focus:border-teal-500/80 rounded-2xl py-3 px-11 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none transition-all shadow-inner text-right"
                  />
                  <div className="absolute left-3.5 top-3 text-neutral-400">
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
                    ) : (
                      <button onClick={() => handleSearch(query)} className="cursor-pointer">
                        <Search className="w-4 h-4 hover:text-white transition" />
                      </button>
                    )}
                  </div>
                  <Sparkles className="absolute right-3.5 top-3.5 w-4 h-4 text-teal-500" />
                </div>

                {/* Quick Prompts Chips */}
                <div className="flex flex-wrap gap-1.5 mt-1 justify-end">
                  {[
                    "موقع شحن شدات ببجي",
                    "موقع لمشاهدة المباريات مباشر",
                    "أداة توليد صور ذكاء اصطناعي",
                    "موقع لتعلم البرمجة مجاناً",
                    "مترجم لغات ذكي فوري"
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(chip);
                        handleSearch(chip);
                      }}
                      className="text-[10px] font-bold bg-[#1a1a24] border border-white/5 hover:border-teal-500/30 hover:bg-teal-500/5 text-neutral-300 py-1.5 px-3 rounded-full transition cursor-pointer flex items-center gap-1"
                    >
                      <span>{chip}</span>
                      <Sparkles className="w-2.5 h-2.5 text-teal-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Results / Recommended Sites */}
              <div>
                <div className="flex items-center justify-between px-1 mb-3">
                  <span className="text-[10px] text-neutral-500 font-bold">نتائج البحث والاقتراحات الذكية</span>
                  <div className="flex items-center gap-1 text-[10px] text-teal-400 font-black">
                    <Globe className="w-3.5 h-3.5" />
                    <span>تصفح فوري فائق الاستجابة</span>
                  </div>
                </div>

                {sites.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {sites.map((site, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="bg-[#14141a] border border-white/5 hover:border-teal-500/20 rounded-2xl p-3.5 flex flex-col justify-between shadow-md transition-all group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          {/* Match score */}
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full border-2 border-teal-500/30 flex flex-col items-center justify-center bg-teal-500/5 shadow-inner">
                              <span className="text-[10px] font-black text-teal-400">{site.matchPercentage}%</span>
                            </div>
                            <span className="text-[8px] text-neutral-500 font-bold mt-1">تطابق</span>
                          </div>

                          {/* Site Info */}
                          <div className="flex-1 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <span className="text-[9px] bg-indigo-500/10 text-indigo-300 font-black px-2 py-0.5 rounded-md">
                                {site.category}
                              </span>
                              <h4 className="text-xs font-black text-neutral-100 group-hover:text-teal-400 transition flex items-center gap-1">
                                <span>{site.title}</span>
                                <span className="text-sm">{site.icon}</span>
                              </h4>
                            </div>
                            <p className="text-[10px] text-neutral-400 mt-1 leading-relaxed">
                              {site.description}
                            </p>
                            <span className="text-[8px] text-neutral-500 font-mono mt-2 block select-all">
                              {site.url}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 mt-3.5 border-t border-white/5 pt-3">
                          <button
                            onClick={() => window.open(site.url, "_blank")}
                            className="flex-1 text-[10px] font-bold bg-[#1b1b22] hover:bg-[#22222d] text-neutral-300 py-2 rounded-xl border border-white/5 transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>فتح خارجي</span>
                            <ExternalLink className="w-3 h-3 text-neutral-400" />
                          </button>
                          
                          <button
                            onClick={() => openSite(site)}
                            className="flex-1 text-[10px] font-black bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-black py-2 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>دخول فوري بالـ AI</span>
                            <Sparkles className="w-3.5 h-3.5 text-black" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#131318] border border-white/5 rounded-2xl p-8 text-center text-neutral-500 flex flex-col items-center gap-2">
                    <Globe className="w-8 h-8 text-neutral-600 animate-pulse" />
                    <p className="text-xs font-black">جاهز للبحث واكتشاف المواقع</p>
                    <p className="text-[10px] text-neutral-500 leading-relaxed max-w-xs">
                      أدخل طلبك باللغة العربية بالأعلى، أو اختر أحد الاختصارات السريعة لفتح الموقع وتلخيصه بالذكاء الاصطناعي على الفور.
                    </p>
                  </div>
                )}
              </div>

              {/* Bookmarks Quick Bar */}
              {bookmarks.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-1 mb-2">
                    <span className="text-[10px] text-neutral-500 font-bold">العلامات المرجعية المفضلة</span>
                    <Star className="w-3 h-3 text-amber-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {bookmarks.map((b, idx) => (
                      <button
                        key={idx}
                        onClick={() => openSite(b)}
                        className="p-2.5 bg-[#14141a] border border-white/5 hover:border-amber-500/30 rounded-xl text-right transition cursor-pointer flex flex-col justify-between gap-1.5"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[8px] text-neutral-500 truncate max-w-[80px]">{b.url.replace("https://", "")}</span>
                          <span className="text-xs">{b.icon}</span>
                        </div>
                        <span className="text-[10px] font-black text-neutral-100 truncate w-full block">
                          {b.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation History */}
              {history.length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center justify-between px-1 mb-2">
                    <span className="text-[10px] text-neutral-500 font-bold">المواقع التي تمت زيارتها مؤخراً</span>
                    <History className="w-3 h-3 text-neutral-500" />
                  </div>
                  <div className="flex flex-col gap-1.5 bg-[#121216] border border-white/5 rounded-2xl p-2 max-h-40 overflow-y-auto">
                    {history.map((h, idx) => (
                      <button
                        key={idx}
                        onClick={() => openSite(h)}
                        className="flex items-center justify-between p-2 hover:bg-white/5 rounded-xl text-right text-[10px] transition cursor-pointer"
                      >
                        <ChevronRight className="w-3 h-3 text-neutral-500" />
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-400 truncate max-w-[180px] text-right font-black">{h.title}</span>
                          <span className="text-xs">{h.icon}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            // ================== IMMERSIVE VIRTUAL BROWSER VIEW ==================
            <motion.div
              key="browser-viewport"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-col gap-4 h-full"
            >
              {/* Virtual Browser Top Address Bar */}
              <div className="bg-[#14141a] border border-white/5 rounded-2xl p-2.5 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => toggleBookmark(selectedSite)}
                    className="p-1.5 hover:bg-white/5 rounded-lg text-neutral-400 hover:text-amber-500 transition cursor-pointer"
                  >
                    <Star 
                      className={`w-4 h-4 ${bookmarks.some(b => b.url === selectedSite.url) ? "fill-amber-500 text-amber-500" : ""}`} 
                    />
                  </button>
                  <button 
                    onClick={() => openSite(selectedSite)}
                    className="p-1.5 hover:bg-white/5 rounded-lg text-neutral-400 hover:text-white transition cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Simulated URL input bar */}
                <div className="flex-1 bg-[#1c1c24] border border-white/5 rounded-xl px-3 py-1.5 flex items-center justify-between gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-neutral-300 truncate select-all">{selectedSite.url}</span>
                  <Globe className="w-3 h-3 text-neutral-500" />
                </div>

                <button
                  onClick={() => setSelectedSite(null)}
                  className="px-2.5 py-1.5 bg-[#1b1b22] border border-white/5 rounded-xl text-[10px] font-bold text-neutral-300 hover:text-white transition cursor-pointer flex items-center gap-1"
                >
                  <span>الرئيسية</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Dynamic Browser tabs selection */}
              <div className="flex bg-[#121217] p-1 rounded-xl gap-1">
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === "chat" ? "bg-teal-500 text-black shadow-lg" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>مساعد الـ AI</span>
                </button>
                
                <button
                  onClick={() => setActiveTab("summary")}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === "summary" ? "bg-teal-500 text-black shadow-lg" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>ملخص بالذكاء الاصطناعي</span>
                </button>

                <button
                  onClick={() => setActiveTab("page")}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === "page" ? "bg-teal-500 text-black shadow-lg" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>تصفح الموقع</span>
                </button>
              </div>

              {/* TABS CONTAINER CONTENT */}
              <div className="flex-1 min-h-[420px] bg-[#111116] border border-white/5 rounded-2xl overflow-hidden flex flex-col relative">
                
                {/* 1. MOCK WEBSITE LIVE INTERACT VIEW */}
                {activeTab === "page" && (
                  <div className="flex-1 flex flex-col overflow-y-auto">
                    
                    {/* CUSTOM SIMULATOR A: HUSSEIN NAT STORE */}
                    {(selectedSite.url.includes("hussein-nat") || selectedSite.title.includes("حسين")) && (
                      <div className="p-4 flex flex-col gap-4 text-right">
                        <div className="bg-gradient-to-r from-amber-500/20 to-neutral-900 border border-amber-500/30 rounded-2xl p-4 flex flex-col items-center text-center">
                          <span className="text-3xl">🔥</span>
                          <h3 className="text-sm font-black text-white mt-1">متجر حسين NAT - شحن فوري تفاعلي</h3>
                          <p className="text-[10px] text-neutral-400 mt-1 max-w-xs">
                            تم دمج نظام الشحن الفوري مع الذكاء الاصطناعي لتأكيد البيانات في أجزاء من الثانية!
                          </p>
                        </div>

                        <div className="bg-[#15151c] border border-white/5 rounded-2xl p-3 flex flex-col gap-3">
                          <span className="text-[10px] text-neutral-400 font-bold">1. أدخل معرّف اللاعب (Player ID)</span>
                          <div className="flex gap-2">
                            <button
                              onClick={handleVerifyPlayerId}
                              disabled={pubgVerifying}
                              className="bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] px-3 rounded-xl transition cursor-pointer"
                            >
                              {pubgVerifying ? "جاري التحقق..." : "تحقق"}
                            </button>
                            <input
                              type="text"
                              value={pubgPlayerId}
                              onChange={(e) => setPubgPlayerId(e.target.value)}
                              placeholder="مثال: 518293740"
                              className="flex-1 bg-[#1a1a24] border border-white/10 rounded-xl p-2 text-xs text-left focus:outline-none focus:border-amber-500"
                            />
                          </div>

                          {pubgVerifiedName && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center text-emerald-400 text-[10px] font-black flex items-center justify-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>اسم الحساب: {pubgVerifiedName}</span>
                            </motion.div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] text-neutral-400 font-bold">2. اختر باقة الشدات (UC) لبدء الشحن التفاعلي</span>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { uc: "325 شدة", price: 7500 },
                              { uc: "720 شدة", price: 15000 },
                              { uc: "1620 شدة", price: 32000 },
                              { uc: "4000 شدة", price: 75000 }
                            ].map((pack, i) => (
                              <button
                                key={i}
                                onClick={() => handlePlaceOrder(pack.price, pack.uc)}
                                className="bg-[#15151c] hover:bg-amber-500/5 hover:border-amber-500/40 border border-white/5 p-2.5 rounded-xl text-right transition cursor-pointer flex flex-col justify-between"
                              >
                                <span className="text-[10px] font-black text-amber-500">{pack.uc}</span>
                                <span className="text-[9px] text-neutral-400 mt-1">{pack.price} ريال يمني</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {orderCreatedMsg && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-teal-500/10 border border-teal-500/30 p-3 rounded-2xl text-center text-teal-300 text-[10px] font-bold leading-relaxed"
                          >
                            {orderCreatedMsg}
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* CUSTOM SIMULATOR B: YOUTUBE */}
                    {selectedSite.url.includes("youtube") && (
                      <div className="p-3 flex flex-col gap-3">
                        {ytPlaying ? (
                          // Theater Video Player Mock
                          <div className="bg-black rounded-2xl overflow-hidden border border-white/5 relative aspect-video flex items-center justify-center">
                            <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                              <span className="text-3xl animate-bounce">📺</span>
                            </div>
                            
                            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black to-transparent flex flex-col gap-1.5 z-10 text-right">
                              <h4 className="text-[10px] font-black text-neutral-100 truncate">{ytPlaying}</h4>
                              
                              {/* Custom progress bar */}
                              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-red-600 h-full transition-all" style={{ width: `${ytProgress}%` }} />
                              </div>
                              
                              <div className="flex items-center justify-between text-[8px] text-neutral-400 mt-1">
                                <span>{Math.round(ytProgress / 10)}:20</span>
                                <button onClick={() => setYtPlaying(null)} className="text-red-500 font-bold">إغلاق المشاهدة</button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // Grid of YouTube videos
                          <div className="flex flex-col gap-3 text-right">
                            <span className="text-[10px] font-black text-neutral-400">الفيديوهات المقترحة بالذكاء الاصطناعي</span>
                            {[
                              { title: "حسين نات - طريقة شحن شدات ببجي بثواني!", desc: "شرح كامل لأسرع متجر يمني رقمي معتمد لشحن الألعاب.", channel: "حسين نات تي في", views: "140K مشاهدة", duration: "3:45" },
                              { title: "ملخص مباراة اليمن والسعودية - تصفيات كأس العالم", desc: "لحظات تاريخية وصمود أسطوري لمنتخبنا الوطني لكرة القدم.", channel: "سبأ سبورت", views: "2.1M مشاهدة", duration: "12:10" },
                              { title: "تعلم برمجة مواقع الويب بالذكاء الاصطناعي في 10 دقائق", desc: "دورة مكثفة لبناء تطبيقات الويب الحديثة باستخدام تقنيات GenAI.", channel: "برمج بذكاء", views: "45K مشاهدة", duration: "8:20" }
                            ].map((vid, idx) => (
                              <div 
                                key={idx}
                                className="bg-[#15151c] border border-white/5 rounded-2xl p-3 hover:border-red-500/30 transition flex gap-3 cursor-pointer"
                                onClick={() => {
                                  setYtPlaying(vid.title);
                                  setYtProgress(0);
                                }}
                              >
                                <div className="w-24 h-16 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-center relative shrink-0">
                                  <span className="text-xl">🎬</span>
                                  <span className="absolute bottom-1 right-1 bg-black/80 text-[8px] font-mono px-1 rounded">{vid.duration}</span>
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                  <h4 className="text-[10px] font-black text-neutral-100 leading-snug line-clamp-1">{vid.title}</h4>
                                  <p className="text-[8px] text-neutral-400 line-clamp-1">{vid.desc}</p>
                                  <div className="flex items-center justify-end gap-2 text-[8px] text-neutral-500">
                                    <span>{vid.views}</span>
                                    <span>•</span>
                                    <span className="font-bold">{vid.channel}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* CUSTOM SIMULATOR C: KOOORA SPORTS */}
                    {selectedSite.url.includes("kooora") && (
                      <div className="p-4 flex flex-col gap-4 text-right">
                        <div className="bg-gradient-to-r from-emerald-600/20 to-neutral-900 border border-emerald-500/30 p-3.5 rounded-2xl flex justify-between items-center">
                          <span className="text-[10px] bg-red-600 text-white font-black px-2 py-0.5 rounded-full animate-pulse">مباشر الآن</span>
                          <h3 className="text-xs font-black text-white">كورة اليمن - تغطية ذكية للمباريات</h3>
                        </div>

                        {/* Yemen Saudi Match widget */}
                        <div className="bg-[#15151c] border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
                          <div className="flex items-center justify-between text-neutral-400 text-[10px] font-bold">
                            <span>الدقيقة: {koooraTime}'</span>
                            <span>تصفيات الكأس 🏆</span>
                          </div>

                          <div className="flex justify-around items-center py-2">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-3xl">🇾🇪</span>
                              <span className="text-xs font-black">اليمن</span>
                            </div>

                            <div className="flex flex-col items-center">
                              <span className="text-2xl font-black font-mono">2 - 1</span>
                              <span className="text-[8px] text-emerald-400 animate-pulse mt-1">مباراة ملحمية</span>
                            </div>

                            <div className="flex flex-col items-center gap-1">
                              <span className="text-3xl">🇸🇦</span>
                              <span className="text-xs font-black">السعودية</span>
                            </div>
                          </div>

                          <div className="border-t border-white/5 pt-3 flex items-center justify-between gap-2">
                            <button
                              onClick={() => setCheerCount(prev => prev + 1)}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-black font-black text-[10px] py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                            >
                              <span>شجع اليمن 🇾🇪</span>
                              <Trophy className="w-3 h-3" />
                            </button>
                            <span className="text-[9px] text-neutral-400">{cheerCount} مشجع ذكي</span>
                          </div>
                        </div>

                        {/* Other matches */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] text-neutral-400 font-bold">باقي مباريات اليوم</span>
                          {[
                            { team1: "ريال مدريد 🇪🇸", team2: "برشلونة 🇪🇸", score: "3 - 2", status: "انتهت" },
                            { team1: "تضامن حضرموت 🇾🇪", team2: "شعب إب 🇾🇪", score: "0 - 0", status: "الدقيقة 15" }
                          ].map((m, i) => (
                            <div key={i} className="bg-[#15151c] border border-white/5 p-3 rounded-xl flex justify-between items-center text-[10px]">
                              <span className="text-neutral-500 font-bold">{m.status}</span>
                              <span className="font-black">{m.team1} {m.score} {m.team2}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CUSTOM SIMULATOR D: CHATGPT */}
                    {selectedSite.url.includes("chatgpt") && (
                      <div className="p-3 flex flex-col gap-3 flex-1 h-full">
                        <div className="bg-[#15151c] border border-white/5 rounded-2xl p-3 flex items-center gap-2 text-right justify-end">
                          <div>
                            <h4 className="text-[11px] font-black text-neutral-100">ChatGPT 4o Pro Simulator</h4>
                            <p className="text-[8px] text-emerald-400 mt-0.5">● نشط ومتصل بالذكاء الاصطناعي</p>
                          </div>
                          <span className="text-2xl">🤖</span>
                        </div>

                        <div className="flex-1 min-h-[220px] bg-[#121217] border border-white/5 rounded-2xl p-3 flex flex-col gap-3.5 overflow-y-auto max-h-[240px]">
                          {chatMessages.map((msg, i) => (
                            <div 
                              key={i} 
                              className={`flex flex-col gap-1 max-w-[80%] ${msg.sender === "user" ? "self-start text-left" : "self-end text-right"}`}
                            >
                              <span className="text-[8px] text-neutral-500">{msg.sender === "user" ? "أنت" : "ChatGPT"}</span>
                              <div 
                                className={`p-2.5 rounded-2xl text-[10px] leading-relaxed ${
                                  msg.sender === "user" ? "bg-teal-500 text-black" : "bg-[#1d1d26] text-neutral-200"
                                }`}
                              >
                                {msg.text}
                              </div>
                            </div>
                          ))}
                          {chatLoading && (
                            <div className="self-end text-right">
                              <div className="bg-[#1d1d26] text-neutral-400 text-[10px] p-2.5 rounded-2xl animate-pulse">
                                جاري التفكير... 🤖
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={handleAskAI}
                            className="p-2.5 bg-teal-500 hover:bg-teal-400 text-black rounded-xl transition cursor-pointer"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleAskAI();
                            }}
                            placeholder="اسأل المحاكي أي سؤال..."
                            className="flex-1 bg-[#15151c] border border-white/10 rounded-xl p-2 text-right text-xs focus:outline-none focus:border-teal-500"
                          />
                        </div>
                      </div>
                    )}

                    {/* CUSTOM SIMULATOR E: GOOGLE TRANSLATE */}
                    {selectedSite.url.includes("translate") && (
                      <div className="p-4 flex flex-col gap-4 text-right">
                        <div className="bg-[#15151c] border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
                          <span className="text-[10px] text-neutral-400 font-bold">1. أدخل النص باللغة الإنجليزية للترجمة فورياً</span>
                          <input
                            type="text"
                            value={translateSource}
                            onChange={(e) => setTranslateSource(e.target.value)}
                            placeholder="مثال: Welcome to Yemen"
                            className="w-full bg-[#1a1a24] border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-teal-500 text-left font-mono"
                          />

                          <button
                            onClick={handleTranslate}
                            disabled={translating}
                            className="w-full bg-teal-500 hover:bg-teal-400 text-black font-black text-xs py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            {translating ? (
                              <span>جاري الترجمة بالذكاء الاصطناعي...</span>
                            ) : (
                              <>
                                <span>ترجم فورياً إلى العربية</span>
                                <Volume2 className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </div>

                        {translateResult && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-2xl flex flex-col gap-2.5 text-right"
                          >
                            <span className="text-[9px] text-indigo-400 font-bold">الترجمة الفورية العربية:</span>
                            <p className="text-xs font-black text-neutral-100">{translateResult}</p>
                            <button
                              onClick={handleSpeakTranslation}
                              className="self-end text-[9px] font-bold text-teal-400 flex items-center gap-1 hover:underline"
                            >
                              <span>استمع للنطق 🎙️</span>
                            </button>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* CUSTOM SIMULATOR F: CANVA GRAPHIC DESIGN */}
                    {selectedSite.url.includes("canva") && (
                      <div className="p-4 flex flex-col gap-4 text-right">
                        <div className="bg-[#15151c] border border-white/5 rounded-2xl p-3.5 flex flex-col gap-3.5">
                          <h4 className="text-xs font-black text-neutral-100">استوديو التصميم الذكي لمتجر حسين</h4>
                          
                          {/* Design Canvas preview */}
                          <div className={`aspect-video rounded-xl border border-white/10 flex flex-col items-center justify-center p-4 relative overflow-hidden transition-all bg-${canvaColor}-550/10`}>
                            {/* Abstract glowing graphics */}
                            <div className={`absolute -top-10 -right-10 w-24 h-24 bg-${canvaColor}-500/20 rounded-full blur-xl animate-pulse`} />
                            
                            <span className="text-3xl mb-1">🎨</span>
                            <h5 className="text-xs font-black text-white text-center z-10">{canvaTemplate}</h5>
                            <span className="text-[8px] text-neutral-400 mt-1 z-10">تصميم ذكي احترافي مخصص لليمن</span>
                          </div>

                          {/* Controls */}
                          <div className="flex flex-col gap-2 mt-2">
                            <span className="text-[9px] text-neutral-500 font-bold">1. اختر اللون الرئيسي للتصميم:</span>
                            <div className="flex gap-2 justify-end">
                              {["teal", "amber", "rose", "indigo"].map((col) => (
                                <button
                                  key={col}
                                  onClick={() => setCanvaColor(col)}
                                  className={`w-6 h-6 rounded-full border cursor-pointer transition ${
                                    canvaColor === col ? "border-white scale-110" : "border-transparent"
                                  }`}
                                  style={{ backgroundColor: col === "rose" ? "#f43f5e" : col === "teal" ? "#14b8a6" : col === "amber" ? "#f59e0b" : "#6366f1" }}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <span className="text-[9px] text-neutral-500 font-bold">2. اختر قالب التصميم الجاهز:</span>
                            <div className="flex flex-wrap gap-1.5 justify-end">
                              {["شعار متجر حسين", "أخبار شدات ببجي", "تشكيلة فيفا اليمن", "بطاقة تهنئة يمنية"].map((tpl) => (
                                <button
                                  key={tpl}
                                  onClick={() => setCanvaTemplate(tpl)}
                                  className={`text-[9px] font-bold py-1 px-2.5 rounded-lg border transition cursor-pointer ${
                                    canvaTemplate === tpl ? "bg-teal-500 text-black border-teal-500" : "bg-neutral-900 text-neutral-400 border-white/5"
                                  }`}
                                >
                                  {tpl}
                                </button>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setCanvaExported(true);
                              setTimeout(() => setCanvaExported(false), 2500);
                            }}
                            className="bg-teal-500 hover:bg-teal-400 text-black font-black text-[10px] py-2 rounded-xl transition cursor-pointer"
                          >
                            تصدير وتحميل التصميم الآن
                          </button>
                        </div>

                        {canvaExported && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl text-center text-emerald-400 text-[10px] font-black"
                          >
                            🎉 تم تصدير التصميم بدقة عالية وحفظه في جهازك!
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* GENERAL FALLBACK / RAW VIEWER SIMULATOR */}
                    {!(selectedSite.url.includes("hussein-nat") || selectedSite.title.includes("حسين") || selectedSite.url.includes("youtube") || selectedSite.url.includes("kooora") || selectedSite.url.includes("chatgpt") || selectedSite.url.includes("translate") || selectedSite.url.includes("canva")) && (
                      <div className="p-4 flex flex-col gap-4 text-right">
                        <div className="bg-[#15151c] border border-white/5 rounded-2xl p-4 text-center flex flex-col items-center gap-2">
                          <span className="text-4xl">{selectedSite.icon}</span>
                          <h3 className="text-xs font-black text-white">{selectedSite.title} - تصفح كامل بالذكاء الاصطناعي</h3>
                          <p className="text-[10px] text-neutral-400 leading-relaxed max-w-xs">
                            هذا الموقع مهيأ تصفحه حالياً بالذكاء الاصطناعي. يمكنك استخدام التبويبات بالأعلى للحصول على ملخص فوري للموقع وميزاته أو التحدث مع المساعد الخاص به للإجابة عن أسئلتك.
                          </p>
                        </div>

                        {/* Simulated Reader Mode */}
                        <div className="bg-[#121217] border border-white/5 rounded-xl p-3.5 flex flex-col gap-2">
                          <span className="text-[9px] text-neutral-500 font-bold">وضع القارئ الذكي (Reader Mode):</span>
                          <h4 className="text-xs font-black text-neutral-200">{selectedSite.title}</h4>
                          <p className="text-[10px] text-neutral-400 leading-relaxed">
                            تُظهر هذه المساحة المحتوى المصفى من الإعلانات والمقروء بسلاسة تامة. استخدم مساعد الـ AI للتفاعل الفوري مع محتوى هذا الموقع.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. AI PAGE SUMMARY VIEW */}
                {activeTab === "summary" && (
                  <div className="flex-1 p-4 overflow-y-auto">
                    {summaryLoading ? (
                      <div className="flex flex-col items-center justify-center h-48 gap-3">
                        <RefreshCw className="w-8 h-8 text-teal-400 animate-spin" />
                        <span className="text-xs text-neutral-400">جاري قراءة وتلخيص الموقع بالذكاء الاصطناعي...</span>
                      </div>
                    ) : aiSummary ? (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="flex flex-col gap-4 text-right"
                      >
                        <div className="bg-teal-500/5 border border-teal-500/20 p-3.5 rounded-2xl">
                          <span className="text-[9px] text-teal-400 font-bold mb-1 block">الملخص الذكي:</span>
                          <p className="text-xs text-neutral-200 leading-relaxed">
                            {aiSummary.summary}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] text-neutral-400 font-bold">أبرز ميزات واستخدامات هذا الموقع:</span>
                          <div className="flex flex-col gap-2">
                            {aiSummary.features.map((feat, idx) => (
                              <div key={idx} className="bg-[#16161f] border border-white/5 p-3 rounded-xl flex items-start gap-2.5">
                                <p className="text-xs text-neutral-300 flex-1 leading-relaxed text-right">{feat}</p>
                                <div className="w-5 h-5 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                                  <Sparkles className="w-3 h-3" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-center py-10 text-neutral-500 text-xs">تعذر تحميل الملخص حالياً. الرجاء المحاولة مجدداً.</div>
                    )}
                  </div>
                )}

                {/* 3. AI CHAT HELPER VIEW */}
                {activeTab === "chat" && (
                  <div className="flex-1 p-3 flex flex-col justify-between overflow-hidden">
                    <div className="flex-1 overflow-y-auto flex flex-col gap-3.5 max-h-[300px] mb-2 pr-1">
                      {chatMessages.map((msg, i) => (
                        <div 
                          key={i} 
                          className={`flex flex-col gap-1 max-w-[85%] ${msg.sender === "user" ? "self-start text-left" : "self-end text-right"}`}
                        >
                          <span className="text-[8px] text-neutral-500">{msg.sender === "user" ? "أنت" : "مساعد تصفح NAT AI"}</span>
                          <div 
                            className={`p-2.5 rounded-2xl text-[10px] leading-relaxed ${
                              msg.sender === "user" ? "bg-teal-500 text-black font-bold" : "bg-[#1d1d26] text-neutral-200 text-right"
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="self-end text-right">
                          <div className="bg-[#1d1d26] text-neutral-400 text-[10px] p-2.5 rounded-2xl animate-pulse">
                            جاري تحليل طلبك... 🤖
                          </div>
                        </div>
                      )}
                      <div ref={bottomChatRef} />
                    </div>

                    <div className="flex gap-2 border-t border-white/5 pt-2">
                      <button
                        onClick={handleAskAI}
                        className="p-2.5 bg-teal-500 hover:bg-teal-400 text-black rounded-xl transition cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAskAI();
                        }}
                        placeholder="اسألني عن الموقع وميزاته..."
                        className="flex-1 bg-[#15151c] border border-white/10 rounded-xl p-2.5 text-right text-xs focus:outline-none focus:border-teal-500 text-neutral-100"
                      />
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Navigation Bar */}
      <div className="w-full bg-[#111115] border-t border-white/5 py-4 px-6 flex items-center justify-between z-20 shadow-md">
        <div className="text-[9px] text-neutral-500 font-black">
          مستكشف NAT ذكاء اصطناعي 1.0.0
        </div>
        <button 
          onClick={onClose}
          className="text-xs font-black text-neutral-300 hover:text-white transition flex items-center gap-1 cursor-pointer"
        >
          <span>الخروج للرئيسية</span>
          <ArrowRight className="w-4 h-4 text-neutral-400" />
        </button>
      </div>
    </div>
  );
}
