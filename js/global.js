/**
 * @summary     Shopping web app
 * @description Functionalities for the user interface and management
 * @version     1.0.0
 * @file        global.js
 * @author      Omar Melendrez (www.escng.com)
 * @contact     omar.melendrez@gmail.com
 *
 * @copyright Copyright 2017 Omar Melendrez, all rights reserved.
 *
 */

window.onerror = function(message, filename, linenumber) {
    log("JavaScript error: " + message + " on line " + linenumber + " for " + filename);
};

/**
 * Global variables definition
 */

var d = "d=" + new Date().toJSON();
var webservice_path = "/ws/br.php",
    record_id,
    cur_page = 0;
token = '',
    error = false,
    intro = false,
    HOME = "/home.html",
    sms_url = "https://www.bulksmsnigeria.net/components/com_spc/smsapi.php",
    sms_user = "nwabuezestephen27@gmail.com",
    sms_password = "Foot27ball",
    sms_sender = "iyabasira";


/**
 * Logs javascript trace
 */

var log = function(name, value) {
    if (getCookie("Debug") == "True")
        console.debug(name, value);
}

/**
 * Save cookie on users' computer
 *
 * @param {Object} c_description
 * @param {Object} value
 * @param {Object} exdays
 */

setCookie = function(c_description, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : ";path=/;expires=" + exdate.toUTCString());
    document.cookie = c_description + "=" + c_value;
};

/**
 * Reads cookie from users' computer
 *
 * @param {Object} c_description
 */

getCookie = function(c_description) {
    var c_value = document.cookie;
    //    log("getCookie.document.cookie: " + c_description);

    var c_start = c_value.indexOf(" " + c_description + "=");
    if (c_start == -1) {
        c_start = c_value.indexOf(c_description + "=");
    }
    if (c_start == -1) {
        c_value = null;
    } else {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1) {
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start, c_end));
    }
    return c_value;
};

deleteAllCookies = function() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
};

showMsg = function(text) {
    $(".alert").removeClass("alert-danger").removeClass("alert-info").addClass("alert-info");
    $(".alert #msg").html(text);
    $(".alert").show();
};

showErr = function(text) {
    $(".alert").removeClass("alert-info").removeClass("alert-danger").addClass("alert-danger");
    $(".alert #msg").html(text);
    $(".alert").show();
};

pad = function(val, len) {
    val = String(val);
    len = len || 2;
    while (val.length < len)
        val = "0" + val;
    return val;
};

/*
$(function() {
    var nua = navigator.userAgent;
    var isAndroid = (nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1 && nua.indexOf('Chrome') === -1);
    if (isAndroid) {
        $('select.form-control').removeClass('form-control').css('width', '100%');
    }
});
*/

/**
 * Centers divs on screen
 */

jQuery.fn.center = function() {
    this.css("position", "absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 3) + $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
    return this;
};

/**
 * Converts any form into a JSON object
 */

$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function GetParameterValues(param) {
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < url.length; i++) {
        var urlparam = url[i].split('=');
        if (urlparam[0] == param) {
            return urlparam[1];
        }
    }
}

function toggleFullScreen() {
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {

        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else
        if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        } else
        if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else
        if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else
        if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else
        if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else
        if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}

/**
 * Global setup for Ajax calls
 *
 */
$.ajaxSetup({
    type: 'GET',
    url: webservice_path,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    cache: true,
    async: true,
    timeout: 0, // Timeout of 60 seconds
    error: function(xhr, errorThrown) {
        log_ajax_error(xhr, errorThrown);
    }
});
// Close $.ajaxSetup()

/**
 * Shows/hides loading gif based on
 * Ajax status
 *
 */

$(document).ajaxStart(function() {
    $('.fa').show().center();
});

$(document).ajaxStop(function() {
    $('.fa').fadeOut('slow');
});

