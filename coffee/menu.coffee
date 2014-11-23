menuObj =
  plusBtn:
    x: (7 * game.tileWidth)
    y: (5 * game.tileHeight)
    width: game.tileWidth
    height: game.tileHeight
    backgroundColor: 'purple'
    text: "+"
    textSize: "40px"
    textX: game.tileWidth / 2 - 12
    textY: game.tileHeight / 2 - 22
    color: 'white'
    click: ->
      if Math.seed < 99
        Math.seed++
        menu.levelLabel.text.text = Math.seed
        stage.update()
  minusBtn:
    x: (5 * game.tileWidth)
    y: (5 * game.tileHeight)
    width: game.tileWidth
    height: game.tileHeight
    backgroundColor: 'purple'
    text: "-"
    textSize: "40px"
    textX: game.tileWidth / 2 - 8
    textY: game.tileHeight / 2 - 24
    color: 'white'
    click: ->
      if Math.seed > 1
        Math.seed--
        menu.levelLabel.text.text = Math.seed
        stage.update()
  levelLabel:
    x: (6 * game.tileWidth)
    y: (5 * game.tileHeight)
    width: game.tileWidth
    height: game.tileHeight
    backgroundColor: 'white'
    text: Math.seed
    textSize: "24px"
    textAlign: "center"
    textX: game.tileWidth / 2
    textY: game.tileHeight / 2 - 15
    color: 'black'
  startBtn:
    x: 5 * game.tileWidth
    y: 7 * game.tileHeight
    width: game.tileWidth * 3
    height: game.tileHeight
    backgroundColor: 'purple'
    text: "Start Game"
    textSize: "24px"
    textX: game.tileWidth / 2 - 12
    textY: game.tileHeight / 2 - 15
    color: 'white'
    click: ->
      draw.newGame Math.seed
      stage.addChild game.tileContainer
      draw.beginScale()

menu = {}
