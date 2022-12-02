let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.width = 700
canvas.height = 700

const rectWidth = 50
const rectHeight = 50

const minRectangles = 3;
const maxRectangles = 7;

let shot = 0;

class Rectangle {
    constructor(xpos, ypos) {
        this.xpos = xpos;
        this.ypos = ypos;

        this.xspeed = Math.floor(Math.random() * 5  + 1);
        this.yspeed = Math.floor(Math.random() * 5  + 1);

        this.width = rectWidth;
        this.height = rectHeight;

        this.xdirection = 1;
        this.ydirection = 1;

        this.dx = this.xdirection * this.xspeed;
        this.dy = this.ydirection * this.yspeed;
    }

    draw(ctx){
        ctx.fillRect(this.xpos, this.ypos, this.width, this.height);
    }

    update(ctx){
        this.updateXPos();
        this.updateYPos();

        this.draw(ctx);
    }

    updateXPos() {
        // on edge, change direction
        if(this.xpos + this.width == canvas.width || this.xpos == 0) {
            this.xspeed = this.getUpdatedSpeed(this.xspeed);  // get new speed
            this.xdirection *= -1;
            this.xpos += this.xdirection * this.xspeed;
        }

        // moving will go over bounds, but we need to touch bounds
        else if(this.xpos + this.width > canvas.width) {
            this.xpos = canvas.width - this.width;
        } else if (this.xpos < 0) {
            this.xpos = 0;
        }

        // no problems, just move
        else {
            this.xpos += this.xdirection * this.xspeed;
        }

    }

    updateYPos() {
        // on edge, change direction
        if(this.ypos + this.height == canvas.height || this.ypos == 0) {
            this.yspeed = this.getUpdatedSpeed(this.yspeed);
            this.ydirection *= -1;
            this.ypos += this.ydirection * this.yspeed;
        }
        // moving will go over bounds, but we need to touch bounds
        else if(this.ypos + this.height > canvas.height) {
            this.ypos = canvas.height - this.height;
        } else if(this.ypos < 0) { 
            this.ypos = 0;
        }
        // no problems, just move
        else {
            this.ypos += this.ydirection * this.yspeed;
        }
    }

    getUpdatedSpeed(speed) {
        // adds random value
        let randomValue = Math.floor(Math.random() * 5 - 2);
        let updatedSpeed = Math.abs(speed - randomValue);

        // min and max speed check
        if(updatedSpeed == 0) {
            updatedSpeed = 1;
        }

        if(updatedSpeed > 5) {
            updatedSpeed = 5
        }

        return updatedSpeed;
    }

    isInShape(mouseX, mouseY) {
        if(mouseX >= this.xpos && mouseX <= this.xpos + this.width
        && mouseY >= this.ypos && mouseY <= this.ypos + this.height){
            return true;
        }
            
        
        return false;
    }

    clear(ctx) {
        ctx.clearRect(this.xpos, this.ypos, this.width, this.height)
    }
    
}


let generatedRectangles = Math.floor(Math.random() * (maxRectangles - minRectangles + 1)) + minRectangles;

let rectangles = []

let addText = function(){
    ctx.strokeStyle = "white"
    ctx.strokeRect(canvas.width - 150, 0, 150, 80)

    ctx.fillStyle = "white";
    ctx.font = "15px Georgia";
    ctx.fillText("Generated: " + generatedRectangles, canvas.width - 150 + 20, 20)
    ctx.fillText("Shot: " + shot, canvas.width - 150 + 20, 50)
    ctx.fillStyle = "green";
}


for(let i = 0; i < generatedRectangles; i++) {
    let random_x = Math.random() * canvas.width
    let random_y = Math.random() * canvas.height

    let rectangle = new Rectangle(random_x, random_y)
    rectangle.draw(ctx);
    rectangles.push(rectangle)
}


let clearScreen = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

let updateRectangle = function() {
    requestAnimationFrame(updateRectangle);
    clearScreen();
    
    for(let i = 0; i < rectangles.length; i++) {
        rectangles[i].update(ctx);
    }

    addText();
}

canvas.addEventListener('click', (event) => {
    let bound = canvas.getBoundingClientRect();

    let mouseX = event.clientX - bound.left;
    let mouseY = event.clientY - bound.top;

    for(let i = 0; i < rectangles.length; i++) {
        let rect = rectangles[i];
        if(rect.isInShape(mouseX, mouseY)) {
            rectangles.splice(i, 1);
            shot += 1;
            break;
        }
    }
})


updateRectangle();

