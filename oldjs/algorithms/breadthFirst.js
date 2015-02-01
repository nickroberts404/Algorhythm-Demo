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
