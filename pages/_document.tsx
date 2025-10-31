import { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

// Fix: Add type declaration for the custom element 'elevenlabs-convai' to resolve TypeScript error.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & { 'agent-id'?: string };
    }
  }
}

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <body className="bg-gray-50">
        <Main />
        <NextScript />
        <elevenlabs-convai agent-id="agent_9401k8tstz6ff56rppbx33tqe5ac"></elevenlabs-convai>
        <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
      </body>
    </Html>
  );
}
