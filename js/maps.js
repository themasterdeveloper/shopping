const FAST_FOOD = '/img/rsz_fastfood-pin-2.png';
const DELIVERY_MAN = '/img/fastfood-worker-64-255355.png';

save_area_location = function(area_id, lat, lng) {
    var data = {};
    data.action = "save_area_location";
    data.area_id = area_id;
    data.lat = lat;
    data.lng = lng;
    log("save_area_location", data);
    $.ajax({
        data: data,
        dataType: 'json',
        success: function(data) {
            log("save_area_location", data);
            if (data[0].error != 0) {
                showErr(data[0].message);
            } else {
                showMsg(data[0].message);
            }
        }
    });
}

save_shop_location = function(area_id, shop_id, lat, lng) {
    var data = {};
    data.action = "save_shop_location";
    data.area_id = area_id;
    data.shop_id = shop_id;
    data.lat = lat;
    data.lng = lng;
    log("save_shop_location", data);
    $.ajax({
        data: data,
        dataType: 'json',
        success: function(data) {
            log("save_shop_location", data);
            if (data[0].error != 0) {
                showErr(data[0].message);
            } else {
                showMsg(data[0].message);
                update_markers();
            }
        }
    });
}

load_shops_locations = function(area_id) {
    var data = {};
    data.action = "shops_locations_list";
    data.area_id = 0;
    log("load_shops_locations", data);
    $.ajax({
        data: data,
        success: function(data) {
            log("load_shops_locations", data);
            setMarkers(data, 'shop', FAST_FOOD);
        }
    });
}

load_deliverers_locations = function(area_id) {
    var data = {};
    data.action = "deliverers_list";
    log("deliverers_list", data);
    $.ajax({
        data: data,
        success: function(data) {
            log("deliverers_list", data);
            setMarkers(data, 'name', DELIVERY_MAN);
        }
    });
}

setMarkers = function(list, field, image) {
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var siteLatLng = new google.maps.LatLng(item["lat"], item["lng"]);
        createMarker(siteLatLng, field, image, item);
    }
}

createMarker = function(latlng, field, image, data) {
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: data[field],
        icon: image
    });
    marker.set('id', data['id']);
    marker.addListener('click', function() {
        $('#item_id').val(data['id']);
        showMarkerData(data);
    });
    markers.push(marker);
}

showMarkerData = function(data) {
    var html = '';
    $this = data[0];
    var skip_columns = "-id-lat-lng-photo-available-";
    for (var key in data) {
        if (skip_columns.indexOf("-" + key + "-") == -1) {
            html += '<span class="_data-value">';
            html += data[key];
            html += '</span></br>';
        }
    }
    $('.marker-data').html(html);
}

remove_markers = function() {
    for (i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

close_infowindows = function() {
    for (i = 0; i < infowindows.length; i++) {
        infowindows[i].close();
    }
}

relocateMap = function() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            //map.setCenter(initialLocation);
            me_marker.setPosition(initialLocation);
        });
    }
}
