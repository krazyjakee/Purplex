(function() {
  var click, drawGame, game, hoverIn, hoverOut, swap, swapAnimation, tileSelected, utilities;

  Math.seed = 1;

  Math.randomSeed = function(max, min) {
    var rnd;
    max = max || 1;
    min = min || 0;
    Math.seed = (Math.seed * 9301 + 49297) % 233280;
    rnd = Math.seed / 233280;
    return Math.floor(min + rnd * (max - min)) - 1;
  };

  game = {
    enabled: false,
    level: 1,
    tileWidth: 50,
    tileHeight: 35,
    selectedTile: false,
    selectedContainer: $.create.container('selectedContainer'),
    followersContainer: $.create.container('followersContainer'),
    tileContainer: $.create.container('tileContainer'),
    grayscale: new createjs.ColorMatrixFilter([0.30, 0.30, 0.30, 0, 0, 0.30, 0.30, 0.30, 0, 0, 0.30, 0.30, 0.30, 0, 0, 0, 0, 0, 1, 0]),
    sepia: new createjs.ColorMatrixFilter([0.39, 0.77, 0.19, 0, 0, 0.35, 0.68, 0.17, 0, 0, 0.27, 0.53, 0.13, 0, 0, 0, 0, 0, 1, 0])
  };

  utilities = {
    numberToCoord: function(num) {
      var y;
      y = 0;
      while (num >= 13) {
        num -= 13;
        y++;
      }
      return {
        x: num,
        y: y
      };
    },
    numberToRotationCoord: function(num) {
      var y;
      y = 0;
      while (num >= 13) {
        num -= 13;
        y++;
      }
      return {
        x: num - 6,
        y: y - 6
      };
    },
    getRotation: function(num, point) {
      var midCell;
      midCell = Math.floor(169 / 2);
      switch (num) {
        case 1:
          return midCell + 13 * point.y + point.x;
        case 2:
          return midCell + 13 * point.x - point.y;
        case 3:
          return midCell - 13 * point.y - point.x;
        case 4:
          return midCell - 13 * point.x + point.y;
      }
    },
    randomColor: function() {
      var colors;
      colors = ['#FF0000', 'purple', '#0066FF', '#009933', '#FF9933'];
      return colors[Math.randomSeed(0, colors.length + 1)];
    }
  };

  tileSelected = false;

  hoverIn = function(e) {
    var i, others, point, tc, _i, _len;
    if (!tileSelected) {
      tc = $(game.tileContainer)[0];
      point = utilities.numberToRotationCoord(e.currentTarget.tileId);
      others = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 4; _i >= 1; i = --_i) {
          _results.push(utilities.getRotation(i, point));
        }
        return _results;
      })();
      for (_i = 0, _len = others.length; _i < _len; _i++) {
        i = others[_i];
        $(tc.children[i].children[0]).animate({
          x: -(game.tileWidth / 4),
          y: -(game.tileHeight / 4),
          scaleX: 1.5,
          scaleY: 1.5
        }, 0, 250);
      }
      return $(e.currentTarget.children[0]).animate({
        x: -(game.tileWidth / 2),
        y: -(game.tileHeight / 2),
        scaleX: 2.0,
        scaleY: 2.0
      }, 0, 250);
    }
  };

  hoverOut = function(e) {
    var i, others, point, tc, _i, _len, _results;
    if (!tileSelected) {
      tc = $(game.tileContainer)[0];
      point = utilities.numberToRotationCoord(e.currentTarget.tileId);
      others = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 4; _i >= 1; i = --_i) {
          _results.push(utilities.getRotation(i, point));
        }
        return _results;
      })();
      _results = [];
      for (_i = 0, _len = others.length; _i < _len; _i++) {
        i = others[_i];
        _results.push($(tc.children[i].children[0]).animate({
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1
        }, 0, 250));
      }
      return _results;
    }
  };

  swapAnimation = function(source, destination, color) {
    var newX, newY;
    if (color == null) {
      color = false;
    }
    newX = destination.x - source.x;
    newY = destination.y - source.y;
    if (!color) {
      color = utilities.randomColor();
    }
    $.changeColor(destination.children[0], color);
    console.log(source.x);
    return $(source.children[0]).animate({
      x: newX,
      y: newY,
      scaleX: 1,
      scaleY: 1
    }, 0, 250, 'linear', function() {
      this.x = 0;
      return this.y = 0;
    });
  };

  swap = function(source, destination) {
    var i, others, p, point;
    point = utilities.numberToRotationCoord(source.tileId);
    others = (function() {
      var _i, _results;
      _results = [];
      for (i = _i = 4; _i >= 1; i = --_i) {
        _results.push(utilities.getRotation(i, point));
      }
      return _results;
    })();
    p = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = others.length; _i < _len; _i++) {
        p = others[_i];
        if (p === destination.tileId) {
          _results.push(p);
        }
      }
      return _results;
    })();
    if (p.length) {
      if (source.children[0].color === destination.children[0].color && source.tileId !== destination.tileId) {
        swapAnimation(source, destination);
        return swapAnimation(destination, source);
      } else {
        swapAnimation(source, destination, source.children[0].color);
        return swapAnimation(destination, source, destination.children[0].color);
      }
    } else {
      return game.selectedTile = tileId;
    }
  };

  click = function(e) {
    var i, others, point, _i, _len;
    if (tileSelected) {
      point = utilities.numberToRotationCoord(e.currentTarget.tileId);
      others = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 4; _i >= 1; i = --_i) {
          _results.push(utilities.getRotation(i, point));
        }
        return _results;
      })();
      for (_i = 0, _len = others.length; _i < _len; _i++) {
        i = others[_i];
        if (i === tileSelected) {
          swap(game.tileContainer.children[tileSelected], e.currentTarget);
        }
      }
      return tileSelected = false;
    } else {
      return tileSelected = e.currentTarget.tileId;
    }
  };

  drawGame = function(gameNumber) {
    var circle, coord, filler, i, index, tc, tile, _i, _j, _len, _ref, _results;
    Math.seed = gameNumber;
    tc = $(game.tileContainer);
    for (i = _i = 0; _i < 169; i = ++_i) {
      if (i % 14 && i % 12) {
        coord = utilities.numberToCoord(i);
        tile = $.create.container("tile" + i);
        tile.x = coord.x * game.tileWidth;
        tile.y = coord.y * game.tileHeight;
        tile.tileId = i;
        filler = $.create.rectangle({
          name: "tile" + i + "-filler",
          width: game.tileWidth,
          height: game.tileHeight,
          color: 'rgba(255,255,255,0.01)',
          x: 0,
          y: 0
        });
        circle = $.create.circle({
          name: "tile" + i + "-circle",
          radius: 10,
          x: game.tileWidth / 2,
          y: game.tileHeight / 2,
          scaleX: 0,
          scaleY: 0,
          color: utilities.randomColor()
        });
        tile.addChild(circle, filler);
        tile.addEventListener('rollover', hoverIn);
        tile.addEventListener('rollout', hoverOut);
        tile.addEventListener('click', click);
      } else {
        tile = $.create.container("tile" + i);
      }
      tc.addChild(tile);
    }
    _ref = tc[0].children;
    _results = [];
    for (index = _j = 0, _len = _ref.length; _j < _len; index = ++_j) {
      tile = _ref[index];
      if (tile.children) {
        _results.push($(tile.children[0]).animate({
          x: 0,
          y: 0,
          scaleX: 1.0,
          scaleY: 1.0
        }, index * 10, 1000));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  drawGame(0);

}).call(this);