$(document).ajaxError(function() {
    setTimeout(function() {
        $('.fa').fadeOut('slow');
        //        location.href = location.href;
    }, 3000);
});

log_ajax_error = function(xhr, errorThrown) {
    log(xhr);
    showErr('We are sorry, but there was an error accessing the database');
    //showErr('An error occurred! [' + xhr.responseText + '] ' + ( errorThrown ? errorThrown : xhr.status));
};

validate_form = function(form) {
    $(".alert").hide();
    var l = form.length;
    var name = "";
    error = false;
    for (var i = 0; i < l; i++) {
        name = form[i].name;
        if (name != '') {
            validate_field(name);
        }
    }
    if (error) {
        showErr("Some errors were found. Please correct them and try again");
    } else {
        save_ticket();
    }
};

validate_field = function(field) {
    var obj = '#' + field;
    var obj1 = '#' + field + '1';
    if ($(obj).val() == '') {
        $(obj).closest('.form-group').removeClass('has-success has-feedback').addClass('has-error has-feedback');
        $(obj1).removeClass('glyphicon-ok').addClass('glyphicon-remove');
        error = true;
    } else {
        $(obj).closest('.form-group').removeClass('has-error has-feedback').addClass('has-success has-feedback');
        $(obj1).removeClass('glyphicon-remove').addClass('glyphicon-ok');
    }

};

load_products = function() {
    if (token.length == 0) {
        get_token();
    }

    $(".area-message").addClass("hidden");

    var data = {};
    data.action = "products_search";
    data.search = $("#search_text").val();
    data.token = getCookie("token");
    data.area_id = getCookie("chosen-area");
    data.shop_area_id = getCookie("shop-area-id");
    log("load_products", data);

    $(".alert").hide();

    $.ajax({

        data: data,
        success: function(data) {

            log("load_products", data);

            if (data[0].error == 1) {
                $("#dashboard-table").empty();
                showErr(data[0].message);

                return false;
            }

            var l = data.length;

            var tmp = [],
                i = 0;

            var skip_columns = "-total_rows-";

            for (r = 0; r < l; r++) {
                $this = data[r];

                tmp[i] = "<div class='list-group'>";
                i++;
                for (var key in $this) {
                    if (skip_columns.indexOf("-" + key + "-") == -1) {
                        tmp[i] = "<div href='#' class='list-group-item it-" + $this["id"] + "'>";
                        if ($this["logo"] != '') {
                            tmp[i] += "<img src='/img/" + $this["logo"] + "' class='shop-logo'>";
                        }
                        tmp[i] += "<span class='area'>" + $this["area"] + "</span>";
                        tmp[i] += "<span class='product'>" + $this["product"] + "</span><br/>";
                        if ($this["image"] == '') {
                            tmp[i] += "<img class='product-image' src='/img/no-image.jpg'>";
                        } else {
                            tmp[i] += "<img class='product-image' src='/img/" + $this["image"] + "'>";
                        }
                        tmp[i] += "<span class='price'>" + $this["price"] + "</span>";
                        tmp[i] += "<button class='buy-product-button btn btn-success btn-lg' onclick=buy_product(" + $this["id"] + ") >ORDER NOW</button>";
                        tmp[i] += "</div>";
                    }
                }
                tmp[i] += "</div>";
                // List-group
                i++;
            }

            $("#dashboard-table").empty().append(tmp.join('')).show();
            $(".table-responsive").show();
            $(".search-box").show();

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    save_location(pos);
                });
            }

        }
    });
    updateBasket();
    log("listCookies", listCookies());
};

get_token = function() {
    if (getCookie("token")) {
        token = getCookie("token");
        $("#token").val(token);
        return;
    }
    var data = {};
    data.action = "get_token";
    data.area_id = getCookie("chosen-area");

    log("get_token", data);

    $.ajax({
        data: data,
        success: function(data) {
            log("get_token", data);
            token = data[0].token;
            $("#token").val(token);
            setCookie('token', token);
        }
    });
}

