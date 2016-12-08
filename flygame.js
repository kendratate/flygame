/**
 * Created by kendratate on 11/14/16.
 */
var frames = 0;
var bird;
var corals;
var canvas;
var renderingContext;
var width;
var height;
var currentState;
var states = {Splash: 0, Game: 1, Score: 2};
//var foregroundPosition = 0;

var background = new Image();
background.src = "images/icecave.jpg";

// bird class
function Bird() {
    this.frame = 0;
    this.animation = [0, 1, 2, 1];
    this.x = 100;
    this.y = 0;

    this.rotation = 0;
    this.radius = 35;
    this.velocity = 0;
    this.gravity = 0.2;
    this._jump = 3;


    this.update = function () {
        //change value of sprites cycling through
        var n = currentState === states.Splash ? 10 : 5;
        this.frame += frames % n === 0 ? 1 : 0;
        this.frame %= this.animation.length;

        if (currentState == states.Splash) {
            this.updateIdleBird();
        }
        else {
            this.updatePlayingBird();
        }
    }

    this.draw = function (renderingContext) {
        //renderingContext is the editable property of the canvas
        renderingContext.save();

        renderingContext.translate(this.x, this.y);
        renderingContext.rotate(this.rotation);

        var n = this.animation[this.frame];
        //renderingContext.clearRect(0, 0, canvas.width, canvas.height);
        birdSprite[n].draw(renderingContext, -birdSprite[n].width/2, -birdSprite[n].height/2);

        // renderingContext.fillStyle = "#f00";
        // renderingContext.beginPath();
        // renderingContext.arc(0,0,this.radius,0,2*Math.PI);
        // renderingContext.fill();

        renderingContext.restore();
    }

    this.updateIdleBird = function () {
        this.y = height - 200 + 5 * Math.cos(frames / 10);
        this.rotation = 0;
    }

    this.jump = function () {
        this.velocity = -this._jump; // negated for x, y coordinate from top left corner (up is -y)
        this.rotation = 0;

    }
    this.updatePlayingBird = function () {
        this.velocity += this.gravity;
        this.y += this.velocity;

        // Change to the score state when bird touches the ground
        if (this.y >= height - 5) {
            this.y = height - 5;

            if (currentState === states.Game) {
                currentState = states.Score;
            }

            this.velocity = this._jump; // Set velocity to jump speed for correct rotation
        }

        // If our player hits the top of the canvas, we crash him
        if (this.y <= 70) {
            currentState = states.Score;
        }

        // When bird lacks upward momentum increment the rotation angle
        if (this.velocity >= this._jump) {
            this.frame = 1;
            this.rotation = Math.min(Math.PI / 6, this.rotation + 0.1);
        } else {
            this.rotation = -0.1;
        }
    }
}


function main(){
    windowSetup();
    canvasSetup();
    loadgraphics();
    currentState = states.Splash;

    document.body.appendChild(canvas);
    bird = new Bird();
    corals = new CoralCollection();
    //laser = new Laser();

}

function loadgraphics(){
    //initiate the sprite sheet
    var img = new Image();
    img.src = "images/bluebird.png";
    img.onload = function(){
        initSprite(this);
        gameLoop();
    };
}

function gameLoop(){
    update();
    render();

    window.requestAnimationFrame(gameLoop);
}

function update() {
    frames++;

    if (currentState === states.Game) {
        corals.update();
    }

    bird.update();
    //laser.update();
    //if(currentState != states.Score){
    //    foregroundPosition = ((foregroundPosition - 2) % 14);
    //}

}


/**
 * Re-draw the game view.
 */
function render() {
    // Draw background color
    //renderingContext.fillRect(0, 0, width, height);

    // Draw background
    renderingContext.drawImage(background,0,0);

    corals.draw(renderingContext);
    bird.draw(renderingContext);

    if (currentState === states.Score) {
            // okButtonSprite.draw(renderingContext, okButton.x, okButton.y);
    }

    // Draw foreground sprites
    // foreground.draw(renderingContext, foregroundPosition, height - foregroundSprite.height);
    // foreground.draw(renderingContext, foregroundPosition + foregroundSprite.width, height - foregroundSprite.height);
}

