game.module(
  'game.scenes'
)
.require(
  'game.menu'
)
.body(function() {

  game.createScene('Main', {
    backgroundColor: 0xFFFFFF,
    init: function() {
      game.system.transparent = true;
      Math.seed = 0;
      var Menu = new game.menu(purplexConfig.menuObj);
    }
  });

});
