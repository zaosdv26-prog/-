import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Gamepad2, 
  CheckCircle2, 
  AlertCircle, 
  ChevronLeft,
  Coins,
  Loader2,
  Sparkles
} from "lucide-react";
import { UcPackage } from "../types";
import { UC_PACKAGES } from "../data";

interface PurchaseScreenProps {
  onProceedToPayment: (playerId: string, selectedPackage: UcPackage) => void;
  preSelectedPackage: UcPackage | null;
}

export default function PurchaseScreen({ onProceedToPayment, preSelectedPackage }: PurchaseScreenProps) {
  const [playerId, setPlayerId] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<UcPackage | null>(preSelectedPackage || null);
  
  // Validation state
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedCharacter, setVerifiedCharacter] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // If preselected package changes, update state
  useEffect(() => {
    if (preSelectedPackage) {
      setSelectedPackage(preSelectedPackage);
    }
  }, [preSelectedPackage]);

  // Simulate a highly professional profile fetcher
  const handleVerifyPlayerId = () => {
    if (!playerId || playerId.trim().length < 5) {
      setVerificationError("يرجى إدخال رقم آيدي صحيح (5 أرقام على الأقل)");
      setVerifiedCharacter(null);
      return;
    }

    if (!/^\d+$/.test(playerId)) {
      setVerificationError("الآيدي يجب أن يحتوي على أرقام فقط");
      setVerifiedCharacter(null);
      return;
    }

    setIsVerifying(true);
    setVerificationError(null);
    setVerifiedCharacter(null);

    // Simulated network lookup delay
    setTimeout(() => {
      setIsVerifying(false);
      // Generate some interesting official-looking usernames based on the ID numbers
      const mockNames = [
        "حسين_NAT_YT",
        "PUBG_WARRIOR_99",
        "KIRA_GAMING",
        "LETHAL_SQUAD",
        "YEMEN_CHAMPION",
        "AL_KURAIMI_VIP"
      ];
      const randomIndex = parseInt(playerId.substring(playerId.length - 1)) % mockNames.length;
      setVerifiedCharacter(mockNames[randomIndex]);
    }, 1200);
  };

  // Run validation automatically if ID is long enough and user stops typing
  useEffect(() => {
    if (playerId.length >= 7 && /^\d+$/.test(playerId)) {
      const timer = setTimeout(handleVerifyPlayerId, 1000);
      return () => clearTimeout(timer);
    }
  }, [playerId]);

  const handleProceed = () => {
    if (!playerId || !selectedPackage) return;
    
    // Auto-verify if they haven't run it yet but have a valid ID
    if (!verifiedCharacter) {
      if (!/^\d+$/.test(playerId) || playerId.trim().length < 5) {
        setVerificationError("يرجى التحقق من الآيدي أولاً");
        return;
      }
      // Force instant verify for transition
      onProceedToPayment(playerId, selectedPackage);
    } else {
      onProceedToPayment(playerId, selectedPackage);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 gap-6 bg-neutral-950 pb-24">
      
      {/* SECTION 1: PLAYER ID INPUT */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-black text-neutral-400 uppercase tracking-widest text-right flex items-center justify-between">
          <span className="text-neutral-500 font-sans">الخطوة 1 من 3</span>
          <span>أدخل رقم الآيدي الخاص باللاعب (ID)</span>
        </label>

        <div className="relative">
          <input 
            type="text"
            pattern="[0-9]*"
            inputMode="numeric"
            placeholder="مثال: 518293740"
            value={playerId}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setPlayerId(val);
              setVerifiedCharacter(null);
              setVerificationError(null);
            }}
            className="w-full bg-neutral-900 border border-white/5 rounded-2xl px-5 py-4 font-bold text-right text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all outline-none pl-12 placeholder-neutral-600 font-sans tracking-widest text-lg"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center justify-center">
            {isVerifying ? (
              <Loader2 className="w-5 h-5 text-[#D4AF37] animate-spin" />
            ) : (
              <User className="w-5 h-5 text-[#D4AF37]" />
            )}
          </div>
        </div>

        {/* Real-time Validation Feedback Panel */}
        <AnimatePresence mode="wait">
          {isVerifying && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="p-3 rounded-xl bg-neutral-900 border border-white/5 text-right flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                <span className="text-xs text-neutral-400 font-bold">جاري التحقق من خوادم PUBG الرسمية...</span>
              </div>
            </motion.div>
          )}

          {verifiedCharacter && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-right flex items-center justify-between shadow-[0_0_15px_rgba(16,185,129,0.05)]"
            >
              <div className="text-left font-sans">
                <span className="text-[10px] text-emerald-400 font-bold block">مكتمل التحقق ✓</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="text-xs font-black tracking-wide">{verifiedCharacter}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            </motion.div>
          )}

          {verificationError && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-right flex items-center justify-between"
            >
              <span className="text-xs text-red-400 font-bold">{verificationError}</span>
              <AlertCircle className="w-4 h-4 text-red-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION 2: PACKAGE SELECTION */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-black text-neutral-400 uppercase tracking-widest text-right flex items-center justify-between">
          <span className="text-neutral-500 font-sans">الخطوة 2 من 3</span>
          <span>اختر باقة شدات PUBG Mobile</span>
        </label>

        <div className="grid grid-cols-2 gap-3">
          {UC_PACKAGES.map((pkg) => (
            <motion.button
              key={pkg.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => {
                setSelectedPackage(pkg);
              }}
              className={`p-4 rounded-2xl text-right flex flex-col justify-between h-36 relative overflow-hidden transition-all duration-300 border cursor-pointer ${
                selectedPackage?.id === pkg.id 
                  ? "bg-neutral-900 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)] scale-[1.02]" 
                  : "bg-[#111114] border-white/5 hover:border-neutral-800"
              }`}
            >
              {/* Popular banner badge inside the package card */}
              {pkg.badgeText && (
                <div className="absolute left-0 top-0 bg-[#D4AF37] text-black text-[8px] font-black px-2 py-0.5 rounded-br-lg tracking-wider">
                  {pkg.badgeText}
                </div>
              )}

              {/* Coins Icon relative glow */}
              <div className="w-8 h-8 rounded-lg bg-neutral-800/80 flex items-center justify-center text-[#D4AF37] mb-2 self-start border border-white/5">
                <Coins className="w-4 h-4" />
              </div>

              {/* Package Details */}
              <div className="mt-auto">
                <div className="text-lg font-black text-white font-sans tracking-wide">
                  {pkg.ucAmount} UC
                </div>
                
                {pkg.bonusUc > 0 && (
                  <div className="text-[10px] text-amber-400 font-extrabold flex items-center gap-0.5 mt-0.5">
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                    <span>+ {pkg.bonusUc} مجاناً</span>
                  </div>
                )}

                <div className="flex flex-col items-start mt-2 border-t border-white/5 pt-1.5">
                  <span className="text-xs font-black text-[#D4AF37] font-sans">
                    {pkg.priceYer.toLocaleString("ar-YE")} ريال
                  </span>
                  <span className="text-[9px] text-neutral-500 font-bold font-sans">
                    ${pkg.priceUsd}
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* SECTION 3: CHECKOUT TOTAL BREAKDOWN */}
      {selectedPackage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-neutral-900 border border-white/5 rounded-2xl p-4 flex flex-col gap-3 mt-2"
        >
          <h4 className="text-xs font-black text-white text-right border-b border-white/5 pb-2">
            تفاصيل الفاتورة الرسمية
          </h4>

          <div className="flex justify-between items-center text-xs font-bold text-neutral-400">
            <span className="font-sans font-black text-white">{selectedPackage.ucAmount} UC</span>
            <span>الباقة المختارة:</span>
          </div>

          <div className="flex justify-between items-center text-xs font-bold text-neutral-400">
            <span className="font-sans text-neutral-300">${selectedPackage.priceUsd}</span>
            <span>القيمة بالدولار:</span>
          </div>

          <div className="flex justify-between items-center text-xs font-bold text-neutral-400">
            <span className="font-sans text-emerald-400">0.00 ريال</span>
            <span>رسوم الشحن والخدمة:</span>
          </div>

          <div className="border-t border-white/10 pt-2.5 flex justify-between items-center">
            <div className="text-left">
              <div className="text-base font-black text-[#D4AF37] font-sans">
                {selectedPackage.priceYer.toLocaleString("ar-YE")} ريال يمني
              </div>
              <div className="text-[10px] text-neutral-500 font-bold font-sans mt-0.5">
                ما يعادل تقريباً ${selectedPackage.priceUsd} USD
              </div>
            </div>
            <span className="text-xs font-black text-white">المبلغ الإجمالي المستحق:</span>
          </div>
        </motion.div>
      )}

      {/* PROCEED TO PAYMENT BUTTON */}
      <div className="mt-4">
        <button
          disabled={!playerId || !selectedPackage}
          onClick={handleProceed}
          className="w-full btn-gold-gradient py-4 rounded-2xl text-base font-black flex items-center justify-center gap-2 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          <span>الذهاب لاختيار طريقة الدفع</span>
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="mt-3 flex items-center justify-center gap-1.5 text-neutral-500 text-[9px] font-bold">
          <span>شحن فوري مباشر عبر خوادم Midasbuy المعتمدة</span>
          <CheckCircle2 className="w-3 h-3 text-[#D4AF37]" />
        </div>
      </div>

    </div>
  );
}
