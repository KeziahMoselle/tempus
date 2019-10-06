import React, { Fragment, useState, useEffect } from 'react'

export default ({
  state,
  total, count,
  totalPause, countPause
}) => {
  const [format, setFormat] = useState('percentage')

  useEffect(() => {
    window.ipcRenderer.send('getCounterData')

    window.ipcRenderer.once('getCounterData', (event, data) => {
      setFormat(data)
    })
  }, [])

  let percentage
  let seconds
  if (state === 'counting') {
    seconds = count
    percentage = toPercentage(count, total)
  } else if (state === 'pausing') {
    seconds = countPause
    percentage = toPercentage(countPause, totalPause)
  } else {
    percentage = 0
  }

  function setPercentage() {
    setFormat('percentage')
    window.ipcRenderer.send('updateConfig', {
      format: 'percentage'
    })
  }

  function setNumeric() {
    setFormat('numeric')
    window.ipcRenderer.send('updateConfig', {
      format: 'numeric'
    })
  }

  function calculateSwapIconSpacing() {
    let secondaryTextWidth = 0
    if (typeof(document.getElementsByClassName("counter-display-secondary")[0]) !== "undefined") {
      secondaryTextWidth = document.getElementsByClassName("counter-display-secondary")[0].clientWidth
    }
    return ((window.innerWidth / 2) + (secondaryTextWidth / 2)) + 40
  }

  const borderWidth = (percentage * 2.78) + 56 // 334px to fill (2.78 + 0.56)

  return (
    <Fragment>
      <div className={`counter ${state}`} style={{ borderWidth: borderWidth + 'px' }}></div>
      <div onClick={() => format === 'percentage' ? setNumeric() : setPercentage()}>
        <div
          className={`counter-display counter-display-${format === 'percentage' ? 'main' : 'secondary'}`}>
          {percentage}%
        </div>
        <div
          className={`counter-display counter-display-${format === 'numeric' ? 'main' : 'secondary'}`}>
          {`${
            typeof(seconds) === 'undefined' ?
              `${Math.floor(total / 60)}m`
              : `${formatValue(seconds, total)}`
            }`}
        </div>
        <div
          className="counter-display counter-display-swap"
          style={{
            left: `${calculateSwapIconSpacing()}px`,
            transition: 'left 0.5s'
          }}>
          <i className="material-icons">swap_vert</i>
        </div>
      </div>
    </Fragment>
  )
}

const toPercentage = (seconds, total) => parseInt(Math.round((seconds / total * 100).toFixed(0)), 10)
const formatValue = (seconds, total) => {

  return (seconds > 60 ?
    Math.floor(seconds / 60).toFixed(0) + ":" + (seconds % 60).toString().padStart(2, '0') + "m" :
    seconds + "s")
}
