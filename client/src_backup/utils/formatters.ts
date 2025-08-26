// Format currency
export const formatCurrency = (amount: number | undefined, compact = false): string => {
  if (amount === undefined || amount === null) return '-';
  
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };
  
  if (compact && Math.abs(amount) >= 1000) {
    options.notation = 'compact';
  }
  
  return new Intl.NumberFormat('en-US', options).format(amount);
};

// Format percentage
export const formatPercentage = (percentage: number | undefined): string => {
  if (percentage === undefined || percentage === null) return '-';
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'exceptZero'
  }).format(percentage / 100);
};

// Format number
export const formatNumber = (number: number | undefined, compact = false): string => {
  if (number === undefined || number === null) return '-';
  
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  };
  
  if (compact && Math.abs(number) >= 1000) {
    options.notation = 'compact';
  }
  
  return new Intl.NumberFormat('en-US', options).format(number);
};

// Format date
export const formatDate = (date: string | undefined, includeTime = false): string => {
  if (!date) return '-';
  
  const dateObj = new Date(date);
  
  if (includeTime) {
    return dateObj.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format time ago
export const formatTimeAgo = (date: string | undefined): string => {
  if (!date) return '-';
  
  const dateObj = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};