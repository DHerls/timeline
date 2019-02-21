import React from 'react';

import Timeline from 'react-calendar-timeline'
// make sure you include the timeline stylesheet or the timeline will not be styled
import 'react-calendar-timeline/lib/Timeline.css'
import moment from 'moment'
import api from '../../utilities/api'

const groups = [{ id: 1, title: 'group 1' }, { id: 2, title: 'group 2' }, { id: 3, title: 'group 3'}];


class CustomTimeline extends React.Component {

    constructor(props){
        super(props);
        this.dateStart = moment().set({year: 2019, month: 1, date: 14, hour: 0, minute:0, second:0});
        this.dateEnd = moment().set({year: 2019, month: 1, date: 18, hour: 23, minute:59, second:59});
        this.timestampStart = this.dateStart.valueOf();
        this.timestampEnd = this.dateEnd.valueOf();

        let items = [];
        for (let i = 0; i < 10; i++){
            let eventStart = moment(this.dateStart).add(Math.floor(Math.random() * 100 + 1), 'hour');
            items.push({
                id: i,
                group: (i % 3) + 1,
                title: 'item ' + i.toString(),
                start_time: eventStart,
                end_time: moment(eventStart).add(Math.floor(Math.random() * 4 + 1), 'hour')
            })
        }
        this.state = {isLoaded: false, error: '', items: items, id: props.match.params.id};

        this.onTimeChange = this.onTimeChange.bind(this);
    }

    componentDidMount() {
        console.log(this.props);
        api.get('/timelines/' + this.state.id).then(
            (response) => {
                this.setState({isLoaded: true, name: response.data.name})
            },
            (error) => {
                this.setState({isLoaded: true, error: error.message})
            }
        );
    }

    /**
     * Ensure the timeline does not scroll beyond the given start and end dates
     *
     * @param visibleTimeStart Start time the user is attempting to scroll to
     * @param visibleTimeEnd End time the user is attempting to scroll to
     * @param updateScrollCanvas Callback function for the start and end times
     */
    onTimeChange(visibleTimeStart, visibleTimeEnd, updateScrollCanvas) {
        if (visibleTimeStart < this.timestampStart && visibleTimeEnd > this.timestampEnd) {
            updateScrollCanvas(this.timestampStart, this.timestampEnd)
        } else if (visibleTimeStart < this.timestampStart) {
            updateScrollCanvas(this.timestampStart, this.timestampStart + (visibleTimeEnd - visibleTimeStart))
        } else if (visibleTimeEnd > this.timestampEnd) {
            updateScrollCanvas(this.timestampEnd - (visibleTimeEnd - visibleTimeStart), this.timestampEnd)
        } else {
            updateScrollCanvas(visibleTimeStart, visibleTimeEnd)
        }
    }

    render() {
        if (this.state.isLoaded) {
            if (this.state.error){
                return <p>Error loading timeline: { this.state.error }</p>
            }
            return <div>
                <h1>{ this.state.name }</h1>
                <Timeline
                    groups={groups}
                    items={this.state.items}
                    defaultTimeStart={this.dateStart}
                    defaultTimeEnd={this.dateEnd}
                    sidebarContent={<div>Above The Left</div>}
                    canMove={false}
                    canResize={false}
                    minZoom={5 * 60 * 1000}
                    maxZoom={7 * 24 * 60 * 60 * 1000}
                    onTimeChange={this.onTimeChange}
                    stackItems={true}
                />
            </div>
        }
        return <p>Loading timeline...</p>
    }
}

export default CustomTimeline;