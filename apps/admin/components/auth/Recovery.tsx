import { useState } from "react"
import Link from "next/link"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useFormik } from "formik"
import { Alert, Button, Input, Label } from "ui"
import * as Yup from "yup"

type Values = {
  email: string
}

const validationSchema = Yup.object().shape({
  email: Yup.string().required("obrigatório"),
})

const Recovery = () => {
  const [success, setSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const supabaseClient = useSupabaseClient()

  const onSubmit = async (values: Values) => {
    setLoading(true)
    setError(false)

    const { error } = await supabaseClient.auth.resetPasswordForEmail(
      values.email
    )

    if (!error) {
      setLoading(false)
      setSuccess(true)
    } else {
      setError(true)
      setLoading(false)
    }
  }

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema,
    onSubmit,
  })

  return (
    <div className="container mx-auto my-8 max-w-xs">
      <h3 className="mb-8 scroll-m-20 text-2xl font-semibold tracking-tight">
        Esqueceu sua senha?
      </h3>
      {error && (
        <Alert
          variant="error"
          title="E-mail incorreto"
          description="Por favor, verifique seu e-mail e tente novamente."
        />
      )}
      {success && (
        <Alert
          variant="info"
          title="E-mail enviado"
          description="Um e-mail foi enviado para você com instruções para resetar sua senha."
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
        <Button
          type="submit"
          className="w-full"
          disabled={loading || !formik.values.email}
        >
          Enviar e-mail
        </Button>
      </form>
      <p className="my-4 text-center text-sm">
        Lembrou sua senha?{" "}
        <Link
          href="/entrar"
          className="animation font-semibold underline-offset-2 hover:underline"
        >
          Entrar na conta
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

export default Recovery
