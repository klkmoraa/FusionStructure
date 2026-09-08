import { createRoot } from 'react-dom/client';
import '../app/globals.css';
import BrandbookClient from '../app/BrandbookClient';

const root = document.getElementById('root');

if (!root) {
  throw new Error('No se encontró #root para montar el brandbook.');
}

createRoot(root).render(<BrandbookClient />);
