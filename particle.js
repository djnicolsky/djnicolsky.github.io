"use strict";

function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration){ 
    // note: texture passed by reference, will be updated by the update function.

    this.tilesHorizontal = tilesHoriz;
    this.tilesVertical = tilesVert;

    // how many images does this spritesheet contain?
    //  usually equals tilesHoriz * tilesVert, but not necessarily,
    //  if there at blank tiles at the bottom of the spritesheet. 
    this.numberOfTiles = numTiles;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
    texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );

    // how long should each image be displayed?
    this.tileDisplayDuration = tileDispDuration;

    // how long has the current image been displayed?
    this.currentDisplayTime = 0;

    // which image is currently being displayed?
    this.currentTile = 0;

    this.update = function( milliSec )
    {
        this.currentDisplayTime += milliSec;
        while (this.currentDisplayTime > this.tileDisplayDuration)
        {
            this.currentDisplayTime -= this.tileDisplayDuration;
            this.currentTile++;
            if (this.currentTile == this.numberOfTiles)
                this.currentTile = 0;
            var currentColumn = this.currentTile % this.tilesHorizontal;
            texture.offset.x = currentColumn / this.tilesHorizontal;
            var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
            texture.offset.y = currentRow / this.tilesVertical;
        }
    };
}



function Particle(values){
	this.values = JSON.parse(JSON.stringify(values));
	this.id   = values.id;
	this.name = values.name;
	this.label = values.label;
	this.Q    = parseFloat(values.Q);
	this.M0   = parseFloat(values.M0);
	this.M    = this.M0;
	this.type = values.type;  //"N" - Classic, "R" - Relativistic, "P" - Pin
	this.LocalListInteractions=[];

	if(this.type != "P"){
		this.rx0  = parseFloat(values.rx0);	this.srx  = "0.0";
		this.ry0  = parseFloat(values.ry0); this.sry  = "0.0";
		this.rz0  = parseFloat(values.rz0); this.srz  = "0.0";

		this.vx0  = parseFloat(values.vx0);
		this.vy0  = parseFloat(values.vy0);
		this.vz0  = parseFloat(values.vz0);	
	}
	else{
		this.srx = values.rx0;
		//this.rx0 = fPIN(this.srx, [0.0, 0.0, 0.0], [0.0, 0.0, 0.0], 0.0);
		this.vx0 = 0.0;

		this.sry = values.ry0;
		//this.ry0 = fPIN(this.sry, [0.0, 0.0, 0.0], [0.0, 0.0, 0.0], 0.0);
		this.vy0 = 0.0;
		
		this.srz = values.rz0;
		//this.rz0 = fPIN(this.srz, [0.0, 0.0, 0.0], [0.0, 0.0, 0.0], 0.0);
		this.vz0 = 0.0;
	}
	this.fpx = new Function('T', 'return '+convert(this.srx)+';');
	this.fpy = new Function('T', 'return '+convert(this.sry)+';');
	this.fpz = new Function('T', 'return '+convert(this.srz)+';');

	if(this.type == "P"){
		this.rx0 = this.fpx(0);
		this.ry0 = this.fpy(0);
		this.rz0 = this.fpz(0);
	}

	this.radius  = parseFloat(values.radius);
	this.collided = false;
	this.iR      = this.radius;
	this.color   = values.color;
	this.picture = values.picture;
	this.pimgs   = parseInt(values.pimgs);
	this.belongs = 0;
	this.annie   = [];

	this.trace     = values.trace;
	this.showlabel = values.showlabel;

    this.R = [0.0, 0.0, 0.0];    this.R_old = [0.0, 0.0, 0.0];
    this.V = [0.0, 0.0, 0.0];    this.V_old = [0.0, 0.0, 0.0];
    this.A = [0.0, 0.0, 0.0];    this.A_old = [0.0, 0.0, 0.0];
    this.P = [0.0, 0.0, 0.0];    this.P_old = [0.0, 0.0, 0.0];

	this.F = [0.0, 0.0, 0.0];
	this.Tr = [0.0, 0.0, 0.0];   this.Tv = [0.0, 0.0, 0.0];
	this.tdV = [0.0, 0.0, 0.0];	 this.tdR = [0.0, 0.0, 0.0];

	this.k1 = [0.0, 0.0, 0.0];	 this.l1 = [0.0, 0.0, 0.0];
	this.k2 = [0.0, 0.0, 0.0];	 this.l2 = [0.0, 0.0, 0.0];
	this.k3 = [0.0, 0.0, 0.0];	 this.l3 = [0.0, 0.0, 0.0];
	this.k4 = [0.0, 0.0, 0.0];	 this.l4 = [0.0, 0.0, 0.0];

	this.sprite = null;
	this.ball = null;
	this.arrow = null;
	this.traceGeo = null;
	this.traceXYZ = null;
	this.tracePos = null;
	this.traceLine = null;

	this.textLabels = [];

	this.S = null;
	this.D = null;
}

