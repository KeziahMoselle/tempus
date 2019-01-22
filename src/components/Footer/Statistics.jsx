import React, { useState, useEffect } from 'react'
import Chart from 'chart.js'
import CalendarHeatmap from 'react-calendar-heatmap'
import ReactTooltip from 'react-tooltip'

import './heatmap.css'

export default () => {
  const [data, setData] = useState(undefined)
  const [chartType, setChartType] = useState('bar')

  useEffect(() => {
    window.ipcRenderer.send('getData')
    window.ipcRenderer.once('getData', (event, storeData) => {
      const heatmapDataset = storeData.map(object => ({
        date: object.day,
        streak: object.streak
      }))
      const barDataset = storeData.map(object => ({
        t: new Date(object.day),
        y: object.value
      }))
      setData({
        bar: barDataset,
        heatmap: heatmapDataset
      })
    })
  }, [])

  
  /*
   * CREATE THE BAR CHART
   * only when data is filled
   */
  
  useEffect(() => {
    if (data && chartType === 'bar') {
      new Chart('bar-chart', {
        type: 'bar',
        data: {
          datasets: [{
            label: 'Minutes of work',
            data: data.bar,
            backgroundColor: [
              'rgba(255,179,186)',
              'rgba(255,223,186)',
              'rgba(255,255,186)',
              'rgba(186,255,201)',
              'rgba(186,225,255)'
            ],
            borderColor: [
              'rgba(255,179,186, 0.8)',
              'rgba(255,223,186, 0.8)',
              'rgba(255,255,186, 0.8)',
              'rgba(186,255,201, 0.8)',
              'rgba(186,225,255, 0.8)'
            ]
          }]
        },
        options: {
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                unit: 'day'
              }
            }],
            yAxes: [{
              ticks: {
                beginAtZero:true
              }
            }]
          }
        }
      })
    }
  }, [data])
  
  return (
    <div className="statistics-container">

      <div className="card">
        <button onClick={() => setChartType('heatmap')} className="card-item">
          <span role="img" aria-label="fire streak">🔥</span>
          4
        </button>

        <button onClick={() => setChartType('bar')} className="card-item">
          <span role="img" aria-label="fire streak">⏱️</span>
          4h
        </button>
      </div>

      <div className="chart-container">

          <canvas id="bar-chart" className={chartType !== 'bar' ? 'hide' : ''}></canvas>

        { (data && chartType === 'heatmap') &&
          <>
            <CalendarHeatmap
              startDate={new Date('2019-01-01')}
              endDate={new Date('2019-04-30')}
              showWeekdayLabels={true}
              values={data.heatmap}
              classForValue={value => {
                if (!value) return 'color-empty'
                if (value.streak <= 3) return `color-${value.streak}`
                return 'color-max'
              }}
              tooltipDataAttrs={value => {
                if (!value.date) return { 'data-tip': 'No streak' }
                return { 'data-tip': `${value.date} : Streak: ${value.streak}` }
              }}
            />
            <ReactTooltip />
          </>
        }
      </div>

      { !data &&
        <div className="circle-ripple"></div>
      }

    </div>
  )
}