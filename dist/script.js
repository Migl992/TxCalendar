jQuery(document).ready(function(){
	// ... existing datepicker initialization ...
	var storedInputValue = localStorage.getItem('storedInputValue');

	// API endpoint
	const apiEndpoint = `https://api.routescan.io/v2/network/mainnet/evm/all/address/${storedInputValue}/transactions?sort=desc&limit=100`;
   
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
		 const chainIdMapping = {
			"324": "zKSync Era",
			"1": "Ethereum",
			"53935": "DFK",
			"43114": "Avalanche C-Chain",
			"8453": "Base",
			"5000": "Mantle",
			"1992": "Hubble Exchange",
			"19": "Songbird Canary",
			"432204": "Dexalot",
			"10": "Optimism",
			"14": "Flare Mainnet",
			"56288": "Boba BNB",
			"7777777": "Zora",
			"88888": "Chiliz",
			"1088": "Metis",
			"4337": "Beam",
			"1234": "StepNetwork",
			"6119": "UPTN",
			"8888": "XANAchain",
			"3011": "PLAYA3ULL Games",
			"333000333": "Meld",
			"288": "Boba Ethereum",
			"10507": "Numbers",
			"7979": "DOS",
			"73772": "Swimmer",
			"24052022": "Wraptag",
			"1228": "XPLUS",
			"2044": "Shrapnel",
			"262018": "Loco Legends",
			"1080": "Mintara",
			"34443": "Mode"
		  };
		 
		 // Map the API response to the format expected by FullCalendar
		 return data.items.map(item => ({
		   title: item.type, // Use the 'type' field as the event title
		   start: item.timestamp, // Use the 'timestamp' field as the event start date
		   from: item.from,
		   to: item.to,
		   value: item.value,
		   thxid: item.id,
		   method: item.methodId,
		   chain: chainIdMapping[item.chainId] || 'Unknown Chain',
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
		 eventClick: function(event) {
			// Populate the modal with the event details
			jQuery('.event-title').html(event.title);
			jQuery('.event-body').html(event.from);
			jQuery('.event-body').empty();

			// Append each piece of information as a separate element
			jQuery('.event-body').append('<p><strong>From:</strong> ' + event.from + '</p>');
			jQuery('.event-body').append('<p><strong>To:</strong> ' + event.to + '</p>');
			jQuery('.event-body').append('<p><strong>Value:</strong> ' + event.value + '</p>');
			jQuery('.event-body').append('<p><strong>Method:</strong> ' + event.method + '</p>');
			jQuery('.event-body').append('<p><strong>Chain:</strong> ' + event.chain + '</p>');
			jQuery('.event-body').append('<p><strong>Link:</strong> <a href="https://routescan.io/tx/' + event.thxid + '" target="_blank">View on RouteScan</a></p>');
	  
			// Open the modal
			jQuery('#modal-view-event').modal();
		  },
	   });
	});
});
   