Particle.prototype.syncValues = function(){
	this.values.Q = this.Q;
	this.values.M0 = this.M0;
	this.values.rx0 = this.rx0;
	this.values.ry0 = this.ry0;
	this.values.rz0 = this.rz0;
	this.values.vx0 = this.vx0;
	this.values.vy0 = this.vy0;
	this.values.vz0 = this.vz0;
}

Particle.prototype.returnValues = function(){
	values.Q = this.Q + "";
	values.M0 = this.M0 + "";
	values.rx0 = this.rx0 + "";
	values.ry0 = this.ry0 + "";
	values.rz0 = this.rz0 + "";
	values.vx0 = this.vx0 + "";
	values.vy0 = this.vy0 + "";
	values.vz0 = this.vz0 + "";
	values.id = this.id;
	values.name = this.name;
	values.label = this.label;
	values.type = this.type;
	values.radius = this.radius + "";

	values.color = this.color;
	values.picture = this.picture;
	values.pimgs = this.pimgs + "";
	values.trace = this.trace;
	values.showlabel = this.showlabel;

	return values;
}

Particle.prototype.update = function(values){
	this.values = values;
	this.id   = values.id;
	this.name = values.name;
	this.label = values.label;
	this.Q    = parseFloat(values.Q);
	this.M0   = parseFloat(values.M0);
	this.M    = this.M0;
	this.type = values.type;

	if(this.type != "P"){
		this.rx0  = parseFloat(values.rx0);	this.srx = "0.0";
		this.ry0  = parseFloat(values.ry0); this.sry = "0.0";
		this.rz0  = parseFloat(values.rz0); this.srz = "0.0";

		this.vx0  = parseFloat(values.vx0);
		this.vy0  = parseFloat(values.vy0);
		this.vz0  = parseFloat(values.vz0);	
	}else{
		this.srx = values.rx0;
		//this.rx0 = fPIN(this.srx, [0.0, 0.0, 0.0], [0.0, 0.0, 0.0], 0.0);
		this.vx0 = 0.0;

		this.sry = values.ry0;
		//this.ry0 = fPIN(this.sry, [0.0, 0.0, 0.0], [0.0, 0.0, 0.0], 0.0);
		this.vy0 = 0.0;
		
		this.srz = values.rz0;
		//this.rz0 = fPIN(this.srz, [0.0, 0.0, 0.0], [0.0, 0.0, 0.0], 0.0);
		this.vz0 = 0.0;
	}
	this.fpx = new Function('T', 'return '+convert(this.srx)+';');
	this.fpy = new Function('T', 'return '+convert(this.sry)+';');
	this.fpz = new Function('T', 'return '+convert(this.srz)+';');

	if(this.type == "P"){
		this.rx0 = this.fpx(0);
		this.ry0 = this.fpy(0);
		this.rz0 = this.fpz(0);
	}

	this.radius  = parseFloat(values.radius);
	this.collided = false;
	this.color   = values.color;
	this.picture = values.picture;
	this.pimgs   = parseInt(values.pimgs);

	this.trace     = values.trace;
	this.showlabel = values.showlabel;

	if(this.picture == 'none'){
		this.sprite.visible = false;
		this.ball.visible = true;
	}
	else{
		this.sprite.visible = true;
		this.ball.visible = false;
	}
}

