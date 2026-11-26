const config = require('../config/config');

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Build MongoDB filter, sort, and pagination options from query parameters
 */
const buildTicketQuery = (query, baseFilter = {}) => {
  const {
    page = config.pagination.defaultPage,
    limit = config.pagination.defaultLimit,
    status,
    priority,
    category,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = query;

  const pageNum = Math.max(1, parseInt(page, 10) || config.pagination.defaultPage);
  const limitNum = Math.min(
    Math.max(1, parseInt(limit, 10) || config.pagination.defaultLimit),
    config.pagination.maxLimit
  );

  const filter = { ...baseFilter };

  if (status && config.ticketStatus.includes(status)) {
    filter.status = status;
  }
  if (priority && config.ticketPriority.includes(priority)) {
    filter.priority = priority;
  }
  if (category && config.ticketCategory.includes(category)) {
    filter.category = category;
  }
  if (search && typeof search === 'string' && search.trim()) {
    const safePattern = escapeRegex(search.trim());
    filter.$or = [
      { title: { $regex: safePattern, $options: 'i' } },
      { description: { $regex: safePattern, $options: 'i' } }
    ];
  }

  const safeSortBy = config.sortableFields.includes(sortBy) ? sortBy : 'createdAt';
  const safeOrder = sortOrder === 'asc' ? 1 : -1;
  const sort = { [safeSortBy]: safeOrder };

  return { filter, sort, pageNum, limitNum };
};

module.exports = { buildTicketQuery, escapeRegex };
