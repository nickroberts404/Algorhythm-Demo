var s = [Snap(), Snap(), Snap()];
document.getElementById('graph-page').appendChild(s[0].node);
document.getElementById('grid-page').appendChild(s[1].node);
document.getElementById('point-page').appendChild(s[2].node);

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

var GridDisplay = function(){
	var snap = s[1];
}

var PointDisplay = function(){
	var snap = s[2];
}