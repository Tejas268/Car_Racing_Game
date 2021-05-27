// Game States
var PLAY = 0;
var END = 1;
var gameState = PLAY;

var car, score, gameOver, restart, rCar, gCar, pCar, yCar, poCar, rTruck, oTruck, ambulance;
var carImage, roadImage, gameOverImage, restartImage, carCrashSound;
var w, h, z, r1, r2, r3, V;
var roadGroup, carsGroup;

function preload(){
    carImage = loadImage("car.png");
    rCar = loadImage("rcar.png");
    gCar = loadImage("gcar.png");
    pCar = loadImage("pcar.png");
    poCar = loadImage("pocar.png");
    yCar = loadImage("ycar.png");
    rTruck = loadImage("rtruck.png");
    oTruck = loadImage("otruck.png");
    roadImage = loadImage("road.png");
    ambulance = loadImage("ambulance.png");
    gameOverImage = loadImage("gameOver.png");
    restartImage = loadImage("reset.png");

    carCrashSound = loadSound("carcrash.mp3");

}

function setup() {
    w = 1366;
    h = 657;
    createCanvas(w,h);

    roadGroup = createGroup();
    carsGroup = createGroup();

    score = 0;
    V = 8 + score/100;

    setupRoad();

    r1 = createSprite(w/2.8,h/2,roadGroup[0].width,h);
    r1.visible = false;
    r2 = createSprite(w/2.8+240,h/2,roadGroup[0].width,h);
    r2.visible = false;
    r3 = createSprite(w/2.8+480,h/2,roadGroup[0].width,h);
    r3.visible = false;

    car = createSprite(roadGroup[1].x,h-90,20,20);
    car.addImage(carImage);
    car.scale = 0.22;

    gameOver = createSprite(w/2,h/3,20,20);
    gameOver.addImage(gameOverImage);
    gameOver.scale = 0.1;
    gameOver.visible = false;

    restart = createSprite(w/2,gameOver.y+60,20,20);
    restart.addImage(restartImage);
    restart.scale = 0.3;
    restart.visible = false;

}

function draw() {
    background("black");

    if(gameState === PLAY) {
        
        score = score + Math.round(getFrameRate()/60);

        // moving car
        if (keyDown("right")) {
            car.velocityX = 14;
        } else if (keyDown("left")) {
            car.velocityX = -14;
        }

        if(r1.isTouching(car) || r3.isTouching(car)) {
            z = 1;
        }

        // stop car when it arrives on the other road
        if (car.x < r1.x) {
            car.velocityX = 0;
            car.x = r1.x;
        } else if (car.x > r3.x) {
            car.velocityX = 0;
            car.x = r3.x;
        } 
        if (car.x > r2.x && z === 1 && car.x < r2.x+10 ||
             car.x < r2.x && z === 1 && car.x > r2.x-4) {
            car.velocityX = 0;
            car.x = r2.x;
            z = 2;
        }

        if (carsGroup.isTouching(car)) {
            gameState = END;
        }

        spawnCars();
        spawnRoad();

    } else if (gameState === END) {
        roadGroup.setVelocityYEach(0);
        carsGroup.setVelocityYEach(0);
        roadGroup.setLifetimeEach(-1);
        carsGroup.setLifetimeEach(-1);
        carsGroup.setDepthEach(restart.depth-2);

        if(z === 1 || z === 2) {
            carCrashSound.play();
            z = 3;
        }

        car.velocityX = 0;

        gameOver.visible = true;
        restart.visible = true;

        if  (mousePressedOver(restart) || keyDown("space")) {
            reset();
        }
    }

    drawSprites();

    textSize(20);
    fill("white");
    text("score: "+score,w/54,30);
 
}

function spawnRoad() {
    if (frameCount % 53 === 0) {

        for(var i = w/2.8; i < w/1.4; i = i + 240) {
            var road = createSprite(i,-200,20,20);
            road.addImage(roadImage);
            road.velocityY = V;
            road.scale = 1.8;
            road.depth = car.depth -1;
            road.lifetime = 250;
    
            roadGroup.add(road);
        }
    }
}

function spawnCars() {
    if(frameCount % 100 === 0) {
        var ob = createSprite(r1.x,-100,20,20);
        var r = Math.round(random(1,3));
        if (r === 1) {
            ob.x = r1.x;
        } else if (r === 2) {
            ob.x = r2.x;
        } else if (r === 3) {
            ob.x = r3.x;
        } 
         ob.velocityY = V + 12;

         // generating random obstacles
         var rand = Math.round(random(1,8));

        switch (rand) {
            case 1: ob.addImage(ambulance);
                    ob.scale = 0.52;
                    ob.setCollider("rectangle",0,0,200,450);
                    break;
            case 2: ob.addImage(gCar);
                    ob.scale = 0.48;
                    ob.setCollider("rectangle",0,0,200,440);
                    break;
            case 3: ob.addImage(pCar);
                    ob.scale = 0.53;
                    ob.setCollider("rectangle",0,0,200,420);
                    break;
            case 4: ob.addImage(poCar);
                    ob.scale = 0.48;
                    ob.setCollider("rectangle",0,0,200,460);
                    break; 
            case 5: ob.addImage(rCar);
                    ob.scale = 0.6;
                    ob.setCollider("rectangle",0,0,150,350);
                    break; 
            case 6: ob.addImage(yCar);
                    ob.scale = 0.38;
                    ob.setCollider("rectangle",0,0,200,470);
                    break;
            case 7: ob.addImage(rTruck);
                    ob.scale = 0.49;
                    ob.setCollider("rectangle",0,0,200,540);
                    break;
            case 8: ob.addImage(oTruck);
                    ob.scale = 0.49;
                    ob.setCollider("rectangle",0,0,200,540);
                    break;
            default: break;
        }
        
        ob.lifetime = 250;
        ob.debug = true;

        carsGroup.add(ob);
    }
}

function reset() {
    gameState = PLAY;
    carsGroup.destroyEach();
    roadGroup.destroyEach();
    car.x = r2.x;
    console.log(car.y);
    score = 0;
    z = 2;
    gameOver.visible = false;
    restart.visible = false;

    setupRoad();
    roadGroup.setDepthEach(car.depth-1);
}

function setupRoad() {
    for(var a = -135; a < h; a = a + 260) {

        for(var i = w/2.8; i < w/1.4; i = i + 240) {
            var road = createSprite(i,a,20,20);
            road.addImage(roadImage);
            road.velocityY = V;
            road.lifetime = 250;
            road.scale = 1.8;

            roadGroup.add(road);
        }
    }
}