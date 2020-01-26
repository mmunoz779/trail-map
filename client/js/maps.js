var map;
var dis = 0.0;
var routeName = "";

function setRouteName(name) {
    routeName = name;
}

function getDis() {
    return dis;
}

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 47.102929, lng: -88.551937},
        zoom: 15,
        disableDefaultUI: true
    });
    updateDist();

    var trailData = '../JSON/techTrails.geojson';

    map.data.loadGeoJson(trailData);

    map.data.setStyle(function (feature) {

        var width = 4;

        //'selected' boolean property in each feature
        if (feature.getProperty('selected')) {
            width = 8;
        }
        return /** @type {!google.maps.Data.StyleOptions} */({
            strokeWeight: width,
            strokeColor: feature.getProperty('color')
        });
    });

    google.maps.event.addListenerOnce(map, 'idle', function () {
        // Do not use while database is disabled
        // angular.element(document.getElementById("myForm")).scope().loadExisting();
    });

    map.data.addListener('mouseover', function (event) {
        map.data.revertStyle();
        map.data.overrideStyle(event.feature, {strokeWeight: 8});
    });

    map.data.addListener('mouseout', function (event) {
        map.data.revertStyle();
    });

    // When the user clicks, set 'selected', changing the width of trail
    map.data.addListener('click', function (event) {
        map.data.revertStyle();
        event.feature.setProperty('selected', !event.feature.getProperty('selected'));
        if (!event.feature.getProperty('selected')) {
            dis -= event.feature.getProperty('distance');
        }
        if (event.feature.getProperty('selected')) {
            dis += event.feature.getProperty('distance');
        }
        updateDist();
    });

    var centerControlDiv1 = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv1, map);

    centerControlDiv1.index = 1;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv1);

    var centerControlDiv2 = document.createElement('div');
    var saveControl = new RouteSaveControl(centerControlDiv2, map);
    centerControlDiv2.index = 1;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv2);

    var centerControlDiv3 = document.createElement('div');
    var resetControl = new ResetControl(centerControlDiv3, map);
    centerControlDiv3.index = 1;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv3);

    var legendControlDiv = document.createElement('div');
    var legendControl = new LegendControl(legendControlDiv, map);
    legendControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(legendControlDiv);
}

function LegendControl(controlDiv, map) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '50px';
    controlUI.style.marginRight = '30px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Show Legend';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Legend';
    controlUI.appendChild(controlText);

    // Setup the click event listeners
    controlUI.addEventListener('click', function () {
        document.getElementById("legend").hidden = !document.getElementById("legend").hidden;
    });

}

function updateDist() {
    document.getElementById('info-box').textContent = `distance = ${dis.toFixed(1)}km`;
}

function CenterControl(controlDiv, map) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Center Map';
    controlUI.appendChild(controlText);

    // Setup the click event listeners
    controlUI.addEventListener('click', function () {
        map.setCenter({lat: 47.102929, lng: -88.551937});
        map.setZoom(15);
    });

}

function ResetControl(controlDiv, map) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to clear all selected segments';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Clear';
    controlUI.appendChild(controlText);

    // Setup the click event listeners
    controlUI.addEventListener('click', function () {
        map.data.forEach((feature) => {
            feature.setProperty('selected', false);
        });
        dis = 0;
        updateDist();
    });

}

function RouteSaveControl(controlDiv, map) {
    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to save selected route';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Save selected route';
    controlUI.appendChild(controlText);

    // Setup the click event listeners
    controlUI.addEventListener('click', function () {

        var mapData = map.data;                   //json object (array) of map data

        //checks if any routes are actually selected
        var sel = false;
        mapData.forEach(function (feature) {
            if (feature.getProperty('selected')) {
                sel = true;
            }
        });

        if (sel) {
            $("#myForm").show();
            //controlText.innerHTML = 'saved';

            var routeData = [];
            mapData.forEach(function (feature) {
                if (feature.getProperty('selected')) {
                    routeData.push(feature.getProperty('name'));
                    console.log(feature.getProperty('name'));
                }
            });

            document.forms["myForm"]["routeSegments"].value = routeData.toString();
            document.forms["myForm"]["distance"].value = dis;
        } else {
            alert("Please select a route");
        }
    });
}

function hideForm() {
    $("#myForm").hide();
}

loadSavedRoute = function loadSavedRoute(selectArray) {

    var mapData = map.data;

    for (var i = 0; i < selectArray.length; i++) {

        mapData.forEach(function (feature) {
            if (selectArray[i] == feature.getProperty('name')) {
                feature.setProperty('selected', true);
                dis += feature.getProperty('distance');
                updateDist();
            }
        });
    }
};
