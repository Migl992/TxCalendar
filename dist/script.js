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
		 window.chainIdMapping = {
			"324": { name: "zKSync Era", imageUrl: "img/zksync.avif" },
			"1": { name: "Ethereum", imageUrl: "img/ethereum.avif" },
			"53935": { name: "DFK", imageUrl: "img/DFK.avif" },
			"43114": { name: "Avalanche C-Chain", imageUrl: "img/avax.avif" },
			"8453": { name: "Base", imageUrl: "img/base.avif" },
			"5000": { name: "Mantle", imageUrl: "img/mantle.avif" },
			"1992": { name: "Hubble Exchange", imageUrl: "img/Hubble.avif" },
			"19": { name: "Songbird Canary", imageUrl: "img/songbird.avif" },
			"432204": { name: "Dexalot", imageUrl: "img/DEXALOT.avif" },
			"10": { name: "Optimism", imageUrl: "img/optimism.avif" },
			"14": { name: "Flare Mainnet", imageUrl: "img/flare.avif" },
			"56288": { name: "Boba BNB", imageUrl: "img/boba-bnb.avif" },
			"7777777": { name: "Zora", imageUrl: "img/zora.avif" },
			"88888": { name: "Chiliz", imageUrl: "img/chiliz.avif" },
			"1088": { name: "Metis", imageUrl: "img/metis.avif" },
			"4337": { name: "Beam", imageUrl: "img/beam.avif" },
			"1234": { name: "StepNetwork", imageUrl: "img/stepnetwork.avif" },
			"6119": { name: "UPTN", imageUrl: "img/uptn.avif" },
			"8888": { name: "XANAchain", imageUrl: "img/xana.avif" },
			"3011": { name: "PLAYA3ULL Games", imageUrl: "img/Playa3ull.avif" },
			"333000333": { name: "Meld", imageUrl: "img/meld.avif" },
			"288": { name: "Boba Ethereum", imageUrl: "img/boba-eth.avif" },
			"10507": { name: "Numbers", imageUrl: "img/Numbers.avif" },
			"7979": { name: "DOS", imageUrl: "img/dos.avif" },
			"73772": { name: "Swimmer", imageUrl: "img/Swimmer.avif" },
			"24052022": { name: "Wraptag", imageUrl: "img/wraptag.avif" },
			"1228": { name: "XPLUS", imageUrl: "img/xplus.avif" },
			"2044": { name: "Shrapnel", imageUrl: "img/Shrapnel.avif" },
			"262018": { name: "Loco Legends", imageUrl: "img/loco.avif" },
			"1080": { name: "Mintara", imageUrl: "img/Mintara.avif" },
			"34443": { name: "Mode", imageUrl: "img/mode.avif" }
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
		   chain: window.chainIdMapping[item.chainId] || 'Unknown Chain',
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
		 eventLimit:  5, // Limit to  5 events per day
    	 eventLimitText: ' more',
		 eventRender: function(event, element) {
			// Check if the chain property is an object and has an imageUrl property
			const chainInfo = typeof event.chain === 'object' && event.chain !== null ? event.chain : { name: event.chain, imageUrl: '' };
		  
			// Only proceed if there's an image URL
			if (chainInfo.imageUrl) {
			  // Create an img element with the chain's image URL
			  var imgElement = document.createElement("img");
			  imgElement.src = chainInfo.imageUrl;
			  imgElement.className = "chain-logo"; // Add a class to the image element
			  imgElement.style.marginRight = "5px"; // Add some space between the image and the title
		  
			  // Prepend the img element to the event title
			  element.find(".fc-title").prepend(imgElement);
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
			jQuery('.event-body').append('<p><strong>Chain:</strong> ' + event.chain.name + '<img src="' + event.chain.imageUrl + '" /></p>');
			jQuery('.event-body').append('<p><strong>Link:</strong> <a href="https://routescan.io/tx/' + event.thxid + '" target="_blank">View on RouteScan</a></p>');
	  
			// Open the modal
			jQuery('#modal-view-event').modal();
		  },
	   });
	});
});
   