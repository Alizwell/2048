var  board = new Array();   //用于保存数字的数组
var  score = 0;    //分数
var  hasFlag = new  Array();  //是否发生叠加的Flag,初始为false



$(document).ready(function(){
	prepareForMobile();
	newgame();	
});



function  prepareForMobile(){
	//屏幕超过500px时，按默认样式显示
	if( documentWidth > 500 ){
		gridContainer = 500;
		CellSpace = 20;
		CellNumberWidth = 100;
	}
	
	//更新grid-container
	$("#grid-container").css("height",gridContainer - 2*CellSpace);
	$("#grid-container").css("width",gridContainer - 2*CellSpace);
	$("#grid-container").css("padding",CellSpace);
	$("#grid-container").css("border-radius",gridContainer*0.02);

	//更新grid-container.Cell
	$(".grid-container-cell").css("height",CellNumberWidth);
	$(".grid-container-cell").css("width",CellNumberWidth);
	$(".grid-container-cell").css("border-radius",CellNumberWidth*0.02);	
	
}



function  newgame(){
	
	//初始化
	init();
	//随机赋值2个
	getOneRandom();
	getOneRandom();
}


function  init(){
	
	//初始化背景
	for(var i = 0 ; i < 4 ;i++){
		for( var j = 0; j < 4; j++){
			var  gridCell = $('#grid-cell-'+i+'-'+j);
			gridCell.css('left',getCellLeft(i,j));
			gridCell.css('top',getCellTop(i,j));
		}
	}
	
	//初始化数组
	for( i=0 ; i< 4; i++){
		board[i] = new Array();
		hasFlag[i] = new Array();
		for( j =0 ;j<4;j++)
		{
			board[i][j] = 0;
			hasFlag[i][j] = false;
		}
	}
	score = 0;
	updateBoardView();
	
}

function  updateBoardView(){
		$(".number-cell").remove();
		for(var i=0;i<4;i++){
				for( var j=0;j<4;j++){
//					$('#grid-container').append("<div class='number-cell' id='number-cell-"+i+"-"+j+" ' ></div>");
		     		$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );
					var theNumberCell = $("#number-cell-"+i+"-"+j);
//					var theNumberCell = $('#number-cell-'+i+'-'+j);
				
					if( board[i][j] == 0 ){
						theNumberCell.css('height','0px');
						theNumberCell.css('width','0px');
						theNumberCell.css('top',getCellTop(i,j)+CellNumberWidth/2);
						theNumberCell.css('left',getCellLeft(i,j)+CellNumberWidth/2);
						
					}else{
						theNumberCell.css('height',CellNumberWidth);
						theNumberCell.css('width',CellNumberWidth);
						theNumberCell.css('top',getCellTop(i,j));
						theNumberCell.css('left',getCellLeft(i,j));

						theNumberCell.css('background-color',getNumberCellBgcolor(board[i][j]));
						theNumberCell.css('color',getNumberCellColor(board[i][j]));
						theNumberCell.text(board[i][j]);
					}
					
					hasFlag[i][j] = false; 
				}
		}
		$('.number-cell').css('line-height',CellNumberWidth+'px');
		$('.number-cell').css('font-size', 0.6 * CellNumberWidth+'px');
	
}

function  getOneRandom(){
	if( nospace(board)){
		return  false;
	}
	var  emptyBoard = new Array();
	var  key = 0
	for(var i = 0; i < 4 ; i++){
		for (var j = 0 ; j < 4 ; j++){
			if( board[i][j] == 0 ){
				//录入空位置的值
				emptyBoard[key] = 10 * i + j;
				key++;
			}
		}
	}
	//获得一个随机数
	var randnum = Math.random() > 0.5 ? 2 : 4 ;
	
   //从保存空位置记录的数组中随机一个位置
	var temp = parseInt( Math.floor( Math.random()*key ) );
	//获得随机位置的行
	var keyi = Math.floor( emptyBoard[temp]  / 10 ) ;
	//获得随机位置的列
	var keyj = emptyBoard[temp] % 10;
	//为随机位置赋值随机数
	board[keyi][keyj] = randnum;
	showNumberWithanimation( keyi , keyj , randnum );
	return  true;
	
}



document.addEventListener("touchstart",function(event){
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
})
	
document.addEventListener("touchend",function(event){
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;
	
	delx = endx - startx;
	dely = endy - starty;
	
	//移动意图不明显时不操作
	if( Math.abs(delx) < 0.3 * documentWidth && Math.abs(dely) < 0.3 * documentWidth  )
	 return;
	
	if ( Math.abs(delx) > Math.abs(dely)){    //X方向移动
		if (delx > 0 ){//moveright
			if( moveRight() ){
                setTimeout("getOneRandom()",210);
                setTimeout("isGameOver(board)",300);
            }
		}
		else{ //moveleft
			if( moveLeft() ){
                setTimeout("getOneRandom()",210);
                setTimeout("isGameOver(board)",300);
            }
		}
		
	}else{   //Y方向移动
		if( dely > 0 ) {//movedown
			if( moveDown() ){
                setTimeout("getOneRandom()",210);
                setTimeout("isGameOver(board)",300);
            }
		}
		else{  //moveup
			if( moveUp() ){
                setTimeout("getOneRandom()",210);
                setTimeout("isGameOver(board)",300);
            }
		}
		
		
	}
})


