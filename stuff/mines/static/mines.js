// WORLD OBJECT

var oWorld = {
  oElement: $("#game_canvas"),
  lWidth: 0,
  lHeight: 0,
  lMineCount: 0,
  bGameRunning: false,
  aMines: {},
  lFoundEmpty: 0,
  initialize: function(){
    this.aMines = {};
    this.lFoundEmpty = 0;
    this.oElement.html("");
    for(var y = 0; y < this.lHeight; y++){
      var sLine = "<div class=\"line\" style=\"height:" + (100/this.lHeight) + "%;\">";
      for(var x = 0; x < this.lWidth; x++){
        sLine += "<span class=\"element\" id=\"s"+ x + "_" + y + "\" style=\"width:" + (100/this.lWidth) + "%;\"></span>";
      }
      sLine += "</div>";
      this.oElement.append(sLine);
    }
    this.randomizeMines();
    this.bGameRunning = true;
  },
  randomizeMines: function(){
    for(var i = 0; i < this.lMineCount; i++){
      var x = Math.round(Math.random() * (this.lWidth - 1));
      var y = Math.round(Math.random() * (this.lHeight - 1));
      if(!this.checkField(x, y))
        this.aMines[x + "," + y] = 1;
      else
        i--;
    }
  },
  checkField: function(x, y){
    if(typeof this.aMines[x + "," + y] == "undefined")
      return false;
    return true;
  },
  checkWin: function(){
    if($("span.open", this.oElement).length == (this.lWidth * this.lHeight) - this.lMineCount)
      return true;
    return false;
  },
  makeMove: function(x, y){
    if(!this.bGameRunning || $("#s" + x + "_" + y).hasClass("flagged")){
      return;
    }
    if(this.checkField(x, y)){
      $("#s" + x + "_" + y).addClass("error");
      this.bGameRunning = false;
      this.showGameOver(false);
    }else{
      var aNeightbors = this.checkNeighbors(x, y);
      $("#s" + x + "_" + y).html(aNeightbors[0] > 0 ? aNeightbors[0] : "").addClass("open");
      if(aNeightbors[0] == 0){
        for(var sElement in aNeightbors[1]){
          var lIndexes = sElement.split(",");
          if(!$("#s" + lIndexes[0] + "_" + lIndexes[1]).hasClass("open"))
            this.makeMove(parseInt(lIndexes[0]), parseInt(lIndexes[1]));
        }
      }
      if(this.checkWin()){
        this.bGameRunning = false;
        this.showGameOver(true);
      }
    }
  },
  checkNeighbors: function(x, y){
    if(x < 0 || x > this.lWidth - 1 || y < 0 || y > this.lHeight - 1)
      return [0, {}];
    var lCount = 0;
    var aCount = {};
    // check row above
    for(var i = x-1; i <= x+1; i++){ if(this.checkField(i, y-1)) lCount++; else aCount[i + "," + (y-1)] = 0; }
    // check row below
    for(var i = x-1; i <= x+1; i++){ if(this.checkField(i, y+1)) lCount++; else aCount[i + "," + (y+1)] = 0; }
    // check left
    if(this.checkField(x - 1, y)) lCount++; else aCount[(x-1) + "," + y] = 0;
    // check right
    if(this.checkField(x + 1, y)) lCount++; else aCount[(x+1) + "," + y] = 0;
    return [lCount, aCount];
  },
  markFlag: function(x, y){
    $("#s" + x + "_" + y).toggleClass("flagged");
  },
  showAllMines: function(){
    for(var sMine in this.aMines){
      var lIndexes = sMine.split(",");
      $("#s" + parseInt(lIndexes[0]) + "_" + parseInt(lIndexes[1])).addClass("mine");
    }
  },
  showGameOver: function(){}
};

// INITIALIZATION

$(document).ready(function(){
  oWorld.lWidth = 10;
  oWorld.lHeight = 10;
  oWorld.lMineCount = 6;
  //oWorld.initialize();
  $(oWorld.oElement).delegate("span.element", "contextmenu", function(){
    return false;
  });
  $(oWorld.oElement).delegate("span.element", "mousedown", function(e){
    var lIndexes = $(this).attr("id").substr(1).split("_");
    if(e.which == "1"){
      oWorld.makeMove(parseInt(lIndexes[0]), parseInt(lIndexes[1]));
    }else if(e.which == "3"){
      oWorld.markFlag(parseInt(lIndexes[0]), parseInt(lIndexes[1]));
    }
  });
  oWorld.showGameOver = function(bWon){
    bWon ? $("#game_result").html("You rock!").addClass("won") : $("#game_result").html("You lost.").addClass("lost");
    $("#menu").show();
    oWorld.showAllMines();
  };
  $("#game_start").click(function(){
    $("#menu").hide();
    oWorld.lWidth = parseInt($("#game_width").val());
    oWorld.lHeight = parseInt($("#game_height").val());
    oWorld.lMineCount = parseInt($("#game_mines").val());
    oWorld.initialize();
  });
});


