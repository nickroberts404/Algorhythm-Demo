// DEPENDENCIES: none
//
// Binary Heap courtesy of Marijn Haverbeke, author of the fantastic Eloquent Javascript.
// http://eloquentjavascript.net/appendix2.html
//

function BinaryHeap(scoreFunction){
  this.content = [];
  this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
  push: function(element) {
    // Add the new element to the end of the array.
    this.content.push(element);
    // Allow it to bubble up.
    this.bubbleUp(this.content.length - 1);
  },

  pop: function() {
    // Store the first element so we can return it later.
    var result = this.content[0];
    // Get the element at the end of the array.
    var end = this.content.pop();
    // If there are any elements left, put the end element at the
    // start, and let it sink down.
    if (this.content.length > 0) {
      this.content[0] = end;
      this.sinkDown(0);
    }
    return result;
  },

  remove: function(node) {
    var length = this.content.length;
    // To remove a value, we must search through the array to find
    // it.
    for (var i = 0; i < length; i++) {
      if (this.content[i] != node) continue;
      // When it is found, the process seen in 'pop' is repeated
      // to fill up the hole.
      var end = this.content.pop();
      // If the element we popped was the one we needed to remove,
      // we're done.
      if (i == length - 1) break;
      // Otherwise, we replace the removed element with the popped
      // one, and allow it to float up or sink down as appropriate.
      this.content[i] = end;
      this.bubbleUp(i);
      this.sinkDown(i);
      break;
    }
  },

  size: function() {
    return this.content.length;
  },


  bubbleUp: function(n) {
    // Fetch the element that has to be moved.
    var element = this.content[n], score = this.scoreFunction(element);
    // When at 0, an element can not go up any further.
    while (n > 0) {
      // Compute the parent element's index, and fetch it.
      var parentN = Math.floor((n + 1) / 2) - 1,
      parent = this.content[parentN];
      // If the parent has a lesser score, things are in order and we
      // are done.
      if (score >= this.scoreFunction(parent))
        break;

      // Otherwise, swap the parent with the current element and
      // continue.
      this.content[parentN] = element;
      this.content[n] = parent;
      n = parentN;
    }
  },

  sinkDown: function(n) {
    // Look up the target element and its score.
    var length = this.content.length,
    element = this.content[n],
    elemScore = this.scoreFunction(element);

    while(true) {
      // Compute the indices of the child elements.
      var child2N = (n + 1) * 2, child1N = child2N - 1;
      // This is used to store the new position of the element,
      // if any.
      var swap = null;
      // If the first child exists (is inside the array)...
      if (child1N < length) {
        // Look it up and compute its score.
        var child1 = this.content[child1N],
        child1Score = this.scoreFunction(child1);
        // If the score is less than our element's, we need to swap.
        if (child1Score < elemScore)
          swap = child1N;
      }
      // Do the same checks for the other child.
      if (child2N < length) {
        var child2 = this.content[child2N],
        child2Score = this.scoreFunction(child2);
        if (child2Score < (swap == null ? elemScore : child1Score))
          swap = child2N;
      }

      // No need to swap further, we are done.
      if (swap == null) break;

      // Otherwise, swap and continue.
      this.content[n] = this.content[swap];
      this.content[swap] = element;
      n = swap;
    }
  }
};
// DEPENDENCIES: none

var Graph = function(options){
	this.nodes = [];
	this.nodeIDList = [];
	this.nodeID = 0;
	this.options = options || {};
}

