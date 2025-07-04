import React from "react";

const Spinner: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div
    className={`animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 ${className}`}
  ></div>
);

export default Spinner;
