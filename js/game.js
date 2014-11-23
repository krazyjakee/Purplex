var draw, game, stage, utilities;

stage = new createjs.Stage("canvas");

stage.fillStyle = "#000";

createjs.Ticker.addEventListener("tick", stage);

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
  tileContainer: new createjs.Container(),
  grayscale: new createjs.ColorMatrixFilter([0.30, 0.30, 0.30, 0, 0, 0.30, 0.30, 0.30, 0, 0, 0.30, 0.30, 0.30, 0, 0, 0, 0, 0, 1, 0]),
  sepia: new createjs.ColorMatrixFilter([0.39, 0.77, 0.19, 0, 0, 0.35, 0.68, 0.17, 0, 0, 0.27, 0.53, 0.13, 0, 0, 0, 0, 0, 1, 0])
};

draw = {
  tile: function(tileId, color) {
    var coord, shape, tile, x, y;
    if (color == null) {
      color = false;
    }
    tile = new createjs.Container();
    shape = new createjs.Shape();
    coord = utilities.numberToCoord(tileId);
    x = coord.x * game.tileWidth;
    y = coord.y * game.tileHeight;
    if (tileId % 14 && tileId % 12) {
      shape.graphics.beginFill(color).drawCircle(game.tileWidth / 2, game.tileHeight / 2, 10);
      shape.scaleX = 0.0;
      shape.scaleY = 0.0;
      shape.x = x + (game.tileWidth / 2);
      shape.y = y + (game.tileHeight / 2);
    } else {
      shape.graphics.beginFill("purple").drawRect(x, y, game.tileWidth, game.tileHeight);
    }
    tile.addChild(shape);
    return game.tileContainer.addChild(tile);
  },
  game: function(gameId) {
    var i, _i, _results;
    stage.removeAllChildren();
    game.tileContainer = new createjs.Container();
    Math.seed = gameId;
    _results = [];
    for (i = _i = 0; _i < 169; i = ++_i) {
      _results.push(draw.tile(i, utilities.randomColor()));
    }
    return _results;
  },
  beginScale: function() {
    var coord, tile, tileId, x, y, _i, _len, _ref, _results;
    _ref = game.tileContainer.children;
    _results = [];
    for (tileId = _i = 0, _len = _ref.length; _i < _len; tileId = ++_i) {
      tile = _ref[tileId];
      if (tileId % 14 && tileId % 12) {
        coord = utilities.numberToCoord(tileId);
        x = coord.x * game.tileWidth;
        y = coord.y * game.tileHeight;
        _results.push(createjs.Tween.get(tile.children[0]).wait(tileId * 5).to({
          x: x,
          y: y,
          scaleX: 1.0,
          scaleY: 1.0
        }, 500));
      } else {
        _results.push(void 0);
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
  randomColor: function() {
    var colors;
    colors = ['red', 'yellow', 'blue', 'green', 'purple', 'orange'];
    return colors[Math.randomSeed(0, colors.length + 1)];
  }
};
