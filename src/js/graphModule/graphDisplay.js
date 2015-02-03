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
	deleteNode: function(node){
		this.snap.unmousemove();
    	var edges = this.graph.getNode(node).edges;
    	for (edge in edges){
    		this.connectedNodes.push(edges[edge].target.id);
    	}
    	for(anode in this.connectedNodes){
        	var current = this.connectedNodes[anode];
        	console.log(current);
        	this.edges.select('.line'+node+'.line'+current).remove();
        }
        this.nodes.select('#node'+node).remove();
        this.graph.removeNode(node);
        this.connectedNodes = [];
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
        	var current = this.connectedNodes[anode];
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