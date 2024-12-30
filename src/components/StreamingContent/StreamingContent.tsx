import React from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './StreamingContent.module.css';

interface StreamingContentProps {
  content: string;
}

export const StreamingContent: React.FC<StreamingContentProps> = ({ content }) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h1 className={styles.heading1}>{children}</h1>,
            h2: ({ children }) => <h2 className={styles.heading2}>{children}</h2>,
            h3: ({ children }) => <h3 className={styles.heading3}>{children}</h3>,
            ul: ({ children }) => <ul className={styles.list}>{children}</ul>,
            ol: ({ children }) => <ol className={styles.list}>{children}</ol>,
            li: ({ children }) => <li className={styles.listItem}>{children}</li>,
            code: ({ children }) => <code className={styles.code}>{children}</code>,
            blockquote: ({ children }) => <blockquote className={styles.blockquote}>{children}</blockquote>,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
      {content.length > 0 && <span className={styles.cursor} />}
    </div>
  );
}; 