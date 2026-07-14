import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import logoImg from "../assets/images/hussein_nat_logo_1783637074900.jpg";

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2400; // 2.4 seconds
    const intervalTime = 40;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 300); // Small buffer before switching screens
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="h-full w-full bg-[#070708] flex flex-col items-center justify-between py-16 px-6 relative overflow-hidden select-none">
      {/* Background radial gold glow */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-[80px]" />

      <div className="flex-1 flex flex-col items-center justify-center gap-6 z-10">
        {/* Animated logo wrapper */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-40 h-40 rounded-[32px] border-2 border-[#D4AF37]/30 shadow-2xl overflow-hidden shadow-[#D4AF37]/10"
        >
          <img
            src={logoImg}
            alt="حسين NAT"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Brand Text */}
        <div className="text-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-3xl font-black tracking-wide text-white"
          >
            حسين <span className="text-[#D4AF37]">NAT</span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xs font-bold text-neutral-400 mt-2"
          >
            المتجر الرسمي المعتمد لشحن شدات PUBG Mobile
          </motion.p>
        </div>
      </div>

      {/* Progress & loading indicator */}
      <div className="w-full max-w-[280px] flex flex-col items-center gap-3 z-10">
        <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden border border-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#F3E5AB] shadow-[0_0_10px_rgba(212,175,55,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between w-full text-[10px] font-sans font-bold text-neutral-500">
          <span>{Math.round(progress)}%</span>
          <span className="font-sans">جاري التشغيل...</span>
        </div>

        <div className="mt-6 flex flex-col items-center">
          <span className="text-[10px] text-[#D4AF37] font-black uppercase tracking-[0.2em]">آمن • سريع • موثوق</span>
          <span className="text-[8px] text-neutral-600 mt-1">نسخة الأندرويد v3.4.2</span>
        </div>
      </div>
    </div>
  );
}
