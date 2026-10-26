import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

// No <React.StrictMode> here on purpose: the interactions in
// useSideQuestEffects are a direct port of the original vanilla-JS
// behaviour and mutate the DOM imperatively (classList, attributes,
// setInterval/IntersectionObserver callbacks). StrictMode's deliberate
// double-invoke of effects in development would double up timers and
// observers, which the original script was never written to tolerate.
createRoot(document.getElementById('root')).render(<App />);
