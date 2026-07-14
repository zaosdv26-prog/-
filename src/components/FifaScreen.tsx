import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Trophy, 
  Sparkles, 
  Users, 
  ShoppingBag, 
  ArrowLeftRight, 
  Zap, 
  Play, 
  TrendingUp, 
  Coins, 
  Smartphone,
  Plus,
  RefreshCw,
  Award,
  Flame,
  Check,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Volume2,
  VolumeX,
  Star
} from "lucide-react";

interface FootballPlayer {
  id: string;
  name: string;
  rating: number;
  position: "GK" | "CB" | "LB" | "RB" | "CM" | "LM" | "RM" | "ST" | "LW" | "RW";
  country: string;
  club: string;
  flag: string;
  avatar: string;
  cardType: "legendary" | "toty" | "gold" | "silver";
  stats: {
    pac: number; // Pace
    sho: number; // Shooting
    pas: number; // Passing
    dri: number; // Dribbling
    def: number; // Defending
    phy: number; // Physical
  };
  price: number;
}

interface FifaScreenProps {
  onBackToLauncher: () => void;
  onOpenStore: () => void;
}

// Global list of all possible players in the game database
const ALL_PLAYERS_DB: FootballPlayer[] = [
  {
    id: "hussein_nat",
    name: "حسين NAT",
    rating: 105,
    position: "ST",
    country: "اليمن",
    flag: "🇾🇪",
    club: "مؤسسة NAT الأسطورية",
    avatar: "👑",
    cardType: "legendary",
    stats: { pac: 108, sho: 107, pas: 104, dri: 106, def: 85, phy: 99 },
    price: 50000000,
  },
  {
    id: "messi",
    name: "ليونيل ميسي",
    rating: 98,
    position: "RW",
    country: "الأرجنتين",
    flag: "🇦🇷",
    club: "إنتر ميامي",
    avatar: "🐐",
    cardType: "toty",
    stats: { pac: 92, sho: 97, pas: 98, dri: 99, def: 40, phy: 72 },
    price: 35000000,
  },
  {
    id: "ronaldo",
    name: "كريستيانو رونالدو",
    rating: 97,
    position: "ST",
    country: "البرتغال",
    flag: "🇵🇹",
    club: "النصر السعودي",
    avatar: "🇵🇹",
    cardType: "toty",
    stats: { pac: 94, sho: 99, pas: 88, dri: 92, def: 42, phy: 89 },
    price: 30000000,
  },
  {
    id: "mbappe",
    name: "كيليان مبابي",
    rating: 96,
    position: "LW",
    country: "فرنسا",
    flag: "🇫🇷",
    club: "ريال مدريد",
    avatar: "⚡",
    cardType: "toty",
    stats: { pac: 99, sho: 95, pas: 89, dri: 96, def: 44, phy: 80 },
    price: 28000000,
  },
  {
    id: "haaland",
    name: "إيرلينغ هالاند",
    rating: 95,
    position: "ST",
    country: "النرويج",
    flag: "🇳🇴",
    club: "مانشستر سيتي",
    avatar: "🤖",
    cardType: "toty",
    stats: { pac: 94, sho: 97, pas: 75, dri: 84, def: 48, phy: 93 },
    price: 25000000,
  },
  {
    id: "salah",
    name: "محمد صلاح",
    rating: 94,
    position: "RW",
    country: "مصر",
    flag: "🇪🇬",
    club: "ليفربول",
    avatar: "👑",
    cardType: "gold",
    stats: { pac: 93, sho: 92, pas: 87, dri: 92, def: 45, phy: 78 },
    price: 18000000,
  },
  {
    id: "debruyne",
    name: "كيفين دي بروين",
    rating: 93,
    position: "CM",
    country: "بلجيكا",
    flag: "🇧🇪",
    club: "مانشستر سيتي",
    avatar: "🎯",
    cardType: "gold",
    stats: { pac: 72, sho: 88, pas: 97, dri: 87, def: 70, phy: 78 },
    price: 15000000,
  },
  {
    id: "bellingham",
    name: "جود بيلينغهام",
    rating: 93,
    position: "CM",
    country: "إنجلترا",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    club: "ريال مدريد",
    avatar: "🦁",
    cardType: "toty",
    stats: { pac: 85, sho: 89, pas: 90, dri: 92, def: 84, phy: 88 },
    price: 19000000,
  },
  {
    id: "vinicius",
    name: "فينيسيوس جونيور",
    rating: 92,
    position: "LW",
    country: "البرازيل",
    flag: "🇧🇷",
    club: "ريال مدريد",
    avatar: "🕺",
    cardType: "gold",
    stats: { pac: 97, sho: 85, pas: 82, dri: 94, def: 35, phy: 70 },
    price: 14000000,
  },
  {
    id: "vandijk",
    name: "فيرجيل فان دايك",
    rating: 92,
    position: "CB",
    country: "هولندا",
    flag: "🇳🇱",
    club: "ليفربول",
    avatar: "🧱",
    cardType: "toty",
    stats: { pac: 82, sho: 60, pas: 75, dri: 72, def: 95, phy: 91 },
    price: 16000000,
  },
  {
    id: "bounou",
    name: "ياسين بونو",
    rating: 90,
    position: "GK",
    country: "المغرب",
    flag: "🇲🇦",
    club: "الهلال السعودي",
    avatar: "🧤",
    cardType: "gold",
    stats: { pac: 88, sho: 85, pas: 82, dri: 90, def: 48, phy: 86 },
    price: 8000000,
  },
  {
    id: "aldawsari",
    name: "سالم الدوسري",
    rating: 88,
    position: "LW",
    country: "السعودية",
    flag: "🇸🇦",
    club: "الهلال السعودي",
    avatar: "🌪️",
    cardType: "gold",
    stats: { pac: 89, sho: 84, pas: 83, dri: 88, def: 46, phy: 72 },
    price: 4500000,
  },
  {
    id: "neymar",
    name: "نيمار جونيور",
    rating: 89,
    position: "LM",
    country: "البرازيل",
    flag: "🇧🇷",
    club: "الهلال السعودي",
    avatar: "🇧🇷",
    cardType: "gold",
    stats: { pac: 86, sho: 83, pas: 88, dri: 92, def: 38, phy: 65 },
    price: 6000000,
  },
  {
    id: "hakimi",
    name: "أشرف حكيمي",
    rating: 88,
    position: "RB",
    country: "المغرب",
    flag: "🇲🇦",
    club: "باريس سان جيرمان",
    avatar: "🇲🇦",
    cardType: "gold",
    stats: { pac: 94, sho: 76, pas: 81, dri: 84, def: 81, phy: 79 },
    price: 5500000,
  },
  {
    id: "davies",
    name: "ألفونسو ديفيز",
    rating: 87,
    position: "LB",
    country: "كندا",
    flag: "🇨🇦",
    club: "بايرن ميونخ",
    avatar: "🇨🇦",
    cardType: "gold",
    stats: { pac: 96, sho: 68, pas: 78, dri: 86, def: 78, phy: 77 },
    price: 4800000,
  },
  {
    id: "araujo",
    name: "رونالد أراوخو",
    rating: 86,
    position: "CB",
    country: "الأوروغواي",
    flag: "🇺🇾",
    club: "برشلونة",
    avatar: "🇺🇾",
    cardType: "gold",
    stats: { pac: 83, sho: 51, pas: 65, dri: 68, def: 87, phy: 85 },
    price: 4000000,
  }
];

