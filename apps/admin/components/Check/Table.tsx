import { PropsWithChildren, useMemo, useState } from "react"
import {
  Badge,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  Title,
} from "@tremor/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "ui"

import { useCheck } from "."
import { assertionColors, statusColors, valueFormatter } from "./utilts"

const Code = ({ children }: PropsWithChildren) => (
  <code className="rounded border bg-gray-100 p-4 text-sm">{children}</code>
)

export default function CheckTable() {
  const { results } = useCheck()
  const [selected, setSelected] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const data = useMemo(
    () => (results.data ? [...results.data.data].reverse() : []),
    [results]
  )

  const details = useMemo(() => {
    if (selected) {
      return data.find((item) => item.id === selected)
    }
  }, [data, selected])

  if (!results.data) {
    return (
      <Card>
        <div className="flex items-center justify-center py-8">
          <Text>Loading...</Text>
        </div>
      </Card>
    )
  }

  const handleOpen = (id: string) => {
    setOpen(true)
    setSelected(id)
  }

  const handleToggle = (o: boolean) => {
    if (!o) {
      setSelected(null)
    }
    setOpen(o)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleToggle}>
        {details ? (
          <DialogContent
            forceMount
            className="shadow-big animation fixed top-1/4 left-1/2 w-full max-w-[calc(100vw-32px)] -translate-y-1/2 -translate-x-1/2 rounded-md bg-white sm:top-1/2"
          >
            <DialogHeader className="mb-4">
              <DialogTitle>
                {new Intl.DateTimeFormat("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                  timeZone: "America/Sao_Paulo",
                }).format(new Date(details.created_at))}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col">
                <Title>Assertion</Title>
                <Badge
                  color={assertionColors[String(details.assertion_result)]}
                  text={String(details.assertion_result)}
                  size="xs"
                />
              </div>
              {details.response ? (
                <div className="flex flex-col space-y-2">
                  <Title>Reponse</Title>
                  <Code>{JSON.stringify(details.response)}</Code>
                </div>
              ) : null}
              {details.error ? (
                <div className="flex flex-col space-y-2">
                  <Title>Error</Title>
                  <Code>{JSON.stringify(details.error)}</Code>
                </div>
              ) : null}
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Latency</TableHeaderCell>
              <TableHeaderCell>Assertion</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Link</TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                    timeZone: "America/Sao_Paulo",
                  }).format(new Date(item.created_at))}
                </TableCell>
                <TableCell>{valueFormatter(item.latency)}</TableCell>
                <TableCell>
                  <Badge
                    color={assertionColors[String(item.assertion_result)]}
                    text={String(item.assertion_result)}
                    size="xs"
                  />
                </TableCell>
                <TableCell>
                  <Badge
                    color={statusColors[item.status]}
                    text={item.status}
                    size="xs"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="xs"
                    variant="secondary"
                    text="See details"
                    color="gray"
                    onClick={() => handleOpen(item.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  )
}
