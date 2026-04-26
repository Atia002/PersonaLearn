import { createBrowserRouter } from "react-router";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Onboarding from "./pages/onboarding/Onboarding";
import Diagnostic from "./pages/Diagnostic";
import PersonalizedPlan from "./pages/PersonalizedPlan";
import Dashboard from "./pages/student/Dashboard";
import LearningPath from "./pages/student/LearningPath";
import Lesson from "./pages/student/Lesson";
import MyMaterials from "./pages/student/MyMaterials";
import Quiz from "./pages/student/Quiz";
import WeeklyPlanner from "./pages/student/WeeklyPlanner";
import Progress from "./pages/student/Progress";
import Profile from "./pages/student/Profile";
import Settings from "./pages/student/Settings";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

// 404 Not Found component
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <a href="/" className="text-blue-600 hover:underline">Go back home</a>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: SignUp,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/onboarding",
    Component: Onboarding,
  },
  {
    path: "/diagnostic",
    Component: Diagnostic,
  },
  {
    path: "/personalized-plan",
    Component: PersonalizedPlan,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/learning-path",
    Component: LearningPath,
  },
  {
    path: "/lesson/:id",
    Component: Lesson,
  },
  {
    path: "/materials",
    Component: MyMaterials,
  },
  {
    path: "/quiz",
    Component: Quiz,
  },
  {
    path: "/quiz/:id",
    Component: Quiz,
  },
  {
    path: "/planner",
    Component: WeeklyPlanner,
  },
  {
    path: "/progress",
    Component: Progress,
  },
  {
    path: "/profile",
    Component: Profile,
  },
  {
    path: "/settings",
    Component: Settings,
  },
  {
    path: "/instructor",
    Component: InstructorDashboard,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
