import { useMemo } from "react"
import {
  Card,
  Flex,
  LineChart,
  Text,
  Title,
  Tracking,
  TrackingBlock,
} from "@tremor/react"

import { useCheck } from "."
import { assertionColors, statusColors, valueFormatter } from "./utilts"

export default function CheckChart() {
  const { results } = useCheck()

  const latency = useMemo(() => {
    if (results.data) {
      return results.data.data.map((item) => ({
        date: new Intl.DateTimeFormat("pt-BR", {
          dateStyle: "short",
          timeStyle: "short",
          timeZone: "America/Sao_Paulo",
        }).format(new Date(item.created_at)),
        "Avg. Response Time": item.latency,
      }))
    }
    return []
  }, [results.data])

  if (!results.data) {
    return (
      <Card>
        <div className="flex items-center justify-center py-8">
          <Text>Loading...</Text>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <Flex justifyContent="justify-between">
        <Title>Availability</Title>
        <Text>{`${results.data.uptime}% uptime`}</Text>
      </Flex>
      <Tracking marginTop="mt-2">
        {results.data.data.map((item) => (
          <TrackingBlock
            key={item.id}
            color={statusColors[item.status]}
            tooltip={item.status}
          />
        ))}
      </Tracking>
      <Flex justifyContent="justify-between" marginTop="mt-6">
        <Title>Assertions</Title>
        <Text>{`${results.data.coverage}% coverage`}</Text>
      </Flex>
      <Tracking marginTop="mt-2">
        {results.data.data.map((item) => (
          <TrackingBlock
            key={item.id}
            color={assertionColors[String(item.assertion_result)]}
            tooltip={String(item.assertion_result)}
          />
        ))}
      </Tracking>
      <Flex marginTop="mt-6" justifyContent="justify-between">
        <Title>Avg. response time per day</Title>
        <Text>{`~${valueFormatter(results.data.latency)}`}</Text>
      </Flex>
      <LineChart
        marginTop="mt-4"
        data={latency}
        dataKey="date"
        categories={["Avg. Response Time"]}
        colors={["gray"]}
        valueFormatter={valueFormatter}
        showLegend={false}
        yAxisWidth="w-12"
        height="h-80"
      />
    </Card>
  )
}
