import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Login from "@/pages/auth/Login";
import SetupAccount from "@/pages/auth/SetupAccount";
import DashBoard from "@/pages/shared/Dashboard";

import Users from "@/pages/admin/Users";

import AdminProjects from "@/pages/admin/AdminProjects";
import UserProject from "@/pages/user/UserProject";

import ChecklistDetail from "@/pages/shared/ChecklistDetail";

import ProjectDetail from "@/Components/features/projects/ProjectDetail/ProjectDetail";

import NotFound from "@/pages/auth/NotFound";
import Settings from "@/pages/shared/Settings";

import Sessions from "@/pages/user/Sessions";
import MyTasks from "@/pages/user/MyTasks";
import SessionDetail from "@/pages/user/SessionDetail";
import AuditLog from "@/pages/admin/AuditLog";
import AdminSessions from "@/pages/admin/AdminSessions";
import UserDetail from "@/pages/admin/UserDetail";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/setup" element={<SetupAccount />} />

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* SHARED DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["superadmin", "admin", "user"]}>
              <DashBoard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={["superadmin", "admin", "user"]}>
              <Settings />
            </ProtectedRoute>
          }
        />



        {/* USER ROUTES */}
        <Route
          path="/user/projects"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserProject />
            </ProtectedRoute>
          }
        />


<Route
  path="/user/projects/:id"
  element={
    <ProtectedRoute allowedRoles={["user"]}>
      <ProjectDetail />
    </ProtectedRoute>
  }
/>

        {/* ADMIN + SUPERADMIN ROUTES */}
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
          path="/admin/projects/:id/checklist/:checklistId"
          element={
            <ProtectedRoute allowedRoles={["superadmin", "admin"]}>
              <ChecklistDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/sessions"
          element={
            <ProtectedRoute allowedRoles={["superadmin", "admin"]}>
              <AdminSessions />
            </ProtectedRoute>
          }
        />

        {/* SUPERADMIN ONLY */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users/:id"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <UserDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/audit-log"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <AuditLog />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sessions/:id"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
              <SessionDetail />
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
        />

        <Route
          path="/user/tasks"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MyTasks />
            </ProtectedRoute>
          }
        />


        {/* FALLBACK */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}