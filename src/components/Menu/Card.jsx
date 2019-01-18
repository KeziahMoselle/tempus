import React, { useState } from 'react'

export default ({ title, icon, color, children }) => {

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
    <div className={`card ${isExtended}`}>
      <header onClick={ toggleCard } className={ color }>
        <h2>{ title }</h2>
        <i className="material-icons">{ icon }</i>
      </header>
      <main onClick={(e) => e.stopPropagation()}>
        {children}
      </main>
    </div>
  )
}
