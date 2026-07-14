import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  Play, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Trophy, 
  Compass, 
  Sparkles, 
  Gamepad2, 
  Flame, 
  Star, 
  Award, 
  CheckCircle2, 
  Gift,
  HelpCircle,
  TrendingUp,
  Coins
} from "lucide-react";

interface SnakeGameScreenProps {
  onClose: () => void;
}

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type ThemeType = "classic" | "gold" | "cyber" | "retro";
type DifficultyType = "easy" | "medium" | "hard";

interface Point {
  x: number;
  y: number;
}

// Sound synthesizer using Web Audio API to avoid external asset dependencies
const playSynthSound = (type: "eat" | "die" | "turn" | "reward" | "start") => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === "eat") {
      // Short high pitch beep
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1); // A5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === "turn") {
      // Soft fast click/pop
      osc.type = "triangle";
      osc.frequency.setValueAtTime(150, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === "die") {
      // Downwards pitch crash
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(60, now + 0.6);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);
      osc.start(now);
      osc.stop(now + 0.65);
    } else if (type === "reward") {
      // Arpeggio sound
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === "start") {
      // Upbeat double chime
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.15); // A5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (error) {
    console.warn("Web Audio API not supported or blocked", error);
  }
};

export default function SnakeGameScreen({ onClose }: SnakeGameScreenProps) {
  // Grid settings
  const GRID_SIZE = 16;
  
  // Game states
  const [snake, setSnake] = useState<Point[]>([
    { x: 8, y: 8 },
    { x: 8, y: 9 },
    { x: 8, y: 10 }
  ]);
  const [food, setFood] = useState<Point>({ x: 5, y: 4 });
  const [foodType, setFoodType] = useState<"regular" | "golden" | "speed">("regular");
  const [direction, setDirection] = useState<Direction>("UP");
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem("hussein_snake_high") || "0");
  });
  
  // Customization
  const [theme, setTheme] = useState<ThemeType>("gold"); // Default gold for Hussein NAT
  const [difficulty, setDifficulty] = useState<DifficultyType>("medium");
  const [isMuted, setIsMuted] = useState(false);
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [claimedPrize, setClaimedPrize] = useState<string | null>(null);

  // Direction changes that need to be flushed on next tick to avoid fast double-press suicide
  const nextDirectionRef = useRef<Direction>("UP");
  const gameIntervalRef = useRef<any>(null);

  // Audio helper
  const triggerSound = (type: "eat" | "die" | "turn" | "reward" | "start") => {
    if (!isMuted) {
      playSynthSound(type);
    }
  };

  // Generate random food spot
  const generateNewFood = (currentSnake: Point[]) => {
    let newFood: Point;
    let isOnSnake = true;
    
    while (isOnSnake) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // Check if food coordinate overlaps snake body
      isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }

    // Set a type of food
    const rand = Math.random();
    if (rand > 0.85) {
      setFoodType("golden"); // High value food (Gold coin)
    } else if (rand > 0.72) {
      setFoodType("speed"); // Speed boost/interactive bonus
    } else {
      setFoodType("regular"); // Normal apple
    }

    setFood(newFood!);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGameStarted || isGameOver) return;
      
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") {
            nextDirectionRef.current = "UP";
            triggerSound("turn");
          }
          e.preventDefault();
          break;
        case "ArrowDown":
          if (direction !== "UP") {
            nextDirectionRef.current = "DOWN";
            triggerSound("turn");
          }
          e.preventDefault();
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") {
            nextDirectionRef.current = "LEFT";
            triggerSound("turn");
          }
          e.preventDefault();
          break;
        case "ArrowRight":
          if (direction !== "LEFT") {
            nextDirectionRef.current = "RIGHT";
            triggerSound("turn");
          }
          e.preventDefault();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, isGameStarted, isGameOver]);

  // Game speed/loop interval based on difficulty
  const getIntervalSpeed = () => {
    switch (difficulty) {
      case "easy": return 240;
      case "medium": return 160;
      case "hard": return 105;
      default: return 160;
    }
  };

  // Start / restart game
  const startGame = () => {
    triggerSound("start");
    setSnake([
      { x: 8, y: 8 },
      { x: 8, y: 9 },
      { x: 8, y: 10 }
    ]);
    setDirection("UP");
    nextDirectionRef.current = "UP";
    setScore(0);
    setIsGameOver(false);
    setIsGameStarted(true);
    setClaimedPrize(null);
    generateNewFood([{ x: 8, y: 8 }, { x: 8, y: 9 }, { x: 8, y: 10 }]);
  };

  // Game tick loop
  useEffect(() => {
    if (!isGameStarted || isGameOver) {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
      return;
    }

    const tick = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const currentDir = nextDirectionRef.current;
        setDirection(currentDir);

        let newHead = { ...head };

        switch (currentDir) {
          case "UP": newHead.y -= 1; break;
          case "DOWN": newHead.y += 1; break;
          case "LEFT": newHead.x -= 1; break;
          case "RIGHT": newHead.x += 1; break;
        }

        // 1. Boundary crash collision check
        if (
          newHead.x < 0 || 
          newHead.x >= GRID_SIZE || 
          newHead.y < 0 || 
          newHead.y >= GRID_SIZE
        ) {
          triggerSound("die");
          setIsGameOver(true);
          return prevSnake;
        }

        // 2. Self crash collision check
        const hitSelf = prevSnake.some((segment, idx) => idx > 0 && segment.x === newHead.x && segment.y === newHead.y);
        if (hitSelf) {
          triggerSound("die");
          setIsGameOver(true);
          return prevSnake;
        }

        // 3. Food eating check
        const ateFood = newHead.x === food.x && newHead.y === food.y;
        let updatedSnake = [newHead, ...prevSnake];

        if (ateFood) {
          // Increment points based on food type
          let pointsGained = 1;
          if (foodType === "golden") {
            pointsGained = 3;
            triggerSound("reward");
          } else if (foodType === "speed") {
            pointsGained = 2;
            triggerSound("eat");
          } else {
            pointsGained = 1;
            triggerSound("eat");
          }

          setScore(prev => {
            const nextScore = prev + pointsGained;
            if (nextScore > highScore) {
              setHighScore(nextScore);
              localStorage.setItem("hussein_snake_high", String(nextScore));
            }
            return nextScore;
          });

          generateNewFood(prevSnake);
        } else {
          // Just normal move: remove tail
          updatedSnake.pop();
        }

        return updatedSnake;
      });
    };

    gameIntervalRef.current = setInterval(tick, getIntervalSpeed());

    return () => {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    };
  }, [isGameStarted, isGameOver, food, foodType, difficulty]);

  // Touch controls / button D-Pad handlers
  const handleDpadPress = (dir: Direction) => {
    if (!isGameStarted || isGameOver) return;
    
    switch (dir) {
      case "UP":
        if (direction !== "DOWN") {
          nextDirectionRef.current = "UP";
          triggerSound("turn");
        }
        break;
      case "DOWN":
        if (direction !== "UP") {
          nextDirectionRef.current = "DOWN";
          triggerSound("turn");
        }
        break;
      case "LEFT":
        if (direction !== "RIGHT") {
          nextDirectionRef.current = "LEFT";
          triggerSound("turn");
        }
        break;
      case "RIGHT":
        if (direction !== "LEFT") {
          nextDirectionRef.current = "RIGHT";
          triggerSound("turn");
        }
        break;
    }
  };

  // Reward Codes / Vouchers mapping
  const drawPrize = () => {
    const prizes = [
      "🏷️ كوبون خصم 15% على شحن ببجي (Code: NAT_SNAKE15)",
      "💎 كود شحن ببجي مجاني 60 شدة (Code: H_PUBG_60_UC)",
      "⚡ تصميم شعار تجاري مجاني من متجر حسين",
      "🏷️ كود تفعيل فلتر بطل فيفا للألعاب (Code: NAT_FIFA_PASS)",
      "🎁 خصم 20% على خدمات واتساب الأعمال الفورية"
    ];
    const randomIndex = Math.floor(Math.random() * prizes.length);
    setClaimedPrize(prizes[randomIndex]);
    setShowPrizeModal(true);
  };

  // Style Themes configuration
  const getThemeStyles = () => {
    switch (theme) {
      case "gold": // NAT Luxury Gold and Black
        return {
          gridBg: "bg-gradient-to-b from-[#110d05] to-[#1a150c]",
          gridBorder: "border-amber-500/30",
          snakeHead: "bg-gradient-to-r from-amber-400 to-yellow-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] rounded-sm",
          snakeBody: "bg-amber-600/80 rounded-md border border-black/40",
          foodRegular: "🍎",
          foodGolden: "🏆",
          foodSpeed: "⚡",
          accentColor: "text-amber-400",
          buttonActive: "bg-amber-500 text-black font-black"
        };
      case "cyber": // Neon Cyber Cosmic
        return {
          gridBg: "bg-gradient-to-b from-[#0a0512] to-[#120824]",
          gridBorder: "border-purple-500/30",
          snakeHead: "bg-gradient-to-r from-fuchsia-500 to-cyan-400 shadow-[0_0_10px_rgba(236,72,153,0.8)] rounded-full",
          snakeBody: "bg-fuchsia-600/70 rounded-full border border-cyan-500/20",
          foodRegular: "🟣",
          foodGolden: "⭐",
          foodSpeed: "👾",
          accentColor: "text-fuchsia-400",
          buttonActive: "bg-fuchsia-600 text-white font-black"
        };
      case "classic": // Old classic forest
        return {
          gridBg: "bg-[#0b1b0e]",
          gridBorder: "border-emerald-500/30",
          snakeHead: "bg-gradient-to-r from-emerald-400 to-green-500 shadow-md rounded-md",
          snakeBody: "bg-emerald-700/80 rounded-lg",
          foodRegular: "🍎",
          foodGolden: "🟡",
          foodSpeed: "🍄",
          accentColor: "text-emerald-400",
          buttonActive: "bg-emerald-600 text-white font-black"
        };
      case "retro": // Monochrome Gameboy style
        return {
          gridBg: "bg-[#2b352b]",
          gridBorder: "border-[#141d14]",
          snakeHead: "bg-[#0f140f] rounded-none",
          snakeBody: "bg-[#1f291f] border border-[#2b352b]",
          foodRegular: "◼️",
          foodGolden: "🔳",
          foodSpeed: "⚄",
          accentColor: "text-[#d1e0d1]",
          buttonActive: "bg-[#1f291f] text-white"
        };
    }
  };

  const themeConfig = getThemeStyles();

  return (
    <div className="h-full w-full bg-[#0a0a0c] text-white flex flex-col justify-between relative overflow-hidden font-sans select-none">
      
      {/* Background Ambience Elements */}
      <div className="absolute top-[-50px] left-[-50px] w-72 h-72 bg-amber-500/5 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[-50px] right-[-50px] w-72 h-72 bg-rose-600/5 rounded-full blur-[90px] pointer-events-none" />

      {/* Screen Header */}
      <div className="w-full bg-[#111115]/90 border-b border-white/5 py-3 px-4 flex items-center justify-between z-20 shadow-md backdrop-blur-md">
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/5 rounded-xl transition text-neutral-400 hover:text-white cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-1.5">
          <Gamepad2 className="w-4.5 h-4.5 text-amber-500 animate-bounce" />
          <h1 className="text-xs font-black tracking-wide text-neutral-100">لعبة الثعبان المطور - متجر حسين</h1>
        </div>
        
        {/* Sound toggler */}
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="p-1.5 hover:bg-white/5 rounded-lg text-neutral-400 hover:text-white transition cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
        </button>
      </div>

      {/* Main Core Body */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col justify-between gap-3 scrollbar-none z-10">
        
        {/* Scores Card Row */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Current Score */}
          <div className="bg-[#121217] border border-white/5 p-2.5 rounded-2xl flex items-center justify-between text-right">
            <Coins className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-[8px] text-neutral-400 block">النقاط الحالية</span>
              <span className="text-sm font-black text-white">{score}</span>
            </div>
          </div>

          {/* Record / High Score */}
          <div className="bg-[#121217] border border-white/5 p-2.5 rounded-2xl flex items-center justify-between text-right">
            <Trophy className="w-5 h-5 text-yellow-400 animate-pulse" />
            <div>
              <span className="text-[8px] text-neutral-400 block">الرقم القياسي</span>
              <span className="text-sm font-black text-amber-400">{highScore}</span>
            </div>
          </div>
        </div>

        {/* Config Settings Row */}
        <div className="bg-[#121217]/60 border border-white/5 p-2.5 rounded-2xl flex flex-col gap-2">
          
          {/* Themes configuration */}
          <div className="flex items-center justify-between gap-1">
            <div className="flex gap-1">
              {(["gold", "cyber", "classic", "retro"] as ThemeType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTheme(t);
                    triggerSound("turn");
                  }}
                  className={`px-2 py-1 rounded-lg text-[8px] font-bold transition cursor-pointer ${
                    theme === t 
                      ? "bg-amber-500 text-black font-black shadow-md shadow-amber-500/10" 
                      : "bg-[#181822] text-neutral-400 border border-white/5 hover:text-white"
                  }`}
                >
                  {t === "gold" && "الذهبي NAT"}
                  {t === "cyber" && "سيبراني"}
                  {t === "classic" && "كلاسيك"}
                  {t === "retro" && "عتيق"}
                </button>
              ))}
            </div>
            <span className="text-[8px] font-black text-neutral-400">التصميم:</span>
          </div>

          {/* Difficulty Levels selection */}
          <div className="flex items-center justify-between gap-1">
            <div className="flex gap-1">
              {(["easy", "medium", "hard"] as DifficultyType[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => {
                    setDifficulty(diff);
                    triggerSound("turn");
                  }}
                  className={`px-2 py-1 rounded-lg text-[8px] font-bold transition cursor-pointer ${
                    difficulty === diff 
                      ? "bg-amber-500 text-black font-black" 
                      : "bg-[#181822] text-neutral-400 border border-white/5 hover:text-white"
                  }`}
                >
                  {diff === "easy" && "بطيء"}
                  {diff === "medium" && "متوسط"}
                  {diff === "hard" && "محترف 🔥"}
                </button>
              ))}
            </div>
            <span className="text-[8px] font-black text-neutral-400">السرعة:</span>
          </div>

        </div>

        {/* GAME CANVAS GRID BOARD */}
        <div className="flex justify-center items-center my-1">
          <div 
            className={`w-[272px] h-[272px] rounded-3xl border-2 ${themeConfig.gridBorder} ${themeConfig.gridBg} grid relative p-1 overflow-hidden shadow-2xl`}
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
            }}
          >
            {/* Draw Food */}
            <div 
              className="absolute text-center flex items-center justify-center text-xs animate-bounce"
              style={{
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                left: `${(food.x / GRID_SIZE) * 100}%`,
                top: `${(food.y / GRID_SIZE) * 100}%`,
                transition: "all 0.05s ease-out"
              }}
            >
              {foodType === "golden" ? themeConfig.foodGolden : (foodType === "speed" ? themeConfig.foodSpeed : themeConfig.foodRegular)}
            </div>

            {/* Draw Snake segments */}
            {snake.map((segment, index) => {
              const isHead = index === 0;
              return (
                <div
                  key={index}
                  className={`absolute ${isHead ? themeConfig.snakeHead : themeConfig.snakeBody}`}
                  style={{
                    width: `${100 / GRID_SIZE}%`,
                    height: `${100 / GRID_SIZE}%`,
                    left: `${(segment.x / GRID_SIZE) * 100}%`,
                    top: `${(segment.y / GRID_SIZE) * 100}%`,
                    zIndex: isHead ? 10 : 5,
                    transition: "all 0.08s linear"
                  }}
                />
              );
            })}

            {/* Empty grid background guides for premium effect */}
            {theme !== "retro" && Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
              const x = i % GRID_SIZE;
              const y = Math.floor(i / GRID_SIZE);
              return (
                <div 
                  key={i} 
                  className="border-[0.25px] border-white/[0.02] flex items-center justify-center"
                  style={{
                    gridColumnStart: x + 1,
                    gridRowStart: y + 1,
                  }}
                />
              );
            })}

            {/* GAME COVER OVERLAYS (Wait, Play, GameOver) */}
            <AnimatePresence>
              {!isGameStarted && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 z-30"
                >
                  <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center text-2xl mb-3 text-amber-400">
                    🐍
                  </div>
                  <h3 className="text-xs font-black text-white">تحدي الثعبان من حسين NAT</h3>
                  <p className="text-[9px] text-neutral-400 mt-1 max-w-[200px] leading-relaxed">
                    تحكم بالثعبان وحقق أكبر عدد نقاط لتربح كوبونات شحن ومكافآت مجانية!
                  </p>
                  
                  <button
                    onClick={startGame}
                    className="mt-4 bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] px-6 py-2 rounded-2xl flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer transition"
                  >
                    <Play className="w-3 h-3 fill-black" />
                    <span>ابدأ اللعب الآن</span>
                  </button>
                </motion.div>
              )}

              {isGameOver && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 z-30"
                >
                  <span className="text-4xl">💥</span>
                  <h3 className="text-xs font-black text-red-500 mt-2">انتهت اللعبة!</h3>
                  <p className="text-[9px] text-neutral-400 mt-1">
                    لقد أحرزت <span className="text-amber-400 font-bold">{score} نقطة</span>
                  </p>

                  <div className="flex gap-2.5 mt-4">
                    <button
                      onClick={startGame}
                      className="bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>إعادة المحاولة</span>
                    </button>
                    
                    {score >= 20 ? (
                      <button
                        onClick={drawPrize}
                        className="bg-gradient-to-r from-red-600 to-amber-500 text-white font-black text-[10px] px-4 py-2 rounded-xl flex items-center gap-1 shadow-lg cursor-pointer transition animate-pulse"
                      >
                        <Gift className="w-3 h-3" />
                        <span>اسحب جائزتك! 🎁</span>
                      </button>
                    ) : (
                      <div className="bg-white/5 border border-white/5 px-3 py-2 rounded-xl text-[8px] text-neutral-400 flex flex-col justify-center">
                        احصل على 20+ نقطة لسحب الجائزة
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* CONTROLS AREA: D-PAD AND HOW-TO-PLAY */}
        <div className="flex flex-col items-center gap-3">
          
          {/* Touch Joystick / Virtual D-Pad */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            
            {/* Background disc */}
            <div className="absolute inset-0 bg-neutral-900/60 border border-white/5 rounded-full backdrop-blur-md" />
            
            {/* UP button */}
            <button
              onClick={() => handleDpadPress("UP")}
              className="absolute top-1 w-11 h-11 bg-neutral-800 hover:bg-neutral-700 active:bg-amber-500/20 border border-white/5 rounded-2xl flex items-center justify-center text-neutral-300 active:text-amber-400 active:border-amber-500/30 shadow-md cursor-pointer transition-all"
            >
              ▲
            </button>

            {/* LEFT button */}
            <button
              onClick={() => handleDpadPress("LEFT")}
              className="absolute left-1 w-11 h-11 bg-neutral-800 hover:bg-neutral-700 active:bg-amber-500/20 border border-white/5 rounded-2xl flex items-center justify-center text-neutral-300 active:text-amber-400 active:border-amber-500/30 shadow-md cursor-pointer transition-all"
            >
              ◀
            </button>

            {/* Center Core Dot */}
            <div className="w-5 h-5 bg-amber-500 rounded-full shadow-lg shadow-amber-500/20 border-2 border-black z-10" />

            {/* RIGHT button */}
            <button
              onClick={() => handleDpadPress("RIGHT")}
              className="absolute right-1 w-11 h-11 bg-neutral-800 hover:bg-neutral-700 active:bg-amber-500/20 border border-white/5 rounded-2xl flex items-center justify-center text-neutral-300 active:text-amber-400 active:border-amber-500/30 shadow-md cursor-pointer transition-all"
            >
              ▶
            </button>

            {/* DOWN button */}
            <button
              onClick={() => handleDpadPress("DOWN")}
              className="absolute bottom-1 w-11 h-11 bg-neutral-800 hover:bg-neutral-700 active:bg-amber-500/20 border border-white/5 rounded-2xl flex items-center justify-center text-neutral-300 active:text-amber-400 active:border-amber-500/30 shadow-md cursor-pointer transition-all"
            >
              ▼
            </button>

          </div>

          {/* Quick Guide */}
          <div className="text-center">
            <p className="text-[8px] text-neutral-500">
              * يدعم اللعب أيضاً بمفاتيح الأسهم في لوحة المفاتيح
            </p>
          </div>

        </div>

      </div>

      {/* FOOTER ACCENTS */}
      <div className="bg-[#111115]/40 py-2.5 px-4 text-center border-t border-white/5 z-10 flex items-center justify-center gap-1.5">
        <Sparkles className="w-3 h-3 text-amber-500" />
        <span className="text-[9px] text-neutral-400 font-bold">
          شحن فوري، ألعاب وترندات على مدار الساعة مع متجر حسين
        </span>
      </div>

      {/* MODAL FOR NAT STORE CLAIMABLE PRIZES */}
      <AnimatePresence>
        {showPrizeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-5 z-40"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#121217] border border-amber-500/40 rounded-3xl p-6 text-center max-w-xs flex flex-col items-center gap-4 shadow-2xl relative overflow-hidden"
            >
              {/* Confetti element */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-rose-500 to-yellow-500" />

              <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center text-3xl animate-bounce">
                🎉
              </div>

              <h3 className="text-xs font-black text-amber-400 leading-tight">مبروك! كسبت جائزة متجر حسين NAT</h3>
              <p className="text-[9px] text-neutral-400 leading-relaxed">
                تقديراً لمهارتك في لعبة الثعبان وتحقيقك لنتيجة ممتازة، نهديك المكافأة التالية:
              </p>

              <div className="bg-amber-500/5 border border-amber-500/20 p-3.5 rounded-2xl w-full">
                <p className="text-[10px] font-black text-yellow-400 leading-relaxed">
                  {claimedPrize}
                </p>
              </div>

              <p className="text-[8px] text-neutral-500 leading-normal">
                * التقط لقطة شاشة للرمز وأرسلها لحسين عبر الواتساب لتفعيل الخدمة فوراً!
              </p>

              <button
                onClick={() => setShowPrizeModal(false)}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] py-2 rounded-xl transition cursor-pointer"
              >
                حسناً، فهمت
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
