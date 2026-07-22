import Nav from './components/Nav';
import Hero from './components/Hero';
import FeaturedWeaves from './components/FeaturedWeaves';
import Craft from './components/Craft';
import CareProvenance from './components/CareProvenance';
import CTABand from './components/CTABand';

function App() {
  return (
    <div className="font-sans">
      <Nav />
      <Hero />
      <FeaturedWeaves />
      <Craft />
      <CareProvenance />
      <CTABand />
    </div>
  );
}

export default App;
