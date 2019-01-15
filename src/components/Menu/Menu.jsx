import React from 'react'
import Card from './Card'

export default ({ toggleCards, cardsClass }) => (
  <div onClick={toggleCards} className={`cards ${cardsClass}`}>

    <Card
      title="Streak"
      icon="check_circle"
      color="green"
      component="Streak"
    />

    <Card
      title="Statistics"
      icon="trending_up"
      color="blue"
      component="Statistics"
    />

  </div>
)