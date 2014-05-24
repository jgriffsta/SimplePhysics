
var canvas = document.createElement('canvas')
var ctx = canvas.getContext('2d')
var timeStart  = new Date();
document.body.style.padding = 0
document.body.style.overflow = 'hidden'
canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.body.appendChild(canvas)


//Options
var period = 2000; // Milliseconds
var amplitude=0.25;
var boxH=100;
var boxW=100;
var maxInitalSpeed = 30;
var gravity = -9.8;
//Data
var pos=[0,0];
var mousePos=[0,0];
var mousePos=[0,0];
var angleR = 0; 
var angleD =0;
var ballObject = new Array();
var canvasH=canvas.height;
var	canvasW=canvas.width;



var end = false; 
function draw() { 
	
	ctx.clearRect(0,0,canvasW,canvasH);
	drawRectangle(pos[0],pos[1],pos[0]+boxW,pos[1]+boxH);
	
	drawLine(0,canvasH,mousePos[0],mousePos[1]);
	
	for(var i = 0;i<ballObject.length;i++){
		if(ballObject[0i].visible)drawCircle(ballObject[i].posX,canvasH-ballObject[i].posX,ballObject[i].radius);
	}
	
	ctx.font = "bold 16px Arial";
	ctx.fillText(angleD,100,500);
	
	}

	
window.addEventListener('mousemove', userInterface, false);
window.addEventListener('mouseclick', newObject, false);
function userInterface(e){
	var rect = canvas.getBoundingClientRect();
	mousePos[0]=e.clientX - rect.left;
	mousePos[1]=e.clientY - rect.top;
}

function newObject(e){
	var length = mousePos[0]/Math.cos(angleR);
	var maxLength = Math.pow(Math.pow(screenH,2)+Math.pow(screenW,2),0.5)
	var power = length/maxLength * maxInitalSpeed;
	
	var cos = Math.cos(angleR)* power;
	var sin = Math.sin(angleR)* power;
	var time = new Date();
	ball.push(0,0,cos,sin,0,gravity,10,time)
	
	
}
function ball(posX,posY,velX,velY,accX,accY,radius,time){
	this.posXstart = posX;
	this.posYstart = posY;
	this.posX = posX;
	this.posY = posY;
	this.velX = velX;
	this.velY = velY;
	this.accX = accX;
	this.accY = accY;
	this.radius = radius;
	this.startTime = time;
	this.visible = true;
}
	
function physics(){
	canvasH=canvas.height;
	canvasW=canvas.width;
	timeNow = new Date()
	time = timeNow-timeStart;
	var omega = 2*Math.PI/period;
	
	if (mousePos[0]>=0){//Only update if X is pstve.
		angleR = Math.atan((canvasH-mousePos[1])/mousePos[0]);
		angleD = angleR*180/Math.PI;
	}
	pos[0] = 0;
	pos[1] = amplitude*canvasH*Math.sin(omega*time) + canvasH*0.5;
	
	//free fall of objects
	for (var i = 0;i<ballObject.length;i++){
		var t = timeNow - ballobject[i].startTime;
		ballObject[i].posX = t*ballObject[i].velX + ballObject[i].posXstart;
		ballObject[i].posY = t*ballObject[i].velY + 0.5*Math.pow(t,2)*gravity + ballObject[i].posYstart ;
		
		
	}
	
	draw();
}
	
function drawRectangle(x,y,x1,y1){
	ctx.fillStyle = "rgba(0,200,0,1)";
	ctx.fillRect(x,y,x1-x,y1-y);
	
}

function drawLine(x,y,x1,y1){
	ctx.beginPath();
	ctx.moveTo(x,y);
	ctx.lineTo(x1,y1);
	ctx.stroke();
}

function drawCircle(x,y,r){
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI, false);
	ctx.fillStyle = 'green';
	ctx.fill();
	ctx.lineWidth = 5;
	ctx.strokeStyle = '#003300';
	ctx.stroke();
}

window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
			window.setTimeout(callback, 1000 / 60);
        };
      })();	
	  
	  

      function animate() {
        
		physics();
		
        if(end) return null;
		
		
        requestAnimFrame(function() {
          animate();
        });
      }
      animate();