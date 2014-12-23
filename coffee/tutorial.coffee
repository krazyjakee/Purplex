tutorial = [
  text: "Time is ticking, the Purple X has started to fill up.\nStart earning points by destroying\ncolors on the grid..."
  setup: ->
    game.level = -1
    Math.seed = 42
    drawGame()
    setTimeout ->
      clearInterval timer.timer
      game.enabled = false
    , 1600
,
  text: "To do this, you will need to make horizontal or\nvertical lines of the same color."
,
  text: "Start by tapping the blue circle at\nthe very center bottom position..."
  hideNextBtn: true
  setup: ->
    tclick = $.create.rectangle
      name: "tutorial-click1"
      width: game.tileWidth
      height: game.tileHeight
      color: 'rgba(255,0,0,0.2)'
      x: Math.floor(game.size / 4) * game.tileWidth
      y: ((game.size / 2) - 0.5) * game.tileHeight
      scaleX: 1
      scaleY: 1
    tclick.addEventListener 'pressup', ->
      hoverIn 76
      tutorialNext()
    stage.addChild tclick
,
  text: "You can see 3 other positions get bigger.\nThese are colors you can swap with."
  setup: -> stage.removeChild $('tutorial-click1')[0]
,
  text: "There are three other yellows above the blue.\nTo make a column, you should swap\nwith the yellow on the right position."
  hideNextBtn: true
  setup: ->
    tclick = $.create.rectangle
      name: "tutorial-click2"
      width: game.tileWidth
      height: game.tileHeight
      color: 'rgba(255,0,0,0.2)'
      x: Math.floor(game.size / 2) * game.tileWidth
      y: ((game.size / 4) * game.tileHeight) - (game.tileHeight / 4)
      scaleX: 1
      scaleY: 1
    tclick.addEventListener 'pressup', ->
      swap $('tile76')[0], $('tile44')[0]
      stage.removeChild $('tutorial-click2')[0]
      setTimeout ->
        tutorialNext()
      , 1000
    stage.addChild tclick
,
  text: "You just scored 40 points, 10 points for each\ncircle that you destroyed."
,
  text: "Let's try something harder. Tap the green in\nthe second row down. There is a chance\nto make a nice long row of purples!"
  position: "bottom"
  hideNextBtn: true
  setup: ->
    Math.seed = 42
    drawGame()
    setTimeout ->
      clearInterval timer.timer
      game.enabled = false
    , 1600
    tclick = $.create.rectangle
      name: "tutorial-click3"
      width: game.tileWidth
      height: game.tileHeight
      color: 'rgba(255,0,0,0.2)'
      x: (game.size / 3.6) * game.tileWidth
      y: game.tileHeight / 2
      scaleX: 1
      scaleY: 1
    tclick.addEventListener 'pressup', ->
      hoverIn 14
      tutorialNext()
    stage.addChild tclick
,
  text: "Darn there is no purple to swap with, but that's ok!\nIf you swap a green with another\ngreen, both will become a brand new color!"
  position: "bottom"
  hideNextBtn: true
  setup: ->
    stage.removeChild $('tutorial-click3')[0]
    tclick = $.create.rectangle
      name: "tutorial-click4"
      width: game.tileWidth
      height: game.tileHeight
      color: 'rgba(255,0,0,0.2)'
      x: game.tileWidth / 2
      y: game.tileHeight * 1.5
      scaleX: 1
      scaleY: 1
    tclick.addEventListener 'pressup', ->
      stage.removeChild $('tutorial-click4')[0]
      swap $('tile14')[0], $('tile28')[0]
      setTimeout ->
        tutorialNext()
      , 1000
    stage.addChild tclick
,
  text: "Great, now we have a purple to swap with!\nClick the new purple."
  position: "bottom"
  hideNextBtn: true
  setup: ->
    tclick = $.create.rectangle
      name: "tutorial-click5"
      width: game.tileWidth
      height: game.tileHeight
      color: 'rgba(255,0,0,0.2)'
      x: game.tileWidth / 2
      y: game.tileHeight * 1.5
      scaleX: 1
      scaleY: 1
    tclick.addEventListener 'pressup', ->
      hoverIn 28
      tutorialNext()
    stage.addChild tclick
,
  text: "Let's swap back with the green and finish the row!"
  position: "bottom"
  hideNextBtn: true
  setup: ->
    stage.removeChild $('tutorial-click5')[0]
    tclick = $.create.rectangle
      name: "tutorial-click6"
      width: game.tileWidth
      height: game.tileHeight
      color: 'rgba(255,0,0,0.2)'
      x: (game.size / 3.6) * game.tileWidth
      y: game.tileHeight / 2
      scaleX: 1
      scaleY: 1
    tclick.addEventListener 'pressup', ->
      swap $('tile28')[0], $('tile14')[0]
      stage.removeChild $('tutorial-click6')[0]
      setTimeout ->
        tutorialNext()
      , 1000
    stage.addChild tclick
,
  text: "A bunch more points, awesome!\n\nThis concludes the tutorial. Go have some fun!"
  hideNextBtn: true
  setup: ->
    stage.addChild drawButton
      name: 'tutorialFinish'
      x: (Math.floor(game.size / 2) - 1) * game.tileWidth
      y: (Math.floor(game.size / 2) + 1) * game.tileHeight
      width: game.tileWidth * 3
      height: game.tileHeight
      color: 'purple'
      text: "Finish"
      textSize: "24px"
      textX: game.tileWidth / 2 + 20
      textY: game.tileHeight / 2 - 15
      textColor: 'white'
      click: ->
        Math.seed = 1
        game.level = 1
        drawMenu()
]

tutorialPosition = -1
tutorialNext = ->
  tutorialPosition++
  t = tutorial[tutorialPosition]
  t.setup() if t.setup
  hideNextBtn = t.hideNextBtn if t.hideNextBtn
  drawTutorialText t.text, t.position, hideNextBtn
  if tutorialPosition is tutorial.length-1
    tutorialPosition = -1

drawTutorialText = (text, position = 'top', hideNextBtn = false) ->
  stage.removeChild $('tutorialText')[0]
  if position is 'top'
    position = game.tileHeight / 4
    textPosition = game.tileHeight / 1.3
  else
    position = game.tileHeight * 3
    textPosition = game.tileHeight * 6

  tutorialText = $.create.container 'tutorialText'
  tutorialText.addChild $.create.rectangle
    name: "tutorialTextContainer"
    width: (game.size * game.tileWidth) - game.tileWidth
    height: game.tileHeight * 1.6
    color: 'rgba(255,255,255,0.95)'
    x: game.tileWidth / 4
    y: position
    scaleX: 1
    scaleY: 1

  tutorialText.addChild $.create.text
    name: 'tutorialTextText'
    text: text
    size: '16px'
    align: 'center'
    x: (game.size / 2) * game.tileWidth
    y: textPosition

  unless hideNextBtn
    tutorialText.addChild drawButton
      name: 'tutorialNext'
      x: (Math.floor(game.size / 2) - 1) * game.tileWidth
      y: (Math.floor(game.size / 2) + 1) * game.tileHeight
      width: game.tileWidth * 3
      height: game.tileHeight
      color: 'purple'
      text: "Next"
      textSize: "24px"
      textX: game.tileWidth / 2 + 24
      textY: game.tileHeight / 2 - 15
      textColor: 'white'
      click: tutorialNext

  stage.addChild tutorialText
