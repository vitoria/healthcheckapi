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

type SelectNewProtoProps = {
  onSubmit: (proto: string) => void
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

const registerProto = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch("/api/protobuf", {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  })

  return res.json()
}

const SelectNewProto = ({ onSubmit }: SelectNewProtoProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [proto, setProto] = useState<string>("")
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async () => {
    setLoading(true)

    if (file == null) { return }

    const data = await registerProto(file)

    console.log(data)

    onSubmit(proto)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="proto">Paste your .proto file content</Label>
        <Textarea
          id="proto"
          name="proto"
          onChange={(e) => setProto(e.target.value)}
          value={proto}
        ></Textarea>
        <Input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        ></Input>
      </div>
      <Button
        type="submit"
        // disabled={loading || proto === "" || proto == null}
        onClick={handleSubmit}
      >
        Upload proto
      </Button>
    </div>
  )
}

const SelectProfoBuf = () => {
  const [protoOption, setProtoOption] = useState(ProtoOptions.new.toString())
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

  return (
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
        <TabsContent value={ProtoOptions.new.toString()}>
          <SelectNewProto
            onSubmit={(proto) => {
              console.log(proto)
              formik.handleChange({ type: "change", target: { name: "proto" } })
            }}
          />
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
  )
}

export default SelectProfoBuf
