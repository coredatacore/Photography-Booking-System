import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { RootLayout } from "./layouts/RootLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { AdminRoute } from "./components/AdminRoute";

// Public Pages
import { Home } from "./pages/Home";
import { Portfolio } from "./pages/Portfolio";
import { Packages } from "./pages/Packages";
import { Contact } from "./pages/Contact";
import { Booking } from "./pages/Booking";
import { Login } from "./pages/Login";

// Admin Dashboard
import { AdminDashboard } from "./pages/admin/Dashboard";
import { AdminBookings } from "./pages/admin/Bookings";
import { AdminClients } from "./pages/admin/Clients";
import { AdminPackages } from "./pages/admin/Packages";
import { AdminPayments } from "./pages/admin/Payments";
import { AdminReports } from "./pages/admin/Reports";
import { AdminSettings } from "./pages/admin/Settings";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="packages" element={<Packages />} />
            <Route path="contact" element={<Contact />} />
            <Route path="booking" element={<Booking />} />
            <Route path="login" element={<Login />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<DashboardLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="clients" element={<AdminClients />} />
              <Route path="packages" element={<AdminPackages />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;