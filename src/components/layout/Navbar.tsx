import { NavLink } from 'react-router-dom';

const linkBase = "px-3 py-2 rounded-md text-sm font-medium";
const linkClass = ({ isActive }: { isActive: boolean }) =>
    `${linkBase} ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-200'}`;

export default function Navbar() {
    return (
        <nav className="bg-scandi-gradient shadow-lg">
            <div className="mx-auto max-w-6xl px-4 h-20 flex items-center justify-between">
                <NavLink to="/" className="text-lg font-bold text-white tracking-wide">
          Scandinavian Retreats
        </NavLink>
        <div className="flex items-center gap-2">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/venues" className={linkClass}>
            Venues
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
                </div>
            </div>
        </nav>
    )
}