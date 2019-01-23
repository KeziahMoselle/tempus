import React, { useState, useEffect } from 'react'

import BarChart from './BarChart'
import HeatmapChart from './HeatmapChart'

import './heatmap.css'

export default ({ sessionStreak }) => {
  const [data, setData] = useState({
    bar: null,
    heatmap: null
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

      let todayStreak = 0
      let sessionMinutes = 0
      if (data.data[data.currentDayIndex]) {
        todayStreak = data.data[data.currentDayIndex].streak
        sessionMinutes = data.data[data.currentDayIndex].value
      }

      /* Update values */
      setData({
        today: data.today,
        bar: barDataset,
        heatmap: heatmapDataset,
        totalHoursOfWork,
        totalStreak,
        todayStreak,
        sessionMinutes
      })
    })
  }, [])
  
  return (
    <div className="statistics-container">

      <div className="cards">
        <div className="card">
          <h3>Today</h3>
          <p className="card-item">
            <span role="img" aria-label="fire streak">🔥</span>
            { sessionStreak }
          </p>

          <p className="card-item">
            <span role="img" aria-label="fire streak">⏱️</span>
            { data.sessionMinutes }m
          </p>
        </div>

        <div className="card">
          <h3>Total</h3>
          <p className="card-item">
            <span role="img" aria-label="fire streak">🔥</span>
            { data.totalStreak }
          </p>

          <p className="card-item">
            <span role="img" aria-label="fire streak">⏱️</span>
            { data.totalHoursOfWork }h
          </p>
        </div>
      </div>

      <div className="chart-container">

        <div className="center">
          <button
            onClick={() => setChartType('bar')}
            className={`card-item ${chartType === 'bar' ? 'active' : ''}`}>
            Week
          </button>
          
          <button
            onClick={() => setChartType('heatmap')}
            className={`card-item ${chartType === 'heatmap' ? 'active' : ''}`}>
            Months
          </button>
        </div>

        { chartType === 'bar' &&
          <BarChart data={data.bar} />
        }

        { chartType === 'heatmap' &&
          <HeatmapChart data={data.heatmap} />
        }
      </div>

      { (!data.bar || !data.heatmap) &&
        <div className="circle-ripple"></div>
      }

    </div>
  )
}