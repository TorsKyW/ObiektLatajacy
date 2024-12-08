const canvas = document.querySelector("canvas");
const ctx=canvas.getContext('2d');
const StartButton = document.querySelector(".start");
const GameOver = document.querySelector('.gameover');
const timer=document.querySelector('.timer');
const hearts = document.querySelectorAll('img[src="heart.png"]');
const killcount = document.querySelector('.killcount');
const highscore = document.querySelector('.highscorevalue');
let keys={};
let game;
canvas.width=700;
canvas.height=700;
const playerimg = new Image;
const boomerangimg = new Image;
const goblinimg = new Image;
goblinimg.src='goblin.png';
boomerangimg.src ='boomerang.png'
playerimg.src='stickman.png'; 
const Colision = (ent1,ent2)=>{
    if(ent1.x-ent1.width/2+ent1.width-(ent1.width-ent1.hitboxWidth)/2>=ent2.x-ent2.width/2+(ent2.width-ent2.hitboxWidth)/2&&ent2.x-ent2.width/2+ent2.width-(ent2.width-ent2.hitboxWidth)/2>=ent1.x-ent1.width/2+(ent1.width-ent1.hitboxWidth)/2
    &&ent1.y-ent1.height/2+ent1.height>=ent2.y-ent2.height/2&&ent2.y-ent2.height/2+ent2.height>=ent1.y-ent1.height/2){
        return true;
    }
    return false;
}


