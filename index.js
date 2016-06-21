var main = function () {
    /**
     * Constructor that initialize all required properties for OverlayMobile class.
     */
    function OverlayMobile() {
        this.currentUserAgent = window.navigator.userAgent;
        this.mobileDetect = new MobileDetect(this.currentUserAgent);
        this.timeout = setTimeout(this.showOverlay, defaultTimeToShowOverlay);
        this.minimumNumberOfTouches = Math.round(document.body.clientHeight / screen.height);
        this.amountOfTouches = 0;
        this.touchesTrack = [];
        this.customTimeToShow = null;
    }

    /**
     * The unique instance for OverlayMobile class.
     * @type {OverlayMobile}
     */
    var instance;

    /**
     * The default time in seconds to show overlay.
     * @type {number}
     */
    const defaultTimeToShowOverlay = 7000;

    /**
     * The method to get/create an unique instance of OverlayMobile class.
     * @returns {OverlayMobile} The unique instance for OverlayMobile class.
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
        if (instance.customTimeToShow) {
            return
        }

        instance.touchesTrack.push(new Date());
        instance.amountOfTouches++;

        clearTimeout(instance.timeout);

        if (instance.touchesTrack.length == instance.minimumNumberOfTouches) {
            var j = 0;
            var totalAmount = 0;

            for (var i = 0, k = 1; k < instance.amountOfTouches; i++, k++) {
                totalAmount += instance.touchesTrack[k].getTime() - instance.touchesTrack[i].getTime();

                j++;
            }

            instance.customTimeToShow = totalAmount / instance.amountOfTouches;

            console.log(instance.customTimeToShow);

            instance.timeout = setTimeout(instance.showOverlay, instance.customTimeToShow );
        } else {
            instance.timeout = setTimeout(instance.showOverlay, defaultTimeToShowOverlay);
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
