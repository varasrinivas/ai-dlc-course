import { AuthQueue } from './components/AuthQueue';
import { SAMPLE_QUEUE } from './data/sample';

export default function App() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <h1>Authorization queue</h1>
      <AuthQueue requests={SAMPLE_QUEUE} />
    </main>
  );
}
