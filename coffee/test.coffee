Array::unique = ->
  u = {}
  a = []
  i = 0
  l = @length

  while i < l
    if u.hasOwnProperty(this[i])
      ++i
      continue
    a.push this[i]
    u[this[i]] = 1
    ++i
  a

Math.seed = 1
Math.randomSeed = (max, min) ->
  max = max || 1
  min = min || 0
  Math.seed = (Math.seed * 9301 + 49297) % 233280
  rnd = Math.seed / 233280
  Math.floor(min + rnd * (max - min)) - 1

window.game =
  enabled: false
  level: 1
  size: 7
  tileWidth: 50
  tileHeight: 35
  selectedTile: false
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

utilities = 
  numberToCoord: (num) ->
    y = 0
    while num >= game.size
      num -= game.size
      y++
    { x: num, y: y }

  numberToRotationCoord: (num) ->
    y = 0
    while num >= game.size
      num -= game.size
      y++
    { x: num - ((game.size - 1) / 2), y: y - ((game.size - 1) / 2) }

  getRotation: (num, point) ->
    midCell = Math.floor((game.size * game.size) / 2)
    switch num
      when 1 then return midCell + game.size * (point.y) + point.x
      when 2 then return midCell + game.size * point.x - (point.y)
      when 3 then return midCell - game.size * (point.y) - point.x
      when 4 then return midCell - game.size * point.x + (point.y)

  randomColor: ->
    colors = ['#FF0000', 'purple', '#0066FF', '#009933', '#FF9933']
    colors[Math.randomSeed(0, colors.length + 1)]

hoverIn = (tileId) ->
  tc = $(game.tileContainer)[0]
  point = utilities.numberToRotationCoord tileId
  others = (utilities.getRotation(i, point) for i in [4..1])
  for i in others
    $(tc.children[i].children[0]).animate { x: -(game.tileWidth / 4), y: -(game.tileHeight / 4), scaleX: 1.5, scaleY: 1.5 }, 0, 125

  $(tc.children[tileId].children[0]).animate { x: -(game.tileWidth / 2), y: -(game.tileHeight / 2), scaleX: 2.0, scaleY: 2.0 }, 0, 125

hoverOut = (tileId) ->
  tc = $(game.tileContainer)[0]
  point = utilities.numberToRotationCoord tileId
  others = (utilities.getRotation(i, point) for i in [4..1])
  for i in others
    $(tc.children[i].children[0]).animate { x: 0, y: 0, scaleX: 1, scaleY: 1 }, 0, 125

changeColor = (tile, newColor = false) ->
  newColor = utilities.randomColor() unless newColor
  $(tile.children[0]).animate { x: (game.tileWidth / 2), y: (game.tileHeight / 2), scaleX: 0, scaleY: 0 }, 0, 125, 'linear', ->
    $.changeColor @, newColor, (game.tileWidth / 2), (game.tileHeight / 2)
    $(@).animate { x: 0, y: 0, scaleX: 1, scaleY: 1 }, 0, 125, 'linear', ->
      detectSameTiles tile.tileId

swapAnimation = (source, destination, color = false) ->
  if color
    color1 = source.children[0].color
    color2 = destination.children[0].color
  else
    color1 = utilities.randomColor()
    color2 = utilities.randomColor()
  
  sourcePrevious =
    x: source.x
    y: source.y
  destinationPrevious =
    x: destination.x
    y: destination.y

  $(source).animate { x: destination.x, y: destination.y }, 0, 125, 'linear', ->
    source.x = sourcePrevious.x
    source.y = sourcePrevious.y
    $.changeColor @children[0], color2, (game.tileWidth / 2), (game.tileHeight / 2)

  $(destination).animate { x: source.x, y: source.y }, 0, 125, 'linear', ->
    destination.x = destinationPrevious.x
    destination.y = destinationPrevious.y
    $.changeColor @children[0], color1, (game.tileWidth / 2), (game.tileHeight / 2)

  setTimeout ->
    hoverOut source.tileId
    detectSameTiles source.tileId
    detectSameTiles destination.tileId
  , 150

swap = (source, destination) ->
  point = utilities.numberToRotationCoord source.tileId
  others = (utilities.getRotation(i, point) for i in [4..1])
  p = (p for p in others when p is destination.tileId)
  if p.length
    if source.children[0].color is destination.children[0].color and source.tileId != destination.tileId
      swapAnimation source, destination
      # score.add 5
    else
      swapAnimation source, destination, true
  else
    game.selectedTile = tileId

