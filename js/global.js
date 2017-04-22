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
    console.log("JavaScript error: " + message + " on line " + linenumber + " for " + filename);
};

/**
 * Global variables definition
 */

var d = "d=" + new Date().toJSON();
var webservice_path = "/ws/br.php",
    cur_page = 0,
    page_size = 5,
    total_rows = 0,
    msg,
    type,
    search,
    record_id,
    save_login_name = false,
    error = false;

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
    }
    else {
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
    $(".alert").removeClass("alert-warning").addClass("alert-info");
    $(".alert #msg").html(text);
    $(".alert").show();
};

showErr = function(text) {
    $(".alert").removeClass("alert-info").addClass("alert-warning");
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

$(function() {
    var nua = navigator.userAgent;
    var isAndroid = (nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1 && nua.indexOf('Chrome') === -1);
    if (isAndroid) {
        $('select.form-control').removeClass('form-control').css('width', '100%');
    }
});

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
 * Delays execution of code (like wait...)
 */

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
        }
        else {
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

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
};

String.prototype.ltrim = function() {
    return this.replace(/^\s+/, '');
};

String.prototype.rtrim = function() {
    return this.replace(/\s+$/, '');
};

String.prototype.fulltrim = function() {
    return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
};

String.prototype.left = function(n) {
    return this.substring(0, n);
};

String.prototype.right = function(n) {
    var iLen = this.length;
    return this.substring(iLen, iLen - n);
};

function toggleFullScreen() {
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {

        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        }
        else
        if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
        else
        if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        }
        else
        if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    }
    else {

        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else
        if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        else
        if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else
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
    type : 'GET',
    url : webservice_path,
    contentType : "application/json; charset=utf-8",
    dataType : "json",
    cache : true,
    async : true,
    timeout : 0, // Timeout of 60 seconds
    error : function(xhr, errorThrown) {
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
    console.log("ajaxStart");
});

$(document).ajaxSend(function() {
    $('.fa').show().center();
    console.log("ajaxSend");
});

$(document).ajaxStop(function() {
    console.log("ajaxStop");
    $('.fa').fadeOut('slow');
});

$(document).ajaxError(function() {
    console.log("ajaxError");
    setTimeout(function() {
        $('.fa').fadeOut('slow');
        //        location.href = location.href;
    }, 3000);
});

log_ajax_error = function(xhr, errorThrown) {
    console.log(xhr.responseText);
    showErr('An error occurred! [' + xhr.responseText + '] ' + ( errorThrown ? errorThrown : xhr.status));
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
    }
    else {
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
    }
    else {
        $(obj).closest('.form-group').removeClass('has-error has-feedback').addClass('has-success has-feedback');
        $(obj1).removeClass('glyphicon-remove').addClass('glyphicon-ok');
    }

};

save_ticket = function() {

    var data = $("#settings-form").serializeObject();

    data.action = "save_ticket";

    var string = JSON.stringify(data);

    if (string.indexOf("notify") < 0)
        data.notify = "";

    //    console.log(JSON.stringify(data));
    $.ajax({
        data : data,
        success : function(data) {
            $(".home-text").show();
            $(".ticket-form").hide();
            showMsg("Ticket successfuly launched");
            //   location.href = location.href;
        }
    });

};

