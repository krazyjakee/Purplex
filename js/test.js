var changeColor, click, detectSameTiles, drawButton, drawEndGameMenu, drawGame, drawMenu, drawPurpleX, drawScore, drawTimer, drawTriangles, getHoriLine, getVertLine, hoverIn, hoverOut, score, swap, swapAnimation, timer, utilities;

Array.prototype.unique = function() {
  var a, i, l, u;
  u = {};
  a = [];
  i = 0;
  l = this.length;
  while (i < l) {
    if (u.hasOwnProperty(this[i])) {
      ++i;
      continue;
    }
    a.push(this[i]);
    u[this[i]] = 1;
    ++i;
  }
  return a;
};

Math.seed = 1;

Math.randomSeed = function(max, min) {
  var rnd;
  max = max || 1;
  min = min || 0;
  Math.seed = (Math.seed * 9301 + 49297) % 233280;
  rnd = Math.seed / 233280;
  return Math.floor(min + rnd * (max - min)) - 1;
};

window.game = {
  enabled: false,
  level: 1,
  size: 9,
  tileWidth: 50,
  tileHeight: 35,
  selectedTile: false,
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
    }, 0, 125);
  }
  return $(tc.children[tileId].children[0]).animate({
    x: -(game.tileWidth / 2),
    y: -(game.tileHeight / 2),
    scaleX: 2.0,
    scaleY: 2.0
  }, 0, 125);
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
    }, 0, 125));
  }
  return _results;
};

changeColor = function(tile, newColor) {
  if (newColor == null) {
    newColor = false;
  }
  if (!newColor) {
    newColor = utilities.randomColor();
  }
  return $(tile.children[0]).animate({
    x: game.tileWidth / 2,
    y: game.tileHeight / 2,
    scaleX: 0,
    scaleY: 0
  }, 0, 125, 'linear', function() {
    $.changeColor(this, newColor, game.tileWidth / 2, game.tileHeight / 2);
    return $(this).animate({
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1
    }, 0, 125, 'linear', function() {
      return detectSameTiles(tile.tileId);
    });
  });
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
  }, 0, 125, 'linear', function() {
    source.x = sourcePrevious.x;
    source.y = sourcePrevious.y;
    return $.changeColor(this.children[0], color2, game.tileWidth / 2, game.tileHeight / 2);
  });
  $(destination).animate({
    x: source.x,
    y: source.y
  }, 0, 125, 'linear', function() {
    destination.x = destinationPrevious.x;
    destination.y = destinationPrevious.y;
    return $.changeColor(this.children[0], color1, game.tileWidth / 2, game.tileHeight / 2);
  });
  return setTimeout(function() {
    hoverOut(source.tileId);
    detectSameTiles(source.tileId);
    return detectSameTiles(destination.tileId);
  }, 200);
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
      return score.add(5);
    } else {
      return swapAnimation(source, destination, true);
    }
  } else {
    return game.selectedTile = tileId;
  }
};

click = function(e) {
  var i, others, point, swapped, tileId, _i, _len;
  if (game.enabled) {
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
          swap(game.tileContainer.children[i], e.currentTarget);
          hoverOut(i);
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
  }
};

getHoriLine = function(index) {
  var hori, i, left;
  i = index;
  if ((i - 1) % game.size) {
    i--;
  }
  while ((i + 1) % game.size && i % (game.size + 1) && i % (game.size - 1)) {
    i--;
  }
  left = i;
  i = index;
  while (i % (game.size + 1) && i % (game.size - 1) && (i + 1) % game.size) {
    i++;
  }
  hori = [];
  while (left < i) {
    left++;
    if (left % (game.size + 1) && left % (game.size - 1)) {
      hori.push(left);
    }
  }
  return hori;
};

getVertLine = function(index) {
  var i, top, vert;
  i = index;
  while (i % (game.size + 1) && i % (game.size - 1) && i > (game.size - 1)) {
    i -= game.size;
  }
  top = i;
  if (top < (game.size * 2)) {
    top -= game.size;
  }
  i = index;
  while (i % (game.size + 1) && i % (game.size - 1) && i < (game.size * (game.size - 1))) {
    i += game.size;
  }
  vert = [];
  while (top < i) {
    top += game.size;
    if (top % (game.size + 1) && top % (game.size - 1)) {
      vert.push(top);
    }
  }
  return vert;
};

