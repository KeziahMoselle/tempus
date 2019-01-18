import React from 'react'
import Card from './Card'
import Streak from './Streak'
import Statistics from './Statistics'

export default ({ toggleCards, cardsClass, sessionStreak }) => (
  <div onClick={toggleCards} className={`cards ${cardsClass}`}>

    <Card
      title="Streak"
      icon="check_circle"
      color="green"
      sessionStreak={sessionStreak}
    >
      <Streak sessionStreak={sessionStreak} />
    </Card>

    <Card
      title="Statistics"
      icon="trending_up"
      color="blue"
    >
      <Statistics />
    </Card>

  </div>
)