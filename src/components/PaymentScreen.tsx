import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CreditCard, 
  Building2, 
  UserSquare2, 
  Copy, 
  Check, 
  Loader2, 
  ShieldCheck, 
  HelpCircle,
  QrCode,
  Smartphone,
  ChevronLeft
} from "lucide-react";
import { UcPackage, PaymentMethodType } from "../types";
import { YEMEN_BANKS } from "../data";

interface PaymentScreenProps {
  playerId: string;
  selectedPackage: UcPackage;
  onOrderSuccess: (order: any) => void;
  onBackToPurchase: () => void;
}

export default function PaymentScreen({ 
  playerId, 
  selectedPackage, 
  onOrderSuccess,
  onBackToPurchase 
}: PaymentScreenProps) {
  const [activeTab, setActiveTab] = useState<PaymentMethodType>("bank_transfer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copyStates, setCopyStates] = useState<{ [key: string]: boolean }>({});

  // Credit Card Form State
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Bank Transfer Form State
  const [selectedBank, setSelectedBank] = useState(YEMEN_BANKS[0].name);
  const [transferNo, setTransferNo] = useState("");
  const [senderName, setSenderName] = useState("");

  // Cash Request Form State
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [agentName, setAgentName] = useState("ون كاش (One Cash)");

  const handleCopyAccount = (accountNo: string, name: string) => {
    navigator.clipboard.writeText(accountNo);
    setCopyStates({ ...copyStates, [name]: true });
    setTimeout(() => {
      setCopyStates({ ...copyStates, [name]: false });
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const handleExpiryChange = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let paymentDetails: any = {};

    if (activeTab === "credit_card") {
      paymentDetails = {
        cardHolder,
        cardNumber: `**** **** **** ${cardNumber.slice(-4)}`,
        last4: cardNumber.slice(-4)
      };
    } else if (activeTab === "bank_transfer") {
      paymentDetails = {
        bankName: selectedBank,
        transferNo,
        senderName
      };
    } else if (activeTab === "cash") {
      paymentDetails = {
        contactName,
        contactPhone,
        agentName
      };
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId,
          packageName: `${selectedPackage.ucAmount} UC ${selectedPackage.bonusUc > 0 ? `+ ${selectedPackage.bonusUc} مجاناً` : ""}`,
          packageUc: selectedPackage.ucAmount + selectedPackage.bonusUc,
          priceUsd: selectedPackage.priceUsd,
          priceYer: selectedPackage.priceYer,
          paymentMethod: activeTab,
          paymentDetails
        })
      });

      if (!response.ok) {
        throw new Error("Failed to submit order");
      }

      const orderData = await response.json();
      setTimeout(() => {
        setIsSubmitting(false);
        onOrderSuccess(orderData);
      }, 1500); // Elegant simulated network wait
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      alert("حدث خطأ أثناء إرسال طلب الشحن. يرجى المحاولة لاحقاً.");
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 gap-6 bg-neutral-950 pb-24">
      
      {/* Mini Checkout Info Header */}
      <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-3 flex justify-between items-center text-right text-xs">
        <button 
          onClick={onBackToPurchase}
          className="text-[#D4AF37] font-black text-xs cursor-pointer hover:underline"
        >
          تعديل الباقة
        </button>
        <div>
          <div className="font-sans font-black text-white">
            {selectedPackage.ucAmount} UC (+ {selectedPackage.bonusUc} مجاناً)
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">
            للاعب الآيدي: <span className="font-sans font-bold text-[#D4AF37]">{playerId}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-black text-neutral-400 uppercase tracking-widest text-right flex justify-between">
          <span className="text-neutral-500 font-sans">الخطوة 3 من 3</span>
          <span>اختر طريقة الدفع المناسبة</span>
        </label>

        <div className="flex p-1 bg-neutral-900 rounded-2xl border border-white/5 text-xs font-bold text-center">
          {/* Credit Card Tab */}
          <button 
            type="button"
            onClick={() => setActiveTab("credit_card")}
            className={`flex-1 py-3 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === "credit_card" 
                ? "bg-neutral-800 text-[#D4AF37] border border-[#D4AF37]/30 shadow-md" 
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>فيزا / ماستر</span>
          </button>

          {/* Bank Transfer Tab */}
          <button 
            type="button"
            onClick={() => setActiveTab("bank_transfer")}
            className={`flex-1 py-3 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === "bank_transfer" 
                ? "bg-neutral-800 text-[#D4AF37] border border-[#D4AF37]/30 shadow-md" 
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>حوالة بنكية</span>
          </button>

          {/* Cash Request Tab */}
          <button 
            type="button"
            onClick={() => setActiveTab("cash")}
            className={`flex-1 py-3 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === "cash" 
                ? "bg-neutral-800 text-[#D4AF37] border border-[#D4AF37]/30 shadow-md" 
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <UserSquare2 className="w-4 h-4" />
            <span>طلب كاش</span>
          </button>
        </div>
      </div>

      {/* Dynamic forms based on tabs */}
      <form onSubmit={handleSubmitOrder} className="flex-1 flex flex-col gap-6">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: CREDIT CARD */}
          {activeTab === "credit_card" && (
            <motion.div
              key="credit_card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-4 text-right"
            >
              <div className="bg-gradient-to-tr from-[#1b1b1f] to-neutral-900 border border-[#D4AF37]/20 rounded-2xl p-4 flex flex-col gap-1 shadow-inner relative overflow-hidden select-none">
                <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#D4AF37]/5 rounded-tl-full" />
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-6 bg-gradient-to-r from-amber-200 to-[#D4AF37] rounded-sm flex items-center justify-center opacity-80" />
                  <span className="text-[10px] text-[#D4AF37] font-black uppercase tracking-wider">حسين NAT الرسمي</span>
                </div>
                <div className="text-lg font-bold tracking-widest font-sans text-white h-7">
                  {cardNumber || "•••• •••• •••• ••••"}
                </div>
                <div className="flex justify-between items-center mt-6 text-[10px] text-neutral-400 font-sans">
                  <span>CVV: {cvv || "•••"}</span>
                  <span>EXP: {expiry || "MM/YY"}</span>
                  <span className="font-sans font-bold text-white uppercase">{cardHolder || "NAME SURNAME"}</span>
                </div>
              </div>

              {/* Cardholder Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-neutral-400">اسم صاحب البطاقة</label>
                <input 
                  type="text" 
                  placeholder="مثال: ALI AHMED"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                  className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-3.5 text-xs text-white text-right font-sans tracking-wide focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none placeholder-neutral-700"
                />
              </div>

              {/* Card Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-neutral-400">رقم البطاقة الائتمانية</label>
                <input 
                  type="text" 
                  maxLength={19}
                  placeholder="4000 1234 5678 9010"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-3.5 text-xs text-white text-right font-sans tracking-widest focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none placeholder-neutral-700 text-left"
                />
              </div>

              {/* Expiry and CVV Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5 text-right">
                  <label className="text-[11px] font-black text-neutral-400">الرمز السري (CVV)</label>
                  <input 
                    type="password" 
                    maxLength={3}
                    placeholder="123"
                    required
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-3.5 text-xs text-white text-center font-sans tracking-widest focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none placeholder-neutral-700"
                  />
                </div>

                <div className="flex flex-col gap-1.5 text-right">
                  <label className="text-[11px] font-black text-neutral-400">تاريخ الانتهاء</label>
                  <input 
                    type="text" 
                    maxLength={5}
                    placeholder="MM/YY"
                    required
                    value={expiry}
                    onChange={(e) => setExpiry(handleExpiryChange(e.target.value))}
                    className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-3.5 text-xs text-white text-center font-sans tracking-widest focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none placeholder-neutral-700"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: BANK TRANSFER */}
          {activeTab === "bank_transfer" && (
            <motion.div
              key="bank_transfer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-4 text-right"
            >
              <div className="bg-[#111114] border border-white/5 rounded-2xl p-4 flex flex-col gap-3.5">
                <h4 className="text-xs font-black text-[#D4AF37] border-b border-white/5 pb-2">
                  تعليمات الحوالة وحساباتنا المعتمدة:
                </h4>
                
                {/* Banks accounts list */}
                <div className="flex flex-col gap-2.5">
                  {YEMEN_BANKS.map((bank, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between"
                    >
                      <button
                        type="button"
                        onClick={() => handleCopyAccount(bank.accountNo, bank.name)}
                        className="p-2 rounded-lg bg-neutral-900 border border-white/10 text-[#D4AF37] hover:bg-neutral-800 transition-colors flex items-center gap-1.5 text-[10px] cursor-pointer font-black"
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

                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="text-xs font-black text-white">{bank.name}</span>
                          <span className="text-base">{bank.logo}</span>
                        </div>
                        <div className="text-[11px] font-sans font-bold text-[#D4AF37] mt-0.5 tracking-wider">
                          رقم الحساب: {bank.accountNo}
                        </div>
                        <div className="text-[8px] text-neutral-500 mt-0.5">
                          الاسم: {bank.accountHolder}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <p className="text-[9px] text-neutral-400 leading-relaxed border-t border-white/5 pt-2">
                  💡 قم بتحويل مبلغ الباقة الإجمالي إلى أي من الحسابات أعلاه، ثم املأ البيانات التالية لتأكيد عمليتك وبدء الشحن التلقائي فوراً.
                </p>
              </div>

              {/* Bank Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-neutral-400">البنك المحول إليه</label>
                <select 
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-3.5 text-xs text-white text-right focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none cursor-pointer"
                >
                  {YEMEN_BANKS.map((b, idx) => (
                    <option key={idx} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>

              {/* Transfer Receipt Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-neutral-400">رقم الحوالة / رقم السند أو الإرسالية</label>
                <input 
                  type="text" 
                  placeholder="مثال: 88301492"
                  required
                  value={transferNo}
                  onChange={(e) => setTransferNo(e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-3.5 text-xs text-white text-right font-sans focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none placeholder-neutral-700"
                />
              </div>

              {/* Sender Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-neutral-400">اسم المودع / الشخص المحول بالكامل</label>
                <input 
                  type="text" 
                  placeholder="مثال: أحمد عبد الله المحسن"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-3.5 text-xs text-white text-right focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none placeholder-neutral-700"
                />
              </div>
            </motion.div>
          )}

          {/* TAB 3: CASH REQUEST */}
          {activeTab === "cash" && (
            <motion.div
              key="cash"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-4 text-right"
            >
              <div className="bg-[#111114] border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
                <h4 className="text-xs font-black text-[#D4AF37] border-b border-white/5 pb-2 flex items-center justify-end gap-1.5">
                  طلب دفع نقدي (كاش) مع الوكيل
                </h4>
                <p className="text-[10px] text-neutral-400 leading-relaxed">
                  إذا لم تكن تمتلك حساباً بنكياً، يمكنك إنشاء طلب دفع نقدي والتنسيق معنا لتسليم المبلغ كاش من خلال أقرب صراف صرافة أو وكيل One Cash أو التنسيق المباشر.
                </p>
                <div className="mt-2 text-[9px] text-[#D4AF37] font-bold">
                  📍 بقالة الهلال - بجانب مستشفى الهلال التخصصي، صنعاء
                </div>
              </div>

              {/* Agent selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-neutral-400">شبكة الدفع أو الصراف المعتمد</label>
                <select 
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-3.5 text-xs text-white text-right focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none cursor-pointer"
                >
                  <option value="ون كاش (One Cash)">ون كاش (One Cash) - وكيل معتمد</option>
                  <option value="الكريمي إكسبرس">الكريمي إكسبرس</option>
                  <option value="صرافة النجم">صرافة النجم</option>
                  <option value="تسليم يدوي بمقر المحل">تسليم يدوي بمقر المحل مباشرة</option>
                </select>
              </div>

              {/* Your Contact Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-neutral-400">اسمك بالكامل (للتنسيق)</label>
                <input 
                  type="text" 
                  placeholder="مثال: يوسف اليافعي"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-3.5 text-xs text-white text-right focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none placeholder-neutral-700"
                />
              </div>

              {/* Contact Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-neutral-400">رقم هاتفك للتواصل والتأكيد</label>
                <input 
                  type="text" 
                  placeholder="مثال: 771234567"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-3.5 text-xs text-white text-right font-sans focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none placeholder-neutral-700"
                />
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* SECURE CHECKOUT SUBMISSION BAR */}
        <div className="mt-auto pt-6 border-t border-white/5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-gold-gradient py-4 rounded-2xl text-base font-black flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>جاري معالجة وإرسال طلبك...</span>
              </>
            ) : (
              <>
                <span>تأكيد وإرسال طلب الشحن ⚡</span>
                <ChevronLeft className="w-5 h-5" />
              </>
            )}
          </button>

          <div className="mt-4 flex items-center justify-center gap-2 text-neutral-400 text-[10px] font-bold">
            <span>تشفير اتصالات آمن 256-Bit • حماية تامة للبيانات</span>
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
          </div>
        </div>
      </form>
      
    </div>
  );
}
