import '@/styles/globals.css';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <title>LinkedIn Clone</title>
        <meta name="description" content="A visually stunning LinkedIn clone built with MERN stack" />
      </Head>
      <Toaster position="top-right" />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
