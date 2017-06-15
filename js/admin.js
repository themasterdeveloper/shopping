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
var d = "d=" + new Date().toJSON();
var webservice_path = "/ws/br.php",
    record_id,
    cur_page = 0,
    error = false;

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
                    cookies.setCookie(key, $this[key]);
                }
                cookies.setCookie("login", 1);
            } else {
                showErr("Email or password incorrect");
                cookies.setCookie("login", 0);
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
                cookies.setCookie("record_id", data[0].record_id);
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
    var limit = col_names.length;
    $(".tr_" + item_id).find("td").each(function() {
        if (counter < limit)
            if ($(this).html().length > 0)
                _details += "<div class='delete-data'>" + col_names[counter] + ": <span class='data'>" + $(this).html() + "</span></div>";
        counter++;
    });
    cookies.setCookie("item_id", item_id);
    cookies.setCookie("table", table);
    $("#confirm-body").html(_details);
    $("#delete-confirmation").modal('show');
}

var commit_details_confirmed = function() {
    var data = {};
    data.action = 'delete_table_record';
    data.table = cookies.getCookie("table");
    data.item_id = cookies.getCookie("item_id");
    log("get_table_data", data);
    $.ajax({
        data: data,
        success: function(data) {
            log("adm_delete_item", data);
            if (data[0].error != 0) {
                showErr(data[0].message);
            } else {
                $("#delete-confirmation").modal('hide');
                setTimeout(function() {
                    adm_load_table(cookies.getCookie("table"));
                }, 1000);
            }
        }
    });
}

var adm_load_table = function(table, read_only) {
    read_only = (typeof read_only === 'undefined') ? false : read_only;
    $(".table-name").html(table.replace('_', ' / '));
    $(".alert").hide();
    if (cookies.getCookie("cur_page")) {
        cur_page = parseInt(cookies.getCookie("cur_page"));
    }
    if (cookies.getCookie("rows_per_page")) {
        rows_per_page = parseInt(cookies.getCookie("rows_per_page"));
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
            var skip_columns = "-id-active-status_name-total_records-";

            var l = data.length;
            var cols = 0;
            var tmp = [],
                i = 0;
            $this = data[0];
            var total_records = $this["total_records"];
            // thead
            tmp[i] = "<tr>";
            i++;
            col_names.length = 0;
            for (var key in $this) {
                if (skip_columns.indexOf("-" + key + "-") == -1) {
                    col_names[cols] = key;
                    tmp[i] = "<th class='__" + key.replace(' ', '_') + "'>" + key.replace('_', ' ') + "</th>";
                    i++;
                    cols++;
                }
            }

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
                        switch (key) {
                            case 'status':
                            case 'is_active':
                                tmp[i] = "<td class='__" + key.replace(' ', '_') + "'><img class='__" + key.replace(' ', '_') + "' src='" + $this[key] + "'></td>";
                                break;
                            case 'notify':
                                tmp[i] = "<td class='__" + key.replace(' ', '_') + "'><img class='__" + key.replace(' ', '_') + "' title='" + $this["status_name"] + "' src='" + $this[key] + "'></td>";
                                break;
                            case 'image':
                                tmp[i] = "<td class='__" + key.replace(' ', '_') + "'><img class='__" + key.replace(' ', '_') + "' src='" + $this[key] + "'></td>";
                                break;
                            default:
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
                cookies.setCookie("cur_page", cur_page - 1);
                adm_load_table(table, read_only);
            })

            $(".btn-next").on("click", function(e) {
                e.preventDefault();
                cookies.setCookie("cur_page", cur_page + 1);
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
