
function navigateHome() {
    window.location.href = "/";
}

function navigateLogin() {
    window.location.href = "/login";
}

function navigateSignup() {
    window.location.href = "/signup";
}

function navigateMaps() {
    window.location.href = "/maps";
}

$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    }
    return decodeURI(results[1]) || 0;
};