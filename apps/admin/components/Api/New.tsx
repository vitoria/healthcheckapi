import { useState } from "react"
import { useRouter } from "next/router"
import { useFormik } from "formik"
import { useSWRConfig } from "swr"
import {
  Button,
  ButtonProps,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from "ui"
import * as Yup from "yup"

import { useShell } from "../Shell"

const validationSchema = Yup.object().shape({
  name: Yup.string().required("obrigatório"),
  url: Yup.string().required("obrigatório"),
})

const NewApi = (props: ButtonProps) => {
  const { mutate } = useSWRConfig()
  const { onToast } = useShell()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const onSubmit = async (values: any) => {
    setLoading(true)

    const res = await fetch(`/api/project/${router.query.project_id}/apis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    }).then((res) => res.json())

    if (res.message) {
      setLoading(false)
      onToast({
        title: "Error to create a new API",
        description: res.message,
        variant: "error",
      })
    }

    if (res.id) {
      setLoading(false)
      setOpen(false)
      router.push({
        pathname: `/project/[project_id]/api/[api_id]`,
        query: { ...router.query, api_id: res.id },
      })
      mutate(`/api/project/${router.query.project_id}/apis`)
    }
  }

  const formik = useFormik({
    initialValues: { name: "", url: "" },
    validationSchema,
    onSubmit,
  })

  return (
    <Dialog open={open} onOpenChange={(o) => (loading ? null : setOpen(o))}>
      <DialogTrigger asChild {...props}>
        <Button>New</Button>
      </DialogTrigger>
      <DialogContent
        forceMount
        className="shadow-big animation fixed top-1/4 left-1/2 w-full max-w-[calc(100vw-32px)] -translate-y-1/2 -translate-x-1/2 rounded-md bg-white sm:top-1/2 sm:max-w-sm"
      >
        <DialogHeader>
          <DialogTitle>Create a new API</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                required
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                URL
              </Label>
              <Input
                id="url"
                name="url"
                value={formik.values.url}
                onChange={formik.handleChange}
                required
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={
                loading || formik.values.name === "" || formik.values.url === ""
              }
            >
              {loading ? "Creating..." : "Create API"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default NewApi
