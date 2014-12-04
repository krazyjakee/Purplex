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
    colors = ['#FF0000', '#FFFF00', '#0066FF', '#009933', '#FF9933']
    colors[Math.randomSeed(0, colors.length + 1)]

for i in [0...169]
  coord = utilities.numberToCoord i
  tile = $.create.rectangle
    name: "tile#{i}"
    width: game.tileWidth
    height: game.tileHeight
    x: coord.x * game.tileWidth
    y: coord.y * game.tileHeight
    color: 'red'
  $('tileContainer')[0].addChild tile

console.log $('tileContainer')
