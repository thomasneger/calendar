import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Calendar from '.';
import '../assets/index.less';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Calendar />
  </StrictMode>,
);
