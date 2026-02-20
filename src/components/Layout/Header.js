import { Search, Bell, Upload, ChevronDown } from 'lucide-react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-search">
        <Search size={18} strokeWidth={2} />
        <input type="text" placeholder="Search..." className="header-search-input" />
        <span className="header-search-kbd">K</span>
      </div>

      <div className="header-actions">
        <button className="header-icon-btn" aria-label="Notifications">
          <Bell size={20} strokeWidth={2} />
        </button>
        <button className="header-icon-btn" aria-label="Upload">
          <Upload size={20} strokeWidth={2} />
        </button>
        <button className="header-icon-btn" aria-label="User menu">
          <div className="header-avatar">EN</div>
        </button>
        <div className="header-user">
          <span className="header-user-name">Estiaq Noor</span>
          <ChevronDown size={16} strokeWidth={2} />
        </div>
      </div>
    </header>
  );
}

export default Header;
