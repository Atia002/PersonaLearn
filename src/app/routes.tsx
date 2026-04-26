import type { ReactNode } from "react";
import { Navigate, createBrowserRouter } from "react-router";
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
import { useLearner } from "./contexts/LearnerContext";

function RequireRole({ allowedRoles, children }: { allowedRoles: Array<'student' | 'instructor' | 'admin'>; children: ReactNode }) {
  const { learner, isAuthenticated } = useLearner();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const role = learner?.role || 'student';
  if (allowedRoles.includes(role as 'student' | 'instructor' | 'admin')) {
    return <>{children}</>;
  }

  if (role === 'instructor') {
    return <Navigate to="/instructor" replace />;
  }

  if (role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}

function StudentOnboardingRoute() {
  return (
    <RequireRole allowedRoles={['student']}>
      <Onboarding />
    </RequireRole>
  );
}

function StudentDiagnosticRoute() {
  return (
    <RequireRole allowedRoles={['student']}>
      <Diagnostic />
    </RequireRole>
  );
}

function StudentPlanRoute() {
  return (
    <RequireRole allowedRoles={['student']}>
      <PersonalizedPlan />
    </RequireRole>
  );
}

function StudentDashboardRoute() {
  return (
    <RequireRole allowedRoles={['student']}>
      <Dashboard />
    </RequireRole>
  );
}

function StudentLessonRoute() {
  return (
    <RequireRole allowedRoles={['student']}>
      <Lesson />
    </RequireRole>
  );
}

function StudentMaterialsRoute() {
  return (
    <RequireRole allowedRoles={['student']}>
      <MyMaterials />
    </RequireRole>
  );
}

function StudentQuizRoute() {
  return (
    <RequireRole allowedRoles={['student']}>
      <Quiz />
    </RequireRole>
  );
}

function StudentPlannerRoute() {
  return (
    <RequireRole allowedRoles={['student']}>
      <WeeklyPlanner />
    </RequireRole>
  );
}

function StudentProgressRoute() {
  return (
    <RequireRole allowedRoles={['student']}>
      <Progress />
    </RequireRole>
  );
}

function StudentProfileRoute() {
  return (
    <RequireRole allowedRoles={['student']}>
      <Profile />
    </RequireRole>
  );
}

function StudentSettingsRoute() {
  return (
    <RequireRole allowedRoles={['student']}>
      <Settings />
    </RequireRole>
  );
}

function InstructorRoute() {
  return (
    <RequireRole allowedRoles={['instructor']}>
      <InstructorDashboard />
    </RequireRole>
  );
}

function AdminRoute() {
  return (
    <RequireRole allowedRoles={['admin']}>
      <AdminDashboard />
    </RequireRole>
  );
}

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
    Component: StudentOnboardingRoute,
  },
  {
    path: "/diagnostic",
    Component: StudentDiagnosticRoute,
  },
  {
    path: "/personalized-plan",
    Component: StudentPlanRoute,
  },
  {
    path: "/dashboard",
    Component: StudentDashboardRoute,
  },
  {
    path: "/learning-path",
    Component: LearningPath,
  },
  {
    path: "/lesson/:id",
    Component: StudentLessonRoute,
  },
  {
    path: "/materials",
    Component: StudentMaterialsRoute,
  },
  {
    path: "/quiz",
    Component: StudentQuizRoute,
  },
  {
    path: "/quiz/:id",
    Component: StudentQuizRoute,
  },
  {
    path: "/planner",
    Component: StudentPlannerRoute,
  },
  {
    path: "/progress",
    Component: StudentProgressRoute,
  },
  {
    path: "/profile",
    Component: StudentProfileRoute,
  },
  {
    path: "/settings",
    Component: StudentSettingsRoute,
  },
  {
    path: "/instructor",
    Component: InstructorRoute,
  },
  {
    path: "/admin",
    Component: AdminRoute,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
