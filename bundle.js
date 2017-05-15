require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;
},{}],2:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if ("production " !== 'production') {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;
},{}],3:[function(require,module,exports){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var emptyFunction = require('./emptyFunction');

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if ("production " !== 'production') {
  (function () {
    var printWarning = function printWarning(format) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var argIndex = 0;
      var message = 'Warning: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      });
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    };

    warning = function warning(condition, format) {
      if (format === undefined) {
        throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
      }

      if (format.indexOf('Failed Composite propType: ') === 0) {
        return; // Ignore CompositeComponent proptype check.
      }

      if (!condition) {
        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          args[_key2 - 2] = arguments[_key2];
        }

        printWarning.apply(undefined, [format].concat(args));
      }
    };
  })();
}

module.exports = warning;
},{"./emptyFunction":1}],4:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

if ("production " !== 'production') {
  var invariant = require('fbjs/lib/invariant');
  var warning = require('fbjs/lib/warning');
  var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');
  var loggedTypeFailures = {};
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if ("production " !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'React.PropTypes.', componentName || 'React class', location, typeSpecName);
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
        }
      }
    }
  }
}

module.exports = checkPropTypes;

},{"./lib/ReactPropTypesSecret":8,"fbjs/lib/invariant":2,"fbjs/lib/warning":3}],5:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var emptyFunction = require('fbjs/lib/emptyFunction');
var invariant = require('fbjs/lib/invariant');
var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    invariant(
      false,
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

},{"./lib/ReactPropTypesSecret":8,"fbjs/lib/emptyFunction":1,"fbjs/lib/invariant":2}],6:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var emptyFunction = require('fbjs/lib/emptyFunction');
var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');
var checkPropTypes = require('./checkPropTypes');

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if ("production " !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          invariant(
            false,
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
        } else if ("production " !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            warning(
              false,
              'You are manually calling a React.PropTypes validation ' +
              'function for the `%s` prop on `%s`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.',
              propFullName,
              componentName
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunction.thatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      "production " !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      "production " !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        warning(
          false,
          'Invalid argument supplid to oneOfType. Expected an array of check functions, but ' +
          'received %s at index %s.',
          getPostfixForTypeWarning(checker),
          i
        );
        return emptyFunction.thatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

},{"./checkPropTypes":4,"./lib/ReactPropTypesSecret":8,"fbjs/lib/emptyFunction":1,"fbjs/lib/invariant":2,"fbjs/lib/warning":3}],7:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

if ("production " !== 'production') {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = require('./factoryWithTypeCheckers')(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = require('./factoryWithThrowingShims')();
}

},{"./factoryWithThrowingShims":5,"./factoryWithTypeCheckers":6}],8:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var MODE_IDLE = exports.MODE_IDLE = 'idle';
var MODE_PANNING = exports.MODE_PANNING = 'panning';
var MODE_ZOOMING = exports.MODE_ZOOMING = 'zooming';

var TOOL_AUTO = exports.TOOL_AUTO = 'auto';
var TOOL_NONE = exports.TOOL_NONE = 'none';
var TOOL_PAN = exports.TOOL_PAN = 'pan';
var TOOL_ZOOM_IN = exports.TOOL_ZOOM_IN = 'zoom-in';
var TOOL_ZOOM_OUT = exports.TOOL_ZOOM_OUT = 'zoom-out';

var POSITION_NONE = exports.POSITION_NONE = 'none';
var POSITION_TOP = exports.POSITION_TOP = 'top';
var POSITION_RIGHT = exports.POSITION_RIGHT = 'right';
var POSITION_BOTTOM = exports.POSITION_BOTTOM = 'bottom';
var POSITION_LEFT = exports.POSITION_LEFT = 'left';
},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (originalEvent, value, SVGViewer) {

  var eventType = originalEvent.type;

  switch (eventType) {
    case "mousemove":
    case "mouseup":
    case "mousedown":
    case "click":
    case "dblclick":
      return new _viewerMouseEvent2.default(originalEvent, value, SVGViewer);

    case "touchstart":
    case "touchmove":
    case "touchend":
    case "touchcancel":
      return new _viewerTouchEvent2.default(originalEvent, value, SVGViewer);

    default:
      throw new Error(eventType + ' not supported');
  }
};

var _viewerMouseEvent = require('./viewer-mouse-event');

var _viewerMouseEvent2 = _interopRequireDefault(_viewerMouseEvent);

var _viewerTouchEvent = require('./viewer-touch-event');

var _viewerTouchEvent2 = _interopRequireDefault(_viewerTouchEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./viewer-mouse-event":12,"./viewer-touch-event":13}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _common = require('../features/common');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ViewerEvent = function () {
  function ViewerEvent(originalEvent, value, SVGViewer) {
    _classCallCheck(this, ViewerEvent);

    this.originalEvent = originalEvent;
    this.value = value;
    this.SVGViewer = SVGViewer;
  }

  _createClass(ViewerEvent, [{
    key: 'preventDefault',
    value: function preventDefault() {
      this.originalEvent.preventDefault();
    }
  }, {
    key: 'stopPropagation',
    value: function stopPropagation() {
      this.originalEvent.stopPropagation();
    }
  }, {
    key: 'scaleFactor',
    get: function get() {
      this._cacheDecomposedValue = this._cacheDecomposedValue || (0, _common.decompose)(this.value);
      return this._cacheDecomposedValue.scaleFactor;
    }
  }, {
    key: 'translationX',
    get: function get() {
      this._cacheDecomposedValue = this._cacheDecomposedValue || (0, _common.decompose)(this.value);
      return this._cacheDecomposedValue.translationX;
    }
  }, {
    key: 'translationY',
    get: function get() {
      this._cacheDecomposedValue = this._cacheDecomposedValue || (0, _common.decompose)(this.value);
      return this._cacheDecomposedValue.translationY;
    }
  }]);

  return ViewerEvent;
}();

exports.default = ViewerEvent;
},{"../features/common":14}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _common = require('../features/common');

var _viewerEvent = require('./viewer-event');

var _viewerEvent2 = _interopRequireDefault(_viewerEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ViewerMouseEvent = function (_ViewerEvent) {
  _inherits(ViewerMouseEvent, _ViewerEvent);

  function ViewerMouseEvent() {
    _classCallCheck(this, ViewerMouseEvent);

    return _possibleConstructorReturn(this, (ViewerMouseEvent.__proto__ || Object.getPrototypeOf(ViewerMouseEvent)).apply(this, arguments));
  }

  _createClass(ViewerMouseEvent, [{
    key: 'point',
    get: function get() {
      if (!this._cachePoint) {
        var event = this.originalEvent,
            value = this.value,
            SVGViewer = this.SVGViewer;

        var rect = SVGViewer.getBoundingClientRect();
        var x = event.clientX - Math.round(rect.left);
        var y = event.clientY - Math.round(rect.top);

        this._cachePoint = (0, _common.getSVGPoint)(value, x, y);
      }
      return this._cachePoint;
    }
  }, {
    key: 'x',
    get: function get() {
      return this.point.x;
    }
  }, {
    key: 'y',
    get: function get() {
      return this.point.y;
    }
  }]);

  return ViewerMouseEvent;
}(_viewerEvent2.default);

exports.default = ViewerMouseEvent;
},{"../features/common":14,"./viewer-event":11}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _common = require('../features/common');

var _viewerEvent = require('./viewer-event');

var _viewerEvent2 = _interopRequireDefault(_viewerEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ViewerTouchEvent = function (_ViewerEvent) {
  _inherits(ViewerTouchEvent, _ViewerEvent);

  function ViewerTouchEvent() {
    _classCallCheck(this, ViewerTouchEvent);

    return _possibleConstructorReturn(this, (ViewerTouchEvent.__proto__ || Object.getPrototypeOf(ViewerTouchEvent)).apply(this, arguments));
  }

  _createClass(ViewerTouchEvent, [{
    key: 'points',
    get: function get() {
      if (!this._cachePoints) this._cachePoints = ViewerTouchEvent.touchesToPoints(this.originalEvent.touches, this.SVGViewer, this.value);

      return this._cachePoints;
    }
  }, {
    key: 'changedPoints',
    get: function get() {
      if (!this._cacheChangedPoints) this._cacheChangedPoints = ViewerTouchEvent.touchesToPoints(this.originalEvent.changedTouches, this.SVGViewer, this.value);

      return this._cacheChangedPoints;
    }
  }], [{
    key: 'touchesToPoints',
    value: function touchesToPoints(touches, SVGViewer, value) {
      var points = [];
      for (var i = 0; i < touches.length; i++) {
        var touch = touches[i];

        var rect = SVGViewer.getBoundingClientRect();
        var x = touch.clientX - Math.round(rect.left);
        var y = touch.clientY - Math.round(rect.top);

        var point = (0, _common.getSVGPoint)(value, x, y);

        points.push(_extends({}, point, { identifier: touch.identifier }));
      }
      return points;
    }
  }]);

  return ViewerTouchEvent;
}(_viewerEvent2.default);

exports.default = ViewerTouchEvent;
},{"../features/common":14,"./viewer-event":11}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getDefaultValue = getDefaultValue;
exports.set = set;
exports.isValueValid = isValueValid;
exports.getSVGPoint = getSVGPoint;
exports.decompose = decompose;
exports.setFocus = setFocus;
exports.setViewerSize = setViewerSize;
exports.setSVGSize = setSVGSize;
exports.setPointOnViewerCenter = setPointOnViewerCenter;
exports.reset = reset;
exports.resetMode = resetMode;

var _constants = require('../constants');

var _transformationMatrix = require('transformation-matrix');

/**
 * Obtain default value
 * @returns {Object}
 */
function getDefaultValue(viewerWidth, viewerHeight, SVGWidth, SVGHeight) {
  return set({}, _extends({}, (0, _transformationMatrix.identity)(), {
    version: 2,
    mode: _constants.MODE_IDLE,
    focus: false,
    viewerWidth: viewerWidth,
    viewerHeight: viewerHeight,
    SVGWidth: SVGWidth,
    SVGHeight: SVGHeight,
    startX: null,
    startY: null,
    endX: null,
    endY: null,
    miniatureOpen: true
  }));
}

/**
 * Change value
 * @param value
 * @param change
 * @returns {Object}
 */
function set(value, change) {
  value = Object.assign({}, value, change);
  return Object.freeze(value);
}

/**
 * value valid check
 * @param value
 */
function isValueValid(value) {
  return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.hasOwnProperty('version');
}

/**
 * Export x,y coords relative to SVG
 * @param value
 * @param viewerX
 * @param viewerY
 * @returns {*|{x, y}|{x: number, y: number}}
 */
function getSVGPoint(value, viewerX, viewerY) {
  var matrix = (0, _transformationMatrix.fromObject)(value);

  var inverseMatrix = (0, _transformationMatrix.inverse)(matrix);
  return (0, _transformationMatrix.applyToPoint)(inverseMatrix, { x: viewerX, y: viewerY });
}

/**
 * Decompose matrix from value
 * @param value
 * @returns {{scaleFactor: number, translationX: number, translationY: number}}
 */
function decompose(value) {
  var matrix = (0, _transformationMatrix.fromObject)(value);

  return {
    scaleFactor: matrix.a,
    translationX: matrix.e,
    translationY: matrix.f
  };
}

/**
 *
 * @param value
 * @param focus
 * @returns {Object}
 */
function setFocus(value, focus) {
  return set(value, { focus: focus });
}

/**
 *
 * @param value
 * @param viewerWidth
 * @param viewerHeight
 * @returns {Object}
 */
function setViewerSize(value, viewerWidth, viewerHeight) {
  return set(value, { viewerWidth: viewerWidth, viewerHeight: viewerHeight });
}