click = (e) ->
  tileId = e.currentTarget.tileId
  if game.selectedTile
    point = utilities.numberToRotationCoord tileId
    others = (utilities.getRotation(i, point) for i in [4..1])
    swapped = false
    for i in others
      if i is game.selectedTile
        swapped = true
        swap game.tileContainer.children[i], e.currentTarget
        hoverOut i
    hoverIn game.selectedTile
    hoverOut game.selectedTile unless swapped
    game.selectedTile = false
  else
    hoverIn tileId
    game.selectedTile = e.currentTarget.tileId

getHoriLine = (index) ->
  i = index
  i-- if (i - 1) % game.size
  i-- while (i + 1) % game.size and i % (game.size + 1) and i % (game.size - 1)
  left = i
  i = index
  i++ while i % (game.size + 1) and i % (game.size - 1) and (i + 1) % game.size
  hori = []
  while left < i
    left++
    hori.push(left) if left % (game.size + 1) and left % (game.size - 1)
  hori

getVertLine = (index) ->
  i = index
  i -= game.size while i % (game.size + 1) and i % (game.size - 1) and i > (game.size - 1)
  top = i
  top -= game.size if top < (game.size * 2)
  i = index
  i += game.size while i % (game.size + 1) and i % (game.size - 1) and i < (game.size * (game.size - 1))
  vert = []
  while top < i
    top += game.size
    vert.push(top) if top % (game.size + 1) and top % (game.size - 1)
  vert

detectSameTiles = (tileId) ->
  vert = []
  hori = []
  tc = $(game.tileContainer)[0]
  vertIndex = getVertLine tileId
  horiIndex = getHoriLine tileId
  for v in vertIndex
    v = tc.children[v].children[0].color # get colors
    vert.push v if v
  for h in horiIndex
    h = tc.children[h].children[0].color
    hori.push h if h

  if vertIndex.length > 1
    if vert.unique().length is 1
      changeColor(tc.children[i]) for i in vertIndex
      #@score.add vertIndex.length * 10
  if horiIndex.length > 1
    if hori.unique().length is 1
      changeColor(tc.children[i]) for i in horiIndex
      #@score.add horiIndex.length * 10

drawGame = ->
  stage.removeAllChildren()
  game.selectedContainer = $.create.container 'selectedContainer'
  game.followersContainer = $.create.container 'followersContainer'
  game.tileContainer = $.create.container 'tileContainer'
  tc = $(game.tileContainer)
  for i in [0...(game.size * game.size)]
    if i % (game.size + 1) and i % (game.size - 1)
      coord = utilities.numberToCoord i
      tile = $.create.container "tile#{i}"
      tile.x = coord.x * game.tileWidth
      tile.y = coord.y * game.tileHeight
      tile.tileId = i

      filler = $.create.rectangle
        name: "tile#{i}-filler"
        width: game.tileWidth
        height: game.tileHeight
        color: 'rgba(255,255,255,0.01)'
        x: 0
        y: 0

      circle = $.create.circle
        name: "tile#{i}-circle"
        radius: 10
        x: (game.tileWidth / 2)
        y: (game.tileHeight / 2)
        scaleX: 0
        scaleY: 0
        color: utilities.randomColor()

      tile.addChild circle, filler
      tile.addEventListener 'click', click

    else
      tile = $.create.container "tile#{i}"
    tc.addChild tile

  for tile, index in tc[0].children
    if tile.children
      $(tile.children[0]).animate { x: 0, y: 0, scaleX: 1.0, scaleY: 1.0 }, index * 10, 1000

drawButton = (obj) ->
  buttonContainer = new createjs.Container()
  button = new createjs.Shape()
  text = new createjs.Text(obj.text, "#{obj.textSize} Arial", obj.textColor)
  buttonContainer.x = obj.x
  buttonContainer.y = obj.y
  text.x = obj.textX
  text.y = obj.textY
  text.textAlign = obj.textAlign if obj.textAlign
  button.graphics.beginFill(obj.color).drawRect 0, 0, obj.width, obj.height
  button.addEventListener('click', obj.click) if obj.click
  buttonContainer.addChild button, text
  return {
    container: buttonContainer
    text: text
    button: button
  }

menu = {}
drawMenu = ->
  stage.removeAllChildren()
  menu.levelLabel = drawButton menuObj.levelLabel
  menu.plusBtn = drawButton menuObj.plusBtn
  menu.minusBtn = drawButton menuObj.minusBtn
  menu.startBtn = drawButton menuObj.startBtn
  stage.addChild menu.levelLabel.container, menu.plusBtn.container, menu.minusBtn.container, menu.startBtn.container

window.onload = drawMenu

document.getElementById('canvas').setAttribute('width', (game.size * game.tileWidth) + 5)
document.getElementById('canvas').setAttribute('height', (game.size * game.tileHeight) + 10)
