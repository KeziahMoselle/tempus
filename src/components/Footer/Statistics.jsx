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