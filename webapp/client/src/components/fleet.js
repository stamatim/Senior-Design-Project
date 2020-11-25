import React, { Component } from 'react';
import {
	CContainer,
	CRow,
	CCol,
	CCard,
	CCardBody,
	CCardHeader,
	CDataTable,
	CBadge,
} from '@coreui/react';
import Nav from './contants/nav';

export default class fleet extends Component {
	constructor(props) {
		super(props);
		this.state = {
			status: ''
		};
	}

	 componentDidMount() {
		this.getStatus();
		this.interval = setInterval(() => {
			this.getStatus();
		  }, 500);
	}

	
	  getStatus() {
		fetch('http://localhost:5000/status')
		.then(res => {
		  return res.json();
		})
		.then(res => {
		  this.setState({
			status: res.message
		  });
		});
	}
	
	componentWillUnmount() {
		clearInterval(this.interval);
	  }

	render() {
		return (
			<div>
				<Nav />
				<div className='container'>
					<div className='shadow p-3 m-5 bg-white rounded'>
						<CContainer>
							<h1 className='display-5'>Drone Fleet</h1>
							<br />
							<br />
						</CContainer>
						<CRow>
							<CCol>
								<CCard>
									<CCardHeader>Warehouse Drones</CCardHeader>
									<CCardBody>
										<CDataTable
											items={[
												{
													id: '44356',
													battery: '85%',
													location: 'warehouse 28B',
													status: this.state.status,
												},
												{
													id: '22345',
													battery: '100%',
													location: 'warehouse 28B',
													status: 'offline',
												},
												{
													id: '66578',
													battery: '100%',
													location: 'warehouse 28C',
													status: 'offline',
												},
												{
													id: '99097',
													battery: '100%',
													location: 'warehouse 21B',
													status: 'offline',
												},
												{
													id: '34509',
													battery: '100%',
													location: 'warehouse 21B',
													status: 'offline',
												},
												{
													id: '88989',
													battery: '100%',
													location: 'warehouse 21B',
													status: 'offline',
												},
												{
													id: '34097',
													battery: '100%',
													location: 'warehouse 21B',
													status: 'offline',
												},
												{
													id: '76534',
													battery: '100%',
													location: 'warehouse 21B',
													status: 'offline',
												},
												
											]}
											fields={['id', 'battery', 'location', 'status']}
											hover
											striped
											bordered
											size='large'
											itemsPerPage={8}
											pagination
											scopedSlots={{
												status: (item) => (
													<td>
														<CBadge color={getBadge(item.status)}>
															{item.status}
														</CBadge>
													</td>
												),
											}}
										/>
									</CCardBody>
								</CCard>
							</CCol>
						</CRow>
					</div>
				</div>
			</div>
		);
	}
}

const getBadge = (status) => {
	switch (status) {
		case 'online':
			return 'success';
		case 'offline':
			return 'secondary';
		case 'scanning':
			return 'primary';
		default:
			return '';
	}
};
