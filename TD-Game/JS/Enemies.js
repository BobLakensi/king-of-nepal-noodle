var enemyStuff = {
    home: null,
    moveToPoint: null,
    endPoint: null
};

enemyStuff.allEnemyArray = [];


//Enemy superclass thingy
EnemyPrototype = function (x, y, data) {
    this.inheritEntity = function (thiz, constructer) {
        thiz.constructor = constructer;
        thiz.constructor(x, y, data, data.src);
    };
    this.inheritEntity(this, Entity)
    
    this.sprite.target = enemyStuff.moveToPoint;
    this.sprite.civilian = null;
    
    //create sprite
    this.init = function () {

        
        //functions attached to enemySprite
        this.sprite.hit = this.hit;    
        this.sprite.moveToTarget = this.moveToTarget;
        this.sprite.moveToEnd = this.moveToEnd;
        this.sprite.endReached = this.endReached;
        this.sprite.destinationReached = this.destinationReached;
        this.sprite.killed = this.killed;
        
        this.addToArray().sprite.moveToTarget();
        
        return this;
    };
    
    //add to specific arrays
    this.addToArray = function () {
        enemyStuff.allEnemyArray.push(this.sprite);
        return this;
    };
    
    //move to target
    //this == sprite
    this.moveToTarget = function () {
        this.rotation = game.physics.arcade.angleBetween(this, this.target);
        game.physics.arcade.moveToObject(this, this.target, this.data.moveSpeed);
    };
    
    //enemy hit
    //stateless function, dont use "this"
    this.hit = function (bulletSpritec, enemySprite) {
        //decrease enemy health, kill and remove bullet, add to tower's hit score
        if (enemySprite.data.health === 0) {
            enemySprite.killed(enemySprite);
        } else {
            enemySprite.data.health--;
            bulletSpritec.towerSprite.hit++;
        }   //else enemySprite health
            
        //if bullet can still pass enemies, dont kill it
        if (bulletSpritec.pierce === 0) {
            helper.removeFromArray(bulletSpritec.towerSprite.bulletArray, null, null, bulletSpritec);
        } else {
            bulletSpritec.pierce--;
        }
    };   
    
    this.killed = function (enemySprite) {
        if (enemySprite.civilian != null) {
            enemySprite.civilian.sprite.isPickedUp = false;
            enemySprite.civilian.sprite.dropped();
        }
        
        data.money+= enemySprite.data.rewardMoney;
        UI.updateUI();
        
        helper.removeFromArray(enemyStuff.allEnemyArray, null, null, enemySprite);
    };
    
    //enemy reaches destination: home or civilian
    //stateless function
    this.destinationReached = function (enemySprite, point) {            
        //if point is a civilian
        if (point != enemyStuff.home) {
            helper.removeFromArray(allCivilianArr, null, null, point);
        }
        
        //create new civilian if point is home
        if (point === enemyStuff.home) {
            enemySprite.civilian = new Civilan().init(game, enemySprite.x, enemySprite.y);
            enemySprite.civilian.isPickedUp = true;
        }
        
        //change target
        enemySprite.end = enemyStuff.moveToPoint2;
        enemySprite.target = enemyStuff.endPoint;
        enemySprite.moveToTarget();
    };
    
    //enemy reaches end
    //intended to be used as a stateless function, don't use "this"
    this.endReached = function (enemySprite, end){
        //decrement health
        if (data.health > 0) {
            data.health --;
            UI.updateUI();
        }
        
        enemySprite.civilian.sprite.dropped(true);
        helper.removeFromArray(enemyStuff.allEnemyArray, null, null, enemySprite);

    };
    
};

enemyStuff.enemyFactory = function () {
    var num = Math.random();
    var currentEnemyData = enemyData.data[data.currentPeriod];
    
    if (num < 0.5) {
		return new window[currentEnemyData[0].class]((game.width/3), 10, currentEnemyData[0]).init().addToArray().sprite.moveToTarget();
//        new enemyStuff.EnemyBasic().init(game, (game.width/3), 10);
    } else {
		return new window[currentEnemyData[0].class](((game.width/3)*2), 10, currentEnemyData[0]).init().addToArray().sprite.moveToTarget();
//        new enemyStuff.EnemyBasic().init(game, ((game.width/3)*2), 10);
    }
};

enemyStuff.changeTarget = function (target) {
    for (var enemy = 0; enemy < enemyStuff.allEnemyArray.length; enemy ++) {
        enemyStuff.moveToPoint = target;
        enemyStuff.allEnemyArray[enemy].target = enemyStuff.moveToPoint;
    }  
};
