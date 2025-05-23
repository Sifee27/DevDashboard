'use client';

import { GitPullRequest, GitMerge, XCircle } from 'lucide-react';

interface PRStatusIconProps {
  status: 'open' | 'merged' | 'draft' | 'closed';
  className?: string;
  size?: number;
}

export function PRStatusIcon({ status, className, size = 16 }: PRStatusIconProps) {
  switch (status) {
    case 'open':
      return <GitPullRequest className={className} size={size} />;
    case 'merged':
      return <GitMerge className={className} size={size} />;
    case 'closed':
      return <XCircle className={className} size={size} />;
    case 'draft':
      return (
        <span className={className} style={{ fontSize: `${size}px`, lineHeight: 1 }}>
          ⊖
        </span>
      );
    default:
      return null;
  }
}
