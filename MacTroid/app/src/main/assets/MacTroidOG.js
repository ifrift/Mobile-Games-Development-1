var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;


var testString = "test";

var canvas;
var canvasContext;
var canvasX;
var canvasY;

canvas = document.getElementById('gameCanvas');
canvasContext = canvas.getContext('2d');

 var player = {
    x: canvas.width/2,
    y: canvas.height/2,
    width: 25,
    height: 25,
    colliderWidth: 22,
    colliderHeight: 22,
    ballColliderWidth: 16,
    ballColliderHeight: 16,
    changingHeight: 25,
    changingWidth: 25,
    velX: 0,
    velY: 0,
    };

     var bullet = {
            x: 0,
            y: 0,
            width: 5,
            height: 5,
            velX: 0,
        };


//player animation vars
var startTimeMS = 0;
var playerFrame = 0;
var playerFrameX = 0;
var playerFrameY = 0;
var playerSpriteWidth = 48;
var playerSpriteHeight = 50;
var playerSpriteTimer = 0.05;
var playerSpriteTimerMax = 0.017;

var keys = [];
var friction = 0.8;

var gameOverScreen = false;
var isKeyPressed = false;
var right = false;
var left = false;
var wasRight = true;
var jumping = false;
var down = false;
var fire = false;

var img = new Image();
img.src = 'playerSprite.png'

//crates
var imgCrate = new Image();
var boxes = [];

window.addEventListener("load", function (){
    start();
    update();

});


function start(){

    init();

    canvasX = canvas.width/2;
    canvasY = canvas.height - 30;
    player.changingWidth = player.colliderWidth;
    player.changingHeight = player.colliderHeight;

    imgCrate.src = 'RTS_Crate_0.png';

        boxes.push({
			x: 120,
			y: 120,
			width: 20,
			height: 20
		});
        boxes.push({
			x: 140,
			y: 120,
			width: 20,
			height: 20
		});
		boxes.push({
			x: 160,
			y: 140,
			width: 20,
			height: 20
		});
        boxes.push({
			x: 180,
			y: 140,
			width: 20,
			height: 20
		});
		boxes.push({
			x: 200,
			y: 140,
			width: 20,
			height: 20
		});
        boxes.push({
			x: 220,
			y: 140,
			width: 20,
			height: 20
		});
        boxes.push({
			x: 40,
			y: 80,
			width: 20,
			height: 20
		});
        boxes.push({
			x: 60,
			y: 80,
			width: 20,
			height: 20
		});


    if(!gameOverScreen)
    {
        render();
    }
}

function update()
{
        player.velY++;

        if(keys[37])
        {
            testString = "left";
            left =  true;
            wasRight = false;
        }

        if(keys[39])
        {
            testString = "right" ;
            right = true;
            wasRight = true;
        }

        if(keys[40])
        {
            testString = "down" ;
            down = true;
        }

        if(keys[38])
        {
            testString = "up";
            jumping = true;
        }

        if(keys[32])
        {
            fire = true;
            bullet.x = player.x;
            bullet.y = player.y;
            testString = "jumping" ;
        }

        if(isKeyPressed)
        {
            if (down)
            {
                if (wasRight)
                {
                    testAnimationFrame(6, 5, 24, 8);
                    player.changingWidth = player.ballColliderWidth;
                    player.changingHeight = player.ballColliderHeight;
                    if (right)
                    {
                        player.velX++;
                    }
                }
                else if (!wasRight)
                {
                    testLeftAnimationFrame(6, 4, 24, 1);
                    player.changingWidth = player.ballColliderWidth;
                    player.changingHeight = player.ballColliderHeight;
                    if (left)
                    {
                        player.velX--;
                    }
                }
            }
            if (jumping && wasRight)
            {
                player.velY = player.velY - 1.5;
                testAnimationFrame(6, 5, 22, 8);
                {
                    if (right)
                    {
                        player.velX++;
                    }
                }
            }

            else if (right && !jumping)
            {
                player.velX++;
                testAnimationFrame(9, 5, 7, 8);
            }

            if (jumping && !wasRight)
            {
                player.velY = player.velY - 1.5;
                testLeftAnimationFrame(6, 4, 22, 1);
                {
                    if (left)
                    {
                        player.velX--;
                    }
                }
            }

            else if (left && !jumping)
            {
                player.velX--;
                testLeftAnimationFrame(9, 4, 7, 1);
            }


        }

        if(!isKeyPressed)
        {
            if (wasRight)
            {
            playerFrameX = 8;
            playerFrameY = 0;
            playerFrame = 0;
            }
            else if (!wasRight)
            {
            playerFrameX = 1;
            playerFrameY = 0;
            playerFrame = 0;
            }

            left = false;
            right = false;
            jumping = false;
            down = false;

            player.changingWidth = player.colliderWidth;
            player.changingHeight = player.colliderHeight;
        }

        player.velX *= friction;
		player.velY *= friction;
		player.x += player.velX;
		player.y += player.velY;



		for (var i = 0; i < boxes.length; i++)
		{
		    //show boxes on canvas
		    //canvasContext.lineWidth = "2";
            //canvasContext.strokeStyle = "green";
		    canvasContext.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);
		    //canvasContext.stroke();
		    canvasContext.drawImage(imgCrate, boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);
		    //check collision
		    var dir = colCheck(player, boxes[i]);

		    if (dir ==="l" || dir === "r")
		    {
		        player.velX = 0;
		    }
		    else if (dir ==="t" || dir ==="b")
		    {
		        player.velY = 0;
            }
        }

        if (fire)
        {
            spawnBullet();
        }

    canvasContext.drawImage(img, playerFrameX*playerSpriteWidth, playerFrameY*playerSpriteHeight, playerSpriteWidth, playerSpriteHeight, player.x, player.y, player.width, player.height);
    requestAnimationFrame(update);
}



