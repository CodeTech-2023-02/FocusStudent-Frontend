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

import { Roles } from "./constants/roles";
import {
  LOGIN,
  ROOT,
  DASHBOARD,
  COURSE,
  POLICY,
  REPORT,
  STUDENTS,
  UNAUTHORIZED,
  SECTION,
  LECTION,
  STUDENT_TRACKING,
  TEACHERS,
} from "./constants/routes";
import { useAuth } from "./state/AuthContext";
import ThemeProvider from "./theme/ThemeProvider";
import ProtectedElement from "./utils/ProtectedElement";
import SidebarLayout from "./abstracts/Sidebar/SidebarLayout";
import Support from "./components/Auth/Support";
import Unauthorized from "./components/Common/Unauthorized";
import NotFound from "./components/Common/NotFound";
import SectionComponent from "./components/Admin/section/SectionComponent";
import LectionComponent from "./components/Teacher/lesson/LessonComponent";
import UsersComponent from "./components/Admin/users/UsersComponent";

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
              isLoggedIn ? <Navigate to={DASHBOARD} /> : <Navigate to={LOGIN} />
            }
          />
          <Route
            path={LOGIN}
            element={isLoggedIn ? <Navigate to={DASHBOARD} /> : <Login />}
          />
          <Route path="/support" element={<Support />} />
          <Route
            path="*"
            element={
              <NotFound role={isLoggedIn ? isLoggedIn.role : undefined} />
            }
          />

          {/* SidebarLayout wrapping the nested routes */}
          <Route element={<SidebarLayout />}>
            <Route
              path={DASHBOARD}
              element={
                isLoggedIn ? (
                  isLoggedIn.role === Roles.STUDENT ? (
                    <ProtectedElement roles={["STUDENT"]}>
                      <StudentDashboard />
                    </ProtectedElement>
                  ) : (
                    <ProtectedElement roles={["TEACHER", "ADMIN"]}>
                      <TeacherDashboard />
                    </ProtectedElement>
                  )
                ) : (
                  <Navigate to={LOGIN} />
                )
              }
            />

            <Route
              path={COURSE}
              element={
                <ProtectedElement roles={["TEACHER", "ADMIN", "STUDENT"]}>
                  <CourseComponent />
                </ProtectedElement>
              }
            />
            <Route
              path={SECTION}
              element={
                <ProtectedElement roles={["ADMIN"]}>
                  <SectionComponent />
                </ProtectedElement>
              }
            />
            <Route
              path={STUDENTS}
              element={
                <ProtectedElement roles={["TEACHER", "ADMIN"]}>
                  <UsersComponent userType="students" />
                </ProtectedElement>
              }
            />
            <Route
              path={TEACHERS}
              element={
                <ProtectedElement roles={["ADMIN"]}>
                  <UsersComponent userType="teachers" />
                </ProtectedElement>
              }
            />
            <Route
              path={REPORT}
              element={
                <ProtectedElement roles={["TEACHER", "ADMIN", "STUDENT"]}>
                  <ReportComponent />
                </ProtectedElement>
              }
            />
            <Route
              path={POLICY}
              element={
                <ProtectedElement roles={["TEACHER", "ADMIN", "STUDENT"]}>
                  <PolicyComponent />
                </ProtectedElement>
              }
            />
            <Route
              path={LECTION}
              element={
                <ProtectedElement roles={["TEACHER"]}>
                  <LectionComponent />
                </ProtectedElement>
              }
            />
            <Route
              path={STUDENT_TRACKING}
              element={
                <ProtectedElement roles={["STUDENT"]}>
                  <TrackingComponent />
                </ProtectedElement>
              }
            />
            <Route path={UNAUTHORIZED} element={<Unauthorized />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default AppRouter;
