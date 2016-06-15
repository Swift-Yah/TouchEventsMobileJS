var main = function () {
    function OverlayMobile() {
        this.currentUserAgent = window.navigator.userAgent;
        this.mobileDetect = new MobileDetect(this.currentUserAgent);
    }

    OverlayMobile.prototype.init = function () {
        var body = $('body').Touchable();
        var message = $('#user-status');
        var self = this;

        if (self.mobile()) {
            return
        }

        body.bind('touchableend', function (e, touch) {
            message.value = "Touch ended";
        });

        body.bind('touchablemove', function (e, touch) {
            message.value = "Touch moving"
        });
    };
}();

document.addEventListener('DOMContentLoaded', function () {
    var overlayMobile = new main.OverlayMobile();

    overlayMobile.init();
});
