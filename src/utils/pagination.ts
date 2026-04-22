export const getPagination = ({ page = 1, limit = 10 }: { page?: unknown; limit?: unknown }) => {
  const currentPage = Math.max(Number(page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(limit) || 10, 1), 100);

  return {
    page: currentPage,
    limit: pageSize,
    skip: (currentPage - 1) * pageSize,
  };
};
