import { f as fromValues, c as create, a as create$1, l as lookAt, b as copy, i as invert, d as frustum, p as perspective, o as ortho, e as create$2, z as zero, s as subtract, g as distance, h as set, j as copy$1, k as create$3, m as copy$2, n as subtract$1, q as length, r as sub, t as add, u as scale, v as transformQuat, w as rotationTo, x as invert$1, y as glMatrix } from './common/vec2-5054ab4c.js';
import './common/es.string.replace-3e1f8f8c.js';
import './common/es.typed-array.float32-array-cc49d38f.js';
import './common/typed-array-constructor-6a40afc1.js';

// Camera
var CameraType;

(function (CameraType) {
  CameraType[CameraType["Camera"] = 0] = "Camera";
  CameraType[CameraType["Perspective"] = 1] = "Perspective";
  CameraType[CameraType["Orthographic"] = 2] = "Orthographic";
})(CameraType || (CameraType = {}));

var ControlsActions;

(function (ControlsActions) {
  ControlsActions["Rotate"] = "Rotate";
  ControlsActions["RotatePolar"] = "RotatePolar";
  ControlsActions["RotateAzimuth"] = "RotateAzimuth";
  ControlsActions["Dolly"] = "Dolly";
  ControlsActions["Zoom"] = "Zoom";
})(ControlsActions || (ControlsActions = {}));

var PointerManagerState;

(function (PointerManagerState) {
  PointerManagerState["Idle"] = "Idle";
  PointerManagerState["MouseWheel"] = "MouseWheel";
  PointerManagerState["MouseLeft"] = "MouseLeft";
  PointerManagerState["MouseMiddle"] = "MouseMiddle";
  PointerManagerState["MouseRight"] = "MouseRight";
  PointerManagerState["TouchOne"] = "TouchOne";
  PointerManagerState["TouchTwo"] = "TouchTwo";
  PointerManagerState["TouchThree"] = "TouchThree";
})(PointerManagerState || (PointerManagerState = {}));

class Camera {
  constructor(options) {
    this.type = CameraType.Camera;
    this.near = 0.1;
    this.far = 100;
    this.up = fromValues(0, 1, 0);
    this.position = fromValues(0, 0, 1);
    this.target = create();
    this.projectionMatrix = create$1();
    this.viewMatrix = create$1();
    this.inverseViewMatrix = create$1();
    Object.assign(this, options);
  }

  update() {
    lookAt(this.viewMatrix, this.position, this.target, this.up);
    copy(this.inverseViewMatrix, this.viewMatrix);
    invert(this.inverseViewMatrix, this.inverseViewMatrix);
  }

}

class PerspectiveCamera extends Camera {
  constructor(options) {
    super(options);
    this.type = CameraType.Perspective;
    this.fov = Math.PI / 4;
    this.aspect = 1;
    Object.assign(this, options);
    this.updateProjectionMatrix();
  }

  updateProjectionMatrix() {
    if (this.view) {
      const aspectRatio = this.view.totalSize[0] / this.view.totalSize[1];
      const top = Math.tan(this.fov * 0.5) * this.near;
      const bottom = -top;
      const left = aspectRatio * bottom;
      const right = aspectRatio * top;
      const width = Math.abs(right - left);
      const height = Math.abs(top - bottom);
      const widthNormalized = width / this.view.totalSize[0];
      const heightNormalized = height / this.view.totalSize[1];
      const l = left + this.view.offset[0] * widthNormalized;
      const r = left + (this.view.offset[0] + this.view.size[0]) * widthNormalized;
      const b = top - (this.view.offset[1] + this.view.size[1]) * heightNormalized;
      const t = top - this.view.offset[1] * heightNormalized;
      frustum(this.projectionMatrix, l, r, b, t, this.near, this.far);
    } else {
      perspective(this.projectionMatrix, this.fov, this.aspect, this.near, this.far);
    }
  }

}

class OrthographicCamera extends Camera {
  constructor(options) {
    super(options);
    this.type = CameraType.Orthographic;
    this.left = -1;
    this.right = 1;
    this.top = 1;
    this.bottom = -1;
    this.zoom = 1;
    Object.assign(this, options);
    this.updateProjectionMatrix();
  }

