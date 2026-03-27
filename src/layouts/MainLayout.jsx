import { Link, Outlet } from "react-router-dom";

function MainLayout() {
    return(
        <div>
            <header>
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/apartments">Apartamentos</Link>
                </nav>
            </header>

            <main>
                <Outlet />
            </main>

            <footer>
                <p> © 2026 - PFM Apartments </p>
            </footer>

        </div>
    );
}

export default MainLayout;