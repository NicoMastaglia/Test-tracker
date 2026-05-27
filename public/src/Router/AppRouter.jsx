import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login";
import DashBoard from "../pages/Dashboard";
// import SessionsTests from "../pages/SessionsTests";
// import AdminSessions from "../pages/AdminSessions";
import Sessions from "../pages/Sessions";
import Users from "../pages/Users";
import AdminProjects from "../pages/AdminProjects";
import UserProject from "../pages/UserProject";
import CheckList from "@/pages/CheckList";
import ProjectDetail from "@/Components/features/projects/ProjectDetail";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["superadmin", "admin", "user"]}>
              <DashBoard />
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/sessions/:id"
          element={
            <ProtectedRoute allowedRoles={["superadmin", "admin", "user"]}>
              <SessionsTests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sessions-test"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Sessions />
            </ProtectedRoute>
          }
        /> */}

        <Route
          path="/user/projects"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserProject />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/checklists"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <CheckList />
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/admin/sessions"
          element={
            <ProtectedRoute allowedRoles={["superadmin", "admin"]}>
              <AdminSessions />
            </ProtectedRoute>
          }
        /> */}

        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute allowedRoles={["superadmin", "admin"]}>
              <AdminProjects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/projects/:id"
          element={
            <ProtectedRoute allowedRoles={["superadmin", "admin"]}>
              <ProjectDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/projects/:id/checklist"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CheckList />
            </ProtectedRoute>
          }
        />


        <Route path="/user/checkList" element={<Navigate to="/user/checklists" replace />} />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}