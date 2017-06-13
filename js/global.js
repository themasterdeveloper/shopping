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

/**
 * Global variables definition
 */


var webservice_path = "/ws/br.php",
    record_id,
    cur_page = 0,
    token = '',
    error = false,
    intro = false,
    HOME = "/home.html",
    sms_url = "https://www.bulksmsnigeria.net/components/com_spc/smsapi.php",
    sms_user = "nwabuezestephen27@gmail.com",
    sms_password = "Foot27ball",
    sms_sender = "iyabasira",
    received_alerts = '';

load_products = function() {
    if (token.length == 0) {
        get_token();
    }

    $(".area-message").addClass("hidden");

    var data = {};
    data.action = "products_search";
    data.search = $("#search_text").val();
    data.token = getCookie("token");
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
                            tmp[i] += "<img src='" + $this["logo"] + "' class='shop-logo'>";
                        } else {
                            tmp[i] += "<img class='shop-logo' src='/img/no-image.jpg'>";
                        }
                        tmp[i] += "<span class='area'>" + $this["area"] + "</span>";
                        tmp[i] += "<span class='product'>" + $this["product"] + "</span><br/>";
                        if ($this["image"] == '') {
                            tmp[i] += "<img class='product-image' src='/img/no-image.jpg'>";
                        } else {
                            tmp[i] += "<img class='product-image' src='" + $this["image"] + "'>";
                        }
                        tmp[i] += "<span class='price'>" + $this["price"] + "</span>";
                        tmp[i] += "<button class='buy-product-button btn btn-success btn-lg btn-order-now' onclick=buy_product(" + $this["id"] + ") >ORDER NOW</button>";
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
    $(".order-form #shop_product_id").val(product_id);
    $(".shadow").show();
    event.preventDefault();
}

add_product = function() {
    var data = {};
    data.action = "save_item";
    data.token = token;
    data.shop_product_id = $("#shop_product_id").val();
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
        showErr("Some errors were found. Please correct them in the form and try again");
    } else {
        submitForm($(form).attr("id").replace("-form", ""));
    }
};

validate_field = function(field) {
    var obj = '#' + field;
    var obj1 = '#' + field + '1';
    if ($(obj).val() == '' && $(obj).attr("isRequired") == "isRequired") {
        $(obj).closest('.form-group').removeClass('has-success has-feedback').addClass('has-error has-feedback');
        $(obj1).removeClass('glyphicon-ok').addClass('glyphicon-remove');
        error = true;
    } else {
        $(obj).closest('.form-group').removeClass('has-error has-feedback').addClass('has-success has-feedback');
        $(obj1).removeClass('glyphicon-remove').addClass('glyphicon-ok');
    }

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
            data[$this.attr("id")] = $this.val().trim().toUpperCase();
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
                notify(data[0].order_id);
                updateBasket();
                $("#content").load("/thanks");
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
                if (key == 'image') {
                    if ($this[key].length > 0) {
                        $("#" + key).attr("src", $this[key]);
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

load_shops_areas = function() {
    var data = {};
    data.action = 'get_shops_areas';
    data.area_id = getCookie('chosen-area');
    log("get_shops_areas", data);
    $.ajax({
        data: data,
        success: function(data) {
            log("get_shops_areas", data);
            var l = data.length;
            if (l == 1 && data[0].error) {
                return;
            }
            var tmp = [],
                i = 0;
            var skip_columns = "-id-";
            i = 0;
            for (r = 0; r < l; r++) {
                $this = data[r];
                i++;
                for (var key in $this) {
                    if (skip_columns.indexOf("-" + key + "-") == -1) {
                        tmp[i] = "<button class='btn btn-success btn-lg btn-shop form-control' onclick='select_shop_area(" + $this["id"] + ")'>" + $this[key] + "</button>";
                        i++;
                    }
                }
                i++;
            }
            $("#shops-table").empty().append(tmp.join(''));
            $(".shops-container").show();
        }
    });
}

updateBasket();

store_values = function() {
    var $inputs = $('form :input');
    $inputs.each(function() {
        setCookie(this.id, $(this).val());
    });
}

restore_values = function() {
    var $inputs = $('form :input');
    $inputs.each(function() {
        $("#" + this.id).val(getCookie(this.id));
    });
}
