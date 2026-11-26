export const TICKET_STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'];

export const TICKET_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

export const TICKET_CATEGORIES = ['General', 'Bug', 'Feature', 'Account'];

export const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest First' },
  { value: 'createdAt:asc', label: 'Oldest First' },
  { value: 'updatedAt:desc', label: 'Recently Updated' },
  { value: 'priority:desc', label: 'Priority (Z-A)' },
  { value: 'title:asc', label: 'Title (A-Z)' },
];

export const STATUS_COLORS = {
  Open: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20',
  'In Progress': 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
  Resolved: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
  Closed: 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20',
};

export const PRIORITY_COLORS = {
  Low: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20',
  Medium: 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20',
  High: 'bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/20',
  Urgent: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20',
};

export const CATEGORY_COLORS = {
  General: 'bg-slate-100 text-slate-700',
  Bug: 'bg-red-50 text-red-700',
  Feature: 'bg-indigo-50 text-indigo-700',
  Account: 'bg-purple-50 text-purple-700',
};

export const ACTION_LABELS = {
  'ticket.created': 'Ticket Created',
  'ticket.updated': 'Ticket Updated',
  'status.changed': 'Status Changed',
  'comment.added': 'Comment Added',
  'ticket.resolved': 'Ticket Resolved',
  'ticket.deleted': 'Ticket Deleted',
};