Particle.prototype.initialize = function(FlagVelocities){
	if(this.picture != 'none')
		var canvas = document.getElementById('Canvas_'+this.picture);
	else
		var canvas = document.getElementById('Canvas_'+this.color.replace('#',''));
	var crateTexture = new THREE.Texture( canvas );
	crateTexture.needsUpdate = true;
	this.annie = new TextureAnimator(crateTexture, this.pimgs, 1, this.pimgs, 75 );

	this.getForce(0.0);

	this.R[0] = parseFloat(this.rx0);
	this.R[1] = parseFloat(this.ry0);
	this.R[2] = parseFloat(this.rz0);

	this.V[0] = parseFloat(this.vx0);
	this.V[1] = parseFloat(this.vy0);
	this.V[2] = parseFloat(this.vz0);

	this.M = this.M0;
	for (var i=0; i<3; i++) {
		this.R_old[i] = this.R[i];
		this.V_old[i] = this.V[i];

		this.P[i] = this.V[i] * this.M0;
		this.P_old[i] = this.P[i];
						
		this.A[i] = this.F[i] / this.M0;  
		this.A_old[i] = this.A[i];
		this.tdR[i] = 0.0;
		this.tdV[i] = 0.0;
	}

	var crateMaterial = new THREE.SpriteMaterial( { map: crateTexture, useScreenCoordinates: false} );
	this.sprite = new THREE.Sprite( crateMaterial );
	this.sprite.name = this.id;
	this.sprite.scale.set(3, 3, 3);
	this.sprite.position.set( AnimationScale*World.AxisScale[0]*this.R[0], AnimationScale*World.AxisScale[1]*this.R[1], AnimationScale*World.AxisScale[2]*this.R[2]);

	var AverageAxisScale = (World.AxisScale[0]+World.AxisScale[1]+World.AxisScale[2])/3;
	var sphereGeometry = new THREE.SphereGeometry( AnimationScale*AverageAxisScale*this.radius, 16, 16 ); 	this.iR = this.radius;
	var sphereMaterial = new THREE.MeshLambertMaterial( {color: this.color} ); 
	this.ball = new THREE.Mesh(sphereGeometry, sphereMaterial);
	this.ball.position.set( AnimationScale*World.AxisScale[0]*this.R[0], AnimationScale*World.AxisScale[1]*this.R[1], AnimationScale*World.AxisScale[2]*this.R[2]);


	var dir = new THREE.Vector3( AnimationScale*World.AxisScale[0]*this.V[0], AnimationScale*World.AxisScale[1]*this.V[1], AnimationScale*World.AxisScale[2]*this.V[2]);
	var VelLen = Math.sqrt(this.V[0]*this.V[0] + this.V[1]*this.V[1]+ this.V[2]*this.V[2]);
	dir.normalize();
	this.arrow = new THREE.ArrowHelper( new THREE.Vector3( 0, 0, 0 ), dir, Math.max(VelLen, 0.001) );
	this.arrow.position.set( AnimationScale*World.AxisScale[0]*this.R[0], AnimationScale*World.AxisScale[1]*this.R[1], AnimationScale*World.AxisScale[2]*this.R[2]);
	this.arrow.line.material.color.set(this.color);
	this.arrow.cone.material.color.set(this.color);

	this.traceGeo = new THREE.BufferGeometry();
	this.traceXYZ = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
	this.tracePos = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point					
	this.traceGeo.addAttribute('position', new THREE.BufferAttribute(this.tracePos, 3));
    var lineMaterial = new THREE.LineBasicMaterial({color:this.color, linewidth: 20});  
	this.traceLine = new THREE.Line(this.traceGeo, lineMaterial);

	for (var i=0; i<3; i++)
		this.traceXYZ[i] = this.R[i];
	this.traceLine.geometry.setDrawRange(0, 1);
	this.traceLine.geometry.dynamic = true;
    
    var positions = this.traceLine.geometry.attributes.position.array;
    for (var i=0; i<3; i++)
        positions[i]=AnimationScale*World.AxisScale[i]*this.traceXYZ[i];

    // required after the first render
	this.traceLine.geometry.attributes.position.needsUpdate = true; 
	this.traceLine.frustumCulled = false;
	if(this.trace=="Y")
		scene.add(this.traceLine);

	if(!FlagVelocities)
		this.arrow.visible = false;

	group.add(this.ball);
	group.add(this.arrow);
	group.add(this.sprite);
	if(this.picture == 'none')
		this.sprite.visible = false;
	else
		this.ball.visible = false;
}

