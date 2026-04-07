import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import MainLayout from "../layouts/MainLayout";

import HomePage from "../pages/public/HomePage";
import ApartmentsPage from "../pages/public/ApartmentsPage";
import ApartmentDetailPage from "../pages/public/ApartmentDetailPage";
import NotFoundPage from "../pages/public/NotFoundPage";
import RegisterPage from "../pages/public/RegisterPage";
import ReservationPage from "../pages/public/ReservationPage";
import UserAccountPage from "../pages/user/UserAccountPage";

import ProtectedRoute from "./ProtectedRoute";

import AdminApartmentsPage from "../pages/admin/AdminApartmentsPage";
import AdminBlocksPage from "../pages/admin/AdminBlocksPage";
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminReservationsPage from "../pages/admin/AdminReservationsPage";

function AppRouter() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route path="login" element={<AdminLoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route index element={<HomePage />} />
                <Route path="apartments" element={<ApartmentsPage />} />
                <Route path="apartments/:id" element={<ApartmentDetailPage />} />
                <Route path="account" element={<ProtectedRoute><UserAccountPage /></ProtectedRoute>} />
                <Route path="reserve" element={<ReservationPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>

            <Route
                path="/admin"
                element={
                    <ProtectedRoute requireAdmin={true}>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<AdminDashboardPage />} />
                <Route path="apartments" element={<AdminApartmentsPage />} />
                <Route path="reservations" element={<AdminReservationsPage />} />
                <Route path="blocks" element={<AdminBlocksPage />} />
            </Route>
        </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;
