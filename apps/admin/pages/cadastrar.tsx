import Head from "next/head";
import SignUp from "../components/auth/SignUp";

const SignUpPage = () => {
  return (
    <>
      <Head>
        <title>Criar conta - HealthCheckAPI</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <SignUp />
    </>
  );
};

export default SignUpPage;
