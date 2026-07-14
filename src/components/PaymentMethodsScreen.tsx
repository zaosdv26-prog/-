import React, { useState } from "react";
import { 
  Building2, 
  CreditCard, 
  UserSquare2, 
  CheckCircle2, 
  Copy, 
  Check, 
  MapPin,
  Clock,
  HelpCircle,
  Smartphone
} from "lucide-react";
import { YEMEN_BANKS } from "../data";

export default function PaymentMethodsScreen() {
  const [copyStates, setCopyStates] = useState<{ [key: string]: boolean }>({});

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopyStates({ ...copyStates, [key]: true });
    setTimeout(() => {
      setCopyStates({ ...copyStates, [key]: false });
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col p-4 gap-6 bg-neutral-950 pb-24 text-right">
      
      {/* Introduction Badge */}
      <div className="text-center py-2 select-none">
        <h2 className="text-lg font-black text-white text-gold-gradient">طرق الدفع الرسمية والمعتمدة</h2>
        <p className="text-[10px] text-neutral-400 mt-1 leading-relaxed max-w-[280px] mx-auto">
          يوفر متجر حسين NAT قنوات دفع يمنية وعالمية مريحة لتسهيل عملية الشحن الفوري بأعلى معايير الأمان.
        </p>
      </div>

      {/* 1. BANK TRANSFER METHOD */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest flex items-center justify-end gap-1.5 border-b border-[#D4AF37]/15 pb-2.5">
          الحوالات البنكية ومحافظ الجوال المحلية
          <Building2 className="w-4 h-4 text-[#D4AF37]" />
        </h3>

        <div className="flex flex-col gap-3">
          {YEMEN_BANKS.map((bank, idx) => (
            <div 
              key={idx}
              className="p-3.5 rounded-2xl bg-[#111114] border border-white/5 flex flex-col gap-2 relative overflow-hidden group"
            >
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleCopy(bank.accountNo, bank.name)}
                  className="p-1.5 rounded-lg bg-neutral-900 border border-white/10 text-[#D4AF37] hover:bg-neutral-800 transition-colors flex items-center gap-1.5 text-[10px] cursor-pointer"
                >
                  {copyStates[bank.name] ? (
                    <>
                      <span>تم النسخ</span>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    </>
                  ) : (
                    <>
                      <span>نسخ الرقم</span>
                      <Copy className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white">{bank.name}</span>
                  <span className="text-base">{bank.logo}</span>
                </div>
              </div>

              <div className="text-[11px] font-sans font-bold text-[#D4AF37] tracking-wider mt-1">
                رقم الحساب: {bank.accountNo}
              </div>
              <div className="text-[9px] text-neutral-500 font-bold">
                اسم المستفيد: {bank.accountHolder}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. CREDIT CARD INFO */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest flex items-center justify-end gap-1.5 border-b border-[#D4AF37]/15 pb-2.5">
          البطاقات الائتمانية الدولية والمحلية
          <CreditCard className="w-4 h-4 text-[#D4AF37]" />
        </h3>

        <div className="p-4 rounded-2xl bg-[#111114] border border-white/5 flex gap-3 text-right">
          <div className="flex-1">
            <h4 className="text-xs font-extrabold text-white">فيزا، ماستر كارد، بطاقات كاش</h4>
            <p className="text-[10px] text-neutral-400 leading-relaxed mt-1">
              ندعم الدفع المباشر والآمن بواسطة بطاقات Visa و MasterCard والبطاقات الافتراضية الصادرة عن البنوك اليمنية المختلفة بخصم فوري وتعميد فوري لطلبك في خادم ببجي.
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-amber-500 self-start">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. CASH PAYMENT INFO */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest flex items-center justify-end gap-1.5 border-b border-[#D4AF37]/15 pb-2.5">
          التسليم النقدي المباشر كاش
          <UserSquare2 className="w-4 h-4 text-[#D4AF37]" />
        </h3>

        <div className="p-4 rounded-2xl bg-[#111114] border border-white/5 flex flex-col gap-3 text-right">
          <div className="flex gap-3">
            <div className="flex-1">
              <h4 className="text-xs font-extrabold text-white">زيارة مقر وكالتنا الرئيسي</h4>
              <p className="text-[10px] text-neutral-400 leading-relaxed mt-1">
                يمكنك تسليم مبالغ الشحن يدوياً ونقداً مباشرة في مقر صالتنا المعتمدة وسيقوم الموظف بتفعيل حسابك فورا.
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-amber-500 self-start">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          
          <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 text-[9px] text-neutral-400 flex flex-col gap-1.5 font-sans">
            <div className="flex justify-between items-center font-bold">
              <span className="text-[#D4AF37] font-black">بقالة الهلال - بجوار مستشفى الهلال التخصصي</span>
              <span className="text-white">العنوان:</span>
            </div>
            <div className="flex justify-between items-center font-bold">
              <span className="text-[#D4AF37] font-black">من 8:00 صباحاً وحتى 11:30 مساءً</span>
              <span className="text-white">أوقات العمل:</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secure badges */}
      <div className="bg-neutral-900/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-2 items-center text-center select-none">
        <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-400">
          <span>نظام تحصيل رسمي وآمن 100%</span>
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <p className="text-[9px] text-neutral-500 leading-relaxed max-w-[250px]">
          يتم مراجعة وتعميد الحوالات تلقائياً بالتنسيق مع موقع Midasbuy لضمان وصول الشدات لحسابك دون أي تأخير أو عمولات إضافية.
        </p>
      </div>

    </div>
  );
}
