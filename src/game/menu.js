game.module(
    'game.menu'
)
.require(
    'game.assets'
)
.body(function() {
  game.createClass('menu', {
    init: function(menuConfig) {
      this.buildMenu(menuConfig);
    },

    collection: {},

    buildMenu: function(menuConfig)
    {
      for (k in menuConfig) {
        var button = this.makeButton(menuConfig[k]);
        this.collection[k] = button;
        game.scene.stage.addChild(button);
      }
    },

    makeButton: function (buttonConfig)
    {
        var button = this.makeRoundedRectangle(buttonConfig.x, buttonConfig.y, buttonConfig.width, buttonConfig.height, buttonConfig.color);
        var menuText = new game.BitmapText(buttonConfig.text, { font: buttonConfig.textSize + ' Arial' });
        menuText.position.set(buttonConfig.textX + buttonConfig.x, buttonConfig.textY + buttonConfig.y);
        menuText.addTo(button);

        if(buttonConfig.click){
          button.click = buttonConfig.click;
        }

        return button;
    },

    makeRoundedRectangle : function (x, y, width, height, color){
      var graphics = new game.PIXI.Graphics();
      graphics.beginFill(color, 1);
      graphics.drawRect(x, y, width, height, 8);
      graphics.endFill();
      graphics.interactive = true;
      graphics.hitArea = graphics.getBounds();
      return graphics;
    }
  });
});
