import { PRIORITY_COLORS } from '../../utils/constants';
import { PrioritySymbol } from '../Common/BrandSymbols';

const PriorityBadge = ({ priority }) => {
  const colorClass = PRIORITY_COLORS[priority] || PRIORITY_COLORS.Medium;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
      <PrioritySymbol priority={priority} className="h-3 w-3 shrink-0" />
      {priority}
    </span>
  );
};

export default PriorityBadge;
