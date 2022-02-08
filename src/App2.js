import { useEffect, useState } from 'react'
import { Card, Container, Form, FormControl, Nav, Navbar, Row } from 'react-bootstrap'
import tz_lookup from 'tz-lookup'
import ReactPaginate from 'react-paginate'

export default function App() {
  const [stations, setStations] = useState([])
  const [q, setQ] = useState('')

  const [timezoneFilter, setTimezoneFilter] = useState('')
	const [timezone, setTimezone] = useState()
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const [offset, setOffset] = useState(0)
	const [data, setData] = useState([])
	const [perPage] = useState(9)
	const [pageCount, setPageCount] = useState(0)

  const search = (items) => {
		return items && items.filter(item => {
      console.log(item.properties.name.toLowerCase().includes(q.toLowerCase()))
      return item.properties.name.toLowerCase().includes(q.toLowerCase())
    })
	}

  useEffect(() => {
    setIsLoading(true)

    fetch('https://api.weather.gov/radar/stations')
      .then(res => res.json())
      .then(result => {
        setIsLoading(false)
        setStations(result.features)
      },
      (err) => {
        setIsLoading(false)
        setError(err)
      })

  }, [])

  useEffect(() => {
		const temp = new Set()
		stations.forEach(location => temp.add(tz_lookup(location.geometry.coordinates[1], location.geometry.coordinates[0])))
		const sortedTimezones = Array.from(temp).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()) )
		setTimezone(sortedTimezones)
	}, [stations])

  useEffect(() => {
		const getData = () => {
      // setFilterLocations(filterLocations.filter(location => tz_lookup(location.geometry.coordinates[1], location.geometry.coordinates[0]) === timezoneFilter ? 1 : 0))
			const slice = stations.slice(offset * perPage, (offset * perPage) + perPage)
			const postData = slice.map(location => {
        const lat = location.geometry.coordinates[1]
        const lng = location.geometry.coordinates[0]
				return (
					<Card>
            <Card.Body>
              <Card.Title>Station Name: {location.properties.name}</Card.Title>
              <Card.Text>
                <strong>Station Identifier:</strong> {location.properties.id}<br/>
                <strong>GPS Coordinates:</strong> <a href={`https://www.google.com/maps/@${lat},${lng},14z`} target="_blank" rel="noreferrer">{lat}, {lng}</a><br/>
                <strong>Altitude:</strong> {location.properties.elevation.value}
              </Card.Text>
            </Card.Body>
          </Card>
				)
			})
			setData(postData)
			setPageCount(Math.ceil(stations.length / perPage))
		}
		getData()
	}, [offset, perPage, timezoneFilter, stations])

  const handleSearchChange = (e) => {
    setQ(e.target.value)
  }

  const filtered = !q ? stations : q.filter(station => station.properties.name.toLowerCase().includes(q.toLowerCase()))

  const handleClick = (zone) => {
		setTimezoneFilter(zone)
	}

  const handlePageClick = (e) => {
		setOffset(e.selected)
	}

  return (
    <div className="App">
      {error && <p className="error">{error}</p>}
      {isLoading && <p>Loading...</p>}
      <Container fluid>
        <Row>
          {stations && <aside className="col-12 col-md-3 sidebar gx-0 gx-md-3">
            <Form.Group className="mb-3 text-center" controlId="exampleForm.ControlInput1">
              <Form.Label className="h5 fw-normal">Fuzzy Search</Form.Label>
              <FormControl
                type="search"
                name="search-form"
                placeholder="Station name..."
                value={q}
                onChange={handleSearchChange}
              />
            </Form.Group>
            <Navbar expand="md" className="px-3">
              <Container fluid>
                <Navbar.Brand href="#home" className="text-white">Timezone Filter</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav>
                    {timezone && timezone.map(zone => (
                      <Nav.Link className="text-white" key={zone} onClick={() => handleClick(zone)}>{zone}</Nav.Link>
                    ))}
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>
          </aside>}
          <main className="col-12 col-md-9 main">
            <h1>Radar Stations</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi ullam necessitatibus, quos a cumque quo voluptas atque facilis voluptatum aliquid. Eveniet ab numquam officia maiores voluptatem fugit excepturi perspiciatis tempora.</p>
            {stations && <>
              <div className="grid">
                {data}
              </div>
              <ReactPaginate
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
                containerClassName="pagination justify-content-center py-5 mb-0"
                activeClassName="active"
              />
            </>}
          </main>
        </Row>
      </Container>
    </div>
  )
}