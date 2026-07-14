import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Gamepad2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Loader2, 
  ChevronLeft,
  Calendar,
  DollarSign
} from "lucide-react";
import { Order } from "../types";

interface TrackingScreenProps {
  onSelectOrder: (order: Order) => void;
  onNavigate: (screen: string) => void;
}

export default function TrackingScreen({ onSelectOrder, onNavigate }: TrackingScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Order[] | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchError("يرجى إدخال رقم الطلب أو رقم آيدي اللاعب");
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setResults(null);

    const query = searchQuery.trim();

    try {
      // Determine if search query is an Order ID (starts with HN-) or Player ID (all digits)
      let endpoint = `/api/orders/${query}`;
      
      if (/^\d+$/.test(query)) {
        endpoint = `/api/orders/player/${query}`;
      }

      const response = await fetch(endpoint);
      
      if (!response.ok) {
        if (response.status === 404) {
          setResults([]); // Empty list means no orders found
          setIsSearching(false);
          return;
        }
        throw new Error("Failed to query order");
      }

      const data = await response.json();
      
      if (Array.isArray(data)) {
        setResults(data);
      } else if (data && data.id) {
        setResults([data]);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Error searching orders:", error);
      setSearchError("حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة لاحقاً.");
    } finally {
      setIsSearching(false);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("ar-YE", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return isoString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return {
          title: "قيد المراجعة",
          color: "bg-amber-500/15 text-amber-500 border border-amber-500/30",
          icon: <Clock className="w-3.5 h-3.5 text-amber-500" />,
        };
      case "processing":
        return {
          title: "جاري الشحن",
          color: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30",
          icon: <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />,
        };
      case "completed":
        return {
          title: "تم الشحن بنجاح",
          color: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
        };
      default:
        return {
          title: "ملغي",
          color: "bg-neutral-500/15 text-neutral-500 border border-neutral-500/30",
          icon: <AlertCircle className="w-3.5 h-3.5 text-neutral-500" />,
        };
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 gap-6 bg-neutral-950 pb-24">
      
      {/* Search Input Box */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-black text-neutral-400 uppercase tracking-widest text-right">
          ابحث عن طلبات الشحن الخاصة بك
        </label>

        <form onSubmit={handleSearch} className="relative">
          <input 
            type="text"
            placeholder="أدخل رقم الطلب (مثال: HN-551023) أو آيدي اللاعب"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchError(null);
            }}
            className="w-full bg-neutral-900 border border-white/5 rounded-2xl px-5 py-4 font-bold text-right text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all outline-none pl-12 placeholder-neutral-600 text-sm font-sans"
          />
          <button 
            type="submit"
            disabled={isSearching}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center text-black hover:bg-amber-500 active:scale-95 transition-all cursor-pointer"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </button>
        </form>

        {searchError && (
          <span className="text-xs text-red-400 font-bold text-right flex items-center justify-end gap-1.5 mt-1">
            <span>{searchError}</span>
            <AlertCircle className="w-4 h-4 text-red-400" />
          </span>
        )}
      </div>

      {/* Query Search Results Container */}
      <div className="flex-1 flex flex-col gap-3.5 select-none text-right">
        <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">
          نتائج البحث
        </h3>

        <AnimatePresence mode="wait">
          {isSearching && (
            <motion.div 
              key="searching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 flex flex-col items-center justify-center gap-3 text-neutral-500"
            >
              <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
              <span className="text-xs font-bold font-sans">جاري سحب بيانات الشحن من النظام...</span>
            </motion.div>
          )}

          {!isSearching && results === null && (
            <motion.div 
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 bg-[#111114]/40 border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-3.5"
            >
              <Search className="w-10 h-10 text-neutral-700" />
              <div>
                <h4 className="text-xs font-black text-neutral-300">متابعة حالة شحنات الألعاب</h4>
                <p className="text-[10px] text-neutral-500 leading-relaxed mt-1.5 max-w-[240px] mx-auto">
                  أدخل رقم الطلب الذي حصلت عليه بعد الدفع، أو قم بإدخال رقم الآيدي (ID) الخاص بك لعرض جميع الحوالات وحالة الشحن مباشرة.
                </p>
              </div>
            </motion.div>
          )}

          {!isSearching && results && results.length === 0 && (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 bg-[#111114]/40 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3"
            >
              <AlertCircle className="w-10 h-10 text-[#D4AF37]" />
              <div>
                <h4 className="text-xs font-black text-white">لم نعثر على أي طلبات!</h4>
                <p className="text-[10px] text-neutral-500 leading-relaxed mt-1.5 max-w-[240px] mx-auto">
                  تأكد من كتابة رقم الطلب أو الآيدي بشكل صحيح، أو تواصل مع الدعم الفني للمساعدة.
                </p>
              </div>
            </motion.div>
          )}

          {!isSearching && results && results.length > 0 && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-3"
            >
              {results.map((order) => {
                const badge = getStatusBadge(order.status);
                return (
                  <motion.div
                    key={order.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => onSelectOrder(order)}
                    className="p-4 rounded-2xl bg-[#111114] border border-white/5 hover:border-[#D4AF37]/30 flex flex-col gap-3 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <ChevronLeft className="w-5 h-5 text-neutral-500 self-center" />
                      
                      <div className="text-right">
                        <span className="text-[10px] text-[#D4AF37] font-black uppercase tracking-wider font-sans bg-[#D4AF37]/10 px-2 py-0.5 rounded-md border border-[#D4AF37]/20">
                          {order.id}
                        </span>
                        <h4 className="text-xs font-extrabold text-white mt-2">
                          باقة {order.packageName}
                        </h4>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] border-t border-white/5 pt-2.5 mt-1 font-sans">
                      {/* Price & status */}
                      <div className="flex items-center gap-1.5">
                        <span className="font-sans font-bold text-neutral-400">
                          {order.priceYer.toLocaleString("ar-YE")} ريال
                        </span>
                        <span className="text-neutral-600">•</span>
                        <span className={`px-2 py-0.5 rounded flex items-center gap-1 font-bold ${badge.color}`}>
                          {badge.icon}
                          <span>{badge.title}</span>
                        </span>
                      </div>
                      
                      {/* Player ID & Date */}
                      <div className="text-neutral-500 font-bold flex items-center gap-2">
                        <span>آيدي: {order.playerId}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
