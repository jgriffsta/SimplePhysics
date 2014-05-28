
var canvas = document.createElement('canvas')
	var ctx = canvas.getContext('2d')
	var timeStart = new Date();
	document.body.style.padding = 0
	document.body.style.overflow = 'hidden'
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	document.body.appendChild(canvas)

	//Options
	var period = 2000; // Milliseconds
var amplitude = 0.25;

var length = 100;
var maxInitalSpeed = 60;
var gravity = -9.8;
var elasticSolid = 0.9;
var elasticBall = 0.9;
//Data
var pos = [0, 0];
var mousePos = [0, 0];
var mousePos = [0, 0];
var angleR = 0;
var angleD = 0;
var ballObject = new Array();
var canvasH = canvas.height;
var canvasW = canvas.width;

var end = false;
function draw() {

	ctx.clearRect(0, 0, canvasW, canvasH);

	drawLine(0, canvasH, mousePos[0], mousePos[1]);

	var mpp = canvasW / length;

	//Drawing balls
	for (var i = 0; i < ballObject.length; i++) {
		if (ballObject[i].visible)
			drawCircle(ballObject[i].posX * mpp, (canvasH - ballObject[i].posY * mpp), ballObject[i].radius * mpp);
		//drawLine (ballObject[i].posX*meterPixX,canvasH-(ballObject[i].posY+ballObject[i].radius)*meterPixY,ballObject[i].posX*meterPixX,canvasH-meterPixY*(ballObject[i].velY));
		drawText(ballObject[i].velY, ballObject[i].posX * mpp, canvasH - (ballObject[i].posY + ballObject[i].radius + 2) * mpp)
		var r = ballObject[i].radius;
		//drawRectangle((ballObject[i].posX-r)*mpp,canvasH-(ballObject[i].posY-r)*mpp,(ballObject[i].posX+r)*mpp,canvasH-(ballObject[i].posY+r)*mpp);
	}
}

function drawText(t, x, y) {
	ctx.font = "bold 16px Arial";
	ctx.fillText(t, x, y);
}
window.addEventListener('mousemove', userInterface, false);
window.addEventListener('click', newObject, false);
function userInterface(e) {
	var rect = canvas.getBoundingClientRect();
	mousePos[0] = e.clientX - rect.left;
	mousePos[1] = e.clientY - rect.top;
}

function newObject(e) {
	var length = mousePos[0] / Math.cos(angleR);
	var maxLength = Math.pow(Math.pow(canvasH, 2) + Math.pow(canvasW, 2), 0.5)
		var power = length / maxLength * maxInitalSpeed;

	var cos = Math.cos(angleR) * power;
	var sin = Math.sin(angleR) * power;
	var time = new Date();
	var radius = 2.5;
	ballObject.push(new ball(0, radius, cos, sin, 0, gravity, radius, 1))

}
function ball(posX, posY, velX, velY, accX, accY, radius) {
	this.posXstart = posX;
	this.posYstart = posY;
	this.posX = posX;
	this.posY = posY;
	this.velX = velX;
	this.velY = velY;
	this.accX = accX;
	this.accY = accY;
	this.radius = radius;
	this.mass = 1;
	this.visible = true;
}