detectSameTiles = function(tileId) {
  var h, hori, horiIndex, i, tc, v, vert, vertIndex, _i, _j, _k, _l, _len, _len1, _len2, _len3;
  vert = [];
  hori = [];
  tc = $(game.tileContainer)[0];
  vertIndex = getVertLine(tileId);
  horiIndex = getHoriLine(tileId);
  for (_i = 0, _len = vertIndex.length; _i < _len; _i++) {
    v = vertIndex[_i];
    v = tc.children[v].children[0].color;
    if (v) {
      vert.push(v);
    }
  }
  for (_j = 0, _len1 = horiIndex.length; _j < _len1; _j++) {
    h = horiIndex[_j];
    h = tc.children[h].children[0].color;
    if (h) {
      hori.push(h);
    }
  }
  if (vertIndex.length > 1) {
    if (vert.unique().length === 1) {
      for (_k = 0, _len2 = vertIndex.length; _k < _len2; _k++) {
        i = vertIndex[_k];
        changeColor(tc.children[i]);
      }
      score.add(vertIndex.length * 10);
    }
  }
  if (horiIndex.length > 1) {
    if (hori.unique().length === 1) {
      for (_l = 0, _len3 = horiIndex.length; _l < _len3; _l++) {
        i = horiIndex[_l];
        changeColor(tc.children[i]);
      }
      return score.add(horiIndex.length * 10);
    }
  }
};

score = {
  current: 0,
  add: function(input) {
    var addedTime, newTime;
    score.current = score.current + input;
    $('score')[0].text = "Score: " + score.current;
    addedTime = Math.round(score.current / 1000);
    newTime = timer.current + addedTime;
    if (newTime > timer.total) {
      return timer.current = timer.total;
    } else {
      return timer.current = newTime;
    }
  },
  setBest: function() {
    if (window.localStorage['best' + game.level] == null) {
      window.localStorage['best' + game.level] = 0;
    }
    if (window.localStorage['last' + game.level] == null) {
      window.localStorage['last' + game.level] = 0;
    }
    $('last-score')[0].text = "Last: " + window.localStorage['last' + game.level];
    return $('best-score')[0].text = "Best: " + window.localStorage['best' + game.level];
  }
};

timer = {
  timer: false,
  current: false,
  total: 2.5 * 60,
  start: function() {
    var wc;
    game.enabled = true;
    timer.current = timer.total;
    game.tileContainer.filters = [];
    wc = $('white-cover');
    return timer.timer = setInterval(function() {
      var minutes, percPixels, percTime, seconds;
      timer.current -= 1;
      minutes = Math.floor(timer.current / 60);
      minutes = ('0' + minutes).slice(-2);
      seconds = timer.current - (60 * minutes);
      seconds = ('0' + seconds).slice(-2);
      $('timer')[0].text = "" + minutes + ":" + seconds;
      percTime = (timer.current / timer.total) * 100;
      percPixels = ((game.size * game.tileHeight) / 100) * (100 - percTime);
      wc.animate({
        y: -percPixels
      }, 0, 1000);
      if (!timer.current) {
        return timer.stop();
      }
    }, 1000);
  },
  stop: function() {
    clearInterval(timer.timer);
    window.localStorage['last' + game.level] = score.current;
    if (window.localStorage['best' + game.level] < score.current) {
      window.localStorage['best' + game.level] = score.current;
    }
    score.setBest();
    $('tileContainer')[0].filters = [game.grayscale];
    game.tileContainer.cache(0, 0, game.size * game.tileWidth, game.size * game.tileHeight);
    game.enabled = false;
    score.current = 0;
    return $('white-cover').animate({
      y: 0
    }, 1000, 1000, 'linear', drawEndGameMenu);
  }
};

drawScore = function() {
  stage.addChild($.create.text({
    name: "score",
    text: "Score: 0",
    size: "18px",
    x: game.size * game.tileWidth + game.tileWidth / 4,
    y: 32
  }));
  stage.addChild($.create.text({
    name: "last-score",
    text: "Last: 0",
    size: "18px",
    x: game.size * game.tileWidth + game.tileWidth / 4,
    y: 54
  }));
  return stage.addChild($.create.text({
    name: "best-score",
    text: "Best: 0",
    size: "18px",
    x: game.size * game.tileWidth + game.tileWidth / 4,
    y: 76
  }));
};

drawTimer = function() {
  var minutes, seconds, text;
  minutes = Math.floor(timer.total / 60);
  seconds = timer.total - (60 * minutes);
  minutes = ('0' + minutes).slice(-2);
  seconds = ('0' + seconds).slice(-2);
  text = "" + minutes + ":" + seconds;
  return stage.addChild($.create.text({
    name: "timer",
    text: text,
    size: "24px",
    x: game.size * game.tileWidth + game.tileWidth / 4,
    y: 5
  }));
};

