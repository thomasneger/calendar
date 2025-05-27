import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import './demo.css';

export function renderDemo(children: ReactNode) {
  const node = document.getElementById('root');
  const root = createRoot(node!);

  root.render(<DemoWrapper>{children}</DemoWrapper>);
}

function DemoWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="container">
      <div className="header">
        <h1>rc-calendar@10.0.0</h1>
        <p>React Calendar</p>
      </div>

      <div className="example">{children}</div>
    </div>
  );
}
