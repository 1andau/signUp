// App.tsx
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ErrorBoundary } from "react-error-boundary";
import Navbar from "./components/navbar/Navbar";
import { RootState } from "./store";
import { ErrorFallback } from "./utils/Fallback";
import LoadingSpinner from "./components/loader/LoadingSpinner";

const SignupForm = lazy(() => import("./features/auth/SignupForm"));
const ConfirmEmail = lazy(() => import("./features/auth/ConfirmEmail"));
const LoginForm = lazy(() => import("./features/auth/LoginForm"));
const Profile = lazy(() => import("./components/profile/Profile"));
const NotFound = lazy(() => import("./components/NotFound"));


const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = !!token;

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = !!token;

  return !isAuthenticated ? <>{children}</> : <Navigate to="/profile" replace />;
};

const App = () => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => console.error("ErrorBoundary caught:", error, info.componentStack)}
      onReset={() => window.location.reload()} 
    >
      <BrowserRouter>
        <Navbar />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route
              path="/"
              element={
                <PublicRoute>
                  <SignupForm />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginForm />
                </PublicRoute>
              }
            />
            <Route
              path="/confirm/:token"
              element={
                <PublicRoute>
                  <ConfirmEmail />
                </PublicRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;