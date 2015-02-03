grd = new GridDisplay(50, 50);
gridStartPos = gridStartingPoints();
function gridStartingPoints(){
	var height = window.innerHeight;
	var width = window.innerWidth;
	var centerX = Math.round((width/2)/grd.squareWidth);
	var centerY = Math.floor((height/2)/grd.squareWidth);
	console.log(centerX +'  '+centerY);
	if(width<750) return {x1: centerX-3,y1: centerY, x2: centerX+2, y2: centerY};
	return {x1: centerX-5,y1: centerY, x2: centerX+4, y2: centerY};
}
grd.setStart([gridStartPos.x1, gridStartPos.y1]);
grd.setFinish([gridStartPos.x2, gridStartPos.y2]);
var $gridpage = $('#grid-page');

$gridpage.on('mousedown', '.grid-square', gridMousedown);
$gridpage.on('mouseup', gridMouseup)

function gridMousedown(e){
	var target = e.target;
	if(target.tagName === 'rect') squareMousedown(e);
}

function gridMouseup(e){
	$('.grid-square').off('mouseover');
}

function squareMousedown(e){
	var target = e.target;
	var classes = target.className.baseVal.split(' ');
	var coord = target.id.slice(5).split('-');
	if(classes.indexOf('grid-start') > -1){
		$('.grid-square').on('mouseover', startDrag);
	}
	else if(classes.indexOf('grid-finish') > -1){
		$('.grid-square').on('mouseover', finishDrag);
	}
	else if(classes.length >= 2){
		grd.unpaintSquare(coord);
		$('.grid-square').on('mouseover', eraser);
	}
	else{
		grd.paintSquare(coord, 0);
		$('.grid-square').on('mouseover', pen);
	}
}

function pen(e){
	var classes = this.className.baseVal.split(' ');
	if(classes.indexOf('grid-start') > -1) return
	else if(classes.indexOf('grid-finish') > -1) return
	else {
		var coord = this.id.slice(5).split('-');
		grd.paintSquare(coord, 0);
	}
}

function eraser(e){
	var classes = this.className.baseVal.split(' ');
	if(classes.indexOf('grid-start') > -1) return
	else if(classes.indexOf('grid-finish') > -1) return
	else {
		var coord = this.id.slice(5).split('-');
		grd.unpaintSquare(coord);
	}
}

function startDrag(e){
	var coord = this.id.slice(5).split('-');
	grd.setStart(coord);
}

function finishDrag(e){
	var coord = this.id.slice(5).split('-');
	grd.setFinish(coord);
}