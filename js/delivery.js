var delivery = {

    data: {
        user_id: ''
    },

    BUTTON: '<a href="javascript:void(0)" class="form-control btn btn-primary btn-lg btn-options" onclick="load_order({id})"><span class="glyphicon glyphicon-pencil"></span>{number}</a>',

    BUTTON2: '<a href="javascript:void(0)" class="btn btn-success btn-md shops" onclick="delivery.load_shop_data({id})">{name}</a>',

    TEMPLATE: '<div class="order-data-key">{key}:<div class="order-data-value"><strong>{value}</strong></div>',

    init: function() {

        $.ajaxSetup({
            url: delivery.url
        });

        cookies.setCookie("sender", 4);

    },

    url: "/ws/delivery.php",

    deliverer_login: function() {
        var data = {
            action: "deliverer_login"
        }

        //Generate data items from form fields
        $('#login').find(':input:not(button):not(reset)').each(function() {
            var $this = $(this);
            if ($this.attr("id"))
                data[$this.attr("id")] = $this.val().trim();
        });

        common.log("deliverer_login", data);

        $.ajax({
            data: data,
            success: function(data) {
                common.log("deliverer_login", data);
                if (data[0].user_id) {
                    document.getElementById('id01').style.display = 'none';
                    $this = data[0];
                    for (key in $this) {
                        cookies.setCookie(key, $this[key]);
                    }
                    delivery.data.user_id = $this["user_id"];
                    cookies.setCookie("user_id", $this["user_id"]);
                    load("home.html");
                } else {
                    common.showErr("Email or password incorrect");
                }
            }
        });
    },

    get_orders: function() {

        var params = {
            action: "delivery_get_orders",
            deliverer_id: cookies.getCookie("user_id")
        }

        common.log("get_orders", params);

        $.ajax({
            data: params,
            success: function(data) {
                common.log("get_orders", data);
                if (!data[0].error) {
                    for (var i = 0; i < data.length; i++) {
                        $this = data[i];
                        delivery.add_orders_buttons($this);
                    }
                } else {
                    $('.data').append('<div>No orders found</div>');
                }
            }
        });
    },

    add_orders_buttons: function(row) {
        var button = delivery.BUTTON;
        button = button.replace('{id}', row["id"]);
        button = button.replace('{number}', row["number"]);
        $('.data').append(button);
    },

    get_order: function() {
        var params = {
            action: "delivery_get_order",
            order_id: cookies.getCookie("order_id")
        }

        common.log("get_order", params);

        $.ajax({
            data: params,
            success: function(data) {
                common.log("get_order", data);
                delivery.add_order_data(data[0]);
                cookies.setCookie("order_status", data[0].status);
            }
        });
    },

    get_address: function() {
        var params = {
            action: "delivery_get_address",
            order_id: cookies.getCookie("order_id")
        }

        common.log("get_address", params);

        $.ajax({
            data: params,
            success: function(data) {
                common.log("get_address", data);
                delivery.add_order_data(data[0]);
            }
        });
    },

    get_shops: function() {
        var params = {
            action: "delivery_get_shops",
            order_id: cookies.getCookie("order_id")
        }

        common.log("get_shops", params);

        $.ajax({
            data: params,
            success: function(data) {
                common.log("get_shops", data);
                for (var i = 0; i < data.length; i++) {
                    $this = data[i];
                    delivery.add_shops($this);
                }
            }
        });
    },

    add_order_data: function(row) {
        var field = [];
        var i = 0;
        var template = delivery.TEMPLATE;
        for (key in row) {
            field[i] = template.replace('{key}', key).replace('{value}', row[key]);
            i++;
        }
        $('.data').html(field.join(''));
    },

    add_shops: function(row) {
        var button = delivery.BUTTON2;
        button = button.replace('{id}', row["id"]);
        button = button.replace('{name}', row["name"]);
        $('.data').append(button);
    },

    load_shop_data: function(shop_id) {
        $('.items tbody').empty();
        var params = {
            action: "delivery_get_shop_items",
            order_id: cookies.getCookie("order_id"),
            shop_id: shop_id
        }

        common.log("load_shop_data", params);

        $.ajax({
            data: params,
            success: function(data) {
                common.log("load_shop_data", data);
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
                    delivery.add_shop_items($this);
                }
                $('.items tfoot').html('<tr><td colspan=3></td><td>' + total.toFixed(2) + '</td></tr>');
                $('.table-responsive').show();
            }
        });
    },

    add_shop_items: function(row) {
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
    },

    order_picked: function(row) {
        var params = {
            action: "delivery_order_picked",
            order_id: cookies.getCookie("order_id")
        }

        common.log("delivery_order_picked", params);

        $.ajax({
            data: params,
            success: function(data) {
                common.log("order_picked", data);
                $('.go-picked').addClass("hidden");
                load('order');
            }
        });
    },

    order_delivered: function(row) {
        var params = {
            action: "delivery_order_delivered",
            order_id: cookies.getCookie("order_id")
        }

        common.log("delivery_order_delivered", params);

        $.ajax({
            data: params,
            success: function(data) {
                common.log("delivery_order_delivered", data);
                $('.go-delivered').addClass("hidden");
                load('orders');
            }
        });
    }
}
