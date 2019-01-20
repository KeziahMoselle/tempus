import React, { Component } from 'react'
import { ResponsiveCalendar } from '@nivo/calendar'

class Streak extends Component {

	state = {
		data: undefined
	}

	componentDidMount () {
		window.ipcRenderer.send('getStreak')
		window.ipcRenderer.once('getStreak', (event, streakData) => {
			this.setState({ data: streakData })
		})
	}

	render() {
		return (
			<div style={{ height: 150 + 'px' }}>
				<ResponsiveCalendar
					data={[
						{
							"day": "2019-01-20",
							"value": 60
						}
					]}
					from="2019-01-01"
					to="2019-12-31"
					emptyColor="#eeeeee"
					colors={[
						"#61cdbb",
						"#97e3d5",
						"#e8c1a0",
						"#f47560"
					]}
					margin={{
						"top": 30,
						"right": 0,
						"bottom": 30,
						"left": 0
					}}
					monthBorderWidth={6}
					monthBorderColor="#ffffff"
					dayBorderWidth={2}
					dayBorderColor="#ffffff"
				/>
			</div>
		)
	}
}

export default Streak
