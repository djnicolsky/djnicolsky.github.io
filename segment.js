"use strict";

function Ring(values){
	this.Ra = [];
	this.elements = [];
	this.name = values.name;
	this.label = values.label;
	this.type = values.type;
	this.current = parseFloat(values.current);
	

	if(this.type == 'Ring'){
		this.R0 = new THREE.Vector3(parseFloat(values.X0), parseFloat(values.Y0), parseFloat(values.Z0));
		this.R1 = new THREE.Vector3(0, 0, 0);
		this.n = new THREE.Vector3(parseFloat(values.Nx), parseFloat(values.Ny), parseFloat(values.Nz));
		this.radius = parseFloat(values.radius);
	
		var tmp = new THREE.Vector3(Math.random(),Math.random(),Math.random());
		var normal = this.n.clone();
		normal.cross(tmp);
		normal.normalize();
		var binormal = normal.clone();
		binormal.cross(this.n);
		binormal.normalize();

		normal.multiplyScalar(this.radius);
		binormal.multiplyScalar(this.radius);

		var count = 16; var tmp_old = new THREE.Vector3(); var a;
		for ( var i = 0, ii=0; i <= count; i ++ ) {
			if(this.current>0)
				a = 2 * i / count * Math.PI;
			else
				a = 2 * (count-i) / count * Math.PI;
			if (i>0) tmp_old = tmp.clone();
			tmp.set(normal.x*Math.cos(a)+binormal.x*Math.sin(a), normal.y*Math.cos(a)+binormal.y*Math.sin(a), normal.z*Math.cos(a)+binormal.z*Math.sin(a));
			tmp.add(this.R0);

			if(i>0)	this.elements[i-1] = new Elem(tmp_old, tmp, this.current);

			var x=tmp_old.clone();
			x.sub(tmp);
			var xlen = x.length();
			x.normalize();

			if( (4*i)%count==0 && i>0 && this.current!=0){
				this.Ra[ii] = {};
				this.Ra[ii].len=xlen;
				this.Ra[ii].D = x.clone();	//x.multiplyScalar(-xlen/2);
				this.Ra[ii].R = x.clone();	//this.Ra[ii].R.multiplyScalar(this.len*(1+i*4)/8*1.2);
				this.Ra[ii].R.add(tmp);
				ii++;
			}	
		}
	}
	else if(this.type == 'Segment'){
		if(this.current>0){
			this.R0 = new THREE.Vector3(parseFloat(values.X0), parseFloat(values.Y0), parseFloat(values.Z0));
			this.R1 = new THREE.Vector3(parseFloat(values.X1), parseFloat(values.Y1), parseFloat(values.Z1));
		}
		else{
			this.current=Math.abs(this.current);
			this.R1 = new THREE.Vector3(parseFloat(values.X0), parseFloat(values.Y0), parseFloat(values.Z0));
			this.R0 = new THREE.Vector3(parseFloat(values.X1), parseFloat(values.Y1), parseFloat(values.Z1));
		}
		this.n = this.R1.clone();
		this.n.sub(this.R0);
		var len = this.n.length();
		this.n.normalize();

		this.radius = 0;

		for(var i=0; i<2; i++){
			this.Ra[i] = {};
			this.Ra[i].R = this.n.clone();
			this.Ra[i].len = Math.max(len/10,10);
			this.Ra[i].R.multiplyScalar(len*(1+i*4)/8*1.2);
			this.Ra[i].R.add(this.R0);
			this.Ra[i].D = this.n.clone();
		}
		if(this.current>0)
			this.elements[0] = new Elem(this.R1.clone(), this.R0.clone(), this.current);
		else
			this.elements[0] = new Elem(this.R0.clone(), this.R1.clone(), this.current);
	}
	
	this.wireRadius = .5;
	this.mesh = null;
	this.arrows = [];
	this.verts = [];
	this.color='#00FF00';
}

Ring.prototype.returnValues = function(){
	var values = {};
	values.name = this.name;
	values.label = this.label;
	values.current = this.current+"";
	values.radius = this.radius+"";
	values.X0 = this.R0.x+""; 
	values.Y0 = this.R0.y+""; 
	values.Z0 = this.R0.z+"";
	values.X1 = this.R1.x+""; 
	values.Y1 = this.R1.y+""; 
	values.Z1 = this.R1.z+"";
	values.Nx = this.n.x+""; 
	values.Ny = this.n.y+""; 
	values.Nz = this.n.z+""; 
	values.type = this.type;
	return values;
}


