var main = function () {
    function OverlayMobile() {
        this.currentUserAgent = window.navigator.userAgent;
        this.mobileDetect = new MobileDetect(this.currentUserAgent);
        this.timeout = null;
    }

    var showOverlay = function () {
        $('html, body').animate({ scrollTop: 0 }, "slow");
        $('#overlay').show();
    };

    OverlayMobile.prototype.logTouch = function(event) {
        var self = this;

        clearTimeout(self.timeout);

        self.timeout = setTimeout(showOverlay, 5000);

        console.log(event);
    };

    OverlayMobile.prototype.init = function () {
        var self = this;

        if (self.mobileDetect.mobile()) {
            $(document).bind('moveend mouseup', self.logTouch);
        }
    };

    return {
        OverlayMobile: OverlayMobile
    }
}();

document.addEventListener('DOMContentLoaded', function () {
    var overlayMobile = new main.OverlayMobile();

    overlayMobile.init();
});
