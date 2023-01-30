import { useEffect } from "react"
import Head from "next/head"
import { useRouter } from "next/router"

import SignIn from "@/components/auth/SignIn"

const SignInPage = () => {
  const router = useRouter()

  useEffect(() => {
    const parsedHash = new URLSearchParams(window.location.hash.slice(1))
    if (parsedHash.get("type") === "recovery") {
      router.replace(`/resetar?token=${parsedHash.get("access_token")}`)
    }
  }, [router])

  return (
    <>
      <Head>
        <title>Entrar - RSVA</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <SignIn resetSuccess={router.query.reset === "true"} />
    </>
  )
}

export default SignInPage
