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
    <div className={`card ${isExtended}`}>
      <header onClick={ toggleCard } className={ color }>
        <h2>{ title }</h2>
        <i className="material-icons">{ icon }</i>
      </header>
      <main onClick={(e) => e.stopPropagation()}>
        <Suspense fallback={<p>Loading...</p>}>
          <LazyComponent />
        </Suspense>
      </main>
    </div>
  )
}
