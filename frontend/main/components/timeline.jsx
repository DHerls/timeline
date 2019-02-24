import React from 'react';

import Timeline from 'react-calendar-timeline'
// make sure you include the timeline stylesheet or the timeline will not be styled
import 'react-calendar-timeline/lib/Timeline.css'
import moment from 'moment'
import api from '../../utilities/api'


class CustomTimeline extends React.Component {

    constructor(props){
        super(props);
        this.dateStart = moment().set({year: 2019, month: 1, date: 14, hour: 0, minute:0, second:0});
        this.dateEnd = moment().set({year: 2019, month: 1, date: 18, hour: 23, minute:59, second:59});
        this.timestampStart = this.dateStart.valueOf();
        this.timestampEnd = this.dateEnd.valueOf();

        this.state = {
            isLoaded: false, error: '', groups:[], items: [], id: props.match.params.id,
            mode: '',
            updatingEvent: {
                id: '',
                title: '',
                start: '',
                end: ''
            }
        };

        this.onTimeChange = this.onTimeChange.bind(this);
        this.onCanvasDoubleClick = this.onCanvasDoubleClick.bind(this);
        this.onValueChange = this.onValueChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    componentDidMount() {
        api.get('/timelines/' + this.state.id).then(
            (response) => {
                this.setState({isLoaded: true, name: response.data.name})
            },
            (error) => {
                this.setState({isLoaded: true, error: error.message})
            }
        );
        api.get('/timelines/' + this.state.id + '/event-types/').then(
            (response) => {
                const groups = response.data.map((item) => {
                    return {
                        id: 'ET' + item.event_type_id,
                        title: item.name,
                        color_primary: item.color_primary,
                        color_secondary: item.color_secondary
                    }
                });
                this.setState({isLoaded: true, groups: groups})
            },
            (error) => {
                this.setState({isLoaded: true, error: error.message})
            }
        );
        api.get('/timelines/' + this.state.id + '/events/').then(
            (response) => {
                const items = response.data.map((item) => {
                    return {
                        id: item.id,
                        group: 'ET' + item.type,
                        title: item.title,
                        start_time: moment(item.time_start).valueOf(),
                        end_time: moment(item.time_end).valueOf(),
                    }
                });
                this.setState({isLoaded: true, items: items})
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

    onCanvasDoubleClick(group, time, e) {
        const { items, nextId } = this.state;
        // Everything is immutable
        let newItems = [].concat(items);
        const start = moment(time);
        const end = moment(time + 1000 * 60 * 60);
        newItems.push({id: 'temp', group: group, title: "New Event", start_time: start.valueOf(), end_time: end.valueOf()});
        this.setState({items: newItems, nextId: nextId + 1, mode: 'add', updatingEvent: {
                id: 'temp',
                title: 'New Event',
                start: start.format('Y-MM-DD HH:mm'),
                end: end.format('Y-MM-DD HH:mm'),
                event_type: group.slice(2)
            }});
    }

    onValueChange(event){
        const { updatingEvent } = this.state;
        let newEvent = {...updatingEvent};
        newEvent[event.target.name] = event.target.value;
        this.setState({updatingEvent: newEvent})
    }

    onFormSubmit(event){
        event.preventDefault();
        api.post('/timelines/' + this.state.id + '/events/', {
            type: this.state.updatingEvent.event_type,
            time_start: this.state.updatingEvent.start,
            time_end: this.state.updatingEvent.end,
            title: this.state.updatingEvent.title,
        }).then(
            (response) => {
                const { items } = this.state;
                let newItems = items.filter(item => item.id !== 'temp');
                newItems.push({
                        id: response.data.id,
                        title: response.data.title,
                        start_time: moment(response.data.time_start).valueOf(),
                        end_time: moment(response.data.time_end).valueOf(),
                        group: 'ET' + response.data.type,
                    }
                );
                this.setState({items: newItems });
            }
        );
    }

    render() {
        if (this.state.isLoaded) {
            if (this.state.error){
                return <p>Error loading timeline: { this.state.error }</p>
            }
            return <div>
                <h1>{ this.state.name }</h1>
                <Timeline
                    groups={this.state.groups}
                    items={this.state.items}
                    defaultTimeStart={this.dateStart}
                    defaultTimeEnd={this.dateEnd}
                    sidebarContent={<div>Above The Left</div>}
                    canMove={false}
                    canResize={false}
                    minZoom={5 * 60 * 1000}
                    maxZoom={7 * 24 * 60 * 60 * 1000}
                    stackItems={true}
                    onTimeChange={this.onTimeChange}
                    onCanvasDoubleClick={this.onCanvasDoubleClick}
                />
                {(this.state.mode === 'add' || this.state.mode === 'update') &&
                    <form onSubmit={this.onFormSubmit}>
                        <label>Event Name: <input type={'text'} name='title' value={this.state.updatingEvent.title} onChange={this.onValueChange}/></label>
                        <label>Event Start: <input type={'text'} name='start' value={this.state.updatingEvent.start} onChange={this.onValueChange}/></label>
                        <label>Event End: <input type={'text'} name='end' value={this.state.updatingEvent.end} onChange={this.onValueChange}/></label>
                        <button type={'submit'}>{this.state.mode === 'add' ? 'Add' : 'Update'} Event</button>
                    </form>
                }
            </div>
        }
        return <p>Loading timeline...</p>
    }
}

export default CustomTimeline;