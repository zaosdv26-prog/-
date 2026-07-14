import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Tv, 
  Sparkles, 
  Star, 
  Share2, 
  Download, 
  MessageSquare, 
  ThumbsUp, 
  Compass, 
  Award, 
  TrendingUp, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Subtitles, 
  Bookmark, 
  BookmarkCheck, 
  Clock, 
  Send,
  HelpCircle,
  Trophy,
  CheckCircle2,
  Users,
  ChevronLeft,
  Tv2
} from "lucide-react";

interface ShababAlBombScreenProps {
  onClose: () => void;
}

interface Episode {
  id: number;
  title: string;
  duration: string;
  views: string;
  rating: number;
  description: string;
  icon: string;
}

interface Comment {
  id: number;
  author: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
  userLiked?: boolean;
}

export default function ShababAlBombScreen({ onClose }: ShababAlBombScreenProps) {
  // Constant episodes of Season 12
  const episodes: Episode[] = [
    { id: 1, title: "المعسكر الكشفي", duration: "24:15", views: "3.4M", rating: 4.9, description: "يقرر عامر وأصدقاؤه الانضمام إلى معسكر كشفي في الصحراء، ولكن تجري الرياح بما لا تشتهي السفن وتحدث مفارقات مضحكة.", icon: "🏕️" },
    { id: 2, title: "تحدي الشدات والـ UC", duration: "26:30", views: "4.1M", rating: 5.0, description: "يدخل عامر في تحدي شحن ألعاب ملحمي، ويقوم بالشحن مباشرة من 'متجر حسين NAT' الشهير ليصبح أقوى لاعب ببجي في الحي!", icon: "🔥" },
    { id: 3, title: "الكاميرا الخفية والترند", duration: "25:05", views: "2.8M", rating: 4.7, description: "يقرر تركي تصوير مقلب كاميرا خفية في شكش وياسر من أجل تصدر الترند، لكن ينقلب السحر على الساحر بطريقة كوميدية.", icon: "📸" },
    { id: 4, title: "الذكاء الاصطناعي الخارق", duration: "27:12", views: "5.2M", rating: 4.9, description: "يشتري عامر جهازاً ذكياً جديداً مبرمجاً بالذكاء الاصطناعي لمساعدته في الواجبات والقرارات اليومية، مما يسبب كارثة في البيت.", icon: "🤖" },
    { id: 5, title: "بطل فيفا 24", duration: "24:50", views: "3.7M", rating: 4.8, description: "يتنافس ياسر وعامر على بطولة البلايستيشن في مقهى الحي، وتحدث مواجهة كروية حاسمة على غرار نجوم الدوري اليمني والسعودي.", icon: "⚽" },
    { id: 6, title: "الرحلة السياحية", duration: "23:40", views: "2.9M", rating: 4.6, description: "تخطط الشلة للسفر إلى مدينة سياحية جميلة، لكن يضيع عامر تذاكر الطائرة وتبدأ مغامرة برية طويلة وعجيبة.", icon: "🚌" },
    { id: 7, title: "مستثمر الغد الرقمي", duration: "26:15", views: "3.1M", rating: 4.7, description: "يقرر شكش استثمار كل أمواله في العملات المشفرة وتصميم الشعارات، ويتعلم أهمية العمل الجاد والذكاء المالي.", icon: "💻" },
    { id: 8, title: "كشتة البر والضباب", duration: "25:40", views: "3.3M", rating: 4.8, description: "أجواء شتوية دافئة تجمع عامر وعائلته في طلعة بر ممتعة يتخللها حكايات وقصص قديمة شيقة ومواقف طريفة مع أبو عامر.", icon: "⛺" },
    { id: 9, title: "المصمم المحترف", duration: "24:20", views: "2.5M", rating: 4.5, description: "يحاول عامر استخدام تطبيقات التصميم لتصميم لوحة إعلانية لمحل والده، لكن النتيجة تخرج بشكل لا يصدق.", icon: "🎨" },
    { id: 10, title: "سرقة الحساب المشترك", duration: "27:00", views: "4.5M", rating: 4.9, description: "يتم اختراق حساب الشلة الموحد في الألعاب الرقمية، ويبدأ عامر مغامرة استعادته باستخدام مستكشف المواقع الذكي.", icon: "🔐" },
    { id: 11, title: "البطولة الفضية", duration: "25:10", views: "3.0M", rating: 4.7, description: "يدخل الأصدقاء بطولة رياضية محلية لحصد الكأس والجوائز المالية المغرية، ويتدربون بشكل كوميدي صارم.", icon: "🏆" },
    { id: 12, title: "ياسر في ورطة حقيقية", duration: "23:55", views: "3.2M", rating: 4.6, description: "يقع ياسر في سوء تفاهم كبير مع مدير المدرسة بسبب رسالة واتساب أرسلها بالخطأ من هاتف حسين.", icon: "📱" },
    { id: 13, title: "الديربي العظيم", duration: "26:45", views: "4.8M", rating: 5.0, description: "يوم ديربي العاصمة الكروي الحاسم وسط انقسام جماهيري حاد بين عامر (الهلالي) وشكش (النصراوي) وتحديات حماسية.", icon: "🔥" },
    { id: 14, title: "المطعم الفاخر", duration: "24:35", views: "2.7M", rating: 4.4, description: "تتم دعوة الشلة لتناول العشاء في مطعم خمس نجوم فاخر، فتحدث فوضى بسبب جهلهم ببروتوكولات الإتيكيت الفخم.", icon: "🍽️" },
    { id: 15, title: "عالم الميتافيرس", duration: "28:10", views: "5.0M", rating: 4.9, description: "يرتدي عامر نظارة الواقع الافتراضي ويدخل عالم الميتافيرس الرقمي، ليعيش واقعاً بديلاً مثيراً وغريباً.", icon: "🕶️" },
    { id: 16, title: "الجار الجديد", duration: "23:50", views: "2.9M", rating: 4.5, description: "ينتقل جار جديد غامض ومريب للعيش بجوار منزل عامر، مما يدفع الأصدقاء لمراقبته لكشف أسراره الكوميدية.", icon: "🏠" },
    { id: 17, title: "يوميات سائق التوصيل", duration: "25:20", views: "3.6M", rating: 4.7, description: "يعمل عامر كسائق توصيل طلبات عبر التطبيقات لتوفير مصروفه الشخصي، ويواجه زبائن غريبي الأطوار.", icon: "🚗" },
    { id: 18, title: "الهروب الكبير من الامتحان", duration: "24:45", views: "3.9M", rating: 4.8, description: "خطة عبقرية ومحاولات مستميتة من ياسر وشكش لتأجيل اختبار الفيزياء الصعب بشتى الطرق الممكنة.", icon: "📝" },
    { id: 19, title: "بطولة البلوت الكبرى", duration: "26:00", views: "3.5M", rating: 4.7, description: "يتنافس كبار وصغار الحي في بطولة بلوت سنوية حامية للحصول على لقب 'ملك البلوت' وجائزة قيمة جداً.", icon: "🃏" },
    { id: 20, title: "برودكاست واتساب المزعج", duration: "25:30", views: "3.1M", rating: 4.6, description: "تنتشر شائعة مضحكة في الحي بسبب رسالة جماعية مرسلة بالخطأ، ويحاول الأصدقاء تتبع مصدر الرسالة لإيقافها.", icon: "💬" },
    { id: 21, title: "المعلق الرياضي", duration: "24:10", views: "2.8M", rating: 4.5, description: "يكتشف عامر موهبة التعليق الرياضي لديه ويحاول تقليد كبار المعلقين العرب في مباراة الحي المحلية.", icon: "🎙️" },
    { id: 22, title: "الخاتم العجيب", duration: "25:55", views: "4.0M", rating: 4.8, description: "يعثر شكش على خاتم قديم يعتقد أنه سحري ويجلب الحظ السعيد، فتبدأ الشلة بطلب أمنيات خيالية غريبة.", icon: "💍" },
    { id: 23, title: "تحدي بدون كلام", duration: "24:30", views: "3.3M", rating: 4.7, description: "لعبة عائلية مسلية تجمع عائلة عامر في تحدي 'بدون كلام' للأفلام والمسلسلات مع شروط جزائية مضحكة.", icon: "🤫" },
    { id: 24, title: "السيارة الكلاسيكية", duration: "26:20", views: "3.0M", rating: 4.6, description: "يشتري أبو عامر سيارة قديمة كلاسيكية ويعتبرها كنزاً، لكن عامر يأخذها في جولة سرية مع أصدقائه وتتعطل.", icon: "🚘" },
    { id: 25, title: "رائد الفضاء عامر", duration: "27:40", views: "4.9M", rating: 4.9, description: "في حلم خيالي مذهل، يسافر عامر وأصدقاؤه إلى الفضاء الخارجي لإنشاء أول مقهى للشباب على سطح القمر.", icon: "🚀" },
    { id: 26, title: "أزمة المياه بالحي", duration: "23:15", views: "2.4M", rating: 4.4, description: "تنقطع المياه عن مربع الحي السكني، ويبدأ الجيران رحلة كوميدية بالدلاء والجرار للحصول على الماء.", icon: "💧" },
    { id: 27, title: "الذاكرة المفقودة", duration: "25:00", views: "3.2M", rating: 4.6, description: "يستيقظ ياسر وهو لا يتذكر من هو ولا يتعرف على أصدقائه، فيحاول عامر وشكش إعادتها إليه بمواقف غريبة.", icon: "🧠" },
    { id: 28, title: "مهرجان الأكلات الشعبية", duration: "24:55", views: "2.9M", rating: 4.5, description: "يشاركون في مسابقة لطهي أفضل طبخة يمنية وسعودية شعبية (سلتة، كبسة، حنيذ) وسط أجواء تنافسية شهية.", icon: "🍲" },
    { id: 29, title: "اللقاء الأخير ج1", duration: "27:15", views: "5.0M", rating: 5.0, description: "بداية الحلقة المزدوجة الختامية لرحلة الموسم 12 المليئة بالمفاجآت والوداع الكوميدي المؤثر للشلة.", icon: "🎬" },
    { id: 30, title: "الوداع السعيد ج2", duration: "29:50", views: "6.5M", rating: 5.0, description: "الحلقة الثلاثون الختامية! نهاية مغامرات الموسم الثاني عشر مع احتفال ضخم يجمع كل أبطال ومحبي السلسلة الكوميدية.", icon: "🎉" }
  ];

  // Core States
  const [selectedEpisode, setSelectedEpisode] = useState<Episode>(episodes[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [videoQuality, setVideoQuality] = useState("1080p");
  const [hasSubtitles, setHasSubtitles] = useState(false);
  const [activeTab, setActiveTab] = useState<"episodes" | "details" | "comments" | "quiz" | "ai_script">("episodes");
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [likes, setLikes] = useState<Record<number, number>>({ 1: 1420, 2: 2350, 3: 980 });
  const [hasLiked, setHasLiked] = useState<Record<number, boolean>>({});

  // Comment section state
  const [newComment, setNewComment] = useState("");
  const [episodeComments, setEpisodeComments] = useState<Record<number, Comment[]>>({
    1: [
      { id: 101, author: "حسين NAT", avatar: "🔥", text: "أفضل حلقة في الموسم! المعسكر الكشفي رهيب جداً ويمثل الواقع الكوميدي هههه", time: "قبل ساعتين", likes: 245 },
      { id: 102, author: "محمد السعيدي", avatar: "⚽", text: "تمثيل عامر (فيصل العيسى) إبداع بلا حدود.. ننتظر المزيد دائماً!", time: "قبل يوم", likes: 89 }
    ],
    2: [
      { id: 201, author: "ياسين اليماني", avatar: "🇾🇪", text: "هههه عامر يشحن شدات من متجر حسين NAT كفو والله فكرة خرافية!", time: "قبل 10 دقائق", likes: 320 },
      { id: 202, author: "رعد القلوب", avatar: "⚡", text: "متجر حسين أفضل متجر شحن باليمن وببجي صارت إدمان مع شباب البومب!", time: "قبل ساعة", likes: 112 }
    ]
  });

  // Quiz game state
  const quizQuestions = [
    {
      q: "ما هو اسم الشخصية الرئيسية التي يمثلها فيصل العيسى في شباب البومب؟",
      options: ["ياسر", "شكش", "عامر", "تركي"],
      answer: 2
    },
    {
      q: "في أي حلقة من الموسم 12 تم شحن شدات ببجي من متجر حسين NAT؟",
      options: ["الحلقة الأولى", "الحلقة الثانية", "الحلقة الخامسة", "الحلقة الثلاثون"],
      answer: 1
    },
    {
      q: "ما هي الأكلة اليمنية الشعبية التي تم طبخها في مهرجان الأكلات الشعبية بالحلقة 28؟",
      options: ["السلتة والكبسة", "الشاورما", "البيتزا", "البرجر"],
      answer: 0
    },
    {
      q: "من هو الممثل الكوميدي الذي يقوم بدور شخصية 'شكش'؟",
      options: ["محمد الدوسري", "عبد العزيز الفريحي", "مهند الجميلي", "سليمان المقيطيب"],
      answer: 2
    }
  ];
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState("");

  // AI Script Generator state
  const [userPrompt, setUserPrompt] = useState("");
  const [aiScript, setAiScript] = useState("");
  const [generatingScript, setGeneratingScript] = useState(false);

  // Cast Data
  const castList = [
    { name: "فيصل العيسى", role: "بدور 'عامر'", desc: "بطل السلسلة وقائد الشلة الفكاهي الذي يقع دائماً في مواقف مضحكة.", img: "👤" },
    { name: "مهند الجميلي", role: "بدور 'شكش'", desc: "صديق عامر المقرب، يتميز بضحكته الخاصة وردود أفعاله السريعة والساخرة.", img: "👦" },
    { name: "محمد الدوسري", role: "بدور 'ياسر'", desc: "العضو الأنيق في الشلة، يحاول دائماً حل المشاكل بعقلانية لكنه يفشل.", img: "👨" },
    { name: "عبد العزيز الفريحي", role: "بدور 'تركي'", desc: "كاتب السيناريو المشارك وممثل دور تركي الهادئ والمحب للمقالب والترند.", img: "🧔" },
    { name: "سليمان المقيطيب", role: "بدور 'كفتة'", desc: "شخصية محبوبة جداً لدى الجماهير، يتدخل في الأوقات الخاطئة بطريقة كوميدية.", img: "👴" }
  ];

  // Video Seeker effect simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackTime(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Toggle bookmark / watch later
  const toggleBookmark = (id: number) => {
    if (bookmarks.includes(id)) {
      setBookmarks(prev => prev.filter(item => item !== id));
    } else {
      setBookmarks(prev => [...prev, id]);
    }
  };

  // Like episode
  const handleLike = (id: number) => {
    const liked = hasLiked[id];
    setHasLiked(prev => ({ ...prev, [id]: !liked }));
    setLikes(prev => {
      const current = prev[id] || 120;
      return { ...prev, [id]: liked ? current - 1 : current + 1 };
    });
  };

  // Submit comment
  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    const commentId = Date.now();
    const freshComment: Comment = {
      id: commentId,
      author: "زائر ذكي",
      avatar: "👤",
      text: newComment,
      time: "الآن",
      likes: 0
    };

    setEpisodeComments(prev => {
      const currentList = prev[selectedEpisode.id] || [];
      return {
        ...prev,
        [selectedEpisode.id]: [freshComment, ...currentList]
      };
    });
    setNewComment("");
  };

  // Handle Quiz selection
  const handleOptionSelect = (optionIdx: number) => {
    if (selectedOption !== null) return; // prevent changing answer
    setSelectedOption(optionIdx);
    const correct = quizQuestions[currentQuestionIdx].answer;
    if (optionIdx === correct) {
      setQuizScore(prev => prev + 1);
      setQuizFeedback("🎉 إجابة صحيحة وممتازة! كفو يا بطل شباب البومب.");
    } else {
      setQuizFeedback(`❌ إجابة خاطئة! الإجابة الصحيحة هي: ${quizQuestions[currentQuestionIdx].options[correct]}`);
    }
  };

  // Next Quiz question
  const handleNextQuestion = () => {
    setSelectedOption(null);
    setQuizFeedback("");
    if (currentQuestionIdx < quizQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  // Reset Quiz
  const handleResetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setQuizScore(0);
    setQuizFinished(false);
    setQuizFeedback("");
  };

  // Play another episode
  const selectEpisodeToPlay = (ep: Episode) => {
    setSelectedEpisode(ep);
    setIsPlaying(true);
    setPlaybackTime(0);
  };

  // Generate Script with AI / Fallback
  const handleGenerateScript = async () => {
    if (!userPrompt.trim()) return;
    setGeneratingScript(true);
    setAiScript("");

    try {
      // Call server side Gemini browser api route or formulate localized hilarious script idea
      const response = await fetch("/api/browser/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          url: "https://shabab-albomb-generator.com/script", 
          title: `فكرة حلقة جديدة: ${userPrompt}` 
        }),
      });
      const data = await response.json();
      
      // Let's create an incredibly hilarious custom Shabab Al Bomb script
      setTimeout(() => {
        const arabicScriptTemplate = `
🎬 **سيناريو حلقة مخصصة من تأليف الذكاء الاصطناعي** 🎬
--------------------------------------------------
📌 **عنوان الحلقة المقترح:** "عامر والمغامرة الذكية"
🎭 **الأبطال المشاركون:** عامر، شكش، كفتة، ياسر، وأبو عامر.

📝 **ملخص الفكرة المنتجة:**
${userPrompt}

💬 **الحوار واللقطات الكوميدية البارزة:**
- [مشهد 1 - الاستراحة]: يجلس عامر ممسكاً بهاتفه وهو يصرخ بحماس شديد.
  عامر: "يا عيال! شحنت 4000 شدة ببجي من متجر حسين NAT وصار حسابي أسطوري! والفضل للذكاء الاصطناعي!"
- [مشهد 2 - شكش يدخل مسرعاً]: شكش يلهث ومعه نظارة غريبة.
  شكش: "عامر عامر! شف ذي النظارة.. تخليك تشوف اللوت بوسط الصحراء كأنه حقيقي!"
- [مشهد 3 - كفتة يدخل ومعه صحن كبسة]:
  كفتة: "اللوت الحقيقي هو الكبسة واللحم يا شباب، بلا ألعاب بلا بطيخ!"
- [مشهد 4 - الصدمة]: يدخل أبو عامر ومعه عصا التخيزرانة الشهيرة.
  أبو عامر: "عامرررر! وين رحت بمفتاح السيارة الكلاسيكية؟"
  عامر (يخفي الهاتف ويبلع ريقه): "يبا.. كنا نسوي بث مباشر لتعليم القيادة بالذكاء الاصطناعي في الفضاء!"

✨ **العبرة الكوميدية:** التكنولوجيا والشدات ممتعة، ولكن احترام سيارة الوالد والصدق هما اللوت الأقوى!
--------------------------------------------------
🌟 تم توليد هذه الحلقة بناءً على فكرتك الذكية ودمجها ببيئة متجر حسين NAT!`;
        
        setAiScript(arabicScriptTemplate);
        setGeneratingScript(false);
      }, 1500);

    } catch (e) {
      setGeneratingScript(false);
      setAiScript("عذراً، حدث خطأ أثناء تشغيل مولد الأفكار بالذكاء الاصطناعي. يرجى المحاولة لاحقاً!");
    }
  };

  return (
    <div className="h-full w-full bg-[#0a0a0c] text-white flex flex-col justify-between relative overflow-hidden font-sans select-none">
      
      {/* Cinematic Red/Rose Ambience */}
      <div className="absolute top-[-80px] right-[-80px] w-80 h-80 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container Header */}
      <div className="w-full bg-[#111115]/90 border-b border-white/5 py-3 px-4 flex items-center justify-between z-20 shadow-md backdrop-blur-md">
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/5 rounded-xl transition text-neutral-400 hover:text-white cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-1.5">
          <Tv className="w-4.5 h-4.5 text-red-500 animate-pulse" />
          <h1 className="text-xs font-black tracking-wide text-neutral-100">شباب البومب 12 - منصة السينما التفاعلية</h1>
        </div>
        <div className="w-7 h-7 rounded-lg bg-red-600/10 border border-red-500/30 flex items-center justify-center">
          <span className="text-[10px] font-black text-red-500">ج12</span>
        </div>
      </div>

      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto z-10 px-4 py-4 scrollbar-thin">
        <div className="flex flex-col gap-4 pb-6">

          {/* SIMULATED CINEMATIC PLAYER */}
          <div className="bg-[#111116] border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative">
            
            {/* Visual Screen Container */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center group">
              
              {/* Playback simulation screen */}
              {isPlaying ? (
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-900 flex flex-col items-center justify-center">
                  <span className="text-5xl animate-bounce mb-3">{selectedEpisode.icon}</span>
                  <div className="text-center px-4">
                    <span className="text-[10px] bg-red-600 text-white font-black px-2 py-0.5 rounded-full uppercase text-xs">جاري التشغيل</span>
                    <h3 className="text-xs font-black mt-1.5 text-neutral-200">الحلقة {selectedEpisode.id}: {selectedEpisode.title}</h3>
                    <p className="text-[9px] text-neutral-400 mt-1">مشاهدة ممتعة بجودة {videoQuality}</p>
                  </div>

                  {/* Simulated subtitle overlay if enabled */}
                  {hasSubtitles && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute bottom-12 bg-black/80 border border-white/10 px-4 py-1.5 rounded-xl text-[10px] font-black text-center text-yellow-400 max-w-[80%]"
                    >
                      [عامر]: يا شباب، لا يفوتكم الشحن من متجر حسين NAT فوري وبثواني! 🎮
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black flex flex-col items-center justify-center">
                  <span className="text-5xl opacity-40">{selectedEpisode.icon}</span>
                  <button 
                    onClick={() => setIsPlaying(true)}
                    className="absolute w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer z-10"
                  >
                    <Play className="w-6 h-6 fill-white ml-1" />
                  </button>
                  <span className="absolute bottom-4 text-[9px] text-neutral-400">انقر لتشغيل الحلقة {selectedEpisode.id} مجاناً</span>
                </div>
              )}

              {/* Player control overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/60 to-transparent p-3 flex flex-col gap-1.5 opacity-90 transition-opacity group-hover:opacity-100">
                {/* Duration/Progress bar */}
                <div className="flex items-center gap-2">
                  <span className="text-[8px] text-neutral-400 font-mono">
                    {Math.floor((playbackTime / 100) * 25)}:{(playbackTime % 10) * 6}
                  </span>
                  <div className="flex-1 bg-white/20 h-1 rounded-full overflow-hidden cursor-pointer">
                    <div className="bg-red-600 h-full transition-all" style={{ width: `${playbackTime}%` }} />
                  </div>
                  <span className="text-[8px] text-neutral-400 font-mono">{selectedEpisode.duration}</span>
                </div>

                {/* Control buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setHasSubtitles(!hasSubtitles)}
                      className={`p-1 rounded text-neutral-400 hover:text-white transition cursor-pointer ${hasSubtitles ? "text-yellow-400" : ""}`}
                      title="ترجمة"
                    >
                      <Subtitles className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1 rounded text-neutral-400 hover:text-white transition cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                    <span className="text-[9px] text-neutral-400 bg-white/5 px-1.5 py-0.5 rounded">
                      {videoQuality}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-1.5 bg-red-600 rounded-lg text-white hover:bg-red-500 transition cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Episode quick description bar */}
            <div className="p-4 bg-[#14141a] text-right">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleLike(selectedEpisode.id)}
                    className="flex items-center gap-1 text-[10px] bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-xl transition cursor-pointer text-neutral-300"
                  >
                    <ThumbsUp className={`w-3 h-3 ${hasLiked[selectedEpisode.id] ? "text-red-500 fill-red-500" : ""}`} />
                    <span>{likes[selectedEpisode.id] || 120}</span>
                  </button>
                  <button 
                    onClick={() => toggleBookmark(selectedEpisode.id)}
                    className="p-1.5 bg-white/5 hover:bg-white/10 rounded-xl transition text-neutral-300 cursor-pointer"
                  >
                    {bookmarks.includes(selectedEpisode.id) ? (
                      <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Bookmark className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="flex-1">
                  <h2 className="text-xs font-black text-neutral-100">
                    الحلقة {selectedEpisode.id}: {selectedEpisode.title}
                  </h2>
                  <div className="flex items-center justify-end gap-2 text-[9px] text-neutral-400 mt-1">
                    <span>{selectedEpisode.views} مشاهدة</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-amber-500">
                      <Star className="w-3 h-3 fill-amber-500" />
                      {selectedEpisode.rating}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-neutral-400 mt-2.5 leading-relaxed bg-[#191922] p-2.5 rounded-xl border border-white/5">
                {selectedEpisode.description}
              </p>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex bg-[#121217] p-1 rounded-xl gap-1">
            <button
              onClick={() => setActiveTab("ai_script")}
              className={`flex-1 py-2 rounded-lg text-[10px] font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "ai_script" ? "bg-red-600 text-white shadow-lg" : "text-neutral-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>أفكار الـ AI</span>
            </button>

            <button
              onClick={() => setActiveTab("quiz")}
              className={`flex-1 py-2 rounded-lg text-[10px] font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "quiz" ? "bg-red-600 text-white shadow-lg" : "text-neutral-400 hover:text-white"
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>مسابقة الجماهير</span>
            </button>

            <button
              onClick={() => setActiveTab("comments")}
              className={`flex-1 py-2 rounded-lg text-[10px] font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "comments" ? "bg-red-600 text-white shadow-lg" : "text-neutral-400 hover:text-white"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>التعليقات</span>
            </button>

            <button
              onClick={() => setActiveTab("details")}
              className={`flex-1 py-2 rounded-lg text-[10px] font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "details" ? "bg-red-600 text-white shadow-lg" : "text-neutral-400 hover:text-white"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>الأبطال</span>
            </button>

            <button
              onClick={() => setActiveTab("episodes")}
              className={`flex-1 py-2 rounded-lg text-[10px] font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "episodes" ? "bg-red-600 text-white shadow-lg" : "text-neutral-400 hover:text-white"
              }`}
            >
              <Tv2 className="w-3.5 h-3.5" />
              <span>الحلقات ({episodes.length})</span>
            </button>
          </div>

          {/* TAB DETAILED CONTENTS */}
          <div className="bg-[#121217] border border-white/5 rounded-2xl p-4 min-h-[300px]">
            <AnimatePresence mode="wait">
              
              {/* 1. ALL EPISODES LIST */}
              {activeTab === "episodes" && (
                <motion.div
                  key="episodes-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 px-1 mb-1">
                    <span>جميع الحلقات الثلاثون مع ميزة المشاهدة الفورية</span>
                    <span className="text-red-500 font-bold">شباب البومب ج12</span>
                  </div>

                  <div className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto scrollbar-thin">
                    {episodes.map((ep) => {
                      const isCurrent = selectedEpisode.id === ep.id;
                      return (
                        <div 
                          key={ep.id}
                          onClick={() => selectEpisodeToPlay(ep)}
                          className={`p-3 rounded-2xl text-right transition cursor-pointer flex justify-between items-center ${
                            isCurrent 
                              ? "bg-red-600/15 border-2 border-red-500" 
                              : "bg-[#16161f] border border-white/5 hover:border-white/10"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isCurrent && isPlaying ? (
                              <span className="text-[9px] bg-red-600 text-white font-black px-1.5 py-0.5 rounded-md animate-pulse">
                                يعرض الآن
                              </span>
                            ) : (
                              <button 
                                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-xs hover:bg-red-600 hover:text-white transition"
                              >
                                ▶
                              </button>
                            )}
                            <span className="text-[9px] text-neutral-400 font-mono">{ep.duration}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div>
                              <h4 className="text-[10px] font-black text-neutral-100">
                                الحلقة {ep.id}: {ep.title}
                              </h4>
                              <p className="text-[8px] text-neutral-400 mt-0.5 max-w-[190px] truncate leading-normal">
                                {ep.description}
                              </p>
                            </div>
                            <span className="text-xl p-1.5 bg-[#1f1f2c] rounded-xl">{ep.icon}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* 2. CAST / HEROES DIRECTORY */}
              {activeTab === "details" && (
                <motion.div
                  key="details-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-3 text-right"
                >
                  <h3 className="text-xs font-black text-neutral-100 flex items-center justify-end gap-1">
                    <span>نجوم شباب البومب ج12</span>
                    <Users className="w-4 h-4 text-red-500" />
                  </h3>
                  <p className="text-[9px] text-neutral-400 leading-relaxed">
                    تعرف على الكادر الفني والأبطال الكوميديين الذين رافقونا طوال مسيرة هذا العمل الإبداعي الممتاز:
                  </p>

                  <div className="flex flex-col gap-2 mt-2">
                    {castList.map((actor, idx) => (
                      <div key={idx} className="bg-[#16161f] p-3 rounded-2xl border border-white/5 flex items-center gap-3">
                        <span className="text-3xl bg-[#1d1d2b] p-2 rounded-xl">{actor.img}</span>
                        <div className="flex-1">
                          <h4 className="text-[10px] font-black text-neutral-100">{actor.name}</h4>
                          <span className="text-[8px] text-red-400 font-bold mt-0.5 block">{actor.role}</span>
                          <p className="text-[9px] text-neutral-400 mt-1 leading-normal">{actor.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* 3. COMMENTS & RATING */}
              {activeTab === "comments" && (
                <motion.div
                  key="comments-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-3 flex-1 h-full text-right"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-neutral-400">تواصل مع معجبي شباب البومب في اليمن والوطن العربي</span>
                    <h3 className="text-xs font-black text-neutral-100">آراء وتفاعلات الجمهور</h3>
                  </div>

                  {/* Comment input box */}
                  <div className="bg-[#16161f] border border-white/5 p-2 rounded-2xl flex gap-2">
                    <button 
                      onClick={handleSubmitComment}
                      className="bg-red-600 hover:bg-red-500 text-white rounded-xl p-2 transition cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                    <input 
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="اكتب تعليقك أو انطباعك عن هذه الحلقة..."
                      className="flex-1 bg-transparent text-xs text-right focus:outline-none placeholder-neutral-500"
                    />
                  </div>

                  {/* Render Comments */}
                  <div className="flex flex-col gap-2.5 mt-2 max-h-[220px] overflow-y-auto scrollbar-thin">
                    {(episodeComments[selectedEpisode.id] || []).map((comment) => (
                      <div key={comment.id} className="bg-[#16161f]/60 p-3 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[8px] text-neutral-500">{comment.time}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-black text-neutral-200">{comment.author}</span>
                            <span className="text-xs">{comment.avatar}</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-neutral-300 leading-normal">{comment.text}</p>
                      </div>
                    ))}

                    {(!episodeComments[selectedEpisode.id] || episodeComments[selectedEpisode.id].length === 0) && (
                      <div className="text-center py-8 text-neutral-500 text-[10px]">
                        كن أول من يعلق ويشارك رأيه على هذه الحلقة بالـ AI! 🍿
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* 4. FAN TRIVIA QUIZ */}
              {activeTab === "quiz" && (
                <motion.div
                  key="quiz-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4 text-right"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] bg-red-600/20 text-red-400 font-bold px-2 py-0.5 rounded-full">النقاط: {quizScore}</span>
                    <h3 className="text-xs font-black text-neutral-100 flex items-center gap-1 justify-end">
                      <span>مسابقة ومسائل شباب البومب</span>
                      <Trophy className="w-4 h-4 text-amber-500" />
                    </h3>
                  </div>

                  {!quizFinished ? (
                    <div className="bg-[#16161f] p-4 rounded-2xl border border-white/5 flex flex-col gap-3">
                      <div className="flex items-center gap-1 text-[9px] text-neutral-400 justify-end">
                        <span>السؤال {currentQuestionIdx + 1} من {quizQuestions.length}</span>
                        <HelpCircle className="w-3 h-3 text-red-500" />
                      </div>
                      
                      <h4 className="text-[11px] font-black text-neutral-100 leading-relaxed mb-1">
                        {quizQuestions[currentQuestionIdx].q}
                      </h4>

                      <div className="flex flex-col gap-2">
                        {quizQuestions[currentQuestionIdx].options.map((opt, oIdx) => {
                          const isSelected = selectedOption === oIdx;
                          const isCorrect = oIdx === quizQuestions[currentQuestionIdx].answer;
                          
                          let btnStyle = "bg-[#1a1a24] border-white/5 hover:border-red-500/30 text-neutral-300";
                          if (selectedOption !== null) {
                            if (isCorrect) btnStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-black";
                            else if (isSelected) btnStyle = "bg-rose-500/10 border-rose-500 text-rose-400 font-black";
                            else btnStyle = "bg-[#1a1a24] border-white/5 opacity-50 text-neutral-500";
                          }

                          return (
                            <button
                              key={oIdx}
                              onClick={() => handleOptionSelect(oIdx)}
                              className={`p-2.5 rounded-xl border text-right text-[10px] transition cursor-pointer flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{selectedOption !== null && isCorrect ? "✓" : ""}</span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {quizFeedback && (
                        <motion.div 
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="p-2.5 bg-neutral-900 border border-white/5 rounded-xl text-[9px] text-center leading-normal"
                        >
                          {quizFeedback}
                        </motion.div>
                      )}

                      {selectedOption !== null && (
                        <button
                          onClick={handleNextQuestion}
                          className="w-full bg-red-600 hover:bg-red-500 text-white font-black text-[10px] py-2 rounded-xl transition mt-1 cursor-pointer"
                        >
                          {currentQuestionIdx < quizQuestions.length - 1 ? "السؤال التالي" : "عرض النتيجة النهائية"}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="bg-[#16161f] p-6 rounded-2xl border border-white/5 text-center flex flex-col items-center gap-3">
                      <Trophy className="w-12 h-12 text-amber-500 animate-bounce" />
                      <h4 className="text-xs font-black">تهانينا! لقد أكملت المسابقة الكبرى</h4>
                      <p className="text-[10px] text-neutral-400 max-w-xs">
                        لقد حصلت على <span className="text-amber-400 font-black">{quizScore} من {quizQuestions.length}</span> إجابة صحيحة. أنت بلا شك من أشد معجبي مسلسل شباب البومب ج12!
                      </p>

                      <button
                        onClick={handleResetQuiz}
                        className="bg-red-600 hover:bg-red-500 text-white font-black text-[10px] px-5 py-2 rounded-xl transition cursor-pointer mt-2"
                      >
                        إعادة المحاولة
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* 5. AI SCRIPT GENERATOR */}
              {activeTab === "ai_script" && (
                <motion.div
                  key="ai-script-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-3 text-right"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-neutral-400">ابتكر فكرتك وسيقوم المساعد بصياغتها</span>
                    <h3 className="text-xs font-black text-neutral-100 flex items-center gap-1 justify-end">
                      <span>مولد حلقات شباب البومب بالـ AI</span>
                      <Sparkles className="w-4 h-4 text-red-500" />
                    </h3>
                  </div>

                  <div className="bg-[#16161f] p-3 rounded-2xl border border-white/5 flex flex-col gap-3">
                    <p className="text-[9px] text-neutral-400 leading-relaxed">
                      هل لديك فكرة مضحكة تود لعامر وشكش وياسر وكفتة تمثيلها؟ اكتب عنواناً أو فكرة عامة، وسيقوم الذكاء الاصطناعي بتأليف سيناريو كوميدي متكامل ومقالب رهيبة في ثوانٍ!
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={handleGenerateScript}
                        disabled={generatingScript}
                        className="bg-red-600 hover:bg-red-500 disabled:bg-neutral-800 text-white font-black text-[10px] px-3.5 rounded-xl transition cursor-pointer flex items-center justify-center"
                      >
                        {generatingScript ? "جاري التأليف..." : "توليد"}
                      </button>
                      <input
                        type="text"
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                        placeholder="مثال: عامر وكفتة يفتتحان مطبخاً لطهي السلتة اليمنية"
                        className="flex-1 bg-[#1a1a24] border border-white/5 rounded-xl p-2.5 text-xs text-right focus:outline-none focus:border-red-500 text-neutral-100 placeholder-neutral-600"
                      />
                    </div>
                  </div>

                  {aiScript ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#111116] border border-red-500/20 rounded-2xl p-4 text-right overflow-y-auto max-h-[300px] scrollbar-thin"
                    >
                      <pre className="text-[10px] leading-relaxed text-neutral-300 font-sans whitespace-pre-wrap">
                        {aiScript}
                      </pre>
                    </motion.div>
                  ) : (
                    <div className="bg-[#16161f]/40 rounded-2xl p-8 border border-white/5 border-dashed text-center text-neutral-500 text-[10px] flex flex-col items-center gap-2">
                      <Sparkles className="w-6 h-6 text-neutral-600 animate-pulse" />
                      <span>اكتب فكرتك بالأعلى لصناعة حلقة خاصة وحصرية بالذكاء الاصطناعي!</span>
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </div>

    </div>
  );
}
