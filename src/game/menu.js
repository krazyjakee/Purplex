game.module(
    'game.menu'
)
.require(
    'game.assets'
)
.body(
function() {
  game.createClass('menu', {
    init: function(menuConfig) {
      this.buildMenu(menuConfig);
    },

    buildMenu: function(menuConfig)
    {
      for (k in menuConfig) {
        this.addButton(menuConfig[k]);
      }
    },

    addButton: function (buttonConfig)
    {
        //name: 'logo',
        //x: (Math.floor(game.size / 2) - 1) * game.tileWidth,
        //y: 0,
        //width: 3 * game.tileWidth,
        //height: game.tileHeight,
        //color: 'white', 0xFFFFFF
        //text: "PurpleX",
        //textSize: "40px",
        //textX: 4,
        //textY: 3,
        //textColor: 'purple'

        var button = this.makeRoundedRectangle(buttonConfig.x, buttonConfig.y, buttonConfig.width, buttonConfig.height, buttonConfig.color);
        var menuText = new game.BitmapText(buttonConfig.text, { font: buttonConfig.textSize + ' Arial' });
//        button.addChild(menuText);
        menuText.position.set(buttonConfig.textX + buttonConfig.x, buttonConfig.textY + buttonConfig.y);
        menuText.addTo(button);
        game.scene.stage.addChild(button);
    },

    makeRoundedRectangle : function (x, y, width, height, color){
      console.log(x);
      console.log(y);
      console.log(width);
      console.log(height);

      var graphics = new game.PIXI.Graphics();
      // draw a rounded rectangle
      graphics.lineStyle(2, color, 1);
      graphics.beginFill(color, 0.25);
      graphics.drawRoundedRect(x, y, width, height, 8);
      graphics.endFill();
      return graphics;
    }

  });
});
