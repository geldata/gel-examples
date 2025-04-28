import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Todo Example App</title>
        <meta
          name="description"
          content="A simple todo example app to demonstrate using Next.js (Pages router) with EdgeDB Auth"
        />
      </Head>
      <style jsx global>{`
        body {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>

      <Component {...pageProps} />
    </>
  );
}