/**
 *
 * @param value
 * @param SVGWidth
 * @param SVGHeight
 * @returns {Object}
 */
function setSVGSize(value, SVGWidth, SVGHeight) {
  return set(value, { SVGWidth: SVGWidth, SVGHeight: SVGHeight });
}

/**
 *
 * @param value
 * @param SVGPointX
 * @param SVGPointY
 * @param zoomLevel
 * @returns {Object}
 */
function setPointOnViewerCenter(value, SVGPointX, SVGPointY, zoomLevel) {
  var viewerWidth = value.viewerWidth,
      viewerHeight = value.viewerHeight;


  var matrix = (0, _transformationMatrix.transform)((0, _transformationMatrix.translate)(-SVGPointX + viewerWidth / 2, -SVGPointY + viewerHeight / 2), //4
  (0, _transformationMatrix.translate)(SVGPointX, SVGPointY), //3
  (0, _transformationMatrix.scale)(zoomLevel, zoomLevel), //2
  (0, _transformationMatrix.translate)(-SVGPointX, -SVGPointY) //1
  );

  return set(value, _extends({
    mode: _constants.MODE_IDLE
  }, matrix));
}

/**
 *
 * @param value
 * @returns {Object}
 */
function reset(value) {
  return set(value, _extends({
    mode: _constants.MODE_IDLE
  }, (0, _transformationMatrix.identity)()));
}

/**
 *
 * @param value
 * @returns {Object}
 */
function resetMode(value) {
  return set(value, {
    mode: _constants.MODE_IDLE,
    startX: null,
    startY: null,
    endX: null,
    endY: null
  });
}
},{"../constants":9,"transformation-matrix":43}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onTouchStart = onTouchStart;
exports.onTouchMove = onTouchMove;
exports.onTouchEnd = onTouchEnd;
exports.onTouchCancel = onTouchCancel;

var _constants = require('../constants');

var _common = require('./common');

var _interactions = require('./interactions');

function onTouchStart(event, ViewerDOM, tool, value, props) {
  var x = void 0,
      y = void 0;
  if (event.touches.length === 1) {
    var touchPosition = event.touches[0];

    var _ViewerDOM$getBoundin = ViewerDOM.getBoundingClientRect(),
        left = _ViewerDOM$getBoundin.left,
        top = _ViewerDOM$getBoundin.top;

    x = touchPosition.clientX - Math.round(left);
    y = touchPosition.clientY - Math.round(top);
  } else {
    if ([_constants.MODE_PANNING, _constants.MODE_ZOOMING].indexOf(value.mode) >= 0) {
      return (0, _common.resetMode)(value);
    } else if ([_constants.MODE_IDLE].indexOf(value.mode) >= 0) {
      return value;
    }
  }

  switch (tool) {
    case _constants.TOOL_ZOOM_OUT:
    case _constants.TOOL_ZOOM_IN:
    case _constants.TOOL_AUTO:
    case _constants.TOOL_PAN:
      event.stopPropagation();
      event.preventDefault();
      return (0, _interactions.onMouseDown)(event, ViewerDOM, tool, value, props, { x: x, y: y });

    default:
      return value;
  }
}

function onTouchMove(event, ViewerDOM, tool, value, props) {
  if (!([_constants.MODE_PANNING, _constants.MODE_ZOOMING].indexOf(value.mode) >= 0)) return value;

  var touchPosition = event.touches[0];

  var _ViewerDOM$getBoundin2 = ViewerDOM.getBoundingClientRect(),
      left = _ViewerDOM$getBoundin2.left,
      top = _ViewerDOM$getBoundin2.top;

  var x = touchPosition.clientX - Math.round(left);
  var y = touchPosition.clientY - Math.round(top);

  switch (tool) {
    case _constants.TOOL_ZOOM_OUT:
    case _constants.TOOL_ZOOM_IN:
    case _constants.TOOL_AUTO:
    case _constants.TOOL_PAN:
      event.stopPropagation();
      event.preventDefault();
      return (0, _interactions.onMouseMove)(event, ViewerDOM, tool, value, props, { x: x, y: y });

    default:
      return value;
  }
}

function onTouchEnd(event, ViewerDOM, tool, value, props) {
  if (!([_constants.MODE_PANNING, _constants.MODE_ZOOMING].indexOf(value.mode) >= 0)) return value;

  var touchPosition = event.changedTouches[0];

  var _ViewerDOM$getBoundin3 = ViewerDOM.getBoundingClientRect(),
      left = _ViewerDOM$getBoundin3.left,
      top = _ViewerDOM$getBoundin3.top;

  var x = touchPosition.clientX - Math.round(left);
  var y = touchPosition.clientY - Math.round(top);

  switch (tool) {
    case _constants.TOOL_ZOOM_OUT:
    case _constants.TOOL_ZOOM_IN:
    case _constants.TOOL_AUTO:
    case _constants.TOOL_PAN:
      event.stopPropagation();
      event.preventDefault();
      return (0, _interactions.onMouseUp)(event, ViewerDOM, tool, value, props, { x: x, y: y });

    default:
      return value;
  }
}

function onTouchCancel(event, ViewerDOM, tool, value, props) {
  event.stopPropagation();
  event.preventDefault();

  return (0, _common.resetMode)(value);
}
},{"../constants":9,"./common":14,"./interactions":16}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onMouseDown = onMouseDown;
exports.onMouseMove = onMouseMove;
exports.onMouseUp = onMouseUp;
exports.onDoubleClick = onDoubleClick;
exports.onWheel = onWheel;
exports.onMouseEnterOrLeave = onMouseEnterOrLeave;
exports.onInterval = onInterval;

var _constants = require('../constants');

var _common = require('./common');

var _pan = require('./pan');

var _zoom = require('./zoom');

var _utils = require('../utils');

function onMouseDown(event, ViewerDOM, tool, value, props) {
  var coords = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

  var x = void 0,
      y = void 0;
  if (coords) {
    x = coords.x;
    y = coords.y;
  } else {
    var _ViewerDOM$getBoundin = ViewerDOM.getBoundingClientRect(),
        left = _ViewerDOM$getBoundin.left,
        top = _ViewerDOM$getBoundin.top;

    x = event.clientX - Math.round(left);
    y = event.clientY - Math.round(top);
  }

  var nextValue = value;

  switch (tool) {
    case _constants.TOOL_ZOOM_OUT:
      var SVGPoint = (0, _common.getSVGPoint)(value, x, y);
      nextValue = (0, _zoom.zoom)(value, SVGPoint.x, SVGPoint.y, 1 / props.scaleFactor);
      break;

    case _constants.TOOL_ZOOM_IN:
      nextValue = (0, _zoom.startZooming)(value, x, y);
      break;

    case _constants.TOOL_AUTO:
    case _constants.TOOL_PAN:
      nextValue = (0, _pan.startPanning)(value, x, y);
      break;

    default:
      return value;
  }

  event.preventDefault();
  return nextValue;
}

function onMouseMove(event, ViewerDOM, tool, value, props) {
  var coords = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

  var x = void 0,
      y = void 0;
  if (coords) {
    x = coords.x;
    y = coords.y;
  } else {
    var _ViewerDOM$getBoundin2 = ViewerDOM.getBoundingClientRect(),
        left = _ViewerDOM$getBoundin2.left,
        top = _ViewerDOM$getBoundin2.top;

    x = event.clientX - Math.round(left);
    y = event.clientY - Math.round(top);
  }

  var forceExit = event.buttons === 0; //the mouse exited and reentered into svg
  var nextValue = value;

  switch (tool) {
    case _constants.TOOL_ZOOM_IN:
      if (value.mode === _constants.MODE_ZOOMING) nextValue = forceExit ? (0, _zoom.stopZooming)(value, x, y, props.scaleFactor) : (0, _zoom.updateZooming)(value, x, y);
      break;

    case _constants.TOOL_AUTO:
    case _constants.TOOL_PAN:
      if (value.mode === _constants.MODE_PANNING) nextValue = forceExit ? (0, _pan.stopPanning)(value) : (0, _pan.updatePanning)(value, x, y, props.preventPanOutside ? 20 : undefined);
      break;

    default:
      return value;
  }

  event.preventDefault();
  return nextValue;
}

function onMouseUp(event, ViewerDOM, tool, value, props) {
  var coords = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

  var x = void 0,
      y = void 0;
  if (coords) {
    x = coords.x;
    y = coords.y;
  } else {
    var _ViewerDOM$getBoundin3 = ViewerDOM.getBoundingClientRect(),
        left = _ViewerDOM$getBoundin3.left,
        top = _ViewerDOM$getBoundin3.top;

    x = event.clientX - Math.round(left);
    y = event.clientY - Math.round(top);
  }

  var nextValue = value;

  switch (tool) {
    case _constants.TOOL_ZOOM_OUT:
      if (value.mode === _constants.MODE_ZOOMING) nextValue = (0, _zoom.stopZooming)(value, x, y, 1 / props.scaleFactor);
      break;

    case _constants.TOOL_ZOOM_IN:
      if (value.mode === _constants.MODE_ZOOMING) nextValue = (0, _zoom.stopZooming)(value, x, y, props.scaleFactor);
      break;

    case _constants.TOOL_AUTO:
    case _constants.TOOL_PAN:
      if (value.mode === _constants.MODE_PANNING) nextValue = (0, _pan.stopPanning)(value, x, y);
      break;

    default:
      return value;
  }

  event.preventDefault();
  return nextValue;
}

function onDoubleClick(event, ViewerDOM, tool, value, props) {
  var coords = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

  var x = void 0,
      y = void 0;
  if (coords) {
    x = coords.x;
    y = coords.y;
  } else {
    var _ViewerDOM$getBoundin4 = ViewerDOM.getBoundingClientRect(),
        left = _ViewerDOM$getBoundin4.left,
        top = _ViewerDOM$getBoundin4.top;

    x = event.clientX - Math.round(left);
    y = event.clientY - Math.round(top);
  }

  var nextValue = value;

  switch (tool) {
    case _constants.TOOL_AUTO:
      var SVGPoint = (0, _common.getSVGPoint)(value, x, y);
      var modifierKeysReducer = function modifierKeysReducer(current, modifierKey) {
        return current || event.getModifierState(modifierKey);
      };
      var modifierKeyActive = props.modifierKeys.reduce(modifierKeysReducer, false);
      var scaleFactor = modifierKeyActive ? 1 / props.scaleFactor : props.scaleFactor;
      nextValue = (0, _zoom.zoom)(value, SVGPoint.x, SVGPoint.y, scaleFactor);
      break;

    default:
      return value;
  }

  event.preventDefault();
  return nextValue;
}

function onWheel(event, ViewerDOM, tool, value, props) {
  var coords = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

  var x = void 0,
      y = void 0;
  if (coords) {
    x = coords.x;
    y = coords.y;
  } else {
    var _ViewerDOM$getBoundin5 = ViewerDOM.getBoundingClientRect(),
        left = _ViewerDOM$getBoundin5.left,
        top = _ViewerDOM$getBoundin5.top;

    x = event.clientX - Math.round(left);
    y = event.clientY - Math.round(top);
  }

  if (!props.detectWheel) return value;

  var delta = Math.max(-1, Math.min(1, event.deltaY));
  var scaleFactor = (0, _utils.mapRange)(delta, -1, 1, 1.06, 0.96);

  var SVGPoint = (0, _common.getSVGPoint)(value, x, y);
  var nextValue = (0, _zoom.zoom)(value, SVGPoint.x, SVGPoint.y, scaleFactor);

  event.preventDefault();
  return nextValue;
}

