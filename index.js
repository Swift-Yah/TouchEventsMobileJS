/**
 * Wraps the `OverlayMobile` class.
 * This variable give to us a method to always access a unique object from that class.
 * @type {{getInstance}}
 */
var main = function () {
  /**
   * Constructor that initialize all required properties for OverlayMobile class.
   */
  function OverlayMobile() {
    /**
     * The user agent of user's device.
     * @type {string}
     */
    this.currentUserAgent = window.navigator.userAgent;

    /**
     * The service that enable us to know if the user's device is mobile or not.
     * @type {MobileDetect}
     */
    this.mobileDetect = new MobileDetect(this.currentUserAgent);

    /**
     * An alias for mobile function from `MobileDetect`.
     * @type {*|String}
     */
    this.isMobile = this.mobileDetect.mobile();

    /**
     * The calculation that defines the required number of touches for complete "machine" learn.
     * @type {number}
     */
    this.minimumNumberOfTouches = Math.round(document.body.clientHeight / screen.height);

    /**
     * The current number of touches that the user already did.
     * @type {number}
     */
    this.amountOfTouches = 0;

    /**
     * An array with all timestamps generated when the user touch in the device screen.
     * @type {Array}
     */
    this.touchesTrack = [];

    /**
     * The calculated value that we need to wait for determine user's abandon.
     * When this value is negative means that we already not calculate it.
     * @type {number}
     */
    this.customTimeToShow = -1;

    /**
     * The default time to show an overlay.
     * This time is used to determine in a generic way that the user's abandon.
     * This value is always used when we cannot determine the user's custom timeout.
     * @type {number}
     */
    this.defaultTimeToShowOverlay = 10000;

    /**
     * Storage the current timeout for show an overlay to the user.
     * Only create a timeout function if we're in a mobile device.
     * @type {number|Object}
     */
    this.userTimeOut = (this.isMobile) ? setTimeout(this.showOverlay, this.defaultTimeToShowOverlay) : -1;

    /**
     * An variable to control that whether the logs will be printed in console, or not.
     * @type {boolean}
     */
    this.isDebug = true;
  }

  /**
   * The unique instance for OverlayMobile class.
   * @type {OverlayMobile}
   */
  var instance;

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

  /**
   * An wrapper for the `console.log` function.
   * It enables us to only show the logs on console, when we're in debug mode.
   */
  var log = function () {
    if (instance.isDebug) {
      console.log.apply(console, arguments);
    }
  };

  /**
   * Convert an number of minutes in hours.
   * @param minutes Amount of minutes to convert to hours.
   */
  var hoursFromMinutes = function (minutes) {
    return minutes / 60;
  };

  /**
   * Convert a given number of days to its equivalent in hours.
   * A day has 24 hours.
   * @param days The number of days.
   * @returns {number} The number of hours from a given number of days.
   */
  var hoursFromDays = function (days) {
    return 24 * days;
  };

  /**
   * Enum that defines the name for cookies that this class can use.
   * @type {{OverlayTimeOut: string, TouchesTracked: string}}
   */
  OverlayMobile.prototype.Cookies = {
    /**
     * The name of the cookie that stores the user's timeout.
     */
    OverlayTimeOut: 'sb_overlay_timeout',

    /**
     * Cookie's name that stores for maximum one minute the list of all already touch tracked.
     */
    TouchesTracked: 'sb_overlay_tracked'
  };

  /**
   * Function that is called when we need efectively show a overlay for the user.
   */
  OverlayMobile.prototype.showOverlay = function () {
    log("TODO: Put here the implementation for showOverlay function");

    // Put your custom implementation above.

    $('html, body').animate({scrollTop: 0}, 'slow');
    $('#overlay').show();
  };

  /**
   * Function that is invoked when any touch event is triggered.
   *
   * @param e The event that was triggered.
   * @param touch Data about touch object.
   */
  OverlayMobile.prototype.updateStatus = function (e, touch) {
    var position = touch.currentTouch;

    log('OUTPUT: ' + e.type + ' was fired at x = ' + position.x + ', y = ' + position.y);

    // Put your custom implementation above.

    $('#cursor-status').text(e.type, touch.currentTouch);
  };

  /**
   * Function that show details about a event of touch.
   * This method is only invoked when the event: 'touchableend' is triggered.
   *
   * @param e The event that was triggered.
   * @param touch
   */
  OverlayMobile.prototype.logTouch = function (e, touch) {
    log(e.type, touch);
  };

  /**
   * Core function that always is invoked when an 'touchableend' event is fired.
   * When the user's timeout is available always that the user touch in the screen a new timeout for
   * show the overlay is setted.
   */
  OverlayMobile.prototype.registerTouch = function () {
    clearTimeout(instance.userTimeOut);

    if (instance.customTimeToShow > 0) {
      log("The custom time to show already is defined");

      instance.userTimeOut = setTimeout(instance.showOverlay, instance.customTimeToShow);

      return;
    }

    instance.touchesTrack.push(new Date());
    instance.amountOfTouches++;

    // I try to maintain the touches tracked for 3 minutes on cookie.
    setCookie(instance.Cookies.TouchesTracked, instance.touchesTrack, hoursFromMinutes(3));

    var touchesAlreadyTracked = (instance.touchesTrack.length == instance.minimumNumberOfTouches);

    if (touchesAlreadyTracked) {
      var j = 0;
      var totalAmount = 0;

      for (var i = 0, k = 1; k < instance.amountOfTouches; i++, k++) {
        totalAmount += instance.touchesTrack[k].getTime() - instance.touchesTrack[i].getTime();

        j++;
      }

      instance.customTimeToShow = (totalAmount / instance.amountOfTouches) * 2;
      instance.userTimeOut = setTimeout(instance.showOverlay, instance.customTimeToShow);

      setCookie(instance.Cookies.OverlayTimeOut, instance.customTimeToShow, hoursFromDays(60));

      log(instance.customTimeToShow);
    } else {
      instance.userTimeOut = setTimeout(instance.showOverlay, instance.defaultTimeToShowOverlay);

      log("A custom time is NOT already defined");
    }
  };

  /**
   * The function that is called when the current tab is in focus.
   * Works only in desktop.
   */
  OverlayMobile.prototype.windowFocus = function () {
    log("TODO: Put here the implementation for windowFocus function");

    // Put your custom implementation above.

    $('#tab-status').text = 'focus';
  };

  /**
   * Function fired when the current tab is changed.
   * Works only in desktop.
   */
  OverlayMobile.prototype.windowBlur = function () {
    log("TODO: Put here the implementation for windowBlur function");

    // Put your custom implementation above.

    $('#tab-status').text = 'blur';
  };

  /**
   * Try to recover all data from cookies, when the user's device is mobile dispatch methods for
   * touchable events are set.
   * Also, it is added event listeners for 'focus' and 'blur' events.
   * @param asDebugMode A boolean value that defines whether we're in debug mode or not.
   */
  OverlayMobile.prototype.init = function (asDebugMode) {
    var timeoutInCache = getCookie(instance.Cookies.OverlayTimeOut);
    var movesAlreadyTracked = getCookie(instance.Cookies.TouchesTracked);

    if (timeoutInCache) {
      instance.customTimeToShow = timeoutInCache;
    } else {
      setCookie(instance.Cookies.OverlayTimeOut, instance.customTimeToShow, hoursFromDays(60));
    }

    if (movesAlreadyTracked) {
      instance.touchesTrack = movesAlreadyTracked;
      instance.amountOfTouches = touchesTrack.length;
    }

    instance.isDebug = asDebugMode;

    if (instance.mobileDetect.mobile()) {
      var bindable = $(document).Touchable();

      bindable
        .bind('touchableend', instance.registerTouch)
        .bind('touchableend', instance.logTouch)
        .bind('touchablemove touchableend tap longTap doubleTap', instance.updateStatus);

      document.addEventListener('focus', instance.windowFocus);
      document.addEventListener('blur', instance.windowBlur);
    }
  };

  return {
    getInstance: getInstance
  }
}();

document.addEventListener('DOMContentLoaded', function () {
  var overlayMobile = new main.getInstance();

  overlayMobile.init(true);
});
