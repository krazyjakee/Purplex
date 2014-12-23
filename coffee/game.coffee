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

window.log = []
addLog = (from, to) ->
  log.push
    time: timer.current
    from: from
    to: to

window.game =
  enabled: false
  level: 1
  size: 9
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
  sfx: ['Coin01', 'Downer01', 'FX01', 'Rise01', 'Rise02', 'Rise03', 'Upper01']

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
    colors = ['#e60000', 'purple', '#0066FF', '#009933', '#ffa64d']
    colors[Math.randomSeed(0, colors.length + 1)]

loadSounds = ->
  for i in game.sfx
    createjs.Sound.registerSound "sfx/#{i}.ogg", i

playSound = (sound) -> createjs.Sound.play sound

loadedSounds = 0
createjs.Sound.addEventListener "fileload", ->
  loadedSounds++
  drawMenu() if loadedSounds is game.sfx.length

hoverIn = (tileId) ->
  tc = $(game.tileContainer)[0]
  point = utilities.numberToRotationCoord tileId
  others = (utilities.getRotation(i, point) for i in [4..1])
  for i in others
    $(tc.children[i].children[0]).animate { x: -(game.tileWidth / 4), y: -(game.tileHeight / 4), scaleX: 1.5, scaleY: 1.5 }, 0, 125

  $(tc.children[tileId].children[0]).animate { x: -(game.tileWidth / 4), y: -(game.tileHeight / 4), scaleX: 1.5, scaleY: 1.5 }, 0, 1000, 'linear', false, true

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
  , 200

swap = (source, destination) ->
  addLog source.tileId, destination.tileId
  point = utilities.numberToRotationCoord source.tileId
  others = (utilities.getRotation(i, point) for i in [4..1])
  p = (p for p in others when p is destination.tileId)
  if p.length
    if source.children[0].color is destination.children[0].color and source.tileId != destination.tileId
      swapAnimation source, destination
      score.add destination, 5
      playSound "Rise01"
    else
      swapAnimation source, destination, true
  else
    game.selectedTile = tileId

click = (e) ->
  if game.enabled
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
      unless swapped
        hoverOut game.selectedTile
        game.selectedTile = false
        click e
      else
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

  newScore = false
  if vertIndex.length > 1
    if vert.unique().length is 1
      changeColor(tc.children[i]) for i in vertIndex
      newScore = vertIndex.length * 10
      score.add tc.children[i], newScore
  if horiIndex.length > 1
    if hori.unique().length is 1
      changeColor(tc.children[i]) for i in horiIndex
      newScore = horiIndex.length * 10
      score.add tc.children[i], newScore
  
  if newScore > 5
    if newScore < 20
      playSound "Rise02"
    else if newScore <= 40
      playSound "Coin01"
    else if newScore > 40
      playSound "Rise03"



score =
  setup: ->
    score.labels.current = $('score')[0]
    score.labels.last = $('last-score')[0]
    score.labels.best = $('best-score')[0]
  labels:
    current: false
    last: false
    best: false
  current: 0
  add: (sender, input) ->
    drawScoreGhost sender, input
    score.current = score.current + input
    score.labels.current.text = "Score: " + score.current
    addedTime = Math.round input / 10
    newTime = timer.current + addedTime
    if newTime > timer.total then timer.current = timer.total else timer.current = newTime
  setBest: ->
    window.localStorage['best'+game.level] = 0 unless window.localStorage['best'+game.level]?
    window.localStorage['last'+game.level] = 0 unless window.localStorage['last'+game.level]?
    score.labels.last.text = "Last: " + window.localStorage['last'+game.level]
    score.labels.best.text = "Best: " + window.localStorage['best'+game.level]

