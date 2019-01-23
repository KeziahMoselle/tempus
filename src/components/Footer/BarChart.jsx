import React, { useEffect } from 'react'
import Chart from 'chart.js'

export default ({ data }) => {
  useEffect(() => {
    new Chart('bar-chart', {
      type: 'bar',
      data: {
        datasets: [{
          label: 'Minutes of work',
          data: data,
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
  }, [data])

  return <canvas id="bar-chart"></canvas>

}