const removeHp=(attacker,defender)=>{
    if(Colision(attacker,defender)&&!defender.invincible&&attacker.alive&&defender.alive){
        defender.hp-=1;
        defender.invincible=true;
        setTimeout(() => {
            defender.invincible=false;                
        }, 1500);
    }
}
const positionChecker= (ent)=>{
    if(ent.x<canvas.width/2&&ent.y<canvas.height/2){
        return 1;
    }
    if(ent.x>=canvas.width/2&&ent.y<canvas.height/2){
        return 2;
    }
    if(ent.x<canvas.width/2&&ent.y>=canvas.height/2){
        return 3;
    }
    if(ent.x>=canvas.width/2&&ent.y>=canvas.height/2){
        return 4;
    }
}
class Entity {
    constructor(x,y,width,height,hp){
        this.hp=hp;
        this.originalhp=hp;
        this.x = x+width/2;
        this.originalX=x+width/2;
        this.y = y+height/2;
        this.originalY=y+height/2;
        this.height=height;
        this.width=width;
        this.hitboxWidth=width;
        this.alive=true;
        this.invincible=false;
    }
    moveX(distance){
        this.x=this.x+distance;
    }
    moveY(distance){
        this.y=this.y+distance;
    }
    Die(){
        this.alive=false;
    }
}
class Enemy extends Entity{
    constructor(x,y,width,height,hp){
        super(x,y,width,height,hp);
        this.hitboxWidth=width*.55;
    }
    Draw(){
        if(this.alive){
            ctx.drawImage(goblinimg,this.x-this.width/2,this.y-this.height/2,this.width,this.height);
        }
    }
    Follow(){
        if(this.alive){            
            if((player.x-this.x)!=0){
                let a=(player.y-this.y)/Math.abs(player.x-this.x);
                this.y += 1/Math.sqrt(1+(a*a))*a;
                this.x += (player.x-this.x)>0 ? 1/Math.sqrt(1+(a*a)) : -1/Math.sqrt(1+(a*a));
            }
            else{ 
                this.y+=(player.y-this.y)>0 ? 3 : -3;
            }                   
        }
    }
    Die(){
        this.alive=false;
        this.hp=this.originalhp;
        killcount.innerHTML=parseInt(killcount.innerHTML)+1;
        if(parseInt(killcount.innerHTML)>parseInt(highscore.innerHTML)){
            highscore.innerHTML=killcount.innerHTML;
        }
        setTimeout(()=>{
            switch(positionChecker(player)){
                case 1:
                    this.x=canvas.width*Math.floor(Math.random()*2);
                    this.y=this.x>0?canvas.height*Math.floor(Math.random()*2):canvas.height;
                    break;
                case 2:
                    this.x=canvas.width*Math.floor(Math.random()*2);
                    this.y=this.x<canvas.width?canvas.height*Math.floor(Math.random()*2):canvas.height;
                    break;
                case 3:
                    this.x=canvas.width*Math.floor(Math.random()*2);
                    this.y=this.x>0?canvas.height*Math.floor(Math.random()*2):0;
                    break;
                case 4:
                    this.x=canvas.width*Math.floor(Math.random()*2);
                    this.y=this.x<canvas.width?canvas.height*Math.floor(Math.random()*2):0;
            }
            this.alive=true;
        },Math.floor(Math.random()*3000)+1000);
        
        
    }
}
class Projectile extends Entity {
    constructor(x,y,width,height){
        super(x,y,width,height);
        this.shot=false;
    }
    Draw(){
        ctx.drawImage(boomerangimg,this.x-this.width/2,this.y-this.height/2,this.width,this.height)
    }
}
let boomerangspeed=1;
class Player extends Entity {
    constructor(x,y,width,height,hp){
        super(x,y,width,height,hp);
    }
    Draw(){
        if(this.alive){
            ctx.drawImage(playerimg,this.x-this.width/2,this.y-this.height/2,this.width,this.height)
        }
    }
    Shoot(direction){
        if(this.alive){
            switch(direction){
                //up
                case 1:
                    if(!boomerang.shot){
                        boomerang.shot=true;
                        boomerang.x=this.x;
                        boomerang.y=this.y;
                        let i=0;
                        const shoot = setInterval(() => {
                            boomerang.y-=6;
                            if(i>40){
                                const back = setInterval(()=>{
                                    if((this.x - boomerang.x) != 0) {
                                        let a = (player.y - boomerang.y) / Math.abs(this.x - boomerang.x);
                                        boomerang.y += boomerangspeed  / Math.sqrt(1 + (a * a)) * a;
                                        boomerang.x += (this.x - boomerang.x) > 0 ? boomerangspeed  / Math.sqrt(1 + (a * a)) : -boomerangspeed  / Math.sqrt(1 + (a * a));
                                    } else { 
                                        boomerang.y += (player.y - boomerang.y) > 0 ? boomerangspeed : -boomerangspeed ;
                                    }
                                                     
                                    if(Math.abs(this.x-boomerang.x)<this.width&&Math.abs(this.y-boomerang.y)<this.height){
                                        boomerang.x=this.x;
                                        boomerang.y=this.y;
                                    }
                                    if(this.x==boomerang.x&&this.y==boomerang.y){
                                        boomerang.shot=false;
                                        boomerangspeed=1;
                                        clearInterval(back);
                                    }
                                    boomerangspeed++;
                                },30)
                                clearInterval(shoot);
                            }
                            i++; 
                        }, 15);
                    }
                    break;
                    //down
                    case 2:
                        if(!boomerang.shot){
                            boomerang.shot=true;
                        boomerang.x=this.x;
                        boomerang.y=this.y+(this.height/2);
                        let i=0;
                        const shoot = setInterval(() => {
                            boomerang.y+=6;
                            if(i>40){
                                const back = setInterval(()=>{
                                    if((this.x - boomerang.x) != 0) {
                                        let a = (player.y - boomerang.y) / Math.abs(this.x - boomerang.x);
                                        boomerang.y += boomerangspeed  / Math.sqrt(1 + (a * a)) * a;
                                        boomerang.x += (this.x - boomerang.x) > 0 ? boomerangspeed  / Math.sqrt(1 + (a * a)) : -boomerangspeed  / Math.sqrt(1 + (a * a));
                                    } else { 
                                        boomerang.y += (player.y - boomerang.y) > 0 ? boomerangspeed : -boomerangspeed ;
                                    }
                                                     
                                    if(Math.abs(this.x-boomerang.x)<this.width&&Math.abs(this.y-boomerang.y)<this.height){
                                        boomerang.x=this.x;
                                        boomerang.y=this.y;
                                    }
                                    if(this.x==boomerang.x&&this.y==boomerang.y){
                                        boomerang.shot=false;
                                        boomerangspeed=1;
                                        clearInterval(back);
                                    }
                                    boomerangspeed++;
                                },30)
                                clearInterval(shoot);
                            }
                            i++; 
                        }, 15);
                    }
                    break;
                    //left
                    case 3:
                        if(!boomerang.shot){
                            boomerang.shot=true;
                            boomerang.x=this.x;
                            boomerang.y=this.y;
                            let i=0;
                            const shoot = setInterval(() => {
                                boomerang.x-=6;
                                if(i>40){
                                    const back = setInterval(()=>{
                                        if((this.x - boomerang.x) != 0) {
                                            let a = (player.y - boomerang.y) / Math.abs(this.x - boomerang.x);
                                            boomerang.y += boomerangspeed  / Math.sqrt(1 + (a * a)) * a;
                                            boomerang.x += (this.x - boomerang.x) > 0 ? boomerangspeed  / Math.sqrt(1 + (a * a)) : -boomerangspeed  / Math.sqrt(1 + (a * a));
                                        } else { 
                                            boomerang.y += (player.y - boomerang.y) > 0 ? boomerangspeed : -boomerangspeed ;
                                        }
                                                         
                                        if(Math.abs(this.x-boomerang.x)<this.width&&Math.abs(this.y-boomerang.y)<this.height){
                                            boomerang.x=this.x;
                                            boomerang.y=this.y;
                                        }
                                        if(this.x==boomerang.x&&this.y==boomerang.y){
                                            boomerang.shot=false;
                                            boomerangspeed=1;
                                            clearInterval(back);
                                        }
                                        boomerangspeed++;
                                    },30)
                                    clearInterval(shoot);
                                }
                                i++; 
                            }, 15);
                    }
                    break;
                    //right
                    case 4:
                        if(!boomerang.shot){
                            boomerang.shot=true;
                            boomerang.x=this.x+(this.width/2);
                            boomerang.y=this.y;
                            let i=0;
                            const shoot = setInterval(() => {
                                boomerang.x+=6;
                                if(i>40){
                                    const back = setInterval(()=>{
                                        if((this.x - boomerang.x) != 0) {
                                            let a = (player.y - boomerang.y) / Math.abs(this.x - boomerang.x);
                                            boomerang.y += boomerangspeed  / Math.sqrt(1 + (a * a)) * a;
                                            boomerang.x += (this.x - boomerang.x) > 0 ? boomerangspeed  / Math.sqrt(1 + (a * a)) : -boomerangspeed  / Math.sqrt(1 + (a * a));
                                        } else { 
                                            boomerang.y += (player.y - boomerang.y) > 0 ? boomerangspeed : -boomerangspeed ;
                                        }
                                                         
                                        if(Math.abs(this.x-boomerang.x)<this.width&&Math.abs(this.y-boomerang.y)<this.height){
                                            boomerang.x=this.x;
                                            boomerang.y=this.y;
                                        }
                                        if(this.x==boomerang.x&&this.y==boomerang.y){
                                            boomerang.shot=false;
                                            boomerangspeed=1;
                                            clearInterval(back);
                                        }
                                        boomerangspeed++;
                                    },30)
                                    clearInterval(shoot);
                                }
                                i++; 
                            }, 15);
                    }
                }
            }
        }
    }
    const player = new Player(canvas.width/2-5,canvas.height/2-5,50,50,3);
    const enemy1 = new Enemy(40,40,150,150,3);
    const enemy2 = new Enemy(500,0,150,150,3);
    const enemy3 = new Enemy(200,630,150,150,3);
    const boomerang = new Projectile(player.x,player.y,30,30);
    const aliveList = [player,enemy1,enemy2,enemy3];
    const entityList = [player,boomerang,enemy1,enemy2,enemy3];
    const enemyList = [enemy1,enemy2,enemy3];
    const Heart=()=>{
        switch(player.hp){
            case 3:
                hearts.forEach(e => {
                    e.style.opacity='1';
                });
                break;
            case 2:
                hearts[2].style.opacity='0';
                break;
            case 1:
                hearts[1].style.opacity='0';
                break;
            case 0:
                hearts[0].style.opacity='0';
        }
    }  
    let playerInvisible = 0;
