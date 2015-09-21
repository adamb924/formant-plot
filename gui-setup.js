$( document ).ready(function() {
	
$('#control-panel > h1').click(function() {
	$(this).next().toggle();
});

window.chart = new FormantChart({
	figWidth: 600,
	figHeight: 400,
	figMargin: 10,
	trapezoidRatio: 0.7,
	horizontalLines: 2,
	verticalLines: 1,
	dotRadius: 2,
	dotFillColor: "#000000",
	fontSize: 15,
	fontFamily: "Charis SIL",
	markType: "labeled-dot",
//    markType: "label-only",
//    markType: "dot-only",
	gridLineColor: "#aaaaaa",
	gridLineWidth: 1,
	trapezoidLineColor: "#000000",
	trapezoidLineWidth: 2,
	}, "canvas");
window.chart.setData( $("#formant-values").val() );

window.shifted = false;
$(document).on('keyup keydown', function(e){
	window.shifted = e.shiftKey; 
	if( window.shifted ) {
		$('#canvas').addClass('crosshairs');
	} else {
		$('#canvas').removeClass('crosshairs');
		$('#coordinates').text("");
	}
} );

$( "#tabs" ).tabs();
	
$( "#generate-button" )
	.button()
		.click(function() {
            chart.setData( $("#formant-values").val() );
            return false;
		});

$( "#download-button" )
	.button()
		.click(function() {
			var svgCode = chart.paper.toSVG();
			blob = new Blob([svgCode], {"type": "image/svg+xml"});
			$("#download-form").attr("action", (window.URL || webkitURL).createObjectURL(blob) );
		});

$( "#min-max" )
	.button()
		.click(function() {
            chart.removeFormantLimits();
            chart.minimax();
            setGuiElementsFromData(chart);
            chart.draw();
		});

$('#intermediateLineColor').ColorPicker({
	color: '#aaaaaa',
	onShow: function (colpkr) {
		$(colpkr).fadeIn(500);
		return false;
	},
	onHide: function (colpkr) {
		$(colpkr).fadeOut(500);
		return false;
	},
	onChange: function (hsb, hex, rgb) {
		chart.p.gridLineColor = "#" + hex;
        chart.draw();
	}
});

$( "#update-highlight" )
	.button()
		.click(function() {
			if( $('#highlightRE').val().length > 0 ) {
				var re = new RegExp( $('#highlightRE').val() );
				$("text > tspan").each(function() {
					var text = $(this).parent();
					var circle = $("circle[data-index="+text.data('index')+"]")
					if( re.test( $(this).text() ) ) {
						text.attr("fill", $('#highlightColor').val() );
						circle.attr("fill", $('#highlightColor').val() );
					} else {
						text.attr("fill", '#000' );
						circle.attr("fill", window.chart.p.dotFillColor );
					}
				});
			}
		});

$('#labels').change(function() {
	var label = $(this).val();
	if( label.length > 0 ) {
		$("text > tspan").each(function() {
			var text = $(this).parent();
			var circle = $("circle[data-index="+text.data('index')+"]")
			if( $(this).text() == label ) {
				text.attr("fill", $('#highlightColor').val() );
				circle.attr("fill", $('#highlightColor').val() );
			} else {
				text.attr("fill", '#000' );
				circle.attr("fill", window.chart.p.dotFillColor );
			}
		});
	} else {
		$("text > tspan").each(function() {
			var text = $(this).parent();
			var circle = $("circle[data-index="+text.data('index')+"]")
			text.attr("fill", '#000' );
			circle.attr("fill", window.chart.p.dotFillColor );
		});		
	}
});		
		
$('#trapezoidLineColor').ColorPicker({
	color: '#aaaaaa',
	onShow: function (colpkr) {
		$(colpkr).fadeIn(500);
		return false;
	},
	onHide: function (colpkr) {
		$(colpkr).fadeOut(500);
		return false;
	},
	onChange: function (hsb, hex, rgb) {
		chart.p.trapezoidLineColor = "#" + hex;
        chart.draw();
	}
});

$('#dotColor').ColorPicker({
	color: '#000000',
	onShow: function (colpkr) {
		$(colpkr).fadeIn(500);
		return false;
	},
	onHide: function (colpkr) {
		$(colpkr).fadeOut(500);
		return false;
	},
	onChange: function (hsb, hex, rgb) {
		chart.p.dotFillColor = "#" + hex;
        chart.draw();
	}
});

$( "#accordion" ).accordion({ autoHeight: false });
$( "#highlight-accordion" ).accordion({ autoHeight: false });

// end of onReady
});