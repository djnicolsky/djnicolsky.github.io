"use strict";

function Interaction(values){
	this.nEE = values.nEE;
	this.nER = values.nER;
	this.iEE = values.iEE;
	this.iER = values.iER;
	this.interaction = -1;

	this.G = values.G;
	this.E = values.E;
	this.H = values.H;
	this.K = parseFloat(values.K);
	this.R = parseFloat(values.R);
	this.A = parseFloat(values.A);
	this.D = values.D;
	this.Fx = values.Fx;
	this.trace = values.trace;

	this.vertArray = [];
	this.lineGeometry = [];
	this.line = [];

	if(this.Fx == '') {this.Fx = '0'; this.values.Fx ='0';}
    this.fP2P = new Function('T', 'r', 'v', 'Xm', 'Xs', 'Ym', 'Ys', 'Zm', 'Zs', 'Um', 'Us', 'Vm', 'Vs', 'Wm', 'Ws', 'Mm', 'Ms', 'Qm', 'Qs', 'Dm', 'Ds', 'return '+convert(this.Fx)+';');
}

Interaction.prototype.returnValues = function(){
	var values = {};
	values.nEE = this.nEE;
	values.nER = this.nER;
	values.iEE = this.iEE;
	values.iER = this.iER;
	values.G = this.G;
	values.E = this.E;
	values.H = this.H;
	values.K = this.K;
	values.A = this.A;
	values.R = this.R;
	values.D = this.D;
	values.Fx = this.Fx;
	values.trace = this.trace;
	return values;
}


Interaction.prototype.initialize = function(){
	this.lineGeometry = new THREE.Geometry();
	this.vertArray = this.lineGeometry.vertices;
	this.vertArray.push( new THREE.Vector3(0.0, 5.0, 5.0), new THREE.Vector3(0.0, 0.0, 0.0) );
	this.lineGeometry.computeLineDistances();
	var lineMaterial = new THREE.LineDashedMaterial( { color: 0xcccccc, dashSize: 1, gapSize: 1 } );
	this.line = new THREE.Line( this.lineGeometry, lineMaterial );
	this.line.geometry.verticesNeedUpdate = true;

	if(!this.trace)
		this.line.visible = false;

	scene.add(this.line);
}

function Heaviside(L,x,R){
	if((L<=x)&&(x<=R))
		return 1;
	else
		return 0;
}

Interaction.prototype.updateEndPoints = function(LP){
	this.lineGeometry.vertices[0].x = AnimationScale*World.AxisScale[0]*ListParticles[this.iEE].R[0];
	this.lineGeometry.vertices[0].y = AnimationScale*World.AxisScale[1]*ListParticles[this.iEE].R[1];
	this.lineGeometry.vertices[0].z = AnimationScale*World.AxisScale[2]*ListParticles[this.iEE].R[2];

	this.lineGeometry.vertices[1].x = AnimationScale*World.AxisScale[0]*ListParticles[this.iER].R[0];
	this.lineGeometry.vertices[1].y = AnimationScale*World.AxisScale[1]*ListParticles[this.iER].R[1];
	this.lineGeometry.vertices[1].z = AnimationScale*World.AxisScale[2]*ListParticles[this.iER].R[2];
	
	this.lineGeometry.computeLineDistances();
	this.line.geometry.verticesNeedUpdate = true; 
	this.line.frustumCulled = false;
}