Particle.prototype.cleanup = function(){
	group.remove(this.ball);
	group.remove(this.arrow);
	group.remove(this.sprite);
	
	if(this.trace=="Y")
		scene.remove(this.traceLine);

	for (var ii = this.LocalListInteractions.length - 1; ii >= 0; ii--){
		scene.remove(this.LocalListInteractions[ii].line);
		this.LocalListInteractions.splice(ii,1);
	}
}

//Particle.prototype.toggleLabel = function(str){
//	if((str=="Y")&&(this.showlabel=="N"))
//		group.add(this.spritey);
//	if((str=="N")&&(this.showlabel=="Y"))
//		group.remove(this.spritey);
//}

//Particle.prototype.toggleTrace = function(str){
//	if((str=="Y")&&(this.trace=="N"))
//		scene.add(this.traceLine);
//	if((str=="N")&&(this.trace=="Y"))
//		scene.remove(this.traceLine);
//}


Particle.prototype.restart = function(){
	this.R[0] = parseFloat(this.rx0);
	this.R[1] = parseFloat(this.ry0);
	this.R[2] = parseFloat(this.rz0);

	this.V[0] = parseFloat(this.vx0);
	this.V[1] = parseFloat(this.vy0);
	this.V[2] = parseFloat(this.vz0);

	for (var i=0; i<3; i++){
		this.Tr[i] = this.R[i];
		this.Tv[i] = this.V[i];
	}

	this.getForce(0.0);
	this.M = this.M0;
	for (var i=0; i<3; i++) {
		this.R_old[i] = this.R[i];
		this.V_old[i] = this.V[i];

		this.P[i] = this.V[i] * this.M0;
		this.P_old[i] = this.P[i];
						
		this.A[i] = this.F[i] / this.M0;  
		this.A_old[i] = this.A[i];
		this.tdR[i] = 0.0;
		this.tdV[i] = 0.0;
	}

	this.sprite.position.x = AnimationScale*World.AxisScale[0]*this.R[0];
	this.sprite.position.y = AnimationScale*World.AxisScale[1]*this.R[1];
	this.sprite.position.z = AnimationScale*World.AxisScale[2]*this.R[2];

	this.ball.position.x = AnimationScale*World.AxisScale[0]*this.R[0];
	this.ball.position.y = AnimationScale*World.AxisScale[1]*this.R[1];
	this.ball.position.z = AnimationScale*World.AxisScale[2]*this.R[2];

	this.arrow.position.x = AnimationScale*World.AxisScale[0]*this.R[0];
	this.arrow.position.y = AnimationScale*World.AxisScale[1]*this.R[1];
	this.arrow.position.z = AnimationScale*World.AxisScale[2]*this.R[2];

	var dir = new THREE.Vector3( AnimationScale*World.AxisScale[0]*this.V[0], AnimationScale*World.AxisScale[1]*this.V[1], AnimationScale*World.AxisScale[2]*this.V[2]);
	var VelLen = Math.sqrt(this.V[0]*this.V[0] + this.V[1]*this.V[1]+ this.V[2]*this.V[2]);
	dir.normalize();
	this.arrow.setDirection(dir);
	this.arrow.setLength(World.VelocityScale*Math.max(VelLen, 0.001));

	for (var i=0; i<3; i++)
		this.traceXYZ[i] = this.R[i];
	this.traceLine.geometry.setDrawRange(0, 1);
	this.traceLine.geometry.dynamic = true;

	this.S = null;
	this.D = null;
}

