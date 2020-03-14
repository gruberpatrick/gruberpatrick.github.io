

// BIRD OBJECT

var oBird = {
  element: $("#flappy"),
  lCurrentPosition: 0,
  oBirdInterval: null,
  lGravitySpeed: 0.1,
  bFalling: true,
  setPosition: function(lNewPosition){
    this.lCurrentPosition = lNewPosition;
    this.element.css("bottom", lNewPosition + "%");
  },
  fall: function(){
    if(this.bFalling){
      if(this.lCurrentPosition - this.lGravitySpeed >= 0.0){
        this.setPosition(this.lCurrentPosition -= this.lGravitySpeed);
        this.lGravitySpeed += 0.005;
      }else{
        this.bFalling = false;
        oWorld.endGame();
      }
    }else{
      if(this.lGravitySpeed > 0.0){
        this.lGravitySpeed -= 0.01;
        this.setPosition(this.lCurrentPosition += this.lGravitySpeed);
      }else{
        this.bFalling = true;
      }
    }
  },
  jump: function(){
    this.lGravitySpeed = 0.6;
    this.bFalling = false;
  }
};

// WORLD OBJECT

var oWorld = {
  element: $("#game_canvas"),
  oPipe: $("#pipe"),
  oSpace: $("#space"),
  lNewPosition: 110,
  lPipeNumber: 0,
  lAnimationSpeed: 0.1,
  bDebug: false,
  sMode: "-",
  bCheats: false,
  bPause: false,
  init: function(){
    oBird.setPosition(90);
    this.element.unbind("click").bind("click", function(){
      oBird.jump();
    });
    $(document).unbind("keydown").bind("keydown", function(e){
      if(e.which == 32) oBird.jump();
      if(oWorld.bCheats && e.which == 83) oWorld.lAnimationSpeed += 0.05;
    });
  },
  reset: function(){
    this.lNewPosition = 110;
    this.oPipe.css("left", "110%");
    this.lPipeNumber = 0;
    $("#score").html("0");
    $("#final").hide();
    $("#cheater").hide();
  },
  endGame: function(){
    if(!this.bCheats){
      clearInterval(oBird.oBirdInterval);
      $("#menu").show();
      $("#pause_button").hide();
    }
  },
  pauseGame: function(){
    clearInterval(oBird.oBirdInterval);
  },
  randomizeSpace: function(){
    this.oSpace.css("top", ((Math.random() * 70) + 1) + "%");
    this.oSpace.css("height", ((Math.random() * 20) + 20) + "%");
  },
  animateNextPipe: function(){
    this.lNewPosition -= this.lAnimationSpeed;
    if(this.lNewPosition <= -10.0){
      this.lNewPosition = 110;
      this.randomizeSpace();
      if(this.lPipeNumber % 10.00 == 0) 
        this.lAnimationSpeed += 0.05;
    }
    this.oPipe.css("left", this.lNewPosition + "%");
  },
  worldAnimation: function(){
    oBird.oBirdInterval = setInterval(function(){
      oBird.fall();
      oWorld.animateNextPipe();
      if(oWorld.checkHit()) oWorld.endGame();
    }, 1);
  },
  showFinalMenu: function(){
    $("#final").show();
    if(this.bCheats) $("#cheater").show();
    this.endGame();
  },
  increaseScore: function(){
    this.lPipeNumber += 1;
    $("#score").html(this.lPipeNumber);
    if(this.lPipeNumber == 99){
      this.showFinalMenu();
    }
  },
  checkHit: function(){
    if(this.bDebug){
      $("#birdx").html(oBird.element.offset().left);
      $("#birdy").html(oBird.element.offset().top);
      $("#spacex").html(this.oSpace.offset().left);
      $("#spacey").html(this.oSpace.offset().top);
    }
    if(!(oBird.element.offset().left + oBird.element.outerWidth() >= this.oSpace.offset().left && oBird.element.offset().left <= this.oSpace.offset().left + this.oSpace.outerWidth())){
      if(this.sMode == "1" || (this.bCheats && this.sMode == "0")) this.increaseScore();
      this.sMode = "-";
      return false;
    }
    if( (oBird.element.offset().left + oBird.element.outerWidth() >= this.oSpace.offset().left && oBird.element.offset().left <= this.oSpace.offset().left + this.oSpace.outerWidth()) &&
        (oBird.element.offset().top >= this.oSpace.offset().top && this.oSpace.offset().top + this.oSpace.outerHeight() >= oBird.element.offset().top + oBird.element.outerHeight())
      ){
      this.sMode = "1";
      return false;
    }
    this.sMode = "0";
    return true;
  }
};

// INITIALIZATION

$(document).ready(function(){
  $("#play_button").click(function(){
    $("#menu").hide();
    $("#pause_button").show();
    oWorld.reset();
    oWorld.init();
    oWorld.randomizeSpace();
    oWorld.worldAnimation();
  });
  $("#debug_button").bind("click", function(){
    oWorld.bDebug = !(oWorld.bDebug);
    $("#debug_value").html( oWorld.bDebug ? "ON" : "OFF" );
    (!oWorld.bDebug) ? $("#stats").hide() : $("#stats").show();
  });
  $("#cheats_button").bind("click", function(){
    oWorld.bCheats = !(oWorld.bCheats);
    $("#cheats_value").html( oWorld.bCheats ? "ON" : "OFF" );
  });
  $("#pause_button").bind("click", function(){
    oWorld.bPause = (!oWorld.bPause);
    oWorld.bPause ? oWorld.pauseGame() : oWorld.worldAnimation();
  });
});
