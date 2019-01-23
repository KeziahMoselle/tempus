import React from 'react'
import CalendarHeatmap from 'react-calendar-heatmap'
import ReactTooltip from 'react-tooltip'

export default ({ data }) => (
    <>
      <CalendarHeatmap
        startDate={new Date('2019-01-01')}
        endDate={new Date('2019-04-30')}
        showWeekdayLabels={true}
        values={data}
        classForValue={value => {
          if (!value) return 'color-empty'
          let classes = ''
          if (value.streak <= 3) classes = `color-${value.streak}`
          if (value.streak >= 4) classes = 'color-max'
          if (new Date(value.date).toString() === new Date(data.today).toString()) classes += ' today'
          return classes
        }}
        tooltipDataAttrs={value => {
          if (!value.date) return { 'data-tip': 'No streak' }
          return { 'data-tip': `${new Date(value.date).toDateString()} : Streak: ${value.streak}` }
        }}
      />
      <ReactTooltip />
    </>
)