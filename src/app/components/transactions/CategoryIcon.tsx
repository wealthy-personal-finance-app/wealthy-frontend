import React from 'react';
import { 
  Home, 
  ShoppingCart, 
  Bus, 
  Landmark, 
  LayoutGrid, 
  Coffee, 
  Zap, 
  CreditCard, 
  Shield, 
  Film, 
  ShoppingBag, 
  Plane, 
  Heart, 
  Book, 
  Gift, 
  AlertTriangle, 
  MoreHorizontal,
  Wallet,
  Award,
  Briefcase,
  TrendingUp,
  BarChart2,
  RefreshCcw,
  DollarSign,
  Key,
  FileText,
  Calendar,
  Star
} from 'lucide-react';

interface CategoryIconProps {
  icon: string;
  size?: number;
  className?: string;
  color?: string;
}

export function CategoryIcon({ icon, size = 20, className = '', color = '#99A0AE' }: CategoryIconProps) {
  const props = { size, className, color, strokeWidth: 1.5 };

  switch (icon.toLowerCase()) {
    // Expense Icons (Requested by User)
    case 'house':
    case 'home':           return <Home {...props} />;
    case 'shopping-cart':
    case 'shopping':       return <ShoppingCart {...props} />;
    case 'bus':
    case 'transport':      return <Bus {...props} />;
    case 'taxes':
    case 'landmark':       return <Landmark {...props} />;
    case 'all':
    case 'grid':           return <LayoutGrid {...props} />;

    // Other standard defaults
    case 'coffee':         return <Coffee {...props} />;
    case 'zap':            return <Zap {...props} />;
    case 'credit-card':    return <CreditCard {...props} />;
    case 'shield':         return <Shield {...props} />;
    case 'film':           return <Film {...props} />;
    case 'shopping-bag':   return <ShoppingBag {...props} />;
    case 'plane':          return <Plane {...props} />;
    case 'heart':          return <Heart {...props} />;
    case 'book':           return <Book {...props} />;
    case 'gift':           return <Gift {...props} />;
    case 'alert-triangle': return <AlertTriangle {...props} />;
    case 'more-horizontal':return <MoreHorizontal {...props} />;
    case 'wallet':         return <Wallet {...props} />;
    case 'award':          return <Award {...props} />;
    case 'briefcase':      return <Briefcase {...props} />;
    case 'trending-up':    return <TrendingUp {...props} />;
    case 'bar-chart-2':    return <BarChart2 {...props} />;
    case 'refresh-ccw':    return <RefreshCcw {...props} />;
    case 'dollar-sign':    return <DollarSign {...props} />;
    case 'key':            return <Key {...props} />;
    case 'file-text':      return <FileText {...props} />;
    case 'calendar':       return <Calendar {...props} />;
    case 'star':           return <Star {...props} />;
    
    default:               return <LayoutGrid {...props} />;
  }
}
