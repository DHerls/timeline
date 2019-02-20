import React from 'react';
import ReactDOM from 'react-dom';

import Timeline from 'react-calendar-timeline'
// make sure you include the timeline stylesheet or the timeline will not be styled
import 'react-calendar-timeline/lib/Timeline.css'
import moment from 'moment'

const dateStart = moment().set({year: 2019, month: 1, date: 14, hour: 0, minute:0, second:0});
const dateEnd = moment().set({year: 2019, month: 1, date: 18, hour: 23, minute:59, second:59});
const timestampStart = dateStart.valueOf();
const timestampEnd = dateEnd.valueOf();

const groups = [{ id: 1, title: 'group 1' }, { id: 2, title: 'group 2' }];

const items = [
	{
		id: 1,
		group: 1,
		title: 'item 1',
		start_time: moment(),
		end_time: moment().add(1, 'hour')
	},
	{
		id: 2,
		group: 2,
		title: 'item 2',
		start_time: moment().add(-0.5, 'hour'),
		end_time: moment().add(0.5, 'hour')
	},
	{
		id: 3,
		group: 1,
		title: 'item 3',
		start_time: moment().add(2, 'hour'),
		end_time: moment().add(3, 'hour')
	}
];

function onTimeChange(visibleTimeStart, visibleTimeEnd, updateScrollCanvas) {
	if (visibleTimeStart < timestampStart && visibleTimeEnd > timestampEnd) {
		updateScrollCanvas(timestampStart, timestampEnd)
	} else if (visibleTimeStart < timestampStart) {
		updateScrollCanvas(timestampStart, timestampStart + (visibleTimeEnd - visibleTimeStart))
	} else if (visibleTimeEnd > timestampEnd) {
		updateScrollCanvas(timestampEnd - (visibleTimeEnd - visibleTimeStart), timestampEnd)
	} else {
		updateScrollCanvas(visibleTimeStart, visibleTimeEnd)
	}
}

// sidebarContent is required for the hours on the header and timeline to line up properly
ReactDOM.render(
	<div>
		Rendered by react!
		<Timeline
			groups={groups}
			items={items}
			defaultTimeStart={dateStart}
			defaultTimeEnd={dateEnd}
			sidebarContent={<div>Above The Left</div>}
			canMove={false}
			canResize={false}
			minZoom={5 * 60 * 1000}
			maxZoom={7 * 24 * 60 * 60 * 1000}
			onTimeChange={onTimeChange}
		/>
	</div>,
	document.getElementById('app')
);
