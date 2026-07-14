import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

// Sub-components
import PhoneFrame from "./components/PhoneFrame";
import SplashScreen from "./components/SplashScreen";
import HomeScreen from "./components/HomeScreen";
import PurchaseScreen from "./components/PurchaseScreen";
import PaymentScreen from "./components/PaymentScreen";
import ConfirmationScreen from "./components/ConfirmationScreen";
import TrackingScreen from "./components/TrackingScreen";
import PaymentMethodsScreen from "./components/PaymentMethodsScreen";
import ContactScreen from "./components/ContactScreen";
import LauncherScreen from "./components/LauncherScreen";
import WhatsAppScreen from "./components/WhatsAppScreen";
import FifaScreen from "./components/FifaScreen";
import AiBrowserScreen from "./components/AiBrowserScreen";
import ShababAlBombScreen from "./components/ShababAlBombScreen";
import SnakeGameScreen from "./components/SnakeGameScreen";
import GmailScreen from "./components/GmailScreen";

// Types and static data
import { UcPackage, Order } from "./types";

type ScreenType = 
  | "splash" 
  | "launcher"
  | "whatsapp"
  | "fifa"
  | "aibrowser"
  | "shabab"
  | "snake"
  | "gmail"
  | "home" 
  | "purchase" 
  | "payment" 
  | "confirmation" 
  | "tracking" 
  | "payment_methods" 
  | "contact";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("splash");
  const [screenHistory, setScreenHistory] = useState<ScreenType[]>([]);
  
  // Checkout & Order State
  const [playerId, setPlayerId] = useState<string>("");
  const [selectedPackage, setSelectedPackage] = useState<UcPackage | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Advanced Screen Navigation with Back-Stack History support
  const navigateTo = (screen: ScreenType) => {
    setScreenHistory((prev) => [...prev, currentScreen]);
    setCurrentScreen(screen);
  };

  const handleBack = () => {
    if (screenHistory.length === 0) return;
    const previous = screenHistory[screenHistory.length - 1];
    setScreenHistory((prev) => prev.slice(0, -1));
    setCurrentScreen(previous);
  };

  const handleHomeSelectPackage = (pkg: UcPackage) => {
    setSelectedPackage(pkg);
    navigateTo("purchase");
  };

  const handlePurchaseToPayment = (id: string, pkg: UcPackage) => {
    setPlayerId(id);
    setSelectedPackage(pkg);
    navigateTo("payment");
  };

  const handleOrderSubmitted = (order: Order) => {
    setActiveOrder(order);
    // Clear back stack to lock the order completion screen and prevent backing into form
    setScreenHistory(["home"]);
    setCurrentScreen("confirmation");
  };

  const handleTrackSelectOrder = (order: Order) => {
    setActiveOrder(order);
    navigateTo("confirmation");
  };

  // Dynamic Title depending on screen
  const getScreenTitle = (): string => {
    switch (currentScreen) {
      case "home":
        return "حسين NAT";
      case "purchase":
        return "شحن PUBG Mobile";
      case "payment":
        return "تأكيد الدفع للشحن";
      case "confirmation":
        return "فاتورة الشحن والتعميد";
      case "tracking":
        return "متابعة وتتبع الطلبات";
      case "payment_methods":
        return "طرق الدفع المتوفرة";
      case "contact":
        return "الدعم والتواصل المباشر";
      case "gmail":
        return "بريد حسين NAT";
      default:
        return "حسين NAT";
    }
  };

  // Screen Router / Render Engine
  const renderScreen = () => {
    switch (currentScreen) {
      case "splash":
        return (
          <SplashScreen 
            onFinish={() => {
              setCurrentScreen("launcher");
              setScreenHistory([]);
            }} 
          />
        );
      
      case "launcher":
        return (
          <LauncherScreen 
            onOpenStore={() => {
              setScreenHistory([]);
              setCurrentScreen("home");
            }}
            onOpenWhatsApp={() => {
              setScreenHistory([]);
              setCurrentScreen("whatsapp");
            }}
            onOpenFifa={() => {
              setScreenHistory([]);
              setCurrentScreen("fifa");
            }}
            onOpenAiBrowser={() => {
              setScreenHistory([]);
              setCurrentScreen("aibrowser");
            }}
            onOpenShabab={() => {
              setScreenHistory([]);
              setCurrentScreen("shabab");
            }}
            onOpenSnake={() => {
              setScreenHistory([]);
              setCurrentScreen("snake");
            }}
            onOpenGmail={() => {
              setScreenHistory([]);
              setCurrentScreen("gmail");
            }}
          />
        );

      case "whatsapp":
        return (
          <WhatsAppScreen 
            onBackToLauncher={() => {
              setScreenHistory([]);
              setCurrentScreen("launcher");
            }}
            onOpenStore={() => {
              setScreenHistory([]);
              setCurrentScreen("home");
            }}
          />
        );

      case "fifa":
        return (
          <FifaScreen 
            onBackToLauncher={() => {
              setScreenHistory([]);
              setCurrentScreen("launcher");
            }}
            onOpenStore={() => {
              setScreenHistory([]);
              setCurrentScreen("home");
            }}
          />
        );

      case "aibrowser":
        return (
          <AiBrowserScreen 
            onClose={() => {
              setScreenHistory([]);
              setCurrentScreen("launcher");
            }}
            onOpenStore={() => {
              setScreenHistory([]);
              setCurrentScreen("home");
            }}
          />
        );

      case "shabab":
        return (
          <ShababAlBombScreen 
            onClose={() => {
              setScreenHistory([]);
              setCurrentScreen("launcher");
            }}
          />
        );

      case "snake":
        return (
          <SnakeGameScreen 
            onClose={() => {
              setScreenHistory([]);
              setCurrentScreen("launcher");
            }}
          />
        );

      case "gmail":
        return (
          <GmailScreen 
            onBackToLauncher={() => {
              setScreenHistory([]);
              setCurrentScreen("launcher");
            }}
            onOpenStore={() => {
              setScreenHistory([]);
              setCurrentScreen("home");
            }}
          />
        );

      case "home":
        return (
          <HomeScreen 
            onNavigate={(scr) => navigateTo(scr as ScreenType)}
            onSelectPackage={handleHomeSelectPackage}
          />
        );

      case "purchase":
        return (
          <PurchaseScreen 
            preSelectedPackage={selectedPackage}
            onProceedToPayment={handlePurchaseToPayment}
          />
        );

      case "payment":
        if (!selectedPackage) {
          setCurrentScreen("purchase");
          return null;
        }
        return (
          <PaymentScreen 
            playerId={playerId}
            selectedPackage={selectedPackage}
            onBackToPurchase={() => handleBack()}
            onOrderSuccess={handleOrderSubmitted}
          />
        );

      case "confirmation":
        if (!activeOrder) {
          setCurrentScreen("home");
          return null;
        }
        return (
          <ConfirmationScreen 
            order={activeOrder}
            onNavigate={(scr) => navigateTo(scr as ScreenType)}
          />
        );

      case "tracking":
        return (
          <TrackingScreen 
            onSelectOrder={handleTrackSelectOrder}
            onNavigate={(scr) => navigateTo(scr as ScreenType)}
          />
        );

      case "payment_methods":
        return <PaymentMethodsScreen />;

      case "contact":
        return <ContactScreen />;

      default:
        return (
          <HomeScreen 
            onNavigate={(scr) => navigateTo(scr as ScreenType)}
            onSelectPackage={handleHomeSelectPackage}
          />
        );
    }
  };

  // Decide if we should show the back button in header
  const showBackButton = currentScreen !== "splash" && currentScreen !== "home" && currentScreen !== "launcher" && currentScreen !== "whatsapp" && currentScreen !== "fifa" && currentScreen !== "aibrowser" && currentScreen !== "shabab" && currentScreen !== "snake" && currentScreen !== "gmail";

  // Hide the bottom navigation bar on certain screens
  const showBottomNav = currentScreen !== "splash" && currentScreen !== "launcher" && currentScreen !== "whatsapp" && currentScreen !== "fifa" && currentScreen !== "aibrowser" && currentScreen !== "shabab" && currentScreen !== "snake" && currentScreen !== "gmail";

  // Hide top header on splash, launcher, and whatsapp
  const showHeader = currentScreen !== "splash" && currentScreen !== "launcher" && currentScreen !== "whatsapp" && currentScreen !== "fifa" && currentScreen !== "aibrowser" && currentScreen !== "shabab" && currentScreen !== "snake" && currentScreen !== "gmail";

  return (
    <PhoneFrame
      currentScreen={currentScreen}
      onNavigate={(scr) => navigateTo(scr as ScreenType)}
      onBack={showBackButton ? handleBack : null}
      title={getScreenTitle()}
      showBottomNav={showBottomNav}
      showHeader={showHeader}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="flex-1 flex flex-col"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </PhoneFrame>
  );
}