function windowSetup(){
    width = window.innerWidth;
    height = window.innerHeight;

    // mouse vs touch depending on screen size
    var inputEvent = "touchstart";
    if(width >= 500){
        width = 700;
        height = 344;
        inputEvent = "mousedown";
    }

    //create listener for input event
    document.addEventListener(inputEvent, onpress);

}

function onpress(evt){
    switch(currentState){
        case states.Splash:
            currentState = states.Game;
            bird.jump();
            break;
        case states.Game:
            bird.jump();
            break;
        case states.Score:
            //reset to Splash
            //showScore();
            //currentState = states.Splash;
            break;
    }
}


function canvasSetup(){
    canvas = document.createElement("canvas");
    // canvas.style.border = "15px solid #666666";

    canvas.id = "mycanvas";
    canvas.width = width;
    canvas.height = height;

    renderingContext = canvas.getContext("2d");
}

function CoralCollection() {
    this._corals = [];

    /**
     * Empty corals array
     */
    this.reset = function () {
        this._corals = [];
    };

    /**
     * Creates and adds a new Coral to the game.
     */
    this.add = function () {
        this._corals.push(new Coral()); // Create and push coral to array
    };

    /**
     * Update the position of existing corals and add new corals when necessary.
     */
    this.update = function () {
        if (frames % 100 === 0) { // Add a new coral to the game every 100 frames.
            this.add();
        }

        for (var i = 0, len = this._corals.length; i < len; i++) { // Iterate through the array of corals and update each.
            var coral = this._corals[i]; // The current coral.

            if (i === 0) { // If this is the leftmost coral, it is the only coral that the bird can collide with . . .
                coral.detectCollision(); // . . . so, determine if the bird has collided with this leftmost coral.
            }

            coral.x -= 2; // Each frame, move each coral two pixels to the left. Higher/lower values change the movement speed.
            if (coral.x < -coral.width) { // If the coral has moved off screen . . .
                this._corals.splice(i, 1); // . . . remove it.
                i--;
                len--;
            }
        }
    };

    /**
     * Draw all corals to canvas context.
     */
    this.draw = function () {
        for (var i = 0, len = this._corals.length; i < len; i++) {
            var coral = this._corals[i];
            coral.draw();
        }
    };
}

/**
 * The Coral class. Creates instances of Coral.
 */
function Coral() {
    this.x = 750;
    //this.y = height - (bottomCoralSprite.height + foregroundSprite.height + 120 + 200 * Math.random());
    this.y = height - (bottomCoralSprite.height + 80 + (200 * Math.random()));
    this.width = bottomCoralSprite.width;
    this.height = bottomCoralSprite.height;

    /**
     * Determines if the bird has collided with the Coral.
     * Calculates x/y difference and use normal vector length calculation to determine
     */
    this.detectCollision = function () {
        // intersection
        var cx = Math.min(Math.max(bird.x, this.x), this.x + this.width);
        var cy1 = Math.min(Math.max(bird.y, this.y), this.y + this.height);
        var cy2 = Math.min(Math.max(bird.y, this.y + this.height + 100), this.y + 2 * this.height + 0);
        // Closest difference
        var dx = bird.x - cx;
        var dy1 = bird.y - cy1;
        var dy2 = bird.y - cy2;
        // Vector length
        var d1 = dx * dx + dy1 * dy1;
        var d2 = dx * dx + dy2 * dy2;
        var r = bird.radius * bird.radius;
        // Determine intersection
        // if (r > d1 || r > d2) {
        if (r > d2){
            currentState = states.Score;
        }
    };

    this.draw = function () {
        bottomCoralSprite.draw(renderingContext, this.x, this.y);
        topCoralSprite.draw(renderingContext, this.x, this.y + 100 + this.height);

    }
}





