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

import SelectProtobuf from "@/components/Check/SelectProtobuf"
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
      <SelectProtobuf />
    </div>
  )
}

export default NewPage
