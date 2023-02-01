import { useState } from "react"
import { useRouter } from "next/router"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useFormik } from "formik"
import { Button, Input, Label } from "ui"
import * as Yup from "yup"

import NewProjectHeader from "@/components/Projects/New/Header"
import { useShell } from "@/components/Shell"

const validationSchema = Yup.object().shape({
  name: Yup.string().required("obrigatório"),
})

export default function NewProjectPage() {
  const { onToast } = useShell()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const supabaseClient = useSupabaseClient()

  const onSubmit = async (values: any) => {
    setLoading(true)

    const projects = await supabaseClient
      .from("projects")
      .insert([{ ...values, org_id: router.query.org_id }])
      .select("*")
      .single()

    if (projects.error) {
      onToast({
        title: "Error to create Project",
        description: projects.error.message,
        variant: "error",
      })
      setLoading(false)
    }

    if (projects.data) {
      onToast({ title: "Project created", variant: "success" })
      setLoading(false)
      router.push({
        pathname: "/project/[project_id]",
        query: { project_id: projects.data.id },
      })
    }
  }

  const formik = useFormik({
    initialValues: { name: "" },
    validationSchema,
    onSubmit,
  })

  return (
    <>
      <NewProjectHeader step="project" />
      <div className="flex flex-1 flex-col items-center bg-gray-100 p-4 sm:pt-12">
        <div className="w-full max-w-md rounded-md border bg-white p-4 shadow-lg">
          <h3 className="font-medium">Create a new project</h3>
          <span className="text-sm text-gray-500">
            Within an project you can create your checks.
          </span>
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
                Create project
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
