import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useFormik } from "formik"
import { Alert, Button, Input, Label } from "ui"
import * as Yup from "yup"

type Values = {
  email: string
  password: string
}

const ERROR_MESSAGES = {
  "Invalid login credentials": {
    title: "E-mail ou senha incorretos",
    description: "Por favor, verifique seu e-mail e senha e tente novamente.",
  },
  "Email not confirmed": {
    title: "E-mail não confirmado",
    description: "Por favor, verifique seu e-mail e tente novamente.",
  },
}

const validationSchema = Yup.object().shape({
  email: Yup.string().required("obrigatório"),
  password: Yup.string().required("obrigatório"),
})

type SignInProps = {
  resetSuccess: boolean
}

const SignIn = ({ resetSuccess }: SignInProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [errorState, setError] = useState<string>()
  const supabaseClient = useSupabaseClient()

  const onSubmit = async (values: Values) => {
    setLoading(true)
    setError(undefined)

    const { error } = await supabaseClient.auth.signInWithPassword(values)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      if (router.query.from) {
        router.push(router.query.from as string)
      } else {
        router.push("/")
      }
    }
  }

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit,
  })

  return (
    <div className="container mx-auto my-8 max-w-xs">
      <h3 className="mb-8 scroll-m-20 text-2xl font-semibold tracking-tight">
        Bem-vindo de volta
      </h3>
      {router.query.new && (
        <Alert
          variant="success"
          title="Conta criada!"
          description="Verifique seu e-mail para confirmar."
        />
      )}
      {resetSuccess && (
        <Alert
          variant="success"
          title="Senha alterada com sucesso"
          description="Agora você pode entrar com sua nova senha."
        />
      )}
      {errorState && (
        <Alert
          variant="error"
          title={(ERROR_MESSAGES as any)[errorState].title}
          description={(ERROR_MESSAGES as any)[errorState].description}
        />
      )}
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input
            type="email"
            id="email"
            name="email"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="password">Senha</Label>
          <Input
            type="password"
            id="password"
            name="password"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={loading || !formik.values.email || !formik.values.password}
        >
          Entrar
        </Button>
      </form>
      <p className="my-4 text-center text-sm">
        Esqueceu sua senha?{" "}
        <Link
          href="/resetar"
          className="animation font-semibold underline-offset-2 hover:underline"
        >
          Resetar senha
        </Link>
      </p>
      <p className="text-center text-sm">
        Não tem uma conta ainda?{" "}
        <Link
          href="/cadastrar"
          className="animation font-semibold underline-offset-2 hover:underline"
        >
          Criar conta
        </Link>
      </p>
    </div>
  )
}

export default SignIn
