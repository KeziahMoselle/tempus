import React, { Fragment, useState, useEffect } from 'react'

export default ({
  state,
  total, count,
  totalPause, countPause
}) => {
  const [format, setFormat] = useState('percentage')
  const [toggleFormat, setToggleFormat] = useState(false)

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

  const borderWidth = (percentage * 2.78) + 56 // 334px to fill (2.78 + 0.56)

  return (
    <Fragment>
      <div className={`counter ${state}`} style={{ borderWidth: borderWidth + 'px' }}></div>
      {state &&
        <h1
          className="percentage"
          onClick={() => setToggleFormat(!toggleFormat)}>
          {`${
            format === 'percentage' ?
              `${percentage}%`
              : `${formatValue(seconds, total)}`
            }`}
        </h1>
      }
      {!state &&
        <h1
          className="percentage"
          onClick={() => setToggleFormat(!toggleFormat)}>
          {Math.floor(total / 60)}m
        </h1>
      }
      <div style={{
        position: 'absolute',
        marginLeft: toggleFormat ? '140px' : '0',
        opacity: toggleFormat ? '1' : '0',
        zIndex: '2',
        marginTop: '10px',
        transition: 'transform 0.3s, opacity 0.3s, margin-left 0.3s'
      }}>
        <p
          className={`sub-action ${format === 'percentage' ? 'active' : null}`}
          onClick={() => toggleFormat ? setPercentage() : null}
          style={{
            padding: '8px',
            width: '32px',
            textAlign: 'center'
          }}>
          %
        </p>
        <p
          className={`sub-action ${format === 'numeric' ? 'active' : null}`}
          onClick={() => toggleFormat ? setNumeric() : null}
          style={{
            padding: '8px',
            width: '32px',
            textAlign: 'center'
          }}>
          num
        </p>
      </div>
    </Fragment>
  )
}

const toPercentage = (seconds, total) => parseInt(Math.round((seconds / total * 100).toFixed(0)), 10)
const formatValue = (seconds, total) => {

  return (seconds > 60 ?
    (seconds / 60).toFixed(0) + ":" + (seconds % 60).toString().padStart(2, '0') + "m" :
    seconds + "s")
}