timer =
  timer: false
  current: false
  total: (2.5 * 60)
  start: ->
    game.enabled = true
    score.current = 0
    log = []
    $('quit')[0].text = "Stop"
    timer.current = timer.total
    game.tileContainer.filters = []

    wc = $('white-cover')
    timer.timer = setInterval ->
      timer.current -= 1
      minutes = Math.floor(timer.current / 60)
      minutes = ('0' + minutes).slice(-2)
      seconds = timer.current - (60 * minutes)
      seconds = ('0' + seconds).slice(-2)
      $('timer')[0].text = "#{minutes}:#{seconds}"

      percTime = (timer.current / timer.total) * 100
      percPixels = ((game.size * game.tileHeight) / 100) * (100 - percTime)
      wc.animate { y: -percPixels }, 0, 1000
      timer.stop() unless timer.current
    , 1000

  stop: ->
    playSound "Downer01"
    clearInterval timer.timer
    window.localStorage['last'+game.level] = score.current
    window.localStorage['best'+game.level] = score.current if window.localStorage['best'+game.level] < score.current
    score.setBest()
    $('tileContainer')[0].filters = [game.grayscale]
    game.tileContainer.cache 0, 0, (game.size * game.tileWidth), (game.size * game.tileHeight)
    game.enabled = false
    $('quit')[0].text = "Quit"
    score.current = 0
    $('white-cover').animate { y: 0 }, 1000, 1000
    drawEndGameMenu()


drawScoreGhost = (tile, value) ->
  count = 0
  count = game.scoreGhostContainer.children.length if game.scoreGhostContainer.children
  name = "scoreghost-#{count}"
  game.scoreGhostContainer.addChild $.create.text
    name: name
    text: "+#{value}"
    size: "14px"
    x: tile.x + (game.tileWidth / 2)
    y: tile.y + (game.tileHeight / 2)
    color: "rgba(0,0,0,0.5)"
  scoreLabel = $('score')[0]
  $(name).animate { x: scoreLabel.x + 50, y: scoreLabel.y }, 0, 1000, 'cubicIn', ->
    game.scoreGhostContainer.removeChild @

drawScore = ->
  stage.addChild $.create.text
    name: "score"
    text: "Score: 0"
    size: "18px"
    x: game.size * game.tileWidth + game.tileWidth / 4
    y: 32 + game.tileHeight

  stage.addChild $.create.text
    name: "last-score"
    text: "Last: 0"
    size: "18px"
    x: game.size * game.tileWidth + game.tileWidth / 4
    y: 54 + game.tileHeight

  stage.addChild $.create.text
    name: "best-score"
    text: "Best: 0"
    size: "18px"
    x: game.size * game.tileWidth + game.tileWidth / 4
    y: 76 + game.tileHeight

  stage.addChild drawButton
    name: 'quit'
    x: game.size * game.tileWidth + game.tileWidth / 4
    y: 0
    width: 2 * game.tileWidth
    height: game.tileHeight
    color: 'purple'
    text: "Quit"
    textSize: "24px"
    textX: 24
    textY: 3
    textColor: 'white'
    click: ->
      if game.enabled
        timer.stop()
      else
        # close application

drawTimer = ->
    
  minutes = Math.floor(timer.total / 60)
  seconds = timer.total - (60 * minutes)
  minutes = ('0' + minutes).slice(-2)
  seconds = ('0' + seconds).slice(-2)
  text = "#{minutes}:#{seconds}"

  stage.addChild $.create.text
    name: "timer"
    text: text
    size: "24px"
    x: game.size * game.tileWidth + game.tileWidth / 4
    y: 5 + game.tileHeight
  

drawPurpleX = (full = false) ->

  height = game.size * game.tileHeight
  stage.addChild $.create.rectangle
    name: 'purplex'
    x: 0
    y: 0
    width: game.size * game.tileWidth
    height: height
    color: 'purple'
    scaleX: 1
    scaleY: 1

  if full then y = -height else y = 0
  stage.addChild $.create.rectangle
    name: 'white-cover'
    x: 0
    y: y
    width: game.size * game.tileWidth
    height: height
    color: 'white'
    scaleX: 1
    scaleY: 1
  
  stage.addChild $.create.rectangle
    name: 'purplexfade'
    x: 0
    y: 0
    width: game.size * game.tileWidth
    height: height
    color: 'rgba(128,0,128,0.05)'
    scaleX: 1
    scaleY: 1

