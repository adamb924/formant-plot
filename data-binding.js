$( document ).ready(function() {

function reciprocalBind(first,second) {
	$(first).bind("change", function() {
		$(second).val($(this).val());
	});

	$(second).bind("change", function() {
		$(first).val($(this).val());
	});
}

reciprocalBind("#hlines-slider","#hlines-number");
reciprocalBind("#vlines-slider","#vlines-number");
reciprocalBind("#trapezoid-slider","#trapezoid-number");
reciprocalBind("#intermediateLineWidth-slider","#intermediateLineWidth-number");
reciprocalBind("#trapezoidLineWidth-slider","#trapezoidLineWidth-number");
reciprocalBind("#dotRadius-slider","#dotRadius-number");
reciprocalBind("#waWidth-slider","#waWidth-number");
reciprocalBind("#waAspect-slider","#waAspect-number");
reciprocalBind("#absWidth-slider","#absWidth-number");
reciprocalBind("#absHeight-slider","#absHeight-number");
reciprocalBind("#margin-slider","#margin-number");

$("#hlines-slider, #hlines-number").bind("change", function() {
	chart.p.horizontalLines = parseInt( $(this).val() );
	chart.draw();
});

$("#vlines-slider, #vlines-number").bind("change", function() {
	chart.p.verticalLines = parseInt( $(this).val() );
	chart.draw();
});

$("#trapezoid-slider, #trapezoid-number").bind("change", function() {
	chart.p.trapezoidRatio = parseFloat( $(this).val() );
	chart.draw();
});

$("#intermediateLineWidth-slider, #intermediateLineWidth-number").bind("change", function() {
	chart.p.gridLineWidth = parseFloat( $(this).val() );
	chart.draw();
});

$("#trapezoidLineWidth-slider, #trapezoidLineWidth-number").bind("change", function() {
	chart.p.trapezoidLineWidth = parseFloat( $(this).val() );
	chart.draw();
});

$("#fontFamily").bind("change", function() {
	chart.p.fontFamily = $(this).val();
	chart.draw();
});

$("#fontSize").bind("change", function() {
	chart.p.fontSize = parseInt($(this).val());
	chart.draw();
});

$("#markType").bind("change", function() {
	chart.p.markType = $(this).val();
	chart.draw();
});

$("#dotRadius-slider, #dotRadius-number").bind("change", function() {
	chart.p.dotRadius = parseFloat( $(this).val() );
	chart.draw();
});
    
$("#margin-slider, #margin-number").bind("change", function() {
	chart.p.figMargin = parseFloat( $(this).val() );
	chart.draw();
});
    

$("#waWidth-slider, #waWidth-number").bind("change", function() {
    var width = parseFloat( $(this).val() );
    var aspect = parseFloat( $("#waAspect-number").val() );
	chart.p.figWidth = width;
    chart.p.figHeight = width * aspect;
    $("#absWidth-slider, #absWidth-number").val( Math.round(width) );
    $("#absHeight-slider, #absHeight-number").val( Math.round(width * aspect) );
	chart.draw();
});
   
$("#waAspect-slider, #waAspect-number").bind("change", function() {
    var width = parseFloat( $("#waWidth-number").val() );
    var aspect = parseFloat( $(this).val() );
	chart.p.figWidth = width;
    chart.p.figHeight = width * aspect;
    $("#absWidth-slider, #absWidth-number").val( Math.round(width) );
    $("#absHeight-slider, #absHeight-number").val( Math.round(width * aspect) );
	chart.draw();
});
 
$("#absWidth-slider, #absWidth-number").bind("change", function() {
	chart.p.figWidth = parseFloat( $(this).val() );
    $("#waWidth-slider, #waWidth-number").val(chart.p.figWidth);
	var aspect = chart.p.figHeight / chart.p.figWidth;
	aspect = Math.round( aspect*100 ) / 100;
    $("#waAspect-slider, #waAspect-number").val(aspect);
	chart.draw();
});
 
 
$("#absHeight-slider, #absHeight-number").bind("change", function() {
	chart.p.figHeight = parseFloat( $(this).val() );
    $("#waWidth-slider, #waWidth-number").val(chart.p.figWidth);
	var aspect = chart.p.figHeight / chart.p.figWidth;
	aspect = Math.round( aspect*100 ) / 100;
    $("#waAspect-slider, #waAspect-number").val(aspect);
	chart.draw();
});


$("#formant-values").bind("change", function() {
	chart.removeFormantLimits();
    chart.setData( $(this).val() );
});


$("#f1min").bind("change", function() {
	chart.p.f1Min = $(this).val();
	chart.draw();
});

$("#f1max").bind("change", function() {
	chart.p.f1Max = $(this).val();
	chart.draw();
});

$("#f2min").bind("change", function() {
	chart.p.f2Min = $(this).val();
	chart.draw();
});

$("#f2max").bind("change", function() {
	chart.p.f2Max = $(this).val();
	chart.draw();
});

function setGuiElementsFromData(chart) {
    $('#trapezoid-slider').val( chart.p.trapezoidRatio );
    $('#trapezoid-number').val( chart.p.trapezoidRatio );
    $('#trapezoidLineColor').ColorPickerSetColor( chart.p.trapezoidLineColor.replace("#","") );
    $('#trapezoidLineColor').val( chart.p.trapezoidLineColor.replace("#","") );
    $('#trapezoidLineWidth-slider').val( chart.p.trapezoidLineWidth );
    $('#trapezoidLineWidth-number').val( chart.p.trapezoidLineWidth );
    $('#hlines-slider').val( chart.p.horizontalLines );
    $('#hlines-number').val( chart.p.horizontalLines );
    $('#vlines-slider').val( chart.p.verticalLines );
    $('#vlines-number').val( chart.p.verticalLines );
    $('#intermediateLineColor').ColorPickerSetColor( chart.p.gridLineColor.replace("#","") );
    $('#intermediateLineColor').val( chart.p.gridLineColor.replace("#","") );
    $('#intermediateLineWidth-slider').val( chart.p.gridLineWidth );
    $('#intermediateLineWidth-number').val( chart.p.gridLineWidth );
    $('#waWidth-slider').val( chart.p.figWidth );
    $('#waWidth-number').val( chart.p.figWidth );
    $('#waAspect-slider').val( Math.round(chart.p.figHeight/chart.p.figWidth*100)/100 );
    $('#waAspect-number').val( Math.round(chart.p.figHeight/chart.p.figWidth*100)/100 );
    $('#absWidth-slider').val( chart.p.figWidth );
    $('#absWidth-number').val( chart.p.figWidth );
    $('#absHeight-slider').val( chart.p.figHeight );
    $('#absHeight-number').val( chart.p.figHeight );
    $('#margin-slider').val( chart.p.figMargin );
    $('#margin-number').val( chart.p.figMargin );
    $('#f1min').val( chart.p.f1Min );
    $('#f1max').val( chart.p.f1Max );
    $('#f2min').val( chart.p.f2Min );
    $('#f2max').val( chart.p.f2Max );
    $('#markType').val( chart.p.markType );
    $('#fontFamily').val( chart.p.fontFamily );
    $('#fontSize').val( chart.p.fontSize );
    $('#dotColor').ColorPickerSetColor( chart.p.dotFillColor.replace("#","") );
    $('#dotColor').val( chart.p.dotFillColor.replace("#","") );
    $('#dotRadius-slider').val( chart.p.dotRadius );
    $('#dotRadius-number').val( chart.p.dotRadius );
}
setGuiElementsFromData(window.chart);

});