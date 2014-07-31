function FormantChart(parameters,elementId) {
	this.p = parameters;
    this.elementId = elementId;
    
	this.draw = function() {
		$('svg').remove();
		
		$('#' + this.elementId ).width( this.p.figWidth );

        this.paper = Raphael(this.elementId, this.p.figWidth, this.p.figHeight );

        this.drawTrapezoid();
        this.drawHorizontalLines();
        this.drawVerticalLines();
        for(var i=0; i<this.data.length; i++) {
            this.plotPoint( this.data[i][1], this.data[i][2], this.data[i][0] );
        }
    }
	
	this.toSvg = function() {
		var svgCode = this.paper.toSVG();
		a = document.createElement('a');
		a.download = 'mySvg.svg';
		a.type = 'image/svg+xml';
		blob = new Blob([svgCode], {"type": "image/svg+xml"});
		a.href = (window.URL || webkitURL).createObjectURL(blob);
		a.click();
	}

	this.drawTrapezoid = function() {
        var command = "M" + this.plotLeft() + "," + this.plotTop() +
                        "H" + this.plotRight() +
                        "V" + this.plotBottom() +
                        "H" + (this.plotRight() - this.p.trapezoidRatio * this.plotWidth()) +
                        "L" + this.plotLeft() + "," + this.plotTop();
        var p = this.paper.path(command);
        p.attr("stroke-width" , this.p.trapezoidLineWidth );
        p.attr("stroke", this.p.trapezoidLineColor );
	}

	this.drawHorizontalLines = function() {
        var intervalSize = this.plotHeight() / (1 + this.p.horizontalLines);
        for(var i=1; i<=this.p.horizontalLines; i++) {
            var y = i*intervalSize;
            var right = this.plotRight();
            var left = this.plotLeft() + y * ( (1-this.p.trapezoidRatio) * this.plotWidth() ) / this.plotHeight();
            var command = "M" + right + "," + (this.plotTop() + y) +
                            "L" + left + "," + (this.plotTop() + y);
            var p = this.paper.path(command);
            p.attr("stroke-width", this.p.gridLineWidth );
            p.attr("stroke", this.p.gridLineColor );
        }
	}

	this.drawVerticalLines = function() {
        var intervalSize = this.plotWidth() / (1 + this.p.verticalLines);
        for(var i=1; i<=this.p.verticalLines; i++) {
            var command = "M" + (this.plotRight() - i*intervalSize) + "," + this.plotTop() +
                            "L" + (this.plotRight() - i*intervalSize*this.p.trapezoidRatio) + "," + this.plotBottom();
            var p = this.paper.path(command);
            p.attr("stroke-width", this.p.gridLineWidth );
            p.attr("stroke", this.p.gridLineColor );
        }
	}

	this.plotPoint = function(f1, f2, label) {
        x = this.positionX(f2);
        y = this.positionY(f1);
        if( this.p.markType == "labeled-dot" ) {
            this.drawDot( x, y );
            this.drawText( x+2*this.p.dotRadius, y-2*this.p.dotRadius, label, true );
        } else if( this.p.markType == "label-only" ) {
            this.drawText( x+2*this.p.dotRadius, y-2*this.p.dotRadius, label, false );
        } else if( this.p.markType == "dot-only" ) {
            this.drawDot( x, y );
        }
    }
    
    this.drawDot = function(x, y) {
        var d = this.paper.circle( x, y , this.p.dotRadius );
        d.attr("fill", this.p.dotFillColor );
        d.attr("stroke-width", 0 );
    }
    
    this.drawText = function(x, y, label, startAnchor) {
        var t = this.paper.text(x, y, label);
        if( startAnchor == true ) {
            t.attr("text-anchor","start");
        }
        t.attr("font-family", this.p.fontFamily );
        t.attr("font-size", this.p.fontSize );
        t.node.setAttribute("class", "draggable"); 
        t.drag(move, start, up);
    }

	this.positionY = function(f1) {
		return this.plotTop() + this.plotHeight()*(f1 - this.p.f1Min)/(this.p.f1Max - this.p.f1Min);
	}
	
	this.positionX = function(f2) {
		return this.plotRight() - this.plotWidth()*(f2 - this.p.f2Min)/(this.p.f2Max - this.p.f2Min);
	}
    
    this.plotLeft = function() {
        return this.p.figMargin;
    }
    
    this.plotRight = function() {
        return this.p.figWidth - this.p.figMargin;
    }
    
    this.plotTop = function() {
        return this.p.figMargin;
    }
    
    this.plotWidth = function() {
        return this.p.figWidth - 2 * this.p.figMargin;
    }
    
    this.plotHeight = function() {
        return this.p.figHeight - 2 * this.p.figMargin;
    }
    
    this.plotBottom = function() {
        return this.p.figHeight - this.p.figMargin;
    }
    
	this.removeFormantLimits = function() {
            delete this.p.f1Max;
            delete this.p.f2Max;
            delete this.p.f1Min;
            delete this.p.f2Min;
	}
    
    this.minimax = function() {
        if( !( this.p.hasOwnProperty("f1Max") && this.p.hasOwnProperty("f2Max") && this.p.hasOwnProperty("f1Min") && this.p.hasOwnProperty("f2Min") ) ) {
            maxF1 = Math.max.apply(Math, this.data.map(function(v) {
              return v[1];
                }));

            maxF2 = Math.max.apply(Math, this.data.map(function(v) {
              return v[2];
                }));

            minF1 = Math.min.apply(Math, this.data.map(function(v) {
              return v[1];
                }));

            minF2 = Math.min.apply(Math, this.data.map(function(v) {
              return v[2];
                }));
            
            multiplier = 0.1;
            F1range = maxF1 - minF1;
            F2range = maxF2 - minF2;
            this.p.f1Max = Math.round( maxF1 + multiplier*F1range );
            this.p.f2Max = Math.round( maxF2 + multiplier*F2range );
            this.p.f1Min = Math.round( minF1 - multiplier*F1range );
            this.p.f2Min = Math.round( minF2 - multiplier*F2range );
        }
    }
    
    this.setData = function(data) {
        if( toType(data) == "string" ) {
            this.data = parseStringTable(data);
        } else {
            this.data = data;
        }
        this.minimax();
        this.draw();
    }
	
    parseStringTable = function(plainText) {
        var dataTable = [];
        var lines = plainText.trim().split(/[\n\r]/);
        for(var i=0; i<lines.length; i++) {
            var elements = lines[i].trim().split("\t");
            dataTable.push( [ elements[0] , elements[1], elements[2] ] );
        }
        return dataTable;
    }
    
    /// utility functions
    toType = function(obj) {
      return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    }
}