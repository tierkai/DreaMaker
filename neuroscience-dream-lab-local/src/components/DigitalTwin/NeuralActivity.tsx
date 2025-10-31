// @ts-nocheck
import React, { useEffect, useState } from 'react'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, TitleComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([LineChart, GridComponent, TooltipComponent, TitleComponent, CanvasRenderer])

export default function NeuralActivity() {
  const [data, setData] = useState<number[][]>([[], [], []])

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = prev.map(series => {
          const newSeries = [...series, Math.random() * 100 + Math.sin(Date.now() / 1000) * 30]
          return newSeries.slice(-50)
        })
        return newData
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const option = {
    backgroundColor: 'transparent',
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: Array.from({ length: 50 }, (_, i) => i),
      axisLine: { lineStyle: { color: '#64748b' } },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#64748b' } },
      splitLine: { lineStyle: { color: '#334155', type: 'dashed' } }
    },
    series: [
      {
        name: '前额叶皮层',
        type: 'line',
        smooth: true,
        data: data[0],
        itemStyle: { color: '#3b82f6' },
        areaStyle: { 
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0)' }
          ])
        },
        symbol: 'none'
      },
      {
        name: '海马体',
        type: 'line',
        smooth: true,
        data: data[1],
        itemStyle: { color: '#22c55e' },
        areaStyle: { 
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(34, 197, 94, 0.3)' },
            { offset: 1, color: 'rgba(34, 197, 94, 0)' }
          ])
        },
        symbol: 'none'
      },
      {
        name: '杏仁核',
        type: 'line',
        smooth: true,
        data: data[2],
        itemStyle: { color: '#ec4899' },
        areaStyle: { 
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(236, 72, 153, 0.3)' },
            { offset: 1, color: 'rgba(236, 72, 153, 0)' }
          ])
        },
        symbol: 'none'
      }
    ]
  }

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ height: '100%', width: '100%' }}
      notMerge={true}
      lazyUpdate={true}
    />
  )
}
