(function() {
  var coord, game, i, tile, utilities, _i;

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
      colors = ['#FF0000', '#FFFF00', '#0066FF', '#009933', '#FF9933'];
      return colors[Math.randomSeed(0, colors.length + 1)];
    }
  };

  for (i = _i = 0; _i < 169; i = ++_i) {
    coord = utilities.numberToCoord(i);
    tile = $.create.rectangle({
      name: "tile" + i,
      width: game.tileWidth,
      height: game.tileHeight,
      x: coord.x * game.tileWidth,
      y: coord.y * game.tileHeight,
      color: 'red'
    });
    $('tileContainer')[0].addChild(tile);
  }

  console.log($('tileContainer'));

}).call(this);
