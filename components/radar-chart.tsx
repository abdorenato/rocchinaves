"use client"

import { Radar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"

// Register Chart.js components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

interface RadarChartProps {
  id?: string
  data: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      backgroundColor: string
      borderColor: string
      borderWidth: number
      pointBackgroundColor: string
      pointBorderColor: string
      pointHoverBackgroundColor: string
      pointHoverBorderColor: string
    }>
  }
}

export function RadarChart({ id, data }: RadarChartProps) {
  const options: ChartOptions<"radar"> = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          color: "#9CA3AF",
          backdropColor: "transparent",
          font: {
            size: 12,
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        pointLabels: {
          color: "#F9FAFB",
          font: {
            size: 14,
            weight: "600",
          },
        },
        angleLines: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(13, 13, 13, 0.9)",
        titleColor: "#F9FAFB",
        bodyColor: "#F9FAFB",
        borderColor: "rgba(108, 197, 211, 0.5)",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => {
            return `Pontuação: ${context.parsed.r.toFixed(2)}`
          },
        },
      },
    },
  }

  return (
    <div id={id} className="w-full h-[450px] flex items-center justify-center">
      <Radar data={data} options={options} />
    </div>
  )
}
