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

var getCurveLines = function(theCurve, accuracy, wW, wH){
    var p0 = {x:0, y: 0};
    var p1 = {x: wW*theCurve.p1.x, y: wH*theCurve.p1.y};
    var p2 = {x: wW*theCurve.p2.x, y: wH*theCurve.p2.y};
    var p3 = {x: wW, y:wH};
    var curveColor = theCurve.color;
    
    // start curve length calculation by initially setting it to 0
    var curveLength = 0;
    let previousPoint = null; // keep a reference to the previous point of the polyline so 
    // the length of the line can be calculated on each step
    
    // lines is an array of lines each of which has the format: {start:{x, y}, end: {x,y}, length:<length>}
    let lines = [];
    
    previousPoint = JSON.parse(JSON.stringify(p0));
    for (var i=0; i<1; i+=accuracy){
        var p = bezier(i, p0, p1, p2, p3);
        curveLength += calcLineLength(previousPoint, p);
        lines.push({
            start: {
                x: previousPoint.x,
                y: previousPoint.y
            }, 
            end: {
                x: p.x,
                y: p.y
            },
            length: curveLength
        });
        previousPoint = JSON.parse(JSON.stringify(p));
    }
    
    lines.push({
        start: {
            x: previousPoint.x,
            y: previousPoint.y
        }, 
        end: {
            x: p3.x,
            y: p3.y
        }
    });
    curveLength += calcLineLength(previousPoint, p3);
    
    self.postMessage({lines: lines, theCurve:theCurve, curveLength:curveLength});;
}

self.addEventListener('message', function(e){
    getCurveLines(e.data.theCurve, e.data.accuracy, e.data.wW, e.data.wH);
});