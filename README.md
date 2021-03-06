# Front End Coding Challenge

For this exercise, use either React or Vue JS and the CSS configuration you prefer to build a
static site with the following requirements. Deliver this as a public github repo that can be cloned
and then run locally.

Please let me know if you have any questions. This was a fun challenge and I hope it shows my skills in React and JavaScript.

## My Notes

1. I used Bootstrap as the CSS framework so there wasn't much CSS needed. The CSS was written in SCSS.
2. The Longitude and Latitude coordinates were reversed so I switched them.
3. I printed out the elevation instead of the altitude. I wasn't able to find the right formula to convert either elevation or coordinates to altitude.
4. I added the fuzzy keyword search to the sidebar. It searches the titles of each radar station.
5. I wasn't able to add the sort by radar station closest to the users location. Again I couldn't find the right solution to sort by the coordinates. And to use the geolocation to get the users current location isn't ideal since it has to be done over https.
6. I didn't create too many other components. It's a small app and wasn't reusing much so I thought best to keep everything together. I did create the radar station card as it's own component as it was repeated.

## Must-Have

1. Using your framework of choice create a page with the following structure
	1. The page should have 2 regions (25/75)
	2. The main content section should contain the page title and body copy.
2. In the main content section, create a responsive grid of content from the following API:
	1. https://www.weather.gov/documentation/services-web-api
	2. https://api.weather.gov/radar/stations
	3. Each block should contain the following information
		1. Station Name
		2. Station Identifier
		3. GPS Coordinates
		4. Altitude
	4. Results should be paginated, displaying 9 stations at a time.
	5. GPS Coordinates link to Google Map of the location
3. Use the sidebar to add filtering by timezone
4. API Error Handling

## Nice to have

1. The radar stations closest to the users??? location appear first in the grid
2. Add fuzzy keyword search to the sidebar
3. Cypress tests that check whether the page displays properly and pagination is workin

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
