import { useState } from "react"
import { useRouter } from "next/router"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useFormik } from "formik"
import { Button, Input, Label } from "ui"
import * as Yup from "yup"

import { siteName } from "@/components/Logo"
import NewProjectHeader from "@/components/Projects/New/Header"
import { useShell } from "@/components/Shell"

const validationSchema = Yup.object().shape({
  name: Yup.string().required("obrigatório"),
})

export default function NewOrganizationPage() {
  const { onToast } = useShell()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const supabaseClient = useSupabaseClient()

  const onSubmit = async (values: any) => {
    setLoading(true)

    const organizations = await supabaseClient
      .from("organizations")
      .insert([values])
      .select("*")
      .single()

    if (organizations.error) {
      onToast({
        title: "Error to create Organization",
        description: organizations.error.message,
        variant: "error",
      })
      setLoading(false)
    }

    if (organizations.data) {
      onToast({ title: "Organization created", variant: "success" })

      const {
        data: { user },
      } = await supabaseClient.auth.getUser()

      if (user) {
        const members = await supabaseClient
          .from("members")
          .insert([
            { org_id: organizations.data.id, user_id: user.id, role: "owner" },
          ])
          .select("*")

        if (members.error) {
          // TODO: should remove the organization created
          onToast({
            title: "Error to create Member",
            description: members.error.message,
            variant: "error",
          })
          setLoading(false)
        }

        if (members.data) {
          onToast({ title: "Member created", variant: "success" })

          setLoading(false)
          router.push({
            pathname: "/new/[org_id]",
            query: { org_id: organizations.data.id },
          })
        }
      }
    }
  }

  const formik = useFormik({
    initialValues: { name: "" },
    validationSchema,
    onSubmit,
  })

  return (
    <>
      <NewProjectHeader />
      <div className="flex flex-1 flex-col items-center bg-gray-100 pt-12">
        <div className="w-full max-w-md rounded-md border bg-white p-4 shadow-lg">
          <h3 className="font-medium">Create a new organization</h3>
          <span className="text-sm text-gray-500">{`This is your organization within ${siteName}.`}</span>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid gap-4 py-8">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  autoFocus
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  required
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Button variant="outline" type="button" onClick={router.back}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || formik.values.name === ""}
              >
                Create organization
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
