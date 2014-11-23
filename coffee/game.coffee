stage = new createjs.Stage "canvas"
stage.fillStyle = "#000"
createjs.Ticker.addEventListener "tick", stage

Math.seed = 1
Math.randomSeed = (max, min) ->
  max = max || 1
  min = min || 0
  Math.seed = (Math.seed * 9301 + 49297) % 233280
  rnd = Math.seed / 233280
  Math.floor(min + rnd * (max - min)) - 1

game =
  enabled: false
  level: 1
  tileWidth: 50
  tileHeight: 35
  tileContainer: new createjs.Container()
  grayscale: new createjs.ColorMatrixFilter([
    0.30,0.30,0.30,0,0,
    0.30,0.30,0.30,0,0,
    0.30,0.30,0.30,0,0,
    0,0,0,1,0
  ])
  sepia: new createjs.ColorMatrixFilter([
    0.39, 0.77, 0.19, 0, 0,
    0.35, 0.68, 0.17, 0, 0,
    0.27, 0.53, 0.13, 0, 0,
    0, 0, 0, 1, 0
  ])

draw = 
  tile: (tileId, color = false) ->
    tile = new createjs.Container()
    shape = new createjs.Shape()
    coord = utilities.numberToCoord tileId
    x = (coord.x * game.tileWidth)
    y = (coord.y * game.tileHeight)
    if tileId % 14 and tileId % 12
      shape.graphics.beginFill(color).drawCircle (game.tileWidth / 2), (game.tileHeight / 2), 10
      shape.scaleX = 0.0
      shape.scaleY = 0.0
      shape.x = x + (game.tileWidth / 2)
      shape.y = y + (game.tileHeight / 2)
    else
      shape.graphics.beginFill("purple").drawRect x, y, game.tileWidth, game.tileHeight
    tile.addChild shape
    game.tileContainer.addChild tile

  game: (gameId) ->
    stage.removeAllChildren()
    game.tileContainer = new createjs.Container()
    Math.seed = gameId
    for i in [0...169]
      draw.tile i, utilities.randomColor()

  beginScale: ->
    for tile, tileId in game.tileContainer.children
      if tileId % 14 and tileId % 12
        coord = utilities.numberToCoord tileId
        x = (coord.x * game.tileWidth)
        y = (coord.y * game.tileHeight)
        createjs.Tween.get tile.children[0]
        .wait tileId * 5
        .to { x: x, y: y, scaleX: 1.0, scaleY: 1.0 }, 500

  clear: ->
    stage.removeAllChildren()
    for i in [0...169]
      draw.tile(i) unless i % 14 and i % 12
    game.tileContainer.filters = [game.grayscale]
    game.tileContainer.cache(0,0,(13 * game.tileWidth),(13 * game.tileHeight))
  
  menu: ->
    menu.levelLabel = draw.button menuObj.levelLabel
    menu.plusBtn = draw.button menuObj.plusBtn
    menu.minusBtn = draw.button menuObj.minusBtn
    menu.startBtn = draw.button menuObj.startBtn
    stage.addChild menu.levelLabel.container, menu.plusBtn.container, menu.minusBtn.container, menu.startBtn.container
  
  button: (obj) ->
    buttonContainer = new createjs.Container()
    button = new createjs.Shape()
    text = new createjs.Text(obj.text, "#{obj.textSize} Arial", obj.color)
    buttonContainer.x = obj.x
    buttonContainer.y = obj.y
    text.x = obj.textX
    text.y = obj.textY
    text.textAlign = obj.textAlign if obj.textAlign
    button.graphics.beginFill(obj.backgroundColor).drawRect 0, 0, obj.width, obj.height
    button.addEventListener('click', obj.click) if obj.click
    buttonContainer.addChild button, text
    return {
      container: buttonContainer
      text: text
      button: button
    }

utilities = 
  numberToCoord: (num) ->
    y = 0
    while num >= 13
      num -= 13
      y++
    { x: num, y: y }
    #return { x: num - 6, y: y - 6 }

  randomColor: ->
    colors = ['red', 'yellow', 'blue', 'green', 'purple', 'orange']
    colors[Math.randomSeed(0, colors.length + 1)]
