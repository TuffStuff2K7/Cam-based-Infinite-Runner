var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage, cloud, cloudImages, obstacle, obstacleImages1, obstacleImages2, obstacleImages3, obstacleImages4, obstacleImages5, obstacleImages6;
var GroupClouds, GroupObstacles;
var gameOver, gameOverImage, restart, restartImage;
var die, jump, check, PLAY = 1, END = 0, gameState = PLAY;

var score = 0;

localStorage["HighestScore"]=0;

function preload(){
  
  trex_running = loadAnimation("Sprites/trex1.png","Sprites/trex2.png","Sprites/trex3.png");
  trex_collided = loadImage("Sprites/trex_collided.png");
  groundImage = loadImage("Sprites/ground2.png")
  cloudImages = loadImage("Sprites/cloud.png");
  
  obstacleImages1 = loadImage("Sprites/obstacle1.png");
  obstacleImages2 = loadImage("Sprites/obstacle2.png");
  obstacleImages3 = loadImage("Sprites/obstacle3.png");
  obstacleImages4 = loadImage("Sprites/obstacle4.png");
  obstacleImages5 = loadImage("Sprites/obstacle5.png");
  obstacleImages6 = loadImage("Sprites/obstacle6.png");
  gameOverImage = loadImage("Sprites/gameOver.png");
  
  restartImage = loadImage("Sprites/restart.png");
  die = loadSound("Assets/die.mp3");
  jump = loadSound("Assets/jump.mp3");
  check = loadSound("Assets/checkPoint.mp3");

}

function setup() {
  
  createCanvas(450, 200);
  
  trex = createSprite(200,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,200,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -20;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  imageMode(CENTER);

  gameOver = createSprite(225+150,80,20,20);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.6;
  gameOver.visible = false;
  
  restart = createSprite(225+150,130,20,20);
  restart.addImage(restartImage);
  restart.scale = 0.5;
  restart.visible = false;
  
  GroupClouds = new Group();
  GroupObstacles = new Group();

  trex.debug = true;
  trex.setCollider("circle",0,0,40);

}

function draw() {
  
  background("white");
  
  if(gameState === PLAY){
    
    ground.velocityX = -(2+ Math.round(score/100));
    
  if((keyDown("space") || keyDown("up") || keyDown("w"))&& trex.y > 161) {
    trex.velocityY = -10;
    jump.play();
  }
 
  trex.velocityY = trex.velocityY + 0.5;
  camera.position.x=trex.x+150;
  
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  
  SpawnClouds();
  spawnObstacles();
    
    score = score + Math.round(getFrameRate()/60);
    
    if(score > 0 && score % 100 === 0){
      check.play();
    }
    
    if(GroupObstacles.isTouching(trex)){
      die.play();
      gameState = END;
    }
    
  } else if(gameState === END){
    GroupObstacles.setVelocityXEach(0);
    GroupClouds.setVelocityXEach(0);
    trex.changeAnimation("collided", trex_collided);
    ground.velocityX=0;
    trex.velocityY=0;
    GroupObstacles.setLifetimeEach(-1);
    GroupClouds.setLifetimeEach(-1);

    gameOver.visible = true;
    restart.visible = true;
  } 
  
  trex.collide(invisibleGround);
  
    if(localStorage["HighestScore"] < score){
    localStorage["HighestScore"]=score;
  }
  
  text("Score: " +score, 500,50);
  text("High Score: "+localStorage["HighestScore"],400,50);
  
  if(mousePressedOver(restart)){
    reset();
  }

  GroupObstacles.setVelocityXEach(ground.velocityX);
  
  drawSprites();
  
}

function reset() {
   
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  GroupObstacles.setLifetimeEach(0);    
  GroupClouds.setLifetimeEach(0);  
  
  trex.changeAnimation("running", trex_running);
  
  // console.log(localStorage["HighestScore"]);
  
  score = 0;
  sec = 0; 

}

function SpawnClouds(){
  
  if (frameCount % 60 === 0) {
    cloud = createSprite(600,50,40,10);
    cloud.y = random(50,160);
    cloud.addImage("cloud",cloudImages);
    cloud.scale = 0.5;
    cloud.velocityX = -1;
    
    cloud.lifetime = 800;
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    GroupClouds.add(cloud);
  }

}
  
function spawnObstacles() {

  if(frameCount % 80 === 0) {
    obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -3;
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    
    switch(rand){
      case 1: obstacle.addImage("Sprites/obstacle1", obstacleImages1);
        break;
        
      case 2: obstacle.addImage("Sprites/obstacle2",obstacleImages2);
        break;
        
      case 3: obstacle.addImage("Sprites/obstacle3",obstacleImages3);
        break;
        
      case 4: obstacle.addImage("Sprites/obstacle4",obstacleImages4);
        break;
        
      case 5: obstacle.addImage("Sprites/obstacle5",obstacleImages5);
        break;
        
      case 6: obstacle.addImage("Sprites/obstacle6",obstacleImages6);
        break;
        
      default: break; 
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 500;
    
    GroupObstacles.add(obstacle);
  }

}

  