  updateProjectionMatrix() {
    const dx = (this.right - this.left) / (2 / this.zoom);
    const dy = (this.top - this.bottom) / (2 / this.zoom);
    const cx = (this.right + this.left) / 2;
    const cy = (this.top + this.bottom) / 2;
    let left = cx - dx;
    let right = cx + dx;
    let top = cy + dy;
    let bottom = cy - dy;

    if (this.view) {
      const zoomW = 1 / this.zoom / (this.view.size[0] / this.view.totalSize[0]);
      const zoomH = 1 / this.zoom / (this.view.size[1] / this.view.totalSize[1]);
      const scaleW = (this.right - this.left) / this.view.size[0];
      const scaleH = (this.top - this.bottom) / this.view.size[1];
      left += scaleW * (this.view.offset[0] / zoomW);
      right = left + scaleW * (this.view.size[0] / zoomW);
      top -= scaleH * (this.view.offset[1] / zoomH);
      bottom = top - scaleH * (this.view.size[1] / zoomH);
    }

    ortho(this.projectionMatrix, left, right, bottom, top, this.near, this.far);
  }

}

var clamp_1 = clamp;

function clamp(value, min, max) {
  return min < max ? value < min ? min : value > max ? max : value : value < max ? max : value > min ? min : value;
}

/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @providesModule UserAgent_DEPRECATED
 */

/**
 *  Provides entirely client-side User Agent and OS detection. You should prefer
 *  the non-deprecated UserAgent module when possible, which exposes our
 *  authoritative server-side PHP-based detection to the client.
 *
 *  Usage is straightforward:
 *
 *    if (UserAgent_DEPRECATED.ie()) {
 *      //  IE
 *    }
 *
 *  You can also do version checks:
 *
 *    if (UserAgent_DEPRECATED.ie() >= 7) {
 *      //  IE7 or better
 *    }
 *
 *  The browser functions will return NaN if the browser does not match, so
 *  you can also do version compares the other way:
 *
 *    if (UserAgent_DEPRECATED.ie() < 7) {
 *      //  IE6 or worse
 *    }
 *
 *  Note that the version is a float and may include a minor version number,
 *  so you should always use range operators to perform comparisons, not
 *  strict equality.
 *
 *  **Note:** You should **strongly** prefer capability detection to browser
 *  version detection where it's reasonable:
 *
 *    http://www.quirksmode.org/js/support.html
 *
 *  Further, we have a large number of mature wrapper functions and classes
 *  which abstract away many browser irregularities. Check the documentation,
 *  grep for things, or ask on javascript@lists.facebook.com before writing yet
 *  another copy of "event || window.event".
 *
 */
var _populated = false; // Browsers

var _ie, _firefox, _opera, _webkit, _chrome; // Actual IE browser for compatibility mode


var _ie_real_version; // Platforms


var _osx, _windows, _linux, _android; // Architectures


var _win64; // Devices


var _iphone, _ipad, _native;

var _mobile;

