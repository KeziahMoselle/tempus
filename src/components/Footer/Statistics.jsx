import React, { useState, useEffect } from 'react'
import Chart from 'chart.js'
import CalendarHeatmap from 'react-calendar-heatmap'
import ReactTooltip from 'react-tooltip'

import './heatmap.css'

export default () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [chartType, setChartType] = useState('heatmap')

  useEffect(() => {
    window.ipcRenderer.send('getData')
    window.ipcRenderer.once('getData', (event, storeData) => {
      const dataset = storeData.map(object => ({
        t: new Date(object.day),
        y: object.value
      }))

      setIsLoaded(true)

      new Chart('bar-chart', {
        type: 'bar',
        data: {
          datasets: [{
            label: 'Minutes of work',
            data: dataset,
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
    })
  }, [])
  
  return (
    <div className="statistics-container">

      <div className="card">

        <button className="card-item">
          <span role="img" aria-label="fire streak">🔥</span>
          4
        </button>

        <button className="card-item">
          <span role="img" aria-label="fire streak">⏱️</span>
          4h
        </button>

      </div>

      <div className="chart-container">
        {
          (isLoaded && chartType === 'bar') &&
          <canvas id="bar-chart"></canvas>
        }

        { (isLoaded && chartType === 'heatmap') &&
          <>
            <CalendarHeatmap
              startDate={new Date('2019-01-01')}
              endDate={new Date('2019-04-30')}
              showWeekdayLabels={true}
              values={[
                { date: '2019-01-20', streak: 1 },
                { date: '2019-01-21', streak: 2 },
                { date: '2019-01-22', streak: 3 },
                { date: '2019-01-23', streak: 4 },
                { date: '2019-01-24', streak: 5 }
              ]}
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

      { !isLoaded &&
        <div className="circle-ripple"></div>
      }

    </div>
  )
}