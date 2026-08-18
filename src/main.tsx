import { createRoot } from 'react-dom/client';
import './Init';
import App from './App'
import './index.scss';

const container: any = document.getElementById('root');
const root = createRoot(container);

root.render(
  <>
    <App />
  </>,
)
