import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'

interface MarkdownMessageProps {
  content: string
  className?: string
}

export const MarkdownMessage: React.FC<MarkdownMessageProps> = ({
  content,
  className = ''
}) => {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // 代码块样式
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <div className="relative">
                <div className="code-language-tag">
                  {match[1]}
                </div>
                <pre className="overflow-x-auto p-3 text-gray-100 bg-gray-900 rounded-lg">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            ) : (
              <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            )
          },
          // 标题样式
          h1: ({ children }) => (
            <h1 className="mt-6 mb-4 text-2xl font-bold text-gray-900 first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-5 mb-3 text-xl font-bold text-gray-900 first:mt-0">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-4 mb-2 text-lg font-bold text-gray-900 first:mt-0">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-3 mb-2 text-base font-bold text-gray-900 first:mt-0">{children}</h4>
          ),
          // 段落样式
          p: ({ children }) => (
            <p className="mb-3 leading-relaxed last:mb-0">{children}</p>
          ),
          // 列表样式
          ul: ({ children }) => (
            <ul className="mb-3 space-y-1 list-disc list-inside">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 space-y-1 list-decimal list-inside">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">{children}</li>
          ),
          // 引用样式
          blockquote: ({ children }) => (
            <blockquote className="py-2 pl-4 my-4 italic text-gray-700 bg-blue-50 border-l-4 border-blue-500">
              {children}
            </blockquote>
          ),
          // 表格样式
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full rounded-lg border border-gray-300">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-gray-200">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-gray-50">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 font-semibold text-left text-gray-900 border-b border-gray-300">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-gray-700 border-b border-gray-200">
              {children}
            </td>
          ),
          // 链接样式
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              {children}
            </a>
          ),
          // 强调样式
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-700">{children}</em>
          ),
          // 分割线
          hr: () => (
            <hr className="my-6 border-gray-300" />
          ),
          // 图片样式
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="my-4 max-w-full h-auto rounded-lg"
              loading="lazy"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
} 