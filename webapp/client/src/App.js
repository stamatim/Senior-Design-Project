import React, { Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './components/home';
import Inventory from './components/inventory';
import Metrics from './components/metrics';
import Fleet from './components/fleet';
import NotFound from './components/contants/notFound';
import login from './components/login'

function App() {
	return (
		<Fragment>
			<Router>
				<Switch>
					<Route exact path='/' component={Home} />
					<Route exact path='/login' component={login} />
					<Route exact path='/metrics' component={Metrics} />
					<Route exact path='/inventory' component={Inventory} />
					<Route exact path='/fleet' component={Fleet} />
					<Route component={NotFound} />
				</Switch>
			</Router>
		</Fragment>
	);
}

export default App;
