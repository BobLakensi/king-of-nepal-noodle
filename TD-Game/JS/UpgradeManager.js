//when instantiated, this is reference to entity object, not sprite object instead of UpgradeManager itself
//towerSprite parameter circular refernce, make sure to make null when killed
var UpgradeManager = function (towerSprite, upgradeData) {
    //Entity being upgraded gets a new copy of the JSON object containing all of the data 
    this.data = Object.create(upgradeData);
    
    //when entity clicked, display upgrade information
    this.displayUpgradeInfo = function () {
        //draw upgrade menu
        //temporary code before disigning actual stuff   
        //will find a better way to do this
        this.path1BTN = game.add.button(100, 100, "buttonStartSS", function () {
              this.validateUpgradeEntity(1);
        }, this, 2, 1, 0  );        
        
        this.path2BTN = game.add.button(100, 300, "buttonStartSS", function () {
              this.validateUpgradeEntity(2);
        }, this, 2, 1, 0  );        
        
        this.path3BTN = game.add.button(100, 500, "buttonStartSS", function () {
              this.validateUpgradeEntity(3);
        }, this, 2, 1, 0  );

            
    }
        
    //make sure entitiy can be upgraded 
    //path will be a number correspoding to the value of currentPathUps      
    this.validateUpgradeEntity = function (path) {    
        //kill buttons/upgrade menu
        this.path1BTN.kill();
        this.path2BTN.kill();
        this.path3BTN.kill();
                        
        //money and upgrades validation before upgrade
        if (this.data["currentPathUps" + path] >= this.data["path" + path].length) {
            //at max upgrades for path
            console.log("max upgrades for path")
        } else if (data.money < this.data["path" + path][this.data["currentPathUps" + path]].cost) {
            //too poor, can't buy
            console.log("too poor")
        } else if (data.money >= this.data["path" + path][this.data["currentPathUps" + path]].cost) {
            this.upgradeEntity(path);
        }
        
        
    }    //method
    
    //what to do when entity is actually being upgraded: subtract money, new entity texture
    this.upgradeEntity = function (path) {        
        data.money -= this.data["path" + path][this.data["currentPathUps" + path]].cost;
        UI.updateUI();
        
        this.drawNewEntity(path);   
        
        this.data["currentPathUps" + path] ++;      //keeping track of upgrades on each path
    }   //method
    
    this.drawNewEntity = function (path) {        
        towerSprite.loadTexture(this.data["path" + path][this.data["currentPathUps" + path]].src);
        helper.initSprite(towerSprite, this.data["path" + path][this.data["currentPathUps" + path]].srcScale, this.data["path" + path][this.data["currentPathUps" + path]].srcScale);
    }


}   //constructor