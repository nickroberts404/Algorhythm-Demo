var s = [Snap(), Snap(), Snap()];
document.getElementById('graph-page').appendChild(s[0].node);
document.getElementById('grid-page').appendChild(s[1].node);
document.getElementById('point-page').appendChild(s[2].node);

var GraphDisplay = function(){
	this.graph = new Graph();
	this.snap = s[0];
	this.nodeIndex = 0;
	this.permaLines = this.snap.group();
	this.tempLines = this.snap.group();
	this.tempNodes = this.snap.group();
	this.permaNodes = this.snap.group();
	this.currentNode = '';
	this.currentLines = [];
	this.isDragging = false;
	this.connectedNodes = [];
}
GraphDisplay.prototype = {
	drawNode: function(x, y){
		this.tempNodes.circle(x, y, 0).attr({class: "graph-node", id: "node"+this.nodeIndex}).animate({r:30}, 100, mina.easeinout).drag(preDragMove, preDragStart, preDragEnd);
		this.graph.addNode(x, y, 1);
		this.nodeIndex++;
		var self = this;
		function preDragMove(dx, dy, x, y){self.dragMove(dx, dy, x, y, this)}
		function preDragStart(x, y){self.dragStart(x, y, this)}
		function preDragEnd(x, y){self.dragEnd(x, y, this)}
	},
	drawStart: function(x, y){
		this.permaNodes.circle(x, y, 0).attr({id: "node"+this.nodeIndex, class: "graph-node start-node"}).animate({r:30}, 300, mina.easeinout).drag(preDragMove, preDragStart, preDragEnd);
		this.graph.addNode(x, y, 1);
		this.nodeIndex++;
		var self = this;
		function preDragMove(dx, dy, x, y){self.dragMove(dx, dy, x, y, this)}
		function preDragStart(x, y){self.dragStart(x, y, this)}
		function preDragEnd(x, y){self.dragEnd(x, y, this)}
	},
	drawEnd: function(x, y){
		this.permaNodes.circle(x, y, 0).attr({id: "node"+this.nodeIndex, class: "graph-node end-node"}).animate({r:30}, 300, mina.easeinout).drag(preDragMove, preDragStart, preDragEnd);
		this.graph.addNode(x, y, 1);
		this.nodeIndex++;
		var self = this;
		function preDragMove(dx, dy, x, y){self.dragMove(dx, dy, x, y, this)}
		function preDragStart(x, y){self.dragStart(x, y, this)}
		function preDragEnd(x, y){self.dragEnd(x, y, this)}
	},
	dragMove: function(dx, dy, x, y, node){
		node.attr({
            transform: node.data('origTransform') + (node.data('origTransform') ? "T" : "t") + [dx, dy]
        });
        thisID = node.node.id.slice(4);
        this.tempLines.clear();
        if(!this.isDragging){
        	this.isDragging = true;
        	var edges = this.graph.getNode(thisID).edges;
        	var lines = this.permaLines.selectAll('.line'+thisID).items;
        	for(line in lines) lines[line].remove();
        	for(edge in edges){
        		targetID = edges[edge].target.id
        		this.connectedNodes.push(targetID);
        	}
        }
        for(neighbor in this.connectedNodes){
        	current = this.connectedNodes[neighbor];
        	this.drawLineBetweenNodes(thisID, current, false);
        }

	},
	dragStart: function(x, y, node){
		node.data('origTransform', node.transform().local );
	},
	dragEnd: function(x, y, node){
		this.isDragging = false;
		thisID = node.node.id.slice(4);
		for(neighbor in this.connectedNodes){
        	current = this.connectedNodes[neighbor];
        	this.drawLineBetweenNodes(thisID, current, true);
        }
        this.tempLines.clear();
		this.connectedNodes = [];
	},
	drawLineBetweenNodes: function(node1ID, node2ID, perma){
		var node1 = this.snap.select('#node'+node1ID);
		var node2 = this.snap.select('#node'+node2ID);
		var bound1 = node1.getBBox();
		var bound2 = node2.getBBox();
		if(perma){
			this.permaLines.line(bound1.cx, bound1.cy, bound2.cx, bound2.cy).attr({class:"perma-line line"+node1ID+" line"+node2ID});
		}
		else{
			this.tempLines.line(bound1.cx, bound1.cy, bound2.cx, bound2.cy).attr({class:"temp-line line"+node1ID+" line"+node2ID});
		}
	},
	drawLineFromNode: function(node1ID, x, y){
		var node1 = this.snap.select('#node'+node1ID);
		var bound1 = node1.getBBox();
		this.tempLines.line(bound1.cx, bound1.cy, x, y).attr({class:"temp-line"});

	},
	startConnect: function(nodeID){
		this.currentNode = nodeID;
		var self = this;
		this.snap.mousemove(watchMouse);
		function watchMouse(e){
			self.tempLines.clear();
			self.drawLineFromNode(nodeID, e.x, e.y);
		}
	},
	endConnect: function(nodeID){
		this.snap.unmousemove();
		this.tempLines.clear();
		if(!this.graph.getNode(this.currentNode).isNeighbor(nodeID)){
			this.drawLineBetweenNodes(this.currentNode, nodeID, true);
			this.graph.connectNodes(this.currentNode ,nodeID, 1, true);	
		}
	},
	deleteLine: function(line, node1, node2){
		line.remove();
		this.graph.disconnectNodes(node1, node2, true);
	}

}

var gd = new GraphDisplay();
gd.drawStart(200, 200);
gd.drawEnd(400, 200);
$('#graph-page').on('mousedown', graphClick);
$('#graph-page').on('mouseup', graphUnclick);

var clickx = 0;
var clicky = 0;
// 0: no connection activity, 1: Just connected, 2: Connect mode
var connectStatus = 0;
function graphClick(e){
	if(e.target.nodeName == 'circle'){
		if(connectStatus === 2){
			gd.endConnect(e.target.id.slice(4));
			connectStatus = 1;
		}
		clickx = e.clientX;
		clicky = e.clientY;
	}
	else if(e.target.nodeName == 'svg'){
		if(connectStatus === 2){
			gd.endConnect();
			connectStatus = false;
		}
		else gd.drawNode(e.clientX, e.clientY);
	}
}
function graphUnclick(e){
	if(e.target.nodeName == 'circle'){
		if(clickx == e.clientX && clicky == e.clientY){
			if(connectStatus === 1){
				console.log('Nodes Connected!');
				connectStatus = 0;
			}
			else{
				console.log('No Drag!');
				connectStatus = 2;
				gd.startConnect(e.target.id.slice(4));
			}
		}
		else{
			console.log('Drag!');
		}
	}
	else if(e.target.nodeName =='line'){
		classList = e.target.classList.toString().split(' ');
		gd.deleteLine(e.target, classList[1].slice(4), classList[2].slice(4));
	}
}

