// Generated by CoffeeScript 1.4.0
(function() {
  var format, lookup, resolve,
    __slice = [].slice;

  format = String.prototype.format = function() {
    var args, explicit, idx, implicit, message,
      _this = this;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (args.length === 0) {
      return function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return _this.format.apply(_this, args);
      };
    }
    idx = 0;
    explicit = implicit = false;
    message = 'cannot switch from {} to {} numbering'.format();
    return this.replace(/([{}])\1|[{](.*?)(?:!(.+?))?[}]/g, function(match, literal, key, transformer) {
      var fn, value, _ref, _ref1, _ref2;
      if (literal) {
        return literal;
      }
      if (key.length) {
        explicit = true;
        if (implicit) {
          throw new Error(message('implicit', 'explicit'));
        }
        value = (_ref = lookup(args, key)) != null ? _ref : '';
      } else {
        implicit = true;
        if (explicit) {
          throw new Error(message('explicit', 'implicit'));
        }
        value = (_ref1 = args[idx++]) != null ? _ref1 : '';
      }
      value = value.toString();
      if (fn = format.transformers[transformer]) {
        return (_ref2 = fn.call(value)) != null ? _ref2 : '';
      } else {
        return value;
      }
    });
  };

  lookup = function(object, key) {
    var match;
    if (!/^(\d+)([.]|$)/.test(key)) {
      key = '0.' + key;
    }
    while (match = /(.+?)[.](.+)/.exec(key)) {
      object = resolve(object, match[1]);
      key = match[2];
    }
    return resolve(object, key);
  };

  resolve = function(object, key) {
    var value;
    value = object[key];
    if (typeof value === 'function') {
      return value.call(object);
    } else {
      return value;
    }
  };

  format.transformers = {};

  format.version = '0.2.1';

}).call(this);
