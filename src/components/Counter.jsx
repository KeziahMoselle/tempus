import React from 'react'

export default ({
  state,
  total, count,
  totalPause, countPause
}) => {
  let percentage
  if (state === 'counting') {
    percentage = toPercentage(count, total)
  } else if (state === 'pausing') {
    percentage = toPercentage(countPause, totalPause)
  }

  return (
    <div className={`counter ${state}`}>
      { state &&
        <h1 className="mono">{ percentage }%</h1>
      }
      { !state &&
        <h1 className="mono">{ Math.floor(total / 60) }m</h1>
      }
    </div>
  )
}

const toPercentage = (seconds, total) => {
  return (seconds / total * 100).toFixed(1)
}