import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import {
  AdminShieldSymbol,
  DashboardGridSymbol,
  NewTicketSymbol,
  TicketSymbol,
} from '../Common/BrandSymbols';

const Sidebar = ({ isOpen, onClose }) => {
  const { isAdmin } = useAuth();

  const userNav = [
    { to: '/dashboard', label: 'Dashboard', icon: DashboardGridSymbol, end: true },
    { to: '/tickets', label: 'My Tickets', icon: TicketSymbol, end: false },
    { to: '/tickets/new', label: 'New Ticket', icon: NewTicketSymbol, end: true },
  ];

  const adminNav = [
    { to: '/admin', label: 'Admin Dashboard', icon: AdminShieldSymbol, end: true },
    { to: '/admin/tickets', label: 'All Tickets', icon: TicketSymbol, end: false },
  ];

  const renderLink = (item) => {
    const Icon = item.icon;
    return (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.end}
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
            isActive
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`
        }
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span>{item.label}</span>
      </NavLink>
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 lg:hidden">
          <span className="font-bold text-slate-900">Navigation</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
          {isAdmin ? (
            <div>
              <p className="px-3.5 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Administration
              </p>
              <nav className="space-y-1">{adminNav.map(renderLink)}</nav>
            </div>
          ) : (
            <div>
              <p className="px-3.5 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Support Portal
              </p>
              <nav className="space-y-1">{userNav.map(renderLink)}</nav>
            </div>
          )}

          {isAdmin && (
            <div>
              <p className="px-3.5 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Personal Portal
              </p>
              <nav className="space-y-1">{userNav.map(renderLink)}</nav>
            </div>
          )}
        </div>

        <div className="p-4 m-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <p className="text-xs font-semibold text-slate-700">Need quick help?</p>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Submit a support ticket with priority and category for fast triage.
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
