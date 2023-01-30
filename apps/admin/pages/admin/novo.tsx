import { useState } from "react"
import type { NextPageWithLayout } from "@/types"
import { useFormik } from "formik"
import {
  Alert,
  Button,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "ui"
import * as Yup from "yup"

import Stepper from "@/components/Stepper"

const validationSchema = Yup.object().shape({
  email: Yup.string().required("obrigatório"),
  password: Yup.string().required("obrigatório"),
})

enum ProtoOptions {
  existant = "Existent",
  new = "New",
}

const NewPage: NextPageWithLayout = () => {
  const [protoOption, setProtoOption] = useState(
    ProtoOptions.existant.toString()
  )
  const formik = useFormik({
    initialValues: {
      url: "",
      proto: "",
      service: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values)
    },
  })

  const steps = [
    {
      title: "Select Service",
    },
    {
      title: "Configure Check",
    },
    {
      title: "Review",
    },
  ]

  return (
    <div className="p-4">
      <Stepper currentStep={0} steps={steps} />
      <h2 className="my-4">Choose protobuf service</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <Tabs value={protoOption} onValueChange={setProtoOption}>
          <TabsList>
            {Object.values(ProtoOptions).map((item) => (
              <TabsTrigger key={item} value={item}>
                {item}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={ProtoOptions.existant.toString()}>
          <div>
              <Label htmlFor="proto">Select previously uploaded protobuf API</Label>
              <Textarea
                id="proto"
                name="proto"
                rows={30}
                onChange={formik.handleChange}
                value={formik.values.proto}
              ></Textarea>
            </div>
          </TabsContent>
          <TabsContent value={ProtoOptions.new.toString()}>
            <div>
              <Label htmlFor="proto">Paste your .proto file content</Label>
              <Textarea
                id="proto"
                name="proto"
                rows={30}
                onChange={formik.handleChange}
                value={formik.values.proto}
              ></Textarea>
            </div>
          </TabsContent>
        </Tabs>

        <div>
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            name="url"
            onChange={formik.handleChange}
            value={formik.values.url}
          ></Input>
        </div>
      </form>
    </div>
  )
}

export default NewPage
