import React from 'react';
import clsx from 'clsx';

export interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footer?: React.ReactNode;
  footerClassName?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  className,
  headerClassName,
  bodyClassName,
  footer,
  footerClassName,
  onClick,
  hoverable = false,
}) => {
  return (
    <div 
      className={clsx(
        "bg-white dark:bg-dark-200 rounded-lg shadow-card overflow-hidden",
        hoverable && "transition-shadow hover:shadow-card-hover cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <div className={clsx("px-6 py-4 border-b border-gray-200 dark:border-gray-700", headerClassName)}>
          {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
      )}
      <div className={clsx("px-6 py-4", bodyClassName)}>
        {children}
      </div>
      {footer && (
        <div className={clsx("px-6 py-4 border-t border-gray-200 dark:border-gray-700", footerClassName)}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;