buy_product = function(product_id) {
    var caller = "it-" + product_id;
    var pos = $("." + caller).position();
    $("#quantity").val(1);
    $(".order-form").css("top", pos.top + 32).show();
    $(".order-form #product_id").val(product_id);
    $(".shadow").show();
    event.preventDefault();
}

add_product = function() {
    var data = {};
    data.action = "save_item";
    data.token = token;
    data.product_id = $("#product_id").val();
    data.quantity = $("#quantity").val();
    log("add_product", data);
    $.ajax({
        data: data,
        success: function(data) {
            log("add_product", data);
            var results = data[0];
            if (results.error == 0) {
                $(".order-form").hide();
                $(".shadow").hide();
            } else {
                if (results.error == 2) {
                    resetToken();
                };
                $(".error_message").html(results.message).show();
            }
            updateBasket();
            load_products();
        }
    });
    //event.preventDefault();
}

updateBasket = function() {
    var data = {};
    data.action = "get_total_basket";
    data.token = getCookie("token");
    log("updateBasket", data);
    $.ajax({
        data: data,
        success: function(data) {
            log("updateBasket", data);
            var results = data[0];
            var total_basket = results.grand_total;
            $(".basket").html(total_basket);
            setCookie("total_basket", results.total_basket);
            setCookie("total_fees", results.total_fees);
            setCookie("delivery_fees", results.delivery_fees);
            setCookie("grand_total", results.grand_total);
            if (parseFloat(total_basket) > 0) {
                $(".basket").parent().removeClass("hidden");
            } else {
                $(".basket").parent().addClass("hidden");
            }
        }
    });
}

function listCookies() {
    var theCookies = document.cookie.split(';');
    var o = {};
    for (var i = 0; i < theCookies.length; i++) {
        var name_value = theCookies[i].split("=");
        var name = name_value[0].replace(/^ /, '');
        var value = name_value[1];
        if (o[name] !== undefined) {
            if (!o[name].push) {
                o[name] = [o[name]];
            }
            o[name].push(value || '');
        } else {
            o[name] = value || '';
        }
    }
    return o;
}

load_basket_products = function() {

    var data = {};
    user_id = 0;
    data.action = "basket_list";
    data.token = getCookie("token");

    log("load_basket_products", data);
    updateBasket();

    $.ajax({

        data: data,
        success: function(data) {

            log("load_basket_products", data);

            if (data[0].error == 1) {
                $("#content").load(HOME);
                return;
            }

            var tmp = [],
                header = [],
                i = 0;

            var skip_columns = "-id-area-";

            header[i] = "<tr>";
            $this = data[0];
            for (var key in $this) {
                if (skip_columns.indexOf("-" + key + "-") == -1) {
                    header[i] = "<th class='" + "__" + key + "'>" + key + "</th>";
                    i++;
                }
            }
            header[i] = "</tr>";

            i = 0;
            var l = data.length;
            for (r = 0; r < l; r++) {
                $this = data[r];
                tmp[i] = "<tr>";
                i++;
                for (var key in $this) {
                    if (skip_columns.indexOf("-" + key + "-") == -1) {
                        if (key == 'shop') {
                            tmp[i] = "<td class='" + "__" + key + "'>" + $this[key] + "<br>" + $this["area"] + "</td>";
                        } else {
                            tmp[i] = "<td class='" + "__" + key + "'>" + $this[key] + "</td>";
                        }
                        i++;
                    }
                }
                tmp[i] = "<td><a href='#' onclick=removeItem(" + $this["id"] + ")><span class='glyphicon glyphicon-remove'></span></td></a></tr>";
                i++;
            }
            $("#basket-table thead").empty().append(header.join(''));
            $("#basket-table tbody").empty().append(tmp.join(''));
            i = 0;
            tmp.length = 0;
            tmp[i] = "<tr><td colspan=3  class='_amount _top_line'>TOTAL BASKET</td><td class='_amount _top_line'>" + getCookie("total_basket") + "</td><td  class='_top_line'></td></tr>";
            i++;
            //tmp[i] = "<tr><td colspan=3  class='_amount'>10% FEES</td><td class='_amount'>" + getCookie("total_fees") + "</td><td></td></tr>";
            //i++;
            tmp[i] = "<tr><td colspan=3  class='_amount'>DELIVERY</td><td class='_amount'>" + getCookie("delivery_fees") + "</td><td></td></tr>";
            i++;
            tmp[i] = "<tr><td colspan=3  class='_amount _grand_total'>TOTAL ORDER</td><td class='_amount  _grand_total'>" + getCookie("grand_total") + "</td><td class='_amount  _grand_total'></td></tr>";

            $("#basket-table tfoot").empty().append(tmp.join(''));

            $(".table-responsive").show();
        }
    });

};

