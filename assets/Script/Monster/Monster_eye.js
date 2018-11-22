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
        lifes:2,
        _timer:0,
        timerStart:false,
        gravity: -1000,  //重力
        speed:cc.v2(0,0),
        maxSpeed:cc.v2(2000,2000),
        yStay:false,

        coinPrefab:{
            default:null,
            type:cc.Prefab,
        },

        root:cc.Node,
    },

    onCollisionEnter: function (other, self) {
        if (other.node.group === 'hero') {    
            //self是怪物，other是英雄
            var otherAabb = other.world.aabb;
            var otherPreAabb = other.world.preAabb.clone();
            var selfAabb = self.world.aabb;
            var selfPreAabb = self.world.preAabb.clone();           
            selfPreAabb.x = selfAabb.x;
            otherPreAabb.x = otherAabb.x;
            selfPreAabb.y = selfAabb.y;
            otherPreAabb.y = otherAabb.y;

            // if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {  //相交
            //     if (this.speed.x < 0 && (selfPreAabb.xMax > otherPreAabb.xMax)) {
            //         this.node.x +=2;   //向右反弹
            //         this.collisionX = -1;  //人在碰撞物右边
            //     }
            //     else if (this.speed.x > 0 && (selfPreAabb.xMin < otherPreAabb.xMin)) {
            //         //this.node.x = otherPreAabb.xMin - selfPreAabb.width - this.node.parent.x;
            //         // this.node.x = otherPreAabb.xMin - selfPreAabb.width - this.node.parent.x;
            //         this.node.x -=2;   //向左反弹
            //         this.collisionX = 1; //人在碰撞物左边
            //     }

            //     this.speed.x = 0;
            //     other.touchingX = true;
            //     return;
            // }
            if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {  //相交
                if (selfPreAabb.xMax > otherPreAabb.xMax) {
                    this.node.x += 15;   //向右反弹
                    other.node.x -= 15; 
                    this.collisionX = -1;  //人在碰撞物右边
                }
                else if (selfPreAabb.xMin < otherPreAabb.xMin) {
                    //this.node.x = otherPreAabb.xMin - selfPreAabb.width - this.node.parent.x;
                    // this.node.x = otherPreAabb.xMin - selfPreAabb.width - this.node.parent.x;
                    this.node.x -= 15;   //向左反弹
                    other.node.x += 15;
                    this.collisionX = 1; //人在碰撞物左边
                }                
            }

        }
        if (other.node.group === 'knife') {
            this.lifes -= 1;
            if(this.lifes < 1) {
                    this.node.destroy();
                    //掉落奖励待实现
                    this.wasKilled();
                    
            }
        }   

        if (other.node.group === 'Platform') {    
            this.speed.y = 0;
            this.yStay = true;
        }

        if (other.node.group === 'Platform') {    
            //self是怪物，other是平台
            var otherAabb = other.world.aabb;
            var otherPreAabb = other.world.preAabb.clone();
            var selfAabb = self.world.aabb;
            var selfPreAabb = self.world.preAabb.clone();           
            selfPreAabb.x = selfAabb.x;
            otherPreAabb.x = otherAabb.x;
            selfPreAabb.y = selfAabb.y;
            otherPreAabb.y = otherAabb.y;
           

            if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
                if (this.speed.y < 0 && (selfPreAabb.yMax > otherPreAabb.yMax)) {
                    this.node.y = otherPreAabb.yMax - this.node.parent.y;                   
                } else if (this.speed.y > 0 && (selfPreAabb.yMin < otherPreAabb.yMin)) {
                    this.node.y = otherPreAabb.yMin - selfPreAabb.height - this.node.parent.y-2;   
                }                                       
            }         
            
            this.speed.y = 0;
            this.yStay = true;
                              
            

        }
           
    },


    onCollisionStay: function (other, self) {
        if (other.node.group === 'hero') {
            // 如果速度太快，嵌入墙体，会弹出来
            if(this.collisionX === -1) {
                other.node.x -= 15;
            } 
            if(this.collisionX === 1) {
                other.node.x += 15;
            }
        }

        if(other.node.group === "Platform") {
            var otherAabb = other.world.aabb;
            var otherPreAabb = other.world.preAabb.clone();
            var selfAabb = self.world.aabb;
            var selfPreAabb = self.world.preAabb.clone();           
            selfPreAabb.x = selfAabb.x;
            otherPreAabb.x = otherAabb.x;
            selfPreAabb.y = selfAabb.y;
            otherPreAabb.y = otherAabb.y;
            this.node.y = otherPreAabb.yMax - this.node.parent.y;
            var motion = other.node.getComponent('PlatformMotion');
                if (motion) {
                    this.node.x += motion._movedDiff;
                }
        }

    
    },

    onCollisionExit: function (other) {
        if (other.node.group === 'hero') {
            if(this._timer>0.5) {
                var hero = other.node.getComponent('HeroControl');
                hero._lifes -= 1;
                this.timerStart = true;
                this._timer = 0;
            }
            
        }
        if (other.node.group === 'Platform') {    
            
            this.yStay = false;
        }
    },

    wasKilled:function() {
        
        var coin = cc.instantiate(this.coinPrefab);        
        coin.x = this.node.x;
        coin.y = this.node.y+this.node.height/4; 
                 
        this.root.addChild(coin);
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._timer = 1;
        this.speed.y = 0;
        
    },

    start () {

    },

    update (dt) {
        if(this.timerStart) {
            this._timer += dt;
        } 
        
        if(this.yStay == false) {
            if(this.speed.y >= -this.maxSpeed.y){
                this.speed.y += this.gravity*dt;
            } else {
                this.speed.y = -this.maxSpeed.y;
            }
    
            
            this.node.y += this.speed.y * dt;
        }
        
       

     
    },
});
