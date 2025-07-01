import { ExperimentStatus } from "../../generated/prisma/index-browser";

// Status badge styling with proper hover states
export const getStatusBadgeStyles = (status: ExperimentStatus): string => {
  const baseStyles = "flex items-center gap-1";
  
  switch (status) {
    case "completed":
      return `${baseStyles} bg-green-100 text-green-800 border-green-200 hover:bg-green-200 hover:text-green-900`;
    case "analyzing":
      return `${baseStyles} bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 hover:text-blue-900`;
    case "failed":
      return `${baseStyles} bg-red-100 text-red-800 border-red-200 hover:bg-red-200 hover:text-red-900`;
    case "submitted":
      return `${baseStyles} bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 hover:text-gray-900`;
    default:
      return `${baseStyles} bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 hover:text-gray-900`;
  }
};

// Status badge styling for string-based status (for demo/mock data)
export const getStatusBadgeStylesFromString = (status: string): string => {
  const baseStyles = "flex items-center gap-1";
  
  switch (status) {
    case "completed":
      return `${baseStyles} bg-green-100 text-green-800 border-green-200 hover:bg-green-200 hover:text-green-900`;
    case "analyzing":
      return `${baseStyles} bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 hover:text-blue-900`;
    case "failed":
      return `${baseStyles} bg-red-100 text-red-800 border-red-200 hover:bg-red-200 hover:text-red-900`;
    case "submitted":
      return `${baseStyles} bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 hover:text-gray-900`;
    default:
      return `${baseStyles} bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 hover:text-gray-900`;
  }
};

// Card styling for analyzing experiments
export const getExperimentCardStyles = (status: ExperimentStatus): string => {
  const baseStyles = "hover:shadow-md transition-shadow";
  
  if (status === 'analyzing') {
    return `${baseStyles} ring-2 ring-blue-200 bg-blue-50`;
  }
  
  return baseStyles;
};

// Color constants for consistent theming
export const EXPERIMENT_COLORS = {
  completed: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    hoverBg: 'hover:bg-green-200',
    hoverText: 'hover:text-green-900',
    icon: 'text-green-600'
  },
  analyzing: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    hoverBg: 'hover:bg-blue-200',
    hoverText: 'hover:text-blue-900',
    icon: 'text-blue-600'
  },
  failed: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    hoverBg: 'hover:bg-red-200',
    hoverText: 'hover:text-red-900',
    icon: 'text-red-600'
  },
  submitted: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
    hoverBg: 'hover:bg-gray-200',
    hoverText: 'hover:text-gray-900',
    icon: 'text-gray-600'
  }
} as const; 