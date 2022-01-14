const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground;
var fruit, rope, rope2;
var fruit_con, fruit_con2;
var bgImg, fImg, bImg, bunny, button, button2;
var blink, eat, sad;
var bgSound, sadSound, eatingSound, airSound, cutSound;
var muteButton, blower;

function preload()
{
  bgImg = loadImage("background.png");
  fImg = loadImage("melon.png");
  bImg = loadImage("Rabbit-01.png");

  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png","eat_1.png","eat_2.png","eat_3.png","eat_4.png")
  sad = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;

  blink.looping = true;
  eat.looping = false;
  sad.looping = false;

  bgSound = loadSound("sound1.mp3");
  sadSound = loadSound("sad.wav");
  cutSound = loadSound("rope_cut.mp3");
  eatingSound = loadSound("eating_sound.mp3");
  airSound = loadSound("air.wav");

}

function setup() 
{
  createCanvas(500,700);
  frameRate(80);
  engine = Engine.create();
  world = engine.world;
  ground = new Ground(200,680,600,20);

  rope = new Rope(7,{x:165,y:30});
  rope2 = new Rope(7,{x:335,y:30});

  fruit = Bodies.circle(300,300,20);
  Matter.Composite.add(rope.body,fruit);

  fruit_con = new Link(rope,fruit);
  fruit_con2 = new Link(rope2,fruit);
  
  imageMode(CENTER);
  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50);

  bunny = createSprite(250, 630, 10, 10);
  bunny.addImage(bImg);
  bunny.scale = 0.15;

  blink.frameDelay = 20;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  bunny.addAnimation("blinking", blink);
  bunny.addAnimation("eating", eat);
  bunny.addAnimation("crying", sad);

  bunny.changeAnimation("blinking");

  button = createImg("cut_button.png");
  button.position(150, 30);
  button.size(30, 30);
  button.mouseClicked(drop);

  button2 = createImg("cut_button.png");
  button2.position(320, 30);
  button2.size(30, 30);
  button2.mouseClicked(drop2);

  bgSound.play();

  muteButton = createImg("mute.png");
  muteButton.position(450, 30);
  muteButton.size(30, 30);
  muteButton.mouseClicked(mute);

  blower = createImg("balloon.png");
  blower.position(50, 250);
  blower.size(150, 100);
  blower.mouseClicked(airBlow);
}

function draw() 
{
  background(51);

  image(bgImg, width/2, height/2, 500, 700);

  rope.show();
  rope2.show();

  if(fruit != null)
  {
    image(fImg,fruit.position.x,fruit.position.y,60,60);
  }

  Engine.update(engine);
  ground.show();

  if(collide(fruit, bunny) == true)
  {
    bunny.changeAnimation("eating");

    eatingSound.play();
  }

  if(fruit != null && fruit.position.y >= 600)
  {
    bunny.changeAnimation("crying");

    bgSound.stop();

    sadSound.play();

    fruit = null;

  }
    
  drawSprites(); 
}

function drop()
{
  rope.break();
  fruit_con.break();

  fruit_con = null;

  cutSound.play();
}

function drop2()
{
  rope2.break();
  fruit_con2.break();

  fruit_con2 = null;

  cutSound.play();
}

function collide(body, sprite)
{
  if(body != null)
  {
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
  }

  if(d <= 80)
  {
    World.remove(world, body);
    fruit = null;
    return true;
  }
  else
  {
    return false;
  }

}

function mute()
{
  if(bgSound.isPlaying())
  {
    bgSound.stop();
  }
  else
  {
    bgSound.play();
  }
}

function airBlow()
{
  Matter.Body.applyForce(fruit, {x:0, y:0}, {x:0.01, y:0});

  airSound.play();
}
