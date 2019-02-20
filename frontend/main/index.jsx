import React from 'react';
import ReactDOM from 'react-dom';

import routes from './routes'

// sidebarContent is required for the hours on the header and timeline to line up properly
ReactDOM.render(
	routes,
	document.getElementById('app')
);
