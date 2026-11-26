import { LifeBuoy } from 'lucide-react';
import LoginForm from '../components/Auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md">
          <LifeBuoy className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          Sign in to HelpDesk Pro
        </h1>
        <p className="mt-1.5 text-sm text-slate-600">
          Raise support tickets, track resolutions, and stay updated
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
