var purplexConfig = {
  enabled: false,
  level: 1,
  size: 9,
  tileWidth: 112,
  tileHeight: 85,
  selectedTile: false,

  grayscale: function(){
    var cmf = new PIXI.ColorMatrixFilter();
    cmf.filter = [0.30, 0.30, 0.30, 0, 0, 0.30, 0.30, 0.30, 0, 0, 0.30, 0.30, 0.30, 0, 0, 0, 0, 0, 1, 0];
  },

  sepia: function(){
    var cmd = new PIXI.ColorMatrixFilter();
    cmd.filter = [0.39, 0.77, 0.19, 0, 0, 0.35, 0.68, 0.17, 0, 0, 0.27, 0.53, 0.13, 0, 0, 0, 0, 0, 1, 0];
  },

  sfx: ['Coin01', 'Downer01', 'FX01', 'Rise01', 'Rise02', 'Rise03', 'Upper01']
}

purplexConfig.menuObj = {
  logo: {
    name: 'logo',
    x: (Math.floor(purplexConfig.size / 2) - 1) * purplexConfig.tileWidth,
    y: 0,
    width: 3 * purplexConfig.tileWidth,
    height: purplexConfig.tileHeight,
    color: 0xFFFFFF,
    text: "PurpleX",
    textSize: purplexConfig.tileHeight + "px",
    textX: 20,
    textY: 3,
    textColor: 0x4B0082
  },
  selectLevel: {
    name: 'selectLevel',
    x: (Math.floor(purplexConfig.size / 2) - 1) * purplexConfig.tileWidth,
    y: 2 * purplexConfig.tileHeight,
    width: 2 * purplexConfig.tileWidth,
    height: purplexConfig.tileHeight / 2,
    color: 0xFFFFFF,
    text: "Select a level",
    textSize: "38px",
    textX: purplexConfig.tileWidth / 2,
    textY: 3,
    textColor: 0x4B0082
  },
  plusBtn: {
    name: 'plusBtn',
    x: (Math.floor(purplexConfig.size / 2) + 1) * purplexConfig.tileWidth,
    y: (Math.floor(purplexConfig.size / 2) - 1) * purplexConfig.tileHeight,
    width: purplexConfig.tileWidth,
    height: purplexConfig.tileHeight,
    color: 0x4B0082,
    text: "+",
    textSize: "40px",
    textX: purplexConfig.tileWidth / 2 - 12,
    textY: purplexConfig.tileHeight / 2 - 18,
    textColor: 0xFFFFFF,
    click: function() {
      if (Math.seed < 99) {
        Math.seed++;
        game.menu.collection['level-label'].children[0].setText(Math.seed);
        purplexConfig.level = Math.seed;
        // score.setBest();
      }
    }
  },
  minusBtn: {
    name: 'minusBtn',
    x: (Math.floor(purplexConfig.size / 2) - 1) * purplexConfig.tileWidth,
    y: (Math.floor(purplexConfig.size / 2) - 1) * purplexConfig.tileHeight,
    width: purplexConfig.tileWidth,
    height: purplexConfig.tileHeight,
    color: 0x4B0082,
    text: "-",
    textSize: "40px",
    textX: purplexConfig.tileWidth / 2 - 8,
    textY: purplexConfig.tileHeight / 2 - 24,
    textColor: 0xFFFFFF,
    click: function() {
      if (Math.seed > 1) {
        Math.seed--;
        $('level-label')[0].text = Math.seed;
        purplexConfig.level = Math.seed;
        score.setBest();
      }
    }
  },
  levelLabel: {
    name: 'level-label',
    x: Math.floor(purplexConfig.size / 2) * purplexConfig.tileWidth,
    y: (Math.floor(purplexConfig.size / 2) - 1) * purplexConfig.tileHeight,
    width: purplexConfig.tileWidth,
    height: purplexConfig.tileHeight,
    color: 0xFFFFFF,
    text: 1,
    textSize: "24px",
    textAlign: "center",
    textX: purplexConfig.tileWidth / 2,
    textY: purplexConfig.tileHeight / 2 - 15
  },
  startBtn: {
    name: 'startBtn',
    x: (Math.floor(purplexConfig.size / 2) - 1) * purplexConfig.tileWidth,
    y: (Math.floor(purplexConfig.size / 2) + 1) * purplexConfig.tileHeight,
    width: purplexConfig.tileWidth * 3,
    height: purplexConfig.tileHeight,
    color: 0x4B0082,
    text: "Start Game",
    textSize: "24px",
    textAlign: "center",
    textX: (purplexConfig.tileWidth * 2) / 2 - 12,
    textY: purplexConfig.tileHeight / 2 - 13,
    textColor: 0xFFFFFF,
    click: function() {
      purplexConfig.level = Math.seed;
    }
  },
  tutorialBtn: {
    name: 'tutorialBtn',
    x: (Math.floor(purplexConfig.size / 2) - 1) * purplexConfig.tileWidth,
    y: (Math.floor(purplexConfig.size / 2) + 3) * purplexConfig.tileHeight,
    width: purplexConfig.tileWidth * 3,
    height: purplexConfig.tileHeight,
    color: 0x4B0082,
    text: "Tutorial",
    textSize: "24px",
    textX: (purplexConfig.tileWidth * 2) / 2 + 10,
    textY: purplexConfig.tileHeight / 2 - 15,
    textColor: 0xFFFFFF,
    click: function() {
      tutorialNext();
    }
  },
  spacer: {
    x: (Math.floor(purplexConfig.size / 2) - 1) * purplexConfig.tileWidth,
    y: Math.floor(purplexConfig.size / 2) * purplexConfig.tileHeight,
    width: 3 * purplexConfig.tileWidth,
    height: purplexConfig.tileHeight,
    color: 0xFFFFFF
  }
}

purplexConfig.endGameMenu = {
  retryButton: {
    name: 'retry-button',
    x: purplexConfig.tileWidth,
    y: Math.floor(purplexConfig.size / 2) * purplexConfig.tileHeight,
    width: 3 * purplexConfig.tileWidth,
    height: purplexConfig.tileHeight,
    color: 0x4B0082,
    text: 'Retry',
    textColor: 0xFFFFFF,
    textSize: "24px",
    textX: purplexConfig.tileWidth - 2,
    textY: 4,
    click: function() {
      Math.seed = purplexConfig.level;
      drawGame();
    }
  },
  exitButton: {
    name: 'exit-button',
    x: Math.round(purplexConfig.size / 2) * purplexConfig.tileWidth,
    y: Math.floor(purplexConfig.size / 2) * purplexConfig.tileHeight,
    width: 3 * purplexConfig.tileWidth,
    height: purplexConfig.tileHeight,
    color: 0x4B0082,
    text: 'Exit',
    textColor: 0xFFFFFF,
    textSize: "24px",
    textX: purplexConfig.tileWidth + 2,
    textY: 4,
    click: function() {
      Math.seed = purplexConfig.level;
      drawMenu();
    }
  }
};
