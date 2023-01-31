import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { deleteCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";

export default function Logout() {
  return null;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  await supabase.auth.signOut();
  ["sb-access-token", "sb-refresh-token", "supabase-auth-token"].forEach(
    (key) => deleteCookie(key, ctx)
  );
  return { redirect: { destination: "/", permanent: false } };
};
