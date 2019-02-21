import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import CustomTimeline from "./components/timeline";
import TimelineSelector from './components/timeline_selector'

const routes = (
    <Router>
        <div>
            <Route exact path="/" component={TimelineSelector} />
            <Route path="/timeline/:id" component={CustomTimeline} />
        </div>
    </Router>
);

export default routes;
