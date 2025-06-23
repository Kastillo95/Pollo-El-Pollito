import { Home, Warehouse, ShoppingCart, Receipt, CheckSquare, ScanBarcode } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'inventory', label: 'Inventario', icon: Warehouse },
  { id: 'purchases', label: 'Compras', icon: ShoppingCart },
  { id: 'expenses', label: 'Gastos', icon: Receipt },
  { id: 'activities', label: 'Actividades', icon: CheckSquare },
  { id: 'sales', label: 'Ventas', icon: ScanBarcode },
];

export default function Navigation({ currentTab, onTabChange }: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "nav-tab px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                  currentTab === tab.id
                    ? "border-[var(--pollo-orange)] text-[var(--pollo-orange)] active"
                    : "border-transparent text-gray-600 hover:text-[var(--pollo-orange)]"
                )}
              >
                <Icon className="w-4 h-4 mr-2 inline" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
