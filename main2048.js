var board = new Array();
var score = 0;
var statex = 0;
var statey = 0;
var endx = 0;
var endy = 0;
var hasConfilcted = new Array();
$(document).ready(function(){
  perpareForMobile()
  newgame()
});
function perpareForMobile() {
  if(doucmentWidth > 500){
    gridContainerWidth = 500;
    cellSpace = 20;
    cellSideLength = 100;
  }
  $('#grid-container').css('width',gridContainerWidth-2*cellSpace)
  $('#grid-container').css('height',gridContainerWidth-2*cellSpace)
  $('#grid-container').css('padding',cellSpace)
  $('#grid-container').css('border-radius',0.02*gridContainerWidth)

  $('.grid-cell').css('width',cellSideLength);
  $('.grid-cell').css('height',cellSideLength);
  $('.grid-cell').css('border-radius',0.02*cellSideLength);
}
function newgame(){
   //初始化棋盘格
   init();
   //在随机两个格子中生成数字
  generateOneNumber();
  generateOneNumber();
}
function init(){
  for(var i=0 ; i <4;i++){
    for(var j=0;j<4;j++){
      var gridCell = $('#grid-cell-'+i+'-'+j)
      gridCell.css('top',getPosTop(i,j));
      gridCell.css('left',getPosLeft(i,j));
    }
  }
  for(var i=0;i<4;i++){
    board[i] = new Array()
    hasConfilcted[i] = new Array()
    for(var j=0;j<4;j++){
      board[i][j]=0;
      hasConfilcted[i][j] = false;
    }
  }
  score = 0;
  updataBoardView();
}
function updataBoardView(){
  $('.number-cell').remove();
  for(var i=0;i<4;i++){
    for(var j=0;j<4;j++){
      $('#grid-container').append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>')
      var theNumberCell = $('#number-cell-'+i+'-'+j);
      if(board[i][j] == 0){
        theNumberCell.css('width','0px');
        theNumberCell.css('height','0px');
        theNumberCell.css('top',getPosTop(i,j)+cellSideLength/2);
        theNumberCell.css('left',getPosLeft(i,j)+cellSideLength/2);
      }else {
        theNumberCell.css('width',cellSideLength);
        theNumberCell.css('height',cellSideLength);
        theNumberCell.css('top',getPosTop(i,j));
        theNumberCell.css('left',getPosLeft(i,j));
        theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
        theNumberCell.css('color',getNumberColor(board[i][j]));
        theNumberCell.text(board[i][j]);
      }
      hasConfilcted[i][j] = false
    }
  }
  $('.number-cell').css('line-height',cellSideLength+'px');
  $('.number-cell').css('font-size',0.6*cellSideLength+'px');
}
function generateOneNumber(){
  if(nospace(board))
    return false;
    //随机一个位置
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));
    var timers = 0
    while (timers < 50){
      if(board[randx][randy]===0){
        break;
      }
      randx = parseInt(Math.floor(Math.random() *4));
      randy = parseInt(Math.floor(Math.random() *4));
      timers++;
    }
    if(timers == 50){
      for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
          if(board[i][j] == 0){
            randx = i;
            randy = j;
          }
        }
      }
    }
    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;
    //在随机的位置上显示随机的数字
    board[randx][randy] = randNumber;
    showNumberWithAnmation(randx,randy,randNumber);
  return true;
}
$(document).keydown(function(event){
  switch (event.keyCode) {
    case 37://left;
      if(moveLeft()){
        setTimeout('generateOneNumber()',210);
        setTimeout('isgameover()',300);
      }
      break;
    case 38://up;
      if(moveUp()){
        setTimeout('generateOneNumber()',210);
        setTimeout('isgameover()',300);
      }
      break;
    case 39://right;
      if(moveRight()){
        setTimeout('generateOneNumber()',210);
        setTimeout('isgameover()',300);
      }
      break;
    case 40://down;
      if(moveDown()){
        setTimeout('generateOneNumber()',210);
        setTimeout('isgameover()',300);
      }
      break;
  }
})
document.addEventListener('touchstart',function(event){
  statex = event.touches[0].pageX;
   statey = event.touches[0].pageY;
 })
