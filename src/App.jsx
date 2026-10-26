import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Beliefs from './components/Beliefs.jsx';
import Work from './components/Work.jsx';
import Manual from './components/Manual.jsx';
import Levels from './components/Levels.jsx';
import Quests from './components/Quests.jsx';
import Voices from './components/Voices.jsx';
import Contact from './components/Contact.jsx';
import MixtapeDialog from './components/MixtapeDialog.jsx';
import TldrDialog from './components/TldrDialog.jsx';
import useSideQuestEffects from './hooks/useSideQuestEffects.js';

export default function App() {
  useSideQuestEffects();

  return (
    <>
      <a className="sr-only" href="#main">Skip to content</a>
      <Nav />
      <Hero />
      <Beliefs />
      <main id="main">
        <Work />
        <Manual />
        <Levels />
        <Quests />
        <Voices />
      </main>
      <Contact />
      <MixtapeDialog />
      <TldrDialog />
    </>
  );
}