function onMouseEnterOrLeave(event, ViewerDOM, tool, value, props) {
  var coords = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

  var nextValue = (0, _common.setFocus)(value, event.type === 'mouseenter');

  event.preventDefault();
  return nextValue;
}

function onInterval(event, ViewerDOM, tool, value, props) {
  var coords = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
  var x = coords.x,
      y = coords.y;


  if (!([_constants.TOOL_NONE, _constants.TOOL_AUTO].indexOf(tool) >= 0)) return value;
  if (!props.detectAutoPan) return value;
  if (!value.focus) return value;

  return (0, _pan.autoPanIfNeeded)(value, x, y);
}
},{"../constants":9,"../utils":37,"./common":14,"./pan":18,"./zoom":19}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openMiniature = openMiniature;
exports.closeMiniature = closeMiniature;

var _common = require('./common');

function openMiniature(value) {
  return (0, _common.set)(value, {
    miniatureOpen: true
  });
}

function closeMiniature(value) {
  return (0, _common.set)(value, {
    miniatureOpen: false
  });
}
},{"./common":14}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.pan = pan;
exports.startPanning = startPanning;
exports.updatePanning = updatePanning;
exports.stopPanning = stopPanning;
exports.autoPanIfNeeded = autoPanIfNeeded;

var _constants = require('../constants');

var _common = require('./common');

var _transformationMatrix = require('transformation-matrix');

/**
 *
 * @param value
 * @param SVGDeltaX
 * @param SVGDeltaY
 * @param panLimit
 * @returns {Object}
 */
function pan(value, SVGDeltaX, SVGDeltaY) {
  var panLimit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;


  var matrix = (0, _transformationMatrix.transform)((0, _transformationMatrix.fromObject)(value), //2
  (0, _transformationMatrix.translate)(SVGDeltaX, SVGDeltaY) //1
  );

  // apply pan limits
  if (panLimit) {
    var _applyToPoints = (0, _transformationMatrix.applyToPoints)(matrix, [{ x: panLimit, y: panLimit }, { x: value.SVGWidth - panLimit, y: value.SVGHeight - panLimit }]),
        _applyToPoints2 = _slicedToArray(_applyToPoints, 2),
        _applyToPoints2$ = _applyToPoints2[0],
        x1 = _applyToPoints2$.x,
        y1 = _applyToPoints2$.y,
        _applyToPoints2$2 = _applyToPoints2[1],
        x2 = _applyToPoints2$2.x,
        y2 = _applyToPoints2$2.y;

    //x limit


    var moveX = 0;
    if (value.viewerWidth - x1 < 0) moveX = value.viewerWidth - x1;else if (x2 < 0) moveX = -x2;

    //y limit
    var moveY = 0;
    if (value.viewerHeight - y1 < 0) moveY = value.viewerHeight - y1;else if (y2 < 0) moveY = -y2;

    //apply limits
    matrix = (0, _transformationMatrix.transform)((0, _transformationMatrix.translate)(moveX, moveY), matrix);
  }

  return (0, _common.set)(value, _extends({
    mode: _constants.MODE_IDLE
  }, matrix));
}

function startPanning(value, viewerX, viewerY) {
  return (0, _common.set)(value, {
    mode: _constants.MODE_PANNING,
    startX: viewerX,
    startY: viewerY,
    endX: viewerX,
    endY: viewerY
  });
}

function updatePanning(value, viewerX, viewerY, panLimit) {
  if (value.mode !== _constants.MODE_PANNING) throw new Error('update pan not allowed in this mode ' + value.mode);

  var endX = value.endX,
      endY = value.endY;


  var start = (0, _common.getSVGPoint)(value, endX, endY);
  var end = (0, _common.getSVGPoint)(value, viewerX, viewerY);

  var deltaX = end.x - start.x;
  var deltaY = end.y - start.y;

  var nextValue = pan(value, deltaX, deltaY, panLimit);
  return (0, _common.set)(nextValue, {
    mode: _constants.MODE_PANNING,
    endX: viewerX,
    endY: viewerY
  });
}

function stopPanning(value) {
  return (0, _common.set)(value, {
    mode: _constants.MODE_IDLE,
    startX: null,
    startY: null,
    endX: null,
    endY: null
  });
}

function autoPanIfNeeded(value, viewerX, viewerY) {
  var deltaX = 0;
  var deltaY = 0;

  if (viewerY <= 20) deltaY = 20;
  if (value.viewerWidth - viewerX <= 20) deltaX = -20;
  if (value.viewerHeight - viewerY <= 20) deltaY = -20;
  if (viewerX <= 20) deltaX = 20;

  return deltaX === 0 && deltaY === 0 ? value : pan(value, deltaX, deltaY);
}
},{"../constants":9,"./common":14,"transformation-matrix":43}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.zoom = zoom;
exports.fitSelection = fitSelection;
exports.fitToViewer = fitToViewer;
exports.zoomOnViewerCenter = zoomOnViewerCenter;
exports.startZooming = startZooming;
exports.updateZooming = updateZooming;
exports.stopZooming = stopZooming;

var _transformationMatrix = require('transformation-matrix');

var _constants = require('../constants');

var _common = require('./common');

var _utils = require('../utils');

function zoom(value, SVGPointX, SVGPointY, scaleFactor) {

  var matrix = (0, _transformationMatrix.transform)((0, _transformationMatrix.fromObject)(value), (0, _transformationMatrix.translate)(SVGPointX, SVGPointY), (0, _transformationMatrix.scale)(scaleFactor, scaleFactor), (0, _transformationMatrix.translate)(-SVGPointX, -SVGPointY));

  return (0, _common.set)(value, _extends({
    mode: _constants.MODE_IDLE
  }, matrix, {
    startX: null,
    startY: null,
    endX: null,
    endY: null
  }));
}

function fitSelection(value, selectionSVGPointX, selectionSVGPointY, selectionWidth, selectionHeight) {
  var viewerWidth = value.viewerWidth,
      viewerHeight = value.viewerHeight;


  var scaleX = viewerWidth / selectionWidth;
  var scaleY = viewerHeight / selectionHeight;

  var scaleLevel = Math.min(scaleX, scaleY);

  var matrix = (0, _transformationMatrix.transform)((0, _transformationMatrix.scale)(scaleLevel, scaleLevel), //2
  (0, _transformationMatrix.translate)(-selectionSVGPointX, -selectionSVGPointY) //1
  );

  return (0, _common.set)(value, _extends({
    mode: _constants.MODE_IDLE
  }, matrix, {
    startX: null,
    startY: null,
    endX: null,
    endY: null
  }));
}

function fitToViewer(value) {
  return fitSelection(value, 0, 0, value.SVGWidth, value.SVGHeight);
}

function zoomOnViewerCenter(value, scaleFactor) {
  var viewerWidth = value.viewerWidth,
      viewerHeight = value.viewerHeight;

  var SVGPoint = (0, _common.getSVGPoint)(value, viewerWidth / 2, viewerHeight / 2);
  return zoom(value, SVGPoint.x, SVGPoint.y, scaleFactor);
}

function startZooming(value, viewerX, viewerY) {
  return (0, _common.set)(value, {
    mode: _constants.MODE_ZOOMING,
    startX: viewerX,
    startY: viewerY,
    endX: viewerX,
    endY: viewerY
  });
}

function updateZooming(value, viewerX, viewerY) {
  if (value.mode !== _constants.MODE_ZOOMING) throw new Error('update selection not allowed in this mode ' + value.mode);

  return (0, _common.set)(value, {
    endX: viewerX,
    endY: viewerY
  });
}

function stopZooming(value, viewerX, viewerY, scaleFactor) {
  var startX = value.startX,
      startY = value.startY,
      endX = value.endX,
      endY = value.endY;


  var start = (0, _common.getSVGPoint)(value, startX, startY);
  var end = (0, _common.getSVGPoint)(value, endX, endY);

  if (Math.abs(startX - endX) > 7 && Math.abs(startY - endY) > 7) {
    var box = (0, _utils.calculateBox)(start, end);
    return fitSelection(value, box.x, box.y, box.width, box.height);
  } else {
    var SVGPoint = (0, _common.getSVGPoint)(value, viewerX, viewerY);
    return zoom(value, SVGPoint.x, SVGPoint.y, scaleFactor);
  }
}
},{"../constants":9,"../utils":37,"./common":14,"transformation-matrix":43}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _viewer = require('./viewer');

Object.defineProperty(exports, 'ReactSVGPanZoom', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_viewer).default;
  }
});

var _toolbar = require('./ui-toolbar/toolbar');

Object.defineProperty(exports, 'Toolbar', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_toolbar).default;
  }
});

var _common = require('./features/common');

Object.defineProperty(exports, 'setPointOnViewerCenter', {
  enumerable: true,
  get: function get() {
    return _common.setPointOnViewerCenter;
  }
});
Object.defineProperty(exports, 'reset', {
  enumerable: true,
  get: function get() {
    return _common.reset;
  }
});

var _pan = require('./features/pan');

Object.defineProperty(exports, 'pan', {
  enumerable: true,
  get: function get() {
    return _pan.pan;
  }
});

var _zoom = require('./features/zoom');

Object.defineProperty(exports, 'zoom', {
  enumerable: true,
  get: function get() {
    return _zoom.zoom;
  }
});
Object.defineProperty(exports, 'fitSelection', {
  enumerable: true,
  get: function get() {
    return _zoom.fitSelection;
  }
});
Object.defineProperty(exports, 'fitToViewer', {
  enumerable: true,
  get: function get() {
    return _zoom.fitToViewer;
  }
});
Object.defineProperty(exports, 'zoomOnViewerCenter', {
  enumerable: true,
  get: function get() {
    return _zoom.zoomOnViewerCenter;
  }
});

var _miniature = require('./features/miniature');

Object.defineProperty(exports, 'openMiniature', {
  enumerable: true,
  get: function get() {
    return _miniature.openMiniature;
  }
});
Object.defineProperty(exports, 'closeMiniature', {
  enumerable: true,
  get: function get() {
    return _miniature.closeMiniature;
  }
});

var _constants = require('./constants');

Object.keys(_constants).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _constants[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Viewer = exports.Viewer = function Viewer() {
  var msg = "HEY! You are trying to use an older version of ReactSVGPanZoom. " + "Read here https://github.com/chrvadala/react-svg-pan-zoom/blob/master/docs/migrate-from-v1-to-v2.md";

  console.error(msg);
  return null;
};
},{"./constants":9,"./features/common":14,"./features/miniature":17,"./features/pan":18,"./features/zoom":19,"./ui-toolbar/toolbar":31,"./viewer":38}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = IconArrow;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//credits https://materialdesignicons.com/icon/chevron-up

function IconArrow(_ref) {
  var open = _ref.open,
      position = _ref.position;


  var transform = 0;

  switch (position) {
    case _constants.POSITION_LEFT:
      transform = open ? "rotate(225, 12, 13)" : "rotate(45, 12, 13)";
      break;

    case _constants.POSITION_RIGHT:
      transform = transform = open ? "rotate(135, 12, 13)" : "rotate(-45, 12, 13)";
  }

  return _react2.default.createElement(
    'svg',
    { width: 24, height: 24, stroke: 'currentColor' },
    _react2.default.createElement(
      'g',
      { transform: transform },
      _react2.default.createElement('path', { fill: '#000000', d: 'M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z' })
    )
  );
}