Particle.prototype.preMoveParticles = function(time, dt){

	if(this.type == 'P')
		return;

	for (var i=0; i<3; i++){
		this.R_old[i] = this.R[i];
		this.V_old[i] = this.V[i];
		this.A_old[i] = this.A[i];
	}

	for (var i=0; i<3; i++){
		this.Tr[i] = this.R_old[i];
		this.Tv[i] = this.V_old[i];
	}

	this.getForce(time);
	for (var i=0; i<3; i++){
		this.k1[i] = this.V_old[i] * dt;
		this.l1[i] = this.F[i] * dt / this.M0;
	}

	for (var i=0; i<3; i++){
		this.Tr[i] = this.R_old[i] + this.k1[i]/2.0;
		this.Tv[i] = this.V_old[i] + this.l1[i]/2.0;
	}
		
	this.getForce(time + dt/2.0);
	for (var i=0; i<3; i++){
		this.k2[i] = this.Tv[i] * dt;
		this.l2[i] = this.F[i] * dt / this.M0;
	}

	for (var i=0; i<3; i++){
		this.Tr[i] = this.R_old[i] + this.k2[i]/2.0;
		this.Tv[i] = this.V_old[i] + this.l2[i]/2.0;
	}

	this.getForce(time + dt/2.0);
	for (var i=0; i<3; i++){
		this.k3[i] = this.Tv[i] * dt;
		this.l3[i] = this.F[i] * dt / this.M0;
	}

	for (var i=0; i<3; i++){
		this.Tr[i] = this.R_old[i] + this.k3[i];
		this.Tv[i] = this.V_old[i] + this.l3[i];
				}

	this.getForce(time + dt);
	for (var i=0; i<3; i++){
		this.k4[i] = this.Tv[i] * dt;
		this.l4[i] = this.F[i] * dt / this.M0;
	}

	for (var i=0; i<3; i++){
		this.tdV[i] = (this.l1[i] + 2.0*this.l2[i] + 2.0*this.l3[i] + this.l4[i])/6.0;
		this.tdR[i] = (this.k1[i] + 2.0*this.k2[i] + 2.0*this.k3[i] + this.k4[i])/6.0;
	}
}


Particle.prototype.moveParticles = function (time, dt){

	if(this.type != 'P'){
		this.M = this.M0;
		for (var i=0; i<3; i++){
			this.R[i] = this.R_old[i] + this.tdR[i];
			this.V[i] = this.V_old[i] + this.tdV[i];
			this.A[i] = this.tdV[i] / dt;
			this.P[i] = this.V[i] * this.M0;
		}

		for(var i=0; i<3 && World.CollisionBoundary; i++){
			if(this.R[i]<=World.LB[i]+this.radius){
				this.R[i]=World.LB[i]+this.radius;
				this.V[i]=-this.V[i];
				this.P[i]=-this.P[i];
			}
			if(this.R[i]>=World.UB[i]-this.radius){
				this.R[i]=World.UB[i]-this.radius;
				this.V[i]=-this.V[i];
				this.P[i]=-this.P[i];
			}
		}
	}
	else{
		//this.R[0] = fPIN(this.srx, [0.0, 0.0, 0.0], [0.0, 0.0, 0.0], time);
		//this.R[1] = fPIN(this.sry, [0.0, 0.0, 0.0], [0.0, 0.0, 0.0], time);
		//this.R[2] = fPIN(this.srz, [0.0, 0.0, 0.0], [0.0, 0.0, 0.0], time);

		this.R[0] = this.fpx(time+dt);
		this.R[1] = this.fpy(time+dt);
		this.R[2] = this.fpz(time+dt);

		for (var i=0; i<3; i++){
			this.V[i] = 0.0;
			this.A[i] = 0.0;
			this.P[i] = 0.0;
		}
	}
}

Particle.prototype.CrossProduct = function (A, B){
	var res = new Float32Array(3)
	var i, i1, i2;

	for (i=0; i<3; i++){
		i1 = (i + 1) % 3; i2 = (i + 2) % 3;
		res[i] = (A[i1]*B[i2]-A[i2]*B[i1]);
	}
	return res;
}

Particle.prototype.getForceD = function (time){
	for (var j=0; j<3; j++)
		this.F[j] = 0.0;
}

