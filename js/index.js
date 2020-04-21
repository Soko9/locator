var map;
var markers = [];
var infoWindow;
var locationSelect;
// var image = 'C:\\Users\\Lenovo\\OneDrive\\Desktop\\Workspace\\Sublime Text\\Others\\Google Maps Store Locator\\assets\\marker.png';
// var image_2 = 'https://img.icons8.com/nolan/64/marker.png';
// var image_3 = 'https://img.icons8.com/color/64/000000/marker.png';
var image_4 = 'https://img.icons8.com/nolan/64/map-pin.png';

function initMap() {
    var LA = {
    	lat: 34.0522, 
    	lng: -118.2437
    };

    map = new google.maps.Map(document.getElementById('map'), {
        center: LA,
        zoom: 12,
        mapTypeId: 'roadmap',
    });

    infoWindow = new google.maps.InfoWindow();
    searchStore();
    // displayStores();
    // setOnClickListener();
    // showStoreMarkers();
}

function showStoreMarkers(stores) {
	var bounds = new google.maps.LatLngBounds();

	stores.forEach(function(store, index){

		var latlng = new google.maps.LatLng(
			store.coordinates.latitude,
			store.coordinates.longitude);
		var name = store.name;
		var address = store.addressLines[0];

		createMarker(latlng, name, address);

		bounds.extend(latlng);
	});

	map.fitBounds(bounds);
}

function createMarker(latlng, name, address) {
	var html = "<b>" + name + "</b> <br/>" + address;

    var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        icon: image_4,
        draggable: false,
        animation: google.maps.Animation.DROP,
    });

    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
          infoWindow.close();
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
      });

    markers.push(marker);
}

function displayStores(stores) {
	var storeHtml = '';
	stores.forEach(function(store, index) {
		storeHtml += `
			<div class="store-container">
				<div class="store-container-background">
					<div class="store-info">
						<div class="store-address">
							<span>${store.addressLines[0]}</span>
							<span>${store.addressLines[1]}</span>
						</div>
						<div class="store-phone-number">${store.phoneNumber}</div>
					</div>
					<div class="store-number-container">
						<div class="store-number">${index+1}</div>
					</div>
				</div>
			</div>
		`;
	});

	document.querySelector('.stores-list').innerHTML = storeHtml;
}

function setOnClickListener() {
	var storeElemet = document.querySelectorAll('.store-container');
	storeElemet.forEach(function(element, index) {
		element.addEventListener('click', function() {
			new google.maps.event.trigger(markers[index], 'click');
		});
	});
}

function searchStore() {
	var foundStores = [];
	var searchText = document.getElementById('zip-code-input').value;

	if(searchText) {
		stores.forEach(function(store, index) {
			var postal = store.address.postalCode.substring(0, 5);
			if(postal == searchText) {
				foundStores.push(store);
			}
		});
	} else {
		foundStores = stores;
	}

	clearLocations();
	displayStores(foundStores);
	showStoreMarkers(foundStores);
	setOnClickListener();
}

function clearLocations() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;
}