Graph.prototype = {
	addNode: function(x, y, weight){
		var id = this.nodeID;
		this.nodes.push(new Node(x, y, weight, id));
		this.nodeIDList.push(id);
		this.nodeID++;
		return id;
	},
	removeNode: function(id){
		var index = this.nodeIDList.indexOf(id);
		var node = this.nodes[index];
		node.removeAllEdges();
		this.nodes.splice(index, 1);
		this.nodeIDList.splice(index, 1);
	},
	connectNodes: function(id1, id2, weight, undirected){
		var node1 = this.nodes[this.nodeIDList.indexOf(parseInt(id1))];
		var node2 = this.nodes[this.nodeIDList.indexOf(parseInt(id2))];
		node1.addEdge(new Edge(node2, weight));
		// console.log(weight);
		if(undirected){
			node2.addEdge(new Edge(node1, weight));
		}
	},
	disconnectNodes: function(id1, id2, undirected){
		var node1 = this.nodes[this.nodeIDList.indexOf(parseInt(id1))];
		var node2 = this.nodes[this.nodeIDList.indexOf(parseInt(id2))];
		var undirected = undirected || true;
		node1.removeEdge(node2);
		if(undirected){
			node2.removeEdge(node1);
		}
	},
	getNode: function(id){
		return this.nodes[this.nodeIDList.indexOf(parseInt(id))];
	},
	cleanNodes: function(){
		for(node in this.nodes){
			var aNode = this.nodes[node];
			aNode.visited = false;
			aNode.cost = 9999999;
			aNode.parent = '';
		}
	},
	getPath: function(startingNodeID, endingNodeID){
		var path = [endingNodeID];
		var child = this.getNode(endingNodeID);
		var parent = child.parent;
		while(parent!=null){
			path.push(parent.id);
			child = parent;
			parent = child.parent;
		}
		return(path.reverse())
	},
	readNodes: function(){
		for(node in this.nodes){
			console.log(this.nodes[node]);
		}
	}
}


var Node = function(x, y, weight, id){
	this.id = id;
	this.x = x;
	this.y = y;
	this.weight = weight;
	this.cost = 0;
	this.estimate = 0;
	this.visited = false;
	this.edges = [];
	this.parent = '';
}

Node.prototype = {
	addEdge: function(edge){
		this.edges.push(edge);
	},
	removeEdge: function(target){
		var index = -1;
		for(var i=0; i<this.edges.length; i++){
			var e = this.edges[i];
			if(e.target == target) index = i;
		}
		if(index>=0) this.edges.splice( index, 1 );
		else console.log('There was no connection');
	},
	removeAllEdges: function(){
		for(var i=0; i<this.edges.length; i++){
			this.edges[i].target.removeEdge(this);
		}
		this.edges = [];
	},
	isNeighbor: function(nodeID){
		for(edge in this.edges){
			if(this.edges[edge].target.id === parseInt(nodeID)) return true;
		}
		return false;
	},
	update: function(updates){
		for(update in updates){
			this[update] = updates[update];
		}
	},
	toString: function(){
		return 'x: '+this.x+' y: '+this.y+' weight: '+this.weight+' Edge Length: '+this.edges.length;
	}
}


var Edge = function(target, weight){
	this.target = target;
	this.weight = weight;
}

Edge.prototype = {

}
// DEPENDENCIES: graph.js


var Grid = function(grid, options){
	Graph.call(this, options);
	this.grid = [];
	this.buildGrid(grid);
	this.connectGrid();
}

