import { Head, Html, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head />
      <body className="min-h-screen overflow-hidden bg-white font-sans text-black antialiased dark:bg-black dark:text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
