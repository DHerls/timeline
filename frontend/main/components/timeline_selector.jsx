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
        api.get('/api/timelines/').then(
            (result) => {
                console.log(result);
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
                return <ul>
                    {items.map(item => (
                        <li key={item.id}>
                            <Link to={'/timeline/' + item.id }>{item.name}</Link>
                        </li>
                    ))}
                </ul>
            }
        } else {
            return <p>Loading...</p>
        }
    }

}

export default TimelineSelector;