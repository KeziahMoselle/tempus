import React, { useState, useEffect } from 'react'
import Chart from 'chart.js'

export default () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    window.ipcRenderer.send('getBarChartData')
    window.ipcRenderer.once('getBarChartData', (event, payload) => {
      setIsLoaded(true)
      new Chart('bar-chart', {
        type: 'bar',
        data: {
          datasets: [{
            label: 'Minutes of work',
            data: payload,
            backgroundColor: '#A1D6FF',
            hoverBackgroundColor: '#87CBFF',
            borderColor: '#6EC0FF',
            borderWidth: 2
          }]
        },
        options: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Minutes of work in the last 7 days'
          },
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
    <>
      { isLoaded &&
        <canvas id="bar-chart"></canvas>
      }

      { !isLoaded &&
        <h6>Loading ...</h6>
      }
    </>
  )

}