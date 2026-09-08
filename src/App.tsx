import './styles.css';
import { FusionLanding } from './features/welcome/FusionLanding';
import { PRODUCT_LINKS } from './foundation/productLinks';

const openProduct = (url: string): void => {
  window.location.assign(url);
};

/** Portal-only composition: products are reached by links, never imports. */
const App = () => (
  <FusionLanding
    language="es"
    onOpenSolver2D={() => openProduct(PRODUCT_LINKS.fstructure)}
    onOpenSolver3D={() => openProduct(PRODUCT_LINKS.space3d)}
    onOpenClassroom={() => openProduct(PRODUCT_LINKS.fstructure)}
  />
);

export default App;