Grid.prototype = Object.create(Graph.prototype, {
	buildGrid: { 
	    value: function(grid){ 
	    	console.log('Building grid...');
			for(var i=0; i<grid.length; i++){
				var row = [];
				for(var j=0; j<grid[i].length; j++){
					row.push(this.addNode(j, i, grid[i][j]));
				}
				this.grid.push(row);
			}
			console.log('Grid complete!')
		}
	}, 
	connectGrid: {
		value: function(){
			console.log('Connecting grid...');
			var directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
			var diagonal_directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
			for(var i=0; i<this.grid.length; i++){
				for(var j=0; j<this.grid[i].length; j++){
					var node = this.grid[i][j];
					for(direction in directions){
						var dir = directions[direction];
						var newX = j+dir[0];
						var newY = i+dir[1];
						if((0<=newX && newX<this.grid[i].length) && (0<=newY && newY<this.grid.length)){
							if(this.getNode(this.grid[newY][newX]).weight != this.options.wall){
								this.connectNodes(node, this.grid[newY][newX], 0, false);
							}
						}
					}
					if(this.options.diagonal){
						for(direction in diagonal_directions){
						var dir = diagonal_directions[direction];
						var newX = j+dir[0];
						var newY = i+dir[1];
						if((0<=newX && newX<this.grid[i].length) && (0<=newY && newY<this.grid.length)){
							if(this.getNode(this.grid[newY][newX]).weight != this.options.wall){
								//.41421356237 is 1-sqrt(2).
								this.connectNodes(node, this.grid[newY][newX], 0.4142136, false);
							}
						}
					}
					}
				}
			}
			console.log('Grid connected!');
		}
	},
	getNode: {
		value: function(id){
			if(typeof id == "object"){
				id = this.grid[id[1]][id[0]];
			}
			return this.nodes[this.nodeIDList.indexOf(id)];
		}
	}
});

// DEPENDENCIES: graph.js, heuristics.js, binaryHeap.js

Graph.prototype.astar = function(startingNodeID, endingNodeID, algorithmOptions){
	if(!algorithmOptions.heuristic) algorithmOptions.heuristic = 'manhattan';
	this.cleanNodes();
	var h = new Heuristic()[algorithmOptions.heuristic];
	var frontier = new BinaryHeap(function(node){return node.estimate});
	var startingNode = this.getNode(startingNodeID);
	var closest = startingNode;
	var targetFound = false;
	var checkAvoid = false;
	if(algorithmOptions.avoid != undefined){
		checkAvoid = true;
		if(typeof algorithmOptions.avoid != 'object') algorithmOptions.avoid = [algorithmOptions.avoid];
	}
	startingNode.estimate = 99999999;
	startingNode.cost = 0;
	startingNode.parent = null;
	startingNode.visited = true;
	frontier.push(startingNode);
	while(frontier.size()>0){
		var currentNode = frontier.pop();
		console.log(currentNode);
		if(currentNode.id == endingNodeID){
			targetFound = true;
			break;
		}
		for(edge in currentNode.edges){
			var currentEdge = currentNode.edges[edge];
			var neighbor = currentEdge.target;
			if(checkAvoid){
				if(algorithmOptions.avoid.indexOf(neighbor.weight) != -1) break;
			}
			var newCost = currentNode.cost+currentEdge.weight+neighbor.weight;
			if(!neighbor.visited || newCost<neighbor.cost){
				var estimate = h(this.getNode(endingNodeID), neighbor)+newCost;
				if(algorithmOptions.closest){
					console.log('Hmm is this the new closest node?');
					console.log('Estimate: '+estimate+' closest.estimate: '+closest.estimate );
					if(estimate<closest.estimate || (estimate==closest.estimate && newCost<closest.estimate)){
						console.log('We have a new closest node!');
						closest = neighbor;
					}
				}
				neighbor.cost = newCost;
				neighbor.estimate = estimate;
				neighbor.parent = currentNode;
				neighbor.visited = true;
				frontier.push(neighbor);
			}
		}
	}
	if(targetFound){
		console.log('The is the path to the ending node.');
		this.readPath(startingNodeID, endingNodeID);
	}
	else if(algorithmOptions.closest){
		console.log('This is the path to the closest node.');
		this.readPath(startingNodeID, closest.id);
	}
	else{
		console.log('Sorry, the path cannot be completed.');
	}
}
// DEPENDENCIES: graph.js

