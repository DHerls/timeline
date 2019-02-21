import React from 'react'
import api from '../../utilities/api'
import { Redirect } from 'react-router-dom'

class AddTimelineForm extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            value: '',
            success: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        api.post('/api/timelines/', {name: this.state.value}).then(
            (response) => {
                this.setState({success: true, newId: response.data.id});
            },
            (error) => {

            }
        );
        // Prevents the form from actually submitting and redirecting back to the page
        event.preventDefault();
    }

    render() {
        if (this.state.success){
            return (<Redirect to={'/timeline/' + this.state.newId.toString()} />);
        } else {
            return (
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Name:
                        <input type="text" value={this.state.value} onChange={this.handleChange} maxLength={255}/>
                    </label>
                    <input type="submit" value="Create Timeline"/>
                </form>
            )
        }
    }

}

export default AddTimelineForm;