function _populate() {
  if (_populated) {
    return;
  }

  _populated = true; // To work around buggy JS libraries that can't handle multi-digit
  // version numbers, Opera 10's user agent string claims it's Opera
  // 9, then later includes a Version/X.Y field:
  //
  // Opera/9.80 (foo) Presto/2.2.15 Version/10.10

  var uas = navigator.userAgent;
  var agent = /(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera(?:.+Version.|.)(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))|(?:Trident\/\d+\.\d+.*rv:(\d+\.\d+))/.exec(uas);
  var os = /(Mac OS X)|(Windows)|(Linux)/.exec(uas);
  _iphone = /\b(iPhone|iP[ao]d)/.exec(uas);
  _ipad = /\b(iP[ao]d)/.exec(uas);
  _android = /Android/i.exec(uas);
  _native = /FBAN\/\w+;/i.exec(uas);
  _mobile = /Mobile/i.exec(uas); // Note that the IE team blog would have you believe you should be checking
  // for 'Win64; x64'.  But MSDN then reveals that you can actually be coming
  // from either x64 or ia64;  so ultimately, you should just check for Win64
  // as in indicator of whether you're in 64-bit IE.  32-bit IE on 64-bit
  // Windows will send 'WOW64' instead.

  _win64 = !!/Win64/.exec(uas);

  if (agent) {
    _ie = agent[1] ? parseFloat(agent[1]) : agent[5] ? parseFloat(agent[5]) : NaN; // IE compatibility mode

    if (_ie && document && document.documentMode) {
      _ie = document.documentMode;
    } // grab the "true" ie version from the trident token if available


    var trident = /(?:Trident\/(\d+.\d+))/.exec(uas);
    _ie_real_version = trident ? parseFloat(trident[1]) + 4 : _ie;
    _firefox = agent[2] ? parseFloat(agent[2]) : NaN;
    _opera = agent[3] ? parseFloat(agent[3]) : NaN;
    _webkit = agent[4] ? parseFloat(agent[4]) : NaN;

    if (_webkit) {
      // We do not add the regexp to the above test, because it will always
      // match 'safari' only since 'AppleWebKit' appears before 'Chrome' in
      // the userAgent string.
      agent = /(?:Chrome\/(\d+\.\d+))/.exec(uas);
      _chrome = agent && agent[1] ? parseFloat(agent[1]) : NaN;
    } else {
      _chrome = NaN;
    }
  } else {
    _ie = _firefox = _opera = _chrome = _webkit = NaN;
  }

  if (os) {
    if (os[1]) {
      // Detect OS X version.  If no version number matches, set _osx to true.
      // Version examples:  10, 10_6_1, 10.7
      // Parses version number as a float, taking only first two sets of
      // digits.  If only one set of digits is found, returns just the major
      // version number.
      var ver = /(?:Mac OS X (\d+(?:[._]\d+)?))/.exec(uas);
      _osx = ver ? parseFloat(ver[1].replace('_', '.')) : true;
    } else {
      _osx = false;
    }

    _windows = !!os[2];
    _linux = !!os[3];
  } else {
    _osx = _windows = _linux = false;
  }
}

var UserAgent_DEPRECATED = {
  /**
   *  Check if the UA is Internet Explorer.
   *
   *
   *  @return float|NaN Version number (if match) or NaN.
   */
  ie: function () {
    return _populate() || _ie;
  },

  /**
   * Check if we're in Internet Explorer compatibility mode.
   *
   * @return bool true if in compatibility mode, false if
   * not compatibility mode or not ie
   */
  ieCompatibilityMode: function () {
    return _populate() || _ie_real_version > _ie;
  },

  /**
   * Whether the browser is 64-bit IE.  Really, this is kind of weak sauce;  we
   * only need this because Skype can't handle 64-bit IE yet.  We need to remove
   * this when we don't need it -- tracked by #601957.
   */
  ie64: function () {
    return UserAgent_DEPRECATED.ie() && _win64;
  },

  /**
   *  Check if the UA is Firefox.
   *
   *
   *  @return float|NaN Version number (if match) or NaN.
   */
  firefox: function () {
    return _populate() || _firefox;
  },

  /**
   *  Check if the UA is Opera.
   *
   *
   *  @return float|NaN Version number (if match) or NaN.
   */
  opera: function () {
    return _populate() || _opera;
  },

  /**
   *  Check if the UA is WebKit.
   *
   *
   *  @return float|NaN Version number (if match) or NaN.
   */
  webkit: function () {
    return _populate() || _webkit;
  },

  /**
   *  For Push
   *  WILL BE REMOVED VERY SOON. Use UserAgent_DEPRECATED.webkit
   */
  safari: function () {
    return UserAgent_DEPRECATED.webkit();
  },

  /**
   *  Check if the UA is a Chrome browser.
   *
   *
   *  @return float|NaN Version number (if match) or NaN.
   */
  chrome: function () {
    return _populate() || _chrome;
  },

  /**
   *  Check if the user is running Windows.
   *
   *  @return bool `true' if the user's OS is Windows.
   */
  windows: function () {
    return _populate() || _windows;
  },

  /**
   *  Check if the user is running Mac OS X.
   *
   *  @return float|bool   Returns a float if a version number is detected,
   *                       otherwise true/false.
   */
  osx: function () {
    return _populate() || _osx;
  },

  /**
   * Check if the user is running Linux.
   *
   * @return bool `true' if the user's OS is some flavor of Linux.
   */
  linux: function () {
    return _populate() || _linux;
  },

  /**
   * Check if the user is running on an iPhone or iPod platform.
   *
   * @return bool `true' if the user is running some flavor of the
   *    iPhone OS.
   */
  iphone: function () {
    return _populate() || _iphone;
  },
  mobile: function () {
    return _populate() || _iphone || _ipad || _android || _mobile;
  },
  nativeApp: function () {
    // webviews inside of the native apps
    return _populate() || _native;
  },
  android: function () {
    return _populate() || _android;
  },
  ipad: function () {
    return _populate() || _ipad;
  }
};
var UserAgent_DEPRECATED_1 = UserAgent_DEPRECATED;

