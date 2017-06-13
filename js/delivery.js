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

var col_names = [];

var webservice_path = "/ws/delivery.php",
    record_id,
    cur_page = 0,
    error = false;

$.ajaxSetup({
    url: webservice_path
});

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
            setCookie("order_status", data[0].status);
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
                total += parseFloat(data[i].total.replace(',', ''));
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

var order_picked = function(row) {
    var params = {};
    params.action = "delivery_order_picked";
    params.order_id = getCookie("order_id");
    log("delivery_order_picked", params);
    $.ajax({
        data: params,
        success: function(data) {
            log("order_picked", data);
            $('.go-picked').addClass("hidden");
            load('order');
        }
    });
}

var order_delivered = function(row) {
    var params = {};
    params.action = "delivery_order_delivered";
    params.order_id = getCookie("order_id");
    log("delivery_order_delivered", params);
    $.ajax({
        data: params,
        success: function(data) {
            log("delivery_order_delivered", data);
            $('.go-delivered').addClass("hidden");
            load('order');
        }
    });
}
