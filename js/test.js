(function() {
  var click, drawGame, game, hoverIn, hoverOut, swap, swapAnimation, utilities;

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
    size: 9,
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
      while (num >= game.size) {
        num -= game.size;
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
      while (num >= game.size) {
        num -= game.size;
        y++;
      }
      return {
        x: num - ((game.size - 1) / 2),
        y: y - ((game.size - 1) / 2)
      };
    },
    getRotation: function(num, point) {
      var midCell;
      midCell = Math.floor((game.size * game.size) / 2);
      switch (num) {
        case 1:
          return midCell + game.size * point.y + point.x;
        case 2:
          return midCell + game.size * point.x - point.y;
        case 3:
          return midCell - game.size * point.y - point.x;
        case 4:
          return midCell - game.size * point.x + point.y;
      }
    },
    randomColor: function() {
      var colors;
      colors = ['#FF0000', 'purple', '#0066FF', '#009933', '#FF9933'];
      return colors[Math.randomSeed(0, colors.length + 1)];
    }
  };

  hoverIn = function(tileId) {
    var i, others, point, tc, _i, _len;
    tc = $(game.tileContainer)[0];
    point = utilities.numberToRotationCoord(tileId);
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
    return $(tc.children[tileId].children[0]).animate({
      x: -(game.tileWidth / 2),
      y: -(game.tileHeight / 2),
      scaleX: 2.0,
      scaleY: 2.0
    }, 0, 250);
  };

  hoverOut = function(tileId) {
    var i, others, point, tc, _i, _len, _results;
    tc = $(game.tileContainer)[0];
    point = utilities.numberToRotationCoord(tileId);
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
  };

  swapAnimation = function(source, destination, color) {
    var color1, color2, destinationPrevious, sourcePrevious;
    if (color == null) {
      color = false;
    }
    if (color) {
      color1 = source.children[0].color;
      color2 = destination.children[0].color;
    } else {
      color1 = utilities.randomColor();
      color2 = utilities.randomColor();
    }
    sourcePrevious = {
      x: source.x,
      y: source.y
    };
    destinationPrevious = {
      x: destination.x,
      y: destination.y
    };
    $(source).animate({
      x: destination.x,
      y: destination.y
    }, 0, 250, 'linear', function() {
      source.x = sourcePrevious.x;
      source.y = sourcePrevious.y;
      return $.changeColor(this.children[0], color2, game.tileWidth / 2, game.tileHeight / 2);
    });
    $(destination).animate({
      x: source.x,
      y: source.y
    }, 0, 250, 'linear', function() {
      destination.x = destinationPrevious.x;
      destination.y = destinationPrevious.y;
      return $.changeColor(this.children[0], color1, game.tileWidth / 2, game.tileHeight / 2);
    });
    return setTimeout(function() {
      return hoverOut(source.tileId);
    }, 350);
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
        return swapAnimation(source, destination);
      } else {
        return swapAnimation(source, destination, true);
      }
    } else {
      return game.selectedTile = tileId;
    }
  };

  click = function(e) {
    var i, others, point, swapped, tileId, _i, _len;
    tileId = e.currentTarget.tileId;
    if (game.selectedTile) {
      point = utilities.numberToRotationCoord(tileId);
      others = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 4; _i >= 1; i = --_i) {
          _results.push(utilities.getRotation(i, point));
        }
        return _results;
      })();
      swapped = false;
      for (_i = 0, _len = others.length; _i < _len; _i++) {
        i = others[_i];
        if (i === game.selectedTile) {
          swapped = true;
          swap(game.tileContainer.children[game.selectedTile], e.currentTarget);
          hoverOut(game.selectedTile);
        }
      }
      hoverIn(game.selectedTile);
      if (!swapped) {
        hoverOut(game.selectedTile);
      }
      return game.selectedTile = false;
    } else {
      hoverIn(tileId);
      return game.selectedTile = e.currentTarget.tileId;
    }
  };

  drawGame = function(gameNumber) {
    var circle, coord, filler, i, index, tc, tile, _i, _j, _len, _ref, _ref1, _results;
    Math.seed = gameNumber;
    tc = $(game.tileContainer);
    for (i = _i = 0, _ref = game.size * game.size; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      if (i % (game.size + 1) && i % (game.size - 1)) {
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
        tile.addEventListener('click', click);
      } else {
        tile = $.create.container("tile" + i);
      }
      tc.addChild(tile);
    }
    _ref1 = tc[0].children;
    _results = [];
    for (index = _j = 0, _len = _ref1.length; _j < _len; index = ++_j) {
      tile = _ref1[index];
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