// Starter common players to build the initial squad
const STARTER_PLAYERS: FootballPlayer[] = [
  { id: "s_gk", name: "أحمد السلال", rating: 78, position: "GK", country: "اليمن", flag: "🇾🇪", club: "أهلي صنعاء", avatar: "⚽", cardType: "silver", stats: { pac: 72, sho: 68, pas: 70, dri: 71, def: 42, phy: 74 }, price: 50000 },
  { id: "s_cb1", name: "محمد فؤاد", rating: 79, position: "CB", country: "اليمن", flag: "🇾🇪", club: "شعب حضرموت", avatar: "⚽", cardType: "silver", stats: { pac: 68, sho: 45, pas: 61, dri: 59, def: 80, phy: 78 }, price: 55000 },
  { id: "s_cb2", name: "مدير عبد ربه", rating: 77, position: "CB", country: "اليمن", flag: "🇾🇪", club: "وحدة صنعاء", avatar: "⚽", cardType: "silver", stats: { pac: 64, sho: 41, pas: 58, dri: 55, def: 78, phy: 80 }, price: 48000 },
  { id: "s_lb", name: "علاء نعمان", rating: 76, position: "LB", country: "اليمن", flag: "🇾🇪", club: "شعب إب", avatar: "⚽", cardType: "silver", stats: { pac: 78, sho: 50, pas: 68, dri: 71, def: 72, phy: 70 }, price: 42000 },
  { id: "s_rb", name: "رضوان الحبيشي", rating: 75, position: "RB", country: "اليمن", flag: "🇾🇪", club: "اليرموك", avatar: "⚽", cardType: "silver", stats: { pac: 75, sho: 48, pas: 65, dri: 69, def: 71, phy: 72 }, price: 38000 },
  { id: "s_cm1", name: "عبد الواسع المطري", rating: 80, position: "CM", country: "اليمن", flag: "🇾🇪", club: "تضامن حضرموت", avatar: "⚽", cardType: "gold", stats: { pac: 81, sho: 75, pas: 79, dri: 81, def: 52, phy: 68 }, price: 150000 },
  { id: "s_cm2", name: "علاء الصاصي", rating: 81, position: "CM", country: "اليمن", flag: "🇾🇪", club: "صقر تعز", avatar: "⚽", cardType: "gold", stats: { pac: 74, sho: 73, pas: 84, dri: 83, def: 58, phy: 65 }, price: 180000 },
  { id: "s_lm", name: "عماد منصور", rating: 78, position: "LM", country: "اليمن", flag: "🇾🇪", club: "تلال عدن", avatar: "⚽", cardType: "silver", stats: { pac: 83, sho: 69, pas: 71, dri: 76, def: 40, phy: 68 }, price: 60000 },
  { id: "s_st", name: "أحمد السروري", rating: 80, position: "ST", country: "اليمن", flag: "🇾🇪", club: "شعب صنعاء", avatar: "⚽", cardType: "gold", stats: { pac: 84, sho: 79, pas: 72, dri: 80, def: 35, phy: 72 }, price: 160000 },
  { id: "s_lw", name: "أنيس المعاري", rating: 79, position: "LW", country: "اليمن", flag: "🇾🇪", club: "شعب حضرموت", avatar: "⚽", cardType: "silver", stats: { pac: 86, sho: 73, pas: 71, dri: 80, def: 33, phy: 61 }, price: 85000 },
  { id: "s_rw", name: "حمزة حنش", rating: 78, position: "RW", country: "اليمن", flag: "🇾🇪", club: "وحدة صنعاء", avatar: "⚽", cardType: "silver", stats: { pac: 81, sho: 71, pas: 73, dri: 77, def: 36, phy: 64 }, price: 70000 }
];

