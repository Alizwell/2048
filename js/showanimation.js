function  showNumberWithanimation(i,j,randNum){

	var NumberCell = $('#number-cell-' + i + "-" + j );
	NumberCell.css('color',getNumberCellColor(randNum));
	NumberCell.css('background-color',getNumberCellBgcolor(randNum));
	NumberCell.text(randNum);
	
	NumberCell.animate({
		width:CellNumberWidth,
		height:CellNumberWidth,
		left:getCellLeft(i,j),
		top:getCellTop(i,j)
	},20);
}



function  showMoveAnimation(fromx,fromy,toX,toY){
	var  numberCell = $('#number-cell-'+fromx+"-"+fromy);
	numberCell.animate({
		left:getCellLeft(toX,toY),
		top:getCellTop(toX,toY)
	},200);
	
}


function  updateScore(score){
	$('#score').text(score);
}
