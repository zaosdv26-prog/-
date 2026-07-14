import { UcPackage, BankInfo } from "./types";

export const UC_PACKAGES: UcPackage[] = [
  {
    id: 1,
    ucAmount: 60,
    bonusUc: 0,
    priceUsd: 0.99,
    priceYer: 1500,
    isPopular: false,
  },
  {
    id: 2,
    ucAmount: 325,
    bonusUc: 25,
    priceUsd: 4.99,
    priceYer: 7500,
    isPopular: true,
    badgeText: "الأكثر مبيعاً 🔥",
  },
  {
    id: 3,
    ucAmount: 660,
    bonusUc: 60,
    priceUsd: 9.99,
    priceYer: 15000,
    isPopular: false,
    badgeText: "خيار رائع 🌟",
  },
  {
    id: 4,
    ucAmount: 1800,
    bonusUc: 300,
    priceUsd: 24.99,
    priceYer: 37500,
    isPopular: false,
  },
  {
    id: 5,
    ucAmount: 3850,
    bonusUc: 850,
    priceUsd: 49.99,
    priceYer: 75000,
    isPopular: false,
    badgeText: "توفير ممتاز 💰",
  },
  {
    id: 6,
    ucAmount: 8100,
    bonusUc: 2100,
    priceUsd: 99.99,
    priceYer: 150000,
    isPopular: true,
    badgeText: "أفضل قيمة ✨",
  }
];

export const YEMEN_BANKS: BankInfo[] = [
  {
    name: "بنك الكريمي الإسلامي",
    accountNo: "300782985",
    accountHolder: "حسين سالم حسين حنش (حسين NAT)",
    logo: "🏦",
  },
  {
    name: "محفظة الكريمي (جوال الكريمي)",
    accountNo: "782985197",
    accountHolder: "حسين سالم حسين حنش (حسين NAT)",
    logo: "📱",
  },
  {
    name: "محفظة ون كاش (One Cash)",
    accountNo: "736887081",
    accountHolder: "حسين سالم حسين حنش (حسين NAT)",
    logo: "💳",
  }
];

export const CONTACT_INFO = {
  phone: "+967782985197",
  whatsapp1: "967782985197",
  whatsapp2: "967736887081",
  telegram: "Hussein_NAT",
};

import { WhatsAppChat, WhatsAppStatus, WhatsAppCall } from "./types";

export const MOCK_WHATSAPP_CHATS: WhatsAppChat[] = [
  {
    id: "hussein_boss",
    contactName: "حسين سالم حنش (المدير 👑)",
    contactAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", // Will use beautiful avatar
    verifiedBadge: true,
    onlineStatus: "متصل الآن",
    lastMessageText: "يا أهلاً بك يا غالي! تفضل كيف أقدر أخدمك اليوم بخصوص شحن ببجي؟",
    lastMessageTime: "3:45 م",
    unreadCount: 1,
    messages: [
      {
        id: "m1",
        sender: "hussein_boss",
        text: "السلام عليكم ورحمة الله وبركاته، مرحباً بك في المتجر الرسمي والوحيد المعتمد لشحن شدات ببجي (حسين NAT) ⚡",
        timestamp: "3:43 م",
        isMine: false,
        isRead: true
      },
      {
        id: "m2",
        sender: "hussein_boss",
        text: "يا أهلاً بك يا غالي! تفضل كيف أقدر أخدمك اليوم بخصوص شحن ببجي؟",
        timestamp: "3:45 م",
        isMine: false,
        isRead: false
      }
    ]
  },
  {
    id: "technical_support",
    contactName: "الدعم الفني والتعميد الفوري 🛠️",
    contactAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    verifiedBadge: true,
    onlineStatus: "نشط منذ دقائق",
    lastMessageText: "تم تعميد الحوالة وإرسال الشدات فوراً للآيدي بالثواني! تفضل بالتشييك.",
    lastMessageTime: "2:30 م",
    unreadCount: 0,
    messages: [
      {
        id: "ms1",
        sender: "me",
        text: "مرحبا يا غالي، رسلت الحوالة على الكريمي وتفاصيلها كالتالي",
        timestamp: "2:25 م",
        isMine: true,
        isRead: true
      },
      {
        id: "ms2",
        sender: "technical_support",
        text: "تم تعميد الحوالة وإرسال الشدات فوراً للآيدي بالثواني! تفضل بالتشييك.",
        timestamp: "2:30 م",
        isMine: false,
        isRead: true
      }
    ]
  },
  {
    id: "distribution_group",
    contactName: "قروب موزعون حسين NAT المعتمدين 🚀",
    contactAvatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=150&q=80",
    verifiedBadge: false,
    onlineStatus: "آخر ظهور اليوم",
    lastMessageText: "يا شباب توفرت بطاقات رويال باس بأسعار منافسة جداً لا تفوتكم!",
    lastMessageTime: "12:15 م",
    unreadCount: 3,
    messages: [
      {
        id: "mg1",
        sender: "أبو بندر (موزع)",
        text: "السلام عليكم، هل شحن الرويال باس شغال الآن؟",
        timestamp: "12:10 م",
        isMine: false,
        isRead: true
      },
      {
        id: "mg2",
        sender: "حسين سالم حنش",
        text: "أهلاً يا أبو بندر، نعم شغال فوري وتلقائي ⚡",
        timestamp: "12:12 م",
        isMine: false,
        isRead: true
      },
      {
        id: "mg3",
        sender: "خالد الحربي (مبيعات)",
        text: "يا شباب توفرت بطاقات رويال باس بأسعار منافسة جداً لا تفوتكم!",
        timestamp: "12:15 م",
        isMine: false,
        isRead: false
      }
    ]
  }
];

export const MOCK_WHATSAPP_STATUSES: WhatsAppStatus[] = [
  {
    id: "hussein_boss",
    contactName: "حسين سالم حنش",
    contactAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    timeAgo: "منذ ساعة",
    stories: [
      {
        id: "s1",
        mediaUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
        caption: "تم وبحمد الله شحن أكثر من 15,000 شدة لعملائنا الكرام اليوم فقط! ثقتكم سر تميزنا 💛",
        type: "image"
      },
      {
        id: "s2",
        mediaUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
        caption: "عروض الصيف الحارقة 🔥 احصل على باقة 8100 UC وخذ فوقها 2100 UC هدية مجانية فورية!",
        type: "image"
      }
    ]
  },
  {
    id: "technical_support",
    contactName: "الدعم الفني للتعميد",
    contactAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    timeAgo: "منذ 4 ساعات",
    stories: [
      {
        id: "s3",
        mediaUrl: "",
        caption: "نظام الشحن التلقائي متصل ومستقر ومباشر عبر خوادم Midasbuy ⚡ سرعة الشحن لا تتجاوز 10 ثواني من تأكيد الحوالة!",
        type: "text",
        bgColor: "linear-gradient(135deg, #11998e, #38ef7d)"
      }
    ]
  }
];

export const MOCK_WHATSAPP_CALLS: WhatsAppCall[] = [
  {
    id: "c1",
    contactName: "حسين سالم حنش (المدير)",
    contactAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    time: "اليوم، 3:30 م",
    type: "voice",
    status: "incoming"
  },
  {
    id: "c2",
    contactName: "الدعم الفني والتعميد الفوري",
    contactAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    time: "أمس، 9:15 م",
    type: "video",
    status: "missed"
  },
  {
    id: "c3",
    contactName: "حسين سالم حنش (المدير)",
    contactAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    time: "أمس، 5:40 م",
    type: "voice",
    status: "outgoing"
  }
];

