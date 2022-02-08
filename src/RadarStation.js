import { Card, Col } from 'react-bootstrap'

export default function RadarStation({ station }) {
	const lat = station.geometry.coordinates[1]
	const lng = station.geometry.coordinates[0]
	return (
		<Col className="mb-3">
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
	);
}
