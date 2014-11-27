var draw, game, stage, utilities;

stage = new createjs.Stage("canvas");

stage.fillStyle = "#000";

createjs.Ticker.addEventListener("tick", stage);

stage.enableMouseOver();

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
  selectedContainer: new createjs.Container(),
  followersContainer: new createjs.Container(),
  tileContainer: new createjs.Container(),
  grayscale: new createjs.ColorMatrixFilter([0.30, 0.30, 0.30, 0, 0, 0.30, 0.30, 0.30, 0, 0, 0.30, 0.30, 0.30, 0, 0, 0, 0, 0, 1, 0]),
  sepia: new createjs.ColorMatrixFilter([0.39, 0.77, 0.19, 0, 0, 0.35, 0.68, 0.17, 0, 0, 0.27, 0.53, 0.13, 0, 0, 0, 0, 0, 1, 0]),
  tileClick: function(e) {
    var color, i, index, others, point, selected, tileId, _i, _len, _ref, _results;
    tileId = e.currentTarget.tileId;
    game.selectedTile = tileId;
    if (tileId % 14 && tileId % 12) {
      point = utilities.numberToRotationCoord(tileId);
      others = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 4; _i >= 1; i = --_i) {
          _results.push(utilities.getRotation(i, point));
        }
        return _results;
      })();
      _ref = game.selectedContainer.children;
      _results = [];
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        selected = _ref[index];
        point = utilities.numberToCoord(others[index]);
        selected.tileId = others[index];
        point.x *= game.tileWidth;
        point.y *= game.tileHeight;
        selected.x = point.x + (game.tileWidth / 2);
        selected.y = point.y + (game.tileHeight / 2);
        if (others[index] === tileId) {
          color = 'black';
        } else {
          color = game.getTile(others[index]).color;
        }
        _results.push(selected.graphics.clear().beginFill(color).drawRect(0, 0, 18, 18));
      }
      return _results;
    }
  },
  tileHover: function(e) {
    var follower, i, index, others, point, tileId, _i, _len, _ref, _results;
    tileId = e.currentTarget.tileId;
    if (tileId % 14 && tileId % 12) {
      point = utilities.numberToRotationCoord(tileId);
      others = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 4; _i >= 1; i = --_i) {
          _results.push(utilities.getRotation(i, point));
        }
        return _results;
      })();
      _ref = game.followersContainer.children;
      _results = [];
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        follower = _ref[index];
        point = utilities.numberToCoord(others[index]);
        point.x *= game.tileWidth;
        point.y *= game.tileHeight;
        createjs.Tween.removeTweens(follower);
        _results.push(createjs.Tween.get(follower).to({
          x: point.x + (game.tileWidth / 2),
          y: point.y + (game.tileHeight / 2)
        }, 200));
      }
      return _results;
    }
  },
  getSelectedTile: function() {
    return game.tileContainer.children[game.selectedTile];
  },
  getTile: function(tileId) {
    return game.tileContainer.children[tileId];
  }
};

