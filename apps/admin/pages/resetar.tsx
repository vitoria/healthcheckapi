import Head from "next/head";
import { useRouter } from "next/router";
import Recovery from "../components/auth/Recovery";
import Reset from "../components/auth/Reset";

const ForgotPasswordPage: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Resetar senha - HealthCheckAPI</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {router.query.token ? <Reset /> : <Recovery />}
    </>
  );
};

export default ForgotPasswordPage;
