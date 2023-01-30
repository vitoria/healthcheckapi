import { useState } from "react"
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
  proto: Yup.string().required("obrigatório"),
})

type Values = {
  proto: string
}

enum ProtoOptions {
  existant = "Existent",
  new = "New",
}

type ContentProp = {
  value: string
  onChangeValue: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const SelectExistentProto = ({ value, onChangeValue }: ContentProp) => {
  return (
    <div>
      <Label htmlFor="proto">Select previously uploaded protobuf API</Label>
      <Textarea
        id="proto"
        name="proto"
        rows={30}
        onChange={onChangeValue}
        value={value}
      ></Textarea>
    </div>
  )
}

const SelectNewProto = ({ value, onChangeValue }: ContentProp) => {
  const [loading, setLoading] = useState<boolean>(false)

  const onSubmit= async (values: Values) => {
    setLoading(true)
  }

  const formik = useFormik({
    initialValues: {
      proto: "",
    },
    validationSchema,
    onSubmit,
  })

  return (
    <div>
      <Label htmlFor="proto">Paste your .proto file content</Label>
      <Textarea
        id="proto"
        name="proto"
        onChange={formik.handleChange}
        value={formik.values.proto}
      ></Textarea>
      <Button type="submit" disabled={!formik.values.proto}>Upload proto</Button>
    </div>
  )
}

const SelectProfoBuf = () => {
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
          <TabsContent value={ProtoOptions.existant.toString()}></TabsContent>
          <TabsContent value={ProtoOptions.new.toString()}></TabsContent>
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

export default SelectProfoBuf
