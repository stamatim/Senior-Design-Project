import React, { Component } from 'react';
import Nav from './contants/nav';
import { Link } from 'react-router-dom';
import Inventory from '../logo/inventory.png'
import Metrics from '../logo/metrics.png'
import Fleet from '../logo/fleet.png'

export default class home extends Component {
	render() {
		return (
			<div>
				<Nav />
				<div className='container'>
					<div className='row home-cards'>
						<div className='col-4'>
							<div className='shadow-sm p-3 m-1 bg-white rounded' style={{width: '18rem'}}>
								<img className="card-img-top" src={Metrics} alt="Card image cap"/>
								<div className="card-body">
									<h5 className="card-title">Metrics</h5>
									<p className="card-text">View information regarding overall warehouse metrics and inventory state.</p>
									<Link NavLink to='/metrics'>
										<button className='btn nav-button'>
											Metrics
										</button>
									</Link>
								</div>
							</div>
						</div>
						<div className='col-4'>
							<div className='shadow-sm p-3 m-1 bg-white rounded' style={{width: '18rem'}}>
								<img className="card-img-top" src={Inventory} alt="Card image cap"/>
								<div className="card-body">
									<h5 className="card-title">Inventory</h5>
									<p className="card-text">View information regarding items that have been scanned into the warehouse inventory.</p>
									<Link NavLink to='/inventory'>
										<button className='btn nav-button'>
											Inventory
										</button>
									</Link>
								</div>
							</div>
						</div>
						<div className='col-4'>
							<div className='shadow-sm p-3 m-1 bg-white rounded' style={{width: '18rem'}}>
								<img className="card-img-top" src={Fleet} alt="Card image cap"/>
								<div className="card-body">
									<h5 className="card-title">Fleet</h5>
									<p className="card-text">View the status and location of the each drone in the given warehouse.</p>
									<Link NavLink to='/fleet'>
										<button className='btn nav-button'>
											Fleet
										</button>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
