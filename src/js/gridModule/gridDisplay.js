var GridDisplay = function(arrayWidth, squareWidth){
	this.snap = s[1];
	this.squareWidth = squareWidth;
	this.array = this.createArray(arrayWidth);
	this.bound = this.snap.getBBox();
	this.squares = this.snap.group();
	this.drawGrid(squareWidth);

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
	}


}