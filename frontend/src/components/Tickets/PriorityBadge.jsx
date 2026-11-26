import { PRIORITY_COLORS } from '../../utils/constants';

const PriorityBadge = ({ priority }) => {
  const colorClass = PRIORITY_COLORS[priority] || PRIORITY_COLORS.Medium;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
      {priority}
    </span>
  );
};

export default PriorityBadge;
