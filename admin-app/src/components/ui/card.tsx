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
        "card",
        hoverable && "card-hoverable",
        className
      )}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <div className={clsx("card-header", headerClassName)}>
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className={clsx("card-body", bodyClassName)}>
        {children}
      </div>
      {footer && (
        <div className={clsx("card-footer", footerClassName)}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card; 