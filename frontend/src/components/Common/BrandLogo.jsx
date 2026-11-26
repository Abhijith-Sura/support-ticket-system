import { useId } from 'react';

const SIZES = {
  sm: { box: 'h-9 w-9', text: 'text-base', subtext: 'text-[10px]' },
  md: { box: 'h-11 w-11', text: 'text-xl', subtext: 'text-[11px]' },
  lg: { box: 'h-14 w-14', text: 'text-2xl', subtext: 'text-xs' },
};

const BrandLogo = ({ size = 'sm', showText = true, stacked = false, showTagline = false }) => {
  const uid = useId().replace(/:/g, '');
  const gradId = `hpBrandGrad-${uid}`;
  const sparkId = `hpBrandSpark-${uid}`;
  const spec = SIZES[size] || SIZES.sm;

  return (
    <div className={`inline-flex items-center ${stacked ? 'flex-col text-center gap-2.5' : 'gap-2.5'}`}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${spec.box} shrink-0 drop-shadow-sm`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="55%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
          <linearGradient id={sparkId} x1="38" y1="12" x2="52" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="56" height="56" rx="16" fill={`url(#${gradId})`} />
        <path
          d="M17 22C17 19.7909 18.7909 18 21 18H43C45.2091 18 47 19.7909 47 22V27.5C44.5147 27.5 42.5 29.5147 42.5 32C42.5 34.4853 44.5147 36.5 47 36.5V42C47 44.2091 45.2091 46 43 46H21C18.7909 46 17 44.2091 17 42V36.5C19.4853 36.5 21.5 34.4853 21.5 32C21.5 29.5147 19.4853 27.5 17 27.5V22Z"
          fill="#FFFFFF"
          fillOpacity="0.96"
        />
        <path
          d="M27.5 32.5L30.8 35.8L37.5 28.5"
          stroke="#4F46E5"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M46 13L47.6 16.4L51 18L47.6 19.6L46 23L44.4 19.6L41 18L44.4 16.4L46 13Z"
          fill={`url(#${sparkId})`}
        />
      </svg>

      {showText && (
        <div className={stacked ? 'text-center' : 'hidden sm:block text-left'}>
          <div className={`font-extrabold tracking-tight leading-none ${spec.text}`}>
            <span className="text-slate-900">HelpDesk</span>
            <span className="ml-1 text-indigo-600">Pro</span>
          </div>
          {showTagline && (
            <p className={`mt-1 font-medium text-slate-500 ${spec.subtext}`}>
              Support Triage &amp; Resolution
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
