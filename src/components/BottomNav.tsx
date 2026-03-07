import { Calculator, Wrench, ArrowLeftRight, Ruler, Clock, Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const tabs = [
  { path: "/", icon: Calculator, label: "Calc" },
  { path: "/quick-tools", icon: Wrench, label: "Tools" },
  { path: "/currency", icon: ArrowLeftRight, label: "Currency" },
  { path: "/units", icon: Ruler, label: "Units" },
  { path: "/history", icon: Clock, label: "History" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-nav-bg border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center justify-center gap-0.5 w-14 h-14 btn-bounce"
            >
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-1 w-8 h-1 rounded-full bg-nav-active"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <tab.icon
                className={`w-5 h-5 transition-colors ${active ? "text-nav-active" : "text-nav-inactive"}`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${active ? "text-nav-active" : "text-nav-inactive"}`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
