var gd = new GraphDisplay();
var $graphpage = $('#graph-page');
startPos = startingPoints();
function startingPoints(){
	var height = window.innerHeight;
	var width = window.innerWidth;
	if(width<750) return {x1: width/2-50,y1: height/2, x2: width/2+50, y2: height/2};
	return {x1: width/2-250,y1: height/2, x2: width/2+250, y2: height/2};
}
var firstNode = gd.addNode(startPos.x1, startPos.y1);
var secondNode = gd.addNode(startPos.x2, startPos.y2);
gd.completeConnection(firstNode, secondNode);

$graphpage.on('mousedown', graphMousedown);
$graphpage.on('mouseup', graphMouseup);

var connectNode = null;
var connectionStatus = 0;
var shiftKey = false;
var ctrlKey = false;
var clicky;
var clickx;

function graphMousedown(e){
	shiftKey = e.shiftKey;
	ctrlKey = e.ctrlKey;
	if(e.target.nodeName === 'circle') circleMousedown(e);
	else if(connectionStatus ===1) endConnection(e);
	else if(e.target.nodeName === 'line') lineMousedown(e);
	else if(e.target.nodeName === 'svg') svgMousedown(e);
}

function graphMouseup(e){
	if(e.target.nodeName === 'circle') circleMouseup(e);
	else if(e.target.nodeName === 'svg') svgMouseup(e);
}

function circleMousedown(e){
	clickx = e.clientX;
	clicky = e.clientY;
	if(connectionStatus === 1){
		var id = e.target.id.slice(4);
		gd.completeConnection(connectNode, id);
		connectionStatus = 2;
	}
}

function circleMouseup(e){
	var id = e.target.id.slice(4);
		//The circle did not get dragged.
		if(clickx == e.clientX && clicky == e.clientY || shiftKey || ctrlKey){
			if(connectionStatus === 0){
				connectNode = id;
				gd.beginConnection(id);
				connectionStatus = 1;
			}
			else if(connectionStatus === 2){
				if(shiftKey){
					gd.beginConnection(connectNode);
					connectionStatus = 1;
				}
				else if(ctrlKey){
					connectNode = id;
					gd.beginConnection(id);
					connectionStatus = 1;
				}
				else connectionStatus = 0;
			}
		}
		else{

		}
}

function svgMousedown(e){
	gd.addNode(e.clientX, e.clientY);
}

function svgMouseup(e){

}

function lineMousedown(e){
	if(connectionStatus === 1) return;
	else{
		var classes = e.target.classList.toString().split(' ');
		gd.deleteEdge(e.target, classes[1].slice(4), classes[2].slice(4));
	}
}

function endConnection(e){
	if(shiftKey || ctrlKey){
		var id = gd.index;
		clickx = e.clientX;
		clicky = e.clientY;
		gd.addNode(e.clientX, e.clientY);
		gd.completeConnection(connectNode, id);
		connectionStatus = 2;
	}
	else{
		gd.completeConnection();
		connectionStatus = 0;
	}
}