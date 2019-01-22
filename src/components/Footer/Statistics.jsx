import React, { useState, useEffect } from 'react'
import Chart from 'chart.js'

export default () => {
  const [isLoaded, setIsLoaded] = useState(false)
  useEffect(() => {
    window.ipcRenderer.send('getData')
    window.ipcRenderer.once('getData', (event, storeData) => {
      const dataset = storeData.map(object => ({
        x: object.day,
        y: object.value
      }))
      setIsLoaded(true)
      console.log(dataset)
      new Chart('bar-chart', {
        type: 'bar',
        data: {
          datasets: [{
            label: 'Minutes of work',
            data: [{
              x: new Date('2019-01-20'),
              y: 25
            }, {
              x: new Date('2019-01-21'),
              y: 50
            }, {
              x: new Date('2019-01-22'),
              y: 30
            }],
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
    <>
      {
        isLoaded &&
        <canvas id="bar-chart"></canvas>
      }

      { !isLoaded &&
        <div className="circle-ripple"></div>
      }
    </>
  )
}