import React from 'react'

export default ({
  isCounting, isPause,
  total, count,
  totalPause, countPause
}) => {
  let percentage
  if (isCounting) {
    percentage = (count / total * 100).toFixed(1)
  } else if (isPause) {
    percentage = (countPause / totalPause * 100).toFixed(1)
  }

  return (
    <div className="counter">
      { (isCounting || isPause) &&
        <h1 className="mono">{percentage}%</h1>
      }
      { (!isCounting && !isPause) &&
        <h1 className="mono">{ Math.floor(total / 60) }m</h1>
      }
    </div>
  )
}