
//board
let board;
let boardWidth = 900;
let boardHeight = 350;
let context;

//human
let humanWidth = 98.4; // 82
let humanHeight = 114.3; // 97
let humanX = 50;
let humanY = boardHeight - humanHeight;
let humanImg;

let human = {
    x : humanX,
    y : humanY,
    width : humanWidth,
    height : humanHeight
}

//item
let itemArray = [];

let item1Width = 24;
let item2Width = 80;
let item3Width = 116;
let item4Width = 100;

let itemHeight = 82;
let itemBonusHeight = 60;
let itemX = boardWidth - 40;
let itemY = boardHeight - itemHeight;

let item1Img;
let item2Img;
let item3Img;
let item4Img;

//physics
let velocityX = -8; //item moving left speed
let velocityY = 0;
let gravity = .35;

let gameOver = false;
let score = 0;
let bestScore = 0;
let scoreElem;
let bestScoreElem;
let restartBtn;

window.onload = function restartGame() {
    board = document.getElementById("board");
    scoreElem = document.querySelector(".score__value");
    bestScoreElem = document.querySelector(".bestscore__value");
    restartBtn = document.querySelector(".restart");
    imgMeme = document.querySelector(".img");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //used for drawing on the board

    //draw initial humansaur
    // context.fillStyle="green";
    // context.fillRect(human.x, human.y, human.width, human.height);

    humanImg = new Image();
    humanImg.src = "./img/human.png";
    humanImg.onload = function() {
        context.drawImage(humanImg, human.x, human.y, human.width, human.height);
    }

    item1Img = new Image();
    item1Img.src = "./img/bottle.png";

    item2Img = new Image();
    item2Img.src = "./img/letter.png";

    item3Img = new Image();
    item3Img.src = "./img/bottle3.png";

    item4Img = new Image();
    item4Img.src = "./img/georgia.png";

    requestAnimationFrame(update);
    setInterval(placeItem, 600); //1000 milliseconds = 1 second
    document.addEventListener("keydown", movehuman);
    restartBtn.addEventListener("click", () => {
        gameOver = false;
        score = 0;
        velocityX = -8;
        itemArray.length = 0;
        imgMeme.style.display = "none";
        board.style.display = "inline-block";
        restartBtn.style.display = "none";
    })
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        if (bestScore < score) {
            bestScore = score;
        }
        bestScoreElem.textContent = `${bestScore}`;
        restartBtn.style.display = "inline-block";
        board.style.display = "none";
        imgMeme.style.display = "inline-block";
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //human
    velocityY += gravity;
    human.y = Math.min(human.y + velocityY, humanY); //apply gravity to current human.y, making sure it doesn't exceed the ground
    if (human.y == humanY && humanImg.src !== "./img/human.png") {
        human.humanHeight = 114.3; // 97 + 20%
        humanImg.src = "./img/human.png";
        humanImg.onload = function() {
            context.drawImage(humanImg, human.x, human.y, human.width, human.height);
        }
    }
    context.drawImage(humanImg, human.x, human.y, human.width, human.height);

    //item
    for (let i = 0; i < itemArray.length; i++) {
        let item = itemArray[i];
        item.x += velocityX;
        context.drawImage(item.img, item.x, item.y, item.width, item.height);

        if (detectCollision(human, item)) {
            if (item.img == item4Img) {
                imgMeme.src = "./img/freedom.jpg"
                alert('U win, bro')
            } else if (item.img == item2Img) {
                imgMeme.src = "./img/bakhmut.png"
            } else {
                imgMeme.src = "./img/jail.jpg"
            }
            gameOver = true;
         //   humanImg.src = "./img/human.png";
         //   humanImg.onload = function() {
         //     context.drawImage(humanImg, human.x, human.y, human.width, human.height);
         //   }
        }
    }
    //score
    score++;
    if (Number.isInteger(score / 1000)) {
        up = score / 1000;
        velocityX -= ((score / 1000) / up);
        console.log(velocityX)
    }
    scoreElem.textContent = `${score}`;
}

function movehuman(e) {
    if ((e.code == "Space" || e.code == "ArrowUp") && human.y == humanY) {
        //jump
        human.humanHeight = 111.6; // 93 + 20%
        humanImg.src = "./img/humanJump.png";
        humanImg.onload = function() {
            context.drawImage(humanImg, human.x, human.y, human.width, human.height);
        }
        velocityY = -10;
    }
    else if (e.code == "ArrowDown" && human.y == humanY) {
        //duck
    } else if (e.code == "Enter") {
        imgMeme.style.display = "none";
        board.style.display = "inline-block";
        restartBtn.style.display = "none";
        gameOver = false;
        velocityX = -8;
        score = 0;
        itemArray.length = 0;
    }
}

function placeItem() {
    if (gameOver) {
        return;
    }

    //place item
    let item = {
        img : null,
        x : itemX,
        y : itemY,
        width : null,
        height: itemHeight
    }

    let placeItemChance = Math.random(); //0 - 0.9999...

    if (placeItemChance > .99 && score > 5000)  { //1% you get item4
        item.img = item4Img;
        item.width = item4Width;
        item.height = itemBonusHeight;
        item.y = 38;
        itemArray.push(item);
    } else if (placeItemChance > .90) { //10% you get item3
        item.img = item3Img;
        item.width = item3Width;
        itemArray.push(item);
    } else if (placeItemChance > .70) { //30% you get item2
        item.img = item2Img;
        item.width = item2Width;
        itemArray.push(item);
    } else if (placeItemChance > .50) { //50% you get item1
        item.img = item1Img;
        item.width = item1Width;
        itemArray.push(item);
    }

    if (itemArray.length > 10) {
        itemArray.shift(); //remove the first element from the array so that the array doesn't constantly grow
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}