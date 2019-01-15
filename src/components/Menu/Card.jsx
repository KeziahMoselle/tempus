import React, { useState } from 'react'

export default ({ title, icon, color }) => {

  const [isExtended, setIsExtended] = useState(false)

  const toggleCard = (event) => {
    event.stopPropagation()

    if (isExtended) {
      setIsExtended(false)
    } else {
      setIsExtended('extended')
    }
  }

  return (
    <div onClick={ toggleCard } className={`card ${isExtended}`}>
      <header className={ color }>
        <h2>{ title }</h2>
        <i className="material-icons">{ icon }</i>
      </header>
      <main>
        <p>
          lorem ipsum dolor sit ametlorem ipsum dolor sit ametlorem ipsu
        </p>
      </main>
    </div>
  )
}