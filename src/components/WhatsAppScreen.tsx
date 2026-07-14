import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Search, 
  MoreVertical, 
  Camera, 
  Send, 
  Phone, 
  Video, 
  CheckCheck, 
  Mic, 
  Paperclip, 
  Smile, 
  User, 
  Plus,
  Play,
  Pause,
  Home,
  Check,
  Smartphone
} from "lucide-react";
import { 
  WhatsAppChat, 
  WhatsAppStatus, 
  WhatsAppCall, 
  ChatMessage 
} from "../types";
import { 
  MOCK_WHATSAPP_CHATS, 
  MOCK_WHATSAPP_STATUSES, 
  MOCK_WHATSAPP_CALLS 
} from "../data";

interface WhatsAppScreenProps {
  onBackToLauncher: () => void;
  onOpenStore: () => void;
}

export default function WhatsAppScreen({ onBackToLauncher, onOpenStore }: WhatsAppScreenProps) {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<"chats" | "status" | "calls">("chats");
  const [selectedChat, setSelectedChat] = useState<WhatsAppChat | null>(null);
  
  // Real-time Chat States
  const [chats, setChats] = useState<WhatsAppChat[]>(MOCK_WHATSAPP_CHATS);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Status Story Viewer States
  const [activeStatus, setActiveStatus] = useState<WhatsAppStatus | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);

  // Calling States
  const [activeCall, setActiveCall] = useState<{
    contact: { name: string; avatar: string };
    type: "voice" | "video";
    status: "dialing" | "connected" | "ended";
  } | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  // Web Audio Synthesizer for high-fidelity WhatsApp sounds
  const playSound = (type: "send" | "receive" | "call" | "end") => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (!audioCtx) return;

      if (type === "send") {
        // High pitched short beep
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      } else if (type === "receive") {
        // Dual chime
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc1.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc2.frequency.setValueAtTime(900, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
        
        osc1.start();
        osc2.start();
        osc1.stop(audioCtx.currentTime + 0.25);
        osc2.stop(audioCtx.currentTime + 0.25);
      } else if (type === "call") {
        // Pulsing phone ring sound
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      }
    } catch (e) {
      console.warn("Audio Context blocked or failed:", e);
    }
  };

  // Auto-scroll inside active chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat?.messages, isTyping]);

  // Handle Calling Timer
  useEffect(() => {
    let callInterval: any;
    if (activeCall && activeCall.status === "connected") {
      callInterval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(callInterval);
  }, [activeCall?.status]);

  // Handle Stories Auto-progress
  useEffect(() => {
    let storyTimer: any;
    if (activeStatus) {
      setStoryProgress(0);
      storyTimer = setInterval(() => {
        setStoryProgress(prev => {
          if (prev >= 100) {
            // Next story or close
            const hasNext = currentStoryIndex < activeStatus.stories.length - 1;
            if (hasNext) {
              setCurrentStoryIndex(prevIndex => prevIndex + 1);
              return 0;
            } else {
              setActiveStatus(null);
              return 0;
            }
          }
          return prev + 1;
        });
      }, 50); // 5 seconds per story (50ms * 100)
    }
    return () => clearInterval(storyTimer);
  }, [activeStatus, currentStoryIndex]);

  // Handle Simulated Chat Messages
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedChat) return;

    const userMsgText = inputMessage;
    setInputMessage("");

    // Create message object
    const newMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "me",
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString("ar-YE", { hour: "numeric", minute: "2-digit" }),
      isMine: true,
      isRead: true
    };

    // Update active chat and message list state
    const updatedMessages = [...selectedChat.messages, newMsg];
    const updatedChat = {
      ...selectedChat,
      messages: updatedMessages,
      lastMessageText: userMsgText,
      lastMessageTime: newMsg.timestamp,
      unreadCount: 0
    };

    setSelectedChat(updatedChat);
    setChats(prev => prev.map(c => c.id === selectedChat.id ? updatedChat : c));
    playSound("send");

    // Trigger Smart Agent Reply Simulation
    setIsTyping(true);
    
    // Auto status updates to "جاري الكتابة..."
    const typingChat = { ...updatedChat, onlineStatus: "جاري الكتابة..." as any };
    setChats(prev => prev.map(c => c.id === selectedChat.id ? typingChat : c));

    setTimeout(() => {
      // Formulate custom response based on keywords
      let replyText = "";
      let hasActionBtn = false;

      const cleanText = userMsgText.toLowerCase();
      if (cleanText.includes("شدات") || cleanText.includes("ببجي") || cleanText.includes("سعر") || cleanText.includes("باقة") || cleanText.includes("اسعار") || cleanText.includes("uc")) {
        replyText = `يا غالي، عروض شحن شدات ببجي الرسمية مع حسين حنش هي الأرخص في اليمن! الباقة الأكثر مبيعاً 325 شدة فقط بـ 7,500 ريال يمني وباقة 8100 شدة بـ 150,000 ريال يمني فقط بالتعميد التلقائي ⚡. تفضل بالدخول إلى قسم "متجر الشدات" لشراء أي باقة فوراً وإرسالها للآيدي!`;
        hasActionBtn = true;
      } else if (cleanText.includes("حوالة") || cleanText.includes("الكريمي") || cleanText.includes("دفع") || cleanText.includes("فلوس") || cleanText.includes("ون كاش")) {
        replyText = `يمكنك إرسال الحوالة إلى أي من حساباتنا المعتمدة باسم (حسين سالم حسين حنش):\n\n🏦 بنك الكريمي الإسلامي: 300782985\n📱 جوال الكريمي: 782985197\n💳 محفظة ون كاش: 736887081\n\nبعد التحويل، توجه لمتجر الشدات وسجل طلبك وأرفق رقم الحوالة ليتم شحن حسابك تلقائياً بالثواني!`;
      } else if (cleanText.includes("هويه") || cleanText.includes("من انت") || cleanText.includes("حسين")) {
        replyText = `معك حسين سالم حسين حنش (الشهير بـ حسين NAT)؛ صاحب ومؤسس هذا المتجر وخدمات الشحن الفوري الأسرع والأكثر موثوقية في اليمن والخليج 👑`;
      } else {
        replyText = `أهلاً بك يا غالي! تسعدني خدمتك دائماً في واتساب (حسين NAT) 💎\nهل تود الاطلاع على قائمة عروض شدات ببجي والطلب بالثواني؟ أو تبي تستعلم عن حوالة معينة؟`;
      }

      const replyMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: selectedChat.id,
        text: replyText,
        timestamp: new Date().toLocaleTimeString("ar-YE", { hour: "numeric", minute: "2-digit" }),
        isMine: false,
        isRead: false
      };

      const finalMessages = [...updatedMessages, replyMsg];
      const finalChat = {
        ...selectedChat,
        messages: finalMessages,
        lastMessageText: replyText,
        lastMessageTime: replyMsg.timestamp,
        onlineStatus: "متصل الآن" as any
      };

      setIsTyping(false);
      setSelectedChat(finalChat);
      setChats(prev => prev.map(c => c.id === selectedChat.id ? finalChat : c));
      playSound("receive");
    }, 2000);

  };

  // Initiate Calling Simulator
  const handleStartCall = (type: "voice" | "video") => {
    if (!selectedChat) return;
    playSound("call");
    setActiveCall({
      contact: { name: selectedChat.contactName, avatar: selectedChat.contactAvatar },
      type,
      status: "dialing"
    });

    // Simulate pick up after 2.5 seconds
    setTimeout(() => {
      setActiveCall(prev => prev ? { ...prev, status: "connected" } : null);
    }, 2500);
  };

  // Format calling duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="h-full w-full bg-[#111b21] text-[#e9edef] flex flex-col relative select-none font-sans overflow-hidden">
      
      {/* 1. WHATSAPP HEADER */}
      {!selectedChat && (
        <div className="bg-[#202c33] pt-4 pb-2 px-4 shadow-md z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-emerald-500 tracking-wide flex items-center gap-1">
              <span>واتساب حسين NAT</span>
              <span className="text-sm">👑</span>
            </h1>
            <div className="flex items-center gap-5 text-[#aebac1]">
              <Camera className="w-5 h-5 hover:text-white cursor-pointer" />
              <Search className="w-5 h-5 hover:text-white cursor-pointer" />
              <button onClick={onBackToLauncher} className="hover:text-white flex items-center gap-1 text-xs bg-white/5 px-2 py-1 rounded-lg">
                <Smartphone className="w-3.5 h-3.5" />
                <span>الهاتف</span>
              </button>
            </div>
          </div>

          {/* WhatsApp Tabs Bar */}
          <div className="flex justify-around mt-5 border-b border-[#222e35] text-sm font-bold text-[#8696a0]">
            <button 
              onClick={() => setActiveTab("chats")}
              className={`pb-2.5 px-4 relative flex items-center gap-1.5 cursor-pointer ${activeTab === "chats" ? "text-emerald-500 font-black" : "hover:text-[#e9edef]"}`}
            >
              <span>الدردشات</span>
              <span className="bg-emerald-600 text-black text-[10px] px-1.5 py-0.5 rounded-full font-sans font-black">
                {chats.reduce((acc, c) => acc + c.unreadCount, 0)}
              </span>
              {activeTab === "chats" && (
                <motion.div layoutId="wa-active-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
              )}
            </button>
            
            <button 
              onClick={() => setActiveTab("status")}
              className={`pb-2.5 px-4 relative flex items-center gap-1.5 cursor-pointer ${activeTab === "status" ? "text-emerald-500 font-black" : "hover:text-[#e9edef]"}`}
            >
              <span>المستجدات</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              {activeTab === "status" && (
                <motion.div layoutId="wa-active-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
              )}
            </button>

            <button 
              onClick={() => setActiveTab("calls")}
              className={`pb-2.5 px-4 relative cursor-pointer ${activeTab === "calls" ? "text-emerald-500 font-black" : "hover:text-[#e9edef]"}`}
            >
              <span>المكالمات</span>
              {activeTab === "calls" && (
                <motion.div layoutId="wa-active-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* 2. MAIN TABS CONTENT AREA */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        
        {/* CHATS TAB */}
        {activeTab === "chats" && !selectedChat && (
          <div className="p-1 divide-y divide-[#202c33]/40">
            {chats.map((chat) => (
              <div 
                key={chat.id}
                onClick={() => {
                  setSelectedChat(chat);
                  // Mark all as read
                  setChats(prev => prev.map(c => c.id === chat.id ? { ...c, unreadCount: 0 } : c));
                }}
                className="flex items-center gap-4 px-4 py-3.5 hover:bg-[#202c33]/50 cursor-pointer transition-colors"
              >
                {/* Contact Avatar */}
                <div className="relative">
                  <img 
                    src={chat.contactAvatar} 
                    alt={chat.contactName} 
                    className="w-12 h-12 rounded-full object-cover border border-[#202c33]"
                    referrerPolicy="no-referrer"
                  />
                  {chat.onlineStatus === "متصل الآن" && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#111b21] rounded-full" />
                  )}
                </div>

                {/* Contact Text Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-[#e9edef] text-sm flex items-center gap-1.5 truncate">
                      {chat.contactName}
                      {chat.verifiedBadge && (
                        <span className="text-sky-400 text-xs">☑️</span>
                      )}
                    </h3>
                    <span className="text-xs text-[#8696a0] font-medium font-sans">
                      {chat.lastMessageTime}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-xs text-[#8696a0] truncate max-w-[80%]">
                      {chat.onlineStatus === "جاري الكتابة..." ? (
                        <span className="text-emerald-500 font-bold animate-pulse">جاري الكتابة...</span>
                      ) : (
                        chat.lastMessageText
                      )}
                    </p>
                    {chat.unreadCount > 0 && (
                      <span className="bg-emerald-500 text-black text-[10px] font-sans font-black w-5 h-5 rounded-full flex items-center justify-center">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Action Link to PUBG store inside chats */}
            <div className="p-4 mt-6">
              <div className="bg-[#202c33] border border-amber-500/20 rounded-2xl p-4 flex flex-col items-center text-center shadow-lg">
                <p className="text-xs text-neutral-300 font-bold mb-3 leading-relaxed">
                  تبي تشحن شدات ببجي بموثوقية وبثواني؟ تفضل بزيارة متجرنا الرسمي المعتمد!
                </p>
                <button 
                  onClick={onOpenStore}
                  className="btn-gold-gradient text-xs font-black py-2.5 px-6 rounded-xl cursor-pointer"
                >
                  🚀 الدخول لمتجر الشدات
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STATUS TAB */}
        {activeTab === "status" && !selectedChat && (
          <div className="p-4 space-y-5">
            {/* My Status header */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" 
                  alt="My status" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-neutral-600"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 right-0 bg-emerald-500 text-black rounded-full p-0.5 border-2 border-[#111b21]">
                  <Plus className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">حالتي</h4>
                <p className="text-xs text-neutral-400 font-medium">اضغط لإضافة حالة جديدة</p>
              </div>
            </div>

            {/* Recents updates section */}
            <div>
              <h5 className="text-xs font-black text-emerald-500 tracking-wide uppercase mb-3">المستجدات الأخيرة</h5>
              <div className="space-y-4">
                {MOCK_WHATSAPP_STATUSES.map((status) => (
                  <div 
                    key={status.id}
                    onClick={() => {
                      setActiveStatus(status);
                      setCurrentStoryIndex(0);
                    }}
                    className="flex items-center gap-4 cursor-pointer p-1 rounded-xl hover:bg-[#202c33]/30 transition-colors"
                  >
                    {/* Ring border wrapper to simulate WhatsApp unread stories ring */}
                    <div className="p-0.5 rounded-full border-2 border-dashed border-emerald-500 animate-spin-slow">
                      <img 
                        src={status.contactAvatar} 
                        alt={status.contactName} 
                        className="w-11 h-11 rounded-full object-cover border border-[#111b21]"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{status.contactName}</h4>
                      <p className="text-xs text-neutral-400 font-sans font-medium">{status.timeAgo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Explanatory text */}
            <div className="bg-[#202c33]/40 border border-emerald-500/15 rounded-xl p-3.5 text-center text-xs text-neutral-400">
              💡 اضغط على الحالات أعلاه لمشاهدة أحدث عروض شحن الـ PUBG وشدات رويال باس المقدمة من حسين سالم!
            </div>
          </div>
        )}

        {/* CALLS TAB */}
        {activeTab === "calls" && !selectedChat && (
          <div className="p-4 space-y-4">
            <h5 className="text-xs font-black text-emerald-500 tracking-wide uppercase">سجل المكالمات الأخيرة</h5>
            <div className="space-y-4 divide-y divide-[#202c33]/30">
              {MOCK_WHATSAPP_CALLS.map((call) => (
                <div 
                  key={call.id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={call.contactAvatar} 
                      alt={call.contactName} 
                      className="w-11 h-11 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-white">{call.contactName}</h4>
                      <div className="flex items-center gap-1 mt-1 text-xs text-neutral-400 font-medium">
                        <span className={call.status === "missed" ? "text-red-500 font-bold" : "text-emerald-500"}>
                          {call.status === "incoming" ? "↙️ مكالمة واردة" : call.status === "outgoing" ? "↗️ مكالمة صادرة" : "↙️ فائتة"}
                        </span>
                        <span className="font-sans text-[10px] text-neutral-500">({call.time})</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setSelectedChat({
                        id: call.id,
                        contactName: call.contactName,
                        contactAvatar: call.contactAvatar,
                        onlineStatus: "متصل الآن",
                        lastMessageText: "",
                        lastMessageTime: "",
                        unreadCount: 0,
                        messages: []
                      });
                      setTimeout(() => handleStartCall(call.type), 200);
                    }}
                    className="p-2.5 rounded-full bg-[#202c33] text-emerald-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {call.type === "voice" ? <Phone className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 3. ACTIVE CHAT ROOM SCREEN (FULL OVERLAY) */}
      <AnimatePresence>
        {selectedChat && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="absolute inset-0 bg-[#0b141a] flex flex-col z-40"
          >
            {/* Active Chat Header */}
            <div className="bg-[#202c33] py-3.5 px-4 flex items-center justify-between border-b border-[#2a3942] shadow-md">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedChat(null)}
                  className="p-1 rounded-full hover:bg-white/5 text-[#aebac1] hover:text-white cursor-pointer"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
                <div className="relative">
                  <img 
                    src={selectedChat.contactAvatar} 
                    alt={selectedChat.contactName} 
                    className="w-10 h-10 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {selectedChat.onlineStatus === "متصل الآن" && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#202c33] rounded-full" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-1.5 max-w-[150px] truncate">
                    {selectedChat.contactName}
                    {selectedChat.verifiedBadge && <span className="text-sky-400">☑️</span>}
                  </h4>
                  <p className="text-[10px] text-emerald-400 font-black animate-pulse">
                    {isTyping ? "جاري الكتابة..." : selectedChat.onlineStatus}
                  </p>
                </div>
              </div>

              {/* Call Controls & Actions */}
              <div className="flex items-center gap-4 text-[#aebac1]">
                <button onClick={() => handleStartCall("video")} className="hover:text-white cursor-pointer">
                  <Video className="w-5 h-5" />
                </button>
                <button onClick={() => handleStartCall("voice")} className="hover:text-white cursor-pointer">
                  <Phone className="w-5 h-5" />
                </button>
                <button onClick={onOpenStore} className="bg-amber-500 text-black text-[10px] font-black py-1 px-2.5 rounded-lg hover:brightness-110 flex items-center gap-1 cursor-pointer">
                  <span>المتجر 🛒</span>
                </button>
              </div>
            </div>

            {/* Chat Messages Log Area (with Classic WhatsApp doodle pattern) */}
            <div 
              className="flex-1 overflow-y-auto px-4 py-5 space-y-4 relative custom-scrollbar bg-[#0b141a]"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(20, 30, 40, 0.4) 10%, transparent 11%)`,
                backgroundSize: "20px 20px"
              }}
            >
              <div className="mx-auto max-w-max bg-[#182229] border border-[#2a3942] rounded-xl px-3 py-1.5 text-[11px] text-neutral-400 font-bold mb-4 shadow-sm text-center">
                🔒 الرسائل والمكالمات مشفرة بالكامل. لا أحد خارج هذه الدردشة يستطيع قراءتها.
              </div>

              {selectedChat.messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 shadow-md relative ${
                      msg.isMine 
                        ? "bg-[#005c4b] text-[#e9edef] rounded-tr-none" 
                        : "bg-[#202c33] text-[#e9edef] rounded-tl-none border border-[#2a3942]/40"
                    }`}
                  >
                    {!msg.isMine && (
                      <span className="block text-[10px] font-black text-amber-500 mb-1">
                        {msg.sender === "hussein_boss" ? "حسين سالم" : "الدعم الفني"}
                      </span>
                    )}

                    {/* Check if Voice Note */}
                    {msg.isVoice ? (
                      <div className="flex items-center gap-3 py-1 min-w-[200px]">
                        <button className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black cursor-pointer">
                          <Play className="w-4 h-4 fill-black ml-0.5" />
                        </button>
                        <div className="flex-1">
                          {/* Audio Wave Form visualization */}
                          <div className="flex items-end gap-0.5 h-6">
                            {[2,4,3,6,8,5,7,4,9,3,5,6,4,2,6,3,7,2,5,3,1].map((val, idx) => (
                              <div key={idx} style={{ height: `${val * 10}%` }} className="flex-1 bg-neutral-500 rounded-full" />
                            ))}
                          </div>
                        </div>
                        <span className="text-[10px] text-neutral-400 font-sans font-medium">{msg.voiceDuration}</span>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    )}

                    <div className="flex justify-end items-center gap-1 mt-1 text-[9px] text-[#8696a0] font-sans font-medium">
                      <span>{msg.timestamp}</span>
                      {msg.isMine && (
                        <CheckCheck className="w-3.5 h-3.5 text-sky-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#202c33] text-neutral-400 rounded-2xl rounded-tl-none px-4 py-2 border border-[#2a3942]/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Hints bar */}
            <div className="bg-[#182229] px-4 py-1.5 border-t border-[#2a3942]/50 flex gap-2 overflow-x-auto select-none no-scrollbar">
              <button 
                onClick={() => {
                  setInputMessage("باقة الشدات الأكثر شعبية 325 UC 🔥");
                  playSound("send");
                }}
                className="flex-shrink-0 bg-[#202c33] hover:bg-[#2a3942] border border-[#2a3942] text-[10px] text-white font-bold px-3 py-1.5 rounded-full"
              >
                باقات ببجي 🛒
              </button>
              <button 
                onClick={() => {
                  setInputMessage("كيف ارسل الحوالة على الكريمي؟");
                  playSound("send");
                }}
                className="flex-shrink-0 bg-[#202c33] hover:bg-[#2a3942] border border-[#2a3942] text-[10px] text-white font-bold px-3 py-1.5 rounded-full"
              >
                كيفية الدفع 🏦
              </button>
              <button 
                onClick={() => {
                  setInputMessage("أريد التحدث مع حسين سالم 👑");
                  playSound("send");
                }}
                className="flex-shrink-0 bg-[#202c33] hover:bg-[#2a3942] border border-[#2a3942] text-[10px] text-white font-bold px-3 py-1.5 rounded-full"
              >
                التحدث للمدير
              </button>
            </div>

            {/* Message Input Bottom Bar */}
            <div className="bg-[#202c33] px-3 py-3.5 flex items-center gap-3 border-t border-[#2a3942]/20">
              <div className="flex items-center gap-2 text-[#aebac1]">
                <button className="p-1 rounded-full hover:bg-white/5 cursor-pointer">
                  <Smile className="w-5 h-5" />
                </button>
                <button className="p-1 rounded-full hover:bg-white/5 cursor-pointer">
                  <Paperclip className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-2 text-sm text-[#e9edef] flex items-center">
                <input 
                  type="text"
                  dir="rtl"
                  placeholder="اكتب رسالة..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="w-full bg-transparent border-none outline-none text-white text-sm"
                />
              </div>

              <button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-md transition-all ${
                  inputMessage.trim() 
                    ? "bg-emerald-500 text-black hover:scale-105" 
                    : "bg-[#2a3942] text-[#8696a0]"
                }`}
              >
                {inputMessage.trim() ? <Send className="w-4.5 h-4.5 rotate-180" /> : <Mic className="w-4.5 h-4.5" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. FULL SCREEN STORIES/STATUS VIEW OVERLAY */}
      <AnimatePresence>
        {activeStatus && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#000] z-50 flex flex-col justify-between py-6 px-4"
          >
            {/* Story Top Progress Bars */}
            <div className="w-full flex gap-1.5 px-1">
              {activeStatus.stories.map((story, idx) => (
                <div key={story.id} className="h-1 flex-1 bg-neutral-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-75"
                    style={{ 
                      width: `${
                        idx < currentStoryIndex 
                          ? 100 
                          : idx === currentStoryIndex 
                            ? storyProgress 
                            : 0
                      }%` 
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Story Header */}
            <div className="flex justify-between items-center mt-3 px-1 text-white">
              <div className="flex items-center gap-3">
                <img 
                  src={activeStatus.contactAvatar} 
                  alt={activeStatus.contactName} 
                  className="w-9 h-9 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-xs font-bold">{activeStatus.contactName}</h4>
                  <p className="text-[9px] text-neutral-400 font-sans">{activeStatus.timeAgo}</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveStatus(null)}
                className="p-1 rounded-full bg-neutral-900/60 text-white font-sans text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Story Core Media Body */}
            <div className="flex-1 my-6 flex items-center justify-center relative">
              {activeStatus.stories[currentStoryIndex].type === "image" ? (
                <img 
                  src={activeStatus.stories[currentStoryIndex].mediaUrl} 
                  alt="Story content" 
                  className="max-h-[70vh] object-contain rounded-2xl shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div 
                  className="w-full h-80 rounded-3xl p-6 flex items-center justify-center text-center text-lg font-black leading-relaxed"
                  style={{ background: activeStatus.stories[currentStoryIndex].bgColor }}
                >
                  {activeStatus.stories[currentStoryIndex].caption}
                </div>
              )}
            </div>

            {/* Story Caption and Action Prompt */}
            <div className="space-y-4 px-2">
              {activeStatus.stories[currentStoryIndex].type === "image" && activeStatus.stories[currentStoryIndex].caption && (
                <p className="text-sm font-bold text-center text-white drop-shadow-md leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5 backdrop-blur-sm">
                  {activeStatus.stories[currentStoryIndex].caption}
                </p>
              )}

              {/* Swipe/Click up Action to Store */}
              <div className="flex flex-col items-center">
                <button 
                  onClick={() => {
                    setActiveStatus(null);
                    onOpenStore();
                  }}
                  className="bg-emerald-500 text-black font-black text-xs py-2.5 px-8 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  🚀 اطلب الآن من متجر الشدات
                </button>
                <p className="text-[10px] text-neutral-400 font-bold mt-2">انقر للدخول للمتجر مباشرة</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. FULL IMMERSIVE CALL DIALOG SIMULATOR */}
      <AnimatePresence>
        {activeCall && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#075E54] z-50 flex flex-col justify-between py-12 px-6 text-center text-white"
            style={{
              backgroundImage: "linear-gradient(180deg, #128C7E 0%, #075E54 100%)"
            }}
          >
            {/* Top Security details */}
            <div className="text-xs text-white/60 font-medium tracking-wide flex items-center justify-center gap-1.5">
              <span>🔒 مكالمة واتساب مشفرة</span>
            </div>

            {/* Calling Identity */}
            <div className="my-auto space-y-6">
              <div className="relative inline-block">
                {/* Glowing pulsating rings */}
                <span className="absolute inset-0 rounded-full bg-white/20 animate-ping [animation-duration:2s]" />
                <span className="absolute inset-0 rounded-full bg-white/10 animate-pulse [animation-duration:1.5s]" />
                <img 
                  src={activeCall.contact.avatar} 
                  alt={activeCall.contact.name} 
                  className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-white/30 shadow-2xl relative z-10"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <h2 className="text-2xl font-black">{activeCall.contact.name}</h2>
                <p className="text-sm text-emerald-200 mt-2 font-bold animate-pulse">
                  {activeCall.status === "dialing" 
                    ? "جاري الاتصال بـ حسين..." 
                    : activeCall.status === "connected" 
                      ? "متصل 🟢" 
                      : "انتهت المكالمة"
                  }
                </p>
                {activeCall.status === "connected" && (
                  <p className="text-lg font-mono text-white/95 mt-3 font-bold bg-black/10 px-4 py-1 rounded-full max-w-max mx-auto border border-white/5">
                    {formatDuration(callDuration)}
                  </p>
                )}
              </div>
            </div>

            {/* Simulated Voice note player or interactive dial pad */}
            {activeCall.status === "connected" && (
              <div className="bg-black/20 p-4 rounded-2xl max-w-sm mx-auto border border-white/5 mb-8">
                <p className="text-xs text-emerald-200 leading-relaxed font-bold">
                  🎙️ "أهلاً بك يا غالي! معك حسين حنش، متجرنا شغال تلقائي وبشكل فوري بالثواني عبر Midasbuy. تفضل سجل طلبك بالموقع أو اطلب الشدات وبنعمدها لك فوراً بالثواني!"
                </p>
              </div>
            )}

            {/* Call Action controls */}
            <div className="flex justify-center gap-10 items-center">
              {/* Decline / Hang up button */}
              <button 
                onClick={() => {
                  playSound("end");
                  setActiveCall(null);
                }}
                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center shadow-xl text-white transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span className="text-2xl">🛑</span>
              </button>

              {/* Speaker toggle */}
              <div className="flex flex-col items-center gap-1 opacity-60">
                <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
                  🔊
                </div>
                <span className="text-[10px]">مكبر الصوت</span>
              </div>

              {/* Mute toggle */}
              <div className="flex flex-col items-center gap-1 opacity-60">
                <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
                  🎙️
                </div>
                <span className="text-[10px]">كتم الصوت</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
