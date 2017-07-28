// ¯\_(ツ)_/¯
"use strict";
var chat = {

    data: {
        lastID: 0
    },

    url: "/ws/br.php",
    DATE_ROW: '<div class="row"><div class="col-lg-12"><p class="text-center text-muted small">{sent}</p></div></div>',
    MESSAGE_ROW: '<div class="row"><div class="col-lg-12"><div class="media-body"><h4 class="media-heading">{name}<span class="small pull-right">{time}</span></h4><div class="media"><a class="pull-{align}" href="#"><img class="media-object img-circle" src="{image}" alt=""></a><p>{message}</p></div></div></div></div>',

    init: function() {
        $.ajaxSetup({
            url: chat.url
        });
    },

    get_messages: function() {
        var order_id = cookies.getCookie("order_id");
        if (!order_id) {
            return;
        }

        var sender = cookies.getCookie("sender");
        if (!sender) {
            return;
        }

        var data = {
            action: 'get_messages',
            order_id: order_id,
            lastID: chat.data.lastID
        };

        common.log("get_messages", data);

        $.ajax({
            data: data,
            success: function(data) {
                common.log("get_messages", data);
                if (data.length > 0 && !data[0].error) {
                    var tmp = [],
                        i = 0,
                        cur_date = '';

                    for (var r = 0; r < data.length; r++) {
                        var $this = data[r];
                        chat.data.lastID = $this.id;
                        var date_template = chat.DATE_ROW;
                        var message_template = chat.MESSAGE_ROW;

                        if (cur_date !== $this.sent) {
                            cur_date = $this.sent;
                            tmp[i] = date_template.replace('{sent}', cur_date);
                            i++;
                        }
                        var msg_sender = '';
                        for (var key in $this) {
                            if($this.hasOwnProperty(key)) {
                                msg_sender = parseInt($this.sender);
                                if (msg_sender === sender && key === 'name') {
                                    message_template = message_template.replace('{' + key + '}', '');
                                }
                                message_template = message_template.replace('{' + key + '}', $this[key]);
                            }
                        }

                        if (msg_sender === sender) {
                            message_template = message_template.replace('{align}', 'right');
                            $('.user-name').html($this.name);
                        } else {
                            message_template = message_template.replace('{align}', 'left');
                        }
                        tmp[i] = message_template;
                        i++;
                    }
                    $('.chat-widget').append(tmp.join(''));

                    $('.chat-widget').animate({
                        scrollTop: $('.chat-widget')[0].scrollHeight
                    }, 800);

                    if (sender === 2) {
                        chat.mark_as_read(order_id);
                    }

                }
                setTimeout(function() {
                    chat.get_messages();
                }, 5000);
            }
        });
    },

    check_messages: function() {
        var order_id = cookies.getCookie("order_id");
        if (!order_id) {
            $('.alerts-button').addClass("hidden");
            return;
        }

        var data = {
            action: 'check_messages',
            order_id: order_id,
            lastID: chat.data.lastID
        };

        common.log("get_messages", data);

        $.ajax({
            data: data,
            success: function(data) {
                common.log("check_messages", data);
                var unread = data[0].undread;
                if (unread === 0) {
                    $('.unread-messsages').html('');
                    $('.alerts-button').removeClass("btn-danger").addClass("btn-info");
                    $('.unread-messsages').addClass("hidden");
                } else {
                    $('.unread-messsages').html(unread);
                    $('.alerts-button').removeClass("btn-info").addClass("btn-danger");
                    $('.unread-messsages').removeClass("hidden");
                    /*
                    Push.create('Hi there!', {
                        body: 'You\'ve got a message from iyabasira.online',
                        icon: 'img/rsz_new_message.png',
                        //requireInteraction: true,
                        timeout: 8000, // Timeout before notification closes automatically.
                        vibrate: [100, 100, 100], // An array of vibration pulses for mobile devices.
                        onClick: function() {
                            // Callback for when the notification is clicked.
                            Push.clear();
                            $(".alerts-button").click();
                            //common.log('Push', this);
                        }
                    });
                    */
                }
                $('.alerts-button').removeClass("hidden");
                setTimeout(function() {
                    chat.check_messages();
                }, 20000);
            }
        });
    },

    mark_as_read: function(order_id) {
        var data = {
            action: 'mark_as_read',
            order_id: order_id
        };

        common.log("mark_as_read", data);
        $.ajax({
            data: data,
            success: function(data) {
                common.log("mark_as_read", data);
            }
        });
    },

    send_message: function(message) {
        var order_id = cookies.getCookie("order_id");
        if (!order_id) {
            return;
        }
        var sender = cookies.getCookie("sender");
        if (!sender) {
            return;
        }
        if (!message) {
            return;
        }
        var data = {
            action: 'send_message',
            order_id: order_id,
            sender_type: sender,
            message: message
        };
        common.log("send_message", data);
        $.ajax({
            data: data,
            success: function(data) {
                common.log("send_message", data);
                $('#chat-message').val('');
                //get_messages();
            }
        });
    },

    get_latest_messages: function() {
        var data = {
            action: 'get_latest_messages'
        };
        common.log("get_latest_messages", data);
        $.ajax({
            data: data,
            success: function(data) {
                common.log("get_latest_messages", data);
                if (data.length > 0 && !data[0].error) {
                    var tmp = [];
                    var i = 0;
                    tmp[i] = '<ul class="nav nav-tabs">';
                    i++;
                    for (var r = 0; r < data.length; r++) {
                        var $this = data[r];
                        tmp[i] = '<li class="message-option"><a href="javascript:void(0)" onclick="open_chat_room(' + $this.order_id + ')">' + $this.number + '<br><span class="message-sent">' + $this.sent + '</span></a></li>';
                        i++;
                    }
                    tmp[i] = '</ul>';
                    $(".data").empty().append(tmp.join(''));
                    setTimeout(function() {
                        chat.get_latest_messages();
                    }, 30000);
                }
            }
        });
    }
};
