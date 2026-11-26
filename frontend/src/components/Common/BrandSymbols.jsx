import { useId } from 'react';

/**
 * Custom perforated support ticket symbol
 */
export const TicketSymbol = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M4 7C4 5.89543 4.89543 5 6 5H18C19.1046 5 20 5.89543 20 7V9.5C18.6193 9.5 17.5 10.6193 17.5 12C17.5 13.3807 18.6193 14.5 20 14.5V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V14.5C5.38071 14.5 6.5 13.3807 6.5 12C6.5 10.6193 5.38071 9.5 4 9.5V7Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M9.5 9V10M9.5 12V12.01M9.5 14V15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M12.5 10.5H15.5M12.5 13.5H14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/**
 * Custom hexagon triage shield symbol for Admins
 */
export const AdminShieldSymbol = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M12 2.75L19.5 5.85V11.6C19.5 16.35 16.3 20.15 12 21.45C7.7 20.15 4.5 16.35 4.5 11.6V5.85L12 2.75Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M9.2 12.1L11.1 14L15 9.9"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Custom dashboard grid symbol
 */
export const DashboardGridSymbol = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect x="3.5" y="3.5" width="7" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <rect x="13.5" y="3.5" width="7" height="5.5" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <rect x="13.5" y="12" width="7" height="8.5" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <rect x="3.5" y="14.5" width="7" height="6" rx="2" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

/**
 * Custom create-ticket plus badge symbol
 */
export const NewTicketSymbol = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 8.25V15.75M8.25 12H15.75" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
  </svg>
);

/**
 * Custom notification bell with acoustic wave arcs
 */
export const BellAlertSymbol = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M6.5 10.5C6.5 7.46243 8.96243 5 12 5C15.0376 5 17.5 7.46243 17.5 10.5V14.2L19.2 16.5C19.53 16.95 19.21 17.6 18.65 17.6H5.35C4.79 17.6 4.47 16.95 4.8 16.5L6.5 14.2V10.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M9.8 18.2C10.18 19.35 11.02 20 12 20C12.98 20 13.82 19.35 14.2 18.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M19.2 6.8C20.2 7.8 20.8 9.1 20.9 10.5M4.8 6.8C3.8 7.8 3.2 9.1 3.1 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

/**
 * Custom Event-Driven pulse symbol
 */
export const EventPulseSymbol = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M3.5 12H7L9.5 6.5L13.5 17.5L16.2 12H20.5"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="20.5" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

/**
 * Custom Ticket Status indicator symbol
 */
export const StatusSymbol = ({ status, className = 'h-3.5 w-3.5' }) => {
  if (status === 'Resolved') {
    return (
      <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
        <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5.4 8.2L7.2 10L10.8 6.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === 'In Progress') {
    return (
      <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
        <path d="M8 2.25A5.75 5.75 0 1 1 2.25 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="8" cy="8" r="2" fill="currentColor" />
      </svg>
    );
  }
  if (status === 'Closed') {
    return (
      <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
        <rect x="3" y="3" width="10" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5.75 8H10.25" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="2.25" fill="currentColor" />
    </svg>
  );
};

/**
 * Custom Priority signal bars / urgency diamond symbol
 */
export const PrioritySymbol = ({ priority, className = 'h-3.5 w-3.5' }) => {
  if (priority === 'Urgent') {
    return (
      <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
        <path d="M8 1.75L14.25 8L8 14.25L1.75 8L8 1.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 5V8.5M8 10.75V10.85" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  const level = priority === 'High' ? 3 : priority === 'Medium' ? 2 : 1;
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <rect x="2.5" y="9.5" width="2.4" height="4" rx="0.8" fill="currentColor" />
      <rect
        x="6.8"
        y="6.5"
        width="2.4"
        height="7"
        rx="0.8"
        fill="currentColor"
        fillOpacity={level >= 2 ? 1 : 0.25}
      />
      <rect
        x="11.1"
        y="3.5"
        width="2.4"
        height="10"
        rx="0.8"
        fill="currentColor"
        fillOpacity={level >= 3 ? 1 : 0.25}
      />
    </svg>
  );
};

/**
 * Custom Category domain symbol (Bug / Feature / Account / General)
 */
export const CategorySymbol = ({ category, className = 'h-3.5 w-3.5' }) => {
  if (category === 'Bug') {
    return (
      <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
        <rect x="5" y="5" width="6" height="7.5" rx="3" stroke="currentColor" strokeWidth="1.4" />
        <path d="M6.2 4.8L5 3M9.8 4.8L11 3M2.5 8H5M11 8H13.5M3 11.5L5.2 10.5M13 11.5L10.8 10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    );
  }
  if (category === 'Feature') {
    return (
      <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
        <path d="M8 2L9.5 6.2L14 7.7L9.5 9.2L8 13.5L6.5 9.2L2 7.7L6.5 6.2L8 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    );
  }
  if (category === 'Account') {
    return (
      <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
        <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M3.5 13C3.5 10.8 5.5 9.5 8 9.5C10.5 9.5 12.5 10.8 12.5 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="10" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5.5 6.2H10.5M5.5 9.2H8.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
};

/**
 * Custom Empty State Ticket Illustration
 */
export const EmptyTicketsIllustration = ({ className = 'h-20 w-20' }) => {
  const uid = useId().replace(/:/g, '');
  const gradId = `emptyGrad-${uid}`;

  return (
    <svg viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="16" y1="16" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EEF2FF" />
          <stop offset="100%" stopColor="#E0E7FF" />
        </linearGradient>
      </defs>
      <circle cx="48" cy="48" r="40" fill={`url(#${gradId})`} />
      <path
        d="M25 36C25 33.2386 27.2386 31 30 31H66C68.7614 31 71 33.2386 71 36V43C67.6863 43 65 45.6863 65 49C65 52.3137 67.6863 55 71 55V62C71 64.7614 68.7614 67 66 67H30C27.2386 67 25 64.7614 25 62V55C28.3137 55 31 52.3137 31 49C31 45.6863 28.3137 43 25 43V36Z"
        fill="#FFFFFF"
        stroke="#4F46E5"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M39 44H57M39 51H51" stroke="#818CF8" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M72 20L73.6 23.4L77 25L73.6 26.6L72 30L70.4 26.6L67 25L70.4 23.4L72 20Z" fill="#4F46E5" />
      <circle cx="22" cy="28" r="2.5" fill="#A5B4FC" />
    </svg>
  );
};

/**
 * Custom 404 Disconnected Ticket Illustration
 */
export const NotFoundIllustration = ({ className = 'h-24 w-24' }) => (
  <svg viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
    <circle cx="48" cy="48" r="40" fill="#EEF2FF" />
    <path
      d="M24 38C24 35.7909 25.7909 34 28 34H44L47 41L43 48L48 55L44 62H28C25.7909 62 24 60.2091 24 58V52.5C26.4853 52.5 28.5 50.4853 28.5 48C28.5 45.5147 26.4853 43.5 24 43.5V38Z"
      fill="#FFFFFF"
      stroke="#4F46E5"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    <path
      d="M52 34H68C70.2091 34 72 35.7909 72 38V43.5C69.5147 43.5 67.5 45.5147 67.5 48C67.5 50.4853 69.5147 52.5 72 52.5V58C72 60.2091 70.2091 62 68 62H51L55 55L50 48L54 41L52 34Z"
      fill="#FFFFFF"
      stroke="#7C3AED"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    <circle cx="36" cy="48" r="2" fill="#4F46E5" />
    <circle cx="61" cy="48" r="2" fill="#7C3AED" />
  </svg>
);
