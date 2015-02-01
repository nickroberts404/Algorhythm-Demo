var GraphDisplay = function(){
	this.snap = s[0];
	this.graph = new Graph();
	this.nodes = snap.group();
	this.index = 0;
}
GraphDisplay.prototype = {
	addNode: function(x, y){
		this.nodes.circle(x, y, 10);
	}
}