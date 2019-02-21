import React from 'react';
import { Route, BrowserRouter as Router, Switch, Link } from 'react-router-dom';
import CustomTimeline from "./components/timeline";
import TimelineSelector from './components/timeline_selector'
import AddTimelineForm from "./components/add_timeline";

const routes = (
    <Router>
        <div>
            conso<Link to={'/'}>List of Timelines</Link>
            <Link to={'/timeline/add'}>Add new timeline</Link>
            <Switch>
                <Route exact path="/" component={TimelineSelector} />
                <Route exact path="/timeline/add" component={AddTimelineForm} />
                <Route path="/timeline/:id" component={CustomTimeline} />
            </Switch>
        </div>
    </Router>
);

export default routes;
