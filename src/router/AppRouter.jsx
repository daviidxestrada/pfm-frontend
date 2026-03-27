import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import HomePage from "../pages/public/HomePage";
import ApartmentsPage from "../pages/public/ApartmentsPage";
import ApartmentDetailPage from "../pages/public/ApartmentDetailPage";
import NotFoundPage from "../pages/public/NotFoundPage";
import ReservationPage from "../pages/public/ReservationPage";

function AppRouter() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="apartments" element={<ApartmentsPage />} />
                <Route path="apartments/:id" element={<ApartmentDetailPage />} />
                <Route path="reserve" element={<ReservationPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;