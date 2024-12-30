import React, { useEffect, useRef } from 'react';
import styles from './StreamingContent.module.css';

interface StreamingContentProps {
  content: string;
}

export const StreamingContent: React.FC<StreamingContentProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [content]);

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.content}>
        {content}
        <span className={styles.cursor}></span>
      </div>
    </div>
  );
}; 