Ring.prototype.initialize = function(FlagVelocities){
	var tmp = [];

	for ( var i = 0; i < this.elements.length; i ++ )
		tmp[i]=this.elements[i].R0;
	tmp[this.elements.length] = this.elements[this.elements.length-1].R1;

	var closedSpline = new THREE.CatmullRomCurve3(tmp);
	closedSpline.closed = false;
	
	var extrudeSettings = {
		steps			: this.elements.length,
		bevelEnabled	: false,
		extrudePath		: closedSpline
	};
	var pts = [], count = 30;
	for ( var i = 0; i < count; i ++ ) {
		var a = 2 * i / count * Math.PI;
		pts.push( new THREE.Vector2 ( this.wireRadius*Math.cos(a), this.wireRadius*Math.sin(a) ) );
	}
	var shape = new THREE.Shape( pts );
	var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
	var material = new THREE.MeshLambertMaterial( { color: this.color, wireframe: false } );
	this.mesh = new THREE.Mesh( geometry, material );

	var verts = this.mesh.geometry.vertices;
	for ( var i = 0; i < verts.length; i ++ ){
		this.verts[i] = new THREE.Vector3(verts[i].x, verts[i].y, verts[i].z);
		verts[i].x *= AnimationScale*World.AxisScale[0];
		verts[i].y *= AnimationScale*World.AxisScale[1];
		verts[i].z *= AnimationScale*World.AxisScale[2];
	}
	this.mesh.geometry.verticesNeedUpdate = true;
	scene.add( this.mesh );
	
	for(var i=0;i<this.Ra.length;i++){
		var dir = new THREE.Vector3( AnimationScale*World.AxisScale[0]*this.Ra[i].D.x, AnimationScale*World.AxisScale[1]*this.Ra[i].D.y, AnimationScale*World.AxisScale[2]*this.Ra[i].D.z);
		dir.normalize();

		this.arrows[i] = new THREE.ArrowHelper(dir, new THREE.Vector3(0, 0, 0), AnimationScale*this.Ra[i].len, this.color, AnimationScale*this.Ra[i].len/1.1, AnimationScale*10*this.wireRadius );
		this.arrows[i].position.set( AnimationScale*World.AxisScale[0]*this.Ra[i].R.x, AnimationScale*World.AxisScale[1]*this.Ra[i].R.y, AnimationScale*World.AxisScale[2]*this.Ra[i].R.z);
	//this.arrow.line.material.color.set(this.color);
		this.arrows[i].cone.material.color.set(0xffff00);
		scene.add( this.arrows[i] );
	}
}

Ring.prototype.cleanup = function(){
	scene.remove(this.mesh);

	for(var i=0; i<this.arrows.length; i++)
		scene.remove(this.arrows[i]);
}

Ring.prototype.updateScale = function (){
	var verts = this.mesh.geometry.vertices;
	for ( var i = 0; i < verts.length; i ++ ){
		verts[i].x = this.verts[i].x*AnimationScale*World.AxisScale[0];
		verts[i].y = this.verts[i].y*AnimationScale*World.AxisScale[1];
		verts[i].z = this.verts[i].z*AnimationScale*World.AxisScale[2];
	}
	this.mesh.geometry.verticesNeedUpdate = true;

	for(var i=0; i<this.arrows.length; i++){
		var dir = new THREE.Vector3( AnimationScale*World.AxisScale[0]*this.Ra[i].D.x, AnimationScale*World.AxisScale[1]*this.Ra[i].D.y, AnimationScale*World.AxisScale[2]*this.Ra[i].D.z);
		dir.normalize();

		this.arrows[i].position.x = AnimationScale*World.AxisScale[0]*this.Ra[i].R.x;
		this.arrows[i].position.y = AnimationScale*World.AxisScale[1]*this.Ra[i].R.y;
		this.arrows[i].position.z = AnimationScale*World.AxisScale[2]*this.Ra[i].R.z;
		this.arrows[i].setDirection(dir);
		this.arrows[i].setLength(AnimationScale*this.Ra[i].len, AnimationScale*this.Ra[i].len/1.1, AnimationScale*10*this.wireRadius);
	}
}

Ring.prototype.getB = function(R){
	var tmp = [0.0, 0.0, 0.0];
	var B   = [0.0, 0.0, 0.0];
	for(var i=0; i<this.elements.length; i++){
		B = this.elements[i].B(R);
		for(var j=0; j<3; j++)
			tmp[j] += B[j];
	}
	return tmp;
}

