import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages
import LoginPage from "./pages/LoginPage";
import StudentOnboardingPage from "./pages/onboarding/StudentOnboardingPage";
import SchoolOnboardingPage from "./pages/onboarding/SchoolOnboardingPage";
import StudentDashboardPage from "./pages/student/StudentDashboardPage";
import JobOpportunitiesPage from "./pages/student/JobOpportunitiesPage";
import StudentProfilePage from "./pages/student/StudentProfilePage";
import StudentSchedulePage from "./pages/student/StudentSchedulePage";
import SchoolDashboardPage from "./pages/school/SchoolDashboardPage";
import SchoolJobsPage from "./pages/school/SchoolJobsPage";
import JobApplicantsPage from "./pages/school/JobApplicantsPage";
import ApplicantProfilePage from "./pages/school/ApplicantProfilePage";
import JobPostPage from "./pages/school/JobPostPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import MasterDataPage from "./pages/admin/MasterDataPage";
import HelpDeskPage from "./pages/admin/HelpDeskPage";
import JobDetailsPage from "./pages/JobDetailsPage";

// This component protects routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading Application...</div>;
  }

  // If authenticated but not onboarded, force redirection to onboarding
  if (isAuthenticated && !user.onboarded && !location.pathname.includes('/onboarding')) {
     if (user.role === 'student') return <Navigate to="/onboarding/student" />;
     if (user.role === 'school') return <Navigate to="/onboarding/school" />;
  }
  
  // If authenticated and ONBOARDED, but at the login page, redirect to their dashboard
  if (isAuthenticated && user.onboarded && location.pathname === '/login') {
     if (user.role === 'admin') return <Navigate to="/admin" />;
     return <Navigate to={`/${user.role}`} />;
  }


  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/onboarding/student" element={<ProtectedRoute><StudentOnboardingPage /></ProtectedRoute>} />
      <Route path="/onboarding/school" element={<ProtectedRoute><SchoolOnboardingPage /></ProtectedRoute>} />

      {/* Student Routes */}
      <Route path="/student" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<StudentDashboardPage />} />
        <Route path="jobs" element={<JobOpportunitiesPage />} />
        <Route path="jobs/:id" element={<JobDetailsPage />} />
        <Route path="profile" element={<StudentProfilePage />} />
        <Route path="schedule" element={<StudentSchedulePage />} />
      </Route>

      {/* School Routes */}
      <Route path="/school" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
         <Route index element={<Navigate to="dashboard" />} />
         <Route path="dashboard" element={<SchoolDashboardPage />} />
         <Route path="jobs" element={<SchoolJobsPage />} />
         <Route path="jobs/post" element={<JobPostPage />} />
         <Route path="jobs/:id/applicants" element={<JobApplicantsPage />} />
         <Route path="applicants/:id" element={<ApplicantProfilePage />} />
      </Route>
      
      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="master-data" element={<MasterDataPage />} />
        <Route path="help-desk" element={<HelpDeskPage />} />
      </Route>

      {/* Catch-all route at the end */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;