IconArrow.propTypes = {
  open: _propTypes2.default.bool.isRequired,
  position: _propTypes2.default.oneOf([_constants.POSITION_RIGHT, _constants.POSITION_LEFT]).isRequired
};
},{"../constants":9,"prop-types":7,"react":undefined}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = MiniatureMask;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function MiniatureMask(_ref) {
  var SVGWidth = _ref.SVGWidth,
      SVGHeight = _ref.SVGHeight,
      visibleAreaX = _ref.visibleAreaX,
      visibleAreaY = _ref.visibleAreaY,
      visibleAreaWidth = _ref.visibleAreaWidth,
      visibleAreaHeight = _ref.visibleAreaHeight,
      zoomToFit = _ref.zoomToFit;

  return _react2.default.createElement(
    'g',
    null,
    _react2.default.createElement(
      'defs',
      null,
      _react2.default.createElement(
        'mask',
        { id: 'react-svg-pan-zoom-miniature-mask' },
        _react2.default.createElement('rect', { x: '0', y: '0', width: SVGWidth, height: SVGHeight, fill: '#ffffff' }),
        _react2.default.createElement('rect', { x: visibleAreaX, y: visibleAreaY, width: visibleAreaWidth, height: visibleAreaHeight })
      )
    ),
    _react2.default.createElement('rect', { x: '0',
      y: '0',
      width: SVGWidth,
      height: SVGHeight,
      style: {
        stroke: "none",
        fill: "#000",
        mask: "url(#react-svg-pan-zoom-miniature-mask)",
        opacity: 0.4
      }
    }),
    _react2.default.createElement('rect', {
      stroke: "#47484a",
      strokeWidth: 0.75 / zoomToFit,
      fill: 'transparent',
      x: visibleAreaX,
      y: visibleAreaY,
      width: visibleAreaWidth,
      height: visibleAreaHeight })
  );
}

MiniatureMask.propTypes = {
  SVGWidth: _propTypes2.default.number.isRequired,
  SVGHeight: _propTypes2.default.number.isRequired,
  visibleAreaX: _propTypes2.default.number.isRequired,
  visibleAreaY: _propTypes2.default.number.isRequired,
  visibleAreaWidth: _propTypes2.default.number.isRequired,
  visibleAreaHeight: _propTypes2.default.number.isRequired,
  zoomToFit: _propTypes2.default.number.isRequired
};
},{"prop-types":7,"react":undefined}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = MiniatureToggleButton;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _miniature = require('../features/miniature');

var _iconArrow = require('./icon-arrow');

var _iconArrow2 = _interopRequireDefault(_iconArrow);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function MiniatureToggleButton(_ref) {
  var _style;

  var value = _ref.value,
      onChangeValue = _ref.onChangeValue,
      position = _ref.position;

  var style = (_style = {
    width: "24px",
    height: "24px",
    display: "block",
    position: "absolute",
    bottom: 0
  }, _defineProperty(_style, position === _constants.POSITION_LEFT ? 'left' : 'right', '0px'), _defineProperty(_style, 'background', "rgba(19, 20, 22, 0.901961)"), _defineProperty(_style, 'border', 0), _defineProperty(_style, 'padding', 0), _defineProperty(_style, 'outline', 0), _defineProperty(_style, 'color', "#fff"), _style);

  var action = value.miniatureOpen ? _miniature.closeMiniature : _miniature.openMiniature;

  return _react2.default.createElement(
    'button',
    { role: 'button', style: style, onClick: function onClick(event) {
        return onChangeValue(action(value));
      } },
    _react2.default.createElement(_iconArrow2.default, { open: value.miniatureOpen, position: position })
  );
}

MiniatureToggleButton.propTypes = {
  value: _propTypes2.default.object.isRequired,
  onChangeValue: _propTypes2.default.func.isRequired,
  position: _propTypes2.default.oneOf([_constants.POSITION_RIGHT, _constants.POSITION_LEFT]).isRequired
};
},{"../constants":9,"../features/miniature":17,"./icon-arrow":21,"prop-types":7,"react":undefined}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = Miniature;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _constants = require('../constants');

var _transformationMatrix = require('transformation-matrix');

var _miniatureToggleButton = require('./miniature-toggle-button');

var _miniatureToggleButton2 = _interopRequireDefault(_miniatureToggleButton);

var _miniatureMask = require('./miniature-mask');

var _miniatureMask2 = _interopRequireDefault(_miniatureMask);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var min = Math.min,
    max = Math.max;
function Miniature(_ref) {
  var value = _ref.value,
      onChangeValue = _ref.onChangeValue,
      position = _ref.position,
      children = _ref.children,
      background = _ref.background,
      miniatureWidth = _ref.width;
  var SVGWidth = value.SVGWidth,
      SVGHeight = value.SVGHeight,
      viewerWidth = value.viewerWidth,
      viewerHeight = value.viewerHeight;

  var ratio = SVGWidth / SVGHeight;

  var miniatureHeight = miniatureWidth * ratio;

  var zoomToFit = miniatureWidth / SVGWidth;

  var _applyToPoints = (0, _transformationMatrix.applyToPoints)((0, _transformationMatrix.inverse)(value), [{ x: 0, y: 0 }, { x: viewerWidth, y: viewerHeight }]),
      _applyToPoints2 = _slicedToArray(_applyToPoints, 2),
      _applyToPoints2$ = _applyToPoints2[0],
      x1 = _applyToPoints2$.x,
      y1 = _applyToPoints2$.y,
      _applyToPoints2$2 = _applyToPoints2[1],
      x2 = _applyToPoints2$2.x,
      y2 = _applyToPoints2$2.y;

  x1 = max(x1, 0);
  y1 = max(y1, 0);
  x2 = min(x2, SVGWidth);
  y2 = min(y2, SVGHeight);

  var width = void 0,
      height = void 0,
      bottom = void 0;

  if (value.miniatureOpen) {
    width = miniatureWidth;
    height = miniatureHeight;
  } else {
    width = 24;
    height = 24;
  }

  var style = _defineProperty({
    position: "absolute",
    overflow: "hidden",
    outline: "1px solid rgba(19, 20, 22, 0.90)",
    transition: "width 200ms ease, height 200ms ease, bottom 200ms ease",
    width: width + "px",
    height: height + "px",
    bottom: "6px"
  }, position === _constants.POSITION_LEFT ? 'left' : 'right', "6px");

  return _react2.default.createElement(
    'div',
    { role: 'navigation', style: style },
    _react2.default.createElement(
      'svg',
      {
        width: miniatureWidth,
        height: miniatureHeight,
        style: { pointerEvents: "none" } },
      _react2.default.createElement(
        'g',
        { transform: 'scale(' + zoomToFit + ', ' + zoomToFit + ')' },
        _react2.default.createElement('rect', {
          fill: background,
          x: 0,
          y: 0,
          width: value.SVGWidth,
          height: value.SVGHeight }),
        children,
        x1 === 0 && y1 === 0 && x2 - x1 === SVGWidth && y2 - y1 === SVGHeight ? null : _react2.default.createElement(_miniatureMask2.default, {
          SVGWidth: SVGWidth,
          SVGHeight: SVGHeight,
          visibleAreaX: x1,
          visibleAreaY: y1,
          visibleAreaWidth: x2 - x1,
          visibleAreaHeight: y2 - y1,
          zoomToFit: zoomToFit
        })
      )
    ),
    _react2.default.createElement(_miniatureToggleButton2.default, { value: value, onChangeValue: onChangeValue, position: position })
  );
}

Miniature.propTypes = {
  position: _propTypes2.default.oneOf([_constants.POSITION_RIGHT, _constants.POSITION_LEFT]).isRequired,
  value: _propTypes2.default.object.isRequired,
  onChangeValue: _propTypes2.default.func.isRequired,
  background: _propTypes2.default.string.isRequired,
  width: _propTypes2.default.number.isRequired
};
},{"../constants":9,"./miniature-mask":22,"./miniature-toggle-button":23,"prop-types":7,"react":undefined,"transformation-matrix":43}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = IconCursor;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//credits https://materialdesignicons.com/icon/cursor-default-outline

function IconCursor() {
  return _react2.default.createElement(
    "svg",
    { width: 24, height: 24, stroke: "currentColor" },
    _react2.default.createElement("path", {
      d: "M10.07,14.27C10.57,14.03 11.16,14.25 11.4,14.75L13.7,19.74L15.5,18.89L13.19,13.91C12.95,13.41 13.17,12.81 13.67,12.58L13.95,12.5L16.25,12.05L8,5.12V15.9L9.82,14.43L10.07,14.27M13.64,21.97C13.14,22.21 12.54,22 12.31,21.5L10.13,16.76L7.62,18.78C7.45,18.92 7.24,19 7,19A1,1 0 0,1 6,18V3A1,1 0 0,1 7,2C7.24,2 7.47,2.09 7.64,2.23L7.65,2.22L19.14,11.86C19.57,12.22 19.62,12.85 19.27,13.27C19.12,13.45 18.91,13.57 18.7,13.61L15.54,14.23L17.74,18.96C18,19.46 17.76,20.05 17.26,20.28L13.64,21.97Z" })
  );
}
},{"react":undefined}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = IconFit;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//credits https://materialdesignicons.com/icon/cursor-default-outline

function IconFit() {
  return _react2.default.createElement(
    "svg",
    { width: 24, height: 24, stroke: "currentColor" },
    _react2.default.createElement("path", {
      d: "M15 3l2.3 2.3-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3zM3 9l2.3-2.3 2.87 2.89 1.42-1.42L6.7 5.3 9 3H3zm6 12l-2.3-2.3 2.89-2.87-1.42-1.42L5.3 17.3 3 15v6zm12-6l-2.3 2.3-2.87-2.89-1.42 1.42 2.89 2.87L15 21h6z" })
  );
}
},{"react":undefined}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = IconPan;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//https://materialdesignicons.com/icon/cursor-move

function IconPan() {
  return _react2.default.createElement(
    "svg",
    { width: 24, height: 24, stroke: "currentColor" },
    _react2.default.createElement("path", {
      d: "M13,6V11H18V7.75L22.25,12L18,16.25V13H13V18H16.25L12,22.25L7.75,18H11V13H6V16.25L1.75,12L6,7.75V11H11V6H7.75L12,1.75L16.25,6H13Z" })
  );
}
},{"react":undefined}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = IconZoomIn;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//https://material.io/icons/#ic_zoom_in

