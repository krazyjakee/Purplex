game.module(
  'game.scenes'
)
.require(
  'game.menu'
)
.body(function() {

  game.createScene('Main', {
    init: function() {
      var Menu = new game.menu(purplexConfig.menuObj);
    }
  });

});
