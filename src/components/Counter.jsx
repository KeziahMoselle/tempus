import React, { Fragment } from 'react'

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
    <Fragment>
      <div className={`counter ${state}`} style={{borderWidth: borderWidth + 'px'}}></div>
      { state &&
        <h1 className="percentage">{ percentage }%</h1>
      }
      { !state &&
        <h1 className="percentage">{ Math.floor(total / 60) }m</h1>
      }
    </Fragment>
  )
}

const toPercentage = (seconds, total) => parseInt(Math.round((seconds / total * 100).toFixed(0)), 10)