function physics() {
	canvasH = canvas.height;
	canvasW = canvas.width;
	timeNow = new Date()
		time = timeNow - timeStart;
	var omega = 2 * Math.PI / period;

	if (mousePos[0] >= 0) { //Only update if X is pstve.
		angleR = Math.atan((canvasH - mousePos[1]) / mousePos[0]);
		angleD = angleR * 180 / Math.PI;
	}

	var t = (timeNow - timeStart) / 1000;
	//free fall of objects
	for (var i = 0; i < ballObject.length; i++) {

		ballObject[i].velX += t * ballObject[i].accX;
		ballObject[i].velY += t * ballObject[i].accY;

		ballObject[i].posX += t * ballObject[i].velX;
		ballObject[i].posY += t * ballObject[i].velY;
		ballObject[i].accX = 0;
		ballObject[i].accY = gravity;
		ballObject[i].velX += t * ballObject[i].accX;
		ballObject[i].velY += t * ballObject[i].accY;

		for (var y = 0; y < ballObject.length; y++) {
			if (y == i)
				continue;

			if (distance2Point(ballObject[i].posX, ballObject[i].posY, ballObject[y].posX, ballObject[y].posY) <= ballObject[y].radius + ballObject[i].radius) {
				var change = collision(i, y);
				ballObject[i].velX = change[0];
				ballObject[i].velY = change[1];
				ballObject[y].velX = change[2];
				ballObject[y].velX = change[3];

			}
		}

		if (ballObject[i].posY - ballObject[i].radius < 0)
			ballObject[i].posY = ballObject[i].radius;
		if (ballObject[i].posY - ballObject[i].radius <= 0) {
			ballObject[i].velY = -ballObject[i].velY * elasticSolid;
		}

	}

	draw();
}

function distance2Point(x, y, x1, y1) {

	distance = Math.pow(Math.pow(x - x1, 2) + Math.pow(y - y1, 2), 0.5)

		return distance;
}

function collision(i, y) {
	ballA = ballObject[i];
	ballB = ballObject[y];
	var e = elasticBall;
	var theta = Math.atan((ballB.posY - ballA.posY) / (ballB.posX - ballA.posX))
		var alpha = Math.PI / 2 - theta;

	//Move ball overlap.
	var distanceOverLap = 0;
	distanceOverLap = ballObject[y].radius + ballObject[i].radius - distance2Point(ballObject[i].posX, ballObject[i].posY, ballObject[y].posX, ballObject[y].posY);
	if (distanceOverLap > 0) {
		ballObject[i].posX += -distanceOverLap * Math.cos(theta);
		ballObject[i].posY += -distanceOverLap * Math.sin(theta);
	}

	var u1 = ballA.velX * Math.cos(theta) + ballA.velY * Math.cos(alpha); //needs compacting
	var u2 = ballB.velX * Math.cos(theta) + ballB.velY * Math.cos(alpha);
	var k1 = ballA.velY * Math.sin(alpha) - ballA.velX * Math.sin(theta);
	var k2 = ballB.velY * Math.sin(alpha) - ballB.velX * Math.sin(theta);
	var v1 = (u1 * ballA.mass * (1 - e) + ballB.mass * u2 * (1 + e)) / (2 * ballA.mass);
	var v2 = (u1 * ballA.mass * (1 + e) + ballB.mass * u2 * (1 - e)) / (2 * ballB.mass);
	var landaA = Math.atan(k1 / v1) + theta;
	var landaB = Math.atan(k2 / v2) + theta;

	var velAX = v1 * Math.cos(landaA) - k1 * Math.sin(landaA);
	var velBX = v2 * Math.cos(landaB) - k2 * Math.sin(landaB);
	var velAY = v1 * Math.sin(landaA) + k1 * Math.cos(landaA);
	var velBY = v2 * Math.sin(landaB) + k2 * Math.cos(landaB);
	var result = [velAX, velAY, velBX, velBY];
	return (result);

}

function drawRectangle(x, y, x1, y1) {
	ctx.fillStyle = "rgba(0,200,0,1)";
	ctx.fillRect(x, y, x1 - x, y1 - y);

}

function drawLine(x, y, x1, y1) {
	ctx.lineWidth = 2;
	ctx.beginPath();

	ctx.moveTo(x, y);
	ctx.lineTo(x1, y1);
	ctx.stroke();
}

function drawCircle(x, y, r) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI, false);
	ctx.fillStyle = 'green';
	ctx.fill();

	ctx.stroke();
}

window.requestAnimFrame = (function (callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function (callback) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

function animate() {

	physics();

	if (end)
		return null;

	requestAnimFrame(function () {
		animate();
		timeStart = new Date();
	});
}
animate();
