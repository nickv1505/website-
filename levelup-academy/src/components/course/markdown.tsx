import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/** Renders lesson markdown. Raw HTML is not allowed (react-markdown escapes it by default). */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-lesson">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            const external = href?.startsWith('http');
            return (
              <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                {children}
              </a>
            );
          },
          input: (props) => <input {...props} disabled aria-label="Checklist item" />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
