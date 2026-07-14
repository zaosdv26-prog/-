import React from "react";
import { motion } from "motion/react";
import { 
  Phone, 
  MessageCircle, 
  Send, 
  Clock, 
  MapPin, 
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { CONTACT_INFO } from "../data";

export default function ContactScreen() {
  const whatsapp1Url = `https://wa.me/${CONTACT_INFO.whatsapp1}?text=${encodeURIComponent("مرحباً متجر حسين NAT، أود الاستفسار عن خدمات شحن شدات ببجي موبايل.")}`;
  const whatsapp2Url = `https://wa.me/${CONTACT_INFO.whatsapp2}?text=${encodeURIComponent("مرحباً متجر حسين NAT، أود الاستفسار عن الحوالات والطلبات المباشرة.")}`;
  const telegramUrl = `https://t.me/${CONTACT_INFO.telegram}`;

  const handleDial = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, "_self");
  };

  return (
    <div className="flex-1 flex flex-col p-4 gap-6 bg-neutral-950 pb-24 text-right select-none">
      
      {/* Intro Hero */}
      <div className="text-center py-2">
        <h2 className="text-lg font-black text-white text-gold-gradient">تواصل مع الدعم الفني المباشر</h2>
        <p className="text-[10px] text-neutral-400 mt-1 leading-relaxed max-w-[280px] mx-auto">
          فريق خدمة عملاء متجر حسين NAT متواجد لخدمتكم والإجابة على استفساراتكم على مدار الساعة 24/7.
        </p>
      </div>

      {/* 1. WHATSAPP CHANNELS (GREEN & GOLD) */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest flex items-center justify-end gap-1.5 border-b border-[#D4AF37]/15 pb-2">
          مراسلة فورية عبر واتساب
          <MessageCircle className="w-4 h-4 text-emerald-400" />
        </h3>

        <div className="flex flex-col gap-2.5">
          {/* WhatsApp Line 1 */}
          <motion.a
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            href={whatsapp1Url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-gradient-to-l from-neutral-900 to-neutral-950 border border-emerald-500/10 hover:border-emerald-500/40 flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ExternalLink className="w-4 h-4" />
            </div>
            
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-xs font-black text-white">الخط الرئيسي للمبيعات والشحن</span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              </div>
              <span className="text-[10px] text-neutral-500 font-sans mt-0.5 block">782985197 (متاح دائماً)</span>
            </div>
          </motion.a>

          {/* WhatsApp Line 2 */}
          <motion.a
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            href={whatsapp2Url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-gradient-to-l from-neutral-900 to-neutral-950 border border-emerald-500/10 hover:border-emerald-500/40 flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ExternalLink className="w-4 h-4" />
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-xs font-black text-white">خط تأكيد الحوالات والوكلاء</span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              </div>
              <span className="text-[10px] text-neutral-500 font-sans mt-0.5 block">736887081 (متاح دائماً)</span>
            </div>
          </motion.a>
        </div>
      </div>

      {/* 2. TELEGRAM CHANNEL */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest flex items-center justify-end gap-1.5 border-b border-[#D4AF37]/15 pb-2">
          مراسلة فورية عبر تلغرام
          <Send className="w-4 h-4 text-sky-400" />
        </h3>

        <motion.a
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 rounded-2xl bg-gradient-to-l from-neutral-900 to-neutral-950 border border-sky-500/10 hover:border-sky-500/40 flex items-center justify-between cursor-pointer transition-colors"
        >
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
            <ExternalLink className="w-4 h-4" />
          </div>

          <div className="text-right">
            <h4 className="text-xs font-black text-white">معرّف التلغرام الرسمي</h4>
            <span className="text-[10px] text-neutral-500 font-sans mt-0.5 block">@{CONTACT_INFO.telegram}</span>
          </div>
        </motion.a>
      </div>

      {/* 3. PHONE VOICE CALLS */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest flex items-center justify-end gap-1.5 border-b border-[#D4AF37]/15 pb-2">
          اتصال هاتفي مباشر
          <Phone className="w-4 h-4 text-[#D4AF37]" />
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => handleDial("782985197")}
            className="p-4 rounded-2xl bg-[#111114] border border-white/5 hover:border-[#D4AF37]/30 flex flex-col justify-between items-end h-24 cursor-pointer text-right"
          >
            <Phone className="w-5 h-5 text-[#D4AF37] self-start" />
            <div>
              <span className="text-[9px] text-neutral-500 font-bold block">اتصل برقم مبيعات 01</span>
              <span className="text-xs font-black text-white font-sans mt-1 block">782985197</span>
            </div>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => handleDial("736887081")}
            className="p-4 rounded-2xl bg-[#111114] border border-white/5 hover:border-[#D4AF37]/30 flex flex-col justify-between items-end h-24 cursor-pointer text-right"
          >
            <Phone className="w-5 h-5 text-[#D4AF37] self-start" />
            <div>
              <span className="text-[9px] text-neutral-500 font-bold block">اتصل برقم حسابات 02</span>
              <span className="text-xs font-black text-white font-sans mt-1 block">736887081</span>
            </div>
          </motion.button>
        </div>
      </div>

      {/* 4. PHYSICAL BRANCH LOCATIONS */}
      <div className="bg-[#111114] border border-white/5 rounded-2xl p-4 flex gap-3 text-right">
        <div className="flex-1">
          <h4 className="text-xs font-extrabold text-white">المقر الرئيسي ومحل التحصيل</h4>
          <p className="text-[10px] text-[#D4AF37] font-bold mt-1.5">
            بقالة الهلال - بجانب مستشفى الهلال التخصصي، صنعاء
          </p>
          <div className="flex items-center justify-end gap-1.5 text-[9px] text-neutral-500 mt-1">
            <span>من الساعة 8:00 صباحاً حتى 11:30 مساءً</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-amber-500 self-start">
          <MapPin className="w-5 h-5" />
        </div>
      </div>

      {/* Security Check footer */}
      <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] font-black text-neutral-500 select-none">
        <span>شريك شحن رسمي مرخص ومعتمد من خوادم Midasbuy</span>
        <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
      </div>

    </div>
  );
}