/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ExecutionEnvironment
 */

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
/**
 * Simple, lightweight module assisting with the detection and context of
 * Worker. Helps avoid circular dependencies and allows code to reason about
 * whether or not they are in a Worker, even if they never include the main
 * `ReactWorker` dependency.
 */

var ExecutionEnvironment = {
  canUseDOM: canUseDOM,
  canUseWorkers: typeof Worker !== 'undefined',
  canUseEventListeners: canUseDOM && !!(window.addEventListener || window.attachEvent),
  canUseViewport: canUseDOM && !!window.screen,
  isInWorker: !canUseDOM // For now, this is true - might change in the future.

};
var ExecutionEnvironment_1 = ExecutionEnvironment;

var useHasFeature;

if (ExecutionEnvironment_1.canUseDOM) {
  useHasFeature = document.implementation && document.implementation.hasFeature && // always returns true in newer browsers as per the standard.
  // @see http://dom.spec.whatwg.org/#dom-domimplementation-hasfeature
  document.implementation.hasFeature('', '') !== true;
}
/**
 * Checks if an event is supported in the current execution environment.
 *
 * NOTE: This will not work correctly for non-generic events such as `change`,
 * `reset`, `load`, `error`, and `select`.
 *
 * Borrows from Modernizr.
 *
 * @param {string} eventNameSuffix Event name, e.g. "click".
 * @param {?boolean} capture Check if the capture phase is supported.
 * @return {boolean} True if the event is supported.
 * @internal
 * @license Modernizr 3.0.0pre (Custom Build) | MIT
 */


function isEventSupported(eventNameSuffix, capture) {
  if (!ExecutionEnvironment_1.canUseDOM || capture && !('addEventListener' in document)) {
    return false;
  }

  var eventName = 'on' + eventNameSuffix;
  var isSupported = (eventName in document);

  if (!isSupported) {
    var element = document.createElement('div');
    element.setAttribute(eventName, 'return;');
    isSupported = typeof element[eventName] === 'function';
  }

  if (!isSupported && useHasFeature && eventNameSuffix === 'wheel') {
    // This is the only way to test support for the `wheel` event in IE9+.
    isSupported = document.implementation.hasFeature('Events.wheel', '3.0');
  }

  return isSupported;
}

var isEventSupported_1 = isEventSupported;