Particle.prototype.updateTraceXYZ = function (){
	if(AnimationStep<MAX_POINTS)
		for (var i=0; i<3; i++)
			this.traceXYZ[AnimationStep*3+i] = this.R[i];
	else{
		for (var i = 0; i < 3*MAX_POINTS-3; i++)
			this.traceXYZ[i]=this.traceXYZ[i+3];
		for (var i=0; i<3; i++)
			this.traceXYZ[(MAX_POINTS-1)*3+i] = this.R[i];
	}
}

Particle.prototype.updateTrace = function (delta){
	if(AnimationStep<MAX_POINTS)
		for (var i=0; i<3; i++)
			this.traceXYZ[AnimationStep*3+i] = this.R[i];
	else{
		for (var i = 0; i < 3*MAX_POINTS-3; i++)
			this.traceXYZ[i]=this.traceXYZ[i+3];
		for (var i=0; i<3; i++)
			this.traceXYZ[(MAX_POINTS-1)*3+i] = this.R[i];
	}

	this.sprite.position.x = AnimationScale*World.AxisScale[0]*this.R[0];
	this.sprite.position.y = AnimationScale*World.AxisScale[1]*this.R[1];
	this.sprite.position.z = AnimationScale*World.AxisScale[2]*this.R[2];

	this.ball.position.x = AnimationScale*World.AxisScale[0]*this.R[0];
	this.ball.position.y = AnimationScale*World.AxisScale[1]*this.R[1];
	this.ball.position.z = AnimationScale*World.AxisScale[2]*this.R[2];

	this.arrow.position.x = AnimationScale*World.AxisScale[0]*this.R[0];
	this.arrow.position.y = AnimationScale*World.AxisScale[1]*this.R[1];
	this.arrow.position.z = AnimationScale*World.AxisScale[2]*this.R[2];

	var dir = new THREE.Vector3( AnimationScale*World.AxisScale[0]*this.V[0], AnimationScale*World.AxisScale[1]*this.V[1], AnimationScale*World.AxisScale[2]*this.V[2]);
	var VelLen = Math.sqrt(this.V[0]*this.V[0] + this.V[1]*this.V[1]+ this.V[2]*this.V[2]);
	dir.normalize();
	this.arrow.setDirection(dir);
	this.arrow.setLength(World.VelocityScale*Math.max(VelLen,0.001));

	for (var i = 0; i < Math.min(AnimationStep,MAX_POINTS); i++)
		for (var j=0; j<3; j++)
			this.traceLine.geometry.attributes.position.array[i*3+j]=AnimationScale*World.AxisScale[j]*this.traceXYZ[i*3+j];
	       										
	this.traceLine.geometry.setDrawRange( 0, Math.min(AnimationStep,MAX_POINTS) );
	this.traceLine.geometry.dynamic = true;
	this.traceLine.geometry.attributes.position.needsUpdate = true; 
	this.traceLine.frustumCulled = false;
    
	this.annie.update(1000 * delta);
}






Particle.prototype.getForce = function(time){
	for (var j=0; j<3; j++)
		this.F[j] = 0.0;

	for (var i = 0; i<fields.length; i++){
		if(!fields[i].numeric)
			fields[i].updateValues(this.Tr, this.Tv, time);

		switch(fields[i].type) {
			case 'G':
				for (var j=0; j<3; j++)	this.F[j] += fields[i].F[j]*this.M0;
				break;
			case 'E':
				for (var j=0; j<3; j++)	this.F[j] += fields[i].F[j]*this.Q;
				break;	
			case 'K':
				for (var j=0; j<3; j++)	this.F[j] -= fields[i].F[j]*this.Tv[j];
				break;
			case 'B':
				this.F[0] += (this.Tv[1]*fields[i].F[2]-this.Tv[2]*fields[i].F[1])*this.Q/137;
				this.F[1] += (this.Tv[2]*fields[i].F[0]-this.Tv[0]*fields[i].F[2])*this.Q/137;
				this.F[2] += (this.Tv[0]*fields[i].F[1]-this.Tv[1]*fields[i].F[0])*this.Q/137;
				break;	
		}
	}
	
	var F   = [0.0, 0.0, 0.0];
	var tmp = [0.0, 0.0, 0.0];
	for (var i=0; i<listRings.length; i++){
		tmp = listRings[i].getB(this.Tr);
		for(var j=0; j<3; j++)
			F[j] += tmp[j];
	}
	this.F[0] += (this.Tv[1]*F[2]-this.Tv[2]*F[1])*this.Q/137;
	this.F[1] += (this.Tv[2]*F[0]-this.Tv[0]*F[2])*this.Q/137;
	this.F[2] += (this.Tv[0]*F[1]-this.Tv[1]*F[0])*this.Q/137;


	for (var i = this.LocalListInteractions.length - 1; i >= 0; i--) {
		var tmp = this.interactionForce(this.LocalListInteractions[i], time); // setting up tmp
		for(var ii=0; ii<3; ii++)
			this.F[ii] += tmp[ii];
	}

	if(this.name=='Neutron')
		this.F = this.F;
}