function IconZoomIn() {
  return _react2.default.createElement(
    "svg",
    { width: 24, height: 24, stroke: "currentColor" },
    _react2.default.createElement(
      "g",
      null,
      _react2.default.createElement("path", {
        d: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" }),
      _react2.default.createElement("path", { d: "M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z" })
    )
  );
}
},{"react":undefined}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = IconZoomOut;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//https://material.io/icons/#ic_zoom_out

function IconZoomOut() {
  return _react2.default.createElement(
    "svg",
    { width: 24, height: 24, stroke: "currentColor" },
    _react2.default.createElement("path", {
      d: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z" })
  );
}
},{"react":undefined}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ToolbarButton = function (_React$Component) {
  _inherits(ToolbarButton, _React$Component);

  function ToolbarButton(props) {
    _classCallCheck(this, ToolbarButton);

    var _this = _possibleConstructorReturn(this, (ToolbarButton.__proto__ || Object.getPrototypeOf(ToolbarButton)).call(this, props));

    _this.state = { hover: false };
    return _this;
  }

  _createClass(ToolbarButton, [{
    key: 'change',
    value: function change(event) {
      event.preventDefault();
      event.stopPropagation();

      switch (event.type) {
        case 'mouseenter':
        case 'touchstart':
          this.setState({ hover: true });
          break;
        case 'mouseleave':
        case 'touchend':
        case 'touchcancel':
          this.setState({ hover: false });
          break;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var style = {
        display: "block",
        width: "24px",
        height: "24px",
        margin: [_constants.POSITION_TOP, _constants.POSITION_BOTTOM].indexOf(this.props.toolbarPosition) >= 0 ? "2px 1px" : "1px 2px",
        color: this.props.active || this.state.hover ? '#1CA6FC' : '#FFF',
        transition: "color 200ms ease",
        background: "none",
        padding: "0px",
        border: "0px",
        outline: "0px",
        cursor: "pointer"
      };

      return _react2.default.createElement(
        'button',
        {
          onMouseEnter: function onMouseEnter(e) {
            return _this2.change(e);
          },
          onMouseLeave: function onMouseLeave(e) {
            return _this2.change(e);
          },

          onTouchStart: function onTouchStart(e) {
            _this2.change(e);
            _this2.props.onClick(e);
          },
          onTouchEnd: function onTouchEnd(e) {
            return _this2.change(e);
          },
          onTouchCancel: function onTouchCancel(e) {
            return _this2.change(e);
          },

          onClick: this.props.onClick,

          style: style,
          title: this.props.title,
          name: this.props.name,
          role: 'button'

        },
        this.props.children
      );
    }
  }]);

  return ToolbarButton;
}(_react2.default.Component);

exports.default = ToolbarButton;


ToolbarButton.propTypes = {
  title: _propTypes2.default.string.isRequired,
  name: _propTypes2.default.string.isRequired,
  toolbarPosition: _propTypes2.default.string.isRequired,
  onClick: _propTypes2.default.func.isRequired,
  active: _propTypes2.default.bool.isRequired
};
},{"../constants":9,"prop-types":7,"react":undefined}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Toolbar;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _constants = require('../constants');

var _zoom = require('../features/zoom');

var _iconCursor = require('./icon-cursor');

var _iconCursor2 = _interopRequireDefault(_iconCursor);

var _iconPan = require('./icon-pan');

var _iconPan2 = _interopRequireDefault(_iconPan);

var _iconZoomIn = require('./icon-zoom-in');

var _iconZoomIn2 = _interopRequireDefault(_iconZoomIn);

var _iconZoomOut = require('./icon-zoom-out');

var _iconZoomOut2 = _interopRequireDefault(_iconZoomOut);

var _iconFit = require('./icon-fit');

var _iconFit2 = _interopRequireDefault(_iconFit);

var _toolbarButton = require('./toolbar-button');

var _toolbarButton2 = _interopRequireDefault(_toolbarButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Toolbar(_ref) {
  var tool = _ref.tool,
      value = _ref.value,
      onChangeValue = _ref.onChangeValue,
      onChangeTool = _ref.onChangeTool,
      position = _ref.position;


  var handleChangeTool = function handleChangeTool(event, tool) {
    onChangeTool(tool);
    event.stopPropagation();
    event.preventDefault();
  };

  var handleFit = function handleFit(event) {
    onChangeValue((0, _zoom.fitToViewer)(value));
    event.stopPropagation();
    event.preventDefault();
  };

  var isHorizontal = [_constants.POSITION_TOP, _constants.POSITION_BOTTOM].indexOf(position) >= 0;

  var style = {
    //position
    position: "absolute",
    transform: [_constants.POSITION_TOP, _constants.POSITION_BOTTOM].indexOf(position) >= 0 ? "translate(-50%, 0px)" : "none",
    top: [_constants.POSITION_LEFT, _constants.POSITION_RIGHT, _constants.POSITION_TOP].indexOf(position) >= 0 ? "5px" : "unset",
    left: [_constants.POSITION_TOP, _constants.POSITION_BOTTOM].indexOf(position) >= 0 ? "50%" : _constants.POSITION_LEFT === position ? "5px" : "unset",
    right: [_constants.POSITION_RIGHT].indexOf(position) >= 0 ? "5px" : "unset",
    bottom: [_constants.POSITION_BOTTOM].indexOf(position) >= 0 ? "5px" : "unset",

    //inner styling
    backgroundColor: "rgba(19, 20, 22, 0.90)",
    borderRadius: "2px",
    display: "flex",
    flexDirection: isHorizontal ? "row" : "column",
    padding: isHorizontal ? "1px 2px" : "2px 1px"
  };

  return _react2.default.createElement(
    'div',
    { style: style, role: 'toolbar' },
    _react2.default.createElement(
      _toolbarButton2.default,
      {
        toolbarPosition: position,
        active: tool === _constants.TOOL_NONE,
        name: 'unselect-tools',
        title: 'Selection',
        onClick: function onClick(event) {
          return handleChangeTool(event, _constants.TOOL_NONE);
        } },
      _react2.default.createElement(_iconCursor2.default, null)
    ),
    _react2.default.createElement(
      _toolbarButton2.default,
      {
        toolbarPosition: position,
        active: tool === _constants.TOOL_PAN,
        name: 'select-tool-pan',
        title: 'Pan',
        onClick: function onClick(event) {
          return handleChangeTool(event, _constants.TOOL_PAN);
        } },
      _react2.default.createElement(_iconPan2.default, null)
    ),
    _react2.default.createElement(
      _toolbarButton2.default,
      {
        toolbarPosition: position,
        active: tool === _constants.TOOL_ZOOM_IN,
        name: 'select-tool-zoom-in',
        title: 'Zoom in',
        onClick: function onClick(event) {
          return handleChangeTool(event, _constants.TOOL_ZOOM_IN);
        } },
      _react2.default.createElement(_iconZoomIn2.default, null)
    ),
    _react2.default.createElement(
      _toolbarButton2.default,
      {
        toolbarPosition: position,
        active: tool === _constants.TOOL_ZOOM_OUT,
        name: 'select-tool-zoom-out',
        title: 'Zoom out',
        onClick: function onClick(event) {
          return handleChangeTool(event, _constants.TOOL_ZOOM_OUT);
        } },
      _react2.default.createElement(_iconZoomOut2.default, null)
    ),
    _react2.default.createElement(
      _toolbarButton2.default,
      {
        toolbarPosition: position,
        active: false,
        name: 'fit-to-viewer',
        title: 'Fit to viewer',
        onClick: function onClick(event) {
          return handleFit(event);
        } },
      _react2.default.createElement(_iconFit2.default, null)
    )
  );
}

Toolbar.propTypes = {
  position: _propTypes2.default.oneOf([_constants.POSITION_TOP, _constants.POSITION_RIGHT, _constants.POSITION_BOTTOM, _constants.POSITION_LEFT]).isRequired,
  tool: _propTypes2.default.string.isRequired,
  value: _propTypes2.default.object.isRequired,
  onChangeValue: _propTypes2.default.func.isRequired,
  onChangeTool: _propTypes2.default.func.isRequired
};
},{"../constants":9,"../features/zoom":19,"./icon-cursor":25,"./icon-fit":26,"./icon-pan":27,"./icon-zoom-in":28,"./icon-zoom-out":29,"./toolbar-button":30,"prop-types":7,"react":undefined}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = BorderGradient;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BorderGradient(_ref) {
  var direction = _ref.direction,
      width = _ref.width,
      height = _ref.height;


  var transform = void 0;

  switch (direction) {
    case _constants.POSITION_TOP:
      transform = 'translate(' + width + ', 0) rotate(90)';
      break;

    case _constants.POSITION_RIGHT:
      transform = 'translate(' + width + ', ' + height + ') rotate(180)';
      break;

    case _constants.POSITION_BOTTOM:
      transform = 'translate(0, ' + height + ') rotate(270)';
      break;

    case _constants.POSITION_LEFT:
      transform = " ";
      break;
  }

  return _react2.default.createElement(
    'g',
    null,
    _react2.default.createElement(
      'defs',
      null,
      _react2.default.createElement(
        'linearGradient',
        { id: 'react-svg-pan-zoom-gradient1', x1: '0%', y1: '0%', x2: '100%', y2: '0%', spreadMethod: 'pad' },
        _react2.default.createElement('stop', { offset: '0%', stopColor: '#fff', stopOpacity: '0.8' }),
        _react2.default.createElement('stop', { offset: '100%', stopColor: '#000', stopOpacity: '0.5' })
      ),
      _react2.default.createElement(
        'mask',
        { id: 'react-svg-pan-zoom-mask1', x: '0', y: '0', width: '20', height: Math.max(width, height) },
        _react2.default.createElement('rect', { x: '0', y: '0', width: '20', height: Math.max(width, height),
          style: { stroke: "none", fill: "url(#react-svg-pan-zoom-gradient1)" } })
      )
    ),
    _react2.default.createElement('rect', { x: '0', y: '0', width: '20', height: Math.max(width, height),
      style: { stroke: "none", fill: "#000", mask: "url(#react-svg-pan-zoom-mask1)" }, transform: transform })
  );
}

BorderGradient.propTypes = {
  direction: _propTypes2.default.oneOf([_constants.POSITION_TOP, _constants.POSITION_RIGHT, _constants.POSITION_BOTTOM, _constants.POSITION_LEFT]).isRequired,
  width: _propTypes2.default.number.isRequired,
  height: _propTypes2.default.number.isRequired
};
},{"../constants":9,"prop-types":7,"react":undefined}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (cursor) {
  if (!needPrefix(cursor)) return cursor;
  if (isFirefox()) return '-moz-' + cursor;
  if (isWebkit()) return '-webkit-' + cursor;
};

//specs: https://developer.mozilla.org/en-US/docs/Web/CSS/cursor

var needPrefix = function needPrefix(cursor) {
  return ['zoom-in', 'zoom-out', 'grab', 'grabbing'].indexOf(cursor) > -1;
};
var userAgent = function userAgent() {
  return navigator.userAgent.toLowerCase();
};
var isFirefox = function isFirefox() {
  return userAgent().indexOf('firefox') > -1;
};
var isWebkit = function isWebkit() {
  return userAgent().indexOf('webkit') > -1;
};
},{}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isTouchDevice;
//http://stackoverflow.com/a/4819886/1398836

function isTouchDevice() {
  return 'ontouchstart' in window // works on most browsers
  || navigator.maxTouchPoints; // works on IE10/11 and Surface
};
},{}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = If;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @return {null}
 */
function If(_ref) {
  var condition = _ref.condition,
      children = _ref.children;

  return condition ? children : null;
}

If.propTypes = {
  condition: _propTypes2.default.bool.isRequired
};
},{"prop-types":7,"react":undefined}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Selection;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Selection(_ref) {
  var startX = _ref.startX,
      startY = _ref.startY,
      endX = _ref.endX,
      endY = _ref.endY;

  if (!startX || !startY || !endX || !endY) return null;

  var box = (0, _utils.calculateBox)({ x: startX, y: startY }, { x: endX, y: endY });

  return _react2.default.createElement('rect', {
    stroke: '#969FFF',
    strokeOpacity: 0.7,
    fill: '#F3F4FF',
    fillOpacity: 0.7,
    x: box.x,
    y: box.y,
    width: box.width,
    height: box.height,
    style: { pointerEvents: "none" } });
}

Selection.propTypes = {
  startX: _propTypes2.default.number,
  startY: _propTypes2.default.number,
  endX: _propTypes2.default.number,
  endY: _propTypes2.default.number
};
},{"../utils":37,"prop-types":7,"react":undefined}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateBox = calculateBox;
exports.mapRange = mapRange;
function calculateBox(start, end) {
  if (start.x <= end.x && start.y <= end.y) {
    return {
      x: start.x,
      y: start.y,
      width: end.x - start.x,
      height: end.y - start.y
    };
  } else if (start.x >= end.x && start.y <= end.y) {
    return {
      x: end.x,
      y: start.y,
      width: start.x - end.x,
      height: end.y - start.y
    };
  } else if (start.x >= end.x && start.y >= end.y) {
    return {
      x: end.x,
      y: end.y,
      width: start.x - end.x,
      height: start.y - end.y
    };
  } else if (start.x <= end.x && start.y >= end.y) {
    return {
      x: start.x,
      y: end.y,
      width: end.x - start.x,
      height: start.y - end.y
    };
  }
}