var PIXEL_STEP = 10;
var LINE_HEIGHT = 40;
var PAGE_HEIGHT = 800;
/**
 * Mouse wheel (and 2-finger trackpad) support on the web sucks.  It is
 * complicated, thus this doc is long and (hopefully) detailed enough to answer
 * your questions.
 *
 * If you need to react to the mouse wheel in a predictable way, this code is
 * like your bestest friend. * hugs *
 *
 * As of today, there are 4 DOM event types you can listen to:
 *
 *   'wheel'                -- Chrome(31+), FF(17+), IE(9+)
 *   'mousewheel'           -- Chrome, IE(6+), Opera, Safari
 *   'MozMousePixelScroll'  -- FF(3.5 only!) (2010-2013) -- don't bother!
 *   'DOMMouseScroll'       -- FF(0.9.7+) since 2003
 *
 * So what to do?  The is the best:
 *
 *   normalizeWheel.getEventType();
 *
 * In your event callback, use this code to get sane interpretation of the
 * deltas.  This code will return an object with properties:
 *
 *   spinX   -- normalized spin speed (use for zoom) - x plane
 *   spinY   -- " - y plane
 *   pixelX  -- normalized distance (to pixels) - x plane
 *   pixelY  -- " - y plane
 *
 * Wheel values are provided by the browser assuming you are using the wheel to
 * scroll a web page by a number of lines or pixels (or pages).  Values can vary
 * significantly on different platforms and browsers, forgetting that you can
 * scroll at different speeds.  Some devices (like trackpads) emit more events
 * at smaller increments with fine granularity, and some emit massive jumps with
 * linear speed or acceleration.
 *
 * This code does its best to normalize the deltas for you:
 *
 *   - spin is trying to normalize how far the wheel was spun (or trackpad
 *     dragged).  This is super useful for zoom support where you want to
 *     throw away the chunky scroll steps on the PC and make those equal to
 *     the slow and smooth tiny steps on the Mac. Key data: This code tries to
 *     resolve a single slow step on a wheel to 1.
 *
 *   - pixel is normalizing the desired scroll delta in pixel units.  You'll
 *     get the crazy differences between browsers, but at least it'll be in
 *     pixels!
 *
 *   - positive value indicates scrolling DOWN/RIGHT, negative UP/LEFT.  This
 *     should translate to positive value zooming IN, negative zooming OUT.
 *     This matches the newer 'wheel' event.
 *
 * Why are there spinX, spinY (or pixels)?
 *
 *   - spinX is a 2-finger side drag on the trackpad, and a shift + wheel turn
 *     with a mouse.  It results in side-scrolling in the browser by default.
 *
 *   - spinY is what you expect -- it's the classic axis of a mouse wheel.
 *
 *   - I dropped spinZ/pixelZ.  It is supported by the DOM 3 'wheel' event and
 *     probably is by browsers in conjunction with fancy 3D controllers .. but
 *     you know.
 *
 * Implementation info:
 *
 * Examples of 'wheel' event if you scroll slowly (down) by one step with an
 * average mouse:
 *
 *   OS X + Chrome  (mouse)     -    4   pixel delta  (wheelDelta -120)
 *   OS X + Safari  (mouse)     -  N/A   pixel delta  (wheelDelta  -12)
 *   OS X + Firefox (mouse)     -    0.1 line  delta  (wheelDelta  N/A)
 *   Win8 + Chrome  (mouse)     -  100   pixel delta  (wheelDelta -120)
 *   Win8 + Firefox (mouse)     -    3   line  delta  (wheelDelta -120)
 *
 * On the trackpad:
 *
 *   OS X + Chrome  (trackpad)  -    2   pixel delta  (wheelDelta   -6)
 *   OS X + Firefox (trackpad)  -    1   pixel delta  (wheelDelta  N/A)
 *
 * On other/older browsers.. it's more complicated as there can be multiple and
 * also missing delta values.
 *
 * The 'wheel' event is more standard:
 *
 * http://www.w3.org/TR/DOM-Level-3-Events/#events-wheelevents
 *
 * The basics is that it includes a unit, deltaMode (pixels, lines, pages), and
 * deltaX, deltaY and deltaZ.  Some browsers provide other values to maintain
 * backward compatibility with older events.  Those other values help us
 * better normalize spin speed.  Example of what the browsers provide:
 *
 *                          | event.wheelDelta | event.detail
 *        ------------------+------------------+--------------
 *          Safari v5/OS X  |       -120       |       0
 *          Safari v5/Win7  |       -120       |       0
 *         Chrome v17/OS X  |       -120       |       0
 *         Chrome v17/Win7  |       -120       |       0
 *                IE9/Win7  |       -120       |   undefined
 *         Firefox v4/OS X  |     undefined    |       1
 *         Firefox v4/Win7  |     undefined    |       3
 *
 */

function normalizeWheel(
/*object*/
event)
/*object*/
{
  var sX = 0,
      sY = 0,
      // spinX, spinY
  pX = 0,
      pY = 0; // pixelX, pixelY
  // Legacy

  if ('detail' in event) {
    sY = event.detail;
  }

  if ('wheelDelta' in event) {
    sY = -event.wheelDelta / 120;
  }

  if ('wheelDeltaY' in event) {
    sY = -event.wheelDeltaY / 120;
  }

  if ('wheelDeltaX' in event) {
    sX = -event.wheelDeltaX / 120;
  } // side scrolling on FF with DOMMouseScroll


  if ('axis' in event && event.axis === event.HORIZONTAL_AXIS) {
    sX = sY;
    sY = 0;
  }

  pX = sX * PIXEL_STEP;
  pY = sY * PIXEL_STEP;

  if ('deltaY' in event) {
    pY = event.deltaY;
  }

  if ('deltaX' in event) {
    pX = event.deltaX;
  }

  if ((pX || pY) && event.deltaMode) {
    if (event.deltaMode == 1) {
      // delta in LINE units
      pX *= LINE_HEIGHT;
      pY *= LINE_HEIGHT;
    } else {
      // delta in PAGE units
      pX *= PAGE_HEIGHT;
      pY *= PAGE_HEIGHT;
    }
  } // Fall-back if spin cannot be determined


  if (pX && !sX) {
    sX = pX < 1 ? -1 : 1;
  }

  if (pY && !sY) {
    sY = pY < 1 ? -1 : 1;
  }

  return {
    spinX: sX,
    spinY: sY,
    pixelX: pX,
    pixelY: pY
  };
}
/**
 * The best combination if you prefer spinX + spinY normalization.  It favors
 * the older DOMMouseScroll for Firefox, as FF does not include wheelDelta with
 * 'wheel' event, making spin speed determination impossible.
 */


