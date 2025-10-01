import React from 'react';

const FarmGuardLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="FarmGuard Logo"
  >
    <path
      d="M12 2L4 5v6c0 4.4 3.6 8 8 8s8-3.6 8-8V5l-8-3z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#2e5c3b"
    />
    <path
      d="M12 22c-2.9-1.3-5-4-5-7.5V9"
      stroke="#8bc34a"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
     <path
      d="M14.5 9.5c-1.5 2-2.5 4.5-2.5 6.5"
      stroke="#ffffff"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default FarmGuardLogo;
