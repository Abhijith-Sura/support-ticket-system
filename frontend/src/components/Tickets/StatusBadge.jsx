import { STATUS_COLORS } from '../../utils/constants';

const StatusBadge = ({ status }) => {
  const colorClass = STATUS_COLORS[status] || STATUS_COLORS.Open;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === 'Resolved'
            ? 'bg-emerald-500'
            : status === 'In Progress'
            ? 'bg-amber-500'
            : status === 'Closed'
            ? 'bg-slate-400'
            : 'bg-blue-500'
        }`}
      />
      {status}
    </span>
  );
};

export default StatusBadge;
