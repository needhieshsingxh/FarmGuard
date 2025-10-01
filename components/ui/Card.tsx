import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-700/50 p-4 sm:p-5 md:p-6 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
