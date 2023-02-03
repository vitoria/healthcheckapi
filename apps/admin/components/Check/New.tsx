import { useState } from "react"
import { useRouter } from "next/router"
import { Api } from "@/types"
import { fetcher } from "@/utilts/fetcher"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useFormik } from "formik"
import useSWR, { useSWRConfig } from "swr"
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui"
import * as Yup from "yup"

import { useShell } from "../Shell"

const validationSchema = Yup.object().shape({
  name: Yup.string().required("obrigatório"),
  api_id: Yup.string().uuid().required("obrigatório"),
})

const NewCheck = (props: ButtonProps) => {
  const { mutate } = useSWRConfig()
  const { onToast } = useShell()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const supabaseClient = useSupabaseClient()

  const apis = useSWR<Api[]>(
    open ? `/api/project/${router.query.project_id}/apis` : null,
    fetcher
  )

  const onSubmit = async (values: any) => {
    setLoading(true)

    const checks = await supabaseClient
      .from("checks")
      .insert([values])
      .select("*")
      .single()

    if (checks.error) {
      setLoading(false)
      onToast({
        title: "Error to create a new Check",
        description: checks.error.message,
        variant: "error",
      })
    }

    if (checks.data) {
      setLoading(false)
      setOpen(false)
      router.push({
        pathname: `/project/[project_id]/check/[check_id]`,
        query: { ...router.query, check_id: checks.data.id },
      })
      mutate(`/api/project/${router.query.project_id}`)
    }
  }

  const formik = useFormik({
    initialValues: { name: "", api_id: "" },
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
          <DialogTitle>Create a new check</DialogTitle>
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
              <Label htmlFor="api" className="text-right">
                API
              </Label>
              <Select
                onValueChange={(value) => formik.setFieldValue("api_id", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {apis.data?.map((item) => (
                      <SelectItem value={item.id} key={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={
                loading ||
                formik.values.name === "" ||
                formik.values.api_id === ""
              }
            >
              {loading ? "Creating..." : "Create check"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default NewCheck
