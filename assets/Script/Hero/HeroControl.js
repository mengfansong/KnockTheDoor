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
        direction: 0,  //0,1,2,3  stayl,stayr, left,right         
        speed:0,
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
    },


    // 向左投掷飞镖
    playKnifeLeft:function() {       
        var knife = cc.instantiate(this.knifePrefabL);        
        knife.x = this.node.x-64;
        knife.y = this.node.y+64;        
        this.root.addChild(knife);
    },

    // 向右投掷飞镖
    playKnifeRight:function() {        
        var knife = cc.instantiate(this.knifePrefabR);        
        knife.x = this.node.x+64;
        knife.y = this.node.y+64;        
        this.root.addChild(knife);
    },
    
    // use this for initialization
    onLoad: function () {     


        // add key down and key up event
        
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.anim = this.getComponent(cc.Animation);
        
       
    }, 

    

    onDestroy () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onKeyDown: function (event) {
        
        switch(event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                if(this.direction != 2) {
                    this.anim.play("h walk left");
                    this.movespeed = -1*this.speed;
                }                
                this.direction = 2;
                break; 
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                if(this.direction != 3) {
                    this.anim.play("h walk right");
                    this.movespeed = this.speed;
                } 
                this.direction = 3;                
                break;
            case cc.macro.KEY.j:
                if(this.direction == 0 || this.direction == 2) {                    
                    if(this.knifeSkill.active == true) {
                        this.anim.play("h attack left");
                        this.playKnifeLeft();                        
                    }                    
                } 
                if(this.direction == 1 || this.direction == 3) {                       
                    if(this.knifeSkill.active == true) {
                        this.anim.play("h attack right");
                        this.playKnifeRight();                       
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
                this.direction=0;
                this.anim.play("h stay left");
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                console.log('release a key');       
                this.direction=1;
                this.anim.play("h stay right");         
                break;           
        }
    },

    update:function(dt) {
        if(this.direction > 1 ){
            this.node.x += this.movespeed*dt;
        }
             
        
   }


});
