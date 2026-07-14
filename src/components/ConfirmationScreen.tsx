import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  MessageCircle, 
  Home, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Loader2
} from "lucide-react";
import { Order } from "../types";
import { CONTACT_INFO } from "../data";

interface ConfirmationScreenProps {
  order: Order;
  onNavigate: (screen: string) => void;
}

export default function ConfirmationScreen({ order, onNavigate }: ConfirmationScreenProps) {
  const [currentOrder, setCurrentOrder] = useState<Order>(order);
  const [copied, setCopied] = useState(false);
  const [isPolling, setIsPolling] = useState(true);

  // Poll for simulated background order delivery
  useEffect(() => {
    if (!isPolling) return;
    if (currentOrder.status === "completed" || currentOrder.status === "cancelled") {
      setIsPolling(false);
      return;
    }

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/orders/${currentOrder.id}`);
        if (response.ok) {
          const freshOrder = await response.json();
          setCurrentOrder(freshOrder);
          if (freshOrder.status === "completed" || freshOrder.status === "cancelled") {
            setIsPolling(false);
            clearInterval(pollInterval);
          }
        }
      } catch (error) {
        console.error("Error polling order:", error);
      }
    }, 4000); // Poll every 4 seconds for high responsiveness

    return () => clearInterval(pollInterval);
  }, [currentOrder.id, currentOrder.status, isPolling]);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(currentOrder.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Status mapping to Arabic names, colors, and step progress index
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          title: "قيد المراجعة والتحقق",
          color: "text-amber-500",
          bgColor: "bg-amber-500/10",
          borderColor: "border-amber-500/30",
          stepIndex: 1,
        };
      case "processing":
        return {
          title: "جاري شحن الشدات بالآيدي",
          color: "text-cyan-400",
          bgColor: "bg-cyan-500/10",
          borderColor: "border-cyan-500/30",
          stepIndex: 2,
        };
      case "completed":
        return {
          title: "تم الشحن بنجاح ✓",
          color: "text-emerald-400",
          bgColor: "bg-emerald-500/10",
          borderColor: "border-emerald-500/30",
          stepIndex: 3,
        };
      default:
        return {
          title: "طلب ملغي",
          color: "text-neutral-500",
          bgColor: "bg-neutral-500/10",
          borderColor: "border-neutral-500/30",
          stepIndex: 0,
        };
    }
  };

  const statusConfig = getStatusConfig(currentOrder.status);

  // Generate WhatsApp support message prefilled with order details
  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp1}?text=${encodeURIComponent(
    `مرحباً متجر حسين NAT، أود الاستفسار عن طلب الشحن الخاص بي:\n- رقم الطلب: ${currentOrder.id}\n- آيدي اللاعب: ${currentOrder.playerId}\n- الباقة: ${currentOrder.packageName}`
  )}`;

  return (
    <div className="flex-1 flex flex-col p-4 gap-6 bg-neutral-950 pb-24">
      
      {/* BIG GOLD SUCCESS HERO */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center text-center py-6 gap-3 select-none"
      >
        <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)] animate-pulse">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        
        <div>
          <h2 className="text-xl font-black text-white">تم إرسال طلبك بنجاح!</h2>
          <p className="text-[11px] text-[#D4AF37] font-bold mt-1">
            جاري التجهيز والشحن التلقائي فوراً بالآيدي
          </p>
        </div>
      </motion.div>

      {/* TICKET RECEIPT CARDS */}
      <div className="bg-[#111114] border border-white/5 rounded-2xl p-5 flex flex-col gap-4 text-right shadow-xl relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1.5 w-10 h-3 bg-neutral-950 rounded-full border border-white/5" />
        
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <button
            onClick={handleCopyOrderId}
            className="p-1.5 rounded-lg bg-neutral-900 border border-white/10 text-[#D4AF37] hover:bg-neutral-800 transition-colors flex items-center gap-1.5 text-[10px] cursor-pointer"
          >
            {copied ? (
              <>
                <span>نسخ</span>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              </>
            ) : (
              <>
                <span>نسخ الرقم</span>
                <Copy className="w-3.5 h-3.5" />
              </>
            )}
          </button>
          
          <div>
            <span className="text-[10px] text-neutral-500 font-bold block leading-none">رقم الفاتورة والطلب:</span>
            <span className="text-sm font-black font-sans text-white tracking-wider block mt-1">{currentOrder.id}</span>
          </div>
        </div>

        {/* Breakdown details */}
        <div className="flex flex-col gap-2.5 text-xs">
          <div className="flex justify-between font-bold">
            <span className="font-sans text-neutral-300">{currentOrder.playerId}</span>
            <span className="text-neutral-400">آيدي اللاعب (ID):</span>
          </div>

          <div className="flex justify-between font-bold">
            <span className="text-white font-sans">{currentOrder.packageName}</span>
            <span className="text-neutral-400">الباقة المطلوبة:</span>
          </div>

          <div className="flex justify-between font-bold">
            <span className="text-[#D4AF37] font-sans">
              {currentOrder.priceYer.toLocaleString("ar-YE")} ريال
            </span>
            <span className="text-neutral-400">المبلغ المدفوع:</span>
          </div>

          <div className="flex justify-between font-bold">
            <span className="text-neutral-300">
              {currentOrder.paymentMethod === "credit_card" ? "بطاقة ائتمانية" : 
               currentOrder.paymentMethod === "bank_transfer" ? "تحويل بنكي" : "دفع نقدي كاش"}
            </span>
            <span className="text-neutral-400">طريقة الدفع:</span>
          </div>

          <div className="flex justify-between font-bold border-t border-white/5 pt-2.5 mt-1">
            <div className="flex items-center gap-1">
              {isPolling && <Loader2 className="w-3 h-3 text-[#D4AF37] animate-spin" />}
              <span className={`font-sans font-black px-2 py-0.5 rounded ${statusConfig.bgColor} ${statusConfig.color}`}>
                {statusConfig.title}
              </span>
            </div>
            <span className="text-neutral-400 font-black">حالة الشحن الآن:</span>
          </div>
        </div>
      </div>

      {/* TIMELINE PROGRESS STEPPER */}
      <div className="bg-neutral-900/30 border border-white/5 rounded-2xl p-4 flex flex-col gap-4 text-right">
        <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest border-b border-white/5 pb-2">
          مراحل معالجة طلب الشحن التلقائي
        </h3>

        <div className="relative pl-2">
          {/* vertical connector line */}
          <div className="absolute right-3.5 top-3.5 bottom-3.5 w-[2px] bg-neutral-800" />
          
          <div className="flex flex-col gap-5">
            {/* Step 1: Received */}
            <div className="flex items-start gap-3 relative justify-end">
              <div className="text-right">
                <h4 className="text-xs font-black text-white">تم استلام طلب الشحن والفاتورة</h4>
                <p className="text-[9px] text-neutral-500 mt-0.5">تم تسجيل الطلب في النظام الرئيسي بنجاح</p>
              </div>
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center font-sans text-xs font-bold z-10">
                ✓
              </div>
            </div>

            {/* Step 2: Processing */}
            <div className="flex items-start gap-3 relative justify-end">
              <div className="text-right">
                <h4 className={`text-xs font-black ${statusConfig.stepIndex >= 2 ? "text-white" : "text-neutral-500"}`}>
                  مراجعة الفاتورة والموافقة الرسمية
                </h4>
                <p className="text-[9px] text-neutral-500 mt-0.5">مطابقة بيانات الدفع عبر وكيل التحصيل المعتمد</p>
              </div>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-sans text-xs font-bold z-10 transition-all ${
                statusConfig.stepIndex >= 2 
                  ? "bg-emerald-500/20 border border-emerald-500 text-emerald-400" 
                  : statusConfig.stepIndex === 1 
                    ? "bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] animate-pulse" 
                    : "bg-neutral-900 border border-neutral-800 text-neutral-600"
              }`}>
                {statusConfig.stepIndex >= 2 ? "✓" : "2"}
              </div>
            </div>

            {/* Step 3: Completed */}
            <div className="flex items-start gap-3 relative justify-end">
              <div className="text-right">
                <h4 className={`text-xs font-black ${statusConfig.stepIndex === 3 ? "text-white" : "text-neutral-500"}`}>
                  توصيل الشدات لحسابك ببجي (Midasbuy)
                </h4>
                <p className="text-[9px] text-neutral-500 mt-0.5">إرسال الشدات مباشرة بالآيدي وتحديث اللعبة</p>
              </div>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-sans text-xs font-bold z-10 transition-all ${
                statusConfig.stepIndex === 3 
                  ? "bg-emerald-500/20 border border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                  : statusConfig.stepIndex === 2 
                    ? "bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] animate-pulse" 
                    : "bg-neutral-900 border border-neutral-800 text-neutral-600"
              }`}>
                {statusConfig.stepIndex === 3 ? "✓" : "3"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CORE CONTROL ACTIONS */}
      <div className="flex flex-col gap-3 mt-2">
        {/* Support Link */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#25D366] text-white py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer hover:bg-emerald-600 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span>تواصل مع الدعم الفني لتأكيد أسرع</span>
        </a>

        {/* Back to Home */}
        <button
          onClick={() => onNavigate("home")}
          className="w-full bg-neutral-900 border border-white/5 hover:border-amber-500/30 text-white py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Home className="w-4 h-4 text-[#D4AF37]" />
          <span>العودة للرئيسية</span>
        </button>
      </div>

    </div>
  );
}
