import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body
        className={`flex flex-col items-center bg-slate-100 text-slate-800 h-screen bg-fixed`}
        style={{
          backgroundImage:
            "radial-gradient(at 16% 57%, rgba(224, 242, 254, 0.6) 0, transparent 48%), radial-gradient(at 76% 100%, rgba(207, 250, 254, 0.4) 0, transparent 32%), radial-gradient(at 77% 21%, rgba(224, 231, 255, 0.3) 0, transparent 68%)",
        }}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
