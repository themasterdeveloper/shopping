var webservice_path = "/ws/br.php";

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

log_ajax_error = function(xhr, errorThrown) {
    log("xhr", xhr);
    showErr('We are sorry, but there was an error accessing the database');
    //showErr('An error occurred! [' + xhr.responseText + '] ' + ( errorThrown ? errorThrown : xhr.status));
};

$(document).ajaxStart(function() {
    $('.fa-refresh').show().center();
});

$(document).ajaxStop(function() {
    $('.fa-refresh').fadeOut('slow');
});

$(document).ajaxError(function() {
    setTimeout(function() {
        $('.fa-refresh').fadeOut('slow');
        //        location.href = location.href;
    }, 3000);
});
