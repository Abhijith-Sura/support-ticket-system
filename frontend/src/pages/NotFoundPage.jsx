import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { NotFoundIllustration } from '../components/Common/BrandSymbols';

const NotFoundPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const homePath = !isAuthenticated ? '/login' : isAdmin ? '/admin' : '/dashboard';

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full text-center space-y-5">
        <div className="flex justify-center">
          <NotFoundIllustration className="h-24 w-24" />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">404 Error</p>
          <h1 className="text-3xl font-bold text-slate-900">Page not found</h1>
          <p className="text-sm text-slate-500">
            The page you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
          </p>
        </div>
        <Link
          to={homePath}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
