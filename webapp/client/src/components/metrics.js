import React, { Component } from 'react';
import Nav from './contants/nav';
import { CChart } from '@coreui/react-chartjs';
import { CCardHeader } from '@coreui/react';
export default class home extends Component {
	render() {
		return (
			<div>
				<Nav />
				<div className='metrics'>
					<div className='container'>
						<div className='row mt-5'>
							<div className='col-4 '>
								<div className='shadow-sm p-3 m-1 bg-white rounded'>
									<CCardHeader>Items by Manufacturer</CCardHeader>

									<CChart
										type='pie'
										className='chart'
										datasets={[
											{
												data: [300, 50, 100],
												backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
												hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
											},
										]}
										labels={[
											'Lakeside Mills, Inc',
											'Cargill',
											'Monterey Bay Spice Co.',
										]}
									/>
								</div>
							</div>

							<div className='col-4 '>
								<div className='shadow-sm p-3 m-1 bg-white rounded'>
									<CCardHeader>Total Items</CCardHeader>
									<CChart
										type='bar'
										className='chart'
										datasets={[
											{
												label: 'Total Inventory',
												backgroundColor: 'rgba(255,99,132,0.2)',
												borderColor: 'rgba(255,99,132,1)',
												borderWidth: 1,
												hoverBackgroundColor: 'rgba(255,99,132,0.4)',
												hoverBorderColor: 'rgba(255,99,132,1)',
												data: [65, 59, 70, 61, 66, 55, 55],
											},
										]}
										options={{
											maintainAspectRatio: true,
											tooltips: {
												enabled: true,
											},
										}}
										labels={[
											'January',
											'February',
											'March',
											'April',
											'May',
											'June',
											'July',
										]}
									/>
								</div>
							</div>
							<div className='col-4 '>
								<div className='shadow-sm p-3 m-1 bg-white rounded'>
									<CCardHeader>Storage Capacity Remaining</CCardHeader>
									<CChart
										type='line'
										className='chart'
										datasets={[
											{
												label: 'Remaining Inventory',
												fill: false,
												lineTension: 0.1,
												backgroundColor: 'rgba(75,192,192,0.4)',
												borderColor: 'rgba(75,192,192,1)',
												borderCapStyle: 'butt',
												borderDash: [],
												borderDashOffset: 0.0,
												borderJoinStyle: 'miter',
												pointBorderColor: 'rgba(75,192,192,1)',
												pointBackgroundColor: '#fff',
												pointBorderWidth: 1,
												pointHoverRadius: 5,
												pointHoverBackgroundColor: 'rgba(75,192,192,1)',
												pointHoverBorderColor: 'rgba(220,220,220,1)',
												pointHoverBorderWidth: 2,
												pointRadius: 1,
												pointHitRadius: 10,
												data: [35, 41, 30, 39, 34, 45, 45],
											},
										]}
										labels={[
											'January',
											'February',
											'March',
											'April',
											'May',
											'June',
											'July',
										]}
									/>
								</div>
							</div>
						</div>
						<div className='traffic-chart'>
							<div className='shadow-sm p-5 m-1 bg-white rounded'>
								<CCardHeader>Incoming vs Outgoing Inventory</CCardHeader>
								<CChart
									className=''
									type='line'
									datasets={[
										{
											label: 'Incoming Inventory',
											backgroundColor: 'rgba(179,181,198,0.2)',
											borderColor: 'rgba(179,181,198,1)',
											pointBackgroundColor: 'rgba(179,181,198,1)',
											pointBorderColor: '#fff',
											pointHoverBackgroundColor: '#fff',
											pointHoverBorderColor: 'rgba(179,181,198,1)',
											tooltipLabelColor: 'rgba(179,181,198,1)',
											data: [340, 560, 770, 550, 1110, 880, 550],
										},
										{
											label: 'Outgoing Inventory',
											backgroundColor: 'rgba(255,99,132,0.2)',
											borderColor: 'rgba(255,99,132,1)',
											pointBackgroundColor: 'rgba(255,99,132,1)',
											pointBorderColor: '#fff',
											pointHoverBackgroundColor: '#fff',
											pointHoverBorderColor: 'rgba(255,99,132,1)',
											tooltipLabelColor: 'rgba(255,99,132,1)',
											data: [500, 650, 430, 900, 1100, 600, 800],
										},
									]}
									options={{
										maintainAspectRatio: true,
										tooltips: {
											enabled: true,
										},
									}}
									labels={[
										'Sunday',
										'Monday',
										'Tuesday',
										'Wednesday',
										'Thursday',
										'Friday',
										'Saturday',
									]}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
