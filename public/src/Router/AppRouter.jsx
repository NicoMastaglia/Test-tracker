import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/Login";
import DashBoard from "../pages/Dashboard";

import Users from "../pages/Users";

import AdminProjects from "../pages/AdminProjects";
import UserProject from "../pages/UserProject";

import CheckList from "@/pages/CheckList";

import ProjectDetail from "@/Components/features/projects/ProjectDetail";

import NotFound from "@/pages/NotFound";

// import Sessions from "../pages/Sessions";
// import AdminSessions from "../pages/AdminSessions";
// import SessionsTests from "../pages/SessionsTests";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />

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
          path="/user/checklists"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <CheckList />
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
          path="/admin/projects/:id/checklist"
          element={
            <ProtectedRoute allowedRoles={["superadmin", "admin"]}>
              <CheckList />
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

        {/* FUTURE SESSIONS */}
        {/*
        <Route
          path="/sessions/:id"
          element={
            <ProtectedRoute allowedRoles={["superadmin", "admin", "user"]}>
              <SessionsTests />
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

        <Route
          path="/sessions-test"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Sessions />
            </ProtectedRoute>
          }
        />
        */}

        {/* FALLBACK */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}