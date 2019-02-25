import React from 'react';

import Timeline from 'react-calendar-timeline'
import Select from 'react-select'
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
            },
            eventTypes: [],
            backupItem: {}
        };

        this.onTimeChange = this.onTimeChange.bind(this);
        this.onCanvasDoubleClick = this.onCanvasDoubleClick.bind(this);
        this.onValueChange = this.onValueChange.bind(this);
        this.onItemSelect = this.onItemSelect.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
        this.backupItem = this.backupItem.bind(this);
        this.restoreItem = this.restoreItem.bind(this);
        this.updateItem = this.updateItem.bind(this);
    }

    removeItem(id){
        const { items } = this.state;
        let newItems = items.filter(item => item.id !== id);
        this.setState({items: newItems});
    }

    backupItem(id){
        const item = this.state.items.find(i => i.id === id);
        this.setState({backupItem: item});
    }

    restoreItem(){
        if (this.state.backupItem){
            let newItems = this.state.items.filter(item => item.id !== this.state.backupItem.id);
            newItems.push(this.state.backupItem);
            this.setState({items: newItems, backupItem: {}});
        }
    }

    /**
     * Applies the changes in the updatingItem to the item in the timeline
     */
    updateItem(){
        if (this.state.updatingEvent) {
            const start = moment(this.state.updatingEvent.start);
            const end = moment(this.state.updatingEvent.end);
            if (start.isValid() && end.isValid()){
                let newItems = this.state.items.filter(item => item.id !== this.state.updatingEvent.id);
                newItems.push({
                    id: this.state.updatingEvent.id,
                    start_time: start.valueOf() + 100000,
                    end_time: end.valueOf(),
                    title: this.state.updatingEvent.title,
                    group: 'ET' + this.state.updatingEvent.event_type
                });
                this.setState({items: newItems});
            }
        }
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
                const eventTypes = response.data.map((item) => {
                    return {
                        value: item.event_type_id,
                        label: item.name,
                    }
                });
                this.setState({isLoaded: true, groups: groups, eventTypes})
            },
            (error) => {
                this.setState({isLoaded: true, error: error.message})
            }
        );
        api.get('/timelines/' + this.state.id + '/events/').then(
            (response) => {
                const items = response.data.map(this.apiToTimeline);
                this.setState({isLoaded: true, items: items})
            },
            (error) => {
                this.setState({isLoaded: true, error: error.message})
            }
        );
    }

    apiToTimeline(data){
        return {
            id: data.id,
            group: 'ET' + data.type,
            title: data.title,
            start_time: moment(data.time_start).valueOf(),
            end_time: moment(data.time_end).valueOf(),
        }
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

    cancelEdit(){
        if (this.state.mode === 'add') {
            this.removeItem('temp');
        } else {
            this.restoreItem();
        }
        this.setState({mode: ''});
    }

    onItemSelect(itemId, e, time) {
        if (itemId === 'temp'){
            return;
        }
        const item = this.state.items.find((item) => item.id === itemId);
        this.backupItem(itemId);
        this.setState({mode: 'update', updatingEvent: {
                id: itemId,
                title: item.title,
                start: moment(item.start_time).format('Y-MM-DD HH:mm'),
                end: moment(item.end_time).format('Y-MM-DD HH:mm'),
                event_type: item.group.slice(2),
            }})
    }

    onValueChange(event){
        const { updatingEvent } = this.state;
        let newEvent = {...updatingEvent};
        newEvent[event.target.name] = event.target.value;
        this.setState({updatingEvent: newEvent}, this.updateItem);
    }

    onFormSubmit(event){
        event.preventDefault();
        const { updatingEvent } = this.state;
        if (this.state.mode === 'add'){
            api.post('/timelines/' + this.state.id + '/events/', {
                type: updatingEvent.event_type,
                time_start: updatingEvent.start,
                time_end: updatingEvent.end,
                title: updatingEvent.title,
            }).then(
                (response) => {
                    const { items } = this.state;
                    let newItems = items.filter(item => item.id !== 'temp');
                    newItems.push(this.apiToTimeline(response.data));
                    this.setState({items: newItems });
                }
            );
        } else {
            api.put('/timelines/' + this.state.id + '/events/' + updatingEvent.id + '/', {
                type: updatingEvent.event_type,
                time_start: updatingEvent.start,
                time_end: updatingEvent.end,
                title: updatingEvent.title,
            }).then(
                (response) => {
                    const { items } = this.state;
                    let newItems = items.filter(item => item.id !== updatingEvent.id);
                    newItems.push(this.apiToTimeline(response.data));
                    this.setState({items: newItems });
                },
                (error) => {
                    console.log(error)
                }
            );
        }
    }

    handleChange(newValue, actionMeta) {
        const { updatingEvent } = this.state;
        updatingEvent.event_type = newValue.value;
        this.setState({ updatingEvent }, this.updateItem);
    }

    itemRenderer({
                     item,
                     itemContext,
                     getItemProps,
                     getResizeProps
                 }) {
        const {left: leftResizeProps, right: rightResizeProps} = getResizeProps();
        return (
            <div {...getItemProps(item.itemProps)}>
                {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : ''}

                <div
                    className="rct-item-content"
                    style={{maxHeight: `${itemContext.dimensions.height}`}}
                >
                    {item.title}
                </div>

                {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : ''}
            </div>
        )
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
                    itemRenderer={this.itemRenderer}
                    defaultTimeStart={this.dateStart}
                    defaultTimeEnd={this.dateEnd}
                    sidebarContent={<div>Above The Left</div>}
                    canMove={false}
                    canResize={false}
                    minZoom={5 * 60 * 1000}
                    maxZoom={7 * 24 * 60 * 60 * 1000}
                    stackItems={true}
                    onTimeChange={this.onTimeChange}
                    onCanvasClick={this.cancelEdit}
                    onCanvasDoubleClick={this.onCanvasDoubleClick}
                    onItemSelect={this.onItemSelect}
                />
                {(this.state.mode === 'add' || this.state.mode === 'update') &&
                    <form onSubmit={this.onFormSubmit}>
                        <label>Event Name: <input type={'text'} name='title' value={this.state.updatingEvent.title} onChange={this.onValueChange}/></label>
                        <label>Event Start: <input type={'text'} name='start' value={this.state.updatingEvent.start} onChange={this.onValueChange}/></label>
                        <label>Event End: <input type={'text'} name='end' value={this.state.updatingEvent.end} onChange={this.onValueChange}/></label>
                        <Select options={this.state.eventTypes} value={this.state.eventTypes.find(item => item.value === this.state.updatingEvent.event_type)} onChange={this.handleChange} />
                        <button type={'submit'}>{this.state.mode === 'add' ? 'Add' : 'Update'} Event</button>
                        <button onClick={this.cancelEdit}>Cancel</button>
                    </form>
                }
            </div>
        }
        return <p>Loading timeline...</p>
    }
}

export default CustomTimeline;