import Head from 'next/head';
import Layout from '../components/Layout';
import { ToastProvider } from '../components/Toast';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <ToastProvider>
      <Head>
        <title>Notice Board</title>
        <meta name="description" content="A modern notice board app to stay updated with the latest announcements, exams, and events." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ToastProvider>
  );
}