normalizeWheel.getEventType = function ()
/*string*/
{
  return UserAgent_DEPRECATED_1.firefox() ? 'DOMMouseScroll' : isEventSupported_1('wheel') ? 'wheel' : 'mousewheel';
};

var normalizeWheel_1 = normalizeWheel;

var normalizeWheel$1 = normalizeWheel_1;

const HAS_TOUCH_EVENTS = ("TouchEvent" in window);
const EVENT_LISTENER_OPTIONS = {
  passive: false
};
const VEC2_IDENTITY = create$2();
const tempElement = create$2();
const tempPointer = create$2();
class PointerManager {
  constructor(options) {
    this.initialTouchDistance = 0;
    this.initialPosition = create$2();
    this.lastPosition = create$2();
    this.movePosition = create$2();
    this.clientSize = create$2();
    Object.assign(this, options);
    this.onMouseWheel = this.onMouseWheel.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.handleDragging = this.handleDragging.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
  }

  static isTouchEvent(event) {
    return HAS_TOUCH_EVENTS && event instanceof TouchEvent;
  }

  enable() {
    this.isElementRoot = this.element === document.body;

    if (this.config.wheel) {
      this.element.addEventListener(normalizeWheel$1.getEventType(), this.onMouseWheel);
    }

    if (this.config.drag) {
      this.element.addEventListener("mousedown", this.onMouseDown);
      this.element.addEventListener("touchstart", this.onTouchStart);
    }
  }

  disable() {
    if (this.config.wheel) {
      this.element.removeEventListener("wheel", this.onMouseWheel);
    }

    if (this.config.drag) {
      this.element.removeEventListener("mousedown", this.onMouseDown);
      this.element.removeEventListener("touchstart", this.onTouchStart);
    }
  } // Compute position helpers


  setClientSize(out) {
    const element = this.isElementRoot ? document.documentElement : this.element;
    out[0] = element.clientWidth;
    out[1] = element.clientHeight;
  }

  setTouchBaryCenter(out, event) {
    for (let i = 0; i < event.touches.length; i++) {
      out[0] += event.touches[i].clientX;
      out[1] += event.touches[i].clientY;
    }

    out[0] /= event.touches.length;
    out[1] /= event.touches.length;
  }

  getPointerPosition(event) {
    if (PointerManager.isTouchEvent(event)) {
      zero(tempPointer);
      this.setTouchBaryCenter(tempPointer, event);
    } else {
      tempPointer[0] = event.clientX;
      tempPointer[1] = event.clientY;
    }

    return tempPointer;
  }

  getElementPosition() {
    return this.isElementRoot ? VEC2_IDENTITY : (() => {
      const {
        left,
        top
      } = this.element.getBoundingClientRect();
      tempElement[0] = left;
      tempElement[1] = top;
      return tempElement;
    })();
  }

  setRelativePosition(out, event) {
    subtract(out, this.getPointerPosition(event), this.getElementPosition());
  } // Dragging


  initDragging(event) {
    this.setRelativePosition(this.initialPosition, event);
    this.setClientSize(this.clientSize);

    if (PointerManager.isTouchEvent(event) && event.touches.length >= 2) {
      const {
        clientX,
        clientY
      } = event.touches[1]; // Get finger distance

      this.initialTouchDistance = distance([clientX, clientY], this.initialPosition); // Set position to center

      set(this.lastPosition, (event.touches[0].clientX + clientX) * 0.5, (event.touches[0].clientY + clientY) * 0.5);
    } else {
      copy$1(this.lastPosition, this.initialPosition);
    }

    document.addEventListener("mousemove", this.handleDragging);
    document.addEventListener("touchmove", this.handleDragging, EVENT_LISTENER_OPTIONS);
    document.addEventListener("mouseup", this.onPointerUp);
    document.addEventListener("touchend", this.onPointerUp);
  }

