// pages/_app.tsx
import { AuthProvider } from '@/src/context/authContext';
import type { AppProps } from 'next/app';
import './styles.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
