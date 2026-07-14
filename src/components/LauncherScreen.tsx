import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Wifi, 
  Battery, 
  Signal, 
  Search, 
  Phone, 
  Chrome, 
  Settings,
  MessageSquare,
  Gamepad2,
  CalendarDays,
  Trophy
} from "lucide-react";
import logoImg from "../assets/images/hussein_nat_logo_1783637074900.jpg";

interface LauncherScreenProps {
  onOpenStore: () => void;
  onOpenWhatsApp: () => void;
  onOpenFifa: () => void;
  onOpenAiBrowser: () => void;
  onOpenShabab: () => void;
  onOpenSnake: () => void;
  onOpenGmail: () => void;
}

export default function LauncherScreen({ onOpenStore, onOpenWhatsApp, onOpenFifa, onOpenAiBrowser, onOpenShabab, onOpenSnake, onOpenGmail }: LauncherScreenProps) {
  const [time, setTime] = useState("");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format time: HH:MM
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setTime(`${hours}:${minutes}`);

      // Format Arabic Date
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'short' 
      };
      setDateStr(now.toLocaleDateString('ar-YE', options));
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full w-full bg-[#0a0a0c] flex flex-col justify-between py-6 px-5 relative overflow-hidden select-none font-sans">
      {/* Premium Android abstract wallpaper background */}
      <div className="absolute top-[-50px] right-[-100px] w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-green-500/5 rounded-full blur-[100px]" />

      {/* Launcher Header Widget */}
      <div className="w-full flex flex-col items-center mt-10 z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Digital Clock Widget */}
          <h1 className="text-5xl font-black tracking-widest text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] font-mono">
            {time || "12:00"}
          </h1>
          {/* Arabic Date */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-400 font-bold mt-2">
            <CalendarDays className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{dateStr || "الخميس، 9 يوليو"}</span>
          </div>
        </motion.div>

        {/* Dynamic Glassmorphic Search Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="w-full mt-8 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between text-neutral-400 shadow-lg backdrop-blur-md"
        >
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-[11px] font-bold text-neutral-300">ابحث في هاتف حسين...</span>
          </div>
          <Search className="w-4 h-4 text-neutral-400" />
        </motion.div>
      </div>

      {/* Main Apps Grid */}
      <div className="w-full grid grid-cols-4 gap-y-6 gap-x-3 z-10 px-1 my-auto">
        
        {/* App 1: PUBG Store */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenStore}
          className="flex flex-col items-center gap-2 text-center group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1c1c22] to-neutral-900 border-2 border-[#D4AF37]/30 flex items-center justify-center shadow-xl shadow-[#D4AF37]/5 group-hover:border-[#D4AF37]/60 transition-all overflow-hidden relative">
            <img 
              src={logoImg} 
              alt="Hussein NAT Store" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Glowing gold dot */}
            <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-black animate-pulse" />
          </div>
          <span className="text-[10px] font-black text-white drop-shadow-md leading-tight">
            متجر الشدات
          </span>
        </motion.button>

        {/* App 2: Hussein WhatsApp */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenWhatsApp}
          className="flex flex-col items-center gap-2 text-center group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#128C7E] to-[#075E54] border-2 border-green-400/30 flex items-center justify-center shadow-xl shadow-green-900/10 group-hover:border-green-400/60 transition-all relative">
            <div className="text-white text-2xl">
              💬
            </div>
            {/* Unread message badge */}
            <div className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-sans font-black text-[9px] w-5 h-5 rounded-full flex items-center justify-center border border-[#0a0a0c] shadow-md animate-bounce">
              1
            </div>
          </div>
          <span className="text-[10px] font-black text-white drop-shadow-md leading-tight">
            واتساب حسين
          </span>
        </motion.button>

        {/* App 3: FIFA Hussein NAT */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenFifa}
          className="flex flex-col items-center gap-2 text-center group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0c1a24] to-[#040e15] border-2 border-[#D4AF37]/40 flex items-center justify-center shadow-xl shadow-amber-950/10 group-hover:border-[#D4AF37]/80 transition-all relative">
            <div className="text-white text-2xl">
              ⚽
            </div>
            {/* Glowing active star */}
            <div className="absolute -top-1 -right-1 bg-amber-500 text-black font-sans font-black text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-[#0a0a0c] shadow-md animate-pulse">
              ★
            </div>
          </div>
          <span className="text-[10px] font-black text-white drop-shadow-md leading-tight">
            فيفا حسين
          </span>
        </motion.button>

        {/* App 4: AI Browser */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenAiBrowser}
          className="flex flex-col items-center gap-2 text-center group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0c1a24] to-[#128C7E]/20 border-2 border-[#128C7E]/40 flex items-center justify-center shadow-xl group-hover:border-[#128C7E] transition-all relative">
            <div className="text-teal-400 text-2xl font-black">
              🌐
            </div>
            {/* Glowing AI badge */}
            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-teal-400 to-emerald-500 text-black font-sans font-black text-[7px] px-1 py-0.5 rounded-full flex items-center justify-center border border-[#0a0a0c] shadow-md animate-pulse">
              AI
            </div>
          </div>
          <span className="text-[10px] font-black text-white drop-shadow-md leading-tight">
            مستكشف المواقع
          </span>
        </motion.button>

        {/* App 5: Shabab Al Bomb 12 */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenShabab}
          className="flex flex-col items-center gap-2 text-center group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1c0c0c] to-[#e11d48]/20 border-2 border-[#e11d48]/40 flex items-center justify-center shadow-xl group-hover:border-[#e11d48] transition-all relative">
            <div className="text-red-500 text-2xl font-black animate-pulse">
              🍿
            </div>
            {/* Episode badge / Season badge */}
            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-sans font-black text-[7px] px-1 py-0.5 rounded-full flex items-center justify-center border border-[#0a0a0c] shadow-md">
              ج12
            </div>
          </div>
          <span className="text-[10px] font-black text-white drop-shadow-md leading-tight">
            شباب البومب 12
          </span>
        </motion.button>

        {/* App 6: Snake Game */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenSnake}
          className="flex flex-col items-center gap-2 text-center group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#18120c] to-[#f59e0b]/20 border-2 border-[#f59e0b]/40 flex items-center justify-center shadow-xl group-hover:border-[#f59e0b] transition-all relative">
            <div className="text-amber-400 text-2xl font-black animate-bounce" style={{ animationDuration: '3s' }}>
              🐍
            </div>
            {/* Hot badge */}
            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-red-500 text-white font-sans font-black text-[7px] px-1 py-0.5 rounded-full flex items-center justify-center border border-[#0a0a0c] shadow-md">
              لعبة
            </div>
          </div>
          <span className="text-[10px] font-black text-white drop-shadow-md leading-tight">
            لعبة الثعبان
          </span>
        </motion.button>

        {/* App 7: Gmail */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenGmail}
          className="flex flex-col items-center gap-2 text-center group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#121215] to-red-500/5 border-2 border-[#D4AF37]/30 flex items-center justify-center shadow-xl group-hover:border-red-500/60 transition-all relative">
            <div className="text-red-500 text-2xl">
              ✉️
            </div>
            {/* Notification badge */}
            <div className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-sans font-black text-[7px] px-1.5 py-0.5 rounded-full flex items-center justify-center border border-[#0a0a0c] shadow-md animate-pulse">
              بريد
            </div>
          </div>
          <span className="text-[10px] font-black text-white drop-shadow-md leading-tight">
            بريد حسين
          </span>
        </motion.button>

      </div>

      {/* Launcher Dock / Hotseat (Bottom Shelf) */}
      <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-4 flex justify-around items-center z-10 backdrop-blur-lg shadow-2xl">
        {/* WhatsApp Icon inside Dock */}
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={onOpenWhatsApp}
          className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md cursor-pointer relative"
        >
          <span className="text-white text-xl">💬</span>
          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
        </motion.button>

        {/* PUBG Store Icon inside Dock */}
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={onOpenStore}
          className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md cursor-pointer"
        >
          <Gamepad2 className="w-5 h-5 text-black font-black" />
        </motion.button>

        {/* Phone dialer inside Dock */}
        <div className="w-11 h-11 rounded-xl bg-neutral-800 flex items-center justify-center shadow-md text-neutral-400 opacity-60">
          <Phone className="w-5 h-5" />
        </div>

        {/* Settings inside Dock */}
        <div className="w-11 h-11 rounded-xl bg-neutral-800 flex items-center justify-center shadow-md text-neutral-400 opacity-60">
          <Settings className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