function mapRange(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
},{}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _transformationMatrix = require('transformation-matrix');

var _eventFactory = require('./events/event-factory');

var _eventFactory2 = _interopRequireDefault(_eventFactory);

var _pan2 = require('./features/pan');

var _common = require('./features/common');

var _interactions = require('./features/interactions');

var _interactionsTouch = require('./features/interactions-touch');

var _zoom2 = require('./features/zoom');

var _miniature = require('./features/miniature');

var _cursorPolyfill = require('./ui/cursor-polyfill');

var _cursorPolyfill2 = _interopRequireDefault(_cursorPolyfill);

var _borderGradient = require('./ui/border-gradient');

var _borderGradient2 = _interopRequireDefault(_borderGradient);

var _if = require('./ui/if');

var _if2 = _interopRequireDefault(_if);

var _selection = require('./ui/selection');

var _selection2 = _interopRequireDefault(_selection);

var _toolbar = require('./ui-toolbar/toolbar');

var _toolbar2 = _interopRequireDefault(_toolbar);

var _detectTouch = require('./ui/detect-touch');

var _detectTouch2 = _interopRequireDefault(_detectTouch);

var _miniature2 = require('./ui-miniature/miniature');

var _miniature3 = _interopRequireDefault(_miniature2);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//events


//features


//ui


var ReactSVGPanZoom = function (_React$Component) {
  _inherits(ReactSVGPanZoom, _React$Component);

  function ReactSVGPanZoom(props, context) {
    _classCallCheck(this, ReactSVGPanZoom);

    var _this = _possibleConstructorReturn(this, (ReactSVGPanZoom.__proto__ || Object.getPrototypeOf(ReactSVGPanZoom)).call(this, props, context));

    var _this$props = _this.props,
        tool = _this$props.tool,
        value = _this$props.value,
        viewerWidth = _this$props.width,
        viewerHeight = _this$props.height,
        children = _this$props.children;
    var _children$props = children.props,
        SVGWidth = _children$props.width,
        SVGHeight = _children$props.height;


    _this.state = {
      value: value ? value : (0, _common.getDefaultValue)(viewerWidth, viewerHeight, SVGWidth, SVGHeight),
      tool: tool ? tool : _constants.TOOL_NONE
    };
    _this.ViewerDOM = null;
    return _this;
  }

  _createClass(ReactSVGPanZoom, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var value = this.getValue();

      if (value.viewerWidth !== nextProps.width || value.viewerHeight !== nextProps.height) {
        var nextValue = (0, _common.setViewerSize)(value, nextProps.width, nextProps.height);
        this.setValue(nextValue);
      }

      var _nextProps$children$p = nextProps.children.props,
          SVGWidth = _nextProps$children$p.width,
          SVGHeight = _nextProps$children$p.height;

      if (value.SVGWidth !== SVGWidth || value.SVGHeight !== SVGHeight) {
        var _nextValue = (0, _common.setSVGSize)(value, SVGWidth, SVGHeight);
        this.setValue(_nextValue);
      }
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.props.value ? this.props.value : this.state.value;
    }
  }, {
    key: 'getTool',
    value: function getTool() {
      return this.props.tool ? this.props.tool : this.state.tool;
    }
  }, {
    key: 'setValue',
    value: function setValue(nextValue) {
      this.setState({ value: nextValue });
      if (this.props.onChangeValue) this.props.onChangeValue(nextValue);
    }
  }, {
    key: 'pan',
    value: function pan(SVGDeltaX, SVGDeltaY) {
      var nextValue = (0, _pan2.pan)(this.getValue(), SVGDeltaX, SVGDeltaY);
      this.setValue(nextValue);
    }
  }, {
    key: 'zoom',
    value: function zoom(SVGPointX, SVGPointY, scaleFactor) {
      var nextValue = (0, _zoom2.zoom)(this.getValue(), SVGPointX, SVGPointY, scaleFactor);
      this.setValue(nextValue);
    }
  }, {
    key: 'fitSelection',
    value: function fitSelection(selectionSVGPointX, selectionSVGPointY, selectionWidth, selectionHeight) {
      var nextValue = (0, _zoom2.fitSelection)(this.getValue(), selectionSVGPointX, selectionSVGPointY, selectionWidth, selectionHeight);
      this.setValue(nextValue);
    }
  }, {
    key: 'fitToViewer',
    value: function fitToViewer() {
      var nextValue = (0, _zoom2.fitToViewer)(this.getValue());
      this.setValue(nextValue);
    }
  }, {
    key: 'zoomOnViewerCenter',
    value: function zoomOnViewerCenter(scaleFactor) {
      var nextValue = (0, _zoom2.zoomOnViewerCenter)(this.getValue(), scaleFactor);
      this.setValue(nextValue);
    }
  }, {
    key: 'setPointOnViewerCenter',
    value: function setPointOnViewerCenter(SVGPointX, SVGPointY, zoomLevel) {
      var nextValue = (0, _common.setPointOnViewerCenter)(this.getValue(), SVGPointX, SVGPointY, zoomLevel);
      this.setValue(nextValue);
    }
  }, {
    key: 'reset',
    value: function reset() {
      var nextValue = (0, _common.reset)(this.getValue());
      this.setValue(nextValue);
    }
  }, {
    key: 'changeTool',
    value: function changeTool(tool) {
      this.setState({ tool: tool });
      if (this.props.onChangeTool) this.props.onChangeTool(tool);
    }
  }, {
    key: 'openMiniature',
    value: function openMiniature() {
      var nextValue = (0, _miniature.openMiniature)(this.getValue());
      this.setValue(nextValue);
    }
  }, {
    key: 'closeMiniature',
    value: function closeMiniature() {
      var nextValue = (0, _miniature.closeMiniature)(this.getValue());
      this.setValue(nextValue);
    }
  }, {
    key: 'handleViewerEvent',
    value: function handleViewerEvent(event) {
      var props = this.props,
          value = this.state.value,
          ViewerDOM = this.ViewerDOM;


      if (!([_constants.TOOL_NONE, _constants.TOOL_AUTO].indexOf(this.getTool()) >= 0)) return;
      if (event.target === ViewerDOM) return;

      var eventsHandler = {
        click: props.onClick,
        dblclick: props.onDoubleClick,

        mousemove: props.onMouseMove,
        mouseup: props.onMouseUp,
        mousedown: props.onMouseDown,

        touchstart: props.onTouchStart,
        touchmove: props.onTouchMove,
        touchend: props.onTouchEnd,
        touchcancel: props.onTouchCancel
      };

      var onEventHandler = eventsHandler[event.type];
      if (!onEventHandler) return;

      onEventHandler((0, _eventFactory2.default)(event, value, ViewerDOM));
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var props = this.props,
          state = this.state;

      if (props.onChangeValue) props.onChangeValue(state.value);

      this.autoPanTimer = setInterval(function () {
        var coords = { x: _this2.state.viewerX, y: _this2.state.viewerY };
        var nextValue = (0, _interactions.onInterval)(null, _this2.ViewerDOM, _this2.getTool(), _this2.getValue(), _this2.props, coords);

        if (_this2.getValue() !== nextValue) {
          _this2.setValue(nextValue);
        }
      }, 200);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearTimeout(this.autoPanTimer);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var props = this.props,
          _state = this.state,
          viewerX = _state.viewerX,
          viewerY = _state.viewerY;

      var tool = this.getTool();
      var value = this.getValue();
      var CustomToolbar = props.customToolbar,
          CustomMiniature = props.customMiniature;


      var panningWithToolAuto = tool === _constants.TOOL_AUTO && value.mode === _constants.MODE_PANNING && value.startX !== value.endX && value.startY !== value.endY;

      var cursor = void 0;

      if (tool === _constants.TOOL_PAN) cursor = (0, _cursorPolyfill2.default)(value.mode === _constants.MODE_PANNING ? 'grabbing' : 'grab');

      if (tool === _constants.TOOL_ZOOM_IN) cursor = (0, _cursorPolyfill2.default)('zoom-in');

      if (tool === _constants.TOOL_ZOOM_OUT) cursor = (0, _cursorPolyfill2.default)('zoom-out');

      if (panningWithToolAuto) cursor = (0, _cursorPolyfill2.default)('grabbing');

      var blockChildEvents = [_constants.TOOL_PAN, _constants.TOOL_ZOOM_IN, _constants.TOOL_ZOOM_OUT].indexOf(tool) >= 0;
      blockChildEvents = blockChildEvents || panningWithToolAuto;

      return _react2.default.createElement(
        'div',
        {
          style: _extends({ position: "relative", width: value.viewerWidth, height: value.viewerHeight }, props.style),
          className: this.props.className },
        _react2.default.createElement(
          'svg',
          {
            ref: function ref(ViewerDOM) {
              return _this3.ViewerDOM = ViewerDOM;
            },
            width: value.viewerWidth,
            height: value.viewerHeight,
            style: cursor ? { cursor: cursor, display: "block" } : { display: 'block' },

            onMouseDown: function onMouseDown(event) {
              var nextValue = (0, _interactions.onMouseDown)(event, _this3.ViewerDOM, _this3.getTool(), _this3.getValue(), _this3.props);
              if (_this3.getValue() !== nextValue) _this3.setValue(nextValue);
              _this3.handleViewerEvent(event);
            },
            onMouseMove: function onMouseMove(event) {
              var _ViewerDOM$getBoundin = _this3.ViewerDOM.getBoundingClientRect(),
                  left = _ViewerDOM$getBoundin.left,
                  top = _ViewerDOM$getBoundin.top;

              var x = event.clientX - Math.round(left);
              var y = event.clientY - Math.round(top);

              var nextValue = (0, _interactions.onMouseMove)(event, _this3.ViewerDOM, _this3.getTool(), _this3.getValue(), _this3.props, { x: x, y: y });
              if (_this3.getValue() !== nextValue) _this3.setValue(nextValue);
              _this3.setState({ viewerX: x, viewerY: y });
              _this3.handleViewerEvent(event);
            },
            onMouseUp: function onMouseUp(event) {
              var nextValue = (0, _interactions.onMouseUp)(event, _this3.ViewerDOM, _this3.getTool(), _this3.getValue(), _this3.props);
              if (_this3.getValue() !== nextValue) _this3.setValue(nextValue);
              _this3.handleViewerEvent(event);
            },

            onClick: function onClick(event) {
              _this3.handleViewerEvent(event);
            },
            onDoubleClick: function onDoubleClick(event) {
              var nextValue = (0, _interactions.onDoubleClick)(event, _this3.ViewerDOM, _this3.getTool(), _this3.getValue(), _this3.props);
              if (_this3.getValue() !== nextValue) _this3.setValue(nextValue);
              _this3.handleViewerEvent(event);
            },

            onWheel: function onWheel(event) {
              var nextValue = (0, _interactions.onWheel)(event, _this3.ViewerDOM, _this3.getTool(), _this3.getValue(), _this3.props);
              if (_this3.getValue() !== nextValue) _this3.setValue(nextValue);
            },

            onMouseEnter: function onMouseEnter(event) {
              if ((0, _detectTouch2.default)()) return;
              var nextValue = (0, _interactions.onMouseEnterOrLeave)(event, _this3.ViewerDOM, _this3.getTool(), _this3.getValue(), _this3.props);
              if (_this3.getValue() !== nextValue) _this3.setValue(nextValue);
            },
            onMouseLeave: function onMouseLeave(event) {
              var nextValue = (0, _interactions.onMouseEnterOrLeave)(event, _this3.ViewerDOM, _this3.getTool(), _this3.getValue(), _this3.props);
              if (_this3.getValue() !== nextValue) _this3.setValue(nextValue);
            },

            onTouchStart: function onTouchStart(event) {
              var nextValue = (0, _interactionsTouch.onTouchStart)(event, _this3.ViewerDOM, _this3.getTool(), _this3.getValue(), _this3.props);
              if (_this3.getValue() !== nextValue) _this3.setValue(nextValue);
              _this3.handleViewerEvent(event);
            },
            onTouchMove: function onTouchMove(event) {
              var nextValue = (0, _interactionsTouch.onTouchMove)(event, _this3.ViewerDOM, _this3.getTool(), _this3.getValue(), _this3.props);
              if (_this3.getValue() !== nextValue) _this3.setValue(nextValue);
              _this3.handleViewerEvent(event);
            },
            onTouchEnd: function onTouchEnd(event) {
              var nextValue = (0, _interactionsTouch.onTouchEnd)(event, _this3.ViewerDOM, _this3.getTool(), _this3.getValue(), _this3.props);
              if (_this3.getValue() !== nextValue) _this3.setValue(nextValue);
              _this3.handleViewerEvent(event);
            },
            onTouchCancel: function onTouchCancel(event) {
              var nextValue = (0, _interactionsTouch.onTouchCancel)(event, _this3.ViewerDOM, _this3.getTool(), _this3.getValue(), _this3.props);
              if (_this3.getValue() !== nextValue) _this3.setValue(nextValue);
              _this3.handleViewerEvent(event);
            } },
          _react2.default.createElement('rect', {
            fill: props.background,
            x: 0,
            y: 0,
            width: value.viewerWidth,
            height: value.viewerHeight,
            style: { pointerEvents: "none" }
          }),
          _react2.default.createElement(
            'g',
            {
              transform: (0, _transformationMatrix.toSVG)(value),
              style: blockChildEvents ? { pointerEvents: "none" } : {} },
            _react2.default.createElement('rect', {
              fill: this.props.SVGBackground,
              x: 0,
              y: 0,
              width: value.SVGWidth,
              height: value.SVGHeight }),
            _react2.default.createElement(
              'g',
              null,
              props.children.props.children
            )
          ),
          _react2.default.createElement(
            _if2.default,
            { condition: tool === _constants.TOOL_NONE && props.detectAutoPan && value.focus },
            _react2.default.createElement(
              'g',
              { style: { pointerEvents: "none" } },
              _react2.default.createElement(
                _if2.default,
                { condition: viewerY <= 20 },
                _react2.default.createElement(_borderGradient2.default, { direction: _constants.POSITION_TOP, width: value.viewerWidth, height: value.viewerHeight })
              ),
              _react2.default.createElement(
                _if2.default,
                { condition: value.viewerWidth - viewerX <= 20 },
                _react2.default.createElement(_borderGradient2.default, { direction: _constants.POSITION_RIGHT, width: value.viewerWidth, height: value.viewerHeight })
              ),
              _react2.default.createElement(
                _if2.default,
                { condition: value.viewerHeight - viewerY <= 20 },
                _react2.default.createElement(_borderGradient2.default, { direction: _constants.POSITION_BOTTOM, width: value.viewerWidth, height: value.viewerHeight })
              ),
              _react2.default.createElement(
                _if2.default,
                { condition: value.focus && viewerX <= 20 },
                _react2.default.createElement(_borderGradient2.default, { direction: _constants.POSITION_LEFT, width: value.viewerWidth, height: value.viewerHeight })
              )
            )
          ),
          _react2.default.createElement(
            _if2.default,
            { condition: value.mode === _constants.MODE_ZOOMING },
            _react2.default.createElement(_selection2.default, { startX: value.startX, startY: value.startY, endX: value.endX, endY: value.endY })
          )
        ),
        props.toolbarPosition === _constants.POSITION_NONE ? null : _react2.default.createElement(CustomToolbar, {
          position: props.toolbarPosition,
          value: value,
          onChangeValue: function onChangeValue(value) {
            return _this3.setValue(value);
          },
          tool: tool,
          onChangeTool: function onChangeTool(tool) {
            return _this3.changeTool(tool);
          } }),
        props.miniaturePosition === _constants.POSITION_NONE ? null : _react2.default.createElement(
          CustomMiniature,
          {
            position: props.miniaturePosition,
            value: value,
            onChangeValue: function onChangeValue(value) {
              return _this3.setValue(value);
            },
            background: this.props.SVGBackground,
            width: this.props.miniatureWidth
          },
          props.children.props.children
        )
      );
    }
  }]);

  return ReactSVGPanZoom;
}(_react2.default.Component);