export default function FifaScreen({ onBackToLauncher, onOpenStore }: FifaScreenProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"squad" | "packs" | "matches" | "market">("squad");

  // Currency states
  const [coins, setCoins] = useState<number>(() => {
    const saved = localStorage.getItem("fifa_coins");
    return saved ? parseInt(saved) : 1200000; // Starter coins: 1.2M
  });
  const [points, setPoints] = useState<number>(() => {
    const saved = localStorage.getItem("fifa_points");
    return saved ? parseInt(saved) : 2500; // Starter FIFA points: 2,500
  });

  // User's players inventory
  const [myPlayers, setMyPlayers] = useState<FootballPlayer[]>(() => {
    const saved = localStorage.getItem("fifa_my_players");
    return saved ? JSON.parse(saved) : [...STARTER_PLAYERS];
  });

  // Current squad on pitch (mapping of position -> Player)
  const [squad, setSquad] = useState<Record<string, FootballPlayer>>(() => {
    const saved = localStorage.getItem("fifa_squad");
    if (saved) return JSON.parse(saved);
    
    // Default formation slot assignments
    return {
      "GK": STARTER_PLAYERS.find(p => p.position === "GK") || STARTER_PLAYERS[0],
      "CB": STARTER_PLAYERS.find(p => p.position === "CB") || STARTER_PLAYERS[1],
      "LB": STARTER_PLAYERS.find(p => p.position === "LB") || STARTER_PLAYERS[3],
      "RB": STARTER_PLAYERS.find(p => p.position === "RB") || STARTER_PLAYERS[4],
      "CM": STARTER_PLAYERS.find(p => p.position === "CM") || STARTER_PLAYERS[5],
      "LM": STARTER_PLAYERS.find(p => p.position === "LM") || STARTER_PLAYERS[7],
      "RW": STARTER_PLAYERS.find(p => p.position === "RW") || STARTER_PLAYERS[10],
      "ST": STARTER_PLAYERS.find(p => p.position === "ST") || STARTER_PLAYERS[8]
    };
  });

  // Formation structure selection
  const [formation, setFormation] = useState<"4-3-3" | "4-4-2" | "3-5-2">("4-3-3");

  // Selected slot to swap player
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Audio system state
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Pack reveal state
  const [openedPlayer, setOpenedPlayer] = useState<FootballPlayer | null>(null);
  const [packRevealed, setPackRevealed] = useState(false);
  const [isOpeningPack, setIsOpeningPack] = useState(false);

  // Match Simulation States
  const [isSimulatingMatch, setIsSimulatingMatch] = useState(false);
  const [opponent, setOpponent] = useState<{ name: string; ovr: number; logo: string } | null>(null);
  const [matchScore, setMatchScore] = useState({ home: 0, away: 0 });
  const [matchMinute, setMatchMinute] = useState(0);
  const [matchEvents, setMatchEvents] = useState<string[]>([]);
  const [matchStatus, setMatchStatus] = useState<"playing" | "qte" | "finished">("playing");
  const [activeQTE, setActiveQTE] = useState<{
    scenario: string;
    options: { text: string; successChance: number; reward: string }[];
  } | null>(null);

  // Save states to LocalStorage on change
  useEffect(() => {
    localStorage.setItem("fifa_coins", coins.toString());
    localStorage.setItem("fifa_points", points.toString());
    localStorage.setItem("fifa_my_players", JSON.stringify(myPlayers));
    localStorage.setItem("fifa_squad", JSON.stringify(squad));
  }, [coins, points, myPlayers, squad]);

  // Audio synthethizer for ultimate FIFA game immersion
  const playFifaSound = (type: "pack_chime" | "pack_gold" | "whistle" | "goal" | "crowd" | "click" | "sell") => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (!audioCtx) return;

      if (type === "click") {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(450, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      } else if (type === "sell") {
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.destination);
        osc1.frequency.setValueAtTime(880, audioCtx.currentTime);
        osc2.frequency.setValueAtTime(1320, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc1.start(); osc2.start();
        osc1.stop(audioCtx.currentTime + 0.3); osc2.stop(audioCtx.currentTime + 0.3);
      } else if (type === "whistle") {
        // Classic high-pitched referee whistle double pip
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(2500, audioCtx.currentTime);
        osc.frequency.setValueAtTime(2700, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } else if (type === "pack_chime") {
        // Celestial rising harp
        const now = audioCtx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.03, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.3);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.3);
        });
      } else if (type === "pack_gold" || type === "goal") {
        // Dynamic synth fanfare and explosion
        const now = audioCtx.currentTime;
        const notes = [440, 554.37, 659.25, 880, 1108.73];
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.04 / notes.length, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
          osc.start(now);
          osc.stop(now + 1.2);
        });
        
        // Low drum impact rumble
        const noise = audioCtx.createOscillator();
        const noiseGain = audioCtx.createGain();
        noise.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);
        noise.type = "triangle";
        noise.frequency.setValueAtTime(80, now);
        noise.frequency.exponentialRampToValueAtTime(20, now + 0.6);
        noiseGain.gain.setValueAtTime(0.15, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        noise.start(now);
        noise.stop(now + 0.6);
      }
    } catch (e) {
      console.warn("Audio context not ready", e);
    }
  };

  // Determine Squad Overall Rating (OVR)
  const calculateOVR = () => {
    const playersInSquad = Object.values(squad) as FootballPlayer[];
    if (playersInSquad.length === 0) return 0;
    const totalRating = playersInSquad.reduce((acc, p) => acc + p.rating, 0);
    return Math.round(totalRating / playersInSquad.length);
  };

  // Determine Squad Chemistry (out of 100)
  const calculateChemistry = () => {
    const playersInSquad = Object.values(squad) as FootballPlayer[];
    if (playersInSquad.length === 0) return 0;
    
    let score = 0;
    playersInSquad.forEach(player => {
      // Base points for exact position
      score += 8;
      // Bonus if Yemeni player (high cohesion for Hussein NAT squad!)
      if (player.country === "اليمن") {
        score += 3.5;
      }
      // Bonus if player is Hussein NAT
      if (player.id === "hussein_nat") {
        score += 15;
      }
    });
    
    return Math.min(100, Math.round(score));
  };

  // Handle slot click: Open selection of compatible players from inventory
  const handleSlotClick = (pos: string) => {
    playFifaSound("click");
    setSelectedSlot(pos === selectedSlot ? null : pos);
  };

  // Swap player in selected slot
  const handleSwapPlayer = (newPlayer: FootballPlayer) => {
    if (!selectedSlot) return;
    playFifaSound("click");
    setSquad(prev => ({
      ...prev,
      [selectedSlot]: newPlayer
    }));
    setSelectedSlot(null);
  };

  // Available positions based on formation
  const getFormationPositions = (): string[] => {
    if (formation === "4-3-3") {
      return ["GK", "CB", "LB", "RB", "CM", "LM", "RW", "ST"];
    } else if (formation === "4-4-2") {
      return ["GK", "CB", "LB", "RB", "CM", "LM", "RM", "ST"];
    } else { // 3-5-2
      return ["GK", "CB", "LM", "CM", "RM", "ST", "LW", "RW"];
    }
  };

  // Handle Pack Opening
  const handleOpenPack = (packType: "legendary" | "toty" | "gold") => {
    let costPoints = 0;
    let costCoins = 0;
    let candidates: FootballPlayer[] = [];

    if (packType === "legendary") {
      costPoints = 1000;
      costCoins = 500000;
      // High chance for Messi, Ronaldo, Mbappé, Salah and Hussein NAT!
      candidates = ALL_PLAYERS_DB;
    } else if (packType === "toty") {
      costPoints = 500;
      costCoins = 250000;
      candidates = ALL_PLAYERS_DB.filter(p => p.cardType === "toty" || p.cardType === "gold");
    } else {
      costCoins = 80000;
      candidates = ALL_PLAYERS_DB.filter(p => p.cardType === "gold" || p.cardType === "silver" || p.rating < 92);
    }

    if (points < costPoints && coins < costCoins) {
      alert("⚠️ عذراً! لا تمتلك رصيداً كافياً من الكوينز أو نقاط فيفا. تفضل بالفوز بالمباريات لشحن رصيدك مجاناً!");
      return;
    }

    // Deduct cost
    if (points >= costPoints && costPoints > 0) {
      setPoints(prev => prev - costPoints);
    } else {
      setCoins(prev => prev - costCoins);
    }

    playFifaSound("click");
    setIsOpeningPack(true);
    setOpenedPlayer(null);
    setPackRevealed(false);

    // Dynamic roulette reveal effect
    setTimeout(() => {
      // Pick random player from database, weighing higher rating as rarer but totally achievable
      const roll = Math.random();
      let selected: FootballPlayer;
      
      if (packType === "legendary" && roll < 0.25) {
        // Ultra legendary roll for Hussein NAT!
        selected = ALL_PLAYERS_DB.find(p => p.id === "hussein_nat") || ALL_PLAYERS_DB[0];
      } else {
        const randomIndex = Math.floor(Math.random() * candidates.length);
        selected = candidates[randomIndex];
      }

      setOpenedPlayer(selected);
      setMyPlayers(prev => {
        // Avoid duplicate players in inventory, add coins instead if already owned
        if (prev.some(p => p.id === selected.id)) {
          setCoins(c => c + Math.round(selected.price * 0.1));
          return prev;
        }
        return [...prev, selected];
      });

      setIsOpeningPack(false);
      setPackRevealed(true);
      
      if (selected.rating >= 95) {
        playFifaSound("pack_gold");
      } else {
        playFifaSound("pack_chime");
      }
    }, 2000);
  };

  // QUICK MATCH SIMULATION ENGINE
  const handleStartMatch = (team: { name: string; ovr: number; logo: string }) => {
    playFifaSound("whistle");
    setOpponent(team);
    setIsSimulatingMatch(true);
    setMatchScore({ home: 0, away: 0 });
    setMatchMinute(0);
    setMatchEvents(["🟢 صافرة البداية! ركلة البداية لصالح فريقك."]);
    setMatchStatus("playing");
    setActiveQTE(null);
  };

  // Run match minute loop
  useEffect(() => {
    let matchTimer: any;
    if (isSimulatingMatch && matchStatus === "playing") {
      matchTimer = setInterval(() => {
        setMatchMinute(prev => {
          const nextMin = prev + 15;
          if (nextMin >= 90) {
            // Match Finished
            clearInterval(matchTimer);
            setMatchStatus("finished");
            playFifaSound("whistle");
            
            // Calculate final earnings based on win/draw
            const ourOvr = calculateOVR();
            const earnedCoins = matchScore.home > matchScore.away 
              ? 350000 
              : matchScore.home === matchScore.away 
                ? 150000 
                : 50000;
            const earnedPoints = matchScore.home > matchScore.away ? 150 : 50;

            setCoins(c => c + earnedCoins);
            setPoints(p => p + earnedPoints);

            setMatchEvents(e => [
              ...e, 
              `🛑 صافرة النهاية! نتيجة المباراة: ${matchScore.home} - ${matchScore.away}`,
              `🏆 مبروك! حصلت على +${earnedCoins.toLocaleString()} كوينز و +${earnedPoints} نقاط فيفا!`
            ]);

            return 90;
          }

          // Random match events based on team ratings
          const ourOvr = calculateOVR();
          const oppOvr = opponent ? opponent.ovr : 80;
          const advantage = (ourOvr - oppOvr) / 100; // Positive if we are better
          
          const roll = Math.random() + advantage;

          if (roll > 0.75) {
            // We score or get a QTE event!
            const qteRoll = Math.random();
            if (qteRoll > 0.4) {
              // Trigger a Quick Time Tactical Event (QTE)
              clearInterval(matchTimer);
              setMatchStatus("qte");
              
              const scenarios = [
                {
                  scenario: `د ${nextMin}: انفراد تام من هجوم فريقك أمام مرمى ${opponent?.name}! الحارس يتقدم.. ماذا ستفعل؟`,
                  options: [
                    { text: "تسديدة ساقطة من فوق الحارس (لوب) 🎯", successChance: 0.8, reward: "goal" },
                    { text: "مراوغة الحارس بمهارة دبل كيك 🕺", successChance: 0.5, reward: "spectacular_goal" },
                    { text: "تمرير بالعرض لزميلك المتابع ⚽", successChance: 0.95, reward: "easy_goal" }
                  ]
                },
                {
                  scenario: `د ${nextMin}: ضربة حرة مباشرة قريبة جداً من منطقة جزاء ${opponent?.name}! من سيسدد؟`,
                  options: [
                    { text: "تسديدة مقوسة صاروخية بقوة حسين NAT 🔥", successChance: 0.85, reward: "goal" },
                    { text: "تمريرة خداعية خلف حائط الصد 💡", successChance: 0.6, reward: "goal" }
                  ]
                }
              ];

              setActiveQTE(scenarios[Math.floor(Math.random() * scenarios.length)]);
            } else {
              // Straight goal
              setMatchScore(s => ({ ...s, home: s.home + 1 }));
              playFifaSound("goal");
              setMatchEvents(e => [
                ...e,
                `د ${nextMin}: ⚽ جووووول! هجمة رائعة وتمريرات متقنة تنتهي بوضع الكرة في الشباك لـ فريقك!`
              ]);
            }
          } else if (roll < 0.2) {
            // Opponent scores
            setMatchScore(s => ({ ...s, away: s.away + 1 }));
            setMatchEvents(e => [
              ...e,
              `د ${nextMin}: ❌ هدف لصالح ${opponent?.name}. دفاعات الفريق تقع في فخ التمرير الخاطئ.`
            ]);
          } else {
            // Neutral event
            const neutralTexts = [
              `د ${nextMin}: صراع قوي في وسط الملعب وسيطرة متبادلة على الكرة.`,
              `د ${nextMin}: تصدي بطولي من حارس المرمى ينقذ شباكك من هدف محقق!`,
              `د ${nextMin}: ضربة ركنية لفريقك ينفذها بيلينغهام ولكن يبعدها الدفاع.`
            ];
            setMatchEvents(e => [...e, neutralTexts[Math.floor(Math.random() * neutralTexts.length)]]);
          }

          return nextMin;
        });
      }, 1500);
    }
    return () => clearInterval(matchTimer);
  }, [isSimulatingMatch, matchStatus, matchScore, opponent]);

  // Handle QTE User Choice
  const handleQTEChoice = (option: { text: string; successChance: number; reward: string }) => {
    const roll = Math.random();
    const isSuccess = roll < option.successChance;

    if (isSuccess) {
      setMatchScore(s => ({ ...s, home: s.home + 1 }));
      playFifaSound("goal");
      setMatchEvents(e => [
        ...e,
        `✅ قرار عبقري! نجحت الخطة وسجلت هدفاً رائعاً: ${option.text}`
      ]);
    } else {
      setMatchEvents(e => [
        ...e,
        `⚠️ عذراً! مرت بسلام بجانب القائم وأهدرت الفرصة: ${option.text}`
      ]);
    }

    setActiveQTE(null);
    setMatchStatus("playing");
  };

  // SELL PLAYER FROM INVENTORY FOR QUICK CASH
  const handleSellPlayer = (player: FootballPlayer) => {
    // Cannot sell starter players
    if (player.id.startsWith("s_")) {
      alert("⚠️ لا يمكن بيع اللاعبين الأساسيين للفريق!");
      return;
    }
    const sellPrice = Math.round(player.price * 0.7); // 70% back
    if (confirm(`هل أنت متأكد من بيع ${player.name} مقابل ${sellPrice.toLocaleString()} كوينز؟`)) {
      setCoins(c => c + sellPrice);
      setMyPlayers(p => p.filter(item => item.id !== player.id));
      // Remove from squad if active
      setSquad(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          if (next[key].id === player.id) {
            // Revert to starter player of same position if possible
            const backup = STARTER_PLAYERS.find(sp => sp.position === player.position) || STARTER_PLAYERS[0];
            next[key] = backup;
          }
        });
        return next;
      });
      playFifaSound("sell");
    }
  };

  return (
    <div className="h-full w-full bg-[#03090e] text-[#e9edef] flex flex-col relative select-none overflow-hidden font-sans">
      
      {/* 1. FIFA ULTIMATE HEADBAR */}
      <div className="bg-gradient-to-r from-[#0d1c25] to-[#040e15] py-4 px-4 border-b border-[#D4AF37]/20 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <button 
            onClick={onBackToLauncher}
            className="p-1 rounded-lg bg-white/5 text-neutral-400 hover:text-white cursor-pointer"
          >
            <Smartphone className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-black text-[#D4AF37] tracking-wider uppercase flex items-center gap-1">
              <span>فيفا حسين NAT</span>
              <span className="text-[10px] bg-[#00ff66]/20 text-[#00ff66] px-1.5 py-0.5 rounded-full font-mono">2026</span>
            </h1>
            <p className="text-[10px] text-neutral-400 font-bold">إمبراطورية كرة القدم اليمنية 👑</p>
          </div>
        </div>

        {/* Currency balances display */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="bg-[#111] border border-amber-500/30 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 shadow-md">
            <Coins className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-amber-400">{coins.toLocaleString()}</span>
          </div>
          <div className="bg-[#111] border border-emerald-500/30 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 shadow-md">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-emerald-400">{points.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 2. FIFA CORE NAVIGATION TABS */}
      <div className="bg-[#0b141a] flex justify-around border-b border-neutral-900 text-xs font-black py-2.5 z-10">
        <button 
          onClick={() => { playFifaSound("click"); setActiveTab("squad"); }}
          className={`px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors ${activeTab === "squad" ? "bg-[#D4AF37]/15 text-[#D4AF37]" : "text-neutral-400 hover:text-white"}`}
        >
          <Users className="w-4 h-4" />
          <span>تشكيلتي</span>
        </button>
        <button 
          onClick={() => { playFifaSound("click"); setActiveTab("packs"); }}
          className={`px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors ${activeTab === "packs" ? "bg-[#D4AF37]/15 text-[#D4AF37]" : "text-neutral-400 hover:text-white"}`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>الحزم</span>
        </button>
        <button 
          onClick={() => { playFifaSound("click"); setActiveTab("matches"); }}
          className={`px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors ${activeTab === "matches" ? "bg-[#D4AF37]/15 text-[#D4AF37]" : "text-neutral-400 hover:text-white"}`}
        >
          <Trophy className="w-4 h-4" />
          <span>المباريات</span>
        </button>
        <button 
          onClick={() => { playFifaSound("click"); setActiveTab("market"); }}
          className={`px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors ${activeTab === "market" ? "bg-[#D4AF37]/15 text-[#D4AF37]" : "text-neutral-400 hover:text-white"}`}
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>سوق الانتقالات</span>
        </button>
      </div>

      {/* 3. DYNAMIC CONTENT MAIN SCREEN AREA */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 relative">
        
        {/* SQUAD BUILDER PAGE */}
        {activeTab === "squad" && (
          <div className="space-y-4">
            
            {/* Squad Stats Header Widget */}
            <div className="bg-gradient-to-br from-[#0c161d] to-[#050b0e] border border-neutral-800 rounded-2xl p-4 flex justify-between items-center shadow-lg">
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">تقييم الفريق الإجمالي</span>
                <div className="flex items-baseline gap-1">
                  <h2 className="text-4xl font-black text-white font-mono">{calculateOVR()}</h2>
                  <span className="text-xs font-black text-[#00ff66]">OVR</span>
                </div>
              </div>

              {/* Chem widget */}
              <div className="space-y-1 text-center">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">الانسجام والكفاءة</span>
                <div className="flex items-center gap-1 justify-center">
                  <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
                  <h3 className="text-2xl font-black text-amber-400 font-mono">{calculateChemistry()}%</h3>
                </div>
              </div>

              {/* Formation Picker */}
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase block text-left">خطة اللعب</span>
                <select 
                  value={formation}
                  onChange={(e) => { playFifaSound("click"); setFormation(e.target.value as any); }}
                  className="bg-[#111] border border-neutral-800 rounded-xl px-3 py-1.5 text-xs font-black text-white outline-none"
                >
                  <option value="4-3-3">4-3-3 هجومي</option>
                  <option value="4-4-2">4-4-2 كلاسيكي</option>
                  <option value="3-5-2">3-5-2 متوازن</option>
                </select>
              </div>
            </div>

            {/* Tactical pitch visualization map */}
            <div 
              className="w-full h-[400px] bg-[#122e1a] rounded-3xl relative border border-[#00ff66]/10 shadow-2xl overflow-hidden p-2"
              style={{
                backgroundImage: `radial-gradient(ellipse at bottom, #144023 0%, #0c2012 100%), 
                                  linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), 
                                  linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                backgroundSize: "100% 100%, 20px 20px, 20px 20px"
              }}
            >
              {/* Pitch layout lines */}
              <div className="absolute inset-x-0 bottom-0 top-1/2 border-t border-white/10" />
              <div className="absolute top-1/2 left-1/2 w-32 h-32 border border-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-1/2 w-48 h-20 border border-white/10 -translate-x-1/2 rounded-t-xl bg-black/5" />

              {/* Player Slots Position Mapping */}
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-1 p-4">
                {/* Attack Row */}
                <div className="col-span-4 row-span-1 flex justify-around items-center">
                  {getFormationPositions().includes("LW") && squad["LW"] && (
                    <motion.div whileTap={{ scale: 0.95 }} onClick={() => handleSlotClick("LW")} className="relative">
                      {renderSlotCard(squad["LW"], "LW", selectedSlot === "LW")}
                    </motion.div>
                  )}
                  {getFormationPositions().includes("ST") && squad["ST"] && (
                    <motion.div whileTap={{ scale: 0.95 }} onClick={() => handleSlotClick("ST")} className="relative">
                      {renderSlotCard(squad["ST"], "ST", selectedSlot === "ST")}
                    </motion.div>
                  )}
                  {getFormationPositions().includes("RW") && squad["RW"] && (
                    <motion.div whileTap={{ scale: 0.95 }} onClick={() => handleSlotClick("RW")} className="relative">
                      {renderSlotCard(squad["RW"], "RW", selectedSlot === "RW")}
                    </motion.div>
                  )}
                </div>

                {/* Midfield Row */}
                <div className="col-span-4 row-span-1 flex justify-around items-center mt-2">
                  {getFormationPositions().includes("LM") && squad["LM"] && (
                    <motion.div whileTap={{ scale: 0.95 }} onClick={() => handleSlotClick("LM")} className="relative">
                      {renderSlotCard(squad["LM"], "LM", selectedSlot === "LM")}
                    </motion.div>
                  )}
                  {getFormationPositions().includes("CM") && squad["CM"] && (
                    <motion.div whileTap={{ scale: 0.95 }} onClick={() => handleSlotClick("CM")} className="relative">
                      {renderSlotCard(squad["CM"], "CM", selectedSlot === "CM")}
                    </motion.div>
                  )}
                  {getFormationPositions().includes("RM") && squad["RM"] && (
                    <motion.div whileTap={{ scale: 0.95 }} onClick={() => handleSlotClick("RM")} className="relative">
                      {renderSlotCard(squad["RM"], "RM", selectedSlot === "RM")}
                    </motion.div>
                  )}
                </div>

                {/* Defense Row */}
                <div className="col-span-4 row-span-1 flex justify-around items-center mt-4">
                  {getFormationPositions().includes("LB") && squad["LB"] && (
                    <motion.div whileTap={{ scale: 0.95 }} onClick={() => handleSlotClick("LB")} className="relative">
                      {renderSlotCard(squad["LB"], "LB", selectedSlot === "LB")}
                    </motion.div>
                  )}
                  {getFormationPositions().includes("CB") && squad["CB"] && (
                    <motion.div whileTap={{ scale: 0.95 }} onClick={() => handleSlotClick("CB")} className="relative">
                      {renderSlotCard(squad["CB"], "CB", selectedSlot === "CB")}
                    </motion.div>
                  )}
                  {getFormationPositions().includes("RB") && squad["RB"] && (
                    <motion.div whileTap={{ scale: 0.95 }} onClick={() => handleSlotClick("RB")} className="relative">
                      {renderSlotCard(squad["RB"], "RB", selectedSlot === "RB")}
                    </motion.div>
                  )}
                </div>

                {/* Goalkeeper Slot */}
                <div className="col-span-4 row-span-1 flex justify-center items-end mt-4">
                  {getFormationPositions().includes("GK") && squad["GK"] && (
                    <motion.div whileTap={{ scale: 0.95 }} onClick={() => handleSlotClick("GK")} className="relative">
                      {renderSlotCard(squad["GK"], "GK", selectedSlot === "GK")}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Swap Player Picker Drawer (Triggered when slot is selected) */}
            <AnimatePresence>
              {selectedSlot && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="bg-[#0b141a] border border-neutral-800 rounded-3xl p-4 space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-amber-400">
                      تبديل مركز: <span className="text-white font-black">{selectedSlot}</span>
                    </h3>
                    <span className="text-xs text-neutral-400 font-bold">اللاعبين المتوفرين في مخزونك</span>
                  </div>

                  <div className="flex gap-3 overflow-x-auto pb-2 select-none custom-scrollbar">
                    {myPlayers
                      .filter(p => p.position === selectedSlot)
                      .map((p) => (
                        <div 
                          key={p.id}
                          onClick={() => handleSwapPlayer(p)}
                          className="flex-shrink-0 bg-[#162229] border border-neutral-800 rounded-2xl p-3 flex flex-col items-center gap-1.5 cursor-pointer hover:border-amber-500/50"
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${p.cardType === "legendary" ? "bg-amber-500 text-black" : p.cardType === "toty" ? "bg-cyan-500" : "bg-neutral-800"}`}>
                            {p.avatar}
                          </div>
                          <span className="text-xs font-black text-white">{p.name}</span>
                          <span className="text-[10px] font-sans font-bold text-amber-500">OVR {p.rating}</span>
                        </div>
                      ))}

                    {myPlayers.filter(p => p.position === selectedSlot).length === 0 && (
                      <div className="text-center py-4 text-xs text-neutral-400 w-full">
                        ⚠️ لا تمتلك أي لاعب آخر في هذا المركز بمخزونك. تفضل بفتح الحزم للحصول على لاعبين جدد!
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        )}

        {/* PACKS STORE PAGE */}
        {activeTab === "packs" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900/10 to-amber-900/15 border border-amber-500/10 rounded-2xl p-4 text-center">
              <h2 className="text-base font-black text-amber-400">متجر حزم التميز والأسطورة 🌟</h2>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                افتح حزمتك الآن واحصل على فرصة الفوز باللاعب الأسطوري اليمني <span className="text-amber-500 font-bold">حسين NAT</span> بتقييم 105 ومميزات لا تضاهى!
              </p>
            </div>

            {/* Packs Grid */}
            <div className="grid grid-cols-1 gap-5">
              
              {/* Legendary Pack */}
              <div className="bg-[#0f1922] border-2 border-[#D4AF37] rounded-3xl p-5 flex items-center justify-between shadow-2xl relative overflow-hidden">
                <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-amber-500/10 rounded-full blur-2xl" />
                <div className="space-y-2 relative z-10 max-w-[65%]">
                  <span className="bg-amber-500/20 text-amber-400 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">VIP أسطوري</span>
                  <h3 className="text-base font-black text-white">حزمة أساطير حسين NAT المعتمدة</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">أعلى احتمالية للفوز بـ حسين NAT (105)، ميسي (98)، رونالدو (97) ومبابي!</p>
                  
                  {/* Costs buttons */}
                  <div className="flex gap-2.5 pt-2">
                    <button 
                      onClick={() => handleOpenPack("legendary")}
                      className="btn-gold-gradient text-[10px] font-black py-2 px-3.5 rounded-xl cursor-pointer shadow-lg flex items-center gap-1"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>1,000 نقطة</span>
                    </button>
                    <button 
                      onClick={() => handleOpenPack("legendary")}
                      className="bg-[#1c2227] hover:bg-neutral-800 border border-amber-500/40 text-amber-400 text-[10px] font-black py-2 px-3.5 rounded-xl cursor-pointer"
                    >
                      <Coins className="w-3.5 h-3.5 inline-block mr-1" />
                      <span>500K كوينز</span>
                    </button>
                  </div>
                </div>

                {/* 3D look vector card pack */}
                <div className="w-24 h-32 bg-gradient-to-b from-[#D4AF37] to-[#8a6f27] rounded-2xl flex flex-col justify-between p-3 shadow-xl transform rotate-3 hover:rotate-0 transition-transform relative border border-white/20">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-black">PACK</span>
                    <Star className="w-3.5 h-3.5 text-black fill-black" />
                  </div>
                  <div className="text-center font-black text-black text-xs leading-tight">
                    NAT LEGENDS
                  </div>
                  <div className="text-center text-[8px] bg-black/30 rounded-full py-0.5 text-white font-bold font-sans">
                    105 MAX
                  </div>
                </div>
              </div>

              {/* TOTY Pack */}
              <div className="bg-[#0f1922] border border-[#00ff66]/40 rounded-3xl p-5 flex items-center justify-between shadow-lg relative overflow-hidden">
                <div className="space-y-2 max-w-[65%]">
                  <span className="bg-[#00ff66]/20 text-[#00ff66] text-[10px] font-black px-2 py-0.5 rounded-full uppercase">تشكيلة السنة</span>
                  <h3 className="text-base font-black text-white">حزمة TOTY الزرقاء الفاخرة</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">احصل على لاعبي تشكيلة السنة لرفع الـ OVR لـ 95 وأكثر فوراً!</p>
                  
                  <div className="flex gap-2.5 pt-2">
                    <button 
                      onClick={() => handleOpenPack("toty")}
                      className="bg-[#00ff66] text-black text-[10px] font-black py-2 px-3.5 rounded-xl cursor-pointer hover:bg-[#00e159] flex items-center gap-1 shadow-lg shadow-emerald-950/20"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>500 نقطة</span>
                    </button>
                    <button 
                      onClick={() => handleOpenPack("toty")}
                      className="bg-[#1c2227] border border-[#00ff66]/30 text-[#00ff66] text-[10px] font-black py-2 px-3.5 rounded-xl cursor-pointer"
                    >
                      <Coins className="w-3.5 h-3.5 inline-block mr-1" />
                      <span>250K كوينز</span>
                    </button>
                  </div>
                </div>

                <div className="w-24 h-32 bg-gradient-to-b from-cyan-600 to-indigo-900 rounded-2xl flex flex-col justify-between p-3 shadow-xl transform -rotate-3 hover:rotate-0 transition-transform relative border border-white/20">
                  <div className="flex justify-between items-center text-cyan-200">
                    <span className="text-[10px] font-black">TOTY</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-center font-black text-white text-xs leading-tight">
                    CHAMPIONS
                  </div>
                  <div className="text-center text-[8px] bg-black/40 rounded-full py-0.5 text-cyan-300 font-bold font-sans">
                    95+ OVR
                  </div>
                </div>
              </div>

              {/* Standard Gold Pack */}
              <div className="bg-[#0f1922] border border-neutral-800 rounded-3xl p-5 flex items-center justify-between shadow-sm">
                <div className="space-y-2 max-w-[65%]">
                  <span className="bg-yellow-500/15 text-yellow-500 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">أساسي ذهبي</span>
                  <h3 className="text-base font-black text-white">الحزمة الذهبية القياسية</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">طريقة رائعة للحصول على لاعبين مميزين لزيادة عمق تشكيلتك بسعر اقتصادي.</p>
                  
                  <div className="flex gap-2.5 pt-2">
                    <button 
                      onClick={() => handleOpenPack("gold")}
                      className="bg-yellow-600 hover:bg-yellow-700 text-black text-[10px] font-black py-2 px-4 rounded-xl cursor-pointer flex items-center gap-1 shadow-md"
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>80,000 كوينز</span>
                    </button>
                  </div>
                </div>

                <div className="w-24 h-32 bg-gradient-to-b from-yellow-600 to-amber-950 rounded-2xl flex flex-col justify-between p-3 shadow-xl border border-white/10">
                  <div className="flex justify-between items-center text-yellow-300">
                    <span className="text-[10px] font-black">GOLD</span>
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-center font-black text-yellow-100 text-[10px] leading-tight">
                    STANDARD
                  </div>
                  <div className="text-center text-[8px] bg-black/30 rounded-full py-0.5 text-yellow-400 font-bold font-sans">
                    80+ OVR
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* MATCHES LEAGUE PLAY SIMULATOR */}
        {activeTab === "matches" && !isSimulatingMatch && (
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-[#12222d] to-[#041119] border border-neutral-800 rounded-2xl p-5">
              <h3 className="text-sm font-black text-[#D4AF37] uppercase tracking-wider mb-2">دوري أبطال حسين NAT 🏆</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                تحدى أقوى أندية العالم بتشكيلتك الحالية! الفوز بالمباراة يمنحك مكافآت ضخمة من الكوينز ونقاط فيفا لشراء وتدعيم فريقك بالنجوم.
              </p>
            </div>

            <h4 className="text-xs font-black text-emerald-500 uppercase tracking-widest">اختر خصمك اليوم</h4>

            <div className="grid grid-cols-1 gap-4">
              {[
                { name: "ريال مدريد الإسباني", ovr: 95, logo: "⚪" },
                { name: "نادي النصر السعودي", ovr: 91, logo: "🟡" },
                { name: "أهلي صنعاء (نجوم اليمن)", ovr: 85, logo: "🔴" },
                { name: "برشلونة الإسباني", ovr: 93, logo: "🔵" }
              ].map((team, idx) => (
                <div 
                  key={idx}
                  className="bg-[#0f1922] border border-neutral-800/80 rounded-2xl p-4 flex items-center justify-between hover:border-amber-500/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{team.logo}</span>
                    <div>
                      <h4 className="font-bold text-sm text-white">{team.name}</h4>
                      <p className="text-[10px] text-[#00ff66] font-black font-sans mt-0.5">OVR {team.ovr}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleStartMatch(team)}
                    className="bg-emerald-500 hover:bg-[#00e159] text-black font-black text-xs py-2 px-5 rounded-xl flex items-center gap-1 cursor-pointer transition-transform duration-250 active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
                    <span>لعب المباراة</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TRANSFERS MARKET PLACE */}
        {activeTab === "market" && (
          <div className="space-y-5">
            <div className="bg-[#0f1922] border border-neutral-800 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm text-white">إدارة مخزون لاعبيك للبيع</h4>
                <p className="text-xs text-neutral-400 mt-0.5">يمكنك تصفية وبيع اللاعبين غير النشطين مقابل الكوينز لجمع الأموال!</p>
              </div>
              <TrendingUp className="w-6 h-6 text-[#00ff66]" />
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {myPlayers.map((player) => {
                const isActiveInSquad = (Object.values(squad) as FootballPlayer[]).some(p => p.id === player.id);
                const sellValue = Math.round(player.price * 0.7);

                return (
                  <div 
                    key={player.id}
                    className="bg-[#0f1922] border border-neutral-800/80 rounded-2xl p-3.5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${player.cardType === "legendary" ? "bg-amber-500 text-black" : player.cardType === "toty" ? "bg-cyan-500" : "bg-neutral-800"}`}>
                        {player.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                          <span>{player.name}</span>
                          <span className="text-[9px] bg-neutral-800 px-1.5 py-0.5 rounded text-amber-500 font-black">{player.position}</span>
                        </h4>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-neutral-400">
                          <span className="font-mono text-[#D4AF37]">OVR {player.rating}</span>
                          <span>•</span>
                          <span className="font-sans text-[10px]">{player.club}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <div className="flex items-center gap-1 font-mono text-xs text-amber-500 font-bold">
                        <Coins className="w-3.5 h-3.5" />
                        <span>{sellValue.toLocaleString()}</span>
                      </div>
                      {isActiveInSquad ? (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-black px-2 py-0.5 rounded-full">نشط بالتشكيلة</span>
                      ) : (
                        <button 
                          onClick={() => handleSellPlayer(player)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-black py-1 px-3 rounded-lg border border-red-500/20 cursor-pointer"
                        >
                          بيع فوري
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* 4. FULL SCREEN PACK OPEN Reveal OVERLAY */}
      <AnimatePresence>
        {(isOpeningPack || packRevealed) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#020508]/98 z-50 flex flex-col justify-between py-12 px-6 text-center"
          >
            {/* Ambient spotlights */}
            <div className="absolute top-1/4 left-1/2 w-80 h-80 bg-amber-500/20 rounded-full blur-[120px] -translate-x-1/2" />
            
            {/* Top text */}
            <div className="relative z-10">
              <h2 className="text-lg font-black text-[#D4AF37] uppercase tracking-widest animate-pulse">
                {isOpeningPack ? "جاري فتح الحزمة الذهبية... ⚡" : "ألف مبروك! لاعب أسطوري جديد! 🎉"}
              </h2>
              <p className="text-xs text-neutral-400 mt-1 font-bold">نظام شحن وتعريب فوري وآمن بالثواني</p>
            </div>

            {/* Core Card reveal visuals */}
            <div className="my-auto relative z-10 flex flex-col items-center justify-center min-h-[320px]">
              {isOpeningPack ? (
                <div className="space-y-6">
                  {/* Rotating visual vortex */}
                  <div className="w-24 h-24 border-4 border-dashed border-amber-500 rounded-full animate-spin mx-auto flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-amber-500" />
                  </div>
                  <p className="text-xs text-neutral-300 font-bold">جاري الاتصال بخوادم FIFA ومطابقة الحظ...</p>
                </div>
              ) : openedPlayer ? (
                <motion.div 
                  initial={{ scale: 0.5, rotateY: 180 }}
                  animate={{ scale: 1, rotateY: 0 }}
                  transition={{ type: "spring", damping: 12, stiffness: 100 }}
                  className="space-y-6"
                >
                  {/* PREMIUM FIFA ULTIMATE CARD DESIGN */}
                  <div 
                    className={`w-64 h-96 mx-auto rounded-[2.5rem] p-5 flex flex-col justify-between relative overflow-hidden border-2 shadow-2xl ${
                      openedPlayer.cardType === "legendary" 
                        ? "bg-gradient-to-b from-[#ffea9f] via-[#D4AF37] to-[#7a5c12] border-[#ffea9f] text-black" 
                        : openedPlayer.cardType === "toty"
                          ? "bg-gradient-to-b from-cyan-400 via-indigo-600 to-indigo-950 border-cyan-400 text-white"
                          : "bg-gradient-to-b from-yellow-500 to-amber-950 border-yellow-500 text-white"
                    }`}
                  >
                    {/* Top rating and position block */}
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col items-center">
                        <span className="text-4xl font-black font-mono leading-none">{openedPlayer.rating}</span>
                        <span className="text-xs font-black uppercase mt-0.5 tracking-wider">{openedPlayer.position}</span>
                        <span className="text-sm mt-1">{openedPlayer.flag}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-80 block">{openedPlayer.cardType}</span>
                        <Star className="w-4 h-4 fill-current inline-block mt-1" />
                      </div>
                    </div>

                    {/* Massive Graphic Avatar */}
                    <div className="text-6xl my-2 animate-bounce">{openedPlayer.avatar}</div>

                    {/* Player Name block */}
                    <div className="text-center space-y-1">
                      <h3 className="text-xl font-black tracking-tight">{openedPlayer.name}</h3>
                      <p className="text-[10px] font-bold opacity-80">{openedPlayer.club}</p>
                    </div>

                    {/* Player Stats Hexagon Grid */}
                    <div className="grid grid-cols-6 gap-x-1 gap-y-1 border-t border-black/10 pt-3 text-[10px] font-sans font-black text-center">
                      <div>
                        <div className="opacity-75">PAC</div>
                        <div className="text-xs font-bold">{openedPlayer.stats.pac}</div>
                      </div>
                      <div>
                        <div className="opacity-75">SHO</div>
                        <div className="text-xs font-bold">{openedPlayer.stats.sho}</div>
                      </div>
                      <div>
                        <div className="opacity-75">PAS</div>
                        <div className="text-xs font-bold">{openedPlayer.stats.pas}</div>
                      </div>
                      <div>
                        <div className="opacity-75">DRI</div>
                        <div className="text-xs font-bold">{openedPlayer.stats.dri}</div>
                      </div>
                      <div>
                        <div className="opacity-75">DEF</div>
                        <div className="text-xs font-bold">{openedPlayer.stats.def}</div>
                      </div>
                      <div>
                        <div className="opacity-75">PHY</div>
                        <div className="text-xs font-bold">{openedPlayer.stats.phy}</div>
                      </div>
                    </div>
                  </div>

                  {/* Rarity and Special effect badges */}
                  <p className="text-xs text-amber-400 font-black tracking-wider">
                    🎉 ميزة حسين NAT للتعميد التلقائي! تم ربط كرت اللاعب بحسابك فوراً.
                  </p>
                </motion.div>
              ) : null}
            </div>

            {/* Bottom Actions control */}
            {packRevealed && (
              <div className="space-y-3 relative z-10">
                <button 
                  onClick={() => setPackRevealed(false)}
                  className="w-full btn-gold-gradient py-3.5 rounded-2xl text-sm font-black shadow-xl shadow-amber-950/40 cursor-pointer"
                >
                  📥 حفظ اللاعب والعودة للتشكيلة
                </button>
                <p className="text-[10px] text-neutral-500">تم تسجيل اللاعب بنجاح في Local Storage بالهاتف</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. MATCH LIVE ACTION SIMULATION WINDOW OVERLAY */}
      <AnimatePresence>
        {isSimulatingMatch && opponent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#040c12] z-50 flex flex-col justify-between py-6 px-4"
          >
            {/* Top Scoreboard */}
            <div className="bg-[#0c1922] border border-neutral-800 rounded-3xl p-4 flex items-center justify-between shadow-2xl">
              <div className="text-center flex-1">
                <span className="text-[10px] text-neutral-400 font-bold block mb-1">فريقك</span>
                <h4 className="font-bold text-xs text-white truncate max-w-[100px]">تشكيلة حسين</h4>
              </div>

              {/* Central Numbers */}
              <div className="flex items-center gap-4 bg-black/40 px-5 py-2.5 rounded-2xl border border-neutral-800">
                <span className="text-2xl font-black font-mono text-white">{matchScore.home}</span>
                <span className="text-xs font-black text-neutral-500 font-sans">:</span>
                <span className="text-2xl font-black font-mono text-white">{matchScore.away}</span>
                
                {/* Minute Badge */}
                <div className="bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] text-[10px] font-sans font-black px-2 py-0.5 rounded-md ml-2 animate-pulse">
                  {matchMinute}'
                </div>
              </div>

              <div className="text-center flex-1">
                <span className="text-[10px] text-neutral-400 font-bold block mb-1">{opponent.name}</span>
                <h4 className="font-bold text-xs text-white truncate max-w-[100px]">{opponent.name}</h4>
              </div>
            </div>

            {/* Simulated stadium field or action graphic */}
            <div className="flex-1 my-5 bg-[#0a141b] rounded-3xl border border-neutral-800 p-4 overflow-y-auto custom-scrollbar flex flex-col justify-end space-y-3 relative">
              <div className="absolute top-4 left-4 text-[10px] text-neutral-500 font-black">
                📻 بث تعليق مباشر
              </div>

              {/* Match commentary logs stack */}
              <div className="space-y-2.5">
                {matchEvents.map((event, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-2xl text-xs font-bold leading-relaxed border ${
                      event.includes("⚽") || event.includes("✅")
                        ? "bg-[#00ff66]/10 border-[#00ff66]/20 text-[#00ff66]" 
                        : event.includes("❌") || event.includes("🛑")
                          ? "bg-red-500/10 border-red-500/20 text-red-400"
                          : "bg-[#11212c] border-neutral-800 text-neutral-300"
                    }`}
                  >
                    {event}
                  </div>
                ))}
              </div>
            </div>

            {/* QTE (Quick Time tactical event) panel */}
            <AnimatePresence>
              {matchStatus === "qte" && activeQTE && (
                <motion.div 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  className="bg-[#0c1a24] border-2 border-amber-500 rounded-3xl p-5 space-y-4 mb-4 shadow-2xl relative z-20"
                >
                  <span className="bg-amber-500 text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase inline-block">حالة قرار تكتيكي سريع!</span>
                  <p className="text-xs font-black text-white leading-relaxed">{activeQTE.scenario}</p>
                  
                  <div className="grid grid-cols-1 gap-2.5">
                    {activeQTE.options.map((option, oIdx) => (
                      <button 
                        key={oIdx}
                        onClick={() => handleQTEChoice(option)}
                        className="w-full bg-[#182a36] hover:bg-[#203746] border border-neutral-800 hover:border-amber-500 text-xs text-white font-bold py-3 px-4 rounded-xl text-right flex items-center justify-between cursor-pointer"
                      >
                        <span>{option.text}</span>
                        <span className="text-[10px] text-amber-500 font-mono">احتمال {Math.round(option.successChance * 100)}%</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Match Actions control */}
            <div className="space-y-2">
              {matchStatus === "finished" ? (
                <button 
                  onClick={() => setIsSimulatingMatch(false)}
                  className="w-full btn-gold-gradient py-3.5 rounded-2xl text-xs font-black shadow-lg cursor-pointer"
                >
                  🏆 الخروج واستلام الجوائز
                </button>
              ) : (
                <div className="text-center py-2 text-[10px] text-neutral-500 font-bold animate-pulse">
                  ⚽ جاري استمرار المباراة... يرجى التفاعل مع أي قرارات تكتيكية لضمان الفوز!
                </div>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Sub-render helper for mini players slot design in formations
function renderSlotCard(player: FootballPlayer, slotKey: string, isSelected: boolean) {
  return (
    <div className={`w-14 h-20 flex flex-col justify-between items-center p-1.5 rounded-xl border relative shadow-md transition-all ${
      isSelected 
        ? "border-amber-400 bg-amber-500/20 scale-105" 
        : player.cardType === "legendary"
          ? "bg-gradient-to-b from-[#ffea9f] via-[#D4AF37] to-[#7a5c12] border-[#ffea9f] text-black"
          : player.cardType === "toty"
            ? "bg-gradient-to-b from-cyan-400 to-indigo-950 border-cyan-400 text-white"
            : "bg-[#111c24] border-neutral-800 text-white"
    }`}>
      {/* Top micro details */}
      <div className="flex justify-between items-center w-full text-[7px] font-black font-mono">
        <span className={player.cardType === "legendary" ? "text-black" : "text-amber-500"}>{player.rating}</span>
        <span className="opacity-80">{slotKey}</span>
      </div>

      {/* Micro avatar */}
      <div className="text-2xl mt-0.5">{player.avatar}</div>

      {/* Name banner */}
      <div className="text-center w-full">
        <p className="text-[7px] font-black tracking-tight truncate w-full">{player.name}</p>
      </div>

      {/* Active swap highlight */}
      {isSelected && (
        <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center text-amber-400 font-black text-[9px]">
          اختر...
        </div>
      )}
    </div>
  );
}
