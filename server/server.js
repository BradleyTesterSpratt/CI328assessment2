var systems = require('./systems.js');
const PORT = 55000;

var server = require('http').createServer();
var io = require('socket.io')(server);

// here for now as we only have one lobby
// only the collection needs to be up here in future



io.on('connection', function(client) {

    // JACK - collision shizzz
    let collisionManager = {};
    collisionManager = new CollisionManager();

    client.on('test', function() {
        console.log('test received');
    });



    client.on('joinlobby', function(){

        client.join('lobby'); // i think we can have a list of rooms
        client.member = {
            position: server.lastMemberID++,
            isready: false,
            socketid : client.id
        }


        lobby.members[client.id] = client.member;

        client.emit('alllobbymembers', lobby.members);

        // this is currrently broadcasting to everything
        client.broadcast.emit('newmember', client.member);


        client.on('changecharacter',function(data) {
            //todo: change the character

            // tell everyone in the lobby the player has changed
            // this should probably be only the people in the lobby
            client.broadcast.emit('characterchange', client.player);
        });


        client.on('playerreadytoggle', function(data){
            console.log('playerreadytoggle');
            let clientId = client.id;
            let isReady = !client.member.isready

            lobby.members[clientId].isready = isReady;

            let isLobbyReady = true;
          //  io.sockets.to('lobby').emit('playerready', {key: clientId, isready: isReady});

            io.sockets.in('lobby').emit('playerready', {key: clientId, isready: isReady});

            // go through and make sure everyone is ready
            for(let key in lobby.members){
                // some seriouse jank, deffo move to ood
                if(!lobby.members[key].isready){
                    isLobbyReady = false;
                }
            }

            // if they are all ready clear the lobby and trigger game load
            if(isLobbyReady){
                setTimeout( function () {
                    io.sockets.in('lobby').emit("loadgame");
                    lobby = {};
                    lobby.members = {};


                }, 3000);
            };
        });
    });



    // this logic should now be done when the lobby ready trigger is caused
    // this also fixes a potential issue with the duplication of players
    // this encapsulating should be done through loadgame calls
    client.on('newplayer', function() {
        let playerNumber = server.lastPlayerID % 4;
        let startVectors = getStartVectors(playerNumber);

        let width = 190; //temp
        let height = 49; //temp

        client.player = new Player(server.lastPlayerID++,
            playerNumber,
            startVectors.x,
            startVectors.y,
            width,
            height,
            isRotated(playerNumber));

        // this isnt good!!
        if(!ball){
            // we want to have a game intiation method to call this stuff with
            ball = new Ball( gameHeight/2, gameWidth/2, ballWidth/2)
            ball.setVelocity(-8, 0)

            // this will contain a lot more information then we need
            io.emit("newball", ball); // we may be able to contain this transisition inside a game object to parsel sockets together
        }


        client.emit('allplayers', getAllPlayers());

        // called on all clients except the socket this thread is in
        client.broadcast.emit('newplayer', client.player);


        client.on('stopmove',function(data) {
            client.player.stop();
        });


        // we will want to write out own update mechanic, this will allow us to check for collisions after moving and combine movement of player/ball logic
        client.on('move',function(data) {
            let direction = Math.sign(data.direction);
            client.player.move(direction);
        });


        client.on('click',function(data) {
            console.log('click to '+data.x+', '+data.y);
            client.player.x = data.x;
            client.player.y = data.y;
            io.emit('move',client.player);
        });

        client.on('disconnect',function() {
            io.emit('remove', client.player.id);
            console.log('disconnecting: ' + client.player.id);
        });

        // JACK - collision shiz
        console.log('HEY', client.player, ball);
        collisionManager.addCollision(client.player, ball, () => { onCollisionPlayerBall(client.player, ball) })




        // testing a goal
        let goal = new PlayerGoal(startVectors.x, startVectors.y, 1000, 10, isRotated(playerNumber));
        collisionManager.addCollision(goal, ball, () => { goal.onCollision()})
    });
    
});

server.listen(PORT, function(){
    console.log('Listening on ' + server.address().port);
});

//create this somwhere else in the future
// i can see multiple lobbies being easy if this works
// we may want to run multiple servers, a lobby server and a game server would make the code significantly cleaner

let lobby = {}; //temp
lobby.members = {};

let ball;//temp
server.lastMemberID = 0;

server.lastPlayerID = 0;



function isRotated(playerNumber){
    return !(playerNumber % 2);
}

function formPlayers(members){
    // create a player for each member
    // add them to the client object?? for instancing
    // get stats from lobby like position and character to create player objects
    // return
}

function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        console.log(io.sockets.connected[socketID].player);
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}


function createPoint(x,y){
    return {x: x, y:y};
}


const gameWidth = 800;
const gameHeight = 800
const ballWidth = 64;


// get where the player should start
function getStartVectors(playnumber){
    const width = gameWidth;
    const height = gameHeight;
    const playerWidth = 30;
    const playerHeight = 30
    switch (playnumber) {
        case 0:   return {x: 0 + playerWidth, y: height/2}
        case 1:   return {x: width/2, y: height - playerHeight}
        case 2:   return {x: width - playerWidth, y: height/2}
        case 3:   return {x: width/2, y: 0 + playerHeight}
    }
}

// which direction does the player move in
function getMoveDirection(playerNumber){
    // invert inputs for opersite players, restrict movement to 1 axis
    switch (playerNumber) {
        case 0:   return {x: 0, y:1 }
        case 1:   return {x: 1, y:0 }
        case 2:   return {x: 0, y:-1 }
        case 3:   return {x: -1, y:0 }
    }
}

