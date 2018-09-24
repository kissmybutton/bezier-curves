(function bezierCurves(){
    var curves = [];
    var accuracy = 0.001;
    var randomNumberMax = 1;
    var randomNumberMin = 0;
    
    function getRandomNumber(){
        return (Math.random() * (randomNumberMax - randomNumberMin) + randomNumberMin);
    }
    
    function getRandomColor() {
        var letters = '0123456789ABCD';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 14)];
        }
        return color;
    }
    
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
    
    var drawBezierCurve = function(theCurve, accuracy){
        var wW = window.innerWidth;
        var wH = window.innerHeight;
        
        var p0 = {x:0, y: 0};
        var p1 = {x: wW*theCurve.p1.x, y: wH*theCurve.p1.y};
        var p2 = {x: wW*theCurve.p2.x, y: wH*theCurve.p2.y};
        var p3 = {x: wW, y:wH};
        var curveColor = theCurve.color;
        
        var c = document.getElementById('myCanvas');
        var ctx = c.getContext('2d');
        
        ctx.strokeStyle = curveColor;
        
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        for (var i=0; i<1; i+=accuracy){
            var p = bezier(i, p0, p1, p2, p3);
            ctx.lineTo(p.x, p.y);
        }
        
        ctx.stroke();
    }
    
    var drawElements = function(){
        var wW = window.innerWidth;
        var wH = window.innerHeight;
        
        var numberOfElements = parseInt(document.getElementById("numberOfPoints").value);
        var c = document.getElementById('pointsCanvas');
        c.width = wW;
        c.height = wH;
        var ctx = c.getContext('2d');
        for(var j=0; j<curves.length; j++){
            var theCurve = curves[j];
            for(let i=1; i<=numberOfElements; i++){
                ctx.beginPath();
                ctx.strokeStyle = theCurve.color;
                ctx.fillStyle = theCurve.color;
                var p = bezier(i/(numberOfElements+1), {x:0, y:0}, {x: wW*theCurve.p1.x, y: wH*theCurve.p1.y}, {x: wW*theCurve.p2.x, y: wH*theCurve.p2.y}, {x: wW, y:wH});
                ctx.arc(p.x, p.y, 10, 0, 2 * Math.PI, false);
                ctx.fill();
            }    
        }
    }
    
    /* invoded on window resize. It doesn't generate new curves, it uses the 
    existing ones */
    function redraw(){
        var wW = window.innerWidth;
        var wH = window.innerHeight;
        console.log('Setting up canvas');
        console.log(wW);;
        console.log(wH);
        
        var c = document.getElementById('myCanvas');
        var ctx = c.getContext('2d');
        
        c.width = wW;
        c.height = wH;
        
        for(var i=0; i<curves.length; i++){
            drawBezierCurve(curves[i], accuracy);
        }
    }
    
    function draw(){
        curves = [];
        var wW = window.innerWidth;
        var wH = window.innerHeight;
        console.log('Setting up canvas');
        console.log(wW);;
        console.log(wH);
        
        var c = document.getElementById('myCanvas');
        var ctx = c.getContext('2d');
        
        c.width = wW;
        c.height = wH;
        
        var numberOfCurves = parseInt(document.getElementById('numberOfCurves').value);
        for(var i=0; i<numberOfCurves; i++){
            var theCurve = {
                p1: {x: getRandomNumber(), y: getRandomNumber()},
                p2: {x:getRandomNumber(), y: getRandomNumber()},
                color: getRandomColor()
            };
            curves.push(theCurve);
            drawBezierCurve(theCurve, accuracy);  
        }
        drawElements();
    }
    
    
    // set listeners
    var resizeLatency = 500;
    var resizeTimeout = false;
    window.addEventListener("resize", function(){
        if(resizeTimeout != false){
            clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(function(){redraw(); drawElements()}, resizeLatency); 
    });
    
    var curvesNumberInput = document.getElementById('numberOfCurves');
    curvesNumberInput.oninput = function(e){
        document.getElementById('numberOfCurvesNumber').innerHTML = e.target.value;
    };
    
    curvesNumberInput.onchange = function(e){
        draw();
    };
    
    var elementsNumberInput = document.getElementById('numberOfPoints');
    elementsNumberInput.oninput = function(e){
        document.getElementById('numberOfPointsNumber').innerHTML = e.target.value;
    };
    
    elementsNumberInput.onchange = function(e){
        drawElements();
    };
    
    
    draw();
    
})();