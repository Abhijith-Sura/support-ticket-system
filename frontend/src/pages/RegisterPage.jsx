import BrandLogo from '../components/Common/BrandLogo';
import RegisterForm from '../components/Auth/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center">
          <BrandLogo size="lg" showText={false} />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          Create your account
        </h1>
        <p className="mt-1.5 text-sm text-slate-600">
          Join HelpDesk Pro to submit and track your support requests
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
