import { EmptyTicketsIllustration } from './BrandSymbols';

const EmptyState = ({
  icon: Icon,
  title = 'Nothing here yet',
  description = 'No records match your current criteria.',
  action,
}) => {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
      {Icon ? (
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <Icon className="h-7 w-7" />
        </div>
      ) : (
        <div className="mx-auto flex justify-center">
          <EmptyTicketsIllustration className="h-20 w-20" />
        </div>
      )}
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-500 max-w-sm mx-auto">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
