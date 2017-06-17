var auth = {
    data: {
        token: ''
    },

    get_token: function() {

        auth.data.token = cookies.getCookie("token");
        if (auth.data.token) {
            return;
        }

        var data = {
            action: "get_token",
            area_id: cookies.getCookie("chosen-area")
        }

        common.log("get_token", data);

        $.ajax({
            data: data,
            success: function(data) {
                common.log("get_token", data);
                var token = data[0].token;
                auth.data.token = token;
                cookies.setCookie("token", token);
            }
        });
    },

    resetToken: function() {
        auth.data.token = "";
        cookies.deleteAllCookies();
        auth.get_token();
    }
}
