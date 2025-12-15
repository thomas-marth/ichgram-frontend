const formatTimeAgo = (dateInput) => {
  if (!dateInput) {
    return "";
  }

  const parsedDate = new Date(dateInput);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const now = new Date();
  const diffMs = now - parsedDate;
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffMin < 1) return "now";
  if (diffMin < 60) return `${diffMin} m`;
  if (diffHours < 24) return `${diffHours} h`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
  if (diffWeeks <= 4) return `${diffWeeks} wek`;
  if (diffYears < 1) if (diffWeeks <= 4) return `${diffWeeks} wek`;
  if (diffYears < 1) return `${diffMonths} month${diffMonths !== 1 ? "s" : ""}`;
  return `${diffYears} year${diffYears !== 1 ? "s" : ""}`;
};

export default formatTimeAgo;
