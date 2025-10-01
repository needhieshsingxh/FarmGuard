import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useReducer,
} from "react";
import { Alert, UserProfile, CommunityPost, Role, Comment } from "./types";
import { DUMMY_ALERTS, DUMMY_COMMUNITY_POSTS } from "./constants";
import ConfirmDialog from "./components/ui/ConfirmDialog";

// --- TYPE DEFINITIONS ---
type Theme = "light" | "dark";
export type Language = "en" | "hi" | "ta" | "te" | "bn" | "mr";
export type CommunityPostWithState = CommunityPost & {
  showComments: boolean;
  newCommentText: string;
};

// --- POSTS REDUCER ---
type PostAction =
  | { type: "SET_POSTS"; payload: CommunityPostWithState[] }
  | { type: "DELETE_POST"; payload: { postId: string } }
  | { type: "DELETE_COMMENT"; payload: { postId: string; commentId: string } }
  | {
      type: "ADD_POST";
      payload: { title: string; content: string; user: UserProfile };
    }
  | { type: "ADD_COMMENT"; payload: { postId: string; user: UserProfile } }
  | { type: "TOGGLE_COMMENTS"; payload: { postId: string } }
  | { type: "SET_COMMENT_TEXT"; payload: { postId: string; text: string } };

const postsReducer = (
  state: CommunityPostWithState[],
  action: PostAction
): CommunityPostWithState[] => {
  switch (action.type) {
    case "SET_POSTS":
      return action.payload;

    case "DELETE_POST":
      return state.filter((p) => p.id !== action.payload.postId);

    case "DELETE_COMMENT":
      return state.map((p) =>
        p.id === action.payload.postId
          ? {
              ...p,
              comments: p.comments.filter(
                (c) => c.id !== action.payload.commentId
              ),
            }
          : p
      );

    case "ADD_POST": {
      const { title, content, user } = action.payload;
      const newPost: CommunityPostWithState = {
        id: `P${Date.now()}`,
        authorId: user.id,
        author: user.name,
        avatar: user.avatar,
        date: "Just now",
        title,
        content,
        views: 0,
        likes: 0,
        dislikes: 0,
        userVote: null,
        comments: [],
        showComments: false,
        newCommentText: "",
      };
      return [newPost, ...state];
    }

    case "ADD_COMMENT": {
      const { postId, user } = action.payload;
      const post = state.find((p) => p.id === postId);
      if (!post || !post.newCommentText.trim()) return state;

      const newComment: Comment = {
        id: `C${Date.now()}`,
        authorId: user.id,
        author: user.name,
        avatar: user.avatar,
        content: post.newCommentText,
        likes: 0,
        dislikes: 0,
        userVote: null,
      };

      return state.map((p) =>
        p.id === postId
          ? { ...p, comments: [...p.comments, newComment], newCommentText: "" }
          : p
      );
    }

    case "TOGGLE_COMMENTS":
      return state.map((p) =>
        p.id === action.payload.postId
          ? { ...p, showComments: !p.showComments }
          : p
      );

    case "SET_COMMENT_TEXT":
      return state.map((p) =>
        p.id === action.payload.postId
          ? { ...p, newCommentText: action.payload.text }
          : p
      );

    default:
      return state;
  }
};

// --- THEME CONTEXT ---
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a AppProvider");
  }
  return context;
};

// --- LANGUAGE CONTEXT ---
export const LANGUAGES: { code: Language; name: string }[] = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी" },
  { code: "ta", name: "தமிழ்" },
  { code: "te", name: "తెలుగు" },
  { code: "bn", name: "বাংলা" },
  { code: "mr", name: "मराठी" },
];

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a AppProvider");
  }
  return context;
};

// --- USER, AUTH & COMMUNITY CONTEXT (MERGED) ---
const farmerProfile: UserProfile = {
  id: "user-rajesh-patel",
  name: "Rajesh Patel",
  email: "rajesh.p@example.com",
  avatar: "https://ui-avatars.com/api/?name=F&background=22c55e&color=fff",
  notifications: { email: true, push: true },
};

const adminProfile: UserProfile = {
  id: "user-admin",
  name: "Admin User",
  email: "admin@farmguard.gov.in",
  avatar: "https://ui-avatars.com/api/?name=G&background=3b82f6&color=fff",
  notifications: { email: true, push: false },
};

const consumerProfile: UserProfile = {
  id: "user-consumer",
  name: "Consumer User",
  email: "consumer@example.com",
  avatar: "https://ui-avatars.com/api/?name=C&background=f97316&color=fff",
  notifications: { email: false, push: false },
};

const defaultProfile: UserProfile = {
  id: "user-guest",
  name: "Guest",
  email: "",
  avatar: "https://ui-avatars.com/api/?name=G&background=6b7280&color=fff",
  notifications: { email: false, push: false },
};

const getProfileByRole = (role: Role | null): UserProfile => {
  switch (role) {
    case Role.Farmer:
    case Role.Vet:
      return farmerProfile;
    case Role.Admin:
      return adminProfile;
    case Role.Consumer:
      return consumerProfile;
    default:
      return defaultProfile;
  }
};

interface AuthState {
  isAuthenticated: boolean;
  role: Role | null;
}

interface UserContextType {
  // User & Auth
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  authState: AuthState;
  login: (role: Role) => void;
  logout: () => void;
  // Community
  posts: CommunityPostWithState[];
  addNewPost: (title: string, content: string) => void;
  deletePost: (postId: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
  postComment: (postId: string) => void;
  toggleComments: (postId: string) => void;
  handleCommentChange: (postId: string, text: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within an AppProvider");
  }
  return context;
};

// --- NOTIFICATION CONTEXT ---
interface NotificationContextType {
  notifications: Alert[];
  addNotification: (notification: Alert) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within an AppProvider");
  }
  return context;
};

// --- TRANSLATIONS ---
interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

