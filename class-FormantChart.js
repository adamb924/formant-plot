function FormantChart(parameters,elementId) {
	this.p = parameters;
    this.elementId = elementId;
	this.canvasElement = $('#' + this.elementId );

	this.draw = function() {
		$('svg').remove();
		
		this.canvasElement.width( this.p.figWidth );

        this.paper = Raphael(this.elementId, this.p.figWidth, this.p.figHeight );

        this.drawHorizontalLines();
        this.drawVerticalLines();
        this.drawTrapezoid();
        for(var i=0; i<this.data.length; i++) {
			if( this.data[i].length > 3 ) {
				this.plotPoint( this.data[i][1], this.data[i][2], this.data[i][0], i, this.data[i][3] );
			} else {
				this.plotPoint( this.data[i][1], this.data[i][2], this.data[i][0], i );
			}
        }

		window.chart.canvasElement.mousemove(function (event) {
		if( window.shifted ) {
				var bnds = document.getElementById( window.chart.elementId ).getBoundingClientRect();
				var fx = (event.clientX - bnds.left)/bnds.width * window.chart.canvasElement.width();
				var fy = (event.clientY - bnds.top)/bnds.height * window.chart.canvasElement.height();	
				$('#coordinates').text( 'F1: ' + window.chart.f1(fy) + ', F2: ' + window.chart.f2(fx) );
			}
        });

		$('#' + this.elementId ).mouseleave(function (event) {
			$('#coordinates').text("");
        });
		
		$('[title!=""]').qtip({ style: { classes: 'qtip-shadow custom-qtip' } });
    };
	
	this.toSvg = function() {
		var svgCode = this.paper.toSVG();
		a = document.createElement('a');
		a.download = 'mySvg.svg';
		a.type = 'image/svg+xml';
		blob = new Blob([svgCode], {"type": "image/svg+xml"});
		a.href = (window.URL || webkitURL).createObjectURL(blob);
		a.click();
	};

	this.drawTrapezoid = function() {
        var command = "M" + this.plotLeft() + "," + this.plotTop() +
                        "H" + this.plotRight() +
                        "V" + this.plotBottom() +
                        "H" + (this.plotRight() - this.p.trapezoidRatio * this.plotWidth()) +
                        "L" + this.plotLeft() + "," + this.plotTop();
        var p = this.paper.path(command);
        p.attr("stroke-width" , this.p.trapezoidLineWidth );
        p.attr("stroke", this.p.trapezoidLineColor );
	};

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
	};

	this.drawVerticalLines = function() {
        var intervalSize = this.plotWidth() / (1 + this.p.verticalLines);
        for(var i=1; i<=this.p.verticalLines; i++) {
            var command = "M" + (this.plotRight() - i*intervalSize) + "," + this.plotTop() +
                            "L" + (this.plotRight() - i*intervalSize*this.p.trapezoidRatio) + "," + this.plotBottom();
            var p = this.paper.path(command);
            p.attr("stroke-width", this.p.gridLineWidth );
            p.attr("stroke", this.p.gridLineColor );
        }
	};

	this.plotPoint = function(f1, f2, label, index, title) {
		title = typeof title !== 'undefined' ? title : '';
        var x = this.positionX(f2);
        var y = this.positionY(f1);
        if( this.p.markType == "labeled-dot" ) {
            d = this.drawDot( x, y );
            t = this.drawText( x+2*this.p.dotRadius, y-2*this.p.dotRadius, label, true );
        } else if( this.p.markType == "label-only" ) {
            t = this.drawText( x+2*this.p.dotRadius, y-2*this.p.dotRadius, label, false );
        } else if( this.p.markType == "dot-only" ) {
            d = this.drawDot( x, y );
        }
		if( typeof t !== 'undefined' ) {
			t.node.setAttribute("title", this.formatToolTip(f1, f2, label, title) ); 
			t.node.setAttribute("data-index", index ); 
		}
		if( typeof d !== 'undefined' ) {
			d.node.setAttribute("title", this.formatToolTip(f1, f2, label, title) ); 
			d.node.setAttribute("data-index", index ); 
		}
    };
    
    this.drawDot = function(x, y) {
        var d = this.paper.circle( x, y , this.p.dotRadius );
        d.attr("fill", this.p.dotFillColor );
        d.attr("stroke-width", 0 );
		return d;
    };
    
    this.drawText = function(x, y, label, startAnchor ) {
        var t = this.paper.text(x, y, label);
        if( startAnchor === true ) {
            t.attr("text-anchor","start");
        }
        t.attr("font-family", this.p.fontFamily );
        t.attr("font-size", this.p.fontSize );
        t.node.setAttribute("class", "draggable"); 
        t.drag(move, start, up);
		return t;
    };
	
	this.formatToolTip = function(x, y, label, title) {
		return "<p>" + label + " (" + x + ", " + y + ")</p><p>" + title + "</p>";
	};

	this.positionY = function(f1) {
		return this.plotTop() + this.plotHeight()*(f1 - this.p.f1Min)/(this.p.f1Max - this.p.f1Min);
	};
	
	this.positionX = function(f2) {
		return this.plotRight() - this.plotWidth()*(f2 - this.p.f2Min)/(this.p.f2Max - this.p.f2Min);
	};

	this.f1 = function(y) {
		return Math.round( ( (y - this.plotTop()) / this.plotHeight() ) * (this.p.f1Max - this.p.f1Min) + this.p.f1Min );
	};
	
	this.f2 = function(x) {
		return Math.round( ( ( this.plotRight() - x ) / this.plotWidth() ) * (this.p.f2Max - this.p.f2Min) + this.p.f2Min );
	};
    
    this.plotLeft = function() {
        return this.p.figMargin;
    };
    
    this.plotRight = function() {
        return this.p.figWidth - this.p.figMargin;
    };
    
    this.plotTop = function() {
        return this.p.figMargin;
    };
    
    this.plotWidth = function() {
        return this.p.figWidth - 2 * this.p.figMargin;
    };
    
    this.plotHeight = function() {
        return this.p.figHeight - 2 * this.p.figMargin;
    };
    
    this.plotBottom = function() {
        return this.p.figHeight - this.p.figMargin;
    };
    
	this.removeFormantLimits = function() {
            delete this.p.f1Max;
            delete this.p.f2Max;
            delete this.p.f1Min;
            delete this.p.f2Min;
	};
    
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
    };
    
    this.setData = function(data) {
        if( toType(data) == "string" ) {
            this.data = parseStringTable(data);
        } else {
            this.data = data;
        }
        this.minimax();
        this.draw();
    };
		
    parseStringTable = function(plainText) {
        var labels = [];
        var dataTable = [];
        var lines = plainText.trim().split(/[\n\r]/);
		var commentPrefix = $("#ignore-lines").val();
        for(var i=0; i<lines.length; i++) {
			if( commentPrefix.length === 0 || commentPrefix != lines[i].substr(0, commentPrefix.length) ) {
				var elements = lines[i].trim().split(/\t+/);
				dataTable.push( elements );
				labels.push( elements[0] );
			}
        }
		labels = labels.filter( onlyUnique ).sort();
		$('#labels')
			.find('option')
			.remove();
		$('#labels')
			 .append($("<option></option>"));
		$.each(labels, function(key, value) {   
			 $('#labels')
				 .append($("<option></option>")
				 .text(value)); 
		});
        return dataTable;
    };
    
    /// utility functions
    toType = function(obj) {
      return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    };
}

function onlyUnique(value, index, self) { 
	return self.indexOf(value) === index;
}
