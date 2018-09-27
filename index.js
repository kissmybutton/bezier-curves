(function bezierCurves(){
    /***************** PARAMETERS SETUP ***********************/
    var curves = [];
    var measuredCurves = [];
    var accuracy = 0.0002;
    var randomNumberMax = 1;
    var randomNumberMin = 0;
    
    /***************** LOADER SETUP ***********************/
    var loader = {
        numberOfStepsPlotted: 0,
        numberOfCurves: 0,
        curvesMeter: document.getElementById('curvesProgress'),
        curvesProgressBar: document.querySelector('#curvesProgress .meter'),
        curvesSlider: document.getElementById('numberOfCurves'),
        elementsSlider: document.getElementById('numberOfPoints'),

        // numberOfCurves is the number of curves that will be plotted. 
        // fullLoad is a boolean indicating whether we are drawing both the curves and the elements or only the elements
        startLoad(numberOfCurves, fullLoad){
            this.numberOfCurves = numberOfCurves;
            this.numberOfCurvesPlotted = 0;

            if(fullLoad){
                this.numberOfCurves *= 2;
            }
            
            this.curvesSlider.setAttribute('disabled', 'true');
            this.elementsSlider.setAttribute('disabled', 'true');
            this.curvesMeter.style.display = 'block';
        },
        
        curveStep(){
            this.numberOfCurvesPlotted += 1;
            var percentage = 100 * this.numberOfCurvesPlotted / this.numberOfCurves;
            this.curvesProgressBar.style.width = percentage + '%';
            
            if(percentage === 100){
                this.curvesMeter.style.display = 'none'; 
                this.curvesSlider.removeAttribute('disabled');
                this.elementsSlider.removeAttribute('disabled');
            }
        }
    }
    
    /***************** WORKERS SETUP ***********************/
    var linesWorker = new Worker('curveLines.js');
    var curveElementsPointWorker = new Worker('curveElements.js');
    
    /***************** RANDOME PICKER METHODS SETUP ***********************/
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
    
    
    /***************** DRAW COMMANDS SETUP ***********************/
    function draw(){
        curves = [];
        measuredCurves = [];
        var numberOfCurves = parseInt(document.getElementById('numberOfCurves').value);
        loader.startLoad(numberOfCurves, true);
        var wW = window.innerWidth;
        var wH = window.innerHeight;
        console.log('Setting up canvas');
        console.log(wW);;
        console.log(wH);
        
        var lc = document.getElementById('pointsCanvas');
        var c = document.getElementById('myCanvas');
        var ctx = c.getContext('2d');
        
        c.width = wW;
        c.height = wH;
        lc.width = wW;
        lc.height = wH;
        
        for(var i=0; i<numberOfCurves; i++){
            var theCurve = {
                p1: {x: getRandomNumber(), y: getRandomNumber()},
                p2: {x:getRandomNumber(), y: getRandomNumber()},
                color: getRandomColor()
            };
            curves.push(theCurve);
            drawBezierCurve(theCurve, accuracy);  
        }
    }
    
    /* invoded on window resize. It doesn't generate new curves, it uses the 
    existing ones */
    function redraw(){
        loader.startLoad(curves.length, true);
        var wW = window.innerWidth;
        var wH = window.innerHeight;
        console.log('Setting up canvas');
        console.log(wW);;
        console.log(wH);
        
        var lc = document.getElementById('pointsCanvas');
        var c = document.getElementById('myCanvas');
        var ctx = c.getContext('2d');
        
        c.width = wW;
        c.height = wH;
        lc.width = wW;
        lc.height = wH;
        
        for(var i=0; i<curves.length; i++){
            drawBezierCurve(curves[i], accuracy);
        }
    }
    
    /**
     * draws elements of equal distance on the curve 
    */
    var altDrawElements = function(){
        loader.startLoad(measuredCurves.length, false);
        var wW = window.innerWidth;
        var wH = window.innerHeight;
        var lc = document.getElementById('pointsCanvas');
        lc.width = wW;
        lc.height = wH;
        
        for(var i=0; i<measuredCurves.length; i++){
            curveElementsPointWorker.postMessage({theCurve: measuredCurves[i].curve, curveLength: measuredCurves[i].curveLength, wW: wW, wH:wH, 
                numberOfElements: parseInt(document.getElementById("numberOfPoints").value),
                accuracy: accuracy
            });   
        }
    }
    
    var drawBezierCurve = function(theCurve, accuracy){
        var wW = window.innerWidth;
        var wH = window.innerHeight;
        
        linesWorker.postMessage({theCurve: theCurve, accuracy:accuracy, wW: wW, wH: wH});
    }
    
    
    /***************** WORKERS MESSAGING SETUP ***********************/    
    linesWorker.addEventListener('message', function(e){
        var wW = window.innerWidth;
        var wH = window.innerHeight;
        
        var c = document.getElementById('myCanvas');
        var ctx = c.getContext('2d');
        ctx.strokeStyle = e.data.theCurve.color;
        ctx.beginPath();
        for (var i=0; i<e.data.lines.length; i++){
            var p0 = e.data.lines[i].start;
            var p = e.data.lines[i].end;
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
        
        loader.curveStep();
        
        measuredCurves.push({
            curve: e.data.theCurve,
            curveLength: e.data.curveLength
        });
        
        curveElementsPointWorker.postMessage({theCurve: e.data.theCurve, curveLength: e.data.curveLength, wW: wW, wH:wH, 
            numberOfElements: parseInt(document.getElementById("numberOfPoints").value),
            accuracy: accuracy
        });
    });
    
    curveElementsPointWorker.addEventListener('message', function(e){
        var c = document.getElementById('pointsCanvas');
        var ctx = c.getContext('2d');
        for(var i=0; i<e.data.points.length; i++){
            var pointToUse = e.data.points[i];
            ctx.beginPath();
            ctx.strokeStyle = e.data.theCurve.color;
            ctx.fillStyle = e.data.theCurve.color;
            ctx.arc(pointToUse.x, pointToUse.y, 10, 0, 2 * Math.PI, false);
            ctx.fill();  
        } 
        
        loader.curveStep();
    });
    
    
    
    
    
    /***************** EVENT LISTENERS SETUP ***********************/
    var resizeLatency = 500;
    var resizeTimeout = false;
    window.addEventListener("resize", function(){
        if(resizeTimeout != false){
            clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(function(){redraw();}, resizeLatency); 
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
        altDrawElements();
    };
    
    
    draw();
    
})();