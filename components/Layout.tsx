
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Activity, Brain, Wrench, Settings, 
  Menu, X, Cpu, Circle 
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Simulation', path: '/simulation', icon: Activity },
    { name: 'Predictions', path: '/predictions', icon: Brain },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench },
    { name: 'Configuration', path: '/config', icon: Settings },
  ];

  const getTitle = () => {
    const item = navItems.find(i => i.path === location.pathname);
    return item ? item.name : 'Digital Twin';
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 shadow-xl">
        <div className="p-6 flex items-center gap-3">
          <div className="p-2 bg-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20">
            <Cpu className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">TwinFlow AI</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 font-medium' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <item.icon size={20} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center gap-3 text-sm font-medium text-emerald-400">
            <div className="relative">
               <Circle size={10} fill="currentColor" className="animate-pulse" />
               <div className="absolute inset-0 bg-emerald-400 animate-ping opacity-75 rounded-full" />
            </div>
            System Online
          </div>
          <p className="text-xs text-slate-500 mt-1">2-DOF Robotic Arm v2.4.0</p>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 w-64 bg-slate-900 z-50 transform transition-transform duration-300 md:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500 rounded-lg">
              <Cpu className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-white">TwinFlow AI</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400">
            <X size={24} />
          </button>
        </div>
        <nav className="px-4 py-2 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <item.icon size={20} />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <header className="h-16 flex items-center justify-between px-6 md:px-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-lg md:text-xl font-semibold text-white">{getTitle()}</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
             <Cpu size={20} />
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout;
