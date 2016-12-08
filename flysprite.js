/**
 * Created by kendratate on 11/14/16.
 */
var birdSprite;
var backgroundSprite;
var foreground;
var topCoralSprite;
var bottomCoralSprite;

function Sprite(img, x, y, width, height){
    this.img = img;
    this.x = x;  //for mobile, multiply all of these by 2 (graphics are drawn twice as big to look good on high retina screen)
    this.y = y;
    this.width = width;
    this.height = height;
}

Sprite.prototype.draw = function(renderingContext, x, y){
    renderingContext.drawImage(this.img, this.x, this.y, this.width, this.height, x, y, this.width, this.height);
}

function initSprite(img){
    birdSprite = [
        new Sprite(img, 1, 1, 93, 62), // x, y, width, height
        new Sprite(img, 98, 1, 93, 62),
        new Sprite(img, 195, 1, 93, 66),
    ];

    topCoralSprite = new Sprite(img, 150, 150, 100, 300);
    bottomCoralSprite = new Sprite(img, 280, 150, 100, 300);

    //foreground = new Sprite(img, 1, 100, 10, 10);
    //laserSprite = new Sprite(img, , , ,);
}


