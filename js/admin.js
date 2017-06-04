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

var d = "d=" + new Date().toJSON();
var webservice_path = "/ws/br.php",
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

/**
 * Centers divs on screen
 */

jQuery.fn.center = function() {
    this.css("position", "absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 3) + $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
    return this;
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

var login = function() {
    var data = {};

    data.action = "login";
    //Generate data items from form fields
    $('#login').find(':input:not(button):not(reset)').each(function() {
        var $this = $(this);
        if ($this.attr("id"))
            data[$this.attr("id")] = $this.val().trim();
    });

    log("login", data);
    $.ajax({
        data: data,
        success: function(data) {
            log("login", data);
            if (data[0].user_id) {
                document.getElementById('id01').style.display = 'none';
                $(".navbar").removeClass("hidden");
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

var saveData = function(object) {
    var action = object + "_save";
    var form = object + "-form";
    var data = {};
    data.action = action;
    $('#' + form).find(':input:not(button):not(reset)').each(function() {
        var $this = $(this);
        if ($this.attr("id"))
            data[$this.attr("id")] = $this.val().trim();
    });
    log("saveData", data);
    $.ajax({
        data: data,
        success: function(data) {
            log("saveData", data);
            if (data[0].error != 0) {
                showErr(data[0].message);
            } else {
                showMsg(data[0].message);
                setCookie("record_id", data[0].record_id);
                $("." + object + "-list").removeClass("hidden");
                $("." + object + "-form").addClass("hidden");
                adm_load_table(object);
            }
        }
    });
};
var adm_delete_item = function(item_id, table) {
    if (item_id == undefined)
        return false;
    record_id = item_id;
    var _details = "";
    var counter = 0;
    var limit = getCookie("cols");
    var sep = "";
    $(".tr_" + item_id).find("td").each(function() {
        if (counter < limit)
            if ($(this).html().length > 0)
                _details += sep + "<span class='data'>" + $(this).html() + "</span>";
        sep = "<br/>";
        counter++;
    });
    setCookie("item_id", item_id);
    setCookie("table", table);
    $("#confirm-body").html(_details);
    $("#delete-confirmation").modal('show');
}

var commit_details_confirmed = function() {
    var data = {};
    data.action = 'delete_table_record';
    data.table = getCookie("table");
    data.item_id = getCookie("item_id");
    log("get_table_data", data);
    $.ajax({
        data: data,
        success: function(data) {
            log("adm_delete_item", data);
            if (data[0].error != 0) {
                showErr(data[0].message);
            } else {
                $("#delete-confirmation").modal('hide');
                setTimeout(function(){
                    adm_load_table(getCookie("table"));
                }, 1000);
            }
        }
    });
}

var adm_load_table = function(table, read_only) {
    read_only = (typeof read_only === 'undefined') ? false : read_only;
    $(".table-name").html(table.replace('_', ' / '));
    $(".alert").hide();
    if (getCookie("cur_page")) {
        cur_page = parseInt(getCookie("cur_page"));
    }
    if (getCookie("rows_per_page")) {
        rows_per_page = parseInt(getCookie("rows_per_page"));
    }
    var data = {};
    data.action = 'adm_load_table_' + table;
    data.search = $("#search").val();
    data.limit = cur_page;
    data.rows = rows_per_page;
    log("load_table", data);
    $.ajax({
        data: data,
        success: function(data) {
            log("load_table", data);
            if (data[0].error == 1) {
                $("#" + table + "-table tbody").empty();
                $("#" + table + "-table tbody").empty();
                $("#" + table + "-table tfood").empty();
                showErr(data[0].message);
                return false;
            }
            var skip_columns = "-id-active-total_records-";

            var l = data.length;
            var cols = 0;
            var tmp = [],
                i = 0;
            $this = data[0];
            var total_records = $this["total_records"];
            // thead
            tmp[i] = "<tr>";
            i++;
            for (var key in $this) {
                if (skip_columns.indexOf("-" + key + "-") == -1) {
                    tmp[i] = "<th class='__" + key.replace(' ', '_') + "'>" + key + "</th>";
                    i++;
                    cols++;
                }
            }
            setCookie("cols", cols);
            if (!read_only) {
                tmp[i] = '<th></th>';
                i++;
                cols++;
            }
            tmp[i] = "</tr>";
            $("#" + table + "-table thead").empty().append(tmp.join(''));

            // tbody
            tmp = [];
            i = 0;
            for (r = 0; r < l; r++) {
                $this = data[r];
                tmp[i] = "<tr class='tr_" + $this["id"] + "'>";
                i++;
                for (var key in $this) {
                    if (skip_columns.indexOf("-" + key + "-") == -1) {
                        if (key == 'status' || key == 'image') {
                            tmp[i] = "<td class='__" + key.replace(' ', '_') + "'><img class='__" + key.replace(' ', '_') + "' src='" + $this[key] + "'></td>";
                        } else {
                            tmp[i] = "<td class='__" + key.replace(' ', '_') + "'>" + $this[key] + "</td>";
                        }
                        i++;
                    }
                }

                if (!read_only) {
                    tmp[i] = '<td class="button-group">';
                    i++
                    if ($this["active"] == 0) {
                        tmp[i] = '<button class="btn btn-danger btn-sm delete-item" onclick="adm_delete_item(' + $this["id"] + ',\'' + table + '\')">Delete</button>';
                        i++
                    }
                    tmp[i] = '<button class="btn btn-primary btn-sm edit-item" onclick="adm_edit_item(' + $this["id"] + ',\'' + table + '\')">Edit</button>';
                    i++
                    tmp[i] = '</td>';
                    i++
                }
                tmp[i] = "</tr>";
                i++;
            }
            $("#" + table + "-table tbody").empty().append(tmp.join(''));

            var footer = '';
            var span = parseInt(cols);
            footer += '<tr><td colspan=' + span + '>';
            if (cur_page > 0) {
                footer += '<button class= "btn btn-success btn-md pull-left btn-prev table-button">Prev</button>';
            } else {
                footer += '<button class= "btn btn-success btn-md pull-left disabled table-button">Prev</button>';
            }
            var page = parseInt(cur_page) + 1
            footer += "Page " + page;

            if (cur_page < parseInt(total_records / rows_per_page)) {
                footer += '<button class= "btn btn-success btn-md pull-right btn-next">Next</button>';
            } else {
                footer += '<button class= "btn btn-success btn-md pull-right disabled">Next</button>';
            }
            footer += '<br/>' + total_records + ' records';
            footer += '</td></tr>';

            $("#" + table + "-table tfoot").empty().append(footer);

            $(".btn-prev").on("click", function(e) {
                e.preventDefault();
                setCookie("cur_page", cur_page - 1);
                adm_load_table(table, read_only);
            })

            $(".btn-next").on("click", function(e) {
                e.preventDefault();
                setCookie("cur_page", cur_page + 1);
                adm_load_table(table, read_only);
            })

        }
    });
}

var adm_edit_item = function(item_id, table) {
    $("#item_id").val(item_id);
    fillForm(item_id, table);
}


var remove_markers = function() {
    for (i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

var close_infowindows = function() {
    for (i = 0; i < infowindows.length; i++) {
        infowindows[i].close();
    }
}

var relocateMap = function() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            //map.setCenter(initialLocation);
            me_marker.setPosition(initialLocation);
        });
    }
}


var fillForm = function(item_id, table) {
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
                log(key, $this[key]);
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
