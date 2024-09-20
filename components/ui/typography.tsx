import React from 'react';

interface TextProps {
  children: React.ReactNode;
  className?: string;
}

export const Heading = ({ children, className = '' }: TextProps) => (
  <h2 className={`text-[13px] font-normal ${className}`}>{children}</h2>
);

export const Subheading = ({ children, className = '' }: TextProps) => (
  <h3 className={`text-[12px] font-medium ${className}`}>{children}</h3>
);

export const BodyText = ({ children, className = '' }: TextProps) => (
  <p className={`text-[12px] font-normal ${className}`}>{children}</p>
);

export const SmallText = ({ children, className = '' }: TextProps) => (
  <span className={`text-sm font-normal ${className}`}>{children}</span>
);

export const OtherText = "text-sm font-medium";

// Rename chatTextClass to chatText
export const chatText = "text-[13px] font-light";