removeItem = function(item_id) {
    var data = {};
    data.action = "remove_item";
    data.item_id = item_id;
    log("removeItem", data);
    $.ajax({
        data: data,
        success: function(data) {
            log("removeItem", data);
            load_basket_products();
        }
    });
};


removeAll = function() {
    var data = {};
    data.action = "remove_all";
    data.token = getCookie("token");

    log("removeAll", data);

    $.ajax({
        data: data,
        success: function(data) {
            log("removeAll", data);
            load_basket_products();
        }
    });
};

resetToken = function() {
    token = "";
    $("#token").val(token);
    deleteAllCookies();
    get_token();
}

get_areas = function() {
    var data = {};
    data.action = "get_areas";

    log("get_areas", data);

    $.ajax({
        data: data,
        success: function(data) {
            log("get_areas", data);
            $(".areas-list").html(data[0].areas);
        }
    });
}

save_location = function(pos) {
    var data = {};
    data.action = "save_location";
    data.token = getCookie("token");
    data.lat = pos.lat;
    data.lng = pos.lng;
    log("save_location", data);
    $.ajax({
        data: data,
        success: function(data) {
            log("save_location", data);
        },
        error: function(data) {
            log("save_location.error", data);
        }
    });
}

load_dropdown = function(object, empty, disabled) {
    empty = (typeof empty === 'undefined') ? false : empty;
    disabled = (typeof disabled === 'undefined') ? false : disabled;
    var data = {};
    data.action = object + "_list";
    log("load_" + object, data);
    var msg = 'Nothing selected';
    switch (object) {
        case "areas":
            msg = 'Select an area';
            break;
        case "category":
            msg = 'Select a category';
            break;
    }
    $.ajax({
        data: data,
        success: function(data) {
            log("load_" + object, data);
            var tmp = [];
            var l = data.length;
            if (empty == 1) {
                var tmpEmpty = "<option></option>";
            }
            for (r = 0; r < l; r++) {
                $this = data[r];
                tmp[r] = tmpEmpty + "<option value=" + $this["id"] + ">" + $this["value"] + "</option>";
                tmpEmpty = "";
            }
            $("." + object).html(tmp.join('')).selectpicker({
                noneSelectedText: msg
            }).selectpicker('refresh');
            if (disabled) {
                $("." + object).prop('disabled', true);
                $("." + object).selectpicker('refresh');
            }
        }
    });
};

var submitForm = function(object) {
    var action = object + "_save";
    var form = object + "-form";
    var data = {};

    data.action = action;
    data.token = getCookie("token");

    data.area_id = getCookie("chosen-area");
    //Generate data items from form fields

    $('#' + form).find(':input:not(button):not(reset)').each(function() {
        var $this = $(this);
        if ($this.attr("id"))
            data[$this.attr("id")] = uppercase($this.val().trim());
    });

    log("submitForm", data);
    $.ajax({
        data: data,
        success: function(data) {
            log("submitForm", data);
            if (data[0].error != 0) {
                showErr(data[0].message);
            } else {
                showMsg(data[0].message);
                setCookie("order_id", data[0].order_id);
                //notify(data[0].order_id);
                $("#content").load("/geolocation");
            }
        }
    });
};

