// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {        
        myDirection: 0,  //0,1,2,3  stayl,stayr, left,right         
        // speed:0,
        knifeSkill:{
            default:null,
            type:cc.Node,
        },
        knifePrefabL:{
          default:null,
          type:cc.Prefab  
        },
        knifePrefabR:{
            default:null,
            type:cc.Prefab  
          },
        root:cc.Node,
        speed: cc.v2(0, 0),
        maxSpeed: cc.v2(2000, 2000),
        gravity: -1000,  //重力
        drag: 1000,
        direction: 0,
        jumpSpeed: 300,
        _ammo:0,  //飞刀数量
        ammoCount: {
            default:null,
            type:cc.Label
        },
        _lifes:3, //生命值
        lifesShow:{  //生命值的显示。
            default:null,
            type:cc.Label,
        },
        money:0, //金钱
        moneyShow:{ //金钱显示
            default:null, 
            type:cc.Label,
        },
    },


    // 向左投掷飞镖
    playKnifeLeft:function() {       
        var knife = cc.instantiate(this.knifePrefabL);        
        knife.x = this.node.x-30;
        knife.y = this.node.y+this.node.height/4; 
             
        this.root.addChild(knife);
    },

    // 向右投掷飞镖
    playKnifeRight:function() {        
        var knife = cc.instantiate(this.knifePrefabR);        
        knife.x = this.node.x+30;
        knife.y = this.node.y+this.node.height/4;        
        this.root.addChild(knife);
    },
    
    // use this for initialization
    onLoad: function () {     


        // add key down and key up event
        
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.anim = this.getComponent(cc.Animation);
              
       
        this.collisionY = 0;

        // 上一个位置
        this.prePosition = cc.v2();
        this.preStep = cc.v2();

        // 接触数量？
        this.touchingNumber = 0;

        this.ammoCount.string = this._ammo;  
        this.moneyShow.string = this.money;
       
    }, 

    

    onDestroy () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onKeyDown: function (event) {
        
        switch(event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                if(this.myDirection != 2) {
                    this.anim.play("h walk left");
                    // this.movespeed = -1*this.speed;
                }                
                this.myDirection = 2;
                this.direction = -1;  //左
                break; 
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                if(this.myDirection != 3) {
                    this.anim.play("h walk right");
                    // this.movespeed = this.speed;
                } 
                this.myDirection = 3;      
                this.direction = 1;  //右          
                break;
            case cc.macro.KEY.w:
            case cc.macro.KEY.up:
                    if (!this.jumping) {
                        this.jumping = true;
                        this.speed.y = this.jumpSpeed;    
                    }
                break;
            case cc.macro.KEY.j:
                if(this.myDirection == 0 || this.myDirection == 2) {                    
                    if(this.knifeSkill.active == true && this._ammo > 0) {
                        this.anim.play("h attack left");
                        this.playKnifeLeft();
                        this._ammo--;  
                        this.ammoCount.string = this._ammo;                      
                    }                    
                } 
                if(this.myDirection == 1 || this.myDirection == 3) {                       
                    if(this.knifeSkill.active == true && this._ammo > 0) {
                        this.anim.play("h attack right");
                        this.playKnifeRight();                
                        this._ammo--;    
                        this.ammoCount.string = this._ammo;    
                    }                 
                }                               
                break;                    
            
        }
    },

    

    onKeyUp: function (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                console.log('release a key');
                this.myDirection=0;
                this.anim.play("h stay left");
                this.direction = 0;   //这一块留意
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                console.log('release a key');       
                this.myDirection=1;
                this.anim.play("h stay right");
                this.direction = 0;   //这一块留意         
                break;           
        }
    },

    // 碰撞时
    onCollisionEnter: function (other, self) {
        //与平台
        if (other.node.group === 'Platform') {

            this.touchingNumber ++;  //留意
        
            // 1st step 
            // get pre aabb, go back before collision
            var otherAabb = other.world.aabb;
            var otherPreAabb = other.world.preAabb.clone();

            var selfAabb = self.world.aabb;
            var selfPreAabb = self.world.preAabb.clone();

            // 2nd step
            // forward x-axis, check whether collision on x-axis
            selfPreAabb.x = selfAabb.x;
            otherPreAabb.x = otherAabb.x;

            if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {  //相交
                if (this.speed.x < 0 && (selfPreAabb.xMax > otherPreAabb.xMax)) {
                    // this.node.x = otherPreAabb.xMax - 2*this.node.parent.x; //反弹部分
                    // this.node.x = otherPreAabb.xMax-this.node.parent.x;
                    this.node.x +=2;   //向右反弹
                    this.collisionX = -1;  //人在碰撞物右边
                }
                else if (this.speed.x > 0 && (selfPreAabb.xMin < otherPreAabb.xMin)) {
                    //this.node.x = otherPreAabb.xMin - selfPreAabb.width - this.node.parent.x;
                    // this.node.x = otherPreAabb.xMin - selfPreAabb.width - this.node.parent.x;
                    this.node.x -=2;   //向左反弹
                    this.collisionX = 1; //人在碰撞物左边
                }

                this.speed.x = 0;
                other.touchingX = true;
                return;
            }

            // 3rd step
            // forward y-axis, check whether collision on y-axis
            selfPreAabb.y = selfAabb.y;
            otherPreAabb.y = otherAabb.y;

            if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
                if (this.speed.y < 0 && (selfPreAabb.yMax > otherPreAabb.yMax)) {
                    this.node.y = otherPreAabb.yMax - this.node.parent.y;
                    this.jumping = false;
                    this.collisionY = -1;   //人在碰撞物上边
                }
                else if (this.speed.y > 0 && (selfPreAabb.yMin < otherPreAabb.yMin)) {
                    this.node.y = otherPreAabb.yMin - selfPreAabb.height - this.node.parent.y-2;          
            
                    this.collisionY = 1;   //人在下边
                }
            
                this.speed.y = 0;
                other.touchingY = true;
            }         
        }

        

        // 被怪物碰到
        if (other.node.group === 'monster') {
            this.lifesShow.string = this._lifes;
        }
    },
    
    onCollisionStay: function (other, self) {
        if (this.collisionY === -1) {
            if (other.node.group === 'Platform') {
                var motion = other.node.getComponent('PlatformMotion');
                if (motion) {
                    this.node.x += motion._movedDiff;
                }
            }
        
        // 如果速度太快，嵌入墙体，会弹出来
        if(this.collisionX === -1) {
            this.node.x += 2;
        } 
        if(this.collisionX === 1) {
            this.node.x -= 2;
        }

            // this.node.y = other.world.aabb.yMax;

            // var offset = cc.v2(other.world.aabb.x - other.world.preAabb.x, 0);
            
            // var temp = cc.affineTransformClone(self.world.transform);
            // temp.tx = temp.ty = 0;
            
            // offset = cc.pointApplyAffineTransform(offset, temp);
            // this.node.x += offset.x;
        }
    },
    
    onCollisionExit: function (other) {
        this.touchingNumber --;  //离开就会减碰撞数，吃道具也会减。
        if (this.touchingNumber === 0) {
            // this.node.color = cc.Color.WHITE;
        }

        if (other.touchingX) {
            this.collisionX = 0;
            other.touchingX = false;
        }
        else if (other.touchingY) {
            other.touchingY = false;
            this.collisionY = 0;
            this.jumping = true;
        }

        //捡到道具
        if (other.node.group === 'item') {
            
           
            //飞刀数量**********************
          
            this.ammoCount.string = this._ammo;  
            this.moneyShow.string = this.money;
            // this.knifeSkill.active =true;
            // other.node.destroy();       
        }
    },
    
    update: function (dt) {
        if (this.collisionY === 0) {
            this.speed.y += this.gravity * dt;
            if (Math.abs(this.speed.y) > this.maxSpeed.y) {
                this.speed.y = this.speed.y > 0 ? this.maxSpeed.y : -this.maxSpeed.y;
            }
        }

        if (this.direction === 0) {
            if (this.speed.x > 0) {
                this.speed.x -= this.drag * dt;
                if (this.speed.x <= 0) this.speed.x = 0;
            }
            else if (this.speed.x < 0) {
                this.speed.x += this.drag * dt;
                if (this.speed.x >= 0) this.speed.x = 0;
            }
        }
        else {
            this.speed.x += (this.direction > 0 ? 1 : -1) * this.drag * dt;
            if (Math.abs(this.speed.x) > this.maxSpeed.x) {
                this.speed.x = this.speed.x > 0 ? this.maxSpeed.x : -this.maxSpeed.x;
            }
        }

        if (this.speed.x * this.collisionX > 0) {
            this.speed.x = 0;
        }
        
        this.prePosition.x = this.node.x;
        this.prePosition.y = this.node.y;

        this.preStep.x = this.speed.x * dt;
        this.preStep.y = this.speed.y * dt;
        
        this.node.x += this.speed.x * dt;
        this.node.y += this.speed.y * dt;
    },  
        
   


});


///////////////////////////////////////////////////////////




   
    
 
    