draw = {
  tile: function(tileId, color) {
    var coord, filler, shape, tile, x, y;
    if (color == null) {
      color = false;
    }
    coord = utilities.numberToCoord(tileId);
    x = coord.x * game.tileWidth;
    y = coord.y * game.tileHeight;
    tile = new createjs.Container();
    tile.x = x;
    tile.y = y;
    tile.width = game.tileWidth;
    tile.height = game.tileHeight;
    shape = new createjs.Shape();
    if (tileId % 14 && tileId % 12) {
      shape.graphics.beginFill(color).drawCircle(game.tileWidth / 2, game.tileHeight / 2, 10);
      shape.scaleX = 0.0;
      shape.scaleY = 0.0;
      shape.x = game.tileWidth / 2;
      shape.y = game.tileHeight / 2;
    } else {
      shape.graphics.beginFill("purple").drawRect(0, 0, game.tileWidth, game.tileHeight);
    }
    filler = new createjs.Shape();
    filler.graphics.beginFill('rgba(255,255,255,0.01)').drawRect(0, 0, game.tileWidth, game.tileHeight);
    tile.tileId = tileId;
    tile.color = color;
    tile.addChild(shape, filler);
    tile.addEventListener('click', game.tileClick);
    tile.addEventListener('rollover', game.tileHover);
    return game.tileContainer.addChild(tile);
  },
  newGame: function(gameId) {
    var i, _i;
    stage.removeAllChildren();
    game.tileContainer = new createjs.Container();
    Math.seed = gameId;
    for (i = _i = 0; _i < 169; i = ++_i) {
      draw.tile(i, utilities.randomColor());
    }
    draw.followers();
    return draw.selected();
  },
  followers: function() {
    var i, shape, _i;
    for (i = _i = 0; _i <= 4; i = ++_i) {
      shape = new createjs.Shape();
      shape.graphics.beginFill('black').drawCircle(0, 0, 11);
      shape.x = (game.tileWidth * 6) + (game.tileWidth / 2);
      shape.y = (game.tileHeight * 6) + (game.tileHeight / 2);
      game.followersContainer.addChild(shape);
    }
    return stage.addChild(game.followersContainer);
  },
  selected: function() {
    var i, shape, _i;
    for (i = _i = 0; _i < 4; i = ++_i) {
      shape = new createjs.Shape();
      shape.graphics.beginFill('black').drawRect(0, 0, 18, 18);
      shape.x = (game.tileWidth * 6) + (game.tileWidth / 2);
      shape.y = (game.tileHeight * 6) + (game.tileHeight / 2);
      shape.regX = 9;
      shape.regY = 9;
      createjs.Tween.get(shape, {
        loop: true
      }).to({
        rotation: 360
      }, 5000);
      game.selectedContainer.addChild(shape);
    }
    return stage.addChild(game.selectedContainer);
  },
  beginScale: function() {
    var tile, tileId, _i, _len, _ref, _results;
    _ref = game.tileContainer.children;
    _results = [];
    for (tileId = _i = 0, _len = _ref.length; _i < _len; tileId = ++_i) {
      tile = _ref[tileId];
      if (tileId % 14 && tileId % 12) {
        _results.push(createjs.Tween.get(tile.children[0]).wait(tileId * 5).to({
          x: 0,
          y: 0,
          scaleX: 1.0,
          scaleY: 1.0
        }, 500));
      }
    }
    return _results;
  },
  clear: function() {
    var i, _i;
    stage.removeAllChildren();
    for (i = _i = 0; _i < 169; i = ++_i) {
      if (!(i % 14 && i % 12)) {
        draw.tile(i);
      }
    }
    game.tileContainer.filters = [game.grayscale];
    return game.tileContainer.cache(0, 0, 13 * game.tileWidth, 13 * game.tileHeight);
  },
  menu: function() {
    menu.levelLabel = draw.button(menuObj.levelLabel);
    menu.plusBtn = draw.button(menuObj.plusBtn);
    menu.minusBtn = draw.button(menuObj.minusBtn);
    menu.startBtn = draw.button(menuObj.startBtn);
    return stage.addChild(menu.levelLabel.container, menu.plusBtn.container, menu.minusBtn.container, menu.startBtn.container);
  },
  button: function(obj) {
    var button, buttonContainer, text;
    buttonContainer = new createjs.Container();
    button = new createjs.Shape();
    text = new createjs.Text(obj.text, "" + obj.textSize + " Arial", obj.color);
    buttonContainer.x = obj.x;
    buttonContainer.y = obj.y;
    text.x = obj.textX;
    text.y = obj.textY;
    if (obj.textAlign) {
      text.textAlign = obj.textAlign;
    }
    button.graphics.beginFill(obj.backgroundColor).drawRect(0, 0, obj.width, obj.height);
    if (obj.click) {
      button.addEventListener('click', obj.click);
    }
    buttonContainer.addChild(button, text);
    return {
      container: buttonContainer,
      text: text,
      button: button
    };
  }
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
    colors = ['#FF0000', '#FFFF00', '#0066FF', '#009933', '#9900CC', '#FF9933'];
    return colors[Math.randomSeed(0, colors.length + 1)];
  }
};
