import { useContext } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

import { AuthContext } from "../context";

function MainLayout() {
  const { user, authReady } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="site-brand">
            <span className="site-brand-mark">PFM</span>
            <span>
              <strong>Direct Booking</strong>
              <small>Apartamentos turisticos</small>
            </span>
          </Link>

          <nav className="site-nav">
            <NavLink to="/" end className="site-nav-link">
              Inicio
            </NavLink>
            <NavLink to="/apartments" className="site-nav-link">
              Apartamentos
            </NavLink>
          </nav>

          <div className="site-actions">
            {!authReady ? (
              <span className="site-status-pill">Comprobando sesion</span>
            ) : user ? (
              <Link to={isAdmin ? "/admin" : "/account"} className="site-cta site-cta-primary">
                {isAdmin ? "Ir al panel admin" : "Mi panel"}
              </Link>
            ) : (
              <>
              <Link to="/register" className="site-cta site-cta-secondary">
                Crear cuenta
              </Link>
              <Link to="/login" className="site-cta site-cta-primary">
                Login
              </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <p>PFM Apartments · Reservas directas para apartamentos turisticos</p>
          <p>Proyecto Full Stack con React, Express y MongoDB</p>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
