jQuery(document).ready(function(){
	// ... existing datepicker initialization ...
   
	// API endpoint
	const apiEndpoint = 'https://api.routescan.io/v2/network/mainnet/evm/1/address/0x3e8734ec146c981e3ed1f6b582d447dde701d90c/transactions?sort=desc&limit=100';
   
	// Headers for the API request
	const headers = new Headers({
	   'Accept': 'application/json'
	});
   
	// Function to fetch events data from the API
	async function fetchEventsData() {
	   try {
		 const response = await fetch(apiEndpoint, { headers: headers });
		 if (!response.ok) {
		   throw new Error(`HTTP error! status: ${response.status}`);
		 }
		 const data = await response.json();
		 
		 // Map the API response to the format expected by FullCalendar
		 return data.items.map(item => ({
		   title: item.type, // Use the 'type' field as the event title
		   start: item.timestamp, // Use the 'timestamp' field as the event start date
		   // Add other event properties as needed
		 }));
	   } catch (error) {
		 console.error('Error fetching events data:', error);
		 return [];
	   }
	}
   
	// Initialize the calendar with events from the API
	fetchEventsData().then(events => {
	   jQuery('#calendar').fullCalendar({
		 themeSystem: 'bootstrap4',
		 businessHours: false,
		 defaultView: 'month',
		 editable: true,
		 header: {
		   left: 'title',
		   center: 'month,agendaWeek,agendaDay',
		   right: 'today prev,next'
		 },
		 events: events, // Set the events fetched from the API
		 eventRender: function(event, element) {
		   if(event.icon){
			 element.find(".fc-title").prepend("<i class='fa fa-"+event.icon+"'></i>");
		   }
		 },
/* 		 dayClick: function() {
		   jQuery('#modal-view-event-add').modal();
		 }, */
		 eventClick: function(event, jsEvent, view) {
		   jQuery('.event-icon').html("<i class='fa fa-"+event.icon+"'></i>");
		   jQuery('.event-title').html(event.title);
		   jQuery('.event-body').html(event.description);
		   jQuery('.eventUrl').attr('href',event.url);
		   jQuery('#modal-view-event').modal();
		 },
	   });
	});
   
	// ... existing submit handler and other code ...
   });
   