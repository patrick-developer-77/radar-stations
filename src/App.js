import { useEffect, useState} from 'react'
import { Button, Card, Col, Container, Form, FormControl, Navbar, Row } from 'react-bootstrap'
import tz_lookup from 'tz-lookup'
import ReactPaginate from 'react-paginate'

export default function App() {
	const [data, setData] = useState([])
	const [q, setQ] = useState('')
	const [timezone, setTimezone] = useState()
	const [timezoneFilter, setTimezoneFilter] = useState('')
	const [filterType, setFilterType] = useState('')
	const [error, setError] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [currentPage, setCurrentPage] = useState(0)
	const PER_PAGE = 9
	const offset = currentPage * PER_PAGE

	useEffect(() => {
		setIsLoading(true)
		const fetchStations = async () => {
			try {
				const resp = await fetch('https://api.weather.gov/radar/stations')
				const body = await resp.json()
				const stations = body.features
				setData(stations)
				setIsLoading(false)
			} catch(err) {
				setError("There was an error fetching data")
				setIsLoading(false)
			}
		}
		fetchStations()
	}, [])

	useEffect(() => {
		const newSet = new Set()
		data && data.forEach(station => {
			newSet.add(tz_lookup(station.geometry.coordinates[1], station.geometry.coordinates[0]))
		})
		const sortedTimezones = Array.from(newSet).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
		setTimezone(sortedTimezones)
	}, [data])

	const search = !(timezoneFilter || q) ? data : data.filter(station => {
		if (filterType === 'filter') {
			return tz_lookup(station.geometry.coordinates[1], station.geometry.coordinates[0]).includes(timezoneFilter)
		} else if (filterType === 'search') {
			return station.properties.name.toLowerCase().includes(q.toLowerCase())
		} else {
			return data
		}
	})

	const handleSearch = (e) => {
		setCurrentPage(0)
		setQ(e.target.value)
		setFilterType('search')
	}

	const handleFilter = (zone) => {
		setCurrentPage(0)
		setTimezoneFilter(zone)
		setFilterType('filter')
	}

	const currentPageData = search.slice(offset, offset + PER_PAGE).map(stations => stations)
	const pageCount = Math.ceil(search.length / PER_PAGE)

	const handlePageClick = ({ selected: selectedPage }) => {
		setCurrentPage(selectedPage)
	}

	return (
		<>
			{error && <p>{error}</p>}
			{isLoading && <p className="p-3">Loading...</p>}
			{!isLoading && <Container fluid>
				<Row>
					<aside className="col-12 col-lg-3 sidebar bg-dark">
						<Form.Group>
							<Form.Label>
								<FormControl
									type="search"
									name="search-form"
									placeholder="Station name..."
									value={q}
									onChange={handleSearch}
								/>
							</Form.Label>
						</Form.Group>
						<Navbar collapseOnSelect expand="lg" variant="dark" bg="dark">
							<Container fluid className="align-items-lg-start">
                <Navbar.Brand href="#home" className="text-white">Timezone Filter</Navbar.Brand>
								<Navbar.Toggle aria-controls="basic-navbar-nav" />
								<Navbar.Collapse id="basic-navbar-nav">
									<div className="d-grid gap-2">
										{timezone && timezone.map(zone => (
											<Button
												variant="link"
												key={zone}
												onClick={() => handleFilter(zone)}
												className="text-start text-white text-decoration-none py-0"
											>
												{zone}
											</Button>
										))}
										<Button
											variant="outline-light"
											onClick={() => setFilterType('clear')}
											className="text-start text-decoration-none py-0"
										>Clear filter</Button>
									</div>
								</Navbar.Collapse>
							</Container>
						</Navbar>
					</aside>
					<main className="col-12 col-lg-9 main">
						<h1>Radar Stations</h1>
						<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, cumque unde, ab explicabo excepturi tempora harum perspiciatis ipsum amet iure eos ducimus quas id ut natus libero animi ratione sunt.</p>
						<Row xs={1} md={2} xl={3}>
							{currentPageData.map(station => {
								const lat = station.geometry.coordinates[1]
								const lng = station.geometry.coordinates[0]
								return (
									<Col key={station.properties.id} className="mb-3">
										<Card className="h-100">
											<Card.Body>
												<Card.Title>Station Name: {station.properties.name}</Card.Title>
												<Card.Text>
													<strong>Station Identifier:</strong> {station.properties.id}<br/>
													<strong>GPS Coordinates:</strong> <a href={`https://www.google.com/maps/@${lat},${lng},14z`} target="_blank" rel="noreferrer">{lat}, {lng}</a><br/>
													<strong>Altitude:</strong> {station.properties.elevation.value}
												</Card.Text>
											</Card.Body>
										</Card>
									</Col>
								)
							})}
						</Row>
						{pageCount > 2 && <ReactPaginate
							previousLabel={"<"}
							nextLabel={">"}
							pageCount={pageCount}
							marginPagesDisplayed={2}
							pageRangeDisplayed={5}
							onPageChange={handlePageClick}
							subContainerClassName={"pages pagination"}
							pageClassName="page-item"
							pageLinkClassName="page-link"
							previousClassName="page-item"
							previousLinkClassName="page-link"
							nextClassName="page-item"
							nextLinkClassName="page-link"
							breakLabel="..."
							breakClassName="page-item"
							breakLinkClassName="page-link"
							containerClassName="pagination justify-content-center mb-0"
							activeClassName="active"
						/>}
					</main>
				</Row>
			</Container>}
		</>
	)
}