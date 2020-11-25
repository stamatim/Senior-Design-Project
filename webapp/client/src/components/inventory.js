import React, { Component } from 'react';
import {
	CContainer,
	CRow,
	CCol,
	CCard,
	CCardBody,
	CCardHeader,
	CDataTable,
} from '@coreui/react';
import Nav from './contants/nav';

export default class inventory extends Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [],
			fields: [
				'id',
				'title',
				'manufacturer',
				'quantity',
				'section',
				'shelf',
				'row',
				'arrival',
				'departure',
			],
		};
	}

	async componentDidMount() {
		function formatItems(itemsArr) {
			const arrSize = Object.keys(itemsArr).length;
			const toReturn = [];

			for (let i = 0; i < arrSize - 1; i++) {
				const currentItem = itemsArr.pop();

				const iId = currentItem.productId;
				const iTitle = currentItem.title;
				const iManufacturer = currentItem.manufacturer;
				const iQuantity = currentItem.quantity;
				const iSection = currentItem.location.wsection;
				const iShelf = currentItem.location.wshelf;
				const iRow = currentItem.location.wrow;
				const iArrival = currentItem.arrival;
				const iDeparture = currentItem.departure_scheduled;

				const newItem = {
					id: iId,
					title: iTitle,
					manufacturer: iManufacturer,
					quantity: iQuantity,
					section: iSection,
					shelf: iShelf,
					row: iRow,
					arrival: iArrival,
					departure: iDeparture,
				};

				toReturn.push(newItem);
			}
			return toReturn;
		}

		let get_all = 'http://localhost:5000/items/get_all';
		const response = await fetch(get_all);
		const json = await response.json();
		this.setState({
			items: formatItems(json.items),
		});
	}

	render() {
		const { items, fields } = this.state;
		return (
			<div>
				<Nav />
				<div className='container'>
					<div className='shadow-sm p-3 m-5 bg-white rounded'>
						<CContainer>
							<h1 className='display-5'>Inventory</h1>
							<br />
							<br />
						</CContainer>
						<CRow>
							<CCol>
								<CCard>
									<CCardHeader>Warehouse Items</CCardHeader>
									<CCardBody>
										<CDataTable
											items={items}
											fields={fields}
											hover
											striped
											bordered
											size='large'
											itemsPerPage={8}
											pagination
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
