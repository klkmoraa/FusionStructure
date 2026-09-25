import './styles.css';
import { Landing } from './landing/Landing';

/** Portal-only composition: products are reached by links, never imports. */
const App = () => <Landing />;

export default App;
