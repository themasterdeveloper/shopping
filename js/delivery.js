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
var col_names = [];
var d = "d=" + new Date().toJSON();
var webservice_path = "/ws/delivery.php",
    record_id,
    cur_page = 0;
error = false,

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

/**
 * Logs javascript trace
 */

var log = function(name, value) {
    console.debug(name, value);
}

/**
 * Save cookie on users' computer
 *
 * @param {Object} c_description
 * @param {Object} value
 * @param {Object} exdays
 */

var setCookie = function(c_description, value, exdays) {
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

var getCookie = function(c_description) {
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

var deleteAllCookies = function() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
};

/**
 * Centers divs on screen
 */

jQuery.fn.center = function() {
    this.css("position", "absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 3) + $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
    return this;
};

var showMsg = function(text) {
    $(".alert").removeClass("alert-danger").removeClass("alert-info").addClass("alert-info");
    $(".alert #msg").html(text);
    $(".alert").show();
};

var showErr = function(text) {
    $(".alert").removeClass("alert-info").removeClass("alert-danger").addClass("alert-danger");
    $(".alert #msg").html(text);
    $(".alert").show();
};

var deliverer_login = function() {
    var data = {};

    data.action = "deliverer_login";
    //Generate data items from form fields
    $('#login').find(':input:not(button):not(reset)').each(function() {
        var $this = $(this);
        if ($this.attr("id"))
            data[$this.attr("id")] = $this.val().trim();
    });

    log("deliverer_login", data);
    $.ajax({
        data: data,
        success: function(data) {
            log("deliverer_login", data);
            if (data[0].user_id) {
                document.getElementById('id01').style.display = 'none';
                load("home.html");
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

var get_orders = function() {
    var params = {};
    params.action = "delivery_get_orders";
    params.deliverer_id = getCookie("user_id");
    log("get_orders", params);
    $.ajax({
        data: params,
        success: function(data) {
            log("get_orders", data);
            for (var i = 0; i < data.length; i++) {
                $this = data[i];
                add_orders_buttons($this);
            }
        }
    });
}

var add_orders_buttons = function(row) {
    var button = '<a href="javascript:void(0)" class="form-control btn btn-primary btn-lg btn-options" onclick="load_order(' + row["id"] + ')">';
    button += '<span class="glyphicon glyphicon-pencil"></span>';
    button += row["number"];
    button += '</a>';
    $('.data').append(button);
}

var get_order = function() {
    var params = {};
    params.action = "delivery_get_order";
    params.order_id = getCookie("order_id");
    log("get_order", params);
    $.ajax({
        data: params,
        success: function(data) {
            log("get_order", data);
            add_order_data(data[0]);
        }
    });
}

var get_address = function() {
    var params = {};
    params.action = "delivery_get_address";
    params.order_id = getCookie("order_id");
    log("get_address", params);
    $.ajax({
        data: params,
        success: function(data) {
            log("get_address", data);
            add_order_data(data[0]);
        }
    });
}

var get_shops = function() {
    var params = {};
    params.action = "delivery_get_shops";
    params.order_id = getCookie("order_id");
    log("get_shops", params);
    $.ajax({
        data: params,
        success: function(data) {
            log("get_shops", data);
            for (var i = 0; i < data.length; i++) {
                $this = data[i];
                add_shops($this);
            }
        }
    });
}

var add_order_data = function(row) {
    var field = [];
    var i = 0;
    var template = '<div class="order-data-key">{key}:';
    template += '<div class="order-data-value"><strong>{value}</strong></div>';
    for (key in row) {
        field[i] = template.replace('{key}', key).replace('{value}', row[key]);
        i++;
    }
    $('.data').html(field.join(''));
}

var add_shops = function(row) {
    var button = '<a href="javascript:void(0)" class="btn btn-success btn-md shops" onclick="load_shop_data(' + row["id"] + ')">';
    button += row["name"];
    button += '</a>';
    $('.data').append(button);
}

var load_shop_data = function(shop_id) {
    $('.items tbody').empty();
    var params = {};
    params.action = "delivery_get_shop_items";
    params.order_id = getCookie("order_id");
    params.shop_id = shop_id;
    log("load_shop_data", params);
    $.ajax({
        data: params,
        success: function(data) {
            log("load_shop_data", data);
            var tmp = [];
            var i = 0;
            tmp[i] = '<tr>';
            i++;
            for (key in data[0]) {
                tmp[i] = '<th>' + key + '</th>';
                i++;
            }
            tmp[i] = '</tr>';
            $('.items thead').html(tmp.join(''));
            var total = 0;
            for (var i = 0; i < data.length; i++) {
                $this = data[i];
                total += parseFloat(data[i].total.replace(',',''));
                add_shop_items($this);
            }
            $('.items tfoot').html('<tr><td colspan=3></td><td>' + total.toFixed(2) + '</td></tr>');
            $('.table-responsive').show();
        }
    });
}

var add_shop_items = function(row) {
    var tmp = [];
    var i = 0;
    tmp[i] = '<tr>';
    i++;
    for (key in row) {
        tmp[i] = '<td>' + row[key] + '</td>';
        i++;
    }
    tmp[i] = '</tr>';
    $('.items tbody').append(tmp.join(''));
}
