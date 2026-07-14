import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App if not already done
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

// Add requested Gmail scopes
provider.addScope("https://mail.google.com/");
provider.addScope("https://www.googleapis.com/auth/gmail.readonly");
provider.addScope("https://www.googleapis.com/auth/gmail.send");
provider.addScope("https://www.googleapis.com/auth/gmail.compose");

// Flag to track sign-in in progress
let isSigningIn = false;
// Cache access token in memory (never persist to localStorage/sessionStorage)
let cachedAccessToken: string | null = null;

export interface AuthStateListener {
  (user: User | null, token: string | null): void;
}

const listeners: Set<AuthStateListener> = new Set();

// Trigger all active listeners on auth change
const notifyListeners = (user: User | null, token: string | null) => {
  listeners.forEach((listener) => listener(user, token));
};

// Initialize auth state listener
export const initAuth = (listener: AuthStateListener) => {
  listeners.add(listener);
  
  // Call initially with current state
  listener(auth.currentUser, cachedAccessToken);
  
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      cachedAccessToken = null;
    }
    notifyListeners(user, cachedAccessToken);
  });

  return () => {
    listeners.delete(listener);
    unsubscribe();
  };
};

// Google sign-in trigger (Must be called from a user action/click)
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("لم يتم الحصول على رمز الوصول (Access Token) من مصادقة Google.");
    }

    cachedAccessToken = credential.accessToken;
    notifyListeners(result.user, cachedAccessToken);
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error("Firebase Google Sign-In error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
  notifyListeners(null, null);
};
