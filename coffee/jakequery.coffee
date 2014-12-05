window.stage = new createjs.Stage "canvas"
stage.top = 5
createjs.Ticker.addEventListener "tick", stage
stage.enableMouseOver()

window.$ = (elem = stage) ->
  return new jakeQuery(elem)

$.extend = (obj, mixin) ->
  obj[name] = method for name, method of mixin        
  obj

class jakeQuery

  constructor: (elem) ->
    return @ if elem.canvas # if it's a stage object, just return a blank instance

    # function to loop through the stage objects children
    length = 0 # count the number of elements
    recursiveIterator = (obj, name) =>
      for k, v of obj
        if k is 'name' and v is name # if the object has the queried name
          @[length++] = obj # make it the instance element
        else if k is 'children' and obj.name != 'noquery' # if it has no children and is allowed to be queried
          for child in obj.children
            recursiveIterator child, name # recurse deeper

    if typeof elem is 'string'
      recursiveIterator stage, elem # start looking for it
    else
      if elem.length
        @[i] = e for e, i in elem
      else
        @[0] = elem # or set the instance element
    
    @create.that = @
    return @ # return the instance
  
  newShape: (obj) ->
    shape = new createjs.Shape()
    shape = $.extend shape, obj
    return shape

  create:
    defaultShape:
      name: false
      color: 'transparent'
      x: 0
      y: 0
      radius: 0
      width: 0
      height: 0

    container: (name) ->
      container = new createjs.Container()
      container.name = name
      stage.addChild container
      return container

    circle: (obj) -> # name = false, color = transparent, x = 0, y = 0, radius = 0
      obj = $.extend @defaultShape, obj
      obj.type = 'circle'
      shape = @that.newShape obj
      shape.graphics.beginFill(obj.color).drawCircle obj.x, obj.y, obj.radius
      return shape

    rectangle: (obj) -> # name = false, color = transparent, x = 0, y = 0, width = 0, height = 0
      obj = $.extend @defaultShape, obj
      obj.type = 'rectangle'
      shape = @that.newShape obj
      shape.graphics.beginFill(obj.color).drawRect obj.x, obj.y, obj.width, obj.height
      return shape

  iterate: (callback) ->
    i = 0
    while elem = @[i++]
      callback(elem)

  addChild: (child) ->
    @iterate (elem) ->
      elem.addChild(child)

  changeColor: (shape, color) ->
    switch shape.type
      when "circle" then shape.graphics.clear().beginFill(color).drawCircle 0, 0, shape.radius

  animate: (properties, delay = 0, duration = 0, easing = 'linear', complete = false) ->
    unless complete
      complete = -> false
    ease = createjs.Ease[easing] # http://www.createjs.com/Docs/TweenJS/classes/Ease.html
    @iterate (elem) ->
      createjs.Tween.removeTweens elem
      createjs.Tween.get elem
        .wait delay
        .to properties, duration, ease
        .call complete

$.extend $, new jakeQuery(stage)