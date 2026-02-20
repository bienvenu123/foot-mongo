import { NavLink } from 'react-router-dom';
import { Globe, Trophy } from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { to: '/countries', icon: Globe, label: 'Countries' },
  { to: '/teams', icon: Trophy, label: 'Teams' },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">S</div>
        <span className="logo-text">Shodai</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <item.icon size={20} strokeWidth={2} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