  handleDragging(event) {
    event.preventDefault();
    this.setRelativePosition(this.movePosition, event);
    let dx = 0;
    let dy = 0;

    if (PointerManager.isTouchEvent(event) && event.touches.length >= 2) {
      dy = this.initialTouchDistance - distance([event.touches[1].clientX, event.touches[1].clientY], this.movePosition);
    } else {
      dx = (this.movePosition[0] - this.lastPosition[0]) / this.clientSize[1];
      dy = (this.movePosition[1] - this.lastPosition[1]) / this.clientSize[1];
    }

    copy$1(this.lastPosition, this.movePosition);
    this.onPointerUpdate({
      state: this.state,
      dx,
      dy,
      originalEvent: event
    });
  } // Event handlers


  onMouseWheel(event) {
    this.state = PointerManagerState.MouseWheel;
    this.onPointerUpdate({
      state: this.state,
      // Try normalising with drag offset
      dx: normalizeWheel$1(event).pixelX / 100,
      dy: normalizeWheel$1(event).pixelY / 100
    });
  }

  onMouseDown(event) {
    const prevState = this.state;
    this.state = PointerManager.BUTTONS[event.button];
    if (prevState !== this.state) this.initDragging(event);
  }

  onTouchStart(event) {
    event.preventDefault();
    const prevState = this.state;
    this.state = PointerManager.TOUCHES[event.touches.length];
    if (prevState !== this.state) this.initDragging(event);
  }

  onPointerUp() {
    this.state = PointerManagerState.Idle;
    document.removeEventListener("mousemove", this.handleDragging);
    document.removeEventListener("touchmove", this.handleDragging, EVENT_LISTENER_OPTIONS);
    document.removeEventListener("mouseup", this.onPointerUp);
    document.removeEventListener("touchend", this.onPointerUp);
  }

}
PointerManager.BUTTONS = [PointerManagerState.MouseLeft, PointerManagerState.MouseMiddle, PointerManagerState.MouseRight];
PointerManager.TOUCHES = [PointerManagerState.Idle, PointerManagerState.TouchOne, PointerManagerState.TouchTwo, PointerManagerState.TouchThree];

const {
  EPSILON
} = glMatrix;
const PI2 = Math.PI * 2;
const TEMP = create();
class Controls {
  constructor(options) {
    this.config = {
      [PointerManagerState.MouseLeft]: ControlsActions.Rotate,
      [PointerManagerState.MouseMiddle]: ControlsActions.Dolly,
      [PointerManagerState.MouseRight]: ControlsActions.RotatePolar,
      [PointerManagerState.MouseWheel]: ControlsActions.Dolly,
      [PointerManagerState.TouchOne]: ControlsActions.Rotate,
      [PointerManagerState.TouchTwo]: ControlsActions.Dolly,
      [PointerManagerState.TouchThree]: ControlsActions.RotatePolar
    };
    this.position = fromValues(0, 0, 1);
    this.target = create();
    this.phi = Math.PI / 2;
    this.theta = 0;
    this.damping = 0.9;
    this.dolly = true;
    this.dollySpeed = 1;
    this.dollyMaxDelta = Infinity;
    this.rotate = true;
    this.rotateSpeed = 1;
    this.rotateMaxThetaDelta = Infinity;
    this.rotateMaxPhiDelta = Infinity;
    this.distanceBounds = [EPSILON, Infinity];
    this.phiBounds = [0, Math.PI];
    this.thetaBounds = [-Infinity, Infinity];
    this.sphericalTarget = create();
    this.targetTarget = create();
    this.upQuat = create$3();
    this.upQuatInverse = create$3();
    Object.assign(this, options); // Set by spherical angle and optional distance

    if (options.theta || options.phi) {
      this.updatePosition();
    } // Set by position and optional target
    else {
        if (!options.position) copy$2(this.position, options.camera.position);
        subtract$1(TEMP, this.position, this.target);
        this.distance = length(TEMP);
        this.theta = Math.atan2(this.position[0], this.position[2]);
        this.phi = Math.acos(clamp_1(this.position[1] / this.distance, -1, 1));
      } // Init private targets


    this.sphericalTarget[0] = this.theta;
    this.sphericalTarget[1] = this.phi;
    this.sphericalTarget[2] = this.distance;
    copy$2(this.targetTarget, this.target);
    this.update();
    this.onPointerUpdate = this.onPointerUpdate.bind(this);
    this.pointerManager = new PointerManager({
      element: this.element,
      config: {
        wheel: true,
        drag: true
      },
      onPointerUpdate: this.onPointerUpdate
    });
    this.pointerManager.enable();
  }

