import React, { useState, useEffect } from 'react'

function Goals () {
  const [goals, setGoals] = useState([])

  useEffect(() => {
    window.ipcRenderer.send('getGoalsData')
    window.ipcRenderer.once('getGoalsData', (event, payload) => {
      setGoals(payload)
      console.log(payload)
    })
  }, [])

  function addGoal () {

  }

  return (
    <div className="goals">
      { goals.length > 0 &&
        goals.map((goal, index) => (
          <div
            key={index}
            className={`card flex space-between ${goal.success ? 'success' : 'in-progress'}`}>
            <span>Work { goal.value / 60 } hr per { goal.type }</span>
            <span className={goal.success ? 'success' : 'in-progress'}>
              { Math.round(((goal.currentValue / goal.value)*100)) }%
            </span>
          </div>
        ))
      }
    </div>
  )
}

export default Goals