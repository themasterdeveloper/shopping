"use strict";

var shop = {

    data: {
        intro: false
    },

    init: function() {
        $.ajaxSetup({
            url: shop.url
        });

        if (auth.data.token.length == 0) {
            auth.get_token();
        }

    },

    url: "/ws/br.php",

    HOME: "/home.html",
    sms_url: "https://www.bulksmsnigeria.net/components/com_spc/smsapi.php",
    sms_user: "nwabuezestephen27@gmail.com",
    sms_password: "Foot27ball",
    sms_sender: "iyabasira",

    load_products: function() {
        if (auth.data.token.length == 0) {
            auth.get_token();
        }

        $(".area-message").addClass("hidden");

        var data = {
            action: "products_search",
            search: $("#search_text").val(),
            token: auth.data.token,
            shop_area_id: cookies.getCookie("shop-area-id")
        }

        common.log("load_products", data);

        $.ajax({

            data: data,
            success: function(data) {

                common.log("load_products", data);

                if (data[0].error == 1) {
                    $("#dashboard-table").empty();
                    common.showErr(data[0].message);

                    return false;
                }

                var l = data.length;

                var tmp = [],
                    i = 0;

                var skip_columns = "-total_rows-";

                for (var r = 0; r < l; r++) {
                    var $this = data[r];

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
                            tmp[i] += "<button class='buy-product-button btn btn-success btn-lg btn-order-now' onclick=shop.buy_product(" + $this["id"] + ") >ORDER NOW</button>";
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
                        maps.save_location(pos);
                    });
                }

            }
        });
        shop.updateBasket();
    },

    buy_product: function(product_id) {
        event.preventDefault();
        var caller = "it-" + product_id;
        var pos = $("." + caller).position();
        $("#quantity").val(1);
        $(".order-form").css("top", pos.top + 32).show();
        $(".order-form #shop_product_id").val(product_id);
        $(".shadow").show();
    },

    add_product: function() {

        var data = {
            action: "save_item",
            token: auth.data.token,
            shop_product_id: $("#shop_product_id").val(),
            quantity: $("#quantity").val()
        }

        common.log("add_product", data);

        $.ajax({
            data: data,
            success: function(data) {
                common.log("add_product", data);
                var results = data[0];
                if (results.error == 0) {
                    $(".order-form").hide();
                    $(".shadow").hide();
                } else {
                    if (results.error == 2) {
                        auth.resetToken();
                    };
                    $(".error_message").html(results.message).show();
                }
                shop.updateBasket();
                shop.load_products();
            }
        });
    },

    updateBasket: function() {
        var data = {
            action: "get_total_basket",
            token: auth.data.token
        }

        common.log("updateBasket", data);

        $.ajax({
            data: data,
            success: function(data) {
                common.log("updateBasket", data);
                var results = data[0];
                var total_basket = results.grand_total;
                $(".basket").html(total_basket);
                cookies.setCookie("total_basket", results.total_basket);
                cookies.setCookie("total_fees", results.total_fees);
                cookies.setCookie("delivery_fees", results.delivery_fees);
                cookies.setCookie("grand_total", results.grand_total);
                if (parseFloat(total_basket) > 0) {
                    $(".basket").parent().removeClass("hidden");
                    $(".alerts-button").css({
                        "right": "150px"
                    });
                } else {
                    $(".basket").parent().addClass("hidden");
                    $(".alerts-button").css({
                        "right": "0px"
                    });
                }
            }
        });
    },

    load_basket_products: function() {

        var user_id = 0;
        var data = {
            action: "basket_list",
            token: auth.data.token
        }

        common.log("load_basket_products", data);

        shop.updateBasket();

        $.ajax({

            data: data,
            success: function(data) {

                common.log("load_basket_products", data);

                if (data[0].error == 1) {
                    $("#content").load(shop.HOME);
                    return;
                }

                var tmp = [],
                    header = [],
                    i = 0;

                var skip_columns = "-id-area-";

                header[i] = "<tr>";
                var $this = data[0];
                for (var key in $this) {
                    if (skip_columns.indexOf("-" + key + "-") == -1) {
                        header[i] = "<th class='" + "__" + key + "'>" + key + "</th>";
                        i++;
                    }
                }
                header[i] = "</tr>";

                i = 0;
                var l = data.length;
                for (var r = 0; r < l; r++) {
                    var $this = data[r];
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
                    tmp[i] = "<td><a href='#' onclick=shop.removeItem(" + $this["id"] + ")><span class='glyphicon glyphicon-remove'></span></td></a></tr>";
                    i++;
                }
                $("#basket-table thead").empty().append(header.join(''));
                $("#basket-table tbody").empty().append(tmp.join(''));
                i = 0;
                tmp.length = 0;
                tmp[i] = "<tr><td colspan=3  class='_amount _top_line'>TOTAL BASKET</td><td class='_amount _top_line'>" + cookies.getCookie("total_basket") + "</td><td  class='_top_line'></td></tr>";
                i++;
                //tmp[i] = "<tr><td colspan=3  class='_amount'>10% FEES</td><td class='_amount'>" + cookies.getCookie("total_fees") + "</td><td></td></tr>";
                //i++;
                tmp[i] = "<tr><td colspan=3  class='_amount'>DELIVERY</td><td class='_amount'>" + cookies.getCookie("delivery_fees") + "</td><td></td></tr>";
                i++;
                tmp[i] = "<tr><td colspan=3  class='_amount _grand_total'>TOTAL ORDER</td><td class='_amount  _grand_total'>" + cookies.getCookie("grand_total") + "</td><td class='_amount  _grand_total'></td></tr>";

                $("#basket-table tfoot").empty().append(tmp.join(''));

                $(".table-responsive").show();
            }
        });

    },

    removeItem: function(item_id) {
        var data = {
            action: "remove_item",
            item_id: item_id
        }

        common.log("removeItem", data);

        $.ajax({
            data: data,
            success: function(data) {
                common.log("removeItem", data);
                shop.load_basket_products();
            }
        });
    },

    removeAll: function() {
        var data = {
            action: "remove_all",
            token: cookies.getCookie("token")
        }

        common.log("removeAll", data);

        $.ajax({
            data: data,
            success: function(data) {
                common.log("removeAll", data);
                shop.load_basket_products();
            }
        });
    },

    get_areas: function() {
        var data = {
            action: "get_areas"
        }

        common.log("get_areas", data);

        $.ajax({
            data: data,
            success: function(data) {
                common.log("get_areas", data);
                $(".areas-list").html(data[0].areas);
            }
        });
    },

    load_dropdown: function(object, empty, disabled) {
        empty = (typeof empty === 'undefined') ? false : empty;
        disabled = (typeof disabled === 'undefined') ? false : disabled;
        var data = {
            action: object + "_list"
        }

        common.log("load_" + object, data);

        var msg = 'Nothing selected';
        switch (object) {
            case "areas":
                msg = 'Click here to select an area';
                break;
            case "category":
                msg = 'Select a category';
                break;
        }
        $.ajax({
            data: data,
            success: function(data) {
                common.log("load_" + object, data);
                var tmp = [];
                var l = data.length;
                if (empty) {
                    var tmpEmpty = "<option></option>";
                }
                for (var r = 0; r < l; r++) {
                    var $this = data[r];
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
    },

    validate_form: function(form) {
        $(".alert").hide();
        var l = form.length;
        var name = "";
        var error = false;
        for (var i = 0; i < l; i++) {
            name = form[i].name;
            if (name != '') {
                shop.validate_field(name);
            }
        }
        if (error) {
            common.showErr("Some errors were found. Please correct them in the form and try again");
        } else {
            shop.submitForm($(form).attr("id").replace("-form", ""));
        }
    },

    validate_field: function(field) {
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
    },

    submitForm: function(object) {
        var action = object + "_save";
        var form = object + "-form";
        var data = {
            action: action,
            token: cookies.getCookie("token"),
            area_id: cookies.getCookie("chosen-area")
        }
        //Generate data items from form fields

        $('#' + form).find(':input:not(button):not(reset)').each(function() {
            var $this = $(this);
            if ($this.attr("id"))
                data[$this.attr("id")] = $this.val().trim().toUpperCase();
        });

        common.log("submitForm", data);

        $.ajax({
            data: data,
            success: function(data) {
                common.log("submitForm", data);
                if (data[0].error != 0) {
                    common.showErr(data[0].message);
                } else {
                    common.showMsg(data[0].message);
                    var order_id = data[0].order_id;
                    shop.notify(order_id);
                    cookies.setCookie("order_id", order_id);
                    var data = {
                        action: "get_order_shops",
                        order_id: order_id
                    }
                    $.ajax({
                        data: data,
                        success: function(data) {
                            if (data.length > 0) {
                                for (var i = 0; i < data.length; i++) {
                                    shop.notify(order_id, data[i].shop_id);
                                }
                            }
                        }
                    });
                    shop.updateBasket();
                    $("#content").load("/thanks");
                }
            }
        });
    },

    notify: function(order_id, shop_id) {

        var type = (typeof shop_id === 'undefined') ? 1 : 2;
        // Email & SMS notification
        var data = {
            action: "order_notify",
            order_id: order_id,
            type: type,
            shop_id: shop_id
        }

        common.log("notify", data);

        $.ajax({
            data: data,
            success: function(data) {
                common.log("notify", data);
            }
        });
    },

    fillForm: function(item_id, table) {

        var data = {
            action: 'get_table_record',
            table: table,
            item_id: item_id
        }

        common.log("get_table_record", data);

        $.ajax({
            data: data,
            success: function(data) {
                common.log("get_table_record", data);
                var $this = data[0];
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
    },

    load_shops_areas: function() {
        var data = {
            action: 'get_shops_areas',
            area_id: cookies.getCookie('chosen-area')
        }

        common.log("get_shops_areas", data);

        $.ajax({
            data: data,
            success: function(data) {
                common.log("get_shops_areas", data);
                var l = data.length;
                if (l == 1 && data[0].error) {
                    return;
                }
                var tmp = [],
                    i = 0;
                var skip_columns = "-id-";
                i = 0;
                for (var r = 0; r < l; r++) {
                    var $this = data[r];
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
    },

    store_values: function() {
        var $inputs = $('form :input');
        $inputs.each(function() {
            cookies.setCookie(this.id, $(this).val());
        });
    },

    restore_values: function() {
        var $inputs = $('form :input');
        $inputs.each(function() {
            $("#" + this.id).val(cookies.getCookie(this.id));
        });
    },

    saveRating: function(data) {
        data.action = "save_rating";
        data.order_id = cookies.getCookie('order_id');
        common.log("saveRating", data);
        $.ajax({
            data: data,
            success: function(data) {
                common.log("saveRating", data);
                cookies.setCookie("order_status", data[0].status);
                location.href = '/';
            }
        });
    },

    update_order_number: function() {
        var data = {
            action: "get_order_number",
            order_id: cookies.getCookie('order_id')
        }
        common.log("update_order_number", data);
        $.ajax({
            data: data,
            success: function(data) {
                common.log("update_order_number", data);
                $('#order-number').html(data[0].number);
            }
        });
    }

}
