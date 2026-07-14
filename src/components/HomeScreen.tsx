import React from "react";
import { motion } from "motion/react";
import { 
  Gamepad2, 
  Search, 
  Wallet, 
  PhoneCall, 
  ShieldCheck, 
  Zap, 
  Clock, 
  ChevronLeft,
  Flame
} from "lucide-react";
import { UC_PACKAGES } from "../data";

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
  onSelectPackage: (pkg: any) => void;
}

export default function HomeScreen({ onNavigate, onSelectPackage }: HomeScreenProps) {
  // Get the most popular packages to showcase on home
  const promoPackages = UC_PACKAGES.filter(p => p.isPopular);

  return (
    <div className="flex-1 flex flex-col p-4 gap-6 select-none bg-neutral-950 pb-8">
      {/* Dynamic Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 p-5 border border-[#D4AF37]/30 relative overflow-hidden shadow-[0_4px_25px_rgba(212,175,55,0.05)]"
      >
        <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute right-4 top-4 w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
          <Gamepad2 className="w-6 h-6 text-[#D4AF37]" />
        </div>
        
        <div className="relative z-10 max-w-[70%]">
          <span className="text-[10px] text-[#D4AF37] font-black uppercase tracking-wider bg-[#D4AF37]/10 px-2 py-0.5 rounded-md border border-[#D4AF37]/20 inline-block">
            عروض الصيف الحارقة 💥
          </span>
          <h2 className="text-xl font-black text-white mt-3 leading-tight text-gold-gradient">
            شحن شدات ببجي فوري بالآيدي
          </h2>
          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
            اشحن الآن واحصل على هدايا إضافية تصل إلى 2,100 شدة مجاناً مع تسليم فوري وتلقائي ⚡
          </p>
          <button 
            onClick={() => onNavigate("purchase")}
            className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black text-xs font-black hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>اشحن الآن</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      {/* CORE NAVIGATION GRID (Strictly following requested buttons) */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest text-right">
          الوصول السريع
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          {/* شحن PUBG Mobile */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate("purchase")}
            className="p-4 rounded-2xl bg-gradient-to-b from-[#1c1c22] to-neutral-900 border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 text-right flex flex-col justify-between h-28 cursor-pointer relative overflow-hidden group shadow-lg"
          >
            <div className="absolute right-0 top-0 w-16 h-16 bg-[#D4AF37]/5 rounded-bl-full group-hover:bg-[#D4AF37]/10 transition-all" />
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] flex items-center justify-center text-black shadow-md shadow-[#D4AF37]/20">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">شحن PUBG Mobile</h4>
              <p className="text-[10px] text-[#D4AF37] mt-0.5 font-bold">شحن بالآيدي رسمي</p>
            </div>
          </motion.button>

          {/* متابعة الطلب */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate("tracking")}
            className="p-4 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-white/5 hover:border-[#D4AF37]/30 text-right flex flex-col justify-between h-28 cursor-pointer relative overflow-hidden group shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-white/10 flex items-center justify-center text-neutral-300">
              <Search className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">متابعة الطلب</h4>
              <p className="text-[10px] text-neutral-400 mt-0.5">تتبع حالة شحنتك</p>
            </div>
          </motion.button>

          {/* طرق الدفع */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate("payment_methods")}
            className="p-4 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-white/5 hover:border-[#D4AF37]/30 text-right flex flex-col justify-between h-28 cursor-pointer relative overflow-hidden group shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-white/10 flex items-center justify-center text-neutral-300">
              <Wallet className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">طرق الدفع</h4>
              <p className="text-[10px] text-neutral-400 mt-0.5">محلي، بنكي، كاش</p>
            </div>
          </motion.button>

          {/* تواصل معنا */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate("contact")}
            className="p-4 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-white/5 hover:border-[#D4AF37]/30 text-right flex flex-col justify-between h-28 cursor-pointer relative overflow-hidden group shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-white/10 flex items-center justify-center text-neutral-300">
              <PhoneCall className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">تواصل معنا</h4>
              <p className="text-[10px] text-neutral-400 mt-0.5">واتساب، تلغرام، اتصال</p>
            </div>
          </motion.button>
        </div>
      </div>

      {/* DYNAMIC PROMOTIONAL SECTION */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-neutral-500 font-bold font-sans">أسعار منافسة</span>
          <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest text-right flex items-center gap-1.5">
            الباقات الأكثر طلباً
            <Flame className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
          </h3>
        </div>

        <div className="flex flex-col gap-2.5">
          {promoPackages.map((pkg) => (
            <div 
              key={pkg.id}
              className="p-3 rounded-xl bg-gradient-to-l from-neutral-900 to-neutral-950 border border-white/5 hover:border-[#D4AF37]/20 flex items-center justify-between transition-colors cursor-pointer"
              onClick={() => onSelectPackage(pkg)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center border border-[#D4AF37]/20 font-black text-[#D4AF37]">
                  {pkg.ucAmount}
                </div>
                <div className="text-right">
                  <div className="text-xs font-extrabold text-white">
                    {pkg.ucAmount} شدة {pkg.bonusUc > 0 && `+ ${pkg.bonusUc} مجاناً`}
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-0.5 font-bold">
                    سعر فوري ممتاز وآمن
                  </div>
                </div>
              </div>

              <div className="text-left flex flex-col items-end">
                <span className="text-xs font-black text-[#D4AF37] font-sans">
                  {pkg.priceYer.toLocaleString("ar-YE")} ريال
                </span>
                <span className="text-[9px] text-neutral-500 font-bold font-sans mt-0.5">
                  ${pkg.priceUsd}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WHY CHOOSE US / BADGES */}
      <div className="mt-2 bg-neutral-900/40 rounded-2xl p-4 border border-white/5 flex flex-col gap-3">
        <h4 className="text-xs font-black text-white text-right">
          ضمانات متجر حسين <span className="text-[#D4AF37]">NAT</span>
        </h4>
        
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center text-center p-2 rounded-xl bg-black/30 border border-white/5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1" />
            <span className="text-[9px] font-black text-white leading-tight">شحن رسمي 100%</span>
            <span className="text-[8px] text-neutral-500 mt-0.5">عبر الآيدي فقط</span>
          </div>

          <div className="flex flex-col items-center text-center p-2 rounded-xl bg-black/30 border border-white/5">
            <Zap className="w-5 h-5 text-amber-400 mb-1" />
            <span className="text-[9px] font-black text-white leading-tight">شحن فوري</span>
            <span className="text-[8px] text-neutral-500 mt-0.5">خلال 60 ثانية</span>
          </div>

          <div className="flex flex-col items-center text-center p-2 rounded-xl bg-black/30 border border-white/5">
            <Clock className="w-5 h-5 text-cyan-400 mb-1" />
            <span className="text-[9px] font-black text-white leading-tight">دعم فني متواصل</span>
            <span className="text-[8px] text-neutral-500 mt-0.5">على مدار الساعة</span>
          </div>
        </div>
      </div>
    </div>
  );
}
