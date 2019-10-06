import React, { useState, useEffect } from 'react'

import BarChart from './BarChart'
import HeatmapChart from './HeatmapChart'
import Goals from './Goals'

import './heatmap.css'

export default ({ sessionStreak }) => {
  const [data, setData] = useState({
    totalHoursOfWork: null,
    totalStreak: null,
    todayStreak: null,
    todayMinutes: null
  })
  const [chartType, setChartType] = useState('bar')

  /**
   * Get data from the store
   */

  useEffect(() => {
    window.ipcRenderer.send('getData')
    window.ipcRenderer.once('getData', (event, payload) => {
      setData({
        totalHoursOfWork: payload.totalHoursOfWork,
        totalStreak: payload.totalStreak,
        todayStreak: payload.todayStreak,
        todayMinutes: payload.todayMinutes
      })
    })
  }, [])

  return (
    <div className="statistics-container">
      <div className="cards">
        <div className="card">
          <h3>Today</h3>
          <p className="card-item">
            <span role="img" aria-label="fire streak">
              🔥
            </span>
            {data.todayStreak}
          </p>

          <p className="card-item">
            <span role="img" aria-label="fire streak">
              ⏱️
            </span>
            {data.todayMinutes}m
          </p>
        </div>

        <div className="card">
          <h3>Total</h3>
          <p className="card-item">
            <span role="img" aria-label="fire streak">
              🔥
            </span>
            {data.totalStreak}
          </p>

          <p className="card-item">
            <span role="img" aria-label="fire streak">
              ⏱️
            </span>
            {data.totalHoursOfWork}h
          </p>
        </div>
      </div>

      <div className="chart-container">
        <div className="center">
          <button
            onClick={() => setChartType('bar')}
            className={chartType === 'bar' ? 'selected' : ''}>
            Week
          </button>

          <button
            onClick={() => setChartType('heatmap')}
            className={chartType === 'heatmap' ? 'selected' : ''}>
            Months
          </button>

          <button
            onClick={() => setChartType('Goals')}
            className={chartType === 'Goals' ? 'selected' : ''}>
            Goals
          </button>
        </div>

        {chartType === 'bar' && <BarChart />}

        {chartType === 'heatmap' && <HeatmapChart />}

        {chartType === 'Goals' && <Goals />}
      </div>
    </div>
  )
}
