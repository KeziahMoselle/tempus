import React, { useState, useEffect } from 'react'
import CalendarHeatmap from 'react-calendar-heatmap'
import ReactTooltip from 'react-tooltip'

export default () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    window.ipcRenderer.send('getHeatmapChartData')
    window.ipcRenderer.once('getHeatmapChartData', (event, payload) => {
      setData(payload)
    })
  }, [])

  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 1, 1)
  const endDate = new Date()
  endDate.setMonth(endDate.getMonth() + 3, 1)
  
  return (
    <>
      { data &&
        <>
          <CalendarHeatmap
            startDate={startDate}
            endDate={endDate}
            showWeekdayLabels={true}
            values={data}
            classForValue={value => {
              if (!value) return 'color-0'
              let classes = ''
              if (value.streak <= 3) classes = `color-${value.streak}`
              if (value.streak >= 4) classes = 'color-max'

              const today = new Date().toISOString().split('T')[0].toString()
              if (value.date.toString() === today) classes += ' today'
              return classes
            }}
            tooltipDataAttrs={value => {
              if (!value.date) return { 'data-tip': 'No streak' }
              return { 'data-tip': `${new Date(value.date).toDateString()} : ${value.value} min (Streak: ${value.streak})` }
            }}
          />
          <ReactTooltip />
        </>
      }

      { !data &&
        <h6 className="center">Loading...</h6>
      }
    </>
  )
}