const update = () =>{
        Heart();
        if(!player.alive){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        GameOver.style.display='block';
        StartButton.style.display='block';
        cancelAnimationFrame(game);
        clearInterval(MovementInterval);
        return;
    }
    ctx.clearRect(0,0,canvas.width,canvas.height);
    enemyList.forEach(e=>{
        removeHp(e,player);
        if(boomerang.shot){
            removeHp(boomerang,e);
        }
        e.Draw();
    })
    aliveList.forEach(e => {
        if(e.hp<1){
            e.Die();
        }
    });

    if(boomerang.shot==1){
        boomerang.Draw();
    }
    if(playerInvisible%5==0){
        player.Draw();
    }
    if(player.invincible){
        playerInvisible+=1;
    }else{
        playerInvisible=0;
    }
    game=requestAnimationFrame(update);
    
}
const Movement=()=>{
    if(keys["a"] && player.x>player.width/2){
        player.moveX(-4);
    }
    if(keys["d"] && player.x<(canvas.width-player.width/2)){
        player.moveX(4);
    }
    if(keys["w"]&& player.y>player.height/2){
        player.moveY(-4);
    }
    if(keys["s"] && player.y<(canvas.height-player.height/2)){
        player.moveY(4);
    }
    enemyList.forEach(e=>{
        e.Follow();
    })
}
addEventListener('keydown',(e)=>{
    keys[e.key]=true;
    if(e.code=="ArrowUp"){
        player.Shoot(1);
    }
    if(e.code=="ArrowDown"){
        player.Shoot(2);
    }
    if(e.code=="ArrowLeft"){
        player.Shoot(3);
    }
    if(e.code=="ArrowRight"){
        player.Shoot(4);
    }
})
addEventListener('keyup', (e)=>{
    keys[e.key]=false;
})

StartButton.addEventListener('click', ()=>{
    entityList.forEach(e=>{
        e.x=e.originalX;
        e.y=e.originalY;
        e.hp=e.originalhp;
        e.alive=true;
    });
    timer.style.display='block';
    StartButton.style.display='none';
    killcount.innerHTML=0;
    let i=3;
    timer.innerHTML=i;
    GameOver.style.display='none';
    const interval=setInterval(()=>{
        i--;
        if(i<1){
            timer.style.display='none';
            clearInterval(interval);
            timer.innerHTML='';
            update();
            MovementInterval = setInterval(Movement,3);
        }
        timer.innerHTML=i;
    },1000)
})
