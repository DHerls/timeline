import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import CustomTimeline from "./components/timeline";
import TimelineSelector from './components/timeline_selector'
import AddTimelineForm from "./components/add_timeline";

const routes = (
    <Router>
        <Switch>
            <Route exact path="/" component={TimelineSelector} />
            <Route exact path="/timeline/add" component={AddTimelineForm} />
            <Route path="/timeline/:id" component={CustomTimeline} />
        </Switch>
    </Router>
);

export default routes;
