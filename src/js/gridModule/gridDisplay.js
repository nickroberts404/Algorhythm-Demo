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