var login = function() {
    var data = {};

    data.action = "login";
    //Generate data items from form fields
    $('#login').find(':input:not(button):not(reset)').each(function() {
        var $this = $(this);
        if ($this.attr("id"))
            data[$this.attr("id")] = $this.val().trim();
    });

    log("login", data);
    $.ajax({
        data: data,
        success: function(data) {
            log("login", data);
            if (data[0].user_id) {
                document.getElementById('id01').style.display = 'none';
                $(".navbar").removeClass("hidden");
                $this = data[0];
                for (key in $this) {
                    setCookie(key, $this[key]);
                }
            } else {
                showErr("Email or password incorrect");
            }
        }
    });
};

notify = function(order_id) {

    // Email & SMS notification
    var data = {};
    data.action = "order_notify";
    data.order_id = order_id;
    log("notify", data);
    $.ajax({
        data: data,
        success: function(data) {
            log("notify", data);
        }
    });
}

get_config_value = function(name) {
    var data = {};
    data.action = "get_config_value";
    data.name = name;
    log("get_config_value", data);
    $.ajax({
        data: data,
        dataType: 'json',
        success: function(data) {
            log("get_config_value", data);
            setCookie(name, data[0].value);
        }
    });
}

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
            setMarkers(data, 'shop', '/img/rsz_fastfood-pin.png');
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
            setMarkers(data, 'name', '/img/fastfood-worker-24-255355.png');
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

adm_load_table = function(table, read_only) {
    read_only = (typeof read_only === 'undefined') ? false : read_only;
    $(".table-name").html(table.replace('_', ' / '));
    $(".alert").hide();
    if (getCookie("cur_page")) {
        cur_page = parseInt(getCookie("cur_page"));
    }
    if (getCookie("rows_per_page")) {
        rows_per_page = parseInt(getCookie("rows_per_page"));
    }
    var data = {};
    data.action = 'adm_load_table_' + table;
    data.search = $("#search").val();
    data.limit = cur_page;
    data.rows = rows_per_page;
    log("load_table", data);
    $.ajax({
        data: data,
        success: function(data) {
            log("load_table", data);
            if (data[0].error == 1) {
                $("#" + table + "-table tbody").empty();
                $("#" + table + "-table tbody").empty();
                $("#" + table + "-table tfood").empty();
                showErr(data[0].message);
                return false;
            }
            var skip_columns = "-id-active-total_records-";

            var l = data.length;
            var cols = 0;
            var tmp = [],
                i = 0;
            $this = data[0];
            var total_records = $this["total_records"];
            // thead
            tmp[i] = "<tr>";
            i++;
            for (var key in $this) {
                if (skip_columns.indexOf("-" + key + "-") == -1) {
                    tmp[i] = "<th class='__" + key.replace(' ', '_') + "'>" + key + "</th>";
                    i++;
                    cols++;
                }
            }
            if (!read_only) {
                tmp[i] = '<th></th>';
                i++;
                cols++;
            }
            tmp[i] = "</tr>";
            $("#" + table + "-table thead").empty().append(tmp.join(''));

            // tbody
            tmp = [];
            i = 0;
            for (r = 0; r < l; r++) {
                $this = data[r];
                tmp[i] = "<tr>";
                i++;
                for (var key in $this) {
                    if (skip_columns.indexOf("-" + key + "-") == -1) {
                        tmp[i] = "<td class='__" + key.replace(' ', '_') + "'>" + $this[key] + "</td>";
                        i++;
                    }
                }
                if (!read_only) {
                    tmp[i] = '<td class="button-group">';
                    i++
                    if ($this["active"] == 0) {
                        tmp[i] = '<button class="btn btn-danger btn-sm delete-item" onclick="adm_delete_item(' + $this["id"] + ',\'' + table + '\')">Delete</button>';
                        i++
                    }
                    tmp[i] = '<button class="btn btn-primary btn-sm edit-item" onclick="adm_edit_item(' + $this["id"] + ',\'' + table + '\')">Edit</button>';
                    i++
                    tmp[i] = '</td>';
                    i++
                }
                tmp[i] = "</tr>";
                i++;
            }
            $("#" + table + "-table tbody").empty().append(tmp.join(''));

            var footer = '';
            var span = parseInt(cols);
            footer += '<tr><td colspan=' + span + '>';
            if (cur_page > 0) {
                footer += '<button class= "btn btn-success btn-md pull-left btn-prev table-button">Prev</button>';
            } else {
                footer += '<button class= "btn btn-success btn-md pull-left disabled table-button">Prev</button>';
            }
            var page = parseInt(cur_page) + 1
            footer += "Page " + page;

            if (cur_page < parseInt(total_records / rows_per_page)) {
                footer += '<button class= "btn btn-success btn-md pull-right btn-next">Next</button>';
            } else {
                footer += '<button class= "btn btn-success btn-md pull-right disabled">Next</button>';
            }
            footer += '<br/>' + total_records + ' records';
            footer += '</td></tr>';

            $("#" + table + "-table tfoot").empty().append(footer);

            $(".btn-prev").on("click", function(e) {
                e.preventDefault();
                setCookie("cur_page", cur_page - 1);
                adm_load_table(table, read_only);
            })

            $(".btn-next").on("click", function(e) {
                e.preventDefault();
                setCookie("cur_page", cur_page + 1);
                adm_load_table(table, read_only);
            })

        }
    });
}

