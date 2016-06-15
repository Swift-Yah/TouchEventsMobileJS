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

    OverlayMobile.prototype.updateStatus = function (e, touch) {
        $('#cursor-status').text(e.type);
    };

    OverlayMobile.prototype.registerTouch = function (e, touch) {
        var self = this;

        console.log(e.type, touch);

        clearTimeout(self.timeout);

        self.timeout = setTimeout(showOverlay, 5000);
    };

    OverlayMobile.prototype.init = function () {
        var self = this;

        if (self.mobileDetect.mobile()) {
            var bindable = $(document).Touchable();

            bindable
                .bind('touchablemove touchableend tap longTap doubleTap', self.updateStatus)
                .bind('touchableend', self.registerTouch);

            document.addEventListener('focus', function () {
                $('#tab-status').text = 'focus';
            });

            document.addEventListener('blur', function () {
                $('#tab-status').text = 'blur';
            });
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
