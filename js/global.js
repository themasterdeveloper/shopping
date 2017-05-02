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
    msg,
    type,
    search,
    record_id,
    token = '',
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
    $(".alert").removeClass("alert-warning").removeClass("alert-info").addClass("alert-info");
    $(".alert #msg").html(text);
    $(".alert").show();
};

showErr = function(text) {
    $(".alert").removeClass("alert-info").removeClass("alert-warning").addClass("alert-warning");
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
    //console.log(xhr);
    showErr('We are sorry, but there was an error accessing the database');
    //showErr('An error occurred! [' + xhr.responseText + '] ' + ( errorThrown ? errorThrown : xhr.status));
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

load_products = function() {
    if (token.length == 0) {
        get_token();
    }

    var data = {};
    user_id = 0;
    data.action = "products_list";
    data.search = $("#search_text").val();
    //console.debug(data);

    $(".alert").hide();

    $.ajax({

        data : data,
        success : function(data) {

            if (data[0].error == 0) {
                $("#dashboard-table").empty();
                showErr("No products found");
                $(".offers").html(0);
                return false;
            }

            var l = data.length;

            $(".offers").html(l);

            var tmp = [],
                i = 0;

            var skip_columns = "-total_rows-";

            for ( r = 0; r < l; r++) {
                $this = data[r];

                tmp[i] = "<div class='list-group'>";
                i++;
                for (var key in $this) {
                    if (skip_columns.indexOf("-" + key + "-") == -1) {
                        tmp[i] = "<div href='#' class='list-group-item it-" + $this["id"] + "'>";
                        tmp[i] += "<img src='/img/" + $this["logo"] + "' class='shop-logo'>";
                        tmp[i] += "<span class='area'>" + $this["area"] + "</span>";
                        tmp[i] += "<span class='product'>" + $this["product"] + "</span><br/>";
                        tmp[i] += "<img class='product-image' src='/img/" + $this["image"] + "'>";
                        tmp[i] += "<span class='price'>" + $this["price"] + "</span>";
                        tmp[i] += "<button class='buy-product-button btn btn-success btn-lg' onclick=buy_product(" + $this["id"] + ") >ORDER NOW</button>";
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

        }
    });

    updateBasket();

};

buy_product = function(product_id){
    var caller = "it-"+product_id;
    var pos = $("." + caller).position();
    $(".order-form").css("top", pos.top+32).show();
    $(".order-form #product_id").val(product_id);
    $(".shadow").show();
    event.preventDefault();
}

get_token = function() {
    if(getCookie("token")){
        token = getCookie("token");
        $("#token").val(token);
        return;
    }
    var data = {};
    data.action = "get_token";
    //console.debug(data);
    $.ajax({
        data : data,
        success : function(data) {
            token = data[0].token;
            $("#token").val(token);
            setCookie('token', token);
        }
    });
}

add_product = function(){
    var data = {};
    data.action = "save_item";
    data.token = token;
    data.product_id = $("#product_id").val();
    data.quantity = $("#quantity").val();
    //console.debug(data);
    $.ajax({
        data : data,
        success : function(data) {
            var results = data[0];
            if(results.error == 0) {
                $(".order-form").hide();
                $(".shadow").hide();
            }else {
                $(".error_message").html(results.message).show();
            }
            updateBasket();
       }
    });    
    //event.preventDefault();
}

updateBasket = function(){
    var data = {};
    data.action = "get_total_basket";
    data.token = token;
    //console.debug(data);
    $.ajax({
        data : data,
        success : function(data) {
            //console.debug(data);
            var results = data[0];
            var total_basket =   results.total_basket;
            $(".basket").html(results.total_basket);
            if(parseFloat(total_basket) > 0){
                $(".offers").parent().removeClass("hidden").addClass("hidden");
                $(".basket").parent().removeClass("hidden");
            } else {
                $(".offers").removeClass("hidden");
                $(".basket").removeClass("hidden").addClass("hidden");
            }
       }
    });      
}

function listCookies() {
    var theCookies = document.cookie.split(';');
    var aString = '';
    for (var i = 1; i <= theCookies.length; i++) {
        aString += i + ' ' + theCookies[i - 1] + "\n";
    }
    return aString;
}

//console.log(listCookies());
