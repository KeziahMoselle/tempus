import React, { useState } from 'react'
import Progress from './Progress'
import './index.css'

function Welcome ({ finishedWelcome, quit }) {
  const [step, setStep] = useState(0)
  const maxStep = 7

  function decrementStep () {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  function incrementStep () {
    if (step < maxStep) {
      setStep(step + 1)
    }
  }

  const stepView = [
    <div>
      <h3 style={{ marginBottom: '6px' }}>Welcome <span role="img" aria-label="wave emoji">👋</span></h3>
      <p>Want to discover the great features ?</p>
      <div style={{ marginTop: '18px', justifyContent: 'space-evenly' }} className="flex valign">
        <a href="#!" className="sub-action" onClick={incrementStep}>Discover</a>
        <a href="#!" onClick={finishedWelcome}>or Skip</a>
      </div>
    </div>,

    <div className="center column valign">
      <h6>Want to work 27 min ? You can.</h6>
      <img src="./assets/welcome/1.png" alt="preview"></img>
    </div>,

    <div className="center column valign">
      <h6>Want to work until 2 PM ?</h6>
      <p><b>Note:</b> It will revert your settings after the timer.</p>
      <img src="./assets/welcome/2.png" alt="preview"></img>
    </div>,

    <div className="center column valign">
      <h6>Want to work at least 1 hour a day ? You can create goals for that.</h6>
      <img src="./assets/welcome/3.png" alt="preview"></img>
    </div>,

    <div className="center column valign">
      <h6><span role="img" aria-label="fire streak">🔥</span> It counts how many times you finished a pomodoro.</h6>
      <img src="./assets/welcome/4.png" alt="preview"></img>
    </div>,

    <div className="center column valign">
      <h6>It gives you insights about your productivity.</h6>
      <img src="./assets/welcome/5.gif" alt="preview"></img>
    </div>,

    <div className="center column valign">
      <h6>If set, it will automatically stop the pomodoro after `x` times.</h6>
      <img src="./assets/welcome/6.png" alt="preview"></img>
    </div>,

    <div className="center column valign">
      <h3 style={{
        position: 'absolute',
        zIndex: '1'
      }}>Be productive <span role="img" aria-label="heart emoji">❤️</span></h3>
      <img src="./assets/welcome/cat.svg" alt="Thank's" style={{
        height: '160px',
        filter: 'brightness(40%)',
        margin: '0'
      }}></img>
    </div>
  ]

  return (
    <div className="welcome container">
      <div className="titlebar">
        <div className="streak">
          <span role="img" aria-label="wave emoji">🍝</span>
        </div>

        <div className="controls">
          <i onClick={() => window.ipcRenderer.send('win-minimize')} className="material-icons">remove</i>
          <i onClick={quit} className="material-icons danger">close</i>
        </div>
      </div>

      <main>
        {stepView[step]}
      </main>
      
      <footer>
        <button onClick={decrementStep}>Prev</button>

        <Progress steps={maxStep} currentStep={step} />

        <button onClick={step < maxStep ? incrementStep : finishedWelcome}>
          {step < maxStep ? 'Next' : 'Start'}
        </button>
      </footer>
    </div>
  )
}

export default Welcome