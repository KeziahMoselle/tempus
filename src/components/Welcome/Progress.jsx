import React from 'react'

function Progress ({ steps, currentStep }) {
  return (
    <h6 className="progress">{currentStep} / {steps}</h6>
  )
}

export default Progress