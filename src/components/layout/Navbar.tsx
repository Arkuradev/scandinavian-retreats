import { NavLink } from 'react-router-dom';
import { User, Birdhouse } from "lucide-react";

const linkBase = "px-3 py-2 rounded-md text-sm font-medium";
const linkClass = ({ isActive }: { isActive: boolean }) =>
    `${linkBase} ${isActive ? 'bg-primary text-white scale-105 transition-all duration-150' : 'text-white hover:bg-scandi-gradient-hover hover:scale-105 hover:transition-all hover:duration-150'}`;

export default function Navbar() {
    return (
        <nav className="bg-scandi-gradient shadow-lg">
            <div className="mx-auto max-w-6xl px-4 h-20 flex items-center justify-between">
                <NavLink to="/" className="flex items-center text-lg font-bold text-white tracking-wide">
          <Birdhouse className="w-7 h-7" /> Scandinavian Retreats
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
          <NavLink to="/account" className={linkClass}>
            <User className="w-5 h-5" />
          </NavLink>
                </div>
            </div>
        </nav>
    )
}