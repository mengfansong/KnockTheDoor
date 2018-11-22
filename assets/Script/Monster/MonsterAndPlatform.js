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
        speed: cc.v2(0, 0),
        maxSpeed: cc.v2(2000, 2000),
        gravity: -1000,  //重力
        drag: 1000,
        direction: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // 碰撞时
    onCollisionEnter: function (other, self) {
        if (other.node.group === 'Platform') {
            // this.node.color = cc.Color.RED;  //碰撞开始，变红
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
