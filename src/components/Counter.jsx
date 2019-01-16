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
  } else {
    percentage = 0
  }

  const borderWidth = (percentage * 2.78) + 56 // 334px to fill (2.78 + 0.56)

  return (
    <>
      <div className={`counter ${state}`} style={{borderWidth: borderWidth + 'px'}}></div>
      { state &&
        <h1 className="percentage">{ percentage }%</h1>
      }
      { !state &&
        <h1 className="percentage">{ Math.floor(total / 60) }m</h1>
      }
    </>
  )
}

const toPercentage = (seconds, total) => {
  return Math.round((seconds / total * 100).toFixed(1))
}