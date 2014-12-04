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
        @[i] = elem for elem, i in elem
      else
        @[0] = elem # or set the instance element
    
    @create.that = @
    return @ # return the instance
  
  newShape: (obj) ->
    shape = new createjs.Shape()
    shape.name = obj.name if obj.name
    shape.type = obj.type if obj.type
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
      return $(name)

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

$.extend $, new jakeQuery(stage)
