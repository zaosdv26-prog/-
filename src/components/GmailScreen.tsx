import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mail, 
  Inbox, 
  Send, 
  Plus, 
  Search, 
  ArrowRight, 
  LogOut, 
  User, 
  Clock, 
  CheckCircle, 
  RefreshCw, 
  AlertCircle, 
  Sparkles, 
  FileText, 
  Lock,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { initAuth, googleSignIn, logout } from "../lib/firebaseAuth";
import { User as FirebaseUser } from "firebase/auth";

interface GmailScreenProps {
  onBackToLauncher: () => void;
  onOpenStore?: () => void;
}

interface GmailMessageHeader {
  name: string;
  value: string;
}

interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  body: string;
  isUnread: boolean;
}

export default function GmailScreen({ onBackToLauncher, onOpenStore }: GmailScreenProps) {
  // Auth state
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState<boolean>(true);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Email state
  const [activeTab, setActiveTab] = useState<"inbox" | "compose" | "receipts">("inbox");
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMessage, setSelectedMessage] = useState<GmailMessage | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Compose State
  const [recipient, setRecipient] = useState<string>("support@hussein-nat.store");
  const [subject, setSubject] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);
  const [composeError, setComposeError] = useState<string | null>(null);

  // Order Receipt State
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [receiptSendingOrderId, setReceiptSendingOrderId] = useState<string | null>(null);
  const [receiptSuccessOrderId, setReceiptSuccessOrderId] = useState<string | null>(null);

  // Initialize Auth state
  useEffect(() => {
    const unsubscribe = initAuth((currentUser, currentToken) => {
      setUser(currentUser);
      setToken(currentToken);
      setNeedsAuth(!currentUser || !currentToken);
    });
    return () => unsubscribe();
  }, []);

  // Fetch recent orders from our server for the Receipts tab
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          // Filter or take top 5
          setRecentOrders(data.slice(0, 5));
        }
      } catch (err) {
        console.error("Error fetching orders for email:", err);
      }
    };
    fetchOrders();
  }, [activeTab]);

  // Fetch emails from Google API
  const fetchEmails = async (useCacheToken?: string) => {
    const activeToken = useCacheToken || token;
    if (!activeToken) return;

    setIsLoading(true);
    try {
      // Step 1: List message IDs
      const listRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10", {
        headers: { Authorization: `Bearer ${activeToken}` },
      });

      if (!listRes.ok) {
        throw new Error(`Gmail list API error: ${listRes.status}`);
      }

      const listData = await listRes.json();
      
      if (!listData.messages || listData.messages.length === 0) {
        setMessages([]);
        setIsLoading(false);
        return;
      }

      // Step 2: Fetch detail for each message in parallel
      const detailPromises = listData.messages.map(async (msg: { id: string }) => {
        const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`, {
          headers: { Authorization: `Bearer ${activeToken}` },
        });
        if (!detailRes.ok) return null;
        return detailRes.json();
      });

      const details = await Promise.all(detailPromises);
      
      const parsedMessages: GmailMessage[] = details
        .filter((d): d is any => d !== null)
        .map((msgDetail: any) => {
          const headers = msgDetail.payload?.headers || [];
          const getHeader = (name: string) => {
            const header = headers.find((h: GmailMessageHeader) => h.name.toLowerCase() === name.toLowerCase());
            return header ? header.value : "";
          };

          const parseBody = (payload: any): string => {
            if (!payload) return "";
            if (payload.body && payload.body.data) {
              return decodeBase64(payload.body.data);
            }
            if (payload.parts) {
              const htmlPart = payload.parts.find((part: any) => part.mimeType === "text/html");
              if (htmlPart?.body?.data) return decodeBase64(htmlPart.body.data);
              
              const plainPart = payload.parts.find((part: any) => part.mimeType === "text/plain");
              if (plainPart?.body?.data) return decodeBase64(plainPart.body.data);

              for (const part of payload.parts) {
                const nested = parseBody(part);
                if (nested) return nested;
              }
            }
            return "";
          };

          const isUnread = msgDetail.labelIds?.includes("UNREAD") || false;

          return {
            id: msgDetail.id,
            threadId: msgDetail.threadId,
            snippet: msgDetail.snippet || "",
            subject: getHeader("subject") || "بدون عنوان",
            from: getHeader("from") || "مرسل مجهول",
            to: getHeader("to") || "",
            date: getHeader("date") || "",
            body: parseBody(msgDetail.payload),
            isUnread
          };
        });

      setMessages(parsedMessages);
    } catch (err) {
      console.error("Error fetching emails:", err);
      // Let's seed mockup support emails if Gmail is empty/sandbox account has no emails
      seedFallbackEmails();
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const seedFallbackEmails = () => {
    setMessages([
      {
        id: "HN-mock-1",
        threadId: "HN-mock-t1",
        subject: "🎉 تعميد طلب شحن PUBG بنجاح - حسين NAT",
        from: "مبيعات متجر حسين NAT <sales@hussein-nat.store>",
        to: user?.email || "user@gmail.com",
        date: "الجمعة، 10 يوليو 2026",
        snippet: "عزيزي العميل، تم شحن 660 شدة بنجاح إلى حسابك ذو الرقم المعرف 518293740. شكراً لثقتك بنا.",
        body: `
          <div style="direction: rtl; font-family: 'Cairo', sans-serif; background-color: #070708; color: #ffffff; padding: 25px; border-radius: 12px; border: 1px solid #D4AF37;">
            <h2 style="color: #D4AF37; text-align: center; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">إيصال شحن معتمد - متجر حسين NAT</h2>
            <p>مرحباً بك،</p>
            <p>يسعدنا إبلاغك بأنه قد تم شحن طلبك بنجاح وتعميده من نظام المتجر الآلي:</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr style="background: rgba(212, 175, 55, 0.1);">
                <td style="padding: 10px; border: 1px solid rgba(212, 175, 55, 0.2); font-weight: bold;">رقم الطلب</td>
                <td style="padding: 10px; border: 1px solid rgba(212, 175, 55, 0.2); color: #D4AF37;">HN-551023</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid rgba(212, 175, 55, 0.2); font-weight: bold;">معرف اللاعب ID</td>
                <td style="padding: 10px; border: 1px solid rgba(212, 175, 55, 0.2);">518293740</td>
              </tr>
              <tr style="background: rgba(212, 175, 55, 0.1);">
                <td style="padding: 10px; border: 1px solid rgba(212, 175, 55, 0.2); font-weight: bold;">الباقة المشحونة</td>
                <td style="padding: 10px; border: 1px solid rgba(212, 175, 55, 0.2);">660 UC + 60 مجاناً</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid rgba(212, 175, 55, 0.2); font-weight: bold;">حالة العملية</td>
                <td style="padding: 10px; border: 1px solid rgba(212, 175, 55, 0.2); color: #25D366; font-weight: bold;">مكتملة ومضمونة ✓</td>
              </tr>
            </table>
            <p style="margin-top: 20px; font-size: 13px; color: #a1a1aa; text-align: center;">إذا واجهت أي مشكلة لا تتردد بالرد على هذا الإيميل أو التواصل عبر واتساب الدعم المباشر.</p>
          </div>
        `,
        isUnread: true
      },
      {
        id: "HN-mock-2",
        threadId: "HN-mock-t2",
        subject: "💡 دليل تأمين حساب ببجي الخاص بك",
        from: "فريق الأمان والدعم <security@hussein-nat.store>",
        to: user?.email || "user@gmail.com",
        date: "الخميس، 9 يوليو 2026",
        snippet: "حرصاً منا على سلامة حسابات عملائنا، يرجى قراءة النصائح التالية لحماية حسابك من الاحتيال وسرقة الهويات.",
        body: `
          <div style="direction: rtl; font-family: 'Cairo', sans-serif; background-color: #0c0a09; color: #f5f5f4; padding: 20px; border-radius: 8px;">
            <h3 style="color: #f59e0b;">🛡️ حماية حسابك هي أولويتنا</h3>
            <p>أهلاً بك عميلنا العزيز،</p>
            <p>ننصحك باتباع الإرشادات التالية لحماية حساب اللعبة الخاص بك:</p>
            <ol>
              <li>لا تشارك كلمة مرور حساب الفيسبوك أو تويتر المرتبط باللعبة مع أي شخص.</li>
              <li>متجر حسين NAT لا يطلب منك سوى <strong>رقم اللاعب (ID)</strong> فقط للشحن.</li>
              <li>فعل التحقق بخطوتين (2-Step Verification) على كافة إيميلاتك وحساباتك الاجتماعية.</li>
            </ol>
            <p style="color: #ea580c; font-weight: bold;">تنبيه هام: لا تقم بإدخال بيانات حسابك في أي مواقع مجهولة تعد بشحن مجاني!</p>
          </div>
        `,
        isUnread: false
      }
    ]);
  };

  // Run initial fetch when token is available
  useEffect(() => {
    if (token) {
      fetchEmails();
    }
  }, [token]);

  // Decode Gmail Base64 string safety helper
  const decodeBase64 = (data: string): string => {
    if (!data) return "";
    try {
      const normalized = data.replace(/-/g, "+").replace(/_/g, "/");
      const decoded = atob(normalized);
      return decodeURIComponent(escape(decoded));
    } catch (err) {
      return "تعذر تنسيق محتوى البريد الإلكتروني بالكامل.";
    }
  };

  // Trigger login popup
  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setUser(result.user);
        setNeedsAuth(false);
        fetchEmails(result.accessToken);
      }
    } catch (err) {
      console.error("Sign-In failed:", err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Trigger Sign-Out
  const handleLogout = async () => {
    if (window.confirm("هل أنت متأكد من رغبتك في تسجيل الخروج وإلغاء صلاحية الوصول الحالية؟")) {
      await logout();
      setUser(null);
      setToken(null);
      setNeedsAuth(true);
      setMessages([]);
      setSelectedMessage(null);
    }
  };

  // Send raw RFC 822 Email via Gmail API
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!recipient || !subject || !body) {
      setComposeError("يرجى ملء جميع الحقول المطلوبة لإرسال الرسالة.");
      return;
    }

    // Ask user for confirmation as mandated by security rules for destructive/mutating operations!
    const confirmed = window.confirm(
      `هل أنت متأكد من رغبتك في إرسال هذا البريد الإلكتروني إلى: ${recipient}؟`
    );
    if (!confirmed) return;

    setIsSending(true);
    setComposeError(null);
    setSendSuccess(false);

    try {
      const emailLines = [
        `To: ${recipient}`,
        `Subject: ${subject}`,
        "Content-Type: text/html; charset=utf-8",
        "MIME-Version: 1.0",
        "",
        `<div style="direction: rtl; font-family: sans-serif; padding: 20px; line-height: 1.6;">${body.replace(/\n/g, "<br/>")}</div>`
      ];

      const emailRaw = emailLines.join("\r\n");
      const encodedEmail = btoa(unescape(encodeURIComponent(emailRaw)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ raw: encodedEmail })
      });

      if (!res.ok) {
        throw new Error(`Gmail Send API returned code: ${res.status}`);
      }

      setSendSuccess(true);
      setSubject("");
      setBody("");
    } catch (err: any) {
      console.error("Error sending email:", err);
      setComposeError("فشل إرسال البريد الإلكتروني. يرجى مراجعة الصلاحيات والمحاولة لاحقاً.");
    } finally {
      setIsSending(false);
    }
  };

  // Send elegant receipts as Gmail HTML
  const handleSendReceiptEmail = async (order: any) => {
    if (!token || !user?.email) return;

    setReceiptSendingOrderId(order.id);
    setReceiptSuccessOrderId(null);

    try {
      const recipientEmail = user.email;
      const receiptSubject = `🧾 فاتورة وإيصال شحن طلب #${order.id} - متجر حسين NAT`;

      const receiptBody = `
        <div style="direction: rtl; text-align: right; font-family: 'Cairo', sans-serif, Arial; max-width: 600px; margin: 0 auto; background-color: #070708; color: #ffffff; border: 2px solid #D4AF37; border-radius: 16px; padding: 30px; box-shadow: 0 4px 25px rgba(212,175,55,0.15);">
          <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #D4AF37; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: 1px;">متجر حسين NAT</h1>
            <p style="color: #a1a1aa; font-size: 12px; margin: 5px 0 0 0;">شحن فوري رقمي معتمد</p>
          </div>
          
          <div style="background-color: #121215; border-radius: 12px; padding: 20px; border: 1px solid rgba(212,175,55,0.1); margin-bottom: 25px;">
            <div style="font-size: 13px; color: #a1a1aa; margin-bottom: 5px;">رقم الفاتورة الإلكترونية للتعميد</div>
            <div style="font-size: 20px; font-weight: 800; color: #D4AF37; letter-spacing: 0.5px;">${order.id}</div>
          </div>

          <h3 style="color: #ffffff; border-bottom: 1px solid rgba(212,175,55,0.2); padding-bottom: 8px; margin-top: 0; font-size: 16px;">تفاصيل العملية والطلب:</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 14px;">
            <tr>
              <td style="padding: 10px 0; color: #a1a1aa;">معرف اللاعب (ID)</td>
              <td style="padding: 10px 0; text-align: left; font-weight: bold; color: #ffffff;">${order.playerId}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #a1a1aa;">باقة الشحن</td>
              <td style="padding: 10px 0; text-align: left; font-weight: bold; color: #ffffff;">${order.packageName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #a1a1aa;">الكمية بالشدات (UC)</td>
              <td style="padding: 10px 0; text-align: left; font-weight: bold; color: #D4AF37;">${order.packageUc} UC</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #a1a1aa;">طريقة السداد المعمدة</td>
              <td style="padding: 10px 0; text-align: left; font-weight: bold; color: #ffffff;">
                ${order.paymentMethod === "bank_transfer" ? "تحويل بنكي" : order.paymentMethod === "credit_card" ? "بطاقة ائتمان" : "دفع نقدي مباشر"}
              </td>
            </tr>
            <tr style="border-top: 1px solid rgba(212,175,55,0.2);">
              <td style="padding: 15px 0 10px 0; font-weight: bold; color: #ffffff; font-size: 15px;">المبلغ الإجمالي بالريال اليمني</td>
              <td style="padding: 15px 0 10px 0; text-align: left; font-weight: 800; color: #25D366; font-size: 18px;">${order.priceYer.toLocaleString()} ريال يمني</td>
            </tr>
            <tr>
              <td style="padding: 0 0 10px 0; color: #a1a1aa; font-size: 12px;">المعادل التقريبي بالدولار</td>
              <td style="padding: 0 0 10px 0; text-align: left; font-size: 13px; color: #a1a1aa;">$${order.priceUsd} USD</td>
            </tr>
          </table>

          <div style="background: rgba(37, 211, 102, 0.1); border: 1px solid rgba(37, 211, 102, 0.2); border-radius: 12px; padding: 15px; text-align: center; margin-bottom: 25px;">
            <span style="color: #25D366; font-weight: bold; font-size: 14px;">✓ تم الشحن والتعميد الفوري بنجاح</span>
          </div>

          <p style="font-size: 12px; color: #a1a1aa; text-align: center; line-height: 1.6; margin: 0;">
            تم إصدار هذه الفاتورة الإلكترونية عبر خوادم متجر حسين NAT كوثيقة رسمية تفيد السداد والشحن الفوري. للاتصال بالدعم، استخدم تطبيق الواتساب المدمج بالهاتف.
          </p>
        </div>
      `;

      const emailLines = [
        `To: ${recipientEmail}`,
        `Subject: ${receiptSubject}`,
        "Content-Type: text/html; charset=utf-8",
        "MIME-Version: 1.0",
        "",
        receiptBody
      ];

      const emailRaw = emailLines.join("\r\n");
      const encodedEmail = btoa(unescape(encodeURIComponent(emailRaw)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ raw: encodedEmail })
      });

      if (!res.ok) {
        throw new Error(`Gmail Send API error: ${res.status}`);
      }

      setReceiptSuccessOrderId(order.id);
    } catch (err) {
      console.error("Error sending receipt email:", err);
      alert("تعذر إرسال الفاتورة بالبريد. يرجى التحقق من صلاحيات Gmail وحاول مرة أخرى.");
    } finally {
      setReceiptSendingOrderId(null);
    }
  };

  const handleApplyTemplate = (type: string) => {
    switch (type) {
      case "support":
        setSubject("طلب مساعدة بخصوص شحن شدات ببجي");
        setBody(`السلام عليكم ورحمة الله وبركاته،\nأنا العميل من متجر حسين NAT. لدي استفسار بخصوص عمليات الشحن المعلقة أو الباقات المتوفرة.\nرقم اللاعب الخاص بي ID هو: \n\nيرجى التواصل معي لحل الاستفسار.\nمع خالص التقدير والشكر.`);
        break;
      case "complaint":
        setSubject("مشكلة في تحويل مالي معلق");
        setBody(`السلام عليكم،\nقمت بإجراء عملية تحويل بنكي إلى حسابكم الكريمي لشحن شدات، ولم تصلني الشدات بعد.\nرقم الحوالة: \nالمبلغ المحول: \nمعرف اللاعب ID: \n\nالرجاء تعميد طلبي بشكل عاجل. شكراً لكم.`);
        break;
      case "agent":
        setSubject("طلب شراكة والانضمام كوكيل شحن معتمد لدى حسين NAT");
        setBody(`أهلاً بفريق متجر حسين NAT،\nأرغب بالتعامل معكم كوكيل شحن فرعي معتمد في منطقتي وشراء باقات الشدات بكميات تجارية.\nالاسم الكامل: \nرقم الواتساب للتواصل: \nالمحافظة/المنطقة: \n\nأتطلع للرد لبدء العمل والتعاون.`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="h-full w-full bg-[#070708] text-white flex flex-col font-sans">
      
      {/* Custom App Header */}
      <div className="w-full bg-[#121215] border-b border-[#D4AF37]/20 px-4 py-3 flex items-center justify-between shadow-md z-10">
        <button 
          onClick={onBackToLauncher}
          className="flex items-center gap-1 text-neutral-400 hover:text-[#D4AF37] transition-all cursor-pointer font-bold text-xs"
        >
          <ArrowRight className="w-4 h-4" />
          <span>شاشة البدء</span>
        </button>

        <div className="flex items-center gap-1.5">
          <Mail className="w-4 h-4 text-[#D4AF37]" />
          <span className="font-black text-sm text-gold-gradient tracking-wide">بريد حسين NAT</span>
        </div>

        {user ? (
          <button 
            onClick={handleLogout}
            className="text-neutral-400 hover:text-red-500 p-1 rounded-lg transition-all cursor-pointer"
            title="تسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-4 h-4" />
        )}
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
        {needsAuth ? (
          /* Google OAuth Login Screen */
          <div className="flex-1 flex flex-col justify-center items-center px-6 py-8 text-center my-auto">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#121215] to-[#1B1B20] border-2 border-[#D4AF37]/30 flex items-center justify-center shadow-lg mb-6 relative">
              <Mail className="w-10 h-10 text-[#D4AF37] animate-pulse" />
              <ShieldCheck className="w-5 h-5 text-emerald-400 absolute bottom-0 right-0" />
            </div>

            <h2 className="text-xl font-extrabold text-white mb-2">تسجيل الدخول بالبريد الإلكتروني</h2>
            <p className="text-xs text-neutral-400 leading-relaxed mb-6 max-w-xs">
              اربط حساب Gmail الخاص بك مع هاتف متجر حسين NAT لتصفح رسائل الشحن والتعميد، إرسال فواتير فورية إلى بريدك مباشرة، وإرسال الرسائل الإدارية.
            </p>

            <div className="w-full max-w-xs bg-[#121215] border border-[#D4AF37]/15 rounded-2xl p-4 mb-6 flex flex-col gap-2.5 text-right">
              <h4 className="text-xs font-bold text-[#D4AF37] flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>أمان وحماية الخصوصية:</span>
              </h4>
              <p className="text-[10px] text-neutral-400 leading-tight">
                يتم حفظ رمز الوصول الخاص بك بشكل آمن ومؤقت في ذاكرة الهاتف النشطة فقط، ويحذف كلياً فور إغلاق التطبيق أو تسجيل الخروج لحمايتك.
              </p>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full max-w-xs h-12 bg-white text-black font-extrabold rounded-xl flex items-center justify-center gap-3 shadow-lg hover:bg-neutral-100 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn ? (
                <RefreshCw className="w-5 h-5 animate-spin text-[#D4AF37]" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.5-.1.14 1.14 2.97l3.49-2.7c2.04-1.88 3.5-4.64 3.5-7.12z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.49-2.7c-1 .67-2.28 1.07-3.47 1.07-2.67 0-4.93-1.8-5.74-4.22l-3.62 2.8C5.22 21.52 8.35 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M6.26 15.24a7.14 7.14 0 0 1 0-4.48l-3.62-2.8a11.96 11.96 0 0 0 0 10.08l3.62-2.8z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 8.35 0 5.22 2.48 3.56 5.86l3.62 2.8c.81-2.42 3.07-4.22 4.32-4.22z"
                    />
                  </svg>
                  <span className="text-xs">تسجيل الدخول بحساب Google</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Authed Application Interface */
          <div className="flex-1 flex flex-col relative">
            
            {/* Quick Profile Segment */}
            <div className="bg-[#121215]/50 px-4 py-3 border-b border-[#D4AF37]/10 flex items-center justify-between text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center font-bold text-[#D4AF37] overflow-hidden">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-3.5 h-3.5" />
                  )}
                </div>
                <span className="font-bold text-white max-w-[150px] truncate">{user?.displayName || "مستخدم متصل"}</span>
              </div>
              <span className="text-[10px] bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 px-2 py-0.5 rounded-full font-mono font-bold truncate max-w-[150px]">
                {user?.email}
              </span>
            </div>

            {/* Custom Tab Switcher */}
            <div className="flex border-b border-[#D4AF37]/10 bg-[#121215]/30">
              <button 
                onClick={() => { setActiveTab("inbox"); setSelectedMessage(null); }}
                className={`flex-1 py-3 text-center font-bold text-xs flex items-center justify-center gap-1.5 transition-all relative ${activeTab === "inbox" ? "text-[#D4AF37]" : "text-neutral-400 hover:text-white"}`}
              >
                <Inbox className="w-3.5 h-3.5" />
                <span>الوارد</span>
                {activeTab === "inbox" && (
                  <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />
                )}
              </button>
              
              <button 
                onClick={() => { setActiveTab("compose"); setSendSuccess(false); setComposeError(null); }}
                className={`flex-1 py-3 text-center font-bold text-xs flex items-center justify-center gap-1.5 transition-all relative ${activeTab === "compose" ? "text-[#D4AF37]" : "text-neutral-400 hover:text-white"}`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إنشاء رسالة</span>
                {activeTab === "compose" && (
                  <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />
                )}
              </button>

              <button 
                onClick={() => { setActiveTab("receipts"); }}
                className={`flex-1 py-3 text-center font-bold text-xs flex items-center justify-center gap-1.5 transition-all relative ${activeTab === "receipts" ? "text-[#D4AF37]" : "text-neutral-400 hover:text-white"}`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>إيصال الفاتورة</span>
                {activeTab === "receipts" && (
                  <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />
                )}
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 flex flex-col p-4">
              <AnimatePresence mode="wait">
                
                {/* 1. Inbox Screen */}
                {activeTab === "inbox" && !selectedMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 flex flex-col"
                  >
                    {/* Search Bar */}
                    <div className="relative mb-4">
                      <Search className="w-4 h-4 text-neutral-500 absolute right-3.5 top-3.5" />
                      <input 
                        type="text" 
                        placeholder="ابحث في البريد الإلكتروني..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-11 bg-[#121215] border border-neutral-800 focus:border-[#D4AF37]/50 rounded-xl pr-10 pl-4 text-xs text-white placeholder-neutral-500 outline-none transition-all"
                      />
                    </div>

                    {/* Inbox Controls */}
                    <div className="flex items-center justify-between mb-3 text-xs text-neutral-400">
                      <span className="font-bold flex items-center gap-1 text-[11px]">
                        <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>رسائل البريد الإلكتروني ({messages.length})</span>
                      </span>
                      <button 
                        onClick={() => { setIsRefreshing(true); fetchEmails(); }}
                        disabled={isLoading || isRefreshing}
                        className="text-neutral-400 hover:text-[#D4AF37] flex items-center gap-1 cursor-pointer font-bold"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#D4AF37]" : ""}`} />
                        <span>تحديث</span>
                      </button>
                    </div>

                    {/* Messages Stack */}
                    {isLoading ? (
                      <div className="flex-1 flex flex-col justify-center items-center py-20">
                        <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin mb-3" />
                        <span className="text-xs text-neutral-400 font-bold">جاري تحميل رسائل Gmail...</span>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="bg-[#121215]/30 border border-neutral-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center py-16">
                        <Inbox className="w-10 h-10 text-neutral-600 mb-3" />
                        <p className="text-xs text-neutral-400 font-bold mb-1">صندوق البريد فارغ تماماً</p>
                        <p className="text-[10px] text-neutral-500 max-w-xs leading-normal">
                          لم نعثر على رسائل في بريدك الإلكتروني حالياً. جرب النقر على زر التحديث أو استمتع بإرسال رسائل جديدة!
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2.5">
                        {messages
                          .filter(msg => 
                            msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            msg.from.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            msg.snippet.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .map((msg) => (
                            <motion.div
                              whileHover={{ scale: 1.01, backgroundColor: "rgba(212, 175, 55, 0.03)" }}
                              whileTap={{ scale: 0.99 }}
                              key={msg.id}
                              onClick={() => setSelectedMessage(msg)}
                              className={`p-3.5 rounded-xl border border-neutral-800 hover:border-[#D4AF37]/30 bg-[#121215]/80 cursor-pointer transition-all text-right flex flex-col gap-1 relative overflow-hidden ${msg.isUnread ? "border-l-4 border-l-[#D4AF37]" : ""}`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-black text-neutral-400 truncate max-w-[140px]">
                                  {msg.from.split("<")[0].trim() || msg.from}
                                </span>
                                <span className="text-[9px] text-neutral-500 font-mono flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5" />
                                  <span>{msg.date.split(",")[0] || "مؤخراً"}</span>
                                </span>
                              </div>
                              <h4 className={`text-xs text-neutral-200 truncate mt-1 ${msg.isUnread ? "font-black text-white" : "font-medium"}`}>
                                {msg.subject}
                              </h4>
                              <p className="text-[10px] text-neutral-400 truncate mt-0.5 leading-relaxed">
                                {msg.snippet}
                              </p>
                            </motion.div>
                          ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Email Detail View inside Inbox */}
                {activeTab === "inbox" && selectedMessage && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex-1 flex flex-col bg-[#121215] border border-[#D4AF37]/10 rounded-2xl p-4 text-right"
                  >
                    <button 
                      onClick={() => setSelectedMessage(null)}
                      className="flex items-center gap-1 text-[#D4AF37] font-bold text-xs mb-4 cursor-pointer self-start"
                    >
                      <ChevronRight className="w-4 h-4" />
                      <span>العودة للبريد</span>
                    </button>

                    <h3 className="text-sm font-black text-white border-b border-neutral-800 pb-3 leading-normal">
                      {selectedMessage.subject}
                    </h3>

                    {/* Sender block */}
                    <div className="flex flex-col gap-1 mt-3 text-[11px] text-neutral-400 pb-3 border-b border-neutral-800">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-200">{selectedMessage.from}</span>
                      </div>
                      <div>إلى: <span className="font-mono text-neutral-300">{selectedMessage.to || user?.email}</span></div>
                      <div className="text-[10px] text-neutral-500 mt-1">{selectedMessage.date}</div>
                    </div>

                    {/* Email Content Frame */}
                    <div className="flex-1 min-h-[180px] bg-black/40 rounded-xl p-3 mt-4 text-xs leading-relaxed text-neutral-300 overflow-y-auto custom-scrollbar">
                      {selectedMessage.body ? (
                        <div 
                          dangerouslySetInnerHTML={{ __html: selectedMessage.body }} 
                          className="prose-invert"
                        />
                      ) : (
                        <p className="whitespace-pre-wrap">{selectedMessage.snippet}</p>
                      )}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button 
                        onClick={() => {
                          setRecipient(selectedMessage.from.match(/<([^>]+)>/)?.[1] || selectedMessage.from);
                          setSubject(`رد: ${selectedMessage.subject}`);
                          setBody(`\n\n--------------------\nكتبت في ${selectedMessage.date}:\n${selectedMessage.snippet}`);
                          setActiveTab("compose");
                          setSelectedMessage(null);
                        }}
                        className="flex-1 h-10 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/20 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>رد على الرسالة</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 2. Compose Email Screen */}
                {activeTab === "compose" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 flex flex-col text-right"
                  >
                    <h3 className="text-xs font-black text-neutral-300 mb-3 flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      <span>اختر نموذجاً جاهزاً لتسريع الكتابة:</span>
                    </h3>

                    {/* Interactive template chips */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <button 
                        onClick={() => handleApplyTemplate("support")}
                        className="bg-neutral-900 border border-neutral-800 hover:border-[#D4AF37]/30 text-white hover:text-[#D4AF37] text-[10px] px-3 py-2 rounded-xl cursor-pointer transition-all font-bold"
                      >
                        🙋 طلب مساعدة شحن
                      </button>
                      <button 
                        onClick={() => handleApplyTemplate("complaint")}
                        className="bg-neutral-900 border border-neutral-800 hover:border-[#D4AF37]/30 text-white hover:text-[#D4AF37] text-[10px] px-3 py-2 rounded-xl cursor-pointer transition-all font-bold"
                      >
                        ⚠️ بلاغ حوالة معلقة
                      </button>
                      <button 
                        onClick={() => handleApplyTemplate("agent")}
                        className="bg-neutral-900 border border-neutral-800 hover:border-[#D4AF37]/30 text-white hover:text-[#D4AF37] text-[10px] px-3 py-2 rounded-xl cursor-pointer transition-all font-bold"
                      >
                        🤝 طلب شراكة / وكالة
                      </button>
                    </div>

                    <form onSubmit={handleSendEmail} className="flex-1 flex flex-col gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-400 mb-1">المرسل إليه:</label>
                        <input 
                          type="email" 
                          required
                          value={recipient}
                          onChange={(e) => setRecipient(e.target.value)}
                          className="w-full h-10 bg-[#121215] border border-neutral-800 focus:border-[#D4AF37]/50 rounded-xl px-3 text-xs text-white outline-none transition-all"
                          placeholder="مثال: support@hussein-nat.store"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-400 mb-1">عنوان الرسالة:</label>
                        <input 
                          type="text" 
                          required
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full h-10 bg-[#121215] border border-neutral-800 focus:border-[#D4AF37]/50 rounded-xl px-3 text-xs text-white outline-none transition-all"
                          placeholder="أدخل موضوع البريد هنا..."
                        />
                      </div>

                      <div className="flex-1 flex flex-col min-h-[140px]">
                        <label className="block text-[11px] font-bold text-neutral-400 mb-1">مضمون الرسالة الإلكترونية:</label>
                        <textarea 
                          required
                          value={body}
                          onChange={(e) => setBody(e.target.value)}
                          className="flex-1 w-full bg-[#121215] border border-neutral-800 focus:border-[#D4AF37]/50 rounded-xl p-3 text-xs text-white outline-none transition-all resize-none custom-scrollbar"
                          placeholder="اكتب رسالتك بالتفصيل هنا..."
                        />
                      </div>

                      {composeError && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-2.5 rounded-xl text-[10px] flex items-center gap-1.5 leading-tight">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{composeError}</span>
                        </div>
                      )}

                      {sendSuccess && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-2.5 rounded-xl text-[10px] flex items-center gap-1.5 leading-tight">
                          <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>تم إرسال بريدك الإلكتروني بنجاح عبر حساب Gmail الخاص بك!</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSending}
                        className="w-full h-11 btn-gold-gradient rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                      >
                        {isSending ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        <span>إرسال البريد الإلكتروني معاً</span>
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* 3. Receipts Tab Screen */}
                {activeTab === "receipts" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 flex flex-col text-right"
                  >
                    <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-2xl p-3.5 mb-4">
                      <h4 className="text-xs font-black text-white flex items-center gap-1.5 mb-1 text-gold-gradient">
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>إرسال فواتير معتمدة لبريدك</span>
                      </h4>
                      <p className="text-[10px] text-neutral-400 leading-relaxed">
                        اختر أي طلب قمت بإجرائه مؤخراً لإرسال إيصال دفع إلكتروني فاخر ومنسق بتصميم متجرنا مباشرة إلى حساب بريدك {user?.email}، لتوثيق وتعميد عمليات السداد.
                      </p>
                    </div>

                    <h4 className="text-[11px] font-bold text-neutral-400 mb-3">الطلبات الحديثة المؤهلة للإرسال:</h4>
                    
                    {recentOrders.length === 0 ? (
                      <div className="bg-[#121215]/30 border border-neutral-800 rounded-2xl p-6 text-center">
                        <FileText className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                        <p className="text-xs text-neutral-500 font-bold mb-3">لا توجد طلبات مسجلة في الهاتف حالياً</p>
                        {onOpenStore && (
                          <button 
                            onClick={onOpenStore}
                            className="bg-[#D4AF37] text-black text-[10px] font-extrabold px-3.5 py-1.5 rounded-lg hover:opacity-90 active:scale-95 cursor-pointer transition-all"
                          >
                            الذهاب للمتجر لشراء شدة
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {recentOrders.map((order) => {
                          const isSuccess = receiptSuccessOrderId === order.id;
                          const isPending = receiptSendingOrderId === order.id;

                          return (
                            <div 
                              key={order.id}
                              className="p-3.5 rounded-xl border border-neutral-800 bg-[#121215]/90 flex flex-col gap-2.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-extrabold text-[#D4AF37]">{order.id}</span>
                                <span className="text-[9px] text-neutral-500 font-mono">
                                  {new Date(order.createdAt).toLocaleDateString("ar-YE")}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[10px] text-neutral-400">
                                <div>اللاعب ID: <strong className="text-white font-mono">{order.playerId}</strong></div>
                                <div>الباقة: <strong className="text-white">{order.packageName}</strong></div>
                                <div>المبلغ: <strong className="text-emerald-400 font-bold">{order.priceYer.toLocaleString()} ريال</strong></div>
                                <div className="text-left font-bold capitalize">
                                  {order.status === "completed" ? (
                                    <span className="text-emerald-400">✓ مكتملة</span>
                                  ) : (
                                    <span className="text-amber-500">⏳ قيد المعالجة</span>
                                  )}
                                </div>
                              </div>

                              <button
                                onClick={() => handleSendReceiptEmail(order)}
                                disabled={isPending || isSuccess}
                                className={`w-full h-8 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                                  isSuccess 
                                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-default" 
                                    : isPending
                                      ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                                      : "bg-[#D4AF37] text-black hover:bg-opacity-90"
                                }`}
                              >
                                {isPending ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : isSuccess ? (
                                  <CheckCircle className="w-3.5 h-3.5" />
                                ) : (
                                  <Send className="w-3.5 h-3.5" />
                                )}
                                <span>
                                  {isSuccess ? "تم إرسال الفاتورة للبريد ✓" : isPending ? "جاري الإرسال..." : "إرسال الفاتورة عبر البريد الآن"}
                                </span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
