import { 
  LayoutDashboard, 
  History, 
  Heart, 
  Activity, 
  User, 
  Settings 
} from 'lucide-react';

const iconMap = {
  dashboard: LayoutDashboard,
  history: History,
  health_and_safety: Heart,
  accessibility_new: Activity,
  account_circle: User,
  settings: Settings,
};

export const Icon = ({ name, className = "", size = 20 }) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    return null;
  }
  
  return <IconComponent size={size} className={className} />;
};