adm_edit_item = function(item_id, table) {
    $("#item_id").val(item_id);
    fillForm(item_id, table);
}

fillForm = function(item_id, table) {
    var data = {};
    data.action = 'get_table_record';
    data.table = table;
    data.item_id = item_id;
    log("get_table_record", data);
    $.ajax({
        data: data,
        success: function(data) {
            log("get_table_record", data);
            $this = data[0];
            for (var key in $this) {
                if (key == 'image' || key == 'logo') {
                    if ($this[key].length > 0) {
                        $("#" + key).attr("src", "/img/" + $this[key]);
                    } else {
                        $("#" + key).attr("src", "/img/no-image.jpg");
                    }
                } else {
                    $("#" + key).val($this[key]);
                }
            }
            if (table == 'shop_product') {
                $(".selectpicker").prop('disabled', true);
                $("#availability").prop('disabled', false);
            }
            $('.selectpicker').selectpicker('refresh');
            $("." + table + "-list").addClass("hidden");
            $("." + table + "-form").removeClass("hidden");
        }
    });
}

var adm_delete_item = function(item_id, table) {
    var data = {};
    data.action = 'delete_table_record';
    data.table = table;
    data.item_id = item_id;
    log("get_table_data", data);
    $.ajax({
        data: data,
        success: function(data) {
            log("adm_delete_item", data);
            if (data[0].error != 0) {
                showErr(data[0].message);
            } else {
                adm_load_table(table);
            }
        }
    });
}

var saveData = function(object) {
    var action = object + "_save";
    var form = object + "-form";
    var data = {};
    data.action = action;
    $('#' + form).find(':input:not(button):not(reset)').each(function() {
        var $this = $(this);
        if ($this.attr("id"))
            data[$this.attr("id")] = $this.val().trim();
    });
    log("saveData", data);
    $.ajax({
        data: data,
        success: function(data) {
            log("saveData", data);
            if (data[0].error != 0) {
                showErr(data[0].message);
            } else {
                showMsg(data[0].message);
                setCookie("record_id", data[0].record_id);
                $("." + object + "-list").removeClass("hidden");
                $("." + object + "-form").addClass("hidden");
                adm_load_table(object);
            }
        }
    });
};
