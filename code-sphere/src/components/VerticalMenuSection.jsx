import { Menu, SlidersVertical, GripVertical } from 'lucide-react'; // Lucide icons[1][8][9]
import { useNavigate } from "react-router-dom";
import { Users, Hash, Bell, Compass } from "lucide-react";
import './MainMessageComponents.css';

const VerticalMenuSection = ({ items, onSelect, selectedId }) => {
    const menuItems = [
        { id: "general", label: "General", icon: <Hash size={22} /> },
        { id: "team", label: "Team", icon: <Users size={22} /> },
        { id: "explore", label: "Explore", icon: <Compass size={22} /> },
        { id: "alerts", label: "Alerts", icon: <Bell size={22} /> },
    ]; 

    const navigate = useNavigate();
    const handleNavigation = (item) => {
        navigate("/ExplorePage"); // Replace with your route
    };

    return(
  <nav className="vertical-menu-section">
    <div className="menu-icon">
      <Menu size={28} />
    </div>
    <div className="menu-items">
      {menuItems.map(item => (
        <button
          key={item.id}
          onClick={() => {onSelect(item.id); handleNavigation(item.lable);}}
          className={`menu-btn${selectedId === item.id ? ' selected' : ''}`}
        >
          {item.icon}
          <span className="menu-label">{item.label}</span>
        </button>
      ))}
    </div>
    <div className="menu-bottom">
      <SlidersVertical size={22} />
      <GripVertical size={22} />
    </div>
  </nav>
);
}

export default VerticalMenuSection;