exports.default = ReactSVGPanZoom;


ReactSVGPanZoom.propTypes = {
  //width of the viewer displayed on screen
  width: _propTypes2.default.number.isRequired,

  //height of the viewer displayed on screen
  height: _propTypes2.default.number.isRequired,

  //background of the viewer
  background: _propTypes2.default.string,

  //background of the svg
  SVGBackground: _propTypes2.default.string,

  //value of the viewer (current point of view)
  value: _propTypes2.default.shape({
    version: _propTypes2.default.oneOf([2]).isRequired,
    mode: _propTypes2.default.oneOf([_constants.MODE_IDLE, _constants.MODE_PANNING, _constants.MODE_ZOOMING]).isRequired,
    focus: _propTypes2.default.bool.isRequired,
    a: _propTypes2.default.number.isRequired,
    b: _propTypes2.default.number.isRequired,
    c: _propTypes2.default.number.isRequired,
    d: _propTypes2.default.number.isRequired,
    e: _propTypes2.default.number.isRequired,
    f: _propTypes2.default.number.isRequired,
    viewerWidth: _propTypes2.default.number.isRequired,
    viewerHeight: _propTypes2.default.number.isRequired,
    SVGWidth: _propTypes2.default.number.isRequired,
    SVGHeight: _propTypes2.default.number.isRequired,
    startX: _propTypes2.default.number,
    startY: _propTypes2.default.number,
    endX: _propTypes2.default.number,
    endY: _propTypes2.default.number,
    miniatureOpen: _propTypes2.default.bool.isRequired
  }),

  //CSS style of the Viewer
  style: _propTypes2.default.object,

  //className of the Viewer
  className: _propTypes2.default.string,

  //detect zoom operation performed trough pinch gesture or mouse scroll
  detectWheel: _propTypes2.default.bool,

  //perform PAN if the mouse is on viewer border
  detectAutoPan: _propTypes2.default.bool,

  //toolbar position
  toolbarPosition: _propTypes2.default.oneOf([_constants.POSITION_NONE, _constants.POSITION_TOP, _constants.POSITION_RIGHT, _constants.POSITION_BOTTOM, _constants.POSITION_LEFT]),

  //handler something changed
  onChangeValue: _propTypes2.default.func,

  //handler tool changed
  onChangeTool: _propTypes2.default.func,

  //handler click
  onClick: _propTypes2.default.func,

  //handler double click
  onDoubleClick: _propTypes2.default.func,

  //handler mouseup
  onMouseUp: _propTypes2.default.func,

  //handler mousemove
  onMouseMove: _propTypes2.default.func,

  //handler mousedown
  onMouseDown: _propTypes2.default.func,

  //if disabled the user can move the image outside the viewer
  preventPanOutside: _propTypes2.default.bool,

  //how much scale in or out
  scaleFactor: _propTypes2.default.number,

  //current active tool (TOOL_NONE, TOOL_PAN, TOOL_ZOOM_IN, TOOL_ZOOM_OUT)
  tool: _propTypes2.default.oneOf([_constants.TOOL_AUTO, _constants.TOOL_NONE, _constants.TOOL_PAN, _constants.TOOL_ZOOM_IN, _constants.TOOL_ZOOM_OUT]),

  //modifier keys //https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState
  modifierKeys: _propTypes2.default.array,

  //override toolbar component
  customToolbar: _propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.func]),

  //miniature position
  miniaturePosition: _propTypes2.default.oneOf([_constants.POSITION_NONE, _constants.POSITION_RIGHT, _constants.POSITION_LEFT]),

  //miniature width
  miniatureWidth: _propTypes2.default.number,

  //override miniature component
  customMiniature: _propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.func]),

  //accept only one node SVG
  children: function children(props, propName, componentName) {
    // Only accept a single child, of the appropriate type
    //credits: http://www.mattzabriskie.com/blog/react-validating-children
    var prop = props[propName];
    var types = ['svg'];
    if (_react2.default.Children.count(prop) !== 1 || types.indexOf(prop.type) === -1) {
      return new Error('`' + componentName + '` ' + 'should have a single child of the following types: ' + ' `' + types.join('`, `') + '`.');
    }
    if (!prop.props.hasOwnProperty('width') || !prop.props.hasOwnProperty('height')) {
      return new Error('SVG should have props `width` and `height`');
    }
  }
};

ReactSVGPanZoom.defaultProps = {
  value: null,
  tool: null,
  style: {},
  background: "#616264",
  SVGBackground: "#fff",
  detectWheel: true,
  detectAutoPan: true,
  toolbarPosition: _constants.POSITION_RIGHT,
  modifierKeys: ["Alt", "Shift", "Control"],
  customToolbar: _toolbar2.default,
  preventPanOutside: true,
  scaleFactor: 1.1,
  miniaturePosition: _constants.POSITION_LEFT,
  miniatureWidth: 100,
  customMiniature: _miniature3.default
};
},{"./constants":9,"./events/event-factory":10,"./features/common":14,"./features/interactions":16,"./features/interactions-touch":15,"./features/miniature":17,"./features/pan":18,"./features/zoom":19,"./ui-miniature/miniature":24,"./ui-toolbar/toolbar":31,"./ui/border-gradient":32,"./ui/cursor-polyfill":33,"./ui/detect-touch":34,"./ui/if":35,"./ui/selection":36,"prop-types":7,"react":undefined,"transformation-matrix":43}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyToPoint = applyToPoint;
exports.applyToPoints = applyToPoints;
/**
 * Calculate a point transformed with an affine matrix
 * @param matrix Affine matrix
 * @param point Point
 * @returns {{x: number, y: number}} Point
 */
function applyToPoint(matrix, point) {
  return {
    x: matrix.a * point.x + matrix.c * point.y + matrix.e,
    y: matrix.b * point.x + matrix.d * point.y + matrix.f
  };
}

/**
 * Calculate an array of points transformed with an affine matrix
 * @param matrix Affine matrix
 * @param points Array of points
 * @returns {array} Array of points
 */
function applyToPoints(matrix, points) {
  return points.map(function (point) {
    return applyToPoint(matrix, point);
  });
}
},{}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromObject = fromObject;
/**
 * Extract an affine matrix from an object that contains a,b,c,d,e,f keys
 * Each value could be a float or a string that contains a float
 * @param object
 * @return {{a: *, b: *, c: *, e: *, d: *, f: *}}}
 */
function fromObject(object) {
  return {
    a: parseFloat(object.a),
    b: parseFloat(object.b),
    c: parseFloat(object.c),
    d: parseFloat(object.d),
    e: parseFloat(object.e),
    f: parseFloat(object.f)
  };
}
},{}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromString = fromString;
/**
 * @ignore
 * @type {RegExp}
 */