  static isNegligeable(number) {
    return Math.abs(number) < EPSILON;
  } // Actions


  handleDolly(event) {
    if (!this.dolly) return;
    let delta = event.dy;

    switch (event.state) {
      case PointerManagerState.MouseLeft:
      case PointerManagerState.MouseRight:
      case PointerManagerState.MouseMiddle:
        {
          delta *= 20;
          break;
        }

      case PointerManagerState.TouchTwo:
        {
          delta /= 20;
          break;
        }
    }

    this.sphericalTarget[2] += clamp_1(delta * this.dollySpeed, -this.dollyMaxDelta, this.dollyMaxDelta);
  }

  handleRotateAzimuth(event) {
    this.sphericalTarget[0] -= clamp_1(PI2 * event.dx * this.rotateSpeed, -this.rotateMaxThetaDelta, this.rotateMaxThetaDelta);
  }

  handleRotatePolar(event) {
    this.sphericalTarget[1] -= clamp_1(PI2 * event.dy * this.rotateSpeed, -this.rotateMaxPhiDelta, this.rotateMaxPhiDelta);
  }

  handleRotate(event) {
    if (!this.rotate) return;
    this.handleRotateAzimuth(event);
    this.handleRotatePolar(event);
  } // Pointer Event handlers


  onPointerUpdate(event) {
    this[`handle${this.config[event.state]}`](event);
  } // Update


  updatePosition() {
    this.distance = Math.max(EPSILON, this.distance);
    this.position[0] = this.distance * Math.sin(this.phi) * Math.sin(this.theta);
    this.position[1] = this.distance * Math.cos(this.phi);
    this.position[2] = this.distance * Math.sin(this.phi) * Math.cos(this.theta);
  }

  update() {
    const dampRatio = 1 - this.damping;
    const deltaTheta = this.sphericalTarget[0] - this.theta;
    const deltaPhi = this.sphericalTarget[1] - this.phi;
    const deltaDistance = this.sphericalTarget[2] - this.distance;
    const deltaTarget = create();
    sub(deltaTarget, this.targetTarget, this.target);

    if (!Controls.isNegligeable(deltaTheta) || !Controls.isNegligeable(deltaPhi) || !Controls.isNegligeable(deltaDistance) || !Controls.isNegligeable(deltaTarget[0]) || !Controls.isNegligeable(deltaTarget[1]) || !Controls.isNegligeable(deltaTarget[2])) {
      this.theta = this.theta + deltaTheta * dampRatio;
      this.phi = this.phi + deltaPhi * dampRatio;
      this.distance = this.distance + deltaDistance * dampRatio;
      add(this.target, this.target, scale(deltaTarget, deltaTarget, dampRatio));
    } else {
      this.theta = this.sphericalTarget[0];
      this.phi = this.sphericalTarget[1];
      this.distance = this.sphericalTarget[2];
      copy$2(this.targetTarget, this.target);
      copy$2(this.target, deltaTarget);
    }

    subtract$1(this.position, this.position, this.target);
    transformQuat(this.position, this.position, this.upQuat);
    this.phi = clamp_1(this.phi, EPSILON, Math.PI - EPSILON);
    this.distance = clamp_1(this.distance, this.distanceBounds[0], this.distanceBounds[1]);
    rotationTo(this.upQuat, this.camera.up, Controls.Y_UP);
    invert$1(this.upQuatInverse, this.upQuat);
    this.updatePosition(); // TODO: copy directly into camera as an option

    transformQuat(this.position, this.position, this.upQuatInverse);
    add(this.position, this.target, this.position);
  }

}
Controls.Y_UP = fromValues(0, 1, 0);

export { Camera, Controls, OrthographicCamera, PerspectiveCamera, PointerManager };
