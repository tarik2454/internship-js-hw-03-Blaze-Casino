import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthLayout } from "./layouts/AuthLayout";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { RootLayout } from "./layouts/RootLayout";
import { HomePage } from "./pages/HomePage";
import { ProtectedRoute } from "./shared/components/ProtectedRoute";
import { initAuthToken } from "./api/auth";
import { UserStatsProvider } from "./context/UserStatsContext";

initAuthToken();

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route index element={<Navigate to="/auth/login" replace />} />
        </Route>

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <UserStatsProvider>
                <RootLayout />
              </UserStatsProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </Router>
  );
}
