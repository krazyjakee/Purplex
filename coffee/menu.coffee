menuObj =
  logo:
    name: 'logo'
    x: (Math.floor(game.size / 2) - 1) * game.tileWidth
    y: 0
    width: 3 * game.tileWidth
    height: game.tileHeight
    color: 'white'
    text: "PurpleX"
    textSize: "40px"
    textX: 4
    textY: 3
    textColor: 'purple'
  selectLevel:
    name: 'selectLevel'
    x: (Math.floor(game.size / 2) - 1) * game.tileWidth
    y: 2 * game.tileHeight
    width: 2 * game.tileWidth
    height: game.tileHeight / 2
    color: 'white'
    text: "Select a level"
    textSize: "18px"
    textX: 20
    textY: 3
    textColor: 'purple'
  plusBtn:
    name: 'plusBtn'
    x: (Math.floor(game.size / 2) + 1) * game.tileWidth
    y: (Math.floor(game.size / 2) - 1) * game.tileHeight
    width: game.tileWidth
    height: game.tileHeight
    color: 'purple'
    text: "+"
    textSize: "40px"
    textX: game.tileWidth / 2 - 12
    textY: game.tileHeight / 2 - 22
    textColor: 'white'
    click: ->
      if Math.seed < 99
        Math.seed++
        $('level-label')[0].text = Math.seed
        game.level = Math.seed
        score.setBest()
  minusBtn:
    name: 'minusBtn'
    x: (Math.floor(game.size / 2) - 1) * game.tileWidth
    y: (Math.floor(game.size / 2) - 1) * game.tileHeight
    width: game.tileWidth
    height: game.tileHeight
    color: 'purple'
    text: "-"
    textSize: "40px"
    textX: game.tileWidth / 2 - 8
    textY: game.tileHeight / 2 - 24
    textColor: 'white'
    click: ->
      if Math.seed > 1
        Math.seed--
        $('level-label')[0].text = Math.seed
        game.level = Math.seed
        score.setBest()
  levelLabel:
    name: 'level-label'
    x: Math.floor(game.size / 2) * game.tileWidth
    y: (Math.floor(game.size / 2) - 1) * game.tileHeight
    width: game.tileWidth
    height: game.tileHeight
    color: 'white'
    text: 1
    textSize: "24px"
    textAlign: "center"
    textX: game.tileWidth / 2
    textY: game.tileHeight / 2 - 15
  startBtn:
    name: 'startBtn'
    x: (Math.floor(game.size / 2) - 1) * game.tileWidth
    y: (Math.floor(game.size / 2) + 1) * game.tileHeight
    width: game.tileWidth * 3
    height: game.tileHeight
    color: 'purple'
    text: "Start Game"
    textSize: "24px"
    textX: game.tileWidth / 2 - 12
    textY: game.tileHeight / 2 - 15
    textColor: 'white'
    click: ->
      game.level = Math.seed
      drawGame()
  spacer:
    x: (Math.floor(game.size / 2) - 1) * game.tileWidth
    y: Math.floor(game.size / 2) * game.tileHeight
    width: 3 * game.tileWidth
    height: game.tileHeight
    color: 'white'

endGameMenu =
  retryButton:
    name: 'retry-button'
    x: game.tileWidth
    y: Math.floor(game.size / 2) * game.tileHeight
    width: 3 * game.tileWidth
    height: game.tileHeight
    color: 'purple'
    text: 'Retry'
    textColor: 'white'
    textSize: "24px"
    textX: game.tileWidth - 2
    textY: 4
    click: ->
      Math.seed = game.level
      drawGame()
  exitButton:
    name: 'exit-button'
    x: Math.round(game.size / 2) * game.tileWidth
    y: Math.floor(game.size / 2) * game.tileHeight
    width: 3 * game.tileWidth
    height: game.tileHeight
    color: 'purple'
    text: 'Exit'
    textColor: 'white'
    textSize: "24px"
    textX: game.tileWidth + 2
    textY: 4
    click: ->
      Math.seed = game.level
      drawMenu()
