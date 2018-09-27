var bezier = function(t, p0, p1, p2, p3){
    var cX = 3 * (p1.x - p0.x),
      bX = 3 * (p2.x - p1.x) - cX,
      aX = p3.x - p0.x - cX - bX;
        
    var cY = 3 * (p1.y - p0.y),
      bY = 3 * (p2.y - p1.y) - cY,
      aY = p3.y - p0.y - cY - bY;
        
    var x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;
    var y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;
        
    return {x: x, y: y};
};

var calcLineLength = function(p0, p1){
    return Math.sqrt((p1.x - p0.x)*(p1.x - p0.x) + (p1.y - p0.y)*(p1.y - p0.y));
}


var getElementPoints = function(theCurve, curveLength, accuracy, wW, wH, numberOfElements){
    var p0 = {x:0, y: 0};
    var p1 = {x: wW*theCurve.p1.x, y: wH*theCurve.p1.y};
    var p2 = {x: wW*theCurve.p2.x, y: wH*theCurve.p2.y};
    var p3 = {x: wW, y:wH};

    var stepLength = curveLength / (numberOfElements + 1); // the step length of each equally lengthed curve
    var currentStep = 1; // the current point that we want to draw
    
    var progressiveLength = 0; // keeps the current length of the curve while progressing with the sub-curves
    var previousPoint = null; // keep a reference to the previous point of the polyline so 
                              // the length of the line can be calculated on each step
    var points = [];
    
    previousPoint = JSON.parse(JSON.stringify(p0));
    for (var i=0; i<1; i+=accuracy){
        var p = bezier(i, p0, p1, p2, p3);
        var previousLength = progressiveLength;
        var lineLength = calcLineLength(previousPoint, p);
        progressiveLength += lineLength;
        if(progressiveLength >= currentStep*stepLength){
            var distanceOnLIne = progressiveLength - currentStep*stepLength;
            var t = distanceOnLIne/lineLength;
            var pointToUse = {
                x: (1-t)*previousPoint.x + t*p.x,
                y: (1-t)*previousPoint.y + t*p.y
            }
            points.push(pointToUse);
            
            currentStep += 1;
            if(currentStep > numberOfElements){
                self.postMessage({points: points, theCurve:theCurve});;
            }
        }
        previousPoint = JSON.parse(JSON.stringify(p));
    }
}

self.addEventListener('message', function(e){
    getElementPoints(e.data.theCurve, e.data.curveLength, e.data.accuracy, e.data.wW, e.data.wH, e.data.numberOfElements);
});