document.addEventListener('touchend',function(event){
  endx = event.changedTouches[0].pageX;
  endy = event.changedTouches[0].pageY;
  var detailtx = endx-statex;
  var detailty = endy-statey;
  //x
  if(Math.abs(detailtx)>=Math.abs(detailty)){
      if(detailtx>0){
        if(moveRight()){
          setTimeout('generateOneNumber()',210);
          setTimeout('isgameover()',300);
        }
        //move Right
      }else{
        if(moveLeft()){
          setTimeout('generateOneNumber()',210);
          setTimeout('isgameover()',300);
        }
        //move Left
      }
    //y
  }else{
    if(detailty>0){
      if(moveDown()){
        setTimeout('generateOneNumber()',210);
        setTimeout('isgameover()',300);
      }
      //move Down
    }else{
      if(moveUp()){
        setTimeout('generateOneNumber()',210);
        setTimeout('isgameover()',300);
      }
      //move Up
    }
  }
})
function isgameover(){
  if(nospace(board) && nomove(board)){
    GameOver()
  }
}
function GameOver(){
  alert('GameOver')
}
function moveLeft(){
  if(!canMoveLeft(board)){
    return false
  }
  for(var i=0; i<4; i++){
    for(var j=1; j<4; j++){
      if(board[i][j]!=0){
        for(var k=0; k<j; k++){
          if(board[i][k] == 0 && noBlockHOrizontal(i, k, j, board)){
            //move
            showMoveAnimation(i, j, i, k);
            board[i][k]=board[i][j];
            board[i][j]=0;
            continue;
          }else if(board[i][k] == board[i][j] && noBlockHOrizontal(i, k, j, board) &&  !hasConfilcted[i][k]){
            //move
            //add
            showMoveAnimation(i, j, i, k);
            board[i][k] += board[i][j];
            board[i][j]=0;
            //add score
            score += board[i][k]
            updataScore(score)
            hasConfilcted[i][j] = true
            continue;
          }
        }
      }
    }
  }
  setTimeout('updataBoardView()',200)
  return true
}
function moveRight(){
  if(!canmoveRight(board)){
    return false
  }
  //moveRight
  for(var i=0; i<4; i++){
    for(var j=2; j>=0; j--){
      if(board[i][j]!=0){
        for(var k=3; k>j; k--){
          if(board[i][k] == 0 && noBlockHOrizontal(i, k, j, board)){
            //move
            showMoveAnimation(i, j, i, k);
            board[i][k]=board[i][j];
            board[i][j]=0;
            continue;
          }else if(board[i][k] == board[i][j] && noBlockHOrizontal(i, k, j, board) &&  !hasConfilcted[i][k]){
            //move
            //add
            showMoveAnimation(i, j, i, k);
            board[i][k] *= 2;
            board[i][j]=0;
            score += board[i][k]
            updataScore(score)
            hasConfilcted[i][j] = true
            continue;
          }
        }
      }
    }
  }
  setTimeout('updataBoardView()',200)
  return true
}
function moveUp(){
  if(!canmoveUp(board)){
    return false
  }
  for(var j=0; j<4; j++){
    for(var i=1; i<4; i++){
      if(board[i][j]!=0){
        for(var k=0; k<i; k++){
          if(board[k][j] == 0 && noBlockVertical(j, k, i, board)){
            //move
            showMoveAnimation(j, k, i, board);
            board[k][j]=board[i][j];
            board[i][j]=0;
            continue;
          }else if(board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) &&  !hasConfilcted[i][k]){
            //move
            //add
            showMoveAnimation(i, j, k, j);
            board[k][j] *= 2;
            board[i][j]=0;
            score += board[k][j]
            updataScore(score)
            hasConfilcted[i][j] = true
            continue;
          }
        }
      }
    }
  }
  setTimeout('updataBoardView()',200)
  return true
}
function moveDown(){
  if(!canmoveDown(board)){
    return false
  }
  for(var j=0; j<4; j++){
    for(var i=2; i>=0; i--){
      if(board[i][j] != 0){
        for(var k=3; k>i; k--){
          if(board[k][j] == 0 && noBlockVertical(j, k, i, board)){
            //move
            showMoveAnimation(i, j, k, j);
            board[k][j]=board[i][j];
            board[i][j]=0;
            continue;
          }else if(board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) &&  !hasConfilcted[i][k]){
            //move
            //add
            showMoveAnimation(i, j, k, j);
            board[k][j] *= 2;
            board[i][j]=0;
            score +=  board[k][j];
            updataScore(score)
            hasConfilcted[i][j] = true
            continue;
          }
        }
      }
    }
  }
  setTimeout('updataBoardView()',200)
  return true
}
function nomove(){
  if(canMoveLeft(board) || canmoveRight(board) || canmoveUp(board) || canmoveDown(board)){
    return false;
  }
  return true;
}