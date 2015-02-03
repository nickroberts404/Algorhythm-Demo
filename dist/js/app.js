var s = [Snap(), Snap(), Snap()];
document.getElementById('graph-page').appendChild(s[0].node);
document.getElementById('grid-page').appendChild(s[1].node);
document.getElementById('point-page').appendChild(s[2].node);

var GraphDisplay = function(){
	this.snap = s[0];
	this.graph = new Graph();
	this.edges = this.snap.group();
	this.tempEdges = this.snap.group();
	this.nodes = this.snap.group();
	this.index = 0;
	this.dragging = false;
	this.didDrag = false;
	this.connectedNodes = [];
	this.currentNode;
}
GraphDisplay.prototype = {
	addNode: function(x, y){
		this.nodes.circle(x, y, 10)
			.attr({class: "graph-node", id: "node"+this.index})
			.drag(preDragMove, preDragStart, preDragEnd);
			this.graph.addNode(x, y, 1);
		this.index++;
		var self = this;
		function preDragMove(dx, dy, x, y){self.dragMove(dx, dy, x, y, this)}
		function preDragStart(x, y){self.dragStart(x, y, this)}
		function preDragEnd(x, y){self.dragEnd(x, y, this)}
		return this.index-1;
	},
	dragMove: function(dx, dy, x, y, node){
		node.attr({
            transform: node.data('origTransform') + (node.data('origTransform') ? "T" : "t") + [dx, dy]
        });
		this.didDrag = true;
        if(!this.dragging){
        	this.dragging = true;
        	this.currentNode = node.node.id.slice(4);
        	var edges = this.graph.getNode(this.currentNode).edges;
        	for (edge in edges){
        		this.connectedNodes.push(edges[edge].target.id);
        	}
        }
        for(anode in this.connectedNodes){
        	current = this.connectedNodes[anode];
        	this.edges.select('.line'+this.currentNode+'.line'+current).remove();
        	this.drawEdge(this.currentNode, current);
        }
	},
	dragStart: function(x, y, node){
		node.data('origTransform', node.transform().local );
	},
	dragEnd: function(x, y, node){
		if(this.dragging){
			var nodeID = node.node.id.slice(4)
			var center = this.getCenter(nodeID);
			this.graph.getNode(nodeID).update({x: center.x, y: center.y})
			for(anode in this.connectedNodes){
	        	current = this.connectedNodes[anode];
	        	this.graph.disconnectNodes(nodeID, current, true);
	        	this.graph.connectNodes(nodeID, current, this.getDistance(this.getCenter(nodeID), this.getCenter(current)), true);
	        }
			this.connectedNodes = [];
		}		
		this.dragging = false;
	},
	drawEdge: function(node1, node2){
		var center1 = this.getCenter(node1);
		var center2 = this.getCenter(node2);
		this.edges.line(center1.x, center1.y, center2.x, center2.y)
			.attr({class: 'graph-line line'+node1+' line'+node2});
	},
	drawTempEdge: function(node1, cursor){
		center = this.getCenter(node1);
		this.tempEdges.line(center.x, center.y, cursor.x, cursor.y)
			.attr({class: 'graph-line'});
	},
	deleteEdge: function(line, node1, node2){
		line.remove();
		this.graph.disconnectNodes(node1, node2, true);
	},
	beginConnection: function(node){
		this.snap.mousemove(watchMouse);
		var self = this;
		function watchMouse(e){
			self.tempEdges.clear();
			self.drawTempEdge(node, {x: e.clientX, y: e.clientY});
		}
	},
	completeConnection: function(node1, node2){
		this.tempEdges.clear();
		this.snap.unmousemove();
		if(node1 === undefined) return;
		if(this.graph.getNode(node1).isNeighbor(node2)) return;
		if(node1 === node2) return;
		this.drawEdge(node1, node2);
		this.graph.connectNodes(node1, node2, this.getDistance(this.getCenter(node1), this.getCenter(node2)), true);
	},
	getCenter: function(node){
		var bound = this.nodes.select('#node'+node).getBBox();
		return {x:bound.cx, y:bound.cy};
	},
	getDistance: function(center1, center2){
		return Math.sqrt(Math.pow(center2.x-center1.x, 2)+Math.pow(center2.y-center1.y, 2));
	}
}
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
var GridDisplay = function(arrayWidth, squareWidth){
	this.snap = s[1];
	this.squareWidth = squareWidth;
	this.array = this.createArray(arrayWidth);
	this.bound = this.snap.getBBox();
	this.squares = this.snap.group();
	this.drawGrid(squareWidth);
	this.start = [0,0];
	this.finish = [0,0];

}
GridDisplay.prototype = {
	createArray: function(width){
		var array = [];
		for(var i=0; i<width; i++){
			var tempArray = [];
			for(var j=0; j<width; j++){
				tempArray.push(1);
			}
			array.push(tempArray);
		}
		return array;
	},
	drawGrid: function(squareWidth){
		var xLength = this.array[0].length;
		var yLength = this.array.length;
		var x=0, y=0;
		for(var i=0; i<yLength; i++){
			x=0;
			y=squareWidth*i;
			for(var j=0; j<xLength; j++){
				x=squareWidth*j
				this.squares.rect(x, y, squareWidth, squareWidth).attr({class: 'grid-square', id: 'coord'+j+'-'+i});
			}
		}
	},
	paintSquare: function(coord, color){
		if(color === undefined) color = 0;
		this.squares.select('#coord'+coord[0]+'-'+coord[1]).addClass('type'+color);
	},
	unpaintSquare: function(coord){
		var square = this.squares.select('#coord'+coord[0]+'-'+coord[1]);
		var classList = square.node.className.baseVal.split(' ');
		for(classy in classList){
			if(classList[classy]!= 'grid-square'){
				square.removeClass(classList[classy]);
			}
		}
	},
	setStart: function(coord){
		this.squares.select('#coord'+this.start[0]+'-'+this.start[1]).removeClass('grid-start');
		this.squares.select('#coord'+coord[0]+'-'+coord[1]).addClass('grid-start');
		this.start = coord;
	},
	setFinish: function(coord){
		this.squares.select('#coord'+this.finish[0]+'-'+this.finish[1]).removeClass('grid-finish');
		this.squares.select('#coord'+coord[0]+'-'+coord[1]).addClass('grid-finish');
		this.finish = coord;
	}

}
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
var PointDisplay = function(){
	var snap = s[2];
}
