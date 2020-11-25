import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';
import logo from '../../logo/drone.png';

export default class nav extends Component {
	render() {
		return (
			<div>
				<nav class='navbar navbar-expand-lg navbar-dark'>
					<Link NavLink to='/' className='navbar-brand mr-5'>
						<img src={logo} alt='' className='logo' />
					</Link>
					<button
						class='navbar-toggler'
						type='button'
						data-toggle='collapse'
						data-target='#navbarNavDropdown'
						aria-controls='navbarNavDropdown'
						aria-expanded='false'
						aria-label='Toggle navigation'
					>
						<span className='navbar-toggler-icon'></span>
					</button>

					<div className='collapse navbar-collapse' id='navbarNavDropdown'>
						<ul className='navbar-nav mr-auto'>
							<div className='nav-item '>
								<Link NavLink to='/'>
									<button className='btn nav-button'>
										<i class='fas fa-home mr-2'></i>
										Home
									</button>
								</Link>
							</div>
							<div className='nav-item '>
								<Link NavLink to='/metrics'>
									<button className='btn nav-button'>
										<i class='fas fa-chart-bar mr-2'></i>
										Metrics
									</button>
								</Link>
							</div>
							<div className='nav-item'>
								<Link NavLink to='/inventory'>
									<button className='btn nav-button'>
										<i className='fas fa-boxes mr-2'></i>Inventory
									</button>
								</Link>
							</div>
							<div className='nav-item'>
								<Link NavLink to='/fleet'>
									<button className='btn nav-button'>
										<i class='fas fa-spinner'></i> Fleet
									</button>
								</Link>
							</div>
						</ul>
						<div className='nav-item'>
							<Link NavLink to='/login'>
								<button className='btn nav-button'>
									<i className='fas fa-door-open mr-2'></i>
									Logout
								</button>
							</Link>
						</div>
					</div>
				</nav>
			</div>
		);
	}
}