const translations: Translations = {
  // General
  farmGuard: {
    en: "FarmGuard",
    hi: "फार्मगार्ड",
    ta: "பார்ம்கார்டு",
    te: "ఫార్మ్‌గార్డ్",
    bn: "ফার্মগার্ড",
    mr: "फार्मगार्ड",
  },
  role: {
    en: "Role",
    hi: "भूमिका",
    ta: "பங்கு",
    te: "పాత్ర",
    bn: "ভূমিকা",
    mr: "भूमिका",
  },
  status: {
    en: "Status",
    hi: "स्थिति",
    ta: "நிலை",
    te: "స్థితి",
    bn: "স্ট্যাটাস",
    mr: "स्थिती",
  },
  date: {
    en: "Date",
    hi: "तारीख",
    ta: "தேதி",
    te: "తేదీ",
    bn: "তারিখ",
    mr: "तारीख",
  },
  farmer: {
    en: "Farmer",
    hi: "किसान",
    ta: "விவசாயி",
    te: "రైతు",
    bn: "কৃষক",
    mr: "शेतकरी",
  },
  veterinarian: {
    en: "Veterinarian",
    hi: "पशुचिकित्सक",
    ta: "கால்நடை மருத்துவர்",
    te: "పశువైద్యుడు",
    bn: "পশুচিকিত্সক",
    mr: "पशुवैद्य",
  },
  administrator: {
    en: "Administrator",
    hi: "प्रशासक",
    ta: "நிர்வாகி",
    te: "నిర్వాహకుడు",
    bn: "প্রশাসক",
    mr: "प्रशासक",
  },
  consumer: {
    en: "Consumer",
    hi: "उपभोक्ता",
    ta: "நுகர்வோர்",
    te: "వినియోగదారు",
    bn: "ভোক্তা",
    mr: "ग्राहक",
  },

  // Navbar & Footer
  home: {
    en: "Home",
    hi: "होम",
    ta: "முகப்பு",
    te: "హోమ్",
    bn: "হোম",
    mr: "मुख्यपृष्ठ",
  },
  features: {
    en: "Features",
    hi: "विशेषताएँ",
    ta: "அம்சங்கள்",
    te: "ఫీచర్లు",
    bn: "বৈশিষ্ট্য",
    mr: "वैशिष्ट्ये",
  },
  solutions: {
    en: "Solutions",
    hi: "समाधान",
    ta: "தீர்வுகள்",
    te: "పరిష్కారాలు",
    bn: "সমাধান",
    mr: "उपाय",
  },
  aboutUs: {
    en: "About Us",
    hi: "हमारे बारे में",
    ta: "எங்களை பற்றி",
    te: "మా గురించి",
    bn: "আমাদের সম্পর্কে",
    mr: "आमच्याबद्दल",
  },
  signIn: {
    en: "Sign In",
    hi: "साइन इन करें",
    ta: "உள்நுழையவும்",
    te: "సైన్ ఇన్ చేయండి",
    bn: "সাইন ইন করুন",
    mr: "साइन ইন करा",
  },
  quickLinks: {
    en: "Quick Links",
    hi: "त्वरित लिंक्स",
    ta: "விரைவு இணைப்புகள்",
    te: "త్వరిత లింకులు",
    bn: "দ্রুত লিঙ্ক",
    mr: "जलद दुवे",
  },
  farmerPortal: {
    en: "Farmer Portal",
    hi: "किसान पोर्टल",
    ta: "விவசாயி போர்டல்",
    te: "రైతు పోర్టల్",
    bn: "কৃষক পোর্টাল",
    mr: "שेतकरी पोर्टल",
  },
  consumerPortal: {
    en: "Consumer Portal",
    hi: "उपभोक्ता पोर्टल",
    ta: "நுகர்வோர் போர்டல்",
    te: "వినియోగదారు పోర్టల్",
    bn: "ভোক্তা পোর্টাল",
    mr: "ग्राहक पोर्टल",
  },
  govtDashboard: {
    en: "Government Dashboard",
    hi: "सरकारी डैशबोर्ड",
    ta: "அரசு டாஷ்போர்டு",
    te: "ప్రభుత్వ డాష్‌బోర్డ్",
    bn: "সরকারি ড্যাশবোর্ড",
    mr: "सरकारी डॅशबोर्ड",
  },
  resources: {
    en: "Resources",
    hi: "संसाधन",
    ta: "வளங்கள்",
    te: "వనరులు",
    bn: "সম্পদ",
    mr: "संसाधने",
  },
  contactUs: {
    en: "Contact Us",
    hi: "संपर्क करें",
    ta: "தொடர்பு கொள்ளவும்",
    te: "మమ్మల్ని సంప్రదించండి",
    bn: "যোগাযোগ করুন",
    mr: "आमच्याशी संपर्क साधा",
  },
  documentation: {
    en: "Documentation",
    hi: "प्रलेखन",
    ta: "ஆவணங்கள்",
    te: "డాక్యుమెంటేషన్",
    bn: "ডকুমেন্টেশন",
    mr: "दस्तऐवजीकरण",
  },
  apiReference: {
    en: "API Reference",
    hi: "एपीआई संदर्भ",
    ta: "ஏபிஐ குறிப்பு",
    te: "API సూచన",
    bn: "এপিআই রেফারেন্স",
    mr: "API संदर्भ",
  },
  support: {
    en: "Support",
    hi: "समर्थन",
    ta: "ஆதரவு",
    te: "మద్దతు",
    bn: "সমর্থন",
    mr: "समर्थन",
  },
  privacyPolicy: {
    en: "Privacy Policy",
    hi: "गोपनीयता नीति",
    ta: "தனியுரிமைக் கொள்கை",
    te: "గోప్యతా విధానం",
    bn: "গোপনীয়তা নীতি",
    mr: "गोपनीयता धोरण",
  },
  footerSlogan: {
    en: "AI-powered biosecurity for pig and poultry farms. A Smart India Hackathon Initiative.",
    hi: "सूअर और पोल्ट्री फार्मों के लिए एआई-संचालित जैव सुरक्षा। एक स्मार्ट इंडिया हैकाथॉन पहल।",
    ta: "பன்றி மற்றும் கோழிப் பண்ணைகளுக்கான AI-இயங்கும் உயிரியல் பாதுகாப்பு. ஒரு ஸ்மார்ட் இந்தியா ஹேக்கத்தான் முயற்சி.",
    te: "పంది మరియు పౌల్ట్రీ ఫారమ్‌ల కోసం AI-ఆధారిత జీవభద్రత. ఒక స్మార్ట్ ఇండియా హ్యాకథాన్ చొరవ.",
    bn: "শূকর এবং পোল্ট্রি খামারের জন্য এআই-চালিত জৈব নিরাপত্তা। একটি স্মার্ট ইন্ডিয়া হ্যাকাথন উদ্যোগ।",
    mr: "डुक्कर आणि पोल्ट्री फार्मसाठी AI-शक्तीवर चालणारी जैवसुरक्षा. एक स्मार्ट इंडिया हॅकेथॉन उपक्रम.",
  },
  footerRights: {
    en: "© 2025 FarmGuard. All rights reserved. A Government of India Initiative.",
    hi: "© २०२५ फार्मगार्ड। सर्वाधिकार सुरक्षित। भारत सरकार की एक पहल।",
    ta: "© 2025 பார்ம்கார்டு. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. இந்திய அரசின் ஒரு முயற்சி.",
    te: "© 2025 ఫార్మ్‌గార్డ్. అన్ని హక్కులు ప్రత్యేకించబడినవి. భారత ప్రభుత్వ చొరవ.",
    bn: "© 2025 ফার্মগার্ড। সর্বস্বত্ব সংরক্ষিত। ভারত সরকারের একটি উদ্যোগ।",
    mr: "© २०२५ फार्मगार्ड. सर्व हक्क राखीव. भारत सरकारचा एक उपक्रम.",
  },
  termsOfService: {
    en: "Terms of Service",
    hi: "सेवा की शर्तें",
    ta: "சேவை விதிமுறைகள்",
    te: "సేవా నిబంధనలు",
    bn: "পরিষেবার শর্তাবলী",
    mr: "सेवा अटी",
  },

  // Home Page
  heroTitle: {
    en: "AI-Powered Biosecurity for Healthier Farms",
    hi: "स्वस्थ खेतों के लिए एआई-संचालित जैव सुरक्षा",
    ta: "ஆரோக்கியமான பண்ணைகளுக்கான AI-இயங்கும் உயிரியல் பாதுகாப்பு",
    te: "ఆరోగ్యకరమైన వ్యవసాయ క్షేత్రాల కోసం AI-ఆధారిత జీవభద్రత",
    bn: "স্বাস্থ্যকর খামারের জন্য এআই-চালিত জৈব নিরাপত্তা",
    mr: "निरोगी शेतांसाठी AI-शक्तीवर चालणारी जैवसुरक्षा",
  },
  heroSubtitle: {
    en: "Intelligent disease prevention and monitoring for your pig and poultry operations.",
    hi: "आपके सूअर और पोल्ट्री संचालन के लिए बुद्धिमान रोग निवारण और निगरानी।",
    ta: "உங்கள் பன்றி மற்றும் கோழி செயல்பாடுகளுக்கு அறிவார்ந்த நோய் தடுப்பு மற்றும் கண்காணிப்பு.",
    te: "మీ పంది మరియు పౌల్ట్రీ కార్యకలాపాల కోసం తెలివైన వ్యాధి నివారణ మరియు పర్యవేక్షణ.",
    bn: "আপনার শূকর এবং পোল্ট্রি অপারেশনের জন্য বুদ্ধিমান রোগ প্রতিরোধ এবং পর্যবেক্ষণ।",
    mr: "तुमच्या डुक्कर आणि पोल्ट्री कामकाजासाठी बुद्धिमान रोग प्रतिबंध आणि निरीक्षण.",
  },
  feature1: {
    en: "AI Camera Monitoring",
    hi: "एआई कैमरा निगरानी",
    ta: "AI கேமரா கண்காணிப்பு",
    te: "AI కెమెరా పర్యవేక్షణ",
    bn: "এআই ক্যামেরা পর্যবেক্ষণ",
    mr: "AI कॅमेरा निरीक्षण",
  },
  feature2: {
    en: "Predictive Outbreak Alerts",
    hi: "भविष्य कहनेवाला प्रकोप अलर्ट",
    ta: "முன்கணிப்பு நோய் வெடிப்பு எச்சரிக்கைகள்",
    te: "ఊహాజనిత వ్యాప్తి హెచ్చరికలు",
    bn: "পূর্বাভাসমূলক প্রাদুর্ভাব সতর্কতা",
    mr: "अपेक्षित प्रादुर्भाव सूचना",
  },
  feature3: {
    en: "AI Symptom Analysis",
    hi: "एआई लक्षण विश्लेषण",
    ta: "AI அறிகுறி பகுப்பாய்வு",
    te: "AI లక్షణ విశ్లేషణ",
    bn: "এআই উপসর্গ বিশ্লেষণ",
    mr: "AI लक्षण विश्लेषण",
  },
  getStarted: {
    en: "Get Started",
    hi: "शुरू करें",
    ta: "தொடங்கவும்",
    te: "ప్రారంభించండి",
    bn: "शুরু করুন",
    mr: "सुरु करा",
  },
  unifiedPlatform: {
    en: "A Unified Platform for All Stakeholders",
    hi: "सभी हितधारकों के लिए एक एकीकृत मंच",
    ta: "அனைத்து பங்குதாரர்களுக்கும் ஒரு ஒருங்கிணைந்த தளம்",
    te: "అన్ని వాటాదారుల కోసం ఒక ఏకీకృత వేదిక",
    bn: "সমস্ত স্টেকহোল্ডারদের জন্য একটি একীভূত প্ল্যাটফর্ম",
    mr: "सर्व भागधारकांसाठी एक एकीकृत मंच",
  },
  farmerPortalDesc: {
    en: "Access AI tools, manage biosecurity checklists, and connect with a community of fellow farmers.",
    hi: "एआई टूल तक पहुंचें, जैव सुरक्षा चेकलिस्ट प्रबंधित करें, और साथी किसानों के समुदाय से जुड़ें।",
    ta: "AI கருவிகளை அணுகவும், உயிரியல் பாதுகாப்பு சரிபார்ப்பு பட்டியல்களை நிர்வங்கிக்கவும், மற்றும் சக விவசாயிகளின் சமூகத்துடன் இணையவும்.",
    te: "AI సాధనాలను యాక్సెస్ చేయండి, జీవభద్రత తనిఖీ జాబితాలను నిర్వహించండి మరియు తోటి రైతుల సంఘంతో కనెక్ట్ అవ్వండి.",
    bn: "এআই সরঞ্জাম অ্যাকসెస్ করুন, জৈব নিরাপত্তা চেকলিস্ট পরিচালনা করুন এবং সহকর্মী কৃষকদের একটি সম্প্রদায়ের সাথে সংযোগ স্থাপন করুন।",
    mr: "AI साधनांमध्ये प्रवेश करा, जैवसुरक्षा तपासणी सूची व्यवस्थापित करा आणि सहकारी शेतकऱ्यांच्या समुदायाशी संपर्क साधा.",
  },
  consumerPortalDesc: {
    en: "Leverage blockchain-backed QR codes to verify product origin and farm compliance information.",
    hi: "उत्पाद की उत्पत्ति और खेत अनुपालन जानकारी को सत्यापित करने के लिए ब्लॉकचेन-समर्थित क्यूआर कोड का लाभ उठाएं।",
    ta: "தயாரிப்பு தோற்றம் மற்றும் பண்ணை இணக்கத் தகவலைச் சரிபார்க்க பிளாக்செயின்-ஆதரவு QR குறியீடுகளைப் பயன்படுத்தவும்.",
    te: "ఉత్పత్తి మూలం మరియు వ్యవసాయ క్షేత్రం వర్తింపు సమాచారాన్ని ధృవీకరించడానికి బ్లాక్‌చెయిన్-మద్దతు ఉన్న QR కోడ్‌లను ఉపయోగించుకోండి.",
    bn: "পণ্যের উৎস এবং খামার সম্মতি তথ্য যাচাই করতে ব্লকচেইন-সমর্থিত কিউআর কোড ব্যবহার করুন।",
    mr: "उत्पादनाचे मूळ आणि फार्म अनुपालन माहिती सत्यापित करण्यासाठी ब्लॉकचेन-समर्थित QR कोडचा फायदा घ्या.",
  },
  govtDashboardDesc: {
    en: "Monitor regional biosecurity trends, track compliance data, and view anonymized outbreak statistics.",
    hi: "क्षेत्रीय जैव सुरक्षा रुझानों की निगरानी करें, अनुपालन डेटा ट्रैक करें, और अनाम प्रकोप आंकड़े देखें।",
    ta: "பிராந்திய உயிரியல் பாதுகாப்பு போக்குகளைக் கண்காணிக்கவும், இணக்கத் தரவைக் கண்காணிக்கவும், மற்றும் பெயர் அறியப்படாத நோய் வெடிப்பு புள்ளிவிவரங்களைக் காணவும்.",
    te: "ప్రాంతీయ జీవభద్రత పోకడలను పర్యవేక్షించండి, వర్తింపు డేటాను ట్రాక్ చేయండి మరియు అనామక వ్యాప్తి గణాంకాలను వీక్షించండి.",
    bn: "আঞ্চলিক জৈব নিরাপত্তা প্রবণতা নিরীক্ষণ করুন, সম্মতি ডেটা ট্র্যাক করুন এবং বেনামী প্রাদুর্ভাব পরিসংখ্যান দেখুন।",
    mr: "प्रादेशिक जैवसुरक्षा ट्रेंड्सचे निरीक्षण करा, अनुपालन डेटाचा मागोवा घ्या आणि अज्ञात प्रादुर्भाव आकडेवारी पहा.",
  },
  accessPortal: {
    en: "Access Portal",
    hi: "पोर्टल तक पहुंचें",
    ta: "போர்ட்டலை அணுகவும்",
    te: "పోర్టల్‌ను యాక్సెస్ చేయండి",
    bn: "পোর্টাল অ্যাক্সেস করুন",
    mr: "पोर्टलमध्ये प्रवेश करा",
  },
  featuresTitle: {
    en: "Proactive Biosecurity at Your Fingertips",
    hi: "आपकी उंगलियों पर सक्रिय जैव सुरक्षा",
    ta: "உங்கள் விரல் நுனியில் செயல்திறன் மிக்க உயிரியல் பாதுகாப்பு",
    te: "మీ వేలికొనలకు చురుకైన జీవభద్రత",
    bn: "আপনার হাতের মুঠোয় সক্রিয় জৈব নিরাপত্তা",
    mr: "तुमच्या बोटांच्या टोकावर सक्रिय जैवसुरक्षा",
  },
  feature1Title: {
    en: "AI Camera Monitoring",
    hi: "एआई कैमरा निगरानी",
    ta: "AI கேமரா கண்காணிப்பு",
    te: "AI కెమెరా పర్యవేక్షణ",
    bn: "এআই ক্যামেরা পর্যবেক্ষণ",
    mr: "AI कॅमेरा निरीक्षण",
  },
  feature1Desc: {
    en: "Our system uses machine learning to detect early signs of illness, such as inactivity or unusual behavior, notifying you before a problem spreads.",
    hi: "हमारी प्रणाली बीमारी के शुरुआती लक्षणों, जैसे निष्क्रियता या असामान्य व्यवहार, का पता लगाने के लिए मशीन लर्निंग का उपयोग करती है, और समस्या फैलने से पहले आपको सूचित करती है।",
    ta: "செயலற்ற தன்மை அல்லது அசாதாரண நடத்தை போன்ற நோயின் ஆரம்ப அறிகுறிகளைக் கண்டறிய எங்கள் அமைப்பு இயந்திர கற்றலைப் பயன்படுத்துகிறது, ஒரு சிக்கல் பரவுவதற்கு முன்பு உங்களுக்குத் தெரிவிக்கிறது.",
    te: "మా సిస్టమ్ అనారోగ్యం యొక్క ప్రారంభ సంకేతాలను గుర్తించడానికి యంత్ర అభ్యాసాన్ని ఉపయోగిస్తుంది, నిష్క్రియాత్మకత లేదా అసాధారణ ప్రవర్తన వంటివి, సమస్య వ్యాప్తి చెందక ముందే మీకు తెలియజేస్తుంది.",
    bn: "আমাদের সিস্টেম অসুস্থতার প্রাথমিক লক্ষণগুলি সনাক্ত করতে মেশিন লার্নিং ব্যবহার করে, যেমন নিষ্ক্রিয়তা বা অস্বাভাবিক আচরণ, একটি সমস্যা ছড়িয়ে পড়ার আগে আপনাকে অবহিত করে।",
    mr: "आमची प्रणाली निष्क्रियता किंवा असामान्य वर्तनासारख्या आजाराच्या सुरुवातीच्या लक्षणांचा शोध घेण्यासाठी मशीन लर्निंगचा वापर करते, आणि समस्या पसरण्यापूर्वी तुम्हाला सूचित करते.",
  },
  feature2Title: {
    en: "Predictive Outbreak Alerts",
    hi: "भविष्य कहनेवाला प्रकोप अलर्ट",
    ta: "முன்கணிப்பு நோய் வெடிப்பு எச்சரிக்கைகள்",
    te: "ఊహాజనిత వ్యాప్తి హెచ్చరికలు",
    bn: "পূর্বাভাসমূলক প্রাদুর্ভাব সতর্কতা",
    mr: "अपेक्षित प्रादुर्भाव सूचना",
  },
  feature2Desc: {
    en: "By analyzing regional data, weather patterns, and migratory bird routes, we predict potential outbreak hotspots, giving you time to enhance protections.",
    hi: "क्षेत्रीय डेटा, मौसम के पैटर्न और प्रवासी पक्षी मार्गों का विश्लेषण करके, हम संभावित प्रकोप हॉटस्पॉट की भविष्यवाणी करते हैं, जिससे आपको सुरक्षा बढ़ाने का समय मिलता है।",
    ta: "பிராந்திய தரவு, வானிலை முறைகள் மற்றும் வலசை செல்லும் பறவைகளின் வழிகளைப் பகுப்பாய்வு செய்வதன் மூலம், சாத்தியமான நோய் வெடிப்பு மையங்களை நாங்கள் கணிக்கிறோம், இது உங்களுக்குப் பாதுகாப்புகளை மேம்படுத்த நேரம் அளிக்கிறது.",
    te: "ప్రాంతీయ డేటా, వాతావరణ నమూనాలు మరియు వలస పక్షుల మార్గాలను విశ్లేషించడం ద్వారా, మేము సంభావ్య వ్యాప్తి హాట్‌స్పాట్‌లను అంచనా వేస్తాము, ఇది మీకు రక్షణలను మెరుగుపరచడానికి సమయం ఇస్తుంది.",
    bn: "আঞ্চলিক ডেটা, আবহাওয়ার ধরণ এবং পরিযায়ী পাখির রুট বিশ্লেষণ করে, আমরা সম্ভাব্য প্রাদুর্ভাব হটস্পটগুলির পূর্বাভাস দিই, যা আপনাকে সুরক্ষা বাড়ানোর জন্য সময় দেয়।",
    mr: "प्रादेशिक डेटा, हवामान नमुने आणि स्थलांतरित पक्ष्यांच्या मार्गांचे विश्लेषण करून, आम्ही संभाव्य प्रादुर्भाव हॉटस्पॉटचा अंदाज लावतो, ज्यामुळे तुम्हाला संरक्षण वाढवण्यासाठी वेळ मिळतो.",
  },
  feature3Title: {
    en: "AI Symptom Checker",
    hi: "एआई लक्षण परीक्षक",
    ta: "AI அறிகுறி சரிபார்ப்பு",
    te: "AI లక్షణ తనిఖీ",
    bn: "এআই উপসর্গ পরীক্ষক",
    mr: "AI लक्षण तपासक",
  },
  feature3Desc: {
    en: "Unsure about an animal's health? Describe symptoms or upload an image to our AI chatbot for a preliminary analysis and guidance on next steps.",
    hi: "किसी जानवर के स्वास्थ्य के बारे में अनिश्चित हैं? लक्षणों का वर्णन करें या प्रारंभिक विश्लेषण और अगले चरणों पर मार्गदर्शन के लिए हमारे एआई चैटबॉट पर एक छवि अपलोड करें।",
    ta: "ஒரு விலங்கின் ஆரோக்கியம் குறித்து உறுதியாக தெரியவில்லையா? அறிகுறிகளை விவரிக்கவும் அல்லது எங்கள் AI சாட்போட்டில் ஒரு படத்தை பதிவேற்றவும், ஒரு முதற்கட்ட பகுப்பாய்வு மற்றும் அடுத்த படிகள் குறித்த வழிகாட்டுதலுக்கு.",
    te: "ఒక జంతువు ఆరోగ్యం గురించి ఖచ్చితంగా తెలియదా? లక్షణాలను వివరించండి లేదా మా AI చాట్‌బాట్‌కు ఒక చిత్రాన్ని అప్‌లోడ్ చేయండి, ప్రాథమిక విశ్లేషణ మరియు తదుపరి దశలపై మార్గదర్శకత్వం కోసం.",
    bn: "একটি পশুর স্বাস্থ্য সম্পর্কে অনিশ্চিত? লক্ষণগুলি বর্ণনা করুন বা আমাদের এআই চ্যাটবটে একটি ছবি আপলোড করুন, একটি প্রাথমিক বিশ্লেষণ এবং পরবর্তী পদক্ষেপের নির্দেশনার জন্য।",
    mr: "एखाद्या प्राण्याच्या आरोग्याबद्दल अनिश्चित आहात? लक्षणांचे वर्णन करा किंवा आमच्या AI চ্যাটবॉटवर एक प्रतिमा अपलोड करा, प्राथमिक विश्लेषण आणि पुढील चरणांवरील मार्गदर्शनासाठी.",
  },
  solutionsTitle: {
    en: "Solutions for a Safer Food Chain",
    hi: "एक सुरक्षित खाद्य श्रृंखला के लिए समाधान",
    ta: "ஒரு பாதுகாப்பான உணவுச் சங்கிலிக்கான தீர்வுகள்",
    te: "ఒక సురక్షితమైన ఆహార గొలుసు కోసం పరిష్కారాలు",
    bn: "একটি নিরাপদ খাদ্য শৃঙ্খলের জন্য সমাধান",
    mr: "एक सुरक्षित अन्न साखळीसाठी उपाय",
  },
  solutionFarmerTitle: {
    en: "For Farmers",
    hi: "किसानों के लिए",
    ta: "விவசாயிகளுக்கு",
    te: "రైతుల కోసం",
    bn: "কৃষকদের জন্য",
    mr: "शेतकऱ्यांसाठी",
  },
  solutionFarmerDesc: {
    en: "Empower your farm with tools that reduce losses, improve credibility with batch reports, and provide peace of mind. Connect with a community to share knowledge and stay ahead of potential threats.",
    hi: "अपने खेत को उन उपकरणों से सशक्त बनाएं जो नुकसान को कम करते हैं, बैच रिपोर्ट के साथ विश्वसनीयता में सुधार करते हैं, और मन की शांति प्रदान करते हैं। ज्ञान साझा करने और संभावित खतरों से आगे रहने के लिए एक समुदाय से जुड़ें।",
    ta: "இழப்புகளைக் குறைக்கும், தொகுதி அறிக்கைகளுடன் நம்பகத்தன்மையை மேம்படுத்தும், மற்றும் மன அமைதியை வழங்கும் கருவிகளுடன் உங்கள் பண்ணையை வலுப்படுத்துங்கள். அறிவைப் பகிர்ந்து கொள்ளவும், சாத்தியமான அச்சுறுத்தல்களைத் தவிர்க்கவும் ஒரு சமூகத்துடன் இணையுங்கள்.",
    te: "నష్టాలను తగ్గించే, బ్యాచ్ నివేదికలతో విశ్వసనీయతను మెరుగుపరిచే మరియు మనశ్శాంతిని అందించే సాధనాలతో మీ వ్యవసాయ క్షేత్రాన్ని శక్తివంతం చేయండి. జ్ఞానాన్ని పంచుకోవడానికి మరియు సంభావ్య ముప్పుల నుండి ముందు ఉండటానికి ఒక సంఘంతో కనెక్ట్ అవ్వండి.",
    bn: "আপনার খামারকে এমন সরঞ্জাম দিয়ে শক্তিশালী করুন যা ক্ষতি হ্রাস করে, ব্যাচ রিপোর্টের সাথে বিশ্বাসযোগ্যতা উন্নত করে এবং মানসিক শান্তি প্রদান করে। জ্ঞান ভাগ করে নিতে এবং সম্ভাব্য হুমকি থেকে এগিয়ে থাকতে একটি সম্প্রদায়ের সাথে সংযোগ স্থাপন করুন।",
    mr: "तुमच्या फार्मला अशा साधनांनी सशक्त करा जे नुकसान कमी करतात, बॅच अहवालांसह विश्वसनीयता सुधारतात आणि मनःशांती प्रदान करतात. ज्ञान सामायिक करण्यासाठी आणि संभाव्य धोक्यांपासून पुढे राहण्यासाठी एका समुदायाशी संपर्क साधा.",
  },
  solutionGovtTitle: {
    en: "For Government & Agencies",
    hi: "सरकार और एजेंसियों के लिए",
    ta: "அரசு மற்றும் முகவர் நிலையங்களுக்கு",
    te: "ప్రభుత్వం & ఏజెన్సీల కోసం",
    bn: "সরকার ও সংস্থার জন্য",
    mr: "सरकार आणि एजन्सींसाठी",
  },
  solutionGovtDesc: {
    en: "Gain a real-time, data-driven overview of regional livestock health. Monitor biosecurity compliance, identify high-risk areas, and implement targeted policies for a more resilient agricultural sector.",
    hi: "क्षेत्रीय पशुधन स्वास्थ्य का वास्तविक समय, डेटा-संचालित अवलोकन प्राप्त करें। जैव सुरक्षा अनुपालन की निगरानी करें, उच्च-जोखिम वाले क्षेत्रों की पहचान करें, और एक अधिक लचीला कृषि क्षेत्र के लिए लक्षित नीतियां लागू करें।",
    ta: "பிராந்திய கால்நடை ஆரோக்கியத்தின் நிகழ்நேர, தரவு சார்ந்த கண்ணோட்டத்தைப் பெறுங்கள். உயிரியல் பாதுகாப்பு இணக்கத்தைக் கண்காணிக்கவும், அதிக ஆபத்துள்ள பகுதிகளை அடையாளம் காணவும், மற்றும் ஒரு நெகிழ்வான விவசாயத் துறைக்கு இலக்கு கொள்கைகளைச் செயல்படுத்தவும்.",
    te: "ప్రాంతీయ పశువుల ఆరోగ్యం యొక్క నిజ-సమయ, డేటా-ఆధారిత అవలోకనాన్ని పొందండి. జీవభద్రత వర్తింపును పర్యవేక్షించండి, అధిక-ప్రమాద ప్రాంతాలను గుర్తించండి మరియు మరింత స్థితిస్థాపక వ్యవసాయ రంగం కోసం లక్ష్య విధానాలను అమలు చేయండి.",
    bn: "আঞ্চলিক পশুসম্পদ স্বাস্থ্যের একটি রিয়েল-টাইম, ডেটা-চালিত ওভারভিউ পান। জৈব নিরাপত্তা সম্মতি নিরীক্ষণ করুন, উচ্চ-ঝুঁকিপূর্ণ অঞ্চলগুলি চিহ্নিত করুন এবং আরও স্থিতিস্থাপক কৃষি খাতের জন্য লক্ষ্যযুক্ত নীতিগুলি প্রয়োগ করুন।",
    mr: "प्रादेशिक पशुधन आरोग्याचे वास्तविक-वेळेचे, डेटा-चालित अवलोकन मिळवा. जैवसुरक्षा अनुपालनाचे निरीक्षण करा, उच्च-जोखीम क्षेत्रे ओळखा आणि अधिक लवचिक कृषी क्षेत्रासाठी लक्ष्यित धोरणे लागू करा.",
  },
  aboutTitle: {
    en: "About FarmGuard",
    hi: "फार्मगार्ड के बारे में",
    ta: "பார்ம்கார்டு பற்றி",
    te: "ఫార్మ్‌గార్డ్ గురించి",
    bn: "ফার্মগার্ড সম্পর্কে",
    mr: "फार्मगार्डबद्दल",
  },
  aboutDesc: {
    en: "FarmGuard is a forward-thinking initiative developed for the Smart India Hackathon. Our mission is to leverage cutting-edge AI and data analytics to create a more secure, transparent, and profitable environment for livestock farmers across India, ensuring a safer food supply chain for everyone.",
    hi: "फार्मगार्ड स्मार्ट इंडिया हैकाथॉन के लिए विकसित एक दूरदर्शी पहल है। हमारा मिशन अत्याधुनिक एआई और डेटा एनालिटिक्स का लाभ उठाकर पूरे भारत में पशुधन किसानों के लिए एक अधिक सुरक्षित, पारदर्शी और लाभदायक वातावरण बनाना है, जिससे सभी के लिए एक सुरक्षित खाद्य आपूर्ति श्रृंखला सुनिश्चित हो सके।",
    ta: "பார்ம்கார்டு என்பது ஸ்மார்ட் இந்தியா ஹேக்கத்தானுக்காக உருவாக்கப்பட்ட ஒரு முன்னோக்கு சிந்தனை முயற்சியாகும். எங்கள் நோக்கம், அதிநவீன AI மற்றும் தரவுப் பகுப்பாய்வுகளைப் பயன்படுத்தி, இந்தியா முழுவதும் உள்ள கால்நடை விவசாயிகளுக்கு ஒரு பாதுகாப்பான, வெளிப்படையான மற்றும் இலாபகரமான சூழலை உருவாக்குவதாகும், அனைவருக்கும் ஒரு பாதுகாப்பான உணவு விநியோகச் சங்கிலியை உறுதி செய்வதாகும்.",
    te: "ఫార్మ్‌గార్డ్ అనేది స్మార్ట్ ఇండియా హ్యాకథాన్ కోసం అభివృద్ధి చేయబడిన ఒక ముందుచూపుతో కూడిన చొరవ. మా లక్ష్యం, భారతదేశంలోని పశువుల రైతులకు మరింత సురక్షితమైన, పారదర్శకమైన మరియు లాభదాయకమైన వాతావరణాన్ని సృష్టించడానికి అత్యాధునిక AI మరియు డేటా అనలిటిక్స్‌ను ఉపయోగించడం, ప్రతి ఒక్కరికీ సురక్షితమైన ఆహార సరఫరా గొలుసును నిర్ధారించడం.",
    bn: "ফার্মগার্ড স্মার্ট ইন্ডিয়া হ্যাকাথনের জন্য তৈরি একটি দূরদর্শী উদ্যোগ। আমাদের লক্ষ্য হল অত্যাধুনিক এআই এবং ডেটা অ্যানালিটিক্স ব্যবহার করে ভারত জুড়ে পশুসম্পদ কৃষকদের জন্য একটি আরও নিরাপদ, স্বচ্ছ এবং লাভজনক পরিবেশ তৈরি করা, যা প্রত্যেকের জন্য একটি নিরাপদ খাদ্য সরবরাহ শৃঙ্খল নিশ্চিত করে।",
    mr: "फार्मगार्ड हा स्मार्ट इंडिया हॅकेथॉनसाठी विकसित केलेला एक दूरदर्शी उपक्रम आहे. आमचे ध्येय अत्याधुनिक AI आणि डेटा ॲनालिटिक्सचा फायदा घेऊन संपूर्ण भारतातील पशुधन शेतकऱ्यांसाठी एक अधिक सुरक्षित, पारदर्शक आणि फायदेशीर वातावरण तयार करणे आहे, ज्यामुळे प्रत्येकासाठी एक सुरक्षित अन्न पुरवठा साखळी सुनिश्चित होईल.",
  },

  // Auth Page
  welcomeToFarmGuard: {
    en: "Welcome to FarmGuard",
    hi: "फार्मगार्ड में आपका स्वागत है",
    ta: "பார்ம்கார்டுக்கு வரவேற்கிறோம்",
    te: "ఫార్మ్‌గార్డ్‌కు స్వాగతం",
    bn: "ফার্মগার্ডে স্বাগতম",
    mr: "फार्मगार्डमध्ये आपले स्वागत आहे",
  },
  secureLivestockSystem: {
    en: "Secure livestock management system",
    hi: "सुरक्षित पशुधन प्रबंधन प्रणाली",
    ta: "பாதுகாப்பான கால்நடை மேலாண்மை அமைப்பு",
    te: "సురక్షిత పశువుల నిర్వహణ వ్యవస్థ",
    bn: "নিরাপদ পশুসম্পদ ব্যবস্থাপনা ব্যবস্থা",
    mr: "सुरक्षित पशुधन व्यवस्थापन प्रणाली",
  },
  emailAddress: {
    en: "Email address",
    hi: "ईमेल पता",
    ta: "மின்னஞ்சல் முகவரி",
    te: "ఈమెయిల్ చిరునామా",
    bn: "ইমেইল ঠিকানা",
    mr: "ई-मेल पत्ता",
  },
  password: {
    en: "Password",
    hi: "पासवर्ड",
    ta: "கடவுச்சொல்",
    te: "పాస్వర్డ్",
    bn: "পাসওয়ার্ড",
    mr: "पासवर्ड",
  },
  createAccount: {
    en: "Create Account",
    hi: "अकाउंट बनाएं",
    ta: "கணக்கை உருவாக்கவும்",
    te: "ఖాతాను సృష్టించండి",
    bn: "অ্যাকাউন্ট তৈরি করুন",
    mr: "खाते तयार करा",
  },
  fullName: {
    en: "Full Name",
    hi: "पूरा नाम",
    ta: "முழு பெயர்",
    te: "పూర్తి పేరు",
    bn: "পুরো নাম",
    mr: "पूर्ण नाव",
  },
  forgotPassword: {
    en: "Forgot your password?",
    hi: "अपना पासवर्ड भूल गए?",
    ta: "கடவுச்சொல்லை மறந்துவிட்டீர்களா?",
    te: "మీ పాస్వర్డ్ మర్చిపోయారా?",
    bn: "পাসওয়ার্ড ভুলে গেছেন?",
    mr: "तुमचा पासवर्ड विसरलात?",
  },
  placeholderName: {
    en: "e.g., John Doe",
    hi: "उदा., जॉन डो",
    ta: "எ.கா., ஜான் டோ",
    te: "ఉదా., జాన్ డో",
    bn: "उदा., জন ডো",
    mr: "उदा., जॉन डो",
  },
  placeholderEmail: {
    en: "you@example.com",
    hi: "you@example.com",
    ta: "you@example.com",
    te: "you@example.com",
    bn: "you@example.com",
    mr: "you@example.com",
  },
  placeholderPassword: {
    en: "********",
    hi: "********",
    ta: "********",
    te: "********",
    bn: "********",
    mr: "********",
  },

  // Dashboard Layout & Header
  dashboard: {
    en: "Dashboard",
    hi: "डैशबोर्ड",
    ta: "டாஷ்போர்டு",
    te: "డాష్‌బోర్డ్",
    bn: "ড্যাশবোর্ড",
    mr: "डॅशबोर्ड",
  },
  biosecurity: {
    en: "Biosecurity",
    hi: "जैव सुरक्षा",
    ta: "உயிரியல் பாதுகாப்பு",
    te: "జీవభద్రత",
    bn: "জৈব নিরাপত্তা",
    mr: "जैवसुरक्षा",
  },
  alerts: {
    en: "Alerts",
    hi: "अलर्ट",
    ta: "எச்சரிக்கைகள்",
    te: "హెచ్చరికలు",
    bn: "সতর্কতা",
    mr: "सूचना",
  },
  farmData: {
    en: "Farm Data",
    hi: "फार्म डेटा",
    ta: "பண்ணை தரவு",
    te: "వ్యవసాయ క్షేత్రం డేటా",
    bn: "খামারের ডেটা",
    mr: "फार्म डेटा",
  },
  community: {
    en: "Community",
    hi: "समुदाय",
    ta: "சமூகம்",
    te: "సంఘం",
    bn: "সম্প্রদায়",
    mr: "समुदाय",
  },
  settings: {
    en: "Settings",
    hi: "सेटिंग्स",
    ta: "அமைப்புகள்",
    te: "సెట్టింగ్‌లు",
    bn: "সেটিংস",
    mr: "सेटिंग्ज",
  },
  logout: {
    en: "Logout",
    hi: "लॉगआउट",
    ta: "வெளியேறு",
    te: "లాగ్అవుట్",
    bn: "লগআউট",
    mr: "लॉगआउट",
  },
  welcomeFarmer: {
    en: "Welcome, Farmer!",
    hi: "आपका स्वागत है, किसान!",
    ta: "வாருங்கள், விவசாயி!",
    te: "స్వాగతం, రైతు!",
    bn: "স্বাগতম, কৃষক!",
    mr: "शेतकरी, आपले स्वागत आहे!",
  },

  // Farmer Dashboard
  biosecurityScore: {
    en: "Biosecurity Score",
    hi: "जैव सुरक्षा स्कोर",
    ta: "உயிரியல் பாதுகாப்பு மதிப்பெண்",
    te: "జీవభద్రత స్కోరు",
    bn: "জৈব নিরাপত্তা স্কোর",
    mr: "जैवसुरक्षा गुण",
  },
  activeCriticalAlerts: {
    en: "Active Critical Alerts",
    hi: "सक्रिय गंभीर अलर्ट",
    ta: "செயலில் உள்ள முக்கியமான எச்சரிக்கைகள்",
    te: "క్రియాశీల క్లిష్టమైన హెచ్చరికలు",
    bn: "সক্রিয় গুরুতর সতর্কতা",
    mr: "सक्रिय गंभीर सूचना",
  },
  predictedRisk: {
    en: "Predicted Risk",
    hi: "अनुमानित जोखिम",
    ta: "கணிக்கப்பட்ட ஆபத்து",
    te: "అంచనా వేయబడిన ప్రమాదం",
    bn: "পূর্বাভাসিত ঝুঁকি",
    mr: "अपेक्षित धोका",
  },
  mediumRisk: {
    en: "Medium",
    hi: "मध्यम",
    ta: "நடுத்தர",
    te: "మధ్యస్థం",
    bn: "মধ্যম",
    mr: "मध्यम",
  },
  aiMonitoring: {
    en: "AI-Powered Monitoring",
    hi: "एआई-संचालित निगरानी",
    ta: "AI-இயங்கும் கண்காணிப்பு",
    te: "AI-ఆధారిత పర్యవేక్షణ",
    bn: "এআই-চালিত পর্যবেক্ষণ",
    mr: "AI-शक्तीवर चालणारे निरीक्षण",
  },
  henHouse: {
    en: "Hen House",
    hi: "मुर्गी घर",
    ta: "கோழி வீடு",
    te: "కోడి ఇల్లు",
    bn: " gallinero",
    mr: "कोंबडी घर",
  },
  pigPen: {
    en: "Pig Pen",
    hi: "सुअर बाड़ा",
    ta: "பன்றி பேனா",
    te: "పంది పెన్",
    bn: "শুয়োরের কলম",
    mr: "डुक्कर पेन",
  },
  allClear: {
    en: "All Clear",
    hi: "सब ठीक है",
    ta: "அனைத்தும் சரி",
    te: "అన్నీ స్పష్టంగా ఉన్నాయి",
    bn: "সব পরিষ্কার",
    mr: "सर्व काही ठीक आहे",
  },
  alert: {
    en: "Alert",
    hi: "अलर्ट",
    ta: "எச்சரிக்கை",
    te: "హెచ్చరిక",
    bn: "সতর্কতা",
    mr: "सूचना",
  },
  aiRecommendations: {
    en: "AI Recommendations",
    hi: "एआई सिफारिशें",
    ta: "AI பரிந்துரைகள்",
    te: "AI సిఫార్సులు",
    bn: "এআই সুপারিশ",
    mr: "AI शिफारसी",
  },
  generatingTips: {
    en: "Generating tips for your farm...",
    hi: "आपके खेत के लिए सुझाव तैयार किए जा रहे हैं...",
    ta: "உங்கள் பண்ணைக்கான உதவிக்குறிப்புகள் உருவாக்கப்படுகின்றன...",
    te: "మీ వ్యవసాయ క్షేత్రం కోసం చిట్కాలను రూపొందిస్తోంది...",
    bn: "আপনার খামারের জন্য টিপস তৈরি করা হচ্ছে...",
    mr: "तुमच्या फार्मसाठी सूचना तयार होत आहेत...",
  },
  recentAlerts: {
    en: "Recent Alerts",
    hi: "हाल के अलर्ट",
    ta: "சமீபத்திய எச்சரிக்கைகள்",
    te: "ఇటీవలి హెచ్చరికలు",
    bn: "সাম্প্রতিক সতর্কতা",
    mr: "नवीनतम सूचना",
  },
  regionalRisk: {
    en: "Regional Outbreak Risk",
    hi: "क्षेत्रीय प्रकोप जोखिम",
    ta: "பிராந்திய நோய் வெடிப்பு ஆபத்து",
    te: "ప్రాంతీయ వ్యాప్తి ప్రమాదం",
    bn: "আঞ্চলিক প্রাদুর্ভাবের ঝুঁকি",
    mr: "प्रादेशिक प्रादुर्भाव धोका",
  },
  riskMapAlt: {
    en: "Map of outbreak risk",
    hi: "प्रकोप जोखिम का नक्शा",
    ta: "நோய் வெடிப்பு ஆபத்து வரைபடம்",
    te: "వ్యాప్తి ప్రమాదం యొక్క మ్యాప్",
    bn: "প্রাদুর্ভাবের ঝুঁকির মানচিত্র",
    mr: "प्रादुर्भाव धोक्याचा नकाशा",
  },
  chatbotError: {
    en: "Sorry, I am having trouble connecting. Please try again later.",
    hi: "क्षमा करें, मुझे कनेक्ट होने में समस्या आ रही है। कृपया बाद में पुन: प्रयास करें।",
    ta: "மன்னிக்கவும், எனக்கு இணைப்பதில் சிக்கல் உள்ளது. பிறகு முயற்சிக்கவும்.",
    te: "క్షమించండి, కనెక్ట్ చేయడంలో నాకు సమస్య ఉంది. దయచేసి తర్వాత మళ్లీ ప్రయత్నించండి.",
    bn: "দুঃখিত, আমি সংযোগ করতে সমস্যা হচ্ছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।",
    mr: "क्षमस्व, मला कनेक्ट करण्यात समस्या येत आहे. कृपया नंतर पुन्हा प्रयत्न करा.",
  },

  // Biosecurity Page
  dailyChecklist: {
    en: "Daily Biosecurity Checklist",
    hi: "दैनिक जैव सुरक्षा चेकलिस्ट",
    ta: "தினசரி உயிரியல் பாதுகாப்பு சரிபார்ப்பு பட்டியல்",
    te: "రోజువారీ జీవభద్రత తనిఖీ జాబితా",
    bn: "দৈনিক জৈব নিরাপত্তা চেকলিস্ট",
    mr: "दैनिक जैवसुरक्षा तपासणी सूची",
  },
  batchId: {
    en: "Batch ID",
    hi: "बैच आईडी",
    ta: "தொகுதி ஐடி",
    te: "బ్యాచ్ ఐడి",
    bn: "ব্যাচ আইডি",
    mr: "बॅच आयडी",
  },
  addNotes: {
    en: "Additional Notes",
    hi: "अतिरिक्त नोट्स",
    ta: "கூடுதல் குறிப்புகள்",
    te: "అదనపు గమనికలు",
    bn: "অতিরিক্ত নোট",
    mr: "अतिरिक्त टिपा",
  },
  submitChecklist: {
    en: "Complete & Submit Checklist",
    hi: "चेकलिस्ट पूरी करें और सबमिट करें",
    ta: "சரிபார்ப்பு பட்டியலை பூர்த்தி செய்து சமர்ப்பிக்கவும்",
    te: "తనిఖీ జాబితాను పూర్తి చేసి సమర్పించండి",
    bn: "চেকলিস্ট সম্পূর্ণ করুন এবং জমা দিন",
    mr: "तपासणी सूची पूर्ण करा आणि सबमिट करा",
  },
  batchReports: {
    en: "Batch Reports & Credibility",
    hi: "बैच रिपोर्ट और विश्वसनीयता",
    ta: "தொகுதி அறிக்கைகள் மற்றும் நம்பகத்தன்மை",
    te: "బ్యాచ్ నివేదికలు & విశ్వసనీయత",
    bn: "ব্যাচ রিপোর্ট এবং বিশ্বাসযোগ্যতা",
    mr: "बॅच अहवाल आणि विश्वसनीयता",
  },
  complianceScore: {
    en: "Compliance Score",
    hi: "अनुपालन स्कोर",
    ta: "இணக்க மதிப்பெண்",
    te: "వర్తింపు స్కోరు",
    bn: "কমপ্লায়েন্স স্কোর",
    mr: "अनुपालन गुण",
  },
  complete: {
    en: "Complete",
    hi: "पूर्ण",
    ta: "முடிந்தது",
    te: "పూర్తయింది",
    bn: "সম্পূর্ণ",
    mr: "पूर्ण",
  },
  inProgress: {
    en: "In Progress",
    hi: "प्रगति में है",
    ta: "செயலில்",
    te: "ప్రోగ్రెస్‌లో ఉంది",
    bn: "চলছে",
    mr: "प्रगतीपथावर",
  },
  entryProtocols: {
    en: "Entry Protocols",
    hi: "प्रवेश प्रोटोकॉल",
    ta: "நுழைவு நெறிமுறைகள்",
    te: "ప్రవేశ ప్రోటోకాల్‌లు",
    bn: "প্রবেশ প্রোটোকল",
    mr: "प्रवेश प्रोटोकॉल",
  },
  feedAndWater: {
    en: "Feed & Water",
    hi: "चारा और पानी",
    ta: "தீவனம் மற்றும் நீர்",
    te: "ఫీడ్ & నీరు",
    bn: "খাবার ও জল",
    mr: "चारा आणि पाणी",
  },
  pestControl: {
    en: "Pest Control",
    hi: "कीट नियंत्रण",
    ta: "பூச்சி கட்டுப்பாடு",
    te: "తెగులు నియంత్రా",
    bn: "কীটপতঙ্গ নিয়ন্ত্রণ",
    mr: "कीड नियंत्रण",
  },
  cleaning: {
    en: "Cleaning & Disinfection",
    hi: "सफाई और कीटाणुशोधन",
    ta: "சுத்தம் மற்றும் கிருமி நீக்கம்",
    te: "శుభ్రపరచడం & క్రిమిసంహారక",
    bn: "পরিষ্কার এবং জীবাণুমুক্তকরণ",
    mr: "स्वच्छता आणि निर्जंतुकीकरण",
  },
  taskFootbaths: {
    en: "Footbaths at all entrances are maintained",
    hi: "सभी प्रवेश द्वारों पर फुटबाथ बनाए रखा जाता है",
    ta: "அனைத்து நுழைவாயில்களிலும் கால் குளியல் பராமரிக்கப்படுகிறது",
    te: "అన్ని ప్రవేశాల వద్ద ఫుట్‌బాత్‌లు నిర్వహించబడతాయి",
    bn: "সমস্ত প্রবেশপথে ফুটবাথ রক্ষণাবেক্ষণ করা হয়",
    mr: "सर्व प्रवेशद्वारांवर फूटबाथ राखले जातात",
  },
  taskVisitorLog: {
    en: "Visitor log is up-to-date",
    hi: "आगंतुक लॉग अद्यतित है",
    ta: "பார்வையாளர் பதிவு புதுப்பிக்கப்பட்டது",
    te: "సందర్శకుల లాగ్ తాజాగా ఉంది",
    bn: "ভিজিটর লগ আপ-টু-ডেট",
    mr: "अभ्यागत लॉग अद्ययावत आहे",
  },
  taskVehicleDisinfection: {
    en: "Vehicle disinfection performed on entry",
    hi: "प्रवेश पर वाहन कीटाणुशोधन किया गया",
    ta: "நுழைவாயிலில் வாகன கிருமி நீக்கம் செய்யப்பட்டது",
    te: "ప్రవేశంపై వాహన క్రిమిసంహారక చర్యలు జరిగాయి",
    bn: "প্রবেশের সময় গাড়ির জীবাণুমুক্তকরণ করা হয়েছে",
    mr: "प्रवेशावर वाहन निर्जंतुकीकरण केले",
  },
  taskSecureFeed: {
    en: "Feed storage is secure from pests",
    hi: "फ़ीड भंडारण कीटों से सुरक्षित है",
    ta: "தீவன சேமிப்பு பூச்சிகளிடமிருந்து பாதுகாப்பானது",
    te: "ఫీడ్ నిల్వ తెగుళ్ళ నుండి సురక్షితంగా ఉంది",
    bn: "ফিড স্টোরেজ কীটপতঙ্গ থেকে নিরাপদ",
    mr: "चारा साठवण कीटकापासून सुरक्षित आहे",
  },
  taskFlushWater: {
    en: "Water lines flushed daily",
    hi: "पानी की लाइनें प्रतिदिन फ्लश की जाती हैं",
    ta: "நீர் பாதைகள் தினமும் சுத்தப்படுத்தப்படுகின்றன",
    te: "నీటి లైన్లు రోజూ ఫ్లష్ చేయబడతాయి",
    bn: "জল লাইন প্রতিদিন ফ্লাশ করা হয়",
    mr: "पाण्याच्या लाईन्स दररोज फ्लश केल्या जातात",
  },
  taskBaitStations: {
    en: "Bait stations are checked and refilled",
    hi: "चारा स्टेशन की जाँच और फिर से भराई की जाती है",
    ta: "នុனி நிலையங்கள் சரிபார்க்கப்பட்டு மீண்டும் நிரப்பப்படுகின்றன",
    te: "ఎర స్టేషన్లు తనిఖీ చేయబడతాయి మరియు తిరిగి నింపబడతాయి",
    bn: "টোপ স্টেশন চেক এবং রিফিল করা হয়",
    mr: "चारा स्टेशन्स तपासले आणि पुन्हा भरले जातात",
  },
  taskNoRodentSigns: {
    en: "No signs of rodent activity",
    hi: "कृंतक गतिविधि के कोई संकेत नहीं",
    ta: "கொறித்துண்ணிகளின் செயல்பாட்டிற்கு எந்த அறிகுறியும் இல்லை",
    te: "ఎలుకల కార్యాచరణ సంకేతాలు లేవు",
    bn: "ইঁদুর কার্যকলাপের কোনো লক্ষণ নেই",
    mr: "उंदरांच्या हालचालीची कोणतीही चिन्हे नाहीत",
  },
  taskPensCleaned: {
    en: "Pens/houses cleaned of waste daily",
    hi: "बाड़े/घर प्रतिदिन कचरे से साफ किए जाते हैं",
    ta: "பேனாக்கள்/வீடுகள் தினமும் கழிவுகளிலிருந்து சுத்தம் செய்யப்படுகின்றன",
    te: "పెన్నులు/ఇళ్ళు రోజూ వ్యర్థాల నుండి శుభ్రం చేయబడతాయి",
    bn: "কলম/ঘর প্রতিদিন বর্জ্য থেকে পরিষ্কার করা হয়",
    mr: "पेन/घरे दररोज कचऱ्यापासून स्वच्छ केली जातात",
  },

  // Alert Page
  alertTitleInactivePoultry: {
    en: "AI Detected Inactive Poultry",
    hi: "एआई ने निष्क्रिय पोल्ट्री का पता लगाया",
    ta: "AI செயலற்ற கோழிகளைக் கண்டறிந்தது",
    te: "AI నిష్క్రియాత్మక పౌల్ట్రీని గుర్తించింది",
    bn: "এআই নিষ্ক্রিয় পোল্ট্রি সনাক্ত করেছে",
    mr: "AI ने निष्क्रिय पोल्ट्री शोधली",
  },
  alertDescInactivePoultry: {
    en: "Multiple birds in Hen House 4 are showing prolonged periods of inactivity, which could be an early sign of illness. Please inspect immediately.",
    hi: "हेन हाउस 4 में कई पक्षी लंबे समय तक निष्क्रियता दिखा रहे हैं, जो बीमारी का प्रारंभिक संकेत हो सकता है। कृपया तुरंत निरीक्षण करें।",
    ta: "கோழி வீடு 4 இல் உள்ள பல பறவைகள் நீண்ட காலமாக செயலற்ற நிலையில் உள்ளன, இது நோயின் ஆரம்ப அறிகுறியாக இருக்கலாம். உடனடியாக ஆய்வு செய்யவும்.",
    te: "హెన్ హౌస్ 4లోని అనేక పక్షులు ఎక్కువ కాలం నిష్క్రియాత్మకంగా ఉన్నాయి, ఇది అనారోగ్యానికి ప్రారంభ సంకేతం కావచ్చు. దయచేసి వెంటనే తనిఖీ చేయండి.",
    bn: "হেন হাউস ৪-এর একাধিক পাখি দীর্ঘ সময় ধরে নিষ্ক্রিয়তা দেখাচ্ছে, যা অসুস্থতার প্রাথমিক লক্ষণ হতে পারে। অনুগ্রহ করে অবিলম্বে পরিদর্শন করুন।",
    mr: "हेन हाऊस 4 मधील अनेक पक्षी दीर्घकाळ निष्क्रियता दर्शवत आहेत, जे आजाराचे प्रारंभिक लक्षण असू शकते. कृपया त्वरित तपासणी करा.",
  },
  alertTitleIbdHotspot: {
    en: "Predicted IBD Hotspot Nearby",
    hi: "आस-पास अनुमानित आईबीडी हॉटस्पॉट",
    ta: "அருகில் கணிக்கப்பட்ட IBD ஹாட்ஸ்பாட்",
    te: "సమీపంలో ఊహించిన IBD హాట్‌స్పాట్",
    bn: "কাছাকাছি পূর্বাভাসিত IBD হটস্পট",
    mr: "जवळपास अपेक्षित IBD हॉटस्पॉट",
  },
  alertDescIbdHotspot: {
    en: "Our predictive model indicates a high probability of an Infectious Bursal Disease (IBD) outbreak within a 10km radius. Enhance biosecurity protocols.",
    hi: "हमारा पूर्वानुमान मॉडल 10 किमी के दायरे में संक्रामक बर्साइटिस रोग (आईबीडी) के प्रकोप की उच्च संभावना को इंगित करता है। जैव सुरक्षा प्रोटोकॉल को बढ़ाएं।",
    ta: "எங்கள் முன்கணிப்பு மாதிரி 10 கிமீ சுற்றளவில் தொற்றுநோய் பர்சல் நோய் (IBD) பரவுவதற்கான அதிக நிகழ்தகவைக் குறிக்கிறது. உயிரியல் பாதுகாப்பு நெறிமுறைகளை மேம்படுத்தவும்.",
    te: "మా అంచనా నమూనా 10 కిలోమీటర్ల వ్యాసార్థంలో ఇన్ఫెక్షియస్ బుర్సల్ డిసీజ్ (IBD) వ్యాప్తి చెందే అధిక సంభావ్యతను సూచిస్తుంది. జీవభద్రత ప్రోటోకాల్‌లను మెరుగుపరచండి.",
    bn: "আমাদের ভবিষ্যদ্বাণীমূলক মডেলটি ১০ কিলোমিটার ব্যাসার্ধের মধ্যে সংক্রামক বার্সাল ডিজিজ (IBD) প্রাদুর্ভাবের উচ্চ সম্ভাবনা নির্দেশ করে। জৈব নিরাপত্তা প্রোটোকল বাড়ান।",
    mr: "आमचे पूर्वानुमान मॉडेल 10 किमी त्रिज्येमध्ये संक्रामक बर्सल रोगाच्या (IBD) प्रादुर्भावाची उच्च शक्यता दर्शवते. जैवसुरक्षा प्रोटोकॉल वाढवा.",
  },
  alertTitleAvianFlu: {
    en: "Confirmed Avian Flu Case",
    hi: "पुष्ट एवियन फ्लू मामला",
    ta: "உறுதிப்படுத்தப்பட்ட ஏவியன் ஃபுளூ வழக்கு",
    te: "ధృవీకరించబడిన ఏవియన్ ఫ్లూ కేసు",
    bn: "নিশ্চিত এভিয়ান ফ্লু কেস",
    mr: "पुष्टी झालेला एव्हियन फ्लूचा रुग्ण",
  },
  alertDescAvianFlu: {
    en: "A case of H5N1 has been confirmed in a neighboring district. Heightened surveillance and strict movement control are advised.",
    hi: "पड़ोसी जिले में H5N1 का एक मामला सामने आया है। बढ़ी हुई निगरानी और सख्त आवाजाही नियंत्रण की सलाह दी जाती है।",
    ta: "அண்டை மாவட்டத்தில் H5N1 தொற்று உறுதி செய்யப்பட்டுள்ளது. அதிக கண்காணிப்பு மற்றும் கடுமையான நடமாட்டக் கட்டுப்பாடு அறிவுறுத்தப்படுகிறது.",
    te: "పొరుగు జిల్లాలో H5N1 కేసు నిర్ధారించబడింది. పెరిగిన నిఘా మరియు కఠినమైన కదలిక నియంత్రణ సలహా ఇవ్వబడుతుంది.",
    bn: "প্রতিবেশী জেলায় H5N1-এর একটি ঘটনা নিশ্চিত করা হয়েছে। উচ্চতর নজরদারি এবং কঠোর চলাচল নিয়ন্ত্রণের পরামর্শ দেওয়া হচ্ছে।",
    mr: "शेजारील जिल्ह्यात H5N1 चा एक रुग्ण आढळला आहे. वाढीव पाळत ठेवणे आणि कठोर हालचाल नियंत्रणाची सल्ला दिली जाते.",
  },
  alertTitleTempSpike: {
    en: "Temperature Spike in Pig Pen",
    hi: "सुअर बाड़े में तापमान में वृद्धि",
    ta: "பன்றி பேனாவில் வெப்பநிலை அதிகரிப்பு",
    te: "పంది పెన్‌లో ఉష్ణోగ్రత పెరుగుదల",
    bn: "পিগ পেনে তাপমাত্রার স্পাইক",
    mr: "डुक्कर पेनमधील तापमानात वाढ",
  },
  alertDescTempSpike: {
    en: "Sensors detected a 2°C rise in ambient temperature in Pig Pen B over the last hour. Check ventilation systems.",
    hi: "सेंसर ने पिछले घंटे में पिग पेन बी में परिवेश के तापमान में 2 डिग्री सेल्सियस की वृद्धि का पता लगाया है। वेंटिलेशन सिस्टम की जाँच करें।",
    ta: "சென்சார்கள் கடந்த ஒரு மணி நேரத்தில் பிக் பென் B இல் சுற்றுப்புற வெப்பநிலையில் 2°C உயர்வைக் கண்டறிந்துள்ளன. காற்றோட்டம் அமைப்புகளைச் சரிபார்க்கவும்.",
    te: "గత గంటలో పిగ్ పెన్ Bలోని పరిసర ఉష్ణోగ్రతలో 2°C పెరుగుదలను సెన్సార్లు గుర్తించాయి. వెంటిలేషన్ సిస్టమ్‌లను తనిఖీ చేయండి.",
    bn: "সেন্সর গত এক ঘণ্টায় পিগ পেন বি-তে পরিবেষ্টিত তাপমাত্রায় ২ ডিগ্রি সেলসিয়াস বৃদ্ধি সনাক্ত করেছে। বায়ুচলাচল ব্যবস্থা পরীক্ষা করুন।",
    mr: "सेन्सर्सनी गेल्या तासात पिग पेन बी मधील वातावरणीय तापमानात 2°C वाढ नोंदवली आहे. वेंटिलेशन सिस्टीम तपासा.",
  },
  alertTitleProtocolReminder: {
    en: "Biosecurity Protocol Reminder",
    hi: "जैव सुरक्षा प्रोटोकॉल अनुस्मारक",
    ta: "உயிரியல் பாதுகாப்பு நெறிமுறை நினைவூட்டல்",
    te: "జీవభద్రత ప్రోటోకాల్ రిమైండర్",
    bn: "বায়োসিকিউরিটি প্রোটোকল রিমাইন্ডার",
    mr: "जैवसुरक्षा प्रोटोकॉल स्मरणपत्र",
  },
  aiCamera: {
    en: "AI Camera",
    hi: "एआई कैमरा",
    ta: "AI கேமரா",
    te: "AI కెమెరా",
    bn: "এআই ক্যামেরা",
    mr: "AI कॅमेरा",
  },
  prediction: {
    en: "Prediction",
    hi: "भविष्यवाणी",
    ta: "கணிப்பு",
    te: "అంచనా",
    bn: "পূর্বাভাস",
    mr: "अंदाज",
  },
  outbreak: {
    en: "Outbreak",
    hi: "प्रकोप",
    ta: "நோய் வெடிப்பு",
    te: "వ్యాప్తి",
    bn: "প্রাদুর্ভাব",
    mr: "प्रादुर्भाव",
  },
  system: {
    en: "System",
    hi: "सिस्टम",
    ta: "அமைப்பு",
    te: "వ్యవస్థ",
    bn: "সিস্টেম",
    mr: "प्रणाली",
  },

  // Farm Data Page
  mortalityTitle: {
    en: "Monthly Mortality Rate (%)",
    hi: "मासिक मृत्यु दर (%)",
    ta: "மாதாந்திர இறப்பு விகிதம் (%)",
    te: "నెలవారీ మరణాల రేటు (%)",
    bn: "মাসিক মৃত্যুহার (%)",
    mr: "मासिक मृत्यू दर (%)",
  },
  mortalityLegend: {
    en: "Mortality %",
    hi: "मृत्यु %",
    ta: "இறப்பு %",
    te: "మరణం %",
    bn: "মৃত্যু %",
    mr: "मृत्यू %",
  },
  tempTitle: {
    en: "Average Temperature (°C)",
    hi: "औसत तापमान (°C)",
    ta: "சராசரி வெப்பநிலை (°C)",
    te: "సగటు ఉష్ణోగ్రత (°C)",
    bn: "গড় তাপমাত্রা (°C)",
    mr: "सरासरी तापमान (°C)",
  },
  tempLegend: {
    en: "Temperature °C",
    hi: "तापमान °C",
    ta: "வெப்பநிலை °C",
    te: "ఉష్ణోగ్రత °C",
    bn: "তাপমাত্রা °C",
    mr: "तापमान °C",
  },
  feedTitle: {
    en: "Total Feed Consumption (kg)",
    hi: "कुल फ़ीड खपत (किलो)",
    ta: "மொத்த தீவன நுகர்வு (கிலோ)",
    te: "మొత్తం ఫీడ్ వినియోగం (కిలో)",
    bn: "মোট খাদ্য খরচ (কেজি)",
    mr: "एकूण चारा वापर (किलो)",
  },
  feedLegend: {
    en: "Feed (kg)",
    hi: "फ़ीड (किलो)",
    ta: "தீவனம் (கிலோ)",
    te: "ఫీడ్ (కిలో)",
    bn: "ফিড (কেজি)",
    mr: "चारा (किलो)",
  },
  monthJan: { en: "Jan", hi: "जन", ta: "ஜன", te: "జన", bn: "জানু", mr: "जाने" },
  monthFeb: {
    en: "Feb",
    hi: "फ़र",
    ta: "பிப்",
    te: "ఫిబ్ర",
    bn: "ফেব্রু",
    mr: "फेब्रु",
  },
  monthMar: {
    en: "Mar",
    hi: "मार्च",
    ta: "மார்",
    te: "మార్చి",
    bn: "মার্চ",
    mr: "मार्च",
  },
  monthApr: {
    en: "Apr",
    hi: "अप्रै",
    ta: "ஏப்",
    te: "ఏప్రి",
    bn: "এপ্রিল",
    mr: "एप्रिल",
  },
  monthMay: { en: "May", hi: "मई", ta: "மே", te: "మే", bn: "মে", mr: "मे" },
  monthJun: {
    en: "Jun",
    hi: "जून",
    ta: "ஜூன்",
    te: "జూన్",
    bn: "জুন",
    mr: "जून",
  },

  // Settings Page
  settingsDescription: {
    en: "Manage your profile, notification preferences, and other account settings.",
    hi: "अपनी प्रोफ़ाइल, अधिसूचना प्राथमिकताएँ और अन्य खाता सेटिंग्स प्रबंधित करें।",
    ta: "உங்கள் சுயவிவரம், அறிவிப்பு விருப்பத்தேர்வுகள் மற்றும் பிற கணக்கு அமைப்புகளை நிர்வగிக்கவும்.",
    te: "మీ ప్రొఫైల్, నోటిఫికేషన్ ప్రాధాన్యతలు మరియు ఇతర ఖాతా సెట్టింగ్‌లను నిర్వహించండి.",
    bn: "আপনার প্রোফাইল, বিজ্ঞপ্তি পছন্দ এবং অন্যান্য অ্যাকাউন্ট সেটিংস পরিচালনা করুন।",
    mr: "तुमचे प्रोफाइल, सूचना प्राधान्ये आणि इतर खाते सेटिंग्ज व्यवस्थापित करा.",
  },
  userProfileTitle: {
    en: "User Profile",
    hi: "उपयोगकर्ता प्रोफ़ाइल",
    ta: "பயனர் சுயவிவரம்",
    te: "వినియోగదారు ప్రొఫైల్",
    bn: "ব্যবহারকারী প্রোফাইল",
    mr: "वापरकर्ता प्रोफाइल",
  },
  notificationsTitle: {
    en: "Notifications",
    hi: "सूचनाएं",
    ta: "அறிவிப்புகள்",
    te: "నోటిఫికేషన్‌లు",
    bn: "বিজ্ঞপ্তি",
    mr: "सूचना",
  },
  emailNotificationsLabel: {
    en: "Email Notifications",
    hi: "ईमेल सूचनाएं",
    ta: "மின்னஞ்சல் அறிவிப்புகள்",
    te: "ఇమెయిల్ నోటిఫికేషన్‌లు",
    bn: "ইমেইল বিজ্ঞপ্তি",
    mr: "ईमेल सूचना",
  },
  emailNotificationsDesc: {
    en: "Get critical alerts and weekly summaries delivered to your inbox.",
    hi: "अपने इनबॉक्स में महत्वपूर्ण अलर्ट और साप्ताहिक सारांश प्राप्त करें।",
    ta: "உங்கள் இன்பாக்ஸில் முக்கியமான எச்சரிக்கைகள் மற்றும் வாராந்திர சுருக்கங்களைப் பெறுங்கள்.",
    te: "మీ ఇన్‌బాక్స్‌కు క్లిష్టమైన హెచ్చరికలు మరియు వారపు సారాంశాలను పొందండి.",
    bn: "আপনার ইনবক্সে গুরুতর সতর্কতা এবং সাপ্তাহিক সারসংক্ষেপ গ্রহণ করুন।",
    mr: "तुमच्या इनबॉक्समध्ये गंभीर सूचना आणि साप्ताहिक सारांश मिळवा.",
  },
  pushNotificationsLabel: {
    en: "Push Notifications",
    hi: "पुश सूचनाएं",
    ta: "புஷ் அறிவிப்புகள்",
    te: "పుష్ నోటిఫికేషన్‌లు",
    bn: "পুশ বিজ্ঞপ্তি",
    mr: "पुश सूचना",
  },
  pushNotificationsDesc: {
    en: "Receive real-time alerts directly on your mobile device (app required).",
    hi: "सीधे अपने मोबाइल डिवाइस पर वास्तविक समय के अलर्ट प्राप्त करें (ऐप आवश्यक)।",
    ta: "உங்கள் மொபைல் சாதனத்தில் நேரடியாக நிகழ்நேர விழிப்பூட்டல்களைப் பெறுங்கள் (பயன்பாடு தேவை).",
    te: "మీ మొబైల్ పరికరంలో నేరుగా నిజ-సమయ హెచ్చరికలను స్వీకరించండి (యాప్ అవసరం).",
    bn: "সরাসরি আপনার মোবাইল ডিভাইসে রিয়েল-টাইম সতর্কতা গ্রহণ করুন (অ্যাপ প্রয়োজন)।",
    mr: "थेट तुमच्या मोबाइल डिव्हाइसवर रिअल-टाइम सूचना मिळवा (ॲप आवश्यक).",
  },
  saveChanges: {
    en: "Save Changes",
    hi: "परिवर्तन सहेजें",
    ta: "மாற்றங்களைச் சேமிக்கவும்",
    te: "మార్పులను భద్రపరచండి",
    bn: "পরিবর্তন সংরক্ষণ করুন",
    mr: "बदल जतन करा",
  },

  // Community Page
  communityHub: {
    en: "Community Hub",
    hi: "सामुदायिक हब",
    ta: "சமூக மையம்",
    te: "సంఘం హబ్",
    bn: "কমিউনিটি হাব",
    mr: "समुदाय केंद्र",
  },
  newDiscussion: {
    en: "New Discussion",
    hi: "नई चर्चा",
    ta: "புதிய கலந்துரையாடல்",
    te: "కొత్త చర్చ",
    bn: "নতুন আলোচনা",
    mr: "नवीन चर्चा",
  },
  postedBy: {
    en: "Posted by",
    hi: "द्वारा पोस्ट किया गया",
    ta: "பதிவிட்டவர்",
    te: "పోస్ట్ చేసిన వారు",
    bn: "পোস্ট করেছেন",
    mr: "पोस्ट केले",
  },
  replies: {
    en: "Replies",
    hi: "उत्तर",
    ta: "பதில்கள்",
    te: "ప్రత్యుత్తరాలు",
    bn: "উত্তর",
    mr: "उत्तरे",
  },
  views: {
    en: "Views",
    hi: "विचार",
    ta: "பார்வைகள்",
    te: "వీక్షణలు",
    bn: "দর্শন",
    mr: "दृश्ये",
  },
  comment: {
    en: "Comment",
    hi: "टिप्पणी",
    ta: "கருத்து",
    te: "వ్యాఖ్య",
    bn: "মন্তব্য",
    mr: "टिप्पणी",
  },
  dislike: {
    en: "Dislike",
    hi: "नापसंद",
    ta: "விரும்பவில்லை",
    te: "ఇష్టం లేదు",
    bn: "অপছন্দ",
    mr: "नापसंत",
  },
  cancel: {
    en: "Cancel",
    hi: "रद्द करें",
    ta: "ரத்துசெய்",
    te: "రద్దు చేయండి",
    bn: "বাতিল করুন",
    mr: "रद्द करा",
  },
  post: {
    en: "Post",
    hi: "पोस्ट",
    ta: "பதிவு",
    te: "పోస్ట్",
    bn: "পোস্ট",
    mr: "पोस्ट",
  },
  createDiscussionTitle: {
    en: "Create a new discussion",
    hi: "एक नई चर्चा बनाएँ",
    ta: "புதிய கலந்துரையாடலை உருவாக்கவும்",
    te: "కొత్త చర్చను సృష్టించండి",
    bn: "একটি নতুন আলোচনা তৈরি করুন",
    mr: "नवीन चर्चा तयार करा",
  },
  title: {
    en: "Title",
    hi: "शीर्षक",
    ta: "தலைப்பு",
    te: "శీర్షిక",
    bn: "শিরোনাম",
    mr: "शीर्षक",
  },
  content: {
    en: "Content",
    hi: "सामग्री",
    ta: "உள்ளடக்கம்",
    te: "విషయము",
    bn: "বিষয়বস্তু",
    mr: "सामग्री",
  },
  titlePlaceholder: {
    en: "What is your question or topic?",
    hi: "आपका प्रश्न या विषय क्या है?",
    ta: "உங்கள் கேள்வி அல்லது தலைப்பு என்ன?",
    te: "మీ ప్రశ్న లేదా అంశం ఏమిటి?",
    bn: "আপনার প্রশ্ন বা বিষয় কি?",
    mr: "तुमचा प्रश्न किंवा विषय काय आहे?",
  },
  contentPlaceholder: {
    en: "Provide more details here...",
    hi: "यहां और विवरण प्रदान करें...",
    ta: "இங்கே மேலும் விவரங்களை வழங்கவும்...",
    te: "ఇక్కడ మరిన్ని వివరాలను అందించండి...",
    bn: "এখানে আরও বিস্তারিত প্রদান করুন।",
    mr: "येथे अधिक तपशील द्या...",
  },
  addReplyPlaceholder: {
    en: "Write a reply...",
    hi: "एक उत्तर लिखें...",
    ta: "ஒரு பதிலை எழுதுங்கள்...",
    te: "ఒక ప్రత్యుత్తరం రాయండి...",
    bn: "একটি উত্তর লিখুন...",
    mr: "एक उत्तर लिहा...",
  },
  delete: {
    en: "Delete",
    hi: "हटाएं",
    ta: "நீக்கு",
    te: "తొలగించు",
    bn: "মুছে ফেলুন",
    mr: "हटवा",
  },
  deletePostConfirm: {
    en: "Are you sure you want to delete this discussion? This action cannot be undone.",
    hi: "क्या आप वाकई इस चर्चा को हटाना चाहते हैं? यह कार्रवाई पूर्ववत नहीं की जा सकती।",
    ta: "இந்த விவாதத்தை நீக்க விரும்புகிறீர்களா? இந்தச் செயலைச் செயல்தவிர்க்க முடியாது।",
    te: "మీరు ఈ చర్చను తొలగించాలనుకుంటున్నారని ఖచితమేనా? ఈ చర్యను రద్దు చేయడం సాధ్యం కాదు।",
    bn: "আপনি কি এই আলোচনাটি মুছে ফেলতে চান? এই ক্রিয়াটি ফিরিয়ে আনা যাবে না।",
    mr: "तुम्हाला ही चर्चा हटवायची आहे का? ही क्रिया पूर्ववत केली जाऊ शकत नाही.",
  },
  deleteCommentConfirm: {
    en: "Are you sure you want to delete this reply?",
    hi: "क्या आप वाकई यह उत्तर हटाना चाहते हैं?",
    ta: "இந்தப் பதிலை நீக்க விரும்புகிறீர்களா?",
    te: "మీరు ఈ ప్రత్యుత్తరాన్ని తొలగించాలనుకుంటున్నారని ఖచితమేనా?",
    bn: "আপনি কি এই উত্তরটি মুছে ফেলতে চান?",
    mr: "तुम्हाला हे उत्तर हटवायचे आहे का?",
  },

  // Chatbot
  chatbotGreeting: {
    en: "Hello! I am your AI Biosecurity Assistant. How can I help you today? You can describe symptoms, upload an image, or send a voice message.",
    hi: "नमस्ते! मैं आपका एआई जैव सुरक्षा सहायक हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ? आप लक्षण बता सकते हैं, एक छवि अपलोड कर सकते हैं, या एक ध्वनि संदेश भेज सकते हैं।",
    ta: "வணக்கம்! நான் உங்கள் AI உயிரியல் பாதுகாப்பு உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்? நீங்கள் அறிகுறிகளை விவரிக்கலாம், ஒரு படத்தை பதிவேற்றலாம், அல்லது ஒரு குரல் செய்தியை அனுப்பலாம்.",
    te: "నమస్కారం! నేను మీ AI జీవభద్రత సహాయకుడిని. ఈ రోజు నేను మీకు ఎలా సహాయం చేయగలను? మీరు లక్షణాలను వివరించవచ్చు, ఒక చిత్రాన్ని అప్‌లోడ్ చేయవచ్చు, లేదా ఒక వాయిస్ సందేశం పంపవచ్చు.",
    bn: "হ্যালো! আমি আপনার এআই বায়োসিকিউরিটি অ্যাসিস্ট্যান্ট। আজ আমি আপনাকে কিভাবে সাহায্য করতে পারি? আপনি উপসর্গ বর্ণনা করতে, একটি ছবি আপলোড করতে, বা একটি ভয়েস বার্তা পাঠাতে পারেন।",
    mr: "नमस्कार! मी तुमचा AI जैवसुरक्षा सहाय्यक आहे. आज मी तुम्हाला कशी मदत करू शकेन? तुम्ही लक्षणे वर्णन करू शकता, एक प्रतिमा अपलोड करू शकता, किंवा एक व्हॉइस संदेश পাঠवू शकता.",
  },
  symptomChecker: {
    en: "AI Symptom Checker",
    hi: "एआई लक्षण परीक्षक",
    ta: "AI அறிகுறி சரிபார்ப்பு",
    te: "AI లక్షణ తనిఖీ",
    bn: "এআই উপসর্গ পরীক্ষক",
    mr: "AI लक्षण तपासक",
  },
  typeMessage: {
    en: "Describe symptoms or ask a question...",
    hi: "लक्षणों का वर्णन करें या एक प्रश्न पूछें...",
    ta: "அறிகுறி களை விவரிக்கவும் அல்லது ஒரு கேள்வியைக் கேட்கவும்...",
    te: "లక్షణాలను వివరించండి లేదా ఒక ప్రశ్న అడగండి...",
    bn: "উপসর্গ বর্ণনা করুন বা একটি প্রশ্ন জিজ্ঞাসা করুন...",
    mr: "लक्षणे वर्णन करा किंवा এক প্রশ্ন विचारा...",
  },
  recordAudio: {
    en: "Record Audio",
    hi: "ऑडियो रिकॉर्ड करें",
    ta: "ஆடியோவைப் பதிவுசெய்யவும்",
    te: "ఆడియో రికార్డ్ చేయండి",
    bn: "অডিও রেকর্ড করুন",
    mr: "ऑडिओ रेकॉर्ड करा",
  },
  stopRecording: {
    en: "Stop Recording",
    hi: "रिकॉर्डिंग बंद करें",
    ta: "பதிவு செய்வதை நிறுத்து",
    te: "రికార్డింగ్ ఆపండి",
    bn: "রেকর্ডিং বন্ধ করুন",
    mr: "रेকॉर्डिंग थांबवा",
  },
  recording: {
    en: "Recording...",
    hi: "रिकॉर्डिंग...",
    ta: "பதிவு செய்கிறது...",
    te: "రికార్డింగ్...",
    bn: "রেকর্ডিং...",
    mr: "रेकॉर्डिंग...",
  },
  audioMessage: {
    en: "Audio Message",
    hi: "ऑडियो संदेश",
    ta: "ஆடியோ செய்தி",
    te: "ఆడియో సందేశం",
    bn: "অডিও বার্তা",
    mr: "ऑडिओ संदेश",
  },

  // Government Dashboard
  totalFarms: {
    en: "Total Registered Farms",
    hi: "कुल पंजीकृत फार्म",
    ta: "மொத்த பதிவு செய்யப்பட்ட பண்ணைகள்",
    te: "మొత్తం నమోదు చేయబడిన పొలాలు",
    bn: "মোট নিবন্ধিত খামার",
    mr: "एकूण नोंदणीकृत शेत",
  },
  compliantFarms: {
    en: "Compliant Farms",
    hi: "अनुपालन करने वाले फार्म",
    ta: "இணக்கமான பண்ணைகள்",
    te: "వర్తింపు పొలాలు",
    bn: "সম্মত খামার",
    mr: "अनुपालन करणारे शेत",
  },
  complianceRate: {
    en: "Overall Compliance Rate",
    hi: "समग्र अनुपालन दर",
    ta: "ஒட்டுமொத்த இணக்க விகிதம்",
    te: "మొత్తం వర్తింపు రేటు",
    bn: "সামগ্রিক সম্মতি হার",
    mr: "एकूण अनुपालन दर",
  },
  composeNotification: {
    en: "Compose Notification",
    hi: "अधिसूचना लिखें",
    ta: "அறிவிப்பை உருவாக்கவும்",
    te: "ప్రకటనను కంపోజ్ చేయండి",
    bn: "বিজ্ঞপ্তি রচনা করুন",
    mr: "सूचना तयार करा",
  },
  subject: {
    en: "Subject",
    hi: "विषय",
    ta: "பொருள்",
    te: "విషయం",
    bn: "বিষয়",
    mr: "विषय",
  },
  subjectPlaceholder: {
    en: "e.g., Avian Flu Alert",
    hi: "उदा., एवियन फ्लू अलर्ट",
    ta: "எ.கா., ஏவியன் ஃபுளூ எச்சரிக்கை",
    te: "ఉదా., ఏవియన్ ఫ్లూ హెచ్చరిక",
    bn: "उदा., এভিয়ান ফ্লু সতর্কতা",
    mr: "उदा., एवियन फ्लू सूचना",
  },
  message: {
    en: "Message",
    hi: "संदेश",
    ta: "செய்தி",
    te: "సందేశం",
    bn: "বার্তা",
    mr: "संदेश",
  },
  messagePlaceholder: {
    en: "Enter the broadcast message for all farmers...",
    hi: "सभी किसानों के लिए प्रसारण संदेश दर्ज करें...",
    ta: "அனைத்து விவசாயிகளுக்கும் ஒளிபரப்பு செய்தியை உள்ளிடவும்...",
    te: "అన్ని రైతులకు ప్రసార సందేశాన్ని నమోదు చేయండి...",
    bn: "সমস্ত কৃষকদের জন্য সম্প্রচার বার্তা প্রবেশ করান...",
    mr: "सर्व शेतकऱ्यांसाठी प्रसारण संदेश प्रविष्ट करा...",
  },
  sendNotification: {
    en: "Send Notification",
    hi: "अधिसूचना भेजें",
    ta: "அறிவிப்பை அனுப்பவும்",
    te: "ప్రకటన పంపండి",
    bn: "বিজ্ঞপ্তি পাঠান",
    mr: "सूचना पाठवा",
  },
  notificationSent: {
    en: "Notification sent successfully!",
    hi: "अधिसूचना सफलतापूर्वक भेज दी गई!",
    ta: "அறிவிப்பு வெற்றிகரமாக அனுப்பப்பட்டது!",
    te: "ప్రకటన విజయవంతంగా పంపబడింది!",
    bn: "বিজ্ঞপ্তি সফলভাবে পাঠানো হয়েছে!",
    mr: "सूचना यशस्वीरित्या पाठवली!",
  },
  regionalCompliance: {
    en: "Compliance by Region",
    hi: "क्षेत्र के अनुसार अनुपालन",
    ta: "பிராந்திய வாரியாக இணக்கம்",
    te: "ప్రాంతం వారీగా వర్తింపు",
    bn: "অঞ্চল অনুসারে সম্মতি",
    mr: "प्रदेशानुसार अनुपालन",
  },

  // Consumer Portal
  verifyProduct: {
    en: "Verify Product",
    hi: "उत्पाद सत्यापित करें",
    ta: "தயாரிப்பைச் சரிபார்க்கவும்",
    te: "ఉత్పత్తిని ధృవీకరించండి",
    bn: "পণ্য যাচাই করুন",
    mr: "उत्पादन सत्यापित करा",
  },
  verifyProductDesc: {
    en: "Enter the unique ID found on your product packaging to verify its origin and safety status.",
    hi: "इसकी उत्पत्ति और सुरक्षा स्थिति को सत्यापित करने के लिए अपने उत्पाद पैकेजिंग पर पाया गया अद्वितीय आईडी दर्ज करें।",
    ta: "அதன் தோற்றம் மற்றும் பாதுகாப்பு நிலையைச் சரிபார்க்க உங்கள் தயாரிப்பு பேக்கேஜிங்கில் காணப்படும் தனிப்பட்ட ஐடியை உள்ளிடவும்.",
    te: "దాని మూలం మరియు భద్రతా స్థితిని ధృవీకరించడానికి మీ ఉత్పత్తి ప్యాకేజింగ్‌పై కనిపించే ప్రత్యేక ఐడిని నమోదు చేయండి।",
    bn: "এর উৎস এবং সুরক্ষা স্থিতি যাচাই করতে আপনার পণ্যের প্যাকেজিংয়ে পাওয়া অনন্য আইডি প্রবেশ করান।",
    mr: "त्याचे मूळ आणि सुरक्षा स्थिती सत्यापित करण्यासाठी आपल्या उत्पादनाच्या पॅकेजिंगवर आढळणारा अद्वितीय आयडी प्रविष्ट करा.",
  },
  enterProductId: {
    en: "Enter Product ID...",
    hi: "उत्पाद आईडी दर्ज करें...",
    ta: "தயாரிப்பு ஐடியை உள்ளிடவும்...",
    te: "ఉత్పత్తి ఐడిని నమోదు చేయండి...",
    bn: "পণ্য আইডি লিখুন...",
    mr: "उत्पादन आयडी प्रविष्ट करा...",
  },
  verify: {
    en: "Verify",
    hi: "सत्यापित करें",
    ta: "சரிபார்க்கவும்",
    te: "ధృవీకరించండి",
    bn: "যাচাই করুন",
    mr: "सत्यापित करा",
  },
  productNotFound: {
    en: "Product ID not found. Please check the ID and try again.",
    hi: "उत्पाद आईडी नहीं मिला। कृपया आईडी जांचें और पुनः प्रयास करें।",
    ta: "தயாரிப்பு ஐடி கிடைக்கவில்லை. ஐடியைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.",
    te: "ఉత్పత్తి ఐడి కనుగొనబడలేదు. దయచేసి ఐడిని తనిఖీ చేసి మళ్లీ ప్రయత్నించండి.",
    bn: "পণ্য আইডি পাওয়া যায়নি। অনুগ্রহ করে আইডি চেক করে আবার চেষ্টা করুন।",
    mr: "उत्पादन आयडी सापडला नाही. कृपया आयडी तपासा आणि पुन्हा प्रयत्न करा.",
  },
  productStatus_safe: {
    en: "Verification Successful: Product is Safe",
    hi: "सत्यापन सफल: उत्पाद सुरक्षित है",
    ta: "சரிபார்ப்பு வெற்றி: தயாரிப்பு பாதுகாப்பானது",
    te: "ధృవీకరణ విజయవంతం: ఉత్పత్తి సురక్షితం",
    bn: "যাচাই সফল: পণ্য নিরাপদ",
    mr: "सत्यापन यशस्वी: उत्पादन सुरक्षित आहे",
  },
  productStatus_warning: {
    en: "Verification Warning: Low Farm Compliance",
    hi: "सत्यापन चेतावनी: कम फार्म अनुपालन",
    ta: "சரிபார்ப்பு எச்சரிக்கை: குறைந்த பண்ணை இணக்கம்",
    te: "ధృవీకరణ హెచ్చరిక: తక్కువ వ్యవసాయ క్షేత్రం వర్తింపు",
    bn: "যাচাই সতর্কতা: কম খামার সম্মতি",
    mr: "सत्यापन चेतावणी: कमी फार्म अनुपालन",
  },
  productStatus_danger: {
    en: "Verification Alert: Do Not Consume",
    hi: "सत्यापन चेतावनी: उपभोग न करें",
    ta: "சரிபார்ப்பு எச்சரிக்கை: உட்கொள்ள வேண்டாம்",
    te: "ధృవీకరణ హెచ్చరిక: తినవద్దు",
    bn: "যাচাই সতর্কতা: গ্রহণ করবেন না",
    mr: "सत्यापन सूचना: सेवन करू नका",
  },
  productStatusDesc_safe: {
    en: "This product originates from a farm with a high biosecurity compliance score.",
    hi: "यह उत्पाद उच्च जैव सुरक्षा अनुपालन स्कोर वाले फार्म से आता है।",
    ta: "இந்த தயாரிப்பு உயர் உயிரியல் பாதுகாப்பு இணக்க மதிப்பெண்ணுடன் ஒரு பண்ணையிலிருந்து வருகிறது.",
    te: "ఈ ఉత్పత్తి అధిక జీవభద్రత వర్తింపు స్కోర్‌తో ఉన్న వ్యవసాయ క్షేత్రం నుండి వచ్చింది.",
    bn: "এই পণ্যটি একটি উচ্চ জৈব নিরাপত্তা সম্মতি স্কোর সহ একটি খামার থেকে উদ্ভূত।",
    mr: "हे उत्पादन उच्च जैवसुरक्षा अनुपालन गुण असलेल्या फार्ममधून येते.",
  },
  productStatusDesc_warning: {
    en: "This product is from a farm with a recent history of low biosecurity compliance. Consume with caution.",
    hi: "यह उत्पाद हाल ही में कम जैव सुरक्षा अनुपालन के इतिहास वाले फार्म से है। सावधानी से उपभोग करें।",
    ta: "இந்த தயாரிப்பு சமீபத்தில் குறைந்த உயிரியல் பாதுகாப்பு இணக்க வரலாற்றைக் கொண்ட ஒரு பண்ணையிலிருந்து வருகிறது. எச்சரிக்கையுடன் உட்கொள்ளவும்.",
    te: "ఈ ఉత్పత్తి తక్కువ జీవభద్రత వర్తింపు యొక్క ఇటీవలి చరిత్రతో ఉన్న వ్యవసాయ క్షేత్రం నుండి వచ్చింది. జాగ్రత్తగా తినండి.",
    bn: "এই পণ্যটি সাম্প্রতিক কম জৈব নিরাপত্তা সম্মতির ইতিহাস সহ একটি খামার থেকে। সাবধানে গ্রহণ করুন।",
    mr: "हे उत्पादन कमी जैवसुरक्षा अनुपालनाचा अलीकडील इतिहास असलेल्या फार्ममधून आहे. सावधगिरीने सेवन करा.",
  },
  productStatusDesc_danger: {
    en: "This product is linked to a batch from a farm with critical safety alerts. We advise against consumption.",
    hi: "यह उत्पाद गंभीर सुरक्षा अलर्ट वाले फार्म से एक बैच से जुड़ा हुआ है। हम उपभोग के खिलाफ सलाह देते हैं।",
    ta: "இந்த தயாரிப்பு முக்கியமான பாதுகாப்பு எச்சரிக்கைகளைக் கொண்ட ஒரு பண்ணையிலிருந்து ஒரு தொகுதியுடன் இணைக்கப்பட்டுள்ளது. நாங்கள் உட்கொள்வதற்கு எதிராக அறிவுறுத்துகிறோம்.",
    te: "ఈ ఉత్పత్తి క్లిష్టమైన భద్రతా హెచ్చరికలతో ఉన్న వ్యవసాయ క్షేత్రం నుండి వచ్చిన బ్యాచ్‌తో అనుసంధానించబడింది. మేము తినడానికి వ్యతిరేకంగా సలహా ఇస్తున్నాము.",
    bn: "এই পণ্যটি গুরুতর সুরক্ষা সতর্কতা সহ একটি খামার থেকে একটি ব্যাচের সাথে যুক্ত। আমরা গ্রহণের বিরুদ্ধে পরামর্শ দিই।",
    mr: "हे उत्पादन गंभीर सुरक्षा सूचना असलेल्या फार्ममधील एका बॅचशी जोडलेले आहे. आम्ही सेवनाविरुद्ध सल्ला देतो.",
  },
  productName: {
    en: "Product Name",
    hi: "उत्पाद का नाम",
    ta: "பொருளின் பெயர்",
    te: "వస్తువు పేరు",
    bn: "পণ্যের নাম",
    mr: "उत्पादनाचे नाव",
  },
  farmOfOrigin: {
    en: "Farm of Origin",
    hi: "मूल का खेत",
    ta: "தோற்றத்தின் பண்ணை",
    te: "మూలం యొక్క వ్యవసాయ క్షేత్రం",
    bn: "উৎপত্তির খামার",
    mr: "मूळचे फार्म",
  },
  farmComplianceScore: {
    en: "Farm Compliance Score",
    hi: "फार्म अनुपालन स्कोर",
    ta: "பண்ணை இணக்க மதிப்பெண்",
    te: "వ్యవసాయ క్షేత్రం వర్తింపు స్కోరు",
    bn: "খামার সম্মতি স্কোর",
    mr: "फार्म अनुपालन गुण",
  },
  farmComplianceList: {
    en: "Farm Compliance List",
    hi: "फार्म अनुपालन सूची",
    ta: "பண்ணை இணக்கப் பட்டியல்",
    te: "వ్యవసాయ క్షేత్రం వర్తింపు జాబితా",
    bn: "খামার সম্মতি তালিকা",
    mr: "फार्म अनुपालन यादी",
  },
  farmComplianceListDesc: {
    en: "View a list of registered farms and their latest biosecurity compliance scores to make informed decisions.",
    hi: "सूचित निर्णय लेने के लिए पंजीकृत फार्मों और उनके नवीनतम जैव सुरक्षा अनुपालन स्कोर की सूची देखें।",
    ta: "தகவலறிந்த முடிவுகளை எடுக்க பதிவுசெய்யப்பட்ட பண்ணைகள் மற்றும் அவற்றின் சமீபத்திய உயிரியல் பாதுகாப்பு இணக்க மதிப்பெண்களின் பட்டியலைக் காண்க.",
    te: "సమాచారం ఉన్న నిర్ణయాలు తీసుకోవడానికి నమోదు చేయబడిన వ్యవసాయ క్షేత్రాలు మరియు వాటి తాజా జీవభద్రత వర్తింపు స్కోర్‌ల జాబితాను వీక్షించండి।",
    bn: "অবগত সিদ্ধান্ত নিতে নিবন্ধিত খামার এবং তাদের সর্বশেষ জৈব নিরাপত্তা সম্মতি স্কোরের একটি তালিকা দেখুন।",
    mr: "माहितीपूर्ण निर्णय घेण्यासाठी नोंदणीकृत शेतांची आणि त्यांच्या नवीनतम जैवसुरक्षा अनुपालन गुणांची यादी पहा.",
  },
  farmName: {
    en: "Farm Name",
    hi: "फार्म का नाम",
    ta: "பண்ணை பெயர்",
    te: "వ్యవసాయ క్షేత్రం పేరు",
    bn: "খামারের নাম",
    mr: "फार्मचे नाव",
  },
  region: {
    en: "Region",
    hi: "क्षेत्र",
    ta: "பிராந்தியம்",
    te: "ప్రాంతం",
    bn: "অঞ্চল",
    mr: "प्रदेश",
  },
  lastInspection: {
    en: "Last Inspection",
    hi: "अंतिम निरीक्षण",
    ta: "கடைசி ஆய்வு",
    te: "చివరి తనిఖీ",
    bn: "শেষ পরিদর্শন",
    mr: "शेवटची तपासणी",
  },
  trySampleIds: {
    en: "Try one of these sample IDs",
    hi: "इन सैंपल आईडी में से एक को आजमाएं",
    ta: "இந்த மாதிரி ஐடிகளில் ஒன்றை முயற்சிக்கவும்",
    te: "ఈ నమూనా ఐడిలలో ఒకదాన్ని ప్రయత్నించండి",
    bn: "এই নমুনা আইডিগুলির মধ্যে একটি চেষ্টা করুন",
    mr: "या नमुना आयडींपैकी एक वापरून पहा",
  },
};

