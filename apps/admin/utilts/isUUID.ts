import * as yup from "yup"

const schema = yup.object().shape({
  uuid: yup.string().uuid(),
})

export const isUUID = (uuid: string) => schema.isValidSync({ uuid })