//https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection AABB
// generic physics object, adds itself to updater
// abstract
// we might want capacity to have trigger based collsions aswell
class PhysicsObject{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.velocity = createPoint(0,0)
        Updater.addToUpdate(this);
    }

    onCollision(otherObject){
    }

    intersects(a, b){
        return false;
    }

    outside(a, b){
        return false;
    }

    backstep(){
        this.x = this.previousX;
        this.y = this.previousY
    }
    // apply velocity changes
    update(){

        this.previousX = this.x;
        this.previousY = this.y;
        this.x = this.previousX + this.velocity.x;
        this.y = this.previousY + this.velocity.y;
        // undo velocity changes if they have collided, client will not see this
        // TODO: need to create a collision handler
        //       need to create a circle based physics object

        if(this.isOutOfBounds()){ // do we move this to the collision manager???
          //  this.backstep();
            this.onCollision();
            // this.onCollision("bounds"); //temp
        //    this.x = previousX;
       //     this.y = previousY;
        }
    }
    //https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection AABB
    //https://www.sevenson.com.au/actionscript/sat/
    //https://stackoverflow.com/questions/401847/circle-rectangle-collision-detection-intersection
    isOutOfBounds(){
        return false;
    }
    isOverlapping(a, b){
        return false;
    }

    setVelocity(x, y){
        this.velocity = createPoint(x,y);
    }
    stop(){
        this.velocity = createPoint(0,0);
    }
}


class RectanglePhysicsObject extends PhysicsObject{
    constructor(x, y, width, height){
        super(x,y);
        this.width = width;
        this.height = height;
    }

    // this only detects rectangle with rectangle we should have a collision handling object instead to allow for cir - squ and cir-cir and sqr-sqr
    intersects(a, b) {
        return (a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y)
    }

    isOutOfBounds() {
        let hWidth = this.width / 2;
        let hHeight = this.height / 2;

        let lx = this.x;
        let ly = this.y;

        return (lx  - hWidth < 0 ||
                lx + hWidth > gameWidth ||
                ly - hHeight < 0 ||
                ly + hHeight > gameHeight
        )
    }

}

//  relivant interection logic https://jsfiddle.net/SalixAlba/54Fb2/
class CirclePhysicsObject extends PhysicsObject{
    constructor(x, y, radius) {
        super(x,y);
        this.radius = radius;
    }

    isOutOfBounds() {
        const radius = this.radius;
        let x = this.x;
        let y = this.y;
        return(x - radius < 0 ||
                x + radius > gameWidth ||
                y - radius < 0 ||
                y + radius > gameHeight
            )
    }
}

class Ball extends CirclePhysicsObject{
    constructor(x,y,radius){
        super(x,y,radius);
        let diameter = radius * 2;
        this.height = diameter;
        this.width = diameter;
    }
//https://stackoverflow.com/questions/13455042/random-number-between-negative-and-positive-value
    onCollision(otherObject) {

        let xVel = this.velocity.x;
        let yVel = this.velocity.y;
        let newXVeloctity = xVel  * -1;
        let newYVeloctity = yVel * -1;
        if(otherObject){
            newXVeloctity = newXVeloctity + otherObject.velocity.x;
            newYVeloctity = newYVeloctity + otherObject.velocity.y;
        }
        this.setVelocity(newXVeloctity, newYVeloctity);
    }

    update() {
        super.update();
        io.emit("moveball",this); // not here
    }
}

// player class understands how to move and stop
class Player extends RectanglePhysicsObject{

    constructor(id,playNumber ,x, y, width, height, isRotated){
        super(x, y, width, height);
        this.id = id;
        this.playNumber = playNumber;
        this.pos = {x:x,y:y}; // this value isnt being updates

        // changed to use aabb
        if(isRotated){
            this.width = height;
            this.height = width;
        }
        else {
            this.height = height;
            this.width = width;
        }


        this.isRotated = isRotated;
    }

    move(input){
        let moveDirection = getMoveDirection(this.playNumber);
        let moveSpeed = 10;

        let xMovement = moveDirection.x * (moveSpeed * input);
        let yMovement = moveDirection.y * (moveSpeed * input);
        this.setVelocity(xMovement, yMovement);
    }


    stop(){
        this.setVelocity(0,0);
    }


    // something like this to restrict the amount of data being pushed down the wire
    getData(){
        let data = {
            id: this.id,
            playnumber: this.playNumber,
            x: this.pos.x,
            y: this.pos.y,
        }
        return data;
    }
    // we can do bounds like this now
    // getBounds() {
    //     //super.getBounds();
    //     // bounds are useless now!!!!
    //     //return createBounds({x:this.x,y:this.y}, this.width, this.height)//, this.isRotated);
    // }
    update() {
        super.update();
        // tell everyone the player has been updated - do this somewhere else
        io.emit('move', this);
    }
}

class PlayerGoal{
    constructor(x, y, width, height, isRotated){

        this.x = x;
        this.y = y;
        if(isRotated){
            this.width = height;
            this.height = width;
        }
        else{
            this.width = width;
            this.height = height;
        }

    }
    onCollision(){
        console.log("goal scored");
    }
}


// trigger update when it starts this will recall the update
// this should be done in the inards of a game class
update();
function update(){
    setTimeout(function () {
        systems.Updater.update();
        update();

    }, 50)
}


// TBD -- add velocity from moving paddles
function onCollisionPlayerBall(player, ball) {
    ball.onCollision(player);
}