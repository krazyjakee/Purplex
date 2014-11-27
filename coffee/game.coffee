stage = new createjs.Stage "canvas"
stage.fillStyle = "#000"
createjs.Ticker.addEventListener "tick", stage
stage.enableMouseOver()

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
  selectedTile: false
  selectedContainer: new createjs.Container()
  followersContainer: new createjs.Container()
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
  tileClick: (e) ->
    tileId = e.currentTarget.tileId
    game.selectedTile = tileId
    if tileId % 14 and tileId % 12
      point = utilities.numberToRotationCoord tileId
      others = (utilities.getRotation(i, point) for i in [4..1])
      for selected, index in game.selectedContainer.children
        point = utilities.numberToCoord others[index]
        selected.tileId = others[index]
        point.x *= game.tileWidth
        point.y *= game.tileHeight
        
        selected.x = point.x + (game.tileWidth / 2)
        selected.y = point.y + (game.tileHeight / 2)

        if others[index] is tileId
          color = 'black'
        else
          color = game.getTile(others[index]).color
        selected.graphics.clear().beginFill(color).drawRect 0, 0, 18, 18

  tileHover: (e) ->
    tileId = e.currentTarget.tileId
    if tileId % 14 and tileId % 12
      point = utilities.numberToRotationCoord tileId
      others = (utilities.getRotation(i, point) for i in [4..1])
      for follower, index in game.followersContainer.children
        point = utilities.numberToCoord others[index]
        point.x *= game.tileWidth
        point.y *= game.tileHeight
        createjs.Tween.removeTweens follower
        createjs.Tween.get follower
        .to { x: point.x + (game.tileWidth / 2), y: point.y + (game.tileHeight / 2) }, 200

  getSelectedTile: -> return game.tileContainer.children[game.selectedTile]
  getTile: (tileId) -> return game.tileContainer.children[tileId]

draw = 
  tile: (tileId, color = false) ->
    coord = utilities.numberToCoord tileId
    x = (coord.x * game.tileWidth)
    y = (coord.y * game.tileHeight)

    tile = new createjs.Container()
    tile.x = x
    tile.y = y
    tile.width = game.tileWidth
    tile.height = game.tileHeight

    shape = new createjs.Shape()
    if tileId % 14 and tileId % 12
      shape.graphics.beginFill(color).drawCircle (game.tileWidth / 2), (game.tileHeight / 2), 10
      shape.scaleX = 0.0
      shape.scaleY = 0.0
      shape.x = (game.tileWidth / 2)
      shape.y = (game.tileHeight / 2)
    else
      shape.graphics.beginFill("purple").drawRect 0, 0, game.tileWidth, game.tileHeight

    filler = new createjs.Shape()
    filler.graphics.beginFill('rgba(255,255,255,0.01)').drawRect 0, 0, game.tileWidth, game.tileHeight

    tile.tileId = tileId
    tile.color = color
    tile.addChild shape, filler
    tile.addEventListener 'click', game.tileClick
    tile.addEventListener 'rollover', game.tileHover

    game.tileContainer.addChild tile

  newGame: (gameId) ->
    stage.removeAllChildren()
    game.tileContainer = new createjs.Container()
    Math.seed = gameId
    draw.tile i, utilities.randomColor() for i in [0...169]
    draw.followers()
    draw.selected()

  followers: ->
    for i in [0..4]
      shape = new createjs.Shape()
      shape.graphics.beginFill('black').drawCircle 0, 0, 11
      shape.x = (game.tileWidth * 6) + (game.tileWidth / 2)
      shape.y = (game.tileHeight * 6) + (game.tileHeight / 2)
      game.followersContainer.addChild shape
    stage.addChild game.followersContainer

  selected: ->
    for i in [0...4]
      shape = new createjs.Shape()
      shape.graphics.beginFill('black').drawRect 0, 0, 18, 18
      shape.x = (game.tileWidth * 6) + (game.tileWidth / 2)
      shape.y = (game.tileHeight * 6) + (game.tileHeight / 2)
      shape.regX = 9
      shape.regY = 9
      createjs.Tween.get shape, { loop: true }
      .to { rotation: 360 }, 5000
      game.selectedContainer.addChild shape
    stage.addChild game.selectedContainer

  beginScale: ->
    for tile, tileId in game.tileContainer.children when tileId % 14 and tileId % 12
      createjs.Tween.get tile.children[0]
      .wait tileId * 5
      .to { x: 0, y: 0, scaleX: 1.0, scaleY: 1.0 }, 500

  clear: ->
    stage.removeAllChildren()
    for i in [0...169]
      draw.tile(i) unless i % 14 and i % 12
    game.tileContainer.filters = [game.grayscale]
    game.tileContainer.cache 0, 0, (13 * game.tileWidth), (13 * game.tileHeight)
  
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

  numberToRotationCoord: (num) ->
    y = 0
    while num >= 13
      num -= 13
      y++
    { x: num - 6, y: y - 6 }

  getRotation: (num, point) ->
    midCell = Math.floor(169 / 2)
    switch num
      when 1 then return midCell + 13 * (point.y) + point.x
      when 2 then return midCell + 13 * point.x - (point.y)
      when 3 then return midCell - 13 * (point.y) - point.x
      when 4 then return midCell - 13 * point.x + (point.y)

  randomColor: ->
    colors = ['#FF0000', '#FFFF00', '#0066FF', '#009933', '#9900CC', '#FF9933']
    colors[Math.randomSeed(0, colors.length + 1)]
