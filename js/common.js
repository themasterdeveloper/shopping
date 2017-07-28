"use strict";

var common = {

    data: {},

    init: function() {
        window.onerror = function(message, filename, linenumber) {
            common.log("JavaScript error: " + message + " on line " + linenumber + " for " + filename);
        };
        common.get_config_value("Online");
        common.get_config_value("Debug");
    },

    log: function(name, value) {
        if (common.data.Debug) {
            if (value === undefined) {
                console.log(name);
            } else {
                console.debug(name, value);
            }
        }
    },

    showMsg: function(text) {
        $(".alert").removeClass("alert-danger").removeClass("alert-info").addClass("alert-info");
        $(".alert #msg").html(text);
        $(".alert").show();
    },

    showErr: function(text) {
        $(".alert").removeClass("alert-info").removeClass("alert-danger").addClass("alert-danger");
        $(".alert #msg").html(text);
        $(".alert").show();
    },

    GetParameterValues: function(param) {
        var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < url.length; i++) {
            var urlparam = url[i].split('=');
            if (urlparam[0] === param) {
                return urlparam[1];
            }
        }
    },

    load_dropdown: function(object, empty, disabled) {
        empty = (typeof empty === 'undefined') ? false : empty;
        disabled = (typeof disabled === 'undefined') ? false : disabled;

        var data = {
            action: object + "_list"
        };

        common.log("load_" + object, data);

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
                common.log("load_" + object, data);
                var tmp = [];
                var l = data.length;
                var tmpEmpty = '';
                if (empty === 1) {
                    tmpEmpty = "<option></option>";
                }
                for (var r = 0; r < l; r++) {
                    var $this = data[r];
                    tmp[r] = tmpEmpty + "<option value=" + $this.id + ">" + $this.value + "</option>";
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

    get_config_value: function(name) {

        var data = {
            action: "get_config_value",
            name: name
        };

        common.log("get_config_value", data);

        $.ajax({
            data: data,
            dataType: 'json',
            success: function(data) {
                common.log("get_config_value", data);
                cookies.setCookie(name, data[0].value);
                common.data[name] = data[0].value;
            }
        });
    }
};

$.fn.center = function() {
    this.css("position", "absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 3) + $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
    return this;
};

$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
