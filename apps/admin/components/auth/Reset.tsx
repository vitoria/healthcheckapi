import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useFormik } from "formik"
import { Alert, Button, Input, Label } from "ui"
import * as Yup from "yup"

type Values = {
  newPassword: string
  newPasswordCheck: string
}

const validationSchema = Yup.object({
  newPassword: Yup.string().required("obrigatório"),
  newPasswordCheck: Yup.string().when("newPassword", {
    is: (val: string) => val !== "",
    then: (schema) =>
      schema.required("obrigatório").oneOf([Yup.ref("newPassword")]),
  }),
})

const Reset = () => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const supabaseClient = useSupabaseClient()

  const onSubmit = async (values: Values) => {
    setLoading(true)
    setError(false)

    const { error } = await supabaseClient.auth.updateUser({
      password: values.newPassword,
    })

    if (!error) {
      router.replace("/entrar?reset=true")
    } else {
      setError(true)
      setLoading(false)
    }
  }

  const formik = useFormik({
    initialValues: { newPassword: "", newPasswordCheck: "" },
    validationSchema,
    onSubmit,
  })

  return (
    <div className="container mx-auto my-8 max-w-xs">
      <h3 className="mb-8 text-3xl font-bold">Resetar senha</h3>
      {error && <Alert variant="error" title="Token inválido" />}
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="newPassword">Nova senha</Label>
          <Input
            type="password"
            id="newPassword"
            name="newPassword"
            onChange={formik.handleChange}
            value={formik.values.newPassword}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="newPasswordCheck">Repita a senha</Label>
          <Input
            type="password"
            id="newPasswordCheck"
            name="newPasswordCheck"
            onChange={formik.handleChange}
            value={formik.values.newPasswordCheck}
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={
            loading ||
            !formik.values.newPassword ||
            !formik.values.newPasswordCheck
          }
        >
          Resetar senha
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

export default Reset
