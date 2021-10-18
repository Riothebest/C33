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
var rope , rope2 ,rope3;
var fruit;
var constraintlink,constraintlink2,constraintlink3; 
var backgroundImg, fruitImg, bunnyImg1;
var bunny;
var button , button2, button3;
var blink, eat, sad;
var backgroundSound, eatingSound, sadSound, blowSound, cutSound;
var blower;
var muteButton;
var canW ,canH;

function preload()
{
  backgroundImg = loadImage("background.png");
  fruitImg = loadImage("melon.png");
  bunnyImg1 = loadImage('Rabbit-01.png');
  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png","eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");

  backgroundSound = loadSound("sound1.mp3");
  eatingSound = loadSound("eating_sound.mp3");
  sadSound=  loadSound("sad.wav");
  blowSound = loadSound("air.wav");
  cutSound = loadSound("rope_cut.mp3");
  //flag predefined
  //this will enable the play mode of the animation
  blink.playing = true;
  eat.playing = true; 
  sad.playing = true;
// ensure the looping doesn't excute
  eat.looping = false;
  sad.looping = false

}
function setup() 
{
  createCanvas(500,700);
  engine = Engine.create();
  world = engine.world;
 
  rectMode(CENTER);
  ellipseMode(RADIUS);

  textSize(50);


  var iMobile = /iPhone|iPod|iPad|Android/i.test(navigator.userAgent)

   if(iMobile)
   {
      canW = displayWidth;
      canH = displayHeight;

      createCanvas(canW+80, canH)
   }

   else{

     canW = windowWidth;
     canH = windowHeight
      createCanvas(canW,canH)
   }

  ground = new Ground(250,canH,width,20);

  rope= new Rope(11,{x:110, y:30});

  rope2= new Rope(8,{x:300, y:30});

  rope3= new Rope(7,{x:410, y:150});

  var fruit_options ={
    density: 0.0001
  }
  
  fruit = Bodies.circle(240,100,10,fruit_options);

  Matter.Composite.add(rope.body,fruit);

    constraintlink = new Link(rope,fruit);

    Matter.Composite.add(rope2.body,fruit);

    constraintlink2 = new Link(rope2,fruit);

    Matter.Composite.add(rope3.body,fruit);

    constraintlink3 = new Link(rope3,fruit);

  imageMode(CENTER);
 
  blink.frameDelay = 10;
  eat.frameDelay = 10;
  sad.frameDelay = 10;


  bunny = createSprite(340,canH-100,10,10);
  //bunny.addImage(bunnyImg1);
  bunny.addAnimation('blink', blink);
  bunny.addAnimation("eat",eat);
  bunny.addAnimation("sad",sad);
  bunny.changeAnimation('blink');
  bunny.scale = 0.18;

  //domstyle -- html format in the javascript
  button = createImg('cut_button.png');
  button.position(100,30);
  button.size(60,60);
  button.mouseClicked(cutTheRope)

  button2 = createImg('cut_button.png');
  button2.position(300,30);
  button2.size(60,60);
  button2.mouseClicked(cutTheRope2)

  button3= createImg('cut_button.png');
  button3.position(380,150);
  button3.size(60,60);
  button3.mouseClicked(cutTheRope3)

  blower = createImg("balloon.png");
  blower.position(100,150);
  blower.size(100,70);
  blower.mouseClicked(airBlower);

  muteButton = createImg("mute.png");
  muteButton.position(460,50);
  muteButton.size(30,30)
  muteButton.mouseClicked(mute);
  
  backgroundSound.play();
  backgroundSound.setVolume(1);
}

function draw() 
{
  background(51);
  image(backgroundImg,canW/2,canH/2,canW,canH);
  Engine.update(engine);
   ground.display();
 // image(fruitImg,fruit.position.x,fruit.positio
 
 if(fruit!=null)
 {
    image(fruitImg,fruit.position.x,fruit.position.y,60,60);
 }
 //  ellipse(fruit.position.x,fruit.position.y,10,10);
   rope.show();
   rope2.show();
   rope3.show();


/*if(!backgroundSound.isPlaying())
{
  backgroundSound.play();
}*/
//change the animation 
   if(collide(fruit, bunny) == true)
   {
       bunny.changeAnimation('eat');
       eatingSound.play();
   }

   else if(collide(fruit, ground.body) == true)
   {
     bunny.changeAnimation('sad')
     backgroundSound.stop();
     sadSound.play();

   }
   
   drawSprites();
   
   
}

function cutTheRope()
{
  //1. rope is breaking off (need to call break())
  rope.break();

  //2. fruit needs to fall off(need to call detach())
  constraintlink.detach();
 // constraintlink = null;
 cutSound.play();
}

function cutTheRope2()
{
  //1. rope is breaking off (need to call break())
  rope2.break();

  //2. fruit needs to fall off(need to call detach())
  constraintlink2.detach();
 // constraintlink = null;
 cutSound.play();
}

function cutTheRope3()
{
  //1. rope is breaking off (need to call break())
  rope3.break();

  //2. fruit needs to fall off(need to call detach())
  constraintlink3.detach();
 // constraintlink = null;
 cutSound.play();
}
//logic for the collision detection : measure distance
function collide(body, sprite)
{

     if(body!=null)
     {
       //dist() in-built instruction in the p5.js library
         var d = dist(body.position.x, body.position.y,sprite.position.x, sprite.position.y)
     
          if(d<=90)
          {
              World.remove(world, fruit);
              fruit = null;
              return true;
          }

          else{
              
             return false;
          }
     
      }
}

function airBlower()
{
  Matter.Body.applyForce(fruit,{x:0,y:0},{x:0.01,y:-0.01});
  blowSound.play();
  blowSound.setVolume(1);
}

function mute()
{
  if(backgroundSound.isPlaying())
  {
    backgroundSound.stop();
  }
  else
  {
    backgroundSound.play();
    backgroundSound.setVolume(1);
  }

}