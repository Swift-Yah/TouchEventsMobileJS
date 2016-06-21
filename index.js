var main = function () {
    /**
     * Constructor that initialize all required properties for OverlayMobile class.
     */
    function OverlayMobile() {
        this.currentUserAgent = window.navigator.userAgent;
        this.mobileDetect = new MobileDetect(this.currentUserAgent);
        this.timeout = null;
        this.minimumNumberOfTouches = Math.round(document.body.clientHeight / screen.height);
        this.amountOfTouches = 0;
        this.touchesTrack = [];
    }

    /**
     * The unique instance for OverlayMobile class.
     */
    var instance;

    /**
     * The method to get/create an unique instance of OverlayMobile class.
     * @returns The unique instance for OverlayMobile class.
     */
    var getInstance = function () {
        if (!instance) {
            instance = new OverlayMobile();
        }

        return instance;
    };

    OverlayMobile.prototype.showOverlay = function () {
        $('html, body').animate({ scrollTop: 0 }, 'slow');
        $('#overlay').show();
    };

    OverlayMobile.prototype.updateStatus = function (e, touch) {
        $('#cursor-status').text(e.type, touch.currentTouch);
    };

    OverlayMobile.prototype.logTouch = function (e, touch) {
        console.log(e.type, touch);
    };

    OverlayMobile.prototype.registerTouch = function () {
        instance.touchesTrack.push(new Date());
        instance.amountOfTouches++;

        console.log(instance.minimumNumberOfTouches);

        if (instance.touchesTrack.length == instance.minimumNumberOfTouches) {
            clearTimeout(instance.timeout);

            var j = 0;
            var totalAmount = 0;

            for (var i = 0, k = 1; k < instance.amountOfTouches; i++, k++) {
                totalAmount += instance.touchesTrack[i].getTime() - instance.touchesTrack[k].getTime();

                j++;
            }

            var timeToShow = totalAmount / j;

            console.log(timeToShow);

            instance.timeout = setTimeout(instance.showOverlay, timeToShow);
        }
    };

    OverlayMobile.prototype.init = function () {
        if (instance.mobileDetect.mobile()) {
            var bindable = $(document).Touchable();

            bindable
                .bind('touchableend', instance.registerTouch)
                .bind('touchableend', instance.logTouch)
                .bind('touchablemove touchableend tap longTap doubleTap', instance.updateStatus);

            document.addEventListener('focus', function () {
                $('#tab-status').text = 'focus';
            });

            document.addEventListener('blur', function () {
                $('#tab-status').text = 'blur';
            });
        }
    };

    return {
        getInstance: getInstance
    }
}();

document.addEventListener('DOMContentLoaded', function () {
    var overlayMobile = new main.getInstance();

    overlayMobile.init();
});