drawTriangles = ->
  triangle1 = new createjs.Shape()
  triangle2 = new createjs.Shape()
  triangle3 = new createjs.Shape()
  triangle4 = new createjs.Shape()

  triangle1.graphics.beginFill("white")
  triangle2.graphics.beginFill("white")
  triangle3.graphics.beginFill("white")
  triangle4.graphics.beginFill("white")

  s = game.size
  s2 = (game.size / 2)
  sf2 = Math.floor(game.size / 2)
  sr2 = Math.round(game.size / 2)
  tw = game.tileWidth
  tw2 = game.tileWidth / 4
  th = game.tileHeight
  th2 = game.tileHeight / 4

  # left
  triangle1.graphics.moveTo 0, th2
  .lineTo (sf2 * tw) + tw2, s2 * th
  .lineTo 0, (s * th) - th2
  .lineTo 0, th2

  # up
  triangle2.graphics.moveTo tw2, 0
  .lineTo s2 * tw, (sf2 * th) + th2
  .lineTo (s * tw) - tw2, 0 
  .lineTo tw2, 0

  # right
  triangle3.graphics.moveTo s * tw, th2
  .lineTo (sr2 * tw) - tw2, s2 * th
  .lineTo s * tw, (s * th) - th2
  .lineTo s * tw, th2

  # down
  triangle4.graphics.moveTo 0, (s * th) + th2 
  .lineTo s2 * tw, (sr2 * th) - th2
  .lineTo (s * tw), (s * th) + th2
  .lineTo 0, (s * th) + th2 

  stage.addChild triangle1, triangle2, triangle3, triangle4

drawGame = ->
  stage.removeAllChildren()
  playSound "FX01"
  drawTimer()
  drawScore()
  score.setup()
  score.setBest()
  drawPurpleX()
  drawTriangles()
  
  game.selectedContainer = $.create.container 'selectedContainer'
  game.followersContainer = $.create.container 'followersContainer'
  game.tileContainer = $.create.container 'tileContainer'
  game.scoreGhostContainer = $.create.container 'scoreGhost'
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
        color: 'rgba(255,255,255,0.1)'
        x: 0
        y: 0
        scaleX: 1
        scaleY: 1

      circle = $.create.circle
        name: "tile#{i}-circle"
        radius: 10
        x: (game.tileWidth / 2)
        y: (game.tileHeight / 2)
        scaleX: 0
        scaleY: 0
        color: utilities.randomColor()

      tile.addChild circle, filler
      tile.addEventListener 'pressup', click

    else
      tile = $.create.container "tile#{i}"
    tc.addChild tile

  for tile, index in tc[0].children
    if tile.children
      $(tile.children[0]).animate { x: 0, y: 0, scaleX: 1.0, scaleY: 1.0 }, index * 10, 1000

  setTimeout ->
    playSound "Upper01"
    timer.timer = false
    timer.start()
  , 1500

drawEndGameMenu = ->
  stage.addChild(drawButton(endGameMenu[k])) for k of endGameMenu

drawButton = (obj) ->
  buttonContainer = new createjs.Container()
  button = new createjs.Shape()
  text = new createjs.Text(obj.text, "#{obj.textSize} Arial", obj.textColor)
  text = $.create.text
    name: obj.name
    text: obj.text
    size: obj.textSize
    align: obj.textAlign
    x: obj.textX
    y: obj.textY
    color: obj.textColor

  buttonContainer.x = obj.x
  buttonContainer.y = obj.y
  button.graphics.beginFill(obj.color).drawRect 0, 0, obj.width, obj.height
  button.addEventListener('pressup', obj.click) if obj.click
  buttonContainer.addChild button, text
  return buttonContainer

drawMenu = ->
  stage.removeAllChildren()
  drawPurpleX(true)
  drawTriangles()
  drawScore()
  score.setup()
  score.setBest()

  stage.addChild(drawButton(menuObj[k])) for k of menuObj
  $('level-label')[0].text = game.level

drawLoading = ->
  loadSounds()
  stage.addChild $.create.text
    name: 'loadingLabel'
    color: 'black'
    text: 'Loading...'
    type: 'text'
    x: 10
    y: 10

window.onload = drawLoading

document.getElementById('canvas').setAttribute('width', (game.size * game.tileWidth) + (game.tileWidth * 3))
document.getElementById('canvas').setAttribute('height', (game.size * game.tileHeight) + 20)
