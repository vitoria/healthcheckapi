import { useState } from "react"
import type { AppProps } from "next/app"
import Head from "next/head"
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs"
import {
  SessionContextProvider,
  type Session,
} from "@supabase/auth-helpers-react"
import { Analytics } from "@vercel/analytics/react"

import "@/styles/globals.css"
import { NextPageWithLayout } from "@/types"
import { Inter as FontSans } from "@next/font/google"
import { ThemeProvider } from "next-themes"

import { logoEmoji } from "@/components/Logo"
import Shell from "@/components/Shell"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

type AppPropsWithLayout = AppProps & {
  initialSession: Session
  Component: NextPageWithLayout
}

export default function MyApp({
  Component,
  pageProps,
  router,
}: AppPropsWithLayout) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())
  const getLayout = Component.getLayout || ((page) => page)
  const isAuth =
    router.pathname.startsWith("/project") || router.pathname.startsWith("/new")
  const page = getLayout(<Component {...pageProps} />)
  return (
    <>
      <style jsx global>{`
        :root {
          --font-sans: ${fontSans.style.fontFamily};
        }
      }`}</style>
      <Head>
        <link
          rel="shortcut icon"
          href={`data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${logoEmoji}</text></svg>`}
        />
      </Head>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          {isAuth ? <Shell>{page}</Shell> : page}
        </ThemeProvider>
        <Analytics />
      </SessionContextProvider>
    </>
  )
}
