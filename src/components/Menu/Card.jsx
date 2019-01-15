import React, { useState, Suspense } from 'react'

export default ({ title, icon, color, component }) => {

  const [isExtended, setIsExtended] = useState(false)

  const toggleCard = (event) => {
    event.stopPropagation()

    if (isExtended) {
      setIsExtended(false)
    } else {
      setIsExtended('extended')
    }
  }

  const LazyComponent = React.lazy(() => import(`./${component}`))

  return (
    <div onClick={ toggleCard } className={`card ${isExtended}`}>
      <header className={ color }>
        <h2>{ title }</h2>
        <i className="material-icons">{ icon }</i>
      </header>
      <main>
        <Suspense fallback={<p>Loading...</p>}>
          <LazyComponent />
        </Suspense>
      </main>
    </div>
  )
}
