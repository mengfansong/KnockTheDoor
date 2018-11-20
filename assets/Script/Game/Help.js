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
        help: {
            default:null,
            type:cc.Node
        },
        helpIsShowing:false
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    showHelp:function() {
        if(this.helpIsShowing) {
            this.help.y = -2000;
            this.helpIsShowing = false;
        } else {
            
            this.help.x = 0;
            this.help.y = 0;
            this.helpIsShowing = true;
        }
        console.log(this.help.position);
        
    },

    start () {
        console.log(this.help.position);
    },

    // update (dt) {},
});
