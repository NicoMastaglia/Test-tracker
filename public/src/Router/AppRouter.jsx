import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import DashBoard from "../pages/Dashboard";

import ProctedRoute from "./ProtectedRoute";
import SessionsTests from "../pages/SessionsTests";
import AdminSessions from "../pages/Sessions";
import Sessions from "../pages/Sessions";
// import ManageUsers from "../pages/ManageUsers";
import Users from "../pages/Users";
import { useAuth } from "../context/AuthContext";

import AdminProjects from "../pages/AdminProjects";
export default function AppRouter() {

  return (
  <BrowserRouter>
      <Routes>

  {/* PUBLIC */}
  <Route path="/login" element={<Login />} />

  {/* DASHBOARD */}
  <Route path="/dashboard" element={
    <ProctedRoute allowedRoles={['superadmin', 'admin', 'tester', 'user']}>
      <DashBoard />
    </ProctedRoute>
  } />

  {/* TESTER + ADMIN */}
  <Route path="/sessions/:id" element={
    <ProctedRoute allowedRoles={['superadmin', 'admin', 'tester','user']}>
      <SessionsTests />
    </ProctedRoute>
  } />

  {/* ADMIN AREA */}
  {/* <Route path="/admin" element={
    <ProctedRoute allowedRoles={['superadmin', 'admin']}>
      <AdminDashboard />
    </ProctedRoute>
  } /> */}

  <Route path="/admin/sessions" element={
    <ProctedRoute allowedRoles={['superadmin', 'admin']}>
      <AdminSessions />
    </ProctedRoute>
  } />





  {/* <Route path="/admin/projects" element={
    <ProctedRoute allowedRoles={['superadmin', 'admin']}>
      <Projects />
    </ProctedRoute>
  } /> */}
{/* 
  <Route path="/admin/templates" element={
    <ProctedRoute allowedRoles={['superadmin', 'admin']}>
      <Templates />
    </ProctedRoute>
  } /> */}

  <Route path="/admin/users" element={
    <ProctedRoute allowedRoles={['superadmin']}>
      <Users />
    </ProctedRoute>
  } />

  <Route path="/admin/projects" element={
    <ProctedRoute allowedRoles={['superadmin','admin']}>
      <AdminProjects />
    </ProctedRoute>
  } />

  <Route path="/admin/projects/:id" element={
    <ProctedRoute allowedRoles={['superadmin','admin']}>
      <AdminProjects />
    </ProctedRoute>
  } />

  <Route path="/sessions-test" element={
    <ProctedRoute allowedRoles={['tester','user']}>
      <Sessions/>
    </ProctedRoute>
  } />


  

  {/* FALLBACK */}
  <Route path="*" element={<h1>404 Not Found</h1>} />

</Routes>
    </BrowserRouter>
  );
}