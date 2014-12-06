var menuObj;

menuObj = {
  plusBtn: {
    name: 'plusBtn',
    x: (Math.floor(game.size / 2) + 1) * game.tileWidth,
    y: (Math.floor(game.size / 2) - 1) * game.tileHeight,
    width: game.tileWidth,
    height: game.tileHeight,
    color: 'purple',
    text: "+",
    textSize: "40px",
    textX: game.tileWidth / 2 - 12,
    textY: game.tileHeight / 2 - 22,
    textColor: 'white',
    click: function() {
      if (Math.seed < 99) {
        Math.seed++;
        menu.levelLabel.text.text = Math.seed;
        return stage.update();
      }
    }
  },
  minusBtn: {
    name: 'minusBtn',
    x: (Math.floor(game.size / 2) - 1) * game.tileWidth,
    y: (Math.floor(game.size / 2) - 1) * game.tileHeight,
    width: game.tileWidth,
    height: game.tileHeight,
    color: 'purple',
    text: "-",
    textSize: "40px",
    textX: game.tileWidth / 2 - 8,
    textY: game.tileHeight / 2 - 24,
    textColor: 'white',
    click: function() {
      if (Math.seed > 1) {
        Math.seed--;
        menu.levelLabel.text.text = Math.seed;
        return stage.update();
      }
    }
  },
  levelLabel: {
    x: Math.floor(game.size / 2) * game.tileWidth,
    y: (Math.floor(game.size / 2) - 1) * game.tileHeight,
    width: game.tileWidth,
    height: game.tileHeight,
    color: 'white',
    text: Math.seed,
    textSize: "24px",
    textAlign: "center",
    textX: game.tileWidth / 2,
    textY: game.tileHeight / 2 - 15,
    textColor: 'black'
  },
  startBtn: {
    name: 'startBtn',
    x: (Math.floor(game.size / 2) - 1) * game.tileWidth,
    y: (Math.floor(game.size / 2) + 1) * game.tileHeight,
    width: game.tileWidth * 3,
    height: game.tileHeight,
    color: 'purple',
    text: "Start Game",
    textSize: "24px",
    textX: game.tileWidth / 2 - 12,
    textY: game.tileHeight / 2 - 15,
    textColor: 'white',
    click: function() {
      return drawGame(Math.seed);
    }
  }
};
