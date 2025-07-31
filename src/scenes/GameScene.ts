import Phaser from "phaser";
import Player from "@/objects/Player";
import Bullet from "@/objects/Bullet";
import Enemy from "@/objects/Enemy";
import PowerUp from "@/objects/PowerUp";

export default class GameScene extends Phaser.Scene {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  player!: Player;
  bullets!: Phaser.Physics.Arcade.Group;
  enemies!: Phaser.Physics.Arcade.Group;
  powerUps!: Phaser.Physics.Arcade.Group;
  particles!: Phaser.GameObjects.Particles.ParticleEmitter;
  lastEnemy=0; lastPower=0;
  score=0; health=3;
  scoreText!: Phaser.GameObjects.Text; healthText!: Phaser.GameObjects.Text; buffText!: Phaser.GameObjects.Text;
  isGameOver=false; triple=false;

  constructor(){ super("Game"); }

  init(){ this.lastEnemy=0; this.lastPower=0; this.score=0; this.health=3; this.isGameOver=false; this.triple=false; }

  create(){
    this.scale.scaleMode=Phaser.Scale.ScaleModes.RESIZE; this.scale.refresh();
    const cx=this.scale.width/2, cy=this.scale.height/2;

    this.cursors=this.input.keyboard!.createCursorKeys();
    this.player=new Player(this,cx,cy);

    this.bullets=this.physics.add.group({classType:Bullet,runChildUpdate:true,maxSize:100});
    this.enemies=this.physics.add.group({classType:Enemy});
    this.powerUps=this.physics.add.group({classType:PowerUp,runChildUpdate:true});

    this.particles=this.add.particles(0,0,"particle",{speed:{min:50,max:150},angle:{min:0,max:360},lifespan:300,scale:{start:1,end:0},blendMode:"ADD",quantity:0});

    this.scoreText=this.add.text(10,10,"Score: 0",{fontSize:"18px",color:"#fff"}).setDepth(10);
    this.healthText=this.add.text(this.scale.width-150,10,`Health: ${this.health}`,{fontSize:"18px",color:"#f55"}).setDepth(10);
    this.buffText=this.add.text(cx,40,"",{fontSize:"20px",color:"#35ff74"}).setOrigin(0.5).setDepth(10);

    this.input.on("pointerdown",()=>this.shoot());

    this.physics.add.overlap(this.bullets,this.enemies,(b,e)=>this.hitEnemy(b as Bullet,e as Enemy));
    this.physics.add.overlap(this.player,this.enemies,(_p,e)=>this.damagePlayer(e as Enemy));
    this.physics.add.overlap(this.player,this.powerUps,(_p,p)=>this.collectPowerUp(p as PowerUp));
  }

  update(_t:number,dt:number){ if(this.isGameOver) return;
    this.player.update(this.cursors,this.input.activePointer);
    this.lastEnemy+=dt; if(this.lastEnemy>1000){ this.spawnEnemy(); this.lastEnemy=0; }
    this.lastPower+=dt; if(this.lastPower>10000){ this.spawnPowerUp(); this.lastPower=0; }
    this.enemies.children.iterate(o=>{(o as Enemy).pursue(this.player); return true;});
  }

  shoot(){
    if(this.triple){
      [-0.25,0,0.25].forEach(offset=>{
        const b=this.bullets.get() as Bullet; if(!b) return;
        const base=Phaser.Math.Angle.Between(this.player.x,this.player.y,this.input.activePointer.worldX,this.input.activePointer.worldY);
        b.fire(this.player.x,this.player.y,base+offset);
      });
    }else{
      const b=this.bullets.get() as Bullet; if(!b) return;
      const a=Phaser.Math.Angle.Between(this.player.x,this.player.y,this.input.activePointer.worldX,this.input.activePointer.worldY);
      b.fire(this.player.x,this.player.y,a);
    }
  }

  spawnEnemy(){
    const m=40,w=this.scale.width,h=this.scale.height;
    const p=[{x:Phaser.Math.Between(0,w),y:-m},{x:w+m,y:Phaser.Math.Between(0,h)},{x:Phaser.Math.Between(0,w),y:h+m},{x:-m,y:Phaser.Math.Between(0,h)}][Phaser.Math.Between(0,3)];
    this.enemies.add(new Enemy(this,p.x,p.y));
  }

  spawnPowerUp(){
    const x=Phaser.Math.Between(50,this.scale.width-50);
    const y=Phaser.Math.Between(50,this.scale.height-50);
    this.powerUps.add(new PowerUp(this,x,y));
  }

  collectPowerUp(power:PowerUp){ power.destroy(); this.activateTripleShot(); }

  activateTripleShot(){ this.triple=true; this.buffText.setText("TRIPLE SHOT!");
    this.time.delayedCall(8000,()=>{ this.triple=false; this.buffText.setText(""); });
  }

  damagePlayer(enemy:Enemy){ if(this.isGameOver) return; enemy.destroy(); this.health--; this.healthText.setText(`Health: ${this.health}`); if(this.health<=0){ this.gameOver(); }}

  hitEnemy(bullet:Bullet,enemy:Enemy){ bullet.setActive(false).setVisible(false); this.particles.explode(8,enemy.x,enemy.y); enemy.destroy(); this.score+=10; this.scoreText.setText(`Score: ${this.score}`); }

  gameOver(){ this.isGameOver=true; this.player.setActive(false).setVisible(false); this.buffText.setText(""); this.time.delayedCall(500,()=>{ this.scene.start("GameOver",{score:this.score}); }); }
}
