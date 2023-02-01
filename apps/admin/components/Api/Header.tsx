import { useRef, useState } from "react"
import { useFormik } from "formik"
import { Button, Input } from "ui"
import * as Yup from "yup"

import { useApi } from "./Provider"

const validationSchema = Yup.object().shape({
  name: Yup.string().required("obrigatório"),
  url: Yup.string().required("obrigatório"),
})

const ApiHeader = () => {
  const { data, onUpdate, updating, onUpload, uploading } = useApi()
  const [editing, setEditing] = useState(false)

  const inputFiles = useRef<HTMLInputElement>(null)

  const onSubmit = (values: any) => onUpdate(values, () => setEditing(false))

  const formik = useFormik({
    initialValues: { name: data?.name, url: data?.url },
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  })

  if (editing) {
    return (
      <form className="flex space-x-4" onSubmit={formik.handleSubmit}>
        <Input
          autoFocus
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          placeholder="Name"
          required
        />
        <Input
          name="url"
          value={formik.values.url}
          onChange={formik.handleChange}
          placeholder="URL"
          required
        />
        <Button
          disabled={updating || !formik.values.name || !formik.values.url}
          type="submit"
          onClick={() => setEditing(true)}
        >
          Save
        </Button>
        <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
          Cancel
        </Button>
      </form>
    )
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {!data ? (
          <div className="h-6 w-24 rounded-md bg-gray-100" />
        ) : (
          <h1 className="text-xl font-medium">{data.name}</h1>
        )}
        {!data ? (
          <div className="h-4 w-16 rounded-md bg-gray-100" />
        ) : (
          <span className="text-sm text-gray-500">{data.url}</span>
        )}
      </div>
      <div className="flex items-center">
        <Button
          disabled={!data || uploading}
          variant="ghost"
          onClick={() => inputFiles.current?.click()}
        >
          {uploading ? "Uploading..." : "Add files"}
        </Button>
        <input
          type="file"
          onChange={onUpload}
          ref={inputFiles}
          className="hidden"
        />
        <Button
          disabled={!data}
          variant="ghost"
          onClick={() => setEditing(true)}
        >
          Edit
        </Button>
      </div>
    </div>
  )
}

export default ApiHeader
