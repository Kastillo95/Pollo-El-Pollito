import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import logoPath from "@assets/1000040291_1750690924846.png";

interface HeaderProps {
  notificationCount: number;
}

export default function Header({ notificationCount }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b-2 border-[var(--pollo-orange)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img 
              src={logoPath} 
              alt="Pollo Fresco El Pollito" 
              className="w-10 h-10 mr-3 logo-circular"
            />
            <div>
              <h1 className="text-xl font-bold text-[var(--pollo-brown)]">
                Pollo Fresco El Pollito
              </h1>
              <p className="text-sm text-gray-600">Sistema de Gestión</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 text-gray-600 hover:text-[var(--pollo-orange)] transition-colors">
                <Bell className="w-6 h-6" />
                {notificationCount > 0 && (
                  <Badge 
                    className="notification-badge absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center p-0"
                  >
                    {notificationCount}
                  </Badge>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
