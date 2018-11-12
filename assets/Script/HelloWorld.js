var mvs = require('matchvs.all')
cc.Class({
    extends: cc.Component,

    properties: {
        login:{
            default:null,
            type:cc.Button
        },
        info:{
            default:null,
            type:cc.Label
        },
        engine:null,
        rsp:null,
        gameID:202473,
    },

    onLoad () {
        this.login.node.on('click',this.MatchvsInit,this);
        this.engine = new mvs.MatchvsEngine();
        this.rsp = new  mvs.MatchvsResponse();
        this.rsp.initResponse = this.initResponse.bind(this);
        this.rsp.registerUserResponse = this.registerUserResponse.bind(this);
        this.rsp.loginResponse = this.loginResponse.bind(this);
    },

    MatchvsInit() {
        this.engine.init(this.rsp,'Matchvs','release',this.gameID);
    },

    initResponse :function (status) {
        if (status === 200) {
            this.labelLog('初始化成功，开始注册');
            this.engine.registerUser();
        } else {
            this.labelLog('初始化失败，错误码：'+status);
        }
    },

    registerUserResponse:function(userInfo) {
        if (userInfo.status ===0) {
            this.labelLog('注册成功，开始登录，登录ID是：'+userInfo.id+'token是'+userInfo.token);
            this.Login(userInfo.id,userInfo.token);
        } else {
            this.labelLog('注册失败错误状态码为：'+userInfo.status);
        }
    },
    Login(userID,token) {
        var appkey = 'deb0664934fd42e394f1db978b9dd8a3#M';
        var secret = '60ae709f5d1248688bc30381cb45fcf3';
        var DeviceID = 'abcdef';
        var gatewayID = 0;
        var gameVersion = 1;
        this.engine.login(userID,token,this.gameID,gameVersion,
            appkey,secret,DeviceID,gatewayID)
    },

    loginResponse:function (loginRsp) {
        if (loginRsp.status === 200) {
            this.labelLog('恭喜你登录成功，来到Matchvs的世界，你已经成功的迈出了第一步，Hello World');
        } else {
            this.labelLog('登录失败');
        }
    },

    /**
     * 页面log打印
     * @param info
     */
    labelLog: function (info) {
        this.info.string += '\n[LOG]: ' + info;
    },

});