load_tickets = function() {

    var data = {};
    user_id = 0;
    data.action = "tickets_list";
    data.search = $("#search_text").val();
    //data.user_id = user_id;
    data.page = cur_page;
    data.page_size = page_size;
    $(".alert").hide();

    console.log(JSON.stringify(data));

    $(".is_disabled").removeClass("disabled");
    $(".is_disabled").addClass("disabled");

    $.ajax({

        data : data,
        success : function(data) {

            if (data == null) {
                $("#dashboard-table tbody").empty();
                return false;
            }

            var l = data.length;

            total_rows = data[0].total_rows;
            $(".badge").html(total_rows);

            var pages = parseInt(total_rows) / parseInt(page_size);
            pages = Math.ceil(pages);

            var pagination = {
                prevPage : null,
                nextPage : null,
                curPage : null,
                pageSize : null,
                totalRows : null,
                generate : function() {
                    var _page = parseInt(this.curPage) / this.pageSize + 1;

                    pagination = "<tr><td><table class='table'><tr>";

                    pagination += "<td width='33%'><div class='pull-left'>";

                    if (this.prevPage > -1) {
                        pagination += "<button class='btn btn-primary' onclick='go_page(" + this.prevPage.toString() + ")'>Previous</button>";
                    }
                    else {
                        pagination += "&nbsp;";
                    }

                    pagination += "</div></td>";

                    pagination += "<td width='33%' align='center'>Page " + _page + " or " + pages + "</td>";

                    pagination += "<td width='33%'><div class='pull-right'>";

                    if (parseInt(this.nextPage) < parseInt(this.totalRows)) {
                        pagination += "<button class='btn btn-primary' onclick='go_page(" + this.nextPage.toString() + ")'>Next</button>";
                    }
                    else {
                        pagination += "&nbsp;";
                    }

                    pagination += "</div></td>";

                    pagination += "</tr></table></td></tr>";

                    return pagination;
                }
            };

            var prev_page = parseInt(cur_page) - page_size;
            var next_page = parseInt(cur_page) + page_size;

            pagination.prevPage = prev_page;
            pagination.nextPage = next_page;
            pagination.curPage = cur_page;
            pagination.pageSize = page_size;

            pagination.totalRows = total_rows;

            var pagination = pagination.generate();

            var tmp = [],
                i = 0;

            var skip_columns = "-priority_id-type_id-status_id-total_rows-";

            tmp[i] = "<tr><td colspan=20>";
            tmp[i]++;

            for ( r = 0; r < l; r++) {
                $this = data[r];

                tmp[i] = "<div class='list-group'>";
                i++;
                var _priorityClass = "";
                var _statusClass = "";
                switch($this["priority_id"]) {
                    case "1":
                        _priorityClass = "btn btn-danger btn-sm";
                        break;
                    case "2":
                        _priorityClass = "btn btn-warning btn-sm";
                        break;
                    case "3":
                        _priorityClass = "btn btn-info btn-sm";
                        break;
                    case "4":
                        _priorityClass = "btn btn-default btn-sm";
                        break;
                };
                switch($this["status_id"]) {
                    case "0":
                        _statusClass = "btn btn-default btn-sm";
                        break;
                    case "1":
                        _statusClass = "btn btn-primary btn-sm";
                        break;
                    case "2":
                        _statusClass = "btn btn-active btn-sm";
                        break;
                };
                for (var key in $this) {
                    if (skip_columns.indexOf("-" + key + "-") == -1) {

                        tmp[i] = "<a href='#' class='list-group-item'>";

                        tmp[i] += "<h4 class='list-group-item-heading'>";
                        tmp[i] += "<button class='btn btn-primary'>" + $this["id"] + "</button>";
                        tmp[i] += "<span class='app'>" + $this["app"] + "</span>";
                        tmp[i] += "<span class='title'>" + $this["title"] + "</span>";
                        tmp[i] += "<small><span class='type btn btn-default pull-right'>" + $this["type"] + "</span></small>";
                        tmp[i] += "</h4>";

                        tmp[i] += "<p class='list-group-item-text'>";
                        tmp[i] += "<span class='comment'>" + $this["comment"] + "</span>";
                        tmp[i] += "</p>";

                        tmp[i] += "<p class='list-group-item-text'>";
                        tmp[i] += "<small><span class='email_address'>" + $this["email_address"] + "</span>";
                        tmp[i] += "<span class='created'>" + $this["created"] + "</span></small>";
                        tmp[i] += "<button onclick=change_priority(" + $this["id"] + ") class='" + _priorityClass + " pull-right'>" + $this["priority"] + "</button>";
                        tmp[i] += "<button onclick=change_status(" + $this["id"] + ") class='" + _statusClass + "'>" + $this["status"] + "</button>";

                        tmp[i] += "</p>";

                        tmp[i] += "</a>";
                    }
                }
                tmp[i] += "</div>";
                // List-group
                i++;
            }

            tmp[i] = "</td></tr>";

            $("#dashboard-table tbody").empty().append(tmp.join('')).show();
            $("#dashboard-table thead").empty().append(pagination);
            $("#dashboard-table tfoot").empty().append(pagination);

            $(".is_disabled").addClass("disabled");

            $('input[name="selected_row"]').on('change', function() {
                record_id = this.value;
                $(".is_disabled").removeClass("disabled");
            });

            $(".ticket-form").hide();
            $(".table-responsive").show();
            $(".search-box").show();

            // If we do focus on this filed it will open the keyboard on mobile
            // phones

            //$("#search_text").focus();

        }
    });

};

go_page = function(page) {
    if (parseInt(page) < 0) {
        showMsg("this is the first page");
        return false;
    }

    if (parseInt(page) >= total_rows) {
        showMsg("this is the last page");
        return false;
    }

    cur_page = page;

    load_tickets();

};

change_priority = function(record_id) {
    event.preventDefault();
    var data = {};
    data.action = "change_priority";
    data.ticket_id = record_id;
    console.log(JSON.stringify(data));
    $.ajax({
        data : data,
        success : function(data) {
            refresh_changes(record_id);
        }
    });
};

change_status = function(record_id) {
    event.preventDefault();
    var data = {};
    data.action = "change_status";
    data.ticket_id = record_id;
    $.ajax({
        data : data,
        success : function(data) {
            refresh_changes(record_id);
        }
    });

};

change_responsible = function(record_id) {
    event.preventDefault();
    var data = {};
    data.action = "change_responsible";
    data.ticket_id = record_id;
    $.ajax({
        data : data,
        success : function(data) {
            refresh_changes(record_id);
        }
    });

};

refresh_changes = function(record_id) {
    var data = {};
    data.action = "get_title";
    data.ticket_id = record_id;
    console.log(JSON.stringify(data));
    $.ajax({
        data : data,
        success : function(data) {
            $this = data[0];
            $("#search_text").val($this["title"]);
            load_tickets();
        }
    });

};

