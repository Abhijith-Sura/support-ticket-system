import { useState } from 'react';
import { TICKET_CATEGORIES, TICKET_PRIORITIES } from '../../utils/constants';

const TicketForm = ({
  initialValues = { title: '', description: '', category: 'General', priority: 'Medium' },
  onSubmit,
  onCancel,
  submitLabel = 'Submit Ticket',
  submitting = false,
}) => {
  const [formData, setFormData] = useState({
    title: initialValues.title || '',
    description: initialValues.description || '',
    category: initialValues.category || 'General',
    priority: initialValues.priority || 'Medium',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    const title = formData.title.trim();
    const description = formData.description.trim();

    if (!title || title.length < 5) {
      nextErrors.title = 'Title must be at least 5 characters';
    } else if (title.length > 200) {
      nextErrors.title = 'Title cannot exceed 200 characters';
    }

    if (!description || description.length < 10) {
      nextErrors.description = 'Description must be at least 10 characters';
    } else if (description.length > 5000) {
      nextErrors.description = 'Description cannot exceed 5000 characters';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      priority: formData.priority,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="ticket-title" className="block text-sm font-medium text-slate-700 mb-1.5">
          Ticket Title <span className="text-rose-500">*</span>
        </label>
        <input
          id="ticket-title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Brief summary of the issue or request"
          className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
            errors.title
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
          }`}
        />
        {errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ticket-category" className="block text-sm font-medium text-slate-700 mb-1.5">
            Category
          </label>
          <select
            id="ticket-category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {TICKET_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="ticket-priority" className="block text-sm font-medium text-slate-700 mb-1.5">
            Priority
          </label>
          <select
            id="ticket-priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {TICKET_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="ticket-description" className="block text-sm font-medium text-slate-700 mb-1.5">
          Description <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="ticket-description"
          rows={6}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe steps to reproduce, expected behavior, and any helpful context..."
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
            errors.description
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-rose-600">{errors.description}</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60 transition-colors"
        >
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default TicketForm;
