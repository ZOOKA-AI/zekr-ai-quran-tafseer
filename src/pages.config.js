/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Quran from './pages/Quran';
import SurahView from './pages/SurahView';
import Bookmarks from './pages/Bookmarks';
import Profile from './pages/Profile';
import PrayerTimes from './pages/PrayerTimes';
import Assistant from './pages/Assistant';
import Reciters from './pages/Reciters';
import Calligraphy from './pages/Calligraphy';
import Notifications from './pages/Notifications';
import NotificationDocs from './pages/NotificationDocs';
import NotificationSettings from './pages/NotificationSettings';
import Tilawa from './pages/Tilawa';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Radio from './pages/Radio';
import Duaa from './pages/Duaa';
import Adhkar from './pages/Adhkar';
import Stats from './pages/Stats';
import MemorizationPlan from './pages/MemorizationPlan';
import Achievements from './pages/Achievements';
import Home from './pages/Home';
import Kids from './pages/Kids';
import OrphansService from './pages/OrphansService';
import OrphansAdmin from './pages/OrphansAdmin';
import AdminDashboard from './pages/AdminDashboard';
import ImplementationChecklist from './pages/ImplementationChecklist';
import ProjectChart from './pages/ProjectChart';
import ProjectDocumentation from './pages/ProjectDocumentation';
import CompleteCodeReference from './pages/CompleteCodeReference';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Quran": Quran,
    "SurahView": SurahView,
    "Bookmarks": Bookmarks,
    "Profile": Profile,
    "PrayerTimes": PrayerTimes,
    "Assistant": Assistant,
    "Reciters": Reciters,
    "Calligraphy": Calligraphy,
    "Notifications": Notifications,
    "NotificationDocs": NotificationDocs,
    "NotificationSettings": NotificationSettings,
    "Tilawa": Tilawa,
    "Dashboard": Dashboard,
    "AdminPanel": AdminPanel,
    "Radio": Radio,
    "Duaa": Duaa,
    "Adhkar": Adhkar,
    "Stats": Stats,
    "MemorizationPlan": MemorizationPlan,
    "Achievements": Achievements,
    "Home": Home,
    "Kids": Kids,
    "OrphansService": OrphansService,
    "OrphansAdmin": OrphansAdmin,
    "AdminDashboard": AdminDashboard,
    "ImplementationChecklist": ImplementationChecklist,
    "ProjectChart": ProjectChart,
    "ProjectDocumentation": ProjectDocumentation,
    "CompleteCodeReference": CompleteCodeReference,
}

export const pagesConfig = {
    mainPage: "Quran",
    Pages: PAGES,
    Layout: __Layout,
};