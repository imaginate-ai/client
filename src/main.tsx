import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import posthog from 'posthog-js';

posthog.init('phc_TrQqpxDjEZAOLzSUBk8DKJF8UzhBj4sbkhe6YOSxYxe', {
  api_host: 'https://us.i.posthog.com',
  enable_recording_console_log: true,
  person_profiles: 'always',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className='h-screen'>
      <App />
    </div>
  </React.StrictMode>,
);
