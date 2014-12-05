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
  selectedContainer: $.create.container 'selectedContainer'
  followersContainer: $.create.container 'followersContainer'
  tileContainer: $.create.container 'tileContainer'
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
    colors = ['#FF0000', 'purple', '#0066FF', '#009933', '#FF9933']
    colors[Math.randomSeed(0, colors.length + 1)]

tileSelected = false

hoverIn = (e) ->
  unless tileSelected
    tc = $(game.tileContainer)[0]
    point = utilities.numberToRotationCoord e.currentTarget.tileId
    others = (utilities.getRotation(i, point) for i in [4..1])
    for i in others
      $(tc.children[i].children[0]).animate { x: -(game.tileWidth / 4), y: -(game.tileHeight / 4), scaleX: 1.5, scaleY: 1.5 }, 0, 250

    $(e.currentTarget.children[0]).animate { x: -(game.tileWidth / 2), y: -(game.tileHeight / 2), scaleX: 2.0, scaleY: 2.0 }, 0, 250
  
hoverOut = (e) ->
  unless tileSelected
    tc = $(game.tileContainer)[0]
    point = utilities.numberToRotationCoord e.currentTarget.tileId
    others = (utilities.getRotation(i, point) for i in [4..1])
    for i in others
      $(tc.children[i].children[0]).animate { x: 0, y: 0, scaleX: 1, scaleY: 1 }, 0, 250

swapAnimation = (source, destination, color = false) ->
  newX = destination.x - source.x
  newY = destination.y - source.y
  color = utilities.randomColor() unless color
  # fix
  $.changeColor destination.children[0], color
  console.log source.x
  $(source.children[0]).animate { x: newX, y: newY, scaleX: 1, scaleY: 1 }, 0, 250, 'linear', ->
    @x = 0
    @y = 0
  # fix

swap = (source, destination) ->
  point = utilities.numberToRotationCoord source.tileId
  others = (utilities.getRotation(i, point) for i in [4..1])
  p = (p for p in others when p is destination.tileId)
  if p.length
    if source.children[0].color is destination.children[0].color and source.tileId != destination.tileId
      swapAnimation source, destination
      swapAnimation destination, source
      # score.add 5
    else
      swapAnimation source, destination, source.children[0].color
      swapAnimation destination, source, destination.children[0].color
  else
    game.selectedTile = tileId

click = (e) ->
  if tileSelected
    point = utilities.numberToRotationCoord e.currentTarget.tileId
    others = (utilities.getRotation(i, point) for i in [4..1])
    for i in others
      if i is tileSelected
        swap game.tileContainer.children[tileSelected], e.currentTarget
    tileSelected = false
  else
    tileSelected = e.currentTarget.tileId

drawGame = (gameNumber) ->
  Math.seed = gameNumber
  tc = $(game.tileContainer)
  for i in [0...169]
    if i % 14 and i % 12
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
      tile.addEventListener 'rollover', hoverIn
      tile.addEventListener 'rollout', hoverOut
      tile.addEventListener 'click', click

    else
      tile = $.create.container "tile#{i}"
    tc.addChild tile

  for tile, index in tc[0].children
    if tile.children
      $(tile.children[0]).animate { x: 0, y: 0, scaleX: 1.0, scaleY: 1.0 }, index * 10, 1000

drawGame(0)
