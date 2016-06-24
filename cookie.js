/**
 * Try to get a specific cookie found from its name.
 * @param name The cookie's name.
 */
function getCookie(name) {
  var cookiePool = document.cookie;
  var identifier = name + '=';
  var startIndex = cookiePool.indexOf(identifier);
  var endIndex = -1;

  if (startIndex >= 0) {
    startIndex = cookiePool.indexOf('=', startIndex) + 1;
    endIndex = cookiePool.indexOf(';', startIndex);

    if (endIndex === -1) {
      endIndex = cookiePool.length;
    }

    var cookieValue = cookiePool.substring(startIndex, endIndex);

    return decodeURI(cookieValue)
  }

  return false;
}

/**
 * Try to set a cookie in the Cookie Pool.
 * @param name The cookie's name.
 * @param value The value that should be store in cookie.
 * @param validityInHours Amount of hours this new cookie should be alive before die.
 */
function setCookie(name, value, validityInHours) {
  var date = new Date();
  var now = date.getTime();
  var timeToExpire = now + validityInHours * 36e5; // 36e5 => 36 * 10^5 = 3600000

  date.setTime(timeToExpire);

  var expiresIn = date.toUTCString();
  var domain = location.host.replace(/^www/, ''); // Remove www from host address.

  document.cookie = name + '=' + value + ';expires=' + expiresIn + ';domain=' + domain + ';path=/';
}
