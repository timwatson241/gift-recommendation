// app/components/ui/Card.tsx
import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
};

export function Card({ children, className = "", hover = false }: CardProps) {
  const hoverStyles = hover ? "transition-shadow hover:shadow-md" : "";

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  );
}

type CardHeaderProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

type CardTitleProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardTitle({ children, className = "" }: CardTitleProps) {
  return (
    <h3 className={`text-xl font-bold text-gray-800 ${className}`}>
      {children}
    </h3>
  );
}

type CardContentProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

type CardFooterProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardFooter({ children, className = "" }: CardFooterProps) {
  return (
    <div
      className={`px-6 py-4 border-t border-gray-100 bg-gray-50 ${className}`}
    >
      {children}
    </div>
  );
}

type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  className?: string;
};

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const variantStyles = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-orange-100 text-orange-800",
    danger: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`text-sm px-3 py-1 rounded-full font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