function render(){

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    canvasContext.font = "40px Verdana";
    canvasContext.fillStyle = "red";
    canvasContext.textAlign = "center";
    canvasContext.fillText(testString, canvas.width/2, canvas.height/2);

    requestAnimationFrame(render);
}

function init(){

}

function testAnimationFrame(frameMax, frameX, frameY, frameMaxX)
 {
    startTimeMS = startTimeMS + 1;

    if (playerFrame == 0)
    {
        playerFrameX = frameX;
        playerFrameY = frameY;
    }

    //update frame when timer is less than 0
    if (startTimeMS >= 5)
    {
        startTimeMS = 0;
        playerFrameX++;

        if(playerFrameX > frameMaxX)
        {
            playerFrameX = frameX;
            playerFrameY++;
        }

        playerFrame++;

        if(playerFrame > frameMax)
        {
            playerFrame = 0;
            playerFrameX = frameX;
            playerFrameY = frameY;
        }
    }
 }

function testLeftAnimationFrame(frameMax, frameX, frameY, frameMinX)
 {
    startTimeMS = startTimeMS + 1;

    if (playerFrame == 0)
    {
        playerFrameX = frameX;
        playerFrameY = frameY;
    }

    //update frame when timer is less than 0
    if (startTimeMS >= 5)
    {
        startTimeMS = 0;
        playerFrameX--;

        if(playerFrameX < frameMinX)
        {
            playerFrameX = frameX;
            playerFrameY++;
        }

        playerFrame++;

        if(playerFrame > frameMax)
        {
            playerFrame = 0;
            playerFrameX = frameX;
            playerFrameY = frameY;
        }
    }

    console.log(player.x);
    console.log(player.y);
 }

function colCheck(objA, objB)
{
    //get the vectors to check against
    var vX = (objA.x + (objA.changingWidth / 2)) - (objB.x + (objB.width / 2)),
    vY = (objA.y + (objA.changingHeight / 2)) - (objB.y + (objB.height / 2)),
    //add the half widths and half heights of the objects
    hWidths = (objA.changingWidth / 2) + (objB.width / 2),
    hHeights = (objA.changingHeight / 2) + (objB.height / 2),
    colDir = null;

    // if the x and y vector are less than the half width or half height, then we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights)
    {
        // figures out which side we are colliding with
        var oX = hWidths - Math.abs(vX),
        oY = hHeights - Math.abs(vY);

        if (oX >= oY)
        {
            if (vY > 0)
            {
                colDir = "t";
                objA.y += oY;
            }

            else
            {
                coldDir = "b";
                objA.y -= oY;
            }
        }

        else
        {
            if (vX > 0)
            {
                coldDir = "l";
                objA.x += oX;
            }

            else
            {
                colDir = "r";
                objA.x -= oX;
            }
        }
    }

    return colDir;
}

function spawnBullet ()
{
    canvasContext.rect(bullet.x, bullet.y, bullet.width, bullet.height);
    canvasContext.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    if(wasRight)
    {
        bullet.x++;
    }
    else if (!wasRight)
    {
        bullet.x--;
    }
}

    	document.body.addEventListener("keydown", function (e) {
		keys[e.keyCode] = true;
		isKeyPressed = true;
	});

	document.body.addEventListener("keyup", function (e) {
		keys[e.keyCode] = false;
		isKeyPressed = false;
	});