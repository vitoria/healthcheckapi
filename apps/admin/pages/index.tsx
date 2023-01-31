import { GetServerSidePropsContext } from "next"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

export default function HomePage() {
  return null
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx)
  const user = await supabase.auth.getUser()
  if (user.data.user) {
    return {
      redirect: {
        destination: "/projects",
        permanent: false,
      },
    }
  }
  return {
    redirect: {
      destination: `/entrar`,
      permanent: false,
    },
  }
}
