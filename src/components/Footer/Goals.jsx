import React, { useState, useEffect } from 'react'

function Goals() {
  const [goals, setGoals] = useState([])

  const [hour, setHour] = useState(1)
  const [type, setType] = useState('day')

  const [isShow, setIsShow] = useState(false)

  useEffect(() => {
    window.ipcRenderer.send('getGoalsData')

    window.ipcRenderer.on('getGoalsData', (event, payload) => {
      setGoals(payload.reverse())
    })

    window.ipcRenderer.on('refreshGoals', () => {
      window.ipcRenderer.send('getGoalsData')
    })

    return () => {
      window.ipcRenderer.removeAllListeners('getGoalsData')
      window.ipcRenderer.removeAllListeners('refreshGoals')
    }
  }, [])

  function addGoal() {
    if (hour <= 0) return

    const isCreated = goals.findIndex(goal => {
      return goal.type === type && goal.value === hour * 60
    })
    if (isCreated !== -1) return

    window.ipcRenderer.send('addGoal', {
      value: hour * 60,
      type
    })

    // Hide input
    setIsShow(false)
  }

  function removeGoal(type, value) {
    window.ipcRenderer.send('removeGoal', {
      type,
      value
    })
  }

  function toggleAddGoalCard() {
    isShow ? setIsShow(false) : setIsShow(true)
  }

  return (
    <div className="goals">
      <button className="circle add" onClick={toggleAddGoalCard}>
        {isShow ? '⨯' : '+'}
      </button>

      <div
        className={`goals-add card flex space-between ${
          isShow ? 'show' : 'hide'
        }`}>
        <div className="flex valign">
          <label htmlFor="hour">Work</label>
          <input
            onChange={event => setHour(event.target.value)}
            value={hour}
            type="number"
            placeholder="1"
            min="0.1"
            step="0.1"></input>
          <span>hr</span>

          <label htmlFor="type">per</label>
          <select
            id="type"
            onChange={event => setType(event.target.value)}
            value={type}>
            <option value="day">day</option>
            <option value="week">week</option>
            <option value="month">month</option>
            <option value="year">year</option>
          </select>
        </div>

        <button className="circle counting" onClick={addGoal}>
          🗸
        </button>
      </div>

      {goals.length > 0 &&
        goals.map((goal, index) => (
          <div
            key={index}
            className={`card flex space-between ${
              goal.success ? 'success' : 'in-progress'
            }`}>
            <span>
              Work {goal.value / 60} hr per {goal.type}
            </span>
            <span className={goal.success ? 'success' : 'in-progress'}>
              {Math.round((goal.currentValue / goal.value) * 100)}%
            </span>
            <button
              className="circle"
              onClick={() => removeGoal(goal.type, goal.value)}>
              x
            </button>
          </div>
        ))}

      {goals.length === 0 && !isShow && (
        <div className="no-goals">
          <p className="etched">You do not have goals yet !</p>
          <p>Click the button on the left to create your first goal</p>
        </div>
      )}
    </div>
  )
}

export default Goals
