import React, { useState, useEffect } from "react";
import { 
  Wifi, 
  Battery, 
  Signal, 
  ChevronRight, 
  Home, 
  Search, 
  HelpCircle, 
  CreditCard,
  User,
  Smartphone,
  Phone,
  MessageSquare
} from "lucide-react";

interface PhoneFrameProps {
  children: React.ReactNode;
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBack: (() => void) | null;
  title?: string;
  showBottomNav?: boolean;
  showHeader?: boolean;
}

export default function PhoneFrame({ 
  children, 
  currentScreen, 
  onNavigate, 
  onBack,
  title,
  showBottomNav = true,
  showHeader = true
}: PhoneFrameProps) {

  const [time, setTime] = useState("");

  // Digital clock update
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "م" : "ص";
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-0 sm:p-6 overflow-x-hidden relative">
      {/* Decorative luxury backgrounds */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-yellow-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      
      {/* Phone chassis */}
      <div className="w-full sm:w-[412px] h-screen sm:h-[840px] bg-neutral-950 sm:rounded-[40px] border-0 sm:border-8 border-[#D4AF37]/30 shadow-2xl relative flex flex-col overflow-hidden sm:shadow-[0_0_50px_rgba(212,175,55,0.15)]">
        
        {/* Dynamic Island / Notch on desktop */}
        <div className="hidden sm:block absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-[100] flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-neutral-900 rounded-full mr-2" />
          <div className="w-12 h-1 bg-neutral-900 rounded-full" />
        </div>

        {/* TOP STATUS BAR (Simulating Android) */}
        {currentScreen !== "splash" && (
          <div className="h-10 bg-neutral-950 px-5 flex items-center justify-between text-neutral-300 text-xs font-medium z-50 select-none border-b border-white/5 pt-1">
            {/* Clock */}
            <div className="font-bold font-sans tracking-wide">{time}</div>
            
            {/* Camera cutout spacing for notch on mobile if no dynamic island */}
            <div className="w-4 h-4 bg-transparent" />
            
            {/* Battery, Wifi, cellular bars */}
            <div className="flex items-center gap-1.5 font-sans">
              <Signal className="w-3.5 h-3.5 text-amber-500" />
              <Wifi className="w-3.5 h-3.5 text-amber-500" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] text-neutral-400">98%</span>
                <Battery className="w-4 h-4 text-[#D4AF37] rotate-180" />
              </div>
            </div>
          </div>
        )}

        {/* APP HEADER */}
        {currentScreen !== "splash" && showHeader && (
          <div className="h-14 bg-neutral-950 px-4 flex items-center justify-between border-b border-white/5 z-40 select-none relative">
            <div className="flex items-center gap-2">
              {onBack ? (
                <button 
                  onClick={onBack}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-neutral-900 border border-white/10 hover:border-amber-500/50 text-[#D4AF37] active:scale-95 transition-all cursor-pointer"
                  dir="rtl"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                  <span className="text-[#D4AF37] font-black text-sm">NAT</span>
                </div>
              )}
              
              <div className="text-right">
                <h1 className="text-base font-extrabold text-white leading-tight">
                  {title || "حسين NAT"}
                </h1>
                {!onBack && (
                  <span className="text-[9px] text-[#D4AF37] font-bold block leading-none">
                    الموزع المعتمد لشدات ببجي
                  </span>
                )}
              </div>
            </div>

            {/* Quick Actions at top corner */}
            <div className="flex items-center gap-1">
              <button 
                onClick={() => onNavigate("contact")}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-neutral-900 border border-white/10 text-amber-500 hover:bg-neutral-800 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SCREEN SCROLLABLE VIEWPORT */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col bg-neutral-950 relative">
          {children}
        </div>

        {/* BOTTOM NAVIGATION BAR */}
        {currentScreen !== "splash" && showBottomNav && (
          <div className="h-16 bg-neutral-950/95 backdrop-blur-md border-t border-white/5 px-4 flex items-center justify-around text-neutral-400 text-[10px] font-bold z-50 select-none">
            <button 
              onClick={() => onNavigate("home")}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full cursor-pointer transition-colors ${
                currentScreen === "home" ? "text-[#D4AF37]" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <Home className="w-5 h-5" />
              <span>الرئيسية</span>
            </button>
            
            <button 
              onClick={() => onNavigate("purchase")}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full cursor-pointer transition-colors ${
                currentScreen === "purchase" || currentScreen === "payment" ? "text-[#D4AF37]" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span>شحن الشدات</span>
            </button>

            <button 
              onClick={() => onNavigate("tracking")}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full cursor-pointer transition-colors ${
                currentScreen === "tracking" || currentScreen === "confirmation" ? "text-[#D4AF37]" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <Search className="w-5 h-5" />
              <span>متابعة الطلب</span>
            </button>

            <button 
              onClick={() => onNavigate("payment_methods")}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full cursor-pointer transition-colors ${
                currentScreen === "payment_methods" ? "text-[#D4AF37]" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <Smartphone className="w-5 h-5" />
              <span>طرق الدفع</span>
            </button>

            <button 
              onClick={() => onNavigate("contact")}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full cursor-pointer transition-colors ${
                currentScreen === "contact" ? "text-[#D4AF37]" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <Phone className="w-5 h-5" />
              <span>تواصل معنا</span>
            </button>
          </div>
        )}

        {/* Android pill home indicator / Home Button */}
        {currentScreen !== "splash" && (
          <div className="h-6 bg-neutral-950 flex justify-center items-center pb-2 pt-1 border-t border-white/5">
            <button 
              onClick={() => onNavigate("launcher")}
              className="w-32 h-1.5 bg-neutral-700 hover:bg-[#D4AF37] rounded-full transition-all duration-300 active:scale-95 cursor-pointer"
              title="اضغط للرجوع للشاشة الرئيسية للهاتف"
            />
          </div>
        )}


      </div>
    </div>
  );
}
