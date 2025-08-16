import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "destructive" | "outline";
  size?: "default" | "sm" | "lg";
}

function Badge({ className, variant = "default", size = "default", ...props }: BadgeProps) {
  const badgeClasses = [
    "badge",
    `badge-${variant}`,
    `badge-${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={badgeClasses} {...props} />
  )
}

export { Badge } 