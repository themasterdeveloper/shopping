"use strict";

var maps = {
    ICON_FAST_FOOD: '/img/rsz_fastfood-pin-2.png',
    ICON_DELIVERY_MAN: '/img/fastfood-worker-64-255355.png',

    save_area_location: function(area_id, lat, lng) {
        var data = {
            action: "save_area_location",
            area_id: area_id,
            lat: lat,
            lng: lng
        }

        common.log("save_area_location", data);

        $.ajax({
            data: data,
            dataType: 'json',
            success: function(data) {
                common.log("save_area_location", data);
                if (data[0].error != 0) {
                    common.showErr(data[0].message);
                } else {
                    showMsg(data[0].message);
                }
            }
        });
    },

    save_shop_location: function(area_id, shop_id, lat, lng) {
        var data = {
            action: "save_shop_location",
            area_id: area_id,
            shop_id: shop_id,
            lat: lat,
            lng: lng
        }

        common.log("save_shop_location", data);

        $.ajax({
            data: data,
            dataType: 'json',
            success: function(data) {
                common.log("save_shop_location", data);
                if (data[0].error != 0) {
                    common.showErr(data[0].message);
                } else {
                    showMsg(data[0].message);
                    maps.update_markers();
                }
            }
        });
    },

    load_shops_locations: function(area_id) {
        var data = {
            action: "shops_locations_list",
            area_id: 0
        }

        common.log("load_shops_locations", data);

        $.ajax({
            data: data,
            success: function(data) {
                common.log("load_shops_locations", data);
                maps.setMarkers(data, 'shop', maps.FAST_FOOD);
            }
        });
    },

    load_deliverers_locations: function(area_id) {
        var data = {
            action: "deliverers_list"
        }

        common.log("deliverers_list", data);

        $.ajax({
            data: data,
            success: function(data) {
                common.log("deliverers_list", data);
                maps.setMarkers(data, 'name', maps.DELIVERY_MAN);
            }
        });
    },

    setMarkers: function(list, field, image) {
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var siteLatLng = new google.maps.LatLng(item["lat"], item["lng"]);
            maps.createMarker(siteLatLng, field, image, item);
        }
    },

    createMarker: function(latlng, field, image, data) {
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: data[field],
            icon: image
        });
        marker.set('id', data['id']);
        marker.addListener('click', function() {
            $('#item_id').val(data['id']);
            maps.showMarkerData(data);
        });
        markers.push(marker);
    },

    showMarkerData: function(data) {
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
    },

    remove_markers: function() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    },

    close_infowindows: function() {
        for (var i = 0; i < infowindows.length; i++) {
            infowindows[i].close();
        }
    },

    relocateMap: function() {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                lat = position.coords.latitude;
                lng = position.coords.longitude;
                initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                //map.setCenter(initialLocation);
                me_marker.setPosition(initialLocation);
            });
        }
    },

    update_markers: function() {

        maps.remove_markers();
        maps.load_shops_locations(0);
    },

    save_location: function(pos) {
        var data = {
            action: "save_location",
            token: cookies.getCookie("token"),
            lat: pos.lat,
            lng: pos.lng
        }

        common.log("save_location", data);

        $.ajax({
            data: data,
            success: function(data) {
                common.log("save_location", data);
            },
            error: function(data) {
                common.log("save_location.error", data);
            }
        });
    },

    update_deliverer_location: function(pos) {
        var data = {
            action: "update_deliverer_location",
            token: cookies.getCookie("deliverer_id"),
            lat: pos.lat,
            lng: pos.lng
        }

        common.log("update_deliverer_location", data);

        $.ajax({
            data: data,
            success: function(data) {
                common.log("update_deliverer_location", data);
            },
            error: function(data) {
                common.log("update_deliverer_location.error", data);
            }
        });
        setTimeout(function() {
            update_deliverer_location();
        }, 10000);
    }
}
