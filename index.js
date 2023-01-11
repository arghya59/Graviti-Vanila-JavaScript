//For Graviti Internship Assignment by Arghya Banerjee

//Add waypoint function...
var count = 1
function addWaypoint() {
    let WaypointArea = document.getElementById('Waypoints-field')
    WaypointArea.insertAdjacentHTML("beforeend", `<input type="text" class="user_Input validator" name="" placeholder="Waypoint ${count + 1}" required>`)
    count++

}

// Inin map from google maps
function initMap() {
    var directionsService = new google.maps.DirectionsService
    var directionsDisplay = new google.maps.DirectionsRenderer
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: { lat: 20.5937, lng: 78.9629 }
    });
    directionsDisplay.setMap(map);

    var onChangeHandler = function () {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    };
    document.getElementById('btn').addEventListener('click', onChangeHandler);


    //Auto complete function for Origin....
    var originInput = document.getElementById("origin")
    var waypointInput = document.getElementById('waypoint')
    var destInput = document.getElementById('dest')
    const autocomplete = new google.maps.places.Autocomplete(originInput, {
        types: ['geocode']
    })

    autocomplete.addListener('place_changed', function () {
        var nearPlace = autocomplete.getPlace()
    })

    //Auto complete function for Destination....
    const autocompleteDest = new google.maps.places.Autocomplete(destInput, {
        types: ['geocode']
    })

    autocompleteDest.addListener('place_changed', function () {
        var nearPlace = autocomplete.getPlace()
    })
    //Auto complete function for Waypoint....
    const autocompleteWP = new google.maps.places.Autocomplete(waypointInput, {
        types: ['geocode']
    })

    autocompleteWP.addListener('place_changed', function () {
        var nearPlace = autocomplete.getPlace()
    })
}

//Call the functions
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    let calDistance = document.getElementById('result-parameter')
    let calDuration = document.getElementById("result-parameter2")
    let originName = document.getElementById('originName')
    let destName = document.getElementById('destName')
    let distValue2 = document.getElementById('distValue2')
    let modeOfTravel = document.getElementById("modes").value
    //console.log(modeOfTravel)
    originName.innerHTML = document.getElementById('origin').value
    destName.innerHTML = document.getElementById('dest').value

    //way points
    var waypoints1 = [];
    var waypointArray = []
    var WaypointsField = document.getElementById('Waypoints-field')
    var lengthOfWayPoints = WaypointsField.children.length
    // console.log(lengthOfWayPoints)
    var checkwaypoint = document.getElementById('waypoint').value
    if (checkwaypoint == "") {
        window.alert("No Stops found! Do you want to proceed?")

    } else {

        for (let i = 0; i < lengthOfWayPoints; i++) {
            waypoints1.push({
                location: WaypointsField.children[i].value,
                stopover: true
            })

            waypointArray.push(WaypointsField.children[i].value)
        }
    }

    directionsService.route({
        origin: document.getElementById('origin').value,
        destination: document.getElementById('dest').value,
        waypoints: waypoints1,
        travelMode: modeOfTravel,
        unitSystem: google.maps.UnitSystem.IMPERIAL
    }, function (response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
            //console.log(response.routes[0].legs.length)
            var distanceRawData = 0
            var durationRawData

            if (checkwaypoint == "") {
                distanceRawData = response.routes[0].legs[0].distance.value
                durationRawData = response.routes[0].legs[0].duration.text
                let distance = Math.floor(distanceRawData / 1000)
                document.getElementById('result-parameter2').className = "A"
                calDistance.innerHTML = `${distance} <span id="kms">kms</span>`
                calDuration.innerHTML = `${durationRawData}`
                distValue2.innerHTML = `${distance} kms.`
            }
            else {
                var i
                // Extracting the total Distance
                for (i = 0; i <= waypoints1.length; i++) {
                    distanceRawData += response.routes[0].legs[i].distance.value
                }

                // Extracting the ETA
                var duration = []
                for (i = 0; i <= waypoints1.length; i++) {
                    duration.push(response.routes[0].legs[i].duration.text)
                }
                //Print duration
                for (i = 0; i <= duration.length; i++) {
                    console.log(duration[i])
                }

                if (waypoints1.length > 1) {
                    calDuration.innerHTML = `${document.getElementById('origin').value.toUpperCase()} To ${waypoints1[0].location.toUpperCase()} : ${duration[0]} <br>`

                    for (i = 1; i < waypointArray.length; i++) {
                        //console.log(duration[i]);
                        calDuration.insertAdjacentHTML("beforeend", `${waypointArray[i - 1].toUpperCase()} To ${waypointArray[i].toUpperCase()} : ${duration[i]} <br>`)
                    }
                    calDuration.insertAdjacentHTML("beforeend", `${waypointArray[waypointArray.length - 1].toUpperCase()} To ${document.getElementById('dest').value.toUpperCase()} : ${duration[duration.length - 1]}`)
                    document.getElementById('result-parameter2').className = "specialCase"
                } else {
                    calDuration.innerHTML = `${document.getElementById('origin').value.toUpperCase()} To ${checkwaypoint.toUpperCase()} : ${duration[0]}  <br> ${checkwaypoint.toUpperCase()} To ${document.getElementById('dest').value.toUpperCase()} : ${duration[1]}`
                }

                let distance = Math.floor(distanceRawData / 1000)
                calDistance.innerHTML = `${distance} <span id="kms">kms</span>`
                distValue2.innerHTML = `${distance} kms.`
            }
            // console.log(durationRawData)
        }
        //Errors handling
        else {
            if (status == "ZERO_RESULTS" && modeOfTravel != "BICYCLING") {
                window.alert(`No route could be found between the ${document.getElementById('origin').value} and ${document.getElementById('dest').value} by ${modeOfTravel} mode.`)
            }

            else if (status == "ZERO_RESULTS" && modeOfTravel == "BICYCLING") {
                window.alert(`${modeOfTravel} mode currently available only in the US and some Canadian cities`)
            }

            else if (status == "INVALID_REQUEST") {
                window.alert(`Distance can not covered by ${modeOfTravel} mode. You need to take Flight to reach that place.`)
            }

            else if (status == "NOT_FOUND") {
                window.alert(`Please enter a valid Place!!`)
            }

            else {
                window.alert('Directions request failed due to ' + status);
            }
        }
    });
}


