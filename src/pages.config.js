import Achievements from './pages/Achievements';
import Adhkar from './pages/Adhkar';
import AdminDashboard from './pages/AdminDashboard';
import AdminPanel from './pages/AdminPanel';
import Assistant from './pages/Assistant';
import Bookmarks from './pages/Bookmarks';
import Calligraphy from './pages/Calligraphy';
import CompleteCodeReference from './pages/CompleteCodeReference';
import Dashboard from './pages/Dashboard';
import Duaa from './pages/Duaa';
import Home from './pages/Home';
import ImplementationChecklist from './pages/ImplementationChecklist';
import Kids from './pages/Kids';
import MemorizationPlan from './pages/MemorizationPlan';
import NotificationDocs from './pages/NotificationDocs';
import NotificationSettings from './pages/NotificationSettings';
import Notifications from './pages/Notifications';
import NotificationsDocs from './pages/NotificationsDocs';
import OrphansAdmin from './pages/OrphansAdmin';
import OrphansService from './pages/OrphansService';
import PrayerTimes from './pages/PrayerTimes';
import Profile from './pages/Profile';
import ProjectChart from './pages/ProjectChart';
import ProjectDocumentation from './pages/ProjectDocumentation';
import Quran from './pages/Quran';
import Radio from './pages/Radio';
import RecitationPlayer from './pages/RecitationPlayer';
import Reciters from './pages/Reciters';
import Stats from './pages/Stats';
import SurahView from './pages/SurahView';
import Tilawa from './pages/Tilawa';
import SpeedTest from './pages/SpeedTest';
import Settings from './pages/Settings';
import Community from './pages/Community';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Achievements": Achievements,
    "Adhkar": Adhkar,
    "AdminDashboard": AdminDashboard,
    "AdminPanel": AdminPanel,
    "Assistant": Assistant,
    "Bookmarks": Bookmarks,
    "Calligraphy": Calligraphy,
    "CompleteCodeReference": CompleteCodeReference,
    "Dashboard": Dashboard,
    "Duaa": Duaa,
    "Home": Home,
    "ImplementationChecklist": ImplementationChecklist,
    "Kids": Kids,
    "MemorizationPlan": MemorizationPlan,
    "NotificationDocs": NotificationDocs,
    "NotificationSettings": NotificationSettings,
    "Notifications": Notifications,
    "NotificationsDocs": NotificationsDocs,
    "OrphansAdmin": OrphansAdmin,
    "OrphansService": OrphansService,
    "PrayerTimes": PrayerTimes,
    "Profile": Profile,
    "ProjectChart": ProjectChart,
    "ProjectDocumentation": ProjectDocumentation,
    "Quran": Quran,
    "Radio": Radio,
    "RecitationPlayer": RecitationPlayer,
    "Reciters": Reciters,
    "Stats": Stats,
    "SurahView": SurahView,
    "Tilawa": Tilawa,
    "SpeedTest": SpeedTest,
    "Settings": Settings,
    "Community": Community,
}

export const pagesConfig = {
    mainPage: "Quran",
    Pages: PAGES,
    Layout: __Layout,
};