function iaP2P(f, Q1, M1, Rad1, R1, V1, Q2, M2, Rad2, R2, V2, t){
	var r = Math.sqrt((R1[0]-R2[0])*(R1[0]-R2[0])+(R1[1]-R2[1])*(R1[1]-R2[1])+(R1[2]-R2[2])*(R1[2]-R2[2]));
	var v = Math.sqrt((V1[0]-V2[0])*(V1[0]-V2[0])+(V1[1]-V2[1])*(V1[1]-V2[1])+(V1[2]-V2[2])*(V1[2]-V2[2]));

	return f(t, r, v, R1[0], R2[0], R1[1], R2[1], R1[2], R2[2], V1[0], V2[0], V1[1], V2[1], V1[2], V2[2], M1, M2, Q1, Q2, Rad1, Rad2);
}


Particle.prototype.interactionForce = function(ITR, time) {
	var DELTA_R=0.0, DELTA_V=0.0;
	var tmp = [0.0, 0.0, 0.0];

	for (var i=0; i<3; i++){
		DELTA_R += (this.Tr[i]-ListParticles[ITR.iER].R[i])*(this.Tr[i]-ListParticles[ITR.iER].R[i]);
		DELTA_V += (this.Tv[i]-ListParticles[ITR.iER].V[i])*(this.Tv[i]-ListParticles[ITR.iER].V[i]);	
	}
	DELTA_R = Math.sqrt(DELTA_R);
	DELTA_V = Math.sqrt(DELTA_V);
				
	if(DELTA_R == 0) 
		return tmp;

	if(ITR.E)
		for (var i=0; i<3; i++)
			tmp[i] += tmp[i] + (this.Tr[i]-ListParticles[ITR.iER].R[i])*this.Q*ListParticles[ITR.iER].Q/(DELTA_R*DELTA_R*DELTA_R);
	if(ITR.G)
		for (var i=0; i<3; i++)
			tmp[i] += tmp[i] - (this.Tr[i]-ListParticles[ITR.iER].R[i])*this.M0*ListParticles[ITR.iER].M0/(DELTA_R*DELTA_R*DELTA_R);
	if(ITR.H)
		for (var i=0; i<3; i++){
			tmp[i] += tmp[i] + (this.Tr[i]-ListParticles[ITR.iER].R[i])/DELTA_R * (ITR.R-DELTA_R)*ITR.K;
			tmp[i] += tmp[i] - (this.Tv[i]-ListParticles[ITR.iER].V[i])*ITR.A;
		}
	if(ITR.D){
		//var val = fx(ITR.Fx, this.Q, this.M0, this.radius, this.Tr, this.Tv, ListParticles[ITR.iER].Q, ListParticles[ITR.iER].M0, ListParticles[ITR.iER].radius, ListParticles[ITR.iER].R, ListParticles[ITR.iER].V, time);
		var val = iaP2P(ITR.fP2P, this.Q, this.M0, this.radius, this.Tr, this.Tv, ListParticles[ITR.iER].Q, ListParticles[ITR.iER].M0, ListParticles[ITR.iER].radius, ListParticles[ITR.iER].R, ListParticles[ITR.iER].V, time);
		for (var i=0; i<3; i++)
			tmp[i] += tmp[i] + (this.Tr[i]-ListParticles[ITR.iER].R[i])/DELTA_R * val;
	}
	return tmp;
}