// --- APP PROVIDER ---
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: "danger" | "warning" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "danger",
  });

  // Theme logic
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme;
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } catch (e) {
      return "light";
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Language logic
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem("language") as Language;
    return savedLang || "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key: string): string => {
    const lowerKey = key.toLowerCase();
    const translationKey = Object.keys(translations).find(
      (k) => k.toLowerCase() === lowerKey
    );
    return (translationKey && translations[translationKey]?.[language]) || key;
  };

  // Auth and User Profile Logic
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    role: null,
  });
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);

  const login = (role: Role) => {
    const profile = getProfileByRole(role);
    setAuthState({ isAuthenticated: true, role });
    setUserProfile(profile);
  };

  const logout = () => {
    setAuthState({ isAuthenticated: false, role: null });
    setUserProfile(defaultProfile);
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({
      ...prev,
      ...updates,
      notifications: { ...prev.notifications, ...updates.notifications },
    }));
  };

  // Notification Logic
  const [notifications, setNotifications] = useState<Alert[]>(DUMMY_ALERTS);
  const addNotification = (notification: Alert) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  // Community Logic (with useReducer)
  const initialPosts = () => {
    let postsFromStorage: CommunityPost[] = [];
    try {
      const savedPosts = localStorage.getItem("communityPosts");
      if (savedPosts) {
        postsFromStorage = JSON.parse(savedPosts);
      }
    } catch (error) {
      console.error("Error reading community posts from localStorage:", error);
      // If parsing fails, we'll fall back to dummy data below
      postsFromStorage = [];
    }

    const basePosts =
      postsFromStorage.length > 0 ? postsFromStorage : DUMMY_COMMUNITY_POSTS;

    // CRITICAL FIX: Ensure all posts, whether from storage or dummy data, have the required UI state properties.
    return basePosts.map((p: any) => ({
      ...p,
      comments: p.comments || [],
      showComments: p.showComments || false,
      newCommentText: p.newCommentText || "",
    }));
  };

  const [posts, dispatch] = useReducer(postsReducer, [], initialPosts);

  useEffect(() => {
    try {
      // Create a clean version of posts for storage, stripping out temporary UI state
      const postsToSave = posts.map(
        ({ showComments, newCommentText, ...rest }) => rest
      );
      localStorage.setItem("communityPosts", JSON.stringify(postsToSave));
    } catch (error) {
      console.error("Error saving community posts to localStorage:", error);
    }
  }, [posts]);

  const deletePost = (postId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: t("delete"),
      message: t("deletePostConfirm"),
      type: "danger",
      onConfirm: () => {
        dispatch({ type: "DELETE_POST", payload: { postId } });
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const deleteComment = (postId: string, commentId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: t("delete"),
      message: t("deleteCommentConfirm"),
      type: "danger",
      onConfirm: () => {
        dispatch({ type: "DELETE_COMMENT", payload: { postId, commentId } });
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const addNewPost = (title: string, content: string) => {
    dispatch({
      type: "ADD_POST",
      payload: { title, content, user: userProfile },
    });
  };

  const postComment = (postId: string) => {
    dispatch({ type: "ADD_COMMENT", payload: { postId, user: userProfile } });
  };

  const toggleComments = (postId: string) => {
    dispatch({ type: "TOGGLE_COMMENTS", payload: { postId } });
  };

  const handleCommentChange = (postId: string, text: string) => {
    dispatch({ type: "SET_COMMENT_TEXT", payload: { postId, text } });
  };

  // Create context values
  const themeValue = { theme, toggleTheme };
  const languageValue = { language, setLanguage, t };
  const userValue = {
    authState,
    login,
    logout,
    userProfile,
    updateUserProfile,
    posts,
    addNewPost,
    deletePost,
    deleteComment,
    postComment,
    toggleComments,
    handleCommentChange,
  };
  const notificationValue = { notifications, addNotification };

  return (
    <ThemeContext.Provider value={themeValue}>
      <LanguageContext.Provider value={languageValue}>
        <UserContext.Provider value={userValue}>
          <NotificationContext.Provider value={notificationValue}>
            {children}
            <ConfirmDialog
              isOpen={confirmDialog.isOpen}
              title={confirmDialog.title}
              message={confirmDialog.message}
              confirmText={t("delete")}
              cancelText={t("cancel")}
              type={confirmDialog.type}
              onConfirm={confirmDialog.onConfirm}
              onCancel={() =>
                setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
              }
            />
          </NotificationContext.Provider>
        </UserContext.Provider>
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
};
