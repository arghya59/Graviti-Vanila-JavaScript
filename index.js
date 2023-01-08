//For Graviti Internship Assignment by Arghya Banerjee

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
    var waypoints1 = [];
    var checkwaypoint = document.getElementById('waypoint').value
    if (checkwaypoint == "") {
        window.alert("No Stops found! Do you want to proceed?")

    } else {
        waypoints1.push({
            location: checkwaypoint,
            stopover: true
        })
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
            console.log(response.routes[0].legs.length)
            var distanceRawData
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
                distanceRawData = response.routes[0].legs[0].distance.value + response.routes[0].legs[1].distance.value
                // Extracting the ETA
                durationLeg0 = response.routes[0].legs[0].duration.text
                durationLeg1 = response.routes[0].legs[1].duration.text

                calDuration.innerHTML = `${document.getElementById('origin').value} To ${checkwaypoint}: ${durationLeg0} ${checkwaypoint} To ${document.getElementById('dest').value} : ${durationLeg1}`
                document.getElementById('result-parameter2').className = "specialCase"
                //document.getElementById('result-parameter2').style.fontSize = "5px"

                let distance = Math.floor(distanceRawData / 1000)
                calDistance.innerHTML = `${distance} <span id="kms">kms</span>`
                distValue2.innerHTML = `${distance} kms.`
            }

            console.log(durationRawData)

        } 
        //If errors
        else {
            if (status == "ZERO_RESULTS") {
                window.alert(`Travelling can not be covered by ${modeOfTravel} mode. Please change the mode of travelling.`)
            }
            else if (status == "INVALID_REQUEST") {
                window.alert(`Distance can not covered by ${modeOfTravel} mode. You need to take Flight to reach that place.`)
            }
            else {

                window.alert('Directions request failed due to ' + status);
            }
        }
    });
}