Ring.prototype.getA = function(R){
	var tmp = [0.0, 0.0, 0.0];
	var A   = [0.0, 0.0, 0.0];
	for(var i=0; i<this.elements.length; i++){
		A = this.elements[i].A(R);
		for(var j=0; j<3; j++)
			tmp[j] += A[j];
	}
	return tmp;
}



function Elem(R0, R1, current){
	this.R0 = R0.clone();
	this.R1 = R1.clone();
	this.current = current;

	this.n_  = [0.0, 0.0, 0.0];

	this.R0_ = [this.R0.x, this.R0.y, this.R0.z];
	this.R1_ = [this.R1.x, this.R1.y, this.R1.z];

	var len=0.0;
	for( var i=0; i<3; i++){
		this.n_[i]=this.R1_[i]-this.R0_[i];
		len+=this.n_[i]*this.n_[i];
	}
	len=Math.sqrt(len);
	for(var i=0; i<3; i++)
		this.n_[i]/=len;
}


Elem.prototype.B = function(R){
	var w  = [0.0, 0.0, 0.0];
	var dR0 = [0.0, 0.0, 0.0];
	var dR1 = [0.0, 0.0, 0.0];

	for(var i=0; i<3; i++){
		dR0[i] = this.R0_[i] - R[i];
		dR1[i] = this.R1_[i] - R[i];
	}

	// w = cross(R-R0, n) = cross(-dR0, n)
 	w[0] = dR0[2]*this.n_[1] - dR0[1]*this.n_[2];
	w[1] = dR0[0]*this.n_[2] - dR0[2]*this.n_[0];
	w[2] = dR0[1]*this.n_[0] - dR0[0]*this.n_[1];

	var D = Math.sqrt(w[0]*w[0]+w[1]*w[1]+w[2]*w[2]);
	for(var i=0; i<3; i++)
		w[i] /= D;

	var t0 = Math.sqrt(dR0[0]*dR0[0]+dR0[1]*dR0[1]+dR0[2]*dR0[2]);
	var t1 = Math.sqrt(dR1[0]*dR1[0]+dR1[1]*dR1[1]+dR1[2]*dR1[2]);
	for(var i=0; i<3; i++){
		dR0[i] /= t0;
		dR1[i] /= t1;
	}

	var tmp=0.0;
	for(var i=0; i<3; i++)
		tmp += (dR1[i]-dR0[i])*this.n_[i];

	for(var i=0; i<3; i++)
		w[i] *= Math.abs(this.current)*tmp/D;  //The Current defines the clock-wise or counter clock-wise orientation of the ring. 
											   //Thus the sign of Current is already factored in.
	return w;
}


Elem.prototype.A = function(R){
	var w  = [0.0, 0.0, 0.0];
	var dR0 = [0.0, 0.0, 0.0];
	var dR1 = [0.0, 0.0, 0.0];
	var tmp = 0.0;

	for(var i=0; i<3; i++){
		dR0[i] = this.R0_[i] - R[i];
		dR1[i] = this.R1_[i] - R[i];
	}

	// w = cross(R-R0, n) = cross(-dR0, n)
 	w[0] = dR0[2]*this.n_[1] - dR0[1]*this.n_[2];
	w[1] = dR0[0]*this.n_[2] - dR0[2]*this.n_[0];
	w[2] = dR0[1]*this.n_[0] - dR0[0]*this.n_[1];

	var D = Math.sqrt(w[0]*w[0]+w[1]*w[1]+w[2]*w[2]);


	var t0 = Math.sqrt(dR0[0]*dR0[0]+dR0[1]*dR0[1]+dR0[2]*dR0[2]);
	var t1 = Math.sqrt(dR1[0]*dR1[0]+dR1[1]*dR1[1]+dR1[2]*dR1[2]);
	for(var i=0; i<3; i++){
		dR0[i] /= t0;
		dR1[i] /= t1;
	}

	var cos0 = 0.0;
	var cos1 = 0.0;
	for(var i=0; i<3; i++){
		cos0 += dR0[i]*this.n_[i];
		cos1 += dR1[i]*this.n_[i];
	}

	if(D>1e-3)
		tmp = t1*(1-cos1)/t0/(1-cos0); 
	else
		tmp = t0/t1;
	
	for(var i=0; i<3; i++)
		w[i] = this.n_[i]*Math.abs(this.current)*Math.log(tmp);

	return w;
}








