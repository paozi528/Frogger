//画布宽度
var GLOBAL_CANVAS_WIDTH = 505;
//玩家初始位置X
var GLOBAL_PLAYER_INIT_X = 202;
//玩家初始位置Y
var GLOBAL_PLAYER_INIT_Y = 390;
//第一排道路
var GLOBAL_FIRST_WAY  = 58;
//第二排道路
var GLOBAL_SECOND_WAY = 141;
//第三排道路
var GLOBAL_THREE_WAY = 224;
//设定速度区间
var GLOBAL_SPEEDS = [4,1,5,3,2,3,2,3,2,3];
var GLOBAL_ALL_WAYS = [GLOBAL_FIRST_WAY,GLOBAL_SECOND_WAY,GLOBAL_THREE_WAY];
//准备时间配置
var GLOBAL_TIMES = 3;
//敌人数量配置
var GLOBAL_ENEMY_COUNT = 5;

// 这是我们的玩家要躲避的敌人
var Enemy = function(x,y) {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多
    this.x = x;
    this.y = y;
    //速度默认400
    this.speed = 400;
    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    this.x+= this.speed * dt;
    //如果超出界面
    if(this.x>GLOBAL_CANVAS_WIDTH){
        //重新爬出
        this.x=-101;
        //重新出现更新速度值
        this.speed= randomNum()*100;
        var randomY = Math.random()*300;//0-300随机值
        if(randomY<=100){
            this.y=GLOBAL_FIRST_WAY;
        }else if(randomY>100&&randomY<200){
            this.y=GLOBAL_SECOND_WAY;
        }else if(randomY>=200){
            this.y=GLOBAL_THREE_WAY;
        }
    }
    this.checkCollision();
};
//碰撞检测
Enemy.prototype.checkCollision = function(){
    if(player.y===this.y&&player.x>this.x&&player.x<this.x+70){
        player.x = GLOBAL_PLAYER_INIT_X;
        player.y = GLOBAL_PLAYER_INIT_Y;
    }
}

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var Player = function (x,y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png';

}

Player.prototype = {
    constructor:Player.prototype.constructor,
    //初始位置
    initPosition:function () {
        this.x = GLOBAL_PLAYER_INIT_X;
        this.y = GLOBAL_PLAYER_INIT_Y;
    },
    //开始游戏
    startGame:function () {
        var startGame = setInterval(function () {
            $("#start").show().text(GLOBAL_TIMES);
            GLOBAL_TIMES--;
            if(GLOBAL_TIMES===-1){
                $("#start").hide();
                player.initPosition();
                clearInterval(startGame);
                //恢复默认3
                GLOBAL_TIMES = 3;
            }
        },1000)
    },
    //移除位置
    removePosition:function () {
        this.x = undefined;
        this.y = undefined;
    },
    //更新位置
    update:function () {
        if(this.y<0){
            $("#info").slideDown(1000);
            $("#message").text('恭喜过关');
            this.removePosition();
        }
    },
    //渲染
    render:function () {
        ctx.drawImage(Resources.get(this.sprite),this.x,this.y);
    },
    //监听键盘移动事件
    handleInput:function (keyType) {
        switch (keyType){
            case "left":
                this.moveLeft();
                break;
            case "up":
                this.moveUp();
                break;
            case "right":
                this.moveRight();
                break;
            case "down":
                this.moveDown();
                break;
        }
    },
    //左移动
    moveLeft:function () {
        if(this.x>=101){
            this.x -= 101;
        }
    },
    //右移动
    moveRight:function () {
        if(this.x>303){
            return;
        }
        this.x += 101;
    },
    //上移动
    moveUp:function () {
        if(this.y<0){
            return
        }
        this.y-=83;
    },
    //下移动
    moveDown:function () {
        if(this.y>=380){
            return;
        }
        this.y += 83;
    }
}

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
var allEnemies = [];
//随机创建敌人
for(var i=0;i<GLOBAL_ENEMY_COUNT;i++){
    var x = Math.random()*GLOBAL_CANVAS_WIDTH;
    var y = GLOBAL_ALL_WAYS[Math.floor((Math.random()*GLOBAL_ALL_WAYS.length))];
    var enemy = new Enemy(x,y);
    allEnemies.push(enemy)
}

//创建玩家
var player = new Player();
player.startGame();

$("#btnGo").bind("click",function () {
    $("#info").slideUp(1000);
    player.startGame();
})


// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    if(player.x!=undefined&&player.y!=undefined) {
        player.handleInput(allowedKeys[e.keyCode]);
    }
});


//随机获取速度档位
function randomNum() {
    return GLOBAL_SPEEDS[Math.floor(Math.random()*GLOBAL_SPEEDS.length)];
}