Graph.prototype.breadthFirst = function(startingNodeID, endingNodeID){
	startingNodeID = parseInt(startingNodeID);
	endingNodeID = parseInt(endingNodeID);
	this.cleanNodes();
	var frontier = [];
	this.getNode(startingNodeID).parent = null;
	this.getNode(startingNodeID).visited = true;
	var foundTarget = false;
	frontier.push(startingNodeID);
	while(frontier.length>0){
		var currentID = frontier.shift();
		if(currentID == endingNodeID) {
			foundTarget = true;
			break;
		}
		var currentNode = this.getNode(currentID);
		for(edge in currentNode.edges){
			var neighbor = currentNode.edges[edge].target;
			if(!neighbor.visited) {
				neighbor.visited = true;
				neighbor.parent = currentNode;
				frontier.push(neighbor.id);
			}
		}
	}
	if(foundTarget) return this.getPath(startingNodeID, endingNodeID);
	else return false;
}

// DEPENDENCIES: graph.js, binaryHeap.js

Graph.prototype.dijkstras = function(startingNodeID, endingNodeID){
	this.cleanNodes();
	var frontier = new BinaryHeap(function(node){return node.cost});
	var startingNode = this.getNode(startingNodeID);
	var targetFound = false;
	startingNode.cost = 0;
	startingNode.parent = null;
	startingNode.visited = true;
	frontier.push(startingNode);
	while(frontier.size()>0){
		var currentNode = frontier.pop();
		console.log(currentNode);
		if(currentNode.id == endingNodeID){
			targetFound = true;
			break;
		}
		for(edge in currentNode.edges){
			var currentEdge = currentNode.edges[edge];
			var neighbor = currentEdge.target;
			var newCost = currentNode.cost+currentEdge.weight+neighbor.weight;
			if(newCost<neighbor.cost || !neighbor.visited){
				neighbor.cost = newCost;
				neighbor.visited = true;
				neighbor.parent = currentNode;
				frontier.push(neighbor);
			}
		}
	}
	if(targetFound) return this.getPath(startingNodeID, endingNodeID);
	else return false;
}
// DEPENDENCIES: graph.js, heuristics.js, binaryHeap.js

Graph.prototype.greedyBest = function(startingNodeID, endingNodeID, algorithmOptions){
	if(!algorithmOptions.heuristic) algorithmOptions.heuristic = 'manhattan';
	this.cleanNodes();
	var h = new Heuristic()[algorithmOptions.heuristic];
	var frontier = new BinaryHeap(function(node){return node.estimate});
	var startingNode = this.getNode(startingNodeID);
	endingNodeID = this.getNode(endingNodeID).id;
	var closest = startingNode;
	var targetFound = false;
	var checkAvoid = false;
	if(algorithmOptions.avoid != undefined){
		checkAvoid = true;
		if(typeof algorithmOptions.avoid != 'object') algorithmOptions.avoid = [algorithmOptions.avoid];
	}
	startingNode.estimate = 99999;
	startingNode.parent = null;
	frontier.push(startingNode);
	while(frontier.size()>0){
		var currentNode = frontier.pop();
		console.log(currentNode);
		if(currentNode.id == endingNodeID){
			targetFound = true;
			break;
		}
		for(edge in currentNode.edges){
			var currentEdge = currentNode.edges[edge];
			var neighbor = currentEdge.target;
			if(checkAvoid){
				if(algorithmOptions.avoid.indexOf(neighbor.weight) != -1) break;
			}
			if(neighbor.parent == ''){
				var estimate = h(this.getNode(endingNodeID), neighbor);
				neighbor.estimate = estimate;
				neighbor.parent = currentNode;
				if(algorithmOptions.closest){
					if(estimate<closest.estimate) closest = neighbor;
				}
				frontier.push(neighbor);
			}
		}
	}
	if(targetFound){
		console.log('The is the path to the ending node.');
		this.readPath(startingNodeID, endingNodeID);
	}
	else if(algorithmOptions.closest){
		console.log('This is the path to the closest node.');
		this.readPath(startingNodeID, closest.id);
	}
	else{
		console.log('Sorry, the path cannot be completed.');
	}
}
var Heuristic = function(){};

Heuristic.prototype = {
	manhattan: function(pos1, pos2){
		return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
	},
	diagonal: function(pos1, pos2){

	},
	chebyschev: function(pos1, pos2){

	}
}