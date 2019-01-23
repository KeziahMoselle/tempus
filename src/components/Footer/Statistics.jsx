import React, { useState, useEffect } from 'react'
import Chart from 'chart.js'
import CalendarHeatmap from 'react-calendar-heatmap'
import ReactTooltip from 'react-tooltip'

import './heatmap.css'

export default ({ sessionStreak }) => {
  const [data, setData] = useState({
    bar: undefined,
    heatmap: undefined,
    hoursOfWork: 'Loading...'
  })
  const [chartType, setChartType] = useState('bar')
  
  /**
   * Get data from the store
   */

  useEffect(() => {
    window.ipcRenderer.send('getData')
    window.ipcRenderer.once('getData', (event, data) => {

      /* Data for the Heatmap chart */
      const heatmapDataset = data.data.map(object => ({
        date: object.day,
        streak: object.streak
      }))

      /* Data for the Bar chart */
      const barDataset = data.data.map(object => ({
        t: new Date(object.day),
        y: object.value
      })) 

      /* Calculate the total worktime */
      const minutesOfWork = data.data.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.value
      }, 0)
      const totalHoursOfWork = (minutesOfWork / 60).toFixed(1)

      /* Calculate the total streak */
      const totalStreak = data.data.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.streak
      }, 0)

      const sessionMinutes = data.data[data.currentDayIndex].value
      
      /* Update values */
      setData({
        today: data.today,
        bar: barDataset,
        heatmap: heatmapDataset,
        totalHoursOfWork,
        totalStreak,
        sessionMinutes
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
        <h3>Today</h3>
        <div className="card-content">
          <button onClick={() => setChartType('heatmap')} className="card-item">
            <span role="img" aria-label="fire streak">🔥</span>
            { sessionStreak }
          </button>

          <button onClick={() => setChartType('bar')} className="card-item">
            <span role="img" aria-label="fire streak">⏱️</span>
            { data.sessionMinutes }m
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Total</h3>
        <div className="card-content">
          <button onClick={() => setChartType('heatmap')} className="card-item">
            <span role="img" aria-label="fire streak">🔥</span>
            { data.totalStreak }
          </button>

          <button onClick={() => setChartType('bar')} className="card-item">
            <span role="img" aria-label="fire streak">⏱️</span>
            { data.totalHoursOfWork }h
          </button>
        </div>
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
                let classes = ''
                if (value.streak <= 3) classes = `color-${value.streak}`
                if (value.streak >= 4) classes = 'color-max'
                if (new Date(value.date).toString() === new Date(data.today).toString()) classes += ' today'
                return classes
              }}
              tooltipDataAttrs={value => {
                if (!value.date) return { 'data-tip': 'No streak' }
                return { 'data-tip': `${new Date(value.date).toDateString()} : Streak: ${value.streak}` }
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