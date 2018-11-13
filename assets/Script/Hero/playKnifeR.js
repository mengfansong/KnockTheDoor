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
        
        speed:100
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        console.log("生成了新飞镖");
        console.log(this.node.position);
    },

    start () {

    },

    onCollisionEnter: function (other, self) {
        this.node.destroy();
        console.log("飞镖销毁了");
    },

    update (dt) {       
        
            this.node.x += this.speed*dt;
        
        // console.log(this.node.position);
    },
});
