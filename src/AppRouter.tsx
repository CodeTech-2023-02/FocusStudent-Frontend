import { CssBaseline } from "@mui/material";
import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import PolicyComponent from "./components/Policy/PolicyComponent";
import ReportComponent from "./components/Report/ReportComponent";
import StudentDashboard from "./components/Student/StudentDashboard";
import TrackingComponent from "./components/Student/tracking/TrackingComponent";
import TeacherDashboard from "./components/Teacher/TeacherDashboard";
import CourseComponent from "./components/Teacher/course/CourseComponent";
import StudentsComponent from "./components/Teacher/students/StudentsComponent";
import { Roles } from "./constants/roles";
import { LOGIN, ROOT, STUDENT_DASHBOARD, TEACHER_COURSE, TEACHER_DASHBOARD, TEACHER_POLICY, TEACHER_REPORT, TEACHER_STUDENTS } from "./constants/routes";
import { useAuth } from "./state/AuthContext";
import ThemeProvider from "./theme/ThemeProvider";
import ProtectedElement from "./utils/ProtectedElement";
import SidebarLayout from "./abstracts/Sidebar/SidebarLayout";
import Register from "./components/Auth/Register";

const AppRouter: React.FC = () => {
  const auth = useAuth();
  const isLoggedIn = auth && auth.currentUser;

  return (
    <ThemeProvider>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route
            path={ROOT}
            element={
              isLoggedIn ? (
                <Navigate to={isLoggedIn.role === Roles.TEACHER ? TEACHER_DASHBOARD : STUDENT_DASHBOARD} />
              ) : (
                <Navigate to={LOGIN} />
              )
            }
          />
          <Route path={LOGIN} element={isLoggedIn ? <Navigate to={isLoggedIn.role === Roles.STUDENT ? STUDENT_DASHBOARD : TEACHER_DASHBOARD} /> : <Login />} />
          <Route path="/register" element={isLoggedIn ? <Navigate to={isLoggedIn.role === Roles.STUDENT ? STUDENT_DASHBOARD : TEACHER_DASHBOARD} /> : <Register />} />


          {/* SidebarLayout wrapping the nested routes */}
          <Route element={<SidebarLayout />}>
            <Route path={TEACHER_DASHBOARD} element={<ProtectedElement role="TEACHER"><TeacherDashboard /></ProtectedElement>} />
            <Route path={TEACHER_COURSE} element={<ProtectedElement role="TEACHER"><CourseComponent /></ProtectedElement>} />
            <Route path={TEACHER_STUDENTS} element={<ProtectedElement role="TEACHER"><StudentsComponent /></ProtectedElement>} />
            <Route path={TEACHER_REPORT} element={<ProtectedElement role="TEACHER"><ReportComponent /></ProtectedElement>} />
            <Route path={TEACHER_POLICY} element={<ProtectedElement role="TEACHER"><PolicyComponent /></ProtectedElement>} />

            <Route path={STUDENT_DASHBOARD} element={<ProtectedElement role="STUDENT"><StudentDashboard /></ProtectedElement>} />
            <Route path={`${STUDENT_DASHBOARD}/course`} element={<ProtectedElement role="STUDENT"><CourseComponent /></ProtectedElement>} />
            <Route path={`${STUDENT_DASHBOARD}/tracking`} element={<ProtectedElement role="STUDENT"><TrackingComponent /></ProtectedElement>} />
            <Route path={`${STUDENT_DASHBOARD}/reports`} element={<ProtectedElement role="STUDENT"><ReportComponent /></ProtectedElement>} />
            <Route path={`${STUDENT_DASHBOARD}/policy`} element={<ProtectedElement role="STUDENT"><PolicyComponent /></ProtectedElement>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default AppRouter;
