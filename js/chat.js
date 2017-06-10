window.onerror = function(message, filename, linenumber) {
    log("JavaScript error: " + message + " on line " + linenumber + " for " + filename);
};
var d = "d=" + new Date().toJSON();
var webservice_path = "/ws/br.php"
var DATE_ROW = '<div class="row"><div class="col-lg-12"><p class="text-center text-muted small">{sent}</p></div></div>';
var MESSAGE_ROW = '<div class="row"><div class="col-lg-12"><div class="media-body"><h4 class="media-heading">{name}<span class="small pull-right">{time}</span></h4><div class="media"><a class="pull-{align}" href="#"><img class="media-object img-circle" src="{image}" alt=""></a><p>{message}</p></div></div></div></div>';

setCookie = function(c_description, value, exdays) {
    var exdate = new Date();
    exdays = 365;
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : ";path=/;expires=" + exdate.toUTCString());
    document.cookie = c_description + "=" + c_value;
};

getCookie = function(c_description) {
    //    log("getCookie.document.cookie: " + c_description);
    var c_value = document.cookie;

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

var log = function(name, value) {
    if (getCookie("Debug") == "True") {
        if (value === undefined) {
            console.log(name);
        } else {
            console.debug(name, value);
        }
    }
}
jQuery.fn.center = function() {
    this.css("position", "absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 3) + $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
    return this;
};

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
log_ajax_error = function(xhr, errorThrown) {
    log("xhr", xhr);
    showErr('We are sorry, but there was an error accessing the database');
    //showErr('An error occurred! [' + xhr.responseText + '] ' + ( errorThrown ? errorThrown : xhr.status));
};

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


var get_messages = function() {
    var order_id = getCookie("order_id");
    if (!order_id) {
        return;
    }
    var data = {};
    data.action = 'get_messages';
    data.order_id = order_id;
    log("get_messages", data);
    $.ajax({
        data: data,
        success: function(data) {
            log("get_messages", data);
            if (data.length > 0 && !data[0].error) {
                var tmp = [];
                var i = 0;
                var cur_date = ''
                for (var r = 0; r < data.length; r++) {
                    $this = data[r];
                    var date_template = DATE_ROW;
                    var message_template = MESSAGE_ROW;
                    if (cur_date != $this['sent']) {
                        cur_date = $this['sent'];
                        tmp[i] = date_template.replace('{sent}', cur_date);
                        i++;
                    }
                    for (key in $this) {
                        if ($this["sender"] == 2 && key == 'name') {
                            message_template = message_template.replace('{' + key + '}', '');
                        }
                        message_template = message_template.replace('{' + key + '}', $this[key]);
                    }
                    if (getCookie("token")) {
                        if ($this["sender"] == 2) {
                            message_template = message_template.replace('{align}', 'right');
                            $('.user-name').html($this["name"]);
                        } else {
                            message_template = message_template.replace('{align}', 'left');
                        }
                    }
                    tmp[i] = message_template;
                    i++
                }
                $('.chat-widget').empty().append(tmp.join(''));
            }
        }
    });
}

var send_message = function(message) {
    var order_id = getCookie("order_id");
    if (!order_id) {
        return;
    }
    if (!message) {
        return;
    }
    var data = {};
    data.action = 'send_message';
    data.order_id = order_id;
    data.message = message;
    log("send_message", data);
    $.ajax({
        data: data,
        success: function(data) {
            log("send_message", data);
            $('#chat-message').val('');
            get_messages();
        }
    });
}
