import { STATUS_COLORS } from '../../utils/constants';
import { StatusSymbol } from '../Common/BrandSymbols';

const StatusBadge = ({ status }) => {
  const colorClass = STATUS_COLORS[status] || STATUS_COLORS.Open;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
      <StatusSymbol status={status} className="h-3.5 w-3.5 shrink-0" />
      {status}
    </span>
  );
};

export default StatusBadge;
