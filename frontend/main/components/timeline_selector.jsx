import React from 'react'
import { Link } from 'react-router-dom'
import api from '../../utilities/api'

class TimelineSelector extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            isLoaded: false,
            error: '',
            items: []
        }
    }

    componentDidMount() {
        api.get('/timelines/').then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    items: result.data
                });
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )
    }

    render() {
        const { error, isLoaded, items } = this.state;
        if (isLoaded){
            if (error) {
                return <p>Error: {error.message}</p>
            } else {
                return <div>
                    <h1>List of Timelines</h1>
                    <ul>
                        {items.map(item => (
                            <li key={item.id}>
                                <Link to={'/timeline/' + item.id }>{item.name}</Link>
                            </li>
                        ))}
                    </ul>
                    <Link to={'/timeline/add'}>Create New Timeline</Link>
                    </div>
            }
        } else {
            return <p>Loading...</p>
        }
    }

}

export default TimelineSelector;