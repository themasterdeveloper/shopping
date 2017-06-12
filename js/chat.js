window.onerror = function(message, filename, linenumber) {
    log("JavaScript error: " + message + " on line " + linenumber + " for " + filename);
};
var d = "d=" + new Date().toJSON();
var webservice_path = "/ws/br.php"
var DATE_ROW = '<div class="row"><div class="col-lg-12"><p class="text-center text-muted small">{sent}</p></div></div>';
var MESSAGE_ROW = '<div class="row"><div class="col-lg-12"><div class="media-body"><h4 class="media-heading">{name}<span class="small pull-right">{time}</span></h4><div class="media"><a class="pull-{align}" href="#"><img class="media-object img-circle" src="{image}" alt=""></a><p>{message}</p></div></div></div></div>';

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

    var sender = getCookie("sender");
    if (!sender) {
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
                        var msg_sender = parseInt($this["sender"]);
                        if (msg_sender == sender && key == 'name') {
                            message_template = message_template.replace('{' + key + '}', '');
                        }
                        message_template = message_template.replace('{' + key + '}', $this[key]);
                    }

                    if (msg_sender == sender) {
                        message_template = message_template.replace('{align}', 'right');
                        $('.user-name').html($this["name"]);
                    } else {
                        message_template = message_template.replace('{align}', 'left');
                    }
                    tmp[i] = message_template;
                    i++
                }
                $('.chat-widget').empty().append(tmp.join(''));

                $('.chat-widget').animate({
                    scrollTop: $('.chat-widget')[0].scrollHeight
                }, 800);

                if(sender == 2) {
                    mark_as_read(order_id);
                }

                setTimeout(function() {
                    get_messages();
                }, 5000);
            }
        }
    });
}

var check_messages = function() {
    var order_id = getCookie("order_id");
    if (!order_id) {
        $('.alerts-button').addClass("hidden");
        return;
    }

    var data = {};
    data.action = 'check_messages';
    data.order_id = order_id;
    log("get_messages", data);
    $.ajax({
        data: data,
        success: function(data) {
            log("check_messages", data);
            var unread = data[0].undread;
            if(unread==0){
                $('.unread-messsages').html('');
                $('.alerts-button').removeClass("btn-danger").addClass("btn-info");
                $('.unread-messsages').addClass("hidden");
            } else {
                $('.unread-messsages').html(unread);
                $('.alerts-button').removeClass("btn-info").addClass("btn-danger");
                $('.unread-messsages').removeClass("hidden");
            }
            $('.alerts-button').removeClass("hidden");
            setTimeout(function() {
                check_messages();
            }, 20000);
        }
    });
}

var mark_as_read = function(order_id) {
    var data = {};
    data.action = 'mark_as_read';
    data.order_id = order_id;
    log("mark_as_read", data);
    $.ajax({
        data: data,
        success: function(data) {
            log("mark_as_read", data);
        }
    });
}

var send_message = function(message) {
    var order_id = getCookie("order_id");
    if (!order_id) {
        return;
    }
    var sender = getCookie("sender");
    if (!sender) {
        return;
    }
    if (!message) {
        return;
    }
    var data = {};
    data.action = 'send_message';
    data.order_id = order_id;
    data.sender_type = sender;
    data.message = message;
    log("send_message", data);
    $.ajax({
        data: data,
        success: function(data) {
            log("send_message", data);
            $('#chat-message').val('');
            //get_messages();
        }
    });
}
