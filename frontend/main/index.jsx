import React from 'react';
import ReactDOM from 'react-dom';

class TestForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {value: 'Synced input'};
	    this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		this.setState({value: event.target.value});
	}

	render() {
		return (
			<label>
			Things:
			<input type="text" value={this.state.value} onChange={this.handleChange} />
			<p>{this.state.value}</p>
			</label>
		)
	}
}

ReactDOM.render(
  <TestForm />,
  document.getElementById('app')
);

module.hot.accept();