drawPurpleX = function(full) {
  var height, y;
  if (full == null) {
    full = false;
  }
  height = game.size * game.tileHeight;
  stage.addChild($.create.rectangle({
    name: 'purplex',
    x: 0,
    y: 0,
    width: game.size * game.tileWidth,
    height: height,
    color: 'purple',
    scaleX: 1,
    scaleY: 1
  }));
  if (full) {
    y = -height;
  } else {
    y = 0;
  }
  return stage.addChild($.create.rectangle({
    name: 'white-cover',
    x: 0,
    y: y,
    width: game.size * game.tileWidth,
    height: height,
    color: 'white',
    scaleX: 1,
    scaleY: 1
  }));
};

drawTriangles = function() {
  var s, s2, sf2, sr2, th, th2, triangle1, triangle2, triangle3, triangle4, tw, tw2;
  triangle1 = new createjs.Shape();
  triangle2 = new createjs.Shape();
  triangle3 = new createjs.Shape();
  triangle4 = new createjs.Shape();
  triangle1.graphics.beginFill("white");
  triangle2.graphics.beginFill("white");
  triangle3.graphics.beginFill("white");
  triangle4.graphics.beginFill("white");
  s = game.size;
  s2 = game.size / 2;
  sf2 = Math.floor(game.size / 2);
  sr2 = Math.round(game.size / 2);
  tw = game.tileWidth;
  tw2 = game.tileWidth / 4;
  th = game.tileHeight;
  th2 = game.tileHeight / 4;
  triangle1.graphics.moveTo(0, th2).lineTo((sf2 * tw) + tw2, s2 * th).lineTo(0, (s * th) - th2).lineTo(0, th2);
  triangle2.graphics.moveTo(tw2, 0).lineTo(s2 * tw, (sf2 * th) + th2).lineTo((s * tw) - tw2, 0).lineTo(tw2, 0);
  triangle3.graphics.moveTo(s * tw, th2).lineTo((sr2 * tw) - tw2, s2 * th).lineTo(s * tw, (s * th) - th2).lineTo(s * tw, th2);
  triangle4.graphics.moveTo(0, (s * th) + th2).lineTo(s2 * tw, (sr2 * th) - th2).lineTo(s * tw, (s * th) + th2).lineTo(0, (s * th) + th2);
  return stage.addChild(triangle1, triangle2, triangle3, triangle4);
};

drawGame = function() {
  var circle, coord, filler, i, index, tc, tile, _i, _j, _len, _ref, _ref1;
  stage.removeAllChildren();
  drawTimer();
  drawScore();
  score.setBest();
  drawPurpleX();
  drawTriangles();
  game.selectedContainer = $.create.container('selectedContainer');
  game.followersContainer = $.create.container('followersContainer');
  game.tileContainer = $.create.container('tileContainer');
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
  for (index = _j = 0, _len = _ref1.length; _j < _len; index = ++_j) {
    tile = _ref1[index];
    if (tile.children) {
      $(tile.children[0]).animate({
        x: 0,
        y: 0,
        scaleX: 1.0,
        scaleY: 1.0
      }, index * 10, 1000);
    }
  }
  return setTimeout(function() {
    timer.timer = false;
    return timer.start();
  }, 1500);
};

drawEndGameMenu = function() {
  var k, _results;
  _results = [];
  for (k in endGameMenu) {
    _results.push(stage.addChild(drawButton(endGameMenu[k])));
  }
  return _results;
};

drawButton = function(obj) {
  var button, buttonContainer, text;
  buttonContainer = new createjs.Container();
  button = new createjs.Shape();
  text = new createjs.Text(obj.text, "" + obj.textSize + " Arial", obj.textColor);
  text = $.create.text({
    name: obj.name,
    text: obj.text,
    size: obj.textSize,
    align: obj.textAlign,
    x: obj.textX,
    y: obj.textY,
    color: obj.textColor
  });
  buttonContainer.x = obj.x;
  buttonContainer.y = obj.y;
  button.graphics.beginFill(obj.color).drawRect(0, 0, obj.width, obj.height);
  if (obj.click) {
    button.addEventListener('click', obj.click);
  }
  buttonContainer.addChild(button, text);
  return buttonContainer;
};

drawMenu = function() {
  var k, _results;
  stage.removeAllChildren();
  drawPurpleX(true);
  drawTriangles();
  drawTimer();
  drawScore();
  score.setBest();
  _results = [];
  for (k in menuObj) {
    _results.push(stage.addChild(drawButton(menuObj[k])));
  }
  return _results;
};

window.onload = drawMenu;

document.getElementById('canvas').setAttribute('width', (game.size * game.tileWidth) + (game.tileWidth * 3));

document.getElementById('canvas').setAttribute('height', (game.size * game.tileHeight) + 20);
