(function() {
  var jakeQuery;

  window.stage = new createjs.Stage("canvas");

  stage.top = 5;

  createjs.Ticker.addEventListener("tick", stage);

  stage.enableMouseOver();

  window.$ = function(elem) {
    if (elem == null) {
      elem = stage;
    }
    return new jakeQuery(elem);
  };

  $.extend = function(obj, mixin) {
    var method, name;
    for (name in mixin) {
      method = mixin[name];
      obj[name] = method;
    }
    return obj;
  };

  jakeQuery = (function() {
    function jakeQuery(elem) {
      var i, length, recursiveIterator, _i, _len;
      if (elem.canvas) {
        return this;
      }
      length = 0;
      recursiveIterator = (function(_this) {
        return function(obj, name) {
          var child, k, v, _results;
          _results = [];
          for (k in obj) {
            v = obj[k];
            if (k === 'name' && v === name) {
              _results.push(_this[length++] = obj);
            } else if (k === 'children' && obj.name !== 'noquery') {
              _results.push((function() {
                var _i, _len, _ref, _results1;
                _ref = obj.children;
                _results1 = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  child = _ref[_i];
                  _results1.push(recursiveIterator(child, name));
                }
                return _results1;
              })());
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };
      })(this);
      if (typeof elem === 'string') {
        recursiveIterator(stage, elem);
      } else {
        if (elem.length) {
          for (i = _i = 0, _len = elem.length; _i < _len; i = ++_i) {
            elem = elem[i];
            this[i] = elem;
          }
        } else {
          this[0] = elem;
        }
      }
      this.create.that = this;
      return this;
    }

    jakeQuery.prototype.newShape = function(obj) {
      var shape;
      shape = new createjs.Shape();
      if (obj.name) {
        shape.name = obj.name;
      }
      if (obj.type) {
        shape.type = obj.type;
      }
      return shape;
    };

    jakeQuery.prototype.create = {
      defaultShape: {
        name: false,
        color: 'transparent',
        x: 0,
        y: 0,
        radius: 0,
        width: 0,
        height: 0
      },
      container: function(name) {
        var container;
        container = new createjs.Container();
        container.name = name;
        stage.addChild(container);
        return $(name);
      },
      circle: function(obj) {
        var shape;
        obj = $.extend(this.defaultShape, obj);
        obj.type = 'circle';
        shape = this.that.newShape(obj);
        shape.graphics.beginFill(obj.color).drawCircle(obj.x, obj.y, obj.radius);
        return shape;
      },
      rectangle: function(obj) {
        var shape;
        obj = $.extend(this.defaultShape, obj);
        obj.type = 'rectangle';
        shape = this.that.newShape(obj);
        shape.graphics.beginFill(obj.color).drawRect(obj.x, obj.y, obj.width, obj.height);
        return shape;
      }
    };

    return jakeQuery;

  })();

  $.extend($, new jakeQuery(stage));

}).call(this);
