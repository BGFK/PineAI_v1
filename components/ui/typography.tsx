import React from 'react';

interface TextProps {
  children: React.ReactNode;
  className?: string;
}

export const Heading = ({ children, className = '' }: TextProps) => (
  <h2 className={`text-lg font-medium ${className}`}>{children}</h2>
);

export const Subheading = ({ children, className = '' }: TextProps) => (
  <h3 className={`text-sm font-medium ${className}`}>{children}</h3>
);

export const BodyText = ({ children, className = '' }: TextProps) => (
  <p className={`text-sm font-normal ${className}`}>{children}</p>
);

export const SmallText = ({ children, className = '' }: TextProps) => (
  <span className={`text-sm font-normal ${className}`}>{children}</span>
);

export const OtherText = "text-sm font-medium"; // Change to a string instead of a component