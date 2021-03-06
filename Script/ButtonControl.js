var Global = require('GlobalData');   

cc.Class({
    extends: cc.Component,

    properties: {
        jungleWorld: cc.AudioSource,
        musicWorld: cc.AudioSource
    },

    netModeSelect_single: function(){
        cc.director.loadScene("GameModeSelect.fire");
        var scene = cc.director.getScene();
        Global.netMode = 0;
    },
   
    netModeSelect_multiple: function(){
        cc.director.loadScene("GameModeSelect.fire");
        var scene = cc.director.getScene();
        Global.netMode = 1;
    },
//******************************************************************** 
    gameModeSelect_return: function(){
        cc.audioEngine.stopAll();

        cc.director.loadScene("NetModeSelect.fire")
    },

    gameModeSelect_professional: function(){
        cc.audioEngine.stopAll();

        cc.director.loadScene("MainGame.fire");
        Global.gameMode = Global.MAINMODE;
    },

    gameModeSelect_training1: function(){
        cc.audioEngine.stopAll();
        cc.director.loadScene("AccuracyGame.fire");
        Global.gameMode = Global.ACCURACYMODE;
    },

    gameModeSelect_training2: function(){
        cc.audioEngine.stopAll();
        cc.director.loadScene("QuickSwap.fire");
        Global.gameMode = Global.QUICKMODE;
    },

    gameModeSelect_reactionTest: function(){
        cc.audioEngine.stopAll();
        cc.director.loadScene("ReactionTest.fire");
        Global.gameMode = Global.TESTMODE;
    },

    gameModeSelect_adventure: function(){
        cc.audioEngine.stopAll();
        cc.director.loadScene("MainGame.fire");
        Global.gameMode = ADVENTUREMODE;
    },
//***********************************************************************
    mainGame_return: function(){
        cc.audioEngine.stopAll();
        cc.director.loadScene("GameModeSelect.fire");
        cc._canvas.style.cursor = 'auto';//恢复指针样式
    },

    mainGame_reset: function(){
        cc.audioEngine.stopAll();
        cc.director.loadScene("MainGame.fire");
    },
//***********************************************************************
    accuracyGame_return: function(){
        cc.audioEngine.stopAll();
        cc.director.loadScene("GameModeSelect.fire");
        cc._canvas.style.cursor = 'auto';//恢复指针样式
    },
    
    accuracyGame_reset: function(){
        cc.audioEngine.stopAll();
        cc.director.loadScene("AccuracyGame.fire");
    },
//***********************************************************************
    quickSwapGame_return: function(){
        cc.audioEngine.stopAll();
        cc.director.loadScene("GameModeSelect.fire");
        cc._canvas.style.cursor = 'auto';//恢复指针样式
    },

    quickSwapGame_reset: function(){
        cc.audioEngine.stopAll();
        cc.director.loadScene("QuickSwap.fire");
    },
//***********************************************************************
    testGame_return: function(){
        cc.audioEngine.stopAll();

        cc.director.loadScene("GameModeSelect.fire");
        cc._canvas.style.cursor = 'auto';//恢复指针样式
    },
});
