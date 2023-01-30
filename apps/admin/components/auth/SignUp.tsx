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
  "User already registered": {
    title: "E-mail já cadastrado",
    description: "Faça login ou use outro e-mail para criar uma nova conta.",
  },
}

const validationSchema = Yup.object().shape({
  email: Yup.string().required("obrigatório"),
  password: Yup.string().required("obrigatório"),
})

const SignUp = () => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [errorState, setError] = useState<string>()
  const supabaseClient = useSupabaseClient()

  const onSubmit = async (values: Values) => {
    setLoading(true)
    setError(undefined)

    const { error } = await supabaseClient.auth.signUp(values)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push("/login?new=true")
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
        Criar conta
      </h3>
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
          Criar conta
        </Button>
      </form>
      <p className="mt-4 text-center text-sm">
        Já tem conta?{" "}
        <Link
          href="/entrar"
          className="animation font-semibold underline-offset-2 hover:underline"
        >
          Entrar
        </Link>
      </p>
    </div>
  )
}

export default SignUp
