import { useState } from "react"
import { useRouter } from "next/router"
import { ApiDetails } from "@/types"
import { fetcher } from "@/utilts/fetcher"
import { Text, Title } from "@tremor/react"
import { useFormik } from "formik"
import useSWR from "swr"
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Input,
  Label,
  Textarea,
} from "ui"
import * as Yup from "yup"

import { useCheck } from "."

const validationSchema = Yup.object().shape({
  name: Yup.string().required("obrigatório"),
  service: Yup.string().required("obrigatório"),
  method: Yup.string().required("obrigatório"),
  request: Yup.string().required("obrigatório"),
  assertion: Yup.string().required("obrigatório"),
  interval: Yup.number().integer().required("obrigatório"),
})

export const CheckHeader = () => {
  const {
    query: { project_id },
  } = useRouter()
  const { data, onUpdate, updating } = useCheck()
  const [editing, setEditing] = useState(false)

  const details = useSWR<ApiDetails>(
    editing ? `/api/project/${project_id}/apis/${data?.api_id}/details` : null,
    fetcher
  )

  const onSubmit = ({ assertion, request, ...values }: any) =>
    onUpdate(
      {
        ...values,
        assertion: JSON.parse(assertion),
        request: JSON.parse(request),
      },
      () => setEditing(false)
    )

  const formik = useFormik({
    initialValues: {
      name: data?.name,
      service: data?.service,
      method: data?.method,
      interval: data?.interval,
      request: String(JSON.stringify(data?.request, null, 2)),
      assertion: String(JSON.stringify(data?.assertion, null, 2)),
    },
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  })

  if (editing) {
    return (
      <form className="flex flex-col space-y-4" onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 flex space-x-4">
            <div className="flex flex-1 flex-col space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                autoFocus
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                required
              />
            </div>
            <div className="flex flex-1 flex-col space-y-2">
              <Label>Service/Method</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex h-9 w-full rounded-md border border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >{`${formik.values.service}/${formik.values.method}`}</button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuGroup>
                    {details.data?.services.map((service) => (
                      <DropdownMenuSub key={service.name}>
                        <DropdownMenuSubTrigger>
                          <span>{service.name}</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            {service.methods.map((method) => (
                              <DropdownMenuItem
                                key={method}
                                onClick={() => {
                                  formik.setFieldValue("service", service.name)
                                  formik.setFieldValue("method", method)
                                }}
                              >
                                <span>{method}</span>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex max-w-[96px] flex-1 flex-col space-y-2">
              <Label htmlFor="interval">Interval</Label>
              <Input
                id="interval"
                type="number"
                name="interval"
                min={15}
                step={1}
                value={formik.values.interval}
                onChange={formik.handleChange}
                required
              />
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="request">Request</Label>
            <Textarea
              id="request"
              name="request"
              className="min-h-[200px]"
              onChange={formik.handleChange}
              value={formik.values.request}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="assertion">Assertions</Label>
            <Textarea
              id="assertion"
              name="assertion"
              className="min-h-[200px]"
              onChange={formik.handleChange}
              value={formik.values.assertion}
            />
          </div>
        </div>
        <div className="flex items-center justify-end space-x-4">
          <Button
            disabled={updating}
            type="submit"
            onClick={() => setEditing(true)}
          >
            {updating ? "Saving..." : "Save"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setEditing(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    )
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {!data ? (
          <div className="h-7 w-40 rounded-md bg-gray-100" />
        ) : (
          <Title>{data.name}</Title>
        )}
        {!data ? (
          <div className="h-5 w-1/3 rounded-md bg-gray-100" />
        ) : (
          <Text>{`${data.service}/${data.method}`}</Text>
        )}
      </div>
      <Button disabled={!data} variant="ghost" onClick={() => setEditing(true)}>
        Edit
      </Button>
    </div>
  )
}
