var chat = {

	webservice_path: "/ws/br.php",
    DATE_ROW : '<div class="row"><div class="col-lg-12"><p class="text-center text-muted small">{sent}</p></div></div>',
    MESSAGE_ROW : '<div class="row"><div class="col-lg-12"><div class="media-body"><h4 class="media-heading">{name}<span class="small pull-right">{time}</span></h4><div class="media"><a class="pull-{align}" href="#"><img class="media-object img-circle" src="{image}" alt=""></a><p>{message}</p></div></div></div></div>',

	init: function() {
		$.ajaxSetup({
			url: webservice_path
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
						var date_template = chat.DATE_ROW;
						var message_template = chat.MESSAGE_ROW;

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

					if (sender == 2) {
						chat.mark_as_read(order_id);
					}

					setTimeout(function() {
						chat.get_messages();
					}, 5000);
				}
			}
		});
	},

	check_messages: function() {
		var order_id = cookies.getCookie("order_id");
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
				if (unread == 0) {
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
	},

	mark_as_read: function(order_id) {
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
}