var matrixRegex = /^matrix\( *([0-9]*\.?[0-9]+) *, *([0-9]*\.?[0-9]+) *, *([0-9]*\.?[0-9]+) *, *([0-9]*\.?[0-9]+) *, *([0-9]*\.?[0-9]+) *, *([0-9]*\.?[0-9]+) *\)$/i;

/**
 * Parse a string matrix formatted as matrix(a,b,c,d,e,f)
 * @param string String with a matrix
 * @returns {{a: number, b: number, c: number, e: number, d: number, f: number}} Affine matrix
 */
function fromString(string) {
  var parsed = string.match(matrixRegex);
  if (parsed === null || parsed.length < 7) throw new Error("'" + string + "' is not a matrix");
  return {
    a: parseFloat(parsed[1]),
    b: parseFloat(parsed[2]),
    c: parseFloat(parsed[3]),
    d: parseFloat(parsed[4]),
    e: parseFloat(parsed[5]),
    f: parseFloat(parsed[6])
  };
}
},{}],42:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.identity = identity;
/**
 * Identity matrix
 * @returns {{a: number, b: number, c: number, e: number, d: number, f: number}} Affine matrix
 */
function identity() {
  return {
    a: 1, c: 0, e: 0,
    b: 0, d: 1, f: 0
  };
}
},{}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _applyToPoint = require('./applyToPoint');

Object.keys(_applyToPoint).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _applyToPoint[key];
    }
  });
});

var _fromObject = require('./fromObject');

Object.keys(_fromObject).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _fromObject[key];
    }
  });
});

var _fromString = require('./fromString');

Object.keys(_fromString).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _fromString[key];
    }
  });
});

var _identity = require('./identity');

Object.keys(_identity).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _identity[key];
    }
  });
});

var _inverse = require('./inverse');

Object.keys(_inverse).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _inverse[key];
    }
  });
});

var _isAffineMatrix = require('./isAffineMatrix');

Object.keys(_isAffineMatrix).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _isAffineMatrix[key];
    }
  });
});

var _rotate = require('./rotate');

Object.keys(_rotate).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _rotate[key];
    }
  });
});

var _scale = require('./scale');

Object.keys(_scale).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _scale[key];
    }
  });
});

var _shear = require('./shear');

Object.keys(_shear).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _shear[key];
    }
  });
});

var _toString = require('./toString');

Object.keys(_toString).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _toString[key];
    }
  });
});

var _transform = require('./transform');

Object.keys(_transform).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _transform[key];
    }
  });
});

var _translate = require('./translate');

Object.keys(_translate).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _translate[key];
    }
  });
});
},{"./applyToPoint":39,"./fromObject":40,"./fromString":41,"./identity":42,"./inverse":44,"./isAffineMatrix":45,"./rotate":46,"./scale":47,"./shear":48,"./toString":49,"./transform":50,"./translate":51}],44:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inverse = inverse;
/**
 * Calculate a matrix that is the inverse of the provided matrix
 * @param matrix Affine matrix
 * @returns {{a: number, b: number, c: number, e: number, d: number, f: number}} Affine matrix
 */
function inverse(matrix) {
  //http://www.wolframalpha.com/input/?i=Inverse+%5B%7B%7Ba,c,e%7D,%7Bb,d,f%7D,%7B0,0,1%7D%7D%5D

  var a = matrix.a,
      b = matrix.b,
      c = matrix.c,
      d = matrix.d,
      e = matrix.e,
      f = matrix.f;


  var denom = a * d - b * c;

  return {
    a: d / denom,
    b: b / -denom,
    c: c / -denom,
    d: a / denom,
    e: (d * e - c * f) / -denom,
    f: (b * e - a * f) / denom
  };
}
},{}],45:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.isAffineMatrix = isAffineMatrix;
/**
 * Check if the object contain an affine matrix
 * @param object
 * @return {boolean}
 */
function isAffineMatrix(object) {
  var isNumeric = function isNumeric(n) {
    return typeof n === 'number' && !isNaN(n) && isFinite(n);
  };
  return (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object.hasOwnProperty('a') && isNumeric(object.a) && object.hasOwnProperty('b') && isNumeric(object.b) && object.hasOwnProperty('c') && isNumeric(object.c) && object.hasOwnProperty('d') && isNumeric(object.d) && object.hasOwnProperty('e') && isNumeric(object.e) && object.hasOwnProperty('f') && isNumeric(object.f);
}
},{}],46:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rotate = rotate;
exports.rotateDEG = rotateDEG;
var cos = Math.cos,
    sin = Math.sin,
    PI = Math.PI;
/**
 * Calculate a rotation matrix
 * @param angle Angle in radians
 * @returns {{a: number, b: number, c: number, e: number, d: number, f: number}} Affine matrix *
 */

function rotate(angle) {
  var cosAngle = cos(angle);
  var sinAngle = sin(angle);
  return {
    a: cosAngle, c: -sinAngle, e: 0,
    b: sinAngle, d: cosAngle, f: 0
  };
}

/**
 * Calculate a rotation matrix with a DEG angle
 * @param angle Angle in degree
 * @returns {{a: number, b: number, c: number, e: number, d: number, f: number}} Affine matrix
 */
function rotateDEG(angle) {
  return rotate(angle * PI / 180);
}
},{}],47:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scale = scale;
/**
 * Calculate a scaling matrix
 * @param sx Scaling on axis x
 * @param sy Scaling on axis y
 * @returns {{a: number, b: number, c: number, e: number, d: number, f: number}} Affine matrix
 */
function scale(sx, sy) {
  return {
    a: sx, c: 0, e: 0,
    b: 0, d: sy, f: 0
  };
}
},{}],48:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shear = shear;
/**
 * Calculate a shear matrix
 * @param shx Shear on axis x
 * @param shy Shear on axis y
 * @returns {{a: number, b: number, c: number, e: number, d: number, f: number}} Affine matrix
 */
function shear(shx, shy) {
  return {
    a: 1, c: shx, e: 0,
    b: shy, d: 1, f: 0
  };
}
},{}],49:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toCSS = toCSS;
exports.toSVG = toSVG;
exports.toString = toString;
/**
 * Serialize the matrix to a string that can be used with CSS or SVG
 * @param matrix Affine matrix
 * @returns {string} String that contains a matrix formatted as matrix(a,b,c,d,e,f)
 */
function toCSS(matrix) {
  return toString(matrix);
}

/**
 * Serialize the matrix to a string that can be used with CSS or SVG
 * @param matrix Affine matrix
 * @returns {string} String that contains a matrix formatted as matrix(a,b,c,d,e,f)
 */
function toSVG(matrix) {
  return toString(matrix);
}

/**
 * Serialize the matrix to a string that can be used with CSS or SVG
 * @param matrix Affine matrix
 * @returns {string} String that contains a matrix formatted as matrix(a,b,c,d,e,f)
 */
function toString(matrix) {
  return "matrix(" + matrix.a + "," + matrix.b + "," + matrix.c + "," + matrix.d + "," + matrix.e + "," + matrix.f + ")";
}
},{}],50:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transform = transform;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

/**
 * Merge multiple matrices into one
 * @param matrices {...object} list of matrices
 * @returns {{a: number, b: number, c: number, e: number, d: number, f: number}} Affine matrix
 */
function transform() {
  for (var _len = arguments.length, matrices = Array(_len), _key = 0; _key < _len; _key++) {
    matrices[_key] = arguments[_key];
  }

  matrices = Array.isArray(matrices[0]) ? matrices[0] : matrices;

  var multiply = function multiply(m1, m2) {
    return {
      a: m1.a * m2.a + m1.c * m2.b, c: m1.a * m2.c + m1.c * m2.d, e: m1.a * m2.e + m1.c * m2.f + m1.e,
      b: m1.b * m2.a + m1.d * m2.b, d: m1.b * m2.c + m1.d * m2.d, f: m1.b * m2.e + m1.d * m2.f + m1.f
    };
  };

  switch (matrices.length) {
    case 0:
      throw new Error('no matrices provided');

    case 1:
      return matrices[0];

    case 2:
      return multiply(matrices[0], matrices[1]);

    default:
      var _matrices = matrices,
          _matrices2 = _toArray(_matrices),
          m1 = _matrices2[0],
          m2 = _matrices2[1],
          rest = _matrices2.slice(2);

      var m = multiply(m1, m2);
      return transform.apply(undefined, [m].concat(_toConsumableArray(rest)));
  }
}
},{}],51:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.translate = translate;
/**
 * Calculate a translate matrix
 * @param tx Translation on axis x
 * @param ty Translation on axis y
 * @returns {{a: number, b: number, c: number, e: number, d: number, f: number}} Affine matrix
 */
function translate(tx, ty) {
  return {
    a: 1, c: 0, e: tx,
    b: 0, d: 1, f: ty
  };
}
},{}],"arpggio-map-component":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSvgPanZoom = require('react-svg-pan-zoom');

var App = (function (_Component) {
  _inherits(App, _Component);

  function App(props, context) {
    _classCallCheck(this, App);

    _get(Object.getPrototypeOf(App.prototype), 'constructor', this).call(this, props, context);
    this.state = {
      value: null,
      tool: _reactSvgPanZoom.TOOL_NONE
    };
  }

  _createClass(App, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.Viewer.fitToViewer();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      return _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(
          'button',
          {
            onClick: function () {
              return (/* event */_this.setState({ value: (0, _reactSvgPanZoom.zoomOnViewerCenter)(_this.state.value, 1.1) })
              );
            }
          },
          'Zoom in'
        ),
        _react2['default'].createElement(
          'button',
          {
            onClick: function () {
              return (/* event */_this.setState({ value: (0, _reactSvgPanZoom.fitSelection)(_this.state.value, 40, 40, 200, 200) })
              );
            }
          },
          'Zoom area 200x200'
        ),
        _react2['default'].createElement(
          'button',
          {
            onClick: function () {
              return (/* event */_this.setState({ value: (0, _reactSvgPanZoom.fitToViewer)(_this.state.value) })
              );
            }
          },
          'Fit'
        ),
        _react2['default'].createElement('hr', null),
        _react2['default'].createElement(
          _reactSvgPanZoom.ReactSVGPanZoom,
          {
            width: 400,
            height: 400,
            style: { border: '1px solid black' },
            ref: function (Viewer) {
              return _this.Viewer = Viewer;
            },

            onClick: function (event) {
              return console.log('click', event.x, event.y, event.originalEvent);
            },
            onMouseUp: function (event) {
              return console.log('up', event.x, event.y);
            },
            onMouseMove: function (event) {
              return console.log('move', event.x, event.y);
            },
            onMouseDown: function (event) {
              return console.log('down', event.x, event.y);
            },

            value: this.state.value,
            onChangeValue: function (value) {
              return _this.setState({ value: value });
            },
            tool: this.state.tool,
            onChangeTool: function (tool) {
              return _this.setState({ tool: tool });
            }
          },
          _react2['default'].createElement(
            'svg',
            { width: 800, height: 800 },
            _react2['default'].createElement('rect', { x: '400', y: '40', width: '100', height: '200', fill: '#4286f4', stroke: '#f4f142' }),
            _react2['default'].createElement('circle', { cx: '108', cy: '108.5', r: '100', fill: '#0ff', stroke: '#0ff' }),
            _react2['default'].createElement('circle', { cx: '180', cy: '209.5', r: '100', fill: '#ff0', stroke: '#ff0' }),
            _react2['default'].createElement('circle', { cx: '220', cy: '109.5', r: '100', fill: '#f0f', stroke: '#f0f' })
          )
        )
      );
    }
  }]);

  return App;
})(_react.Component);

exports['default'] = App;
module.exports = exports['default'];

},{"react":undefined,"react-svg-pan-zoom":20}]},{},[]);