function  moveLeft(){
	if ( ! canMoveLeft(board) ){
		return  false;
	}
	
	for (var i = 0; i < 4 ; i++) {
		for ( var j = 1 ; j < 4 ; j++) {
			if ( board[i][j] != 0){
				for( var k = 0 ; k < j ; k++){
					if( board[i][k] == 0 &&  XWithNoBlock(i,k,j,board) ){
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else  if ( (board[i][k] == board[i][j])  && XWithNoBlock(i,k,j,board) && hasFlag[i][k] == false ){
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j] + board[i][k];
						board[i][j] = 0;
						score += board[i][k];
						updateScore(score);
						continue;
					}
					
				}	
			}	
		}
	}
	
	setTimeout("updateBoardView()",200);
	return  true;
}


function moveRight(){
    if( !canMoveRight( board ) )
        return false;
    //moveRight
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 2 ; j >= 0 ; j -- ){
            if( board[i][j] != 0 ){
                for( var k = 3 ; k > j ; k -- ){
                    if( board[i][k] == 0 && XWithNoBlock( i , j , k , board ) ){
                        showMoveAnimation( i , j , i , k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[i][k] == board[i][j] && XWithNoBlock( i , j , k , board ) && hasFlag[i][k] == false ){
                        showMoveAnimation( i , j , i , k);
                        board[i][k] *= 2;
                        board[i][j] = 0;
						score += board[i][k];
						updateScore(score);
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}


function  moveDown(){
	if ( ! canMoveDown(board) ){
		return  false;
	}
	
	for (var i = 0; i < 4 ; i++) {
		for ( var j = 2 ; j > -1 ; j--) {
			if ( board[j][i] != 0){
				for( var k = 3 ; k > j ; k--){
					if( board[k][i] == 0 &&  YWithNoBlock(i,j,k,board) ){
						showMoveAnimation(j,i,k,i);
						board[k][i] = board[j][i];
						board[j][i] = 0;
						continue;
					}
					else  if ( (board[k][i] == board[j][i])  && YWithNoBlock(i,j,k,board) && hasFlag[k][i] == false ){
						showMoveAnimation(j,i,k,i);
						board[k][i] = board[j][i] + board[k][i];
						board[j][i] = 0;
						score += board[k][i];
						updateScore(score);
						continue;
					}
					
				}	
			}	
		}
	}
	
	setTimeout("updateBoardView()",200);
	return  true;
}


function  moveUp(){
	if ( ! canMoveUp(board) ){
		return  false;
	}
	
	for (var i = 0; i < 4 ; i++) {
		for ( var j = 1 ; j < 4 ; j++) {
			if ( board[j][i] != 0){
				for( var k = 0 ; k < j ; k++){
					if( board[k][i] == 0 &&  YWithNoBlock(i,j,k,board) ){
						showMoveAnimation(j,i,k,i);
						board[k][i] = board[j][i];
						board[j][i] = 0;
						continue;
					}
					else  if ( (board[k][i] == board[j][i])  && YWithNoBlock(i,j,k,board) && hasFlag[k][i] == false){
						showMoveAnimation(j,i,k,i);
						board[k][i] = board[j][i] + board[k][i];
						board[j][i] = 0;
						score += board[k][i];
						updateScore(score);
						continue;
					}
					
				}	
			}	
		}
	}
	
	setTimeout("updateBoardView()",200);
	return  true;
}

function  isGameOver(){
	if( nospace(board) && nomove(board)){
		gameOver();
	}
}


function  gameOver(){
	alert("GAME  IS  OVER!");
}


$(document).keydown(function(event){
	
	var  keycode = event.keyCode
	
	switch(keycode){
		case 37: //left
			event.preventDefault();
            if( moveLeft() ){
                setTimeout("getOneRandom()",210);
                setTimeout("isGameOver(board)",300);
            }
            break;
        case 38: //up
        	event.preventDefault();
            if( moveUp() ){
                setTimeout("getOneRandom()",210);
                setTimeout("isGameOver(board)",300);
      
            }
            break;
        case 39: //right
            if( moveRight() ){
                setTimeout("getOneRandom()",210);
                setTimeout("isGameOver(board)",300);
            }
            break;
        case 40: //down
        	event.preventDefault();
            if( moveDown() ){
                setTimeout("getOneRandom()",210);
                setTimeout("isGameOver(board)",300);
            }
            break;
		default:
			break;
	}
});