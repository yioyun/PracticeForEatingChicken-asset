var Global = require('GlobalData');   

cc.Class({
    extends: cc.Component,

    properties: {
        failedLable: {
            default: null,
            type: cc.Label,
        },
        crosschair: {
            default: null,
            type: cc.Sprite,
        },
        chickenPrefab: {
            default: null,
            type: cc.Prefab
        },
        bloodPrefab: {
            default: null,
            type: cc.Prefab
        },
        ak47: {
            default: null,
            url: cc.AudioClip,
        },
        blood: {
            default: null,
            type: cc.Sprite,
        },
        music: cc.AudioClip,
        interval: 2,
        crosschairSpeed: 20,
        beginGameTime: 3
    },

    onLoad() {
        this._time = 1-this.beginGameTime;//beginGameTime秒后游戏开始
        this._chicken = new Array();
        this._chickenNum = 0;
        this._gameOver = false;
        this._score = 0;

        cc.audioEngine.play(this.music,true,Global.musicVolume);

        this.onLoadTouchRelated();
        this.setTouchEvent();
    },

    onLoadTouchRelated: function(){
        this._crosschairDir = 0;
        this._crosschairDir2 = 0;
        this._isMovingCrossChair = false;
        this._lastMovingScaChangeTime = 0;
        this._movingSca = 0;
        this._lastMovingSca = 0;
        this.crosschair.node.setPosition(cc.p(0,0));
    },

    spawnChicken: function(id) {
        var newChicken = cc.instantiate(this.chickenPrefab);
        newChicken.getComponent('ChickenControl').parentControl = this;//为鸡设置父亲指针
        newChicken.getComponent('ChickenControl').idInParentArray = id;
        this.node.addChild(newChicken);
        newChicken.setPosition(this.getNewchickenPosition());
        newChicken.setLocalZOrder(9);
        return newChicken;
    },

    getNewchickenPosition: function(){
        return cc.p((Math.random()*0.5+0.25)*cc.winSize.width-cc.winSize.width/2,
            (Math.random()*0.5+0.25)*cc.winSize.height-cc.winSize.height/2);
    },

    update: function(dt){
        if(typeof this._gameOver == "boolean" && this._gameOver==false){
            this._time += dt;
            if(this._time>this.interval){//每隔一段时间产生两只鸡
                this._time = 0;
                this._chicken[this._chickenNum] = this.spawnChicken(this._chickenNum);
                this._chickenNum++;
                this._chicken[this._chickenNum] = this.spawnChicken(this._chickenNum);
                this._chickenNum++;
            }
        }else{
            if(typeof this._gameOver == "boolean"){
                this.failed();
            }
        }

        if (this.blood.node.opacity > 1) this.blood.node.opacity -= 1;//血量图透明度降低

        this.updateAbuoutCrossChair(dt);
    },

    updateAbuoutCrossChair: function(dt){
        if(this._lastMovingScaChangeTime>0.03){
            this._movingSca = 0;
            return;
        }

        if(!this._isMovingCrossChair) return;
    
        this.crosschair.node.x += this.crosschairSpeed*Math.cos(this._crosschairDir)*dt*this._movingSca*this._crosschairDir2;
        this.crosschair.node.y += this.crosschairSpeed*Math.sin(this._crosschairDir)*dt*this._movingSca;

        if(this.crosschair.node.x<-cc.winSize.width/2) this.crosschair.node.x = -cc.winSize.width/2;
        if(this.crosschair.node.x>cc.winSize.width/2) this.crosschair.node.x = cc.winSize.width/2;
        if(this.crosschair.node.y<-cc.winSize.height/2) this.crosschair.node.y = -cc.winSize.height/2;
        if(this.crosschair.node.y>cc.winSize.height/2) this.crosschair.node.x = cc.winSize.height/2;
        
        this._lastMovingSca = this._movingSca;

        this._lastMovingScaChangeTime += dt;
    },

    updateScore: function(){
        if(this._score<40)
            this.failedLable.getComponent(cc.Label).string = "分数: " + this._score;
        else{
            this.failedLable.getComponent(cc.Label).string = "真牛逼，分数: " + this._score;
        }
    },

    failed: function(){
        this.failedLable.node.setLocalZOrder(100);//避免结果被挡住

        for(i = 0;i<this._chickenNum;i++){//停止所有鸡
            if(this._chicken[i]){
                this._chicken[i].getComponent('ChickenControl').pauseAll();
            }
        }

        var rank = new Array(10,20,40,50);
        if(this._score<rank[0]){
            this.failedLable.getComponent(cc.Label).string = "你输了，你这个菜鸡！";
        }else if(this._score<rank[1]){
            this.failedLable.getComponent(cc.Label).string = "你输了，继续努力！";
        }else if(this._score<rank[2]){
            this.failedLable.getComponent(cc.Label).string = "虽败犹荣";
        }else if(this._score<rank[3]){
            this.failedLable.getComponent(cc.Label).string = "接近大神";
        }else{
            this.failedLable.getComponent(cc.Label).string = "不说了，收下我的膝盖！";
        }

        cc.audioEngine.stopAll();//关掉音乐
    },

    newChickenBlood: function(tarx,tary){
        var newBlood = cc.instantiate(this.bloodPrefab);
        this.node.addChild(newBlood);
        newBlood.setPosition(cc.p(tarx,tary));
        newBlood.setLocalZOrder(10);

        this.scheduleOnce(function() {
            newBlood.removeFromParent();
        },2);
    },

    setTouchEvent: function(){
        var sprite = this;
        var startPos = cc.p(0,0);

        sprite.node.on(cc.Node.EventType.TOUCH_START, function(e){  
            startPos = e.getLocation();
            this._isMovingCrossChair = true;
            return true;  
        }.bind(this), this);  

        sprite.node.on(cc.Node.EventType.TOUCH_MOVE, function(e){  
            var tempx = e.getLocation().x-cc.winSize.width/2;
            var tempy = e.getLocation().y-cc.winSize.height/2;

            var dist2 = this.getDist(e.getLocation(),e.getPreviousLocation());

            this._movingSca = dist2/5*Global.fireSpeedVolume;
            this._lastMovingScaChangeTime = 0;

            tempx = (e.getLocation().x-e.getPreviousLocation().x);
            tempy = (e.getLocation().y-e.getPreviousLocation().y);

            if(-0.00001<tempx && tempx <0.00001) tempx = 0.00001;
            if(-0.00001<tempy && tempy <0.00001) tempy = 0.00001;

            var tempz = Math.sqrt(tempx*tempx+tempy*tempy);
            if(-0.00001<tempz && tempz <0.00001){
                return;
            }else{
                this._crosschairDir = Math.asin(tempy/tempz);
                this._crosschairDir2 = tempx>0?1:-1;
            }
        }.bind(this), this ); 

        sprite.node.on(cc.Node.EventType.TOUCH_END, function(e){  
            this._isMovingCrossChair = false;
            this._movingSca = 0;
        }.bind(this), this );  

        sprite.node.on(cc.Node.EventType.TOUCH_CANCEL, function(e){  
            this._isMovingCrossChair = false;
            this._movingSca = 0;
        }.bind(this), this );  

        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // 有按键按下时，判断是否是我们指定的方向控制键，并设置向对应方向速度
            onKeyPressed: function(keyCode, event) {
                self.fireButtonPress();
            }}, 
        self.node);
    },
    getDist: function(pos1,pos2){
        return Math.sqrt((pos1.x-pos2.x)*(pos1.x-pos2.x)+
                        (pos1.y-pos2.y)*(pos1.y-pos2.y));
    },
    fireButtonPress: function(){  
        cc.audioEngine.play(this.ak47, false, Global.effectVolume);
        var shouldBlood = true;

        var pos = cc.p(this.crosschair.node.x,this.crosschair.node.y);
        for(var i = 0 ; i < this._chickenNum ;i++){
            if(!this._chicken[i]) continue;

            var dist = this.getDist(pos,cc.p(this._chicken[i].x,this._chicken[i].y));
            var radius = 500;//鸡资源图的半径
            if(dist>radius*this._chicken[i].scale) continue;//判断是否点中该鸡

            this._chicken[i].emit('fire',pos);
            shouldBlood = false;
        }

        if(!shouldBlood) return;

        this.blood.node.opacity = 100; //打中空地飘红血
        --this._score;//打中空地降一分  
        this.updateScore();   
    }
});