function makeTextSprite( message, parameters )
{
	if ( parameters === undefined ) parameters = {};
	
	var fontface = parameters.hasOwnProperty("fontface") ? 
		parameters["fontface"] : "Arial";
	
	var fontsize = parameters.hasOwnProperty("fontsize") ? 
		parameters["fontsize"] : 18;
	
	var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
		parameters["borderThickness"] : 4;
	
	var borderColor = parameters.hasOwnProperty("borderColor") ?
		parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };

	var textColor = parameters.hasOwnProperty("textColor") ?
		parameters["textColor"] : { r:0, g:0, b:0, a:1.0 };
	
	var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
		parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = "Bold " + fontsize + "px " + fontface;
    
	// get size data (height depends only on font size)
	var metrics = context.measureText( message );

	var textWidth = metrics.width;
	
	// background color
	context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
								  + backgroundColor.b + "," + backgroundColor.a + ")";
	// border color
	context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
								  + borderColor.b + "," + borderColor.a + ")";

	context.lineWidth = borderThickness;
	roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
	// 1.4 is extra height factor for text below baseline: g,j,p,q.
	
	// text color
	context.fillStyle = "rgba("+ textColor.r + "," + textColor.g + ","
							   + textColor.b + "," + textColor.a +")";

	context.fillText( message, borderThickness, fontsize + borderThickness);
	
	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial({ map: texture, useScreenCoordinates: false } );
	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(4.0, 4.0, 4.0);
	return sprite;	
}

function makeTextSprite2( message, parameters )
{
	if ( parameters === undefined ) parameters = {};

	var fontsize =128;

	var textColor = parameters.hasOwnProperty("textColor") ?
		parameters["textColor"] : { r:100, g:100, b:100, a:1.0 };

	var canvas0 = document.createElement('canvas');
	var context0 = canvas0.getContext('2d');
	context0.font = "Bold 128px Arial";
	var metrics = context0.measureText( message );

	var canvas = document.createElement('canvas');
	var divcanvas = document.getElementById('myCanvases');
	canvas.width = Math.max(fontsize, metrics.width);
	canvas.height = canvas.width;
	divcanvas.appendChild(canvas);

	var context = canvas.getContext('2d');
	context.font = "Bold 128px Arial";	
	// text color
	context.fillStyle = "rgba("+ textColor.r + "," + textColor.g + ","
							   + textColor.b + "," + textColor.a +")";

	context.fillText( message, 0, fontsize);
	
	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial({ map: texture, useScreenCoordinates: false } );
	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(1.2, 1.2, 1.2);
	return sprite;	
}

// function for drawing rounded rectangles
function roundRect(ctx, x, y, w, h, r) 
{
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
	ctx.stroke();   
}


function createTextLabel(document,scale) {
    var div = document.createElement('div');
    div.className = 'text-label';
    div.style.position = 'absolute';
    div.style.width = 100;
    div.style.height = 100;
    div.innerHTML = "hi there!";
    div.style.top = -1000;
    div.style.left = -1000;
    
    return {
      element: div,
      parent: false,
      position: new THREE.Vector3(0,0,0),
      setHTML: function(html) {
        this.element.innerHTML = "&nbsp"+html; //"&nbsp"+html; &#8198
      },
      setParent: function(threejsobj, camera, scale, frame, visibility) {
        this.parent = threejsobj;
        this.camera = camera;
        this.scale = scale;
        this.frame = frame;
        this.visibility = visibility;
      },
      updatePosition: function() {
        if(parent) {
          this.position.copy(this.parent.position);
        }
        
        var coords2d = this.get2DCoords(this.position, this.camera);
        this.element.style.left = coords2d.x + 'px';
        this.element.style.top = coords2d.y + 'px';
        this.element.style.color = '#ffffff';
        if(this.visibility == "N")
        	this.element.style.visibility = "hidden"; 
      },
      get2DCoords: function(position, camera) {
        var vector = position.project(camera);
        vector.x = (vector.x + 1)/2 * window.innerWidth*(this.scale) + this.frame*window.innerWidth/2;
        vector.y = -(vector.y - 1)/2 * window.innerHeight;
        return vector;
      }
    };
  }
