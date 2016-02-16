angular.module('airline', ['airlineServices', 'airlineFilters'])
	.config(airlineRouter);

function airlineRouter ($routeProvider) {
	$routeProvider
		.when('/', {templateUrl: 'partials/destinations.html',
		 controller: 'DestinationsCtrl'})
		.when('/airports/:airportCode', {
		 templateUrl: 'partials/airport.html',
		 controller: 'AirportCtrl'
		})
		.when('/flights', {
		 templateUrl: 'partials/flights.html',
		 controller: 'FlightsCtrl'})
		.when('/reservations', {
		 templateUrl: 'partials/reservations.html',
		 controller: 'ReservationsCtrl'});
}

angular.module('airlineFilters', [])
	.filter('originTitle', function () {
		return function (input) {
			return input.origin + ' - ' + input.originFullName;
		};
	})
	.filter('destinationTitle', function () {
		return function (input) {
			return input.destination + ' - ' + input.destinationFullName;
		};
	});