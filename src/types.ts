export interface UcPackage {
  id: number;
  ucAmount: number;
  bonusUc: number;
  priceUsd: number;
  priceYer: number;
  isPopular: boolean;
  badgeText?: string;
}

export type PaymentMethodType = "credit_card" | "bank_transfer" | "cash";

export interface Order {
  id: string;
  playerId: string;
  packageName: string;
  packageUc: number;
  priceUsd: number;
  priceYer: number;
  paymentMethod: PaymentMethodType;
  paymentDetails: {
    // Credit Card details
    cardHolder?: string;
    cardNumber?: string;
    last4?: string;
    
    // Bank Transfer details
    bankName?: string;
    transferNo?: string;
    senderName?: string;
    
    // Cash details
    contactName?: string;
    contactPhone?: string;
    agentName?: string;
  };
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface BankInfo {
  name: string;
  accountNo: string;
  accountHolder: string;
  logo: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isMine: boolean;
  isVoice?: boolean;
  voiceDuration?: string;
  isImage?: boolean;
  imageUrl?: string;
  isRead?: boolean;
}

export interface WhatsAppChat {
  id: string;
  contactName: string;
  contactAvatar: string;
  verifiedBadge?: boolean;
  onlineStatus: "متصل الآن" | "نشط منذ دقائق" | "جاري الكتابة..." | "آخر ظهور اليوم";
  lastMessageText: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface WhatsAppStatus {
  id: string;
  contactName: string;
  contactAvatar: string;
  timeAgo: string;
  stories: {
    id: string;
    mediaUrl: string;
    caption?: string;
    type: "image" | "text";
    bgColor?: string;
  }[];
}

export interface WhatsAppCall {
  id: string;
  contactName: string;
  contactAvatar: string;
  time: string;
  type: "voice" | "video";
  status: "incoming" | "outgoing" | "missed";
}
