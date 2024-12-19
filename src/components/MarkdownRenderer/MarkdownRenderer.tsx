import React from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './MarkdownRenderer.module.css';

interface MarkdownRendererProps {
  content: string;
}

interface MarkdownComponentProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className={styles.markdownContainer}>
      <ReactMarkdown
        components={{
          h1: ({ children, ...props }: MarkdownComponentProps) => 
            <h1 className={styles.heading1} {...props}>{children}</h1>,
          h2: ({ children, ...props }: MarkdownComponentProps) => 
            <h2 className={styles.heading2} {...props}>{children}</h2>,
          h3: ({ children, ...props }: MarkdownComponentProps) => 
            <h3 className={styles.heading3} {...props}>{children}</h3>,
          ul: ({ children, ...props }: MarkdownComponentProps) => 
            <ul className={styles.list} {...props}>{children}</ul>,
          li: ({ children, ...props }: MarkdownComponentProps) => 
            <li className={styles.listItem} {...props}>{children}</li>,
          strong: ({ children, ...props }: MarkdownComponentProps) => 
            <strong className={styles.bold} {...props}>{children}</strong>,
          p: ({ children, ...props }: MarkdownComponentProps) => 
            <p className={styles.paragraph} {...props}>{children}</p>,
          code: ({ children, ...props }: MarkdownComponentProps) => 
            <code className={styles.code} {...props}>{children}</code>,
          pre: ({ children, ...props }: MarkdownComponentProps) => 
            <pre className={styles.pre} {...props}>{children}</pre>,
          blockquote: ({ children, ...props }: MarkdownComponentProps) => 
            <blockquote className={styles.blockquote} {...props}>{children}</blockquote>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer; 