"use strict";

function Line(values){
	this.R0 = [parseFloat(values.X0), parseFloat(values.Y0), parseFloat(values.Z0)];
	this.R  = [parseFloat(values.X0), parseFloat(values.Y0), parseFloat(values.Z0)];

	this.name = values.name;
	this.label = values.label;
	this.type=values.type;

	this.traceGeo = null;
	this.traceXYZ = null;
	this.tracePos = null;
	this.traceLine = null;

	this.DisplayStep = 0;
	this.MAX_POINTS = 200000;
	if(this.type == 'A')
		this.MAX_POINTS = 50000;
	this.stop = 0;

	this.tolerance = parseFloat(values.tolerance);
	this.interval = parseFloat(values.interval);
	this.nsegments = parseFloat(values.nsegments);
	this.hmax = parseFloat(values.interval)/100;
	this.t = 0;
	this.ti = 0;
	this.h = this.hmax;

	this.Ra = [];
	this.arrows = [];
	this.radius = .5;
	this.ds = this.interval/10;

	this.color=values.color;
	this.showlabel=values.showlabel;
	this.textLabels = [];
	this.tmp = null;

	this.by = [5179/57600, 0, 7571/16695, 393/640, -92097/339200, 187/2100, 1/40];
	this.bz = [    35/384, 0,   500/1113, 125/192,    -2187/6784,    11/84,    0];

	this.A=[[ 0,           0,          0,           0,        0,          0,     0],
    	   [ 1/5,         0,          0,           0,        0,          0,     0],
    	   [ 3/40,        9/40,       0,           0,        0,          0,     0],
    	   [ 44/45,      -56/15,      32/9,        0,        0,          0,     0],
    	   [ 19372/6561, -25360/2187, 64448/6561, -212/729,  0,          0,     0],
    	   [ 9017/3168,  -355/33,     46732/5247,  49/176,  -5103/18656, 0,     0],
    	   [ 35/384,      0,          500/1113,    125/192, -2187/6784,  11/84, 0]];



	this.c = [0, 1/5, 3/10, 4/5, 8/9, 1, 1];
}

Line.prototype.returnValues = function(){
	var values={};
	values.name = this.name;
	values.label = this.label;
	values.type = this.type;
	values.color = this.color;
	values.X0 = this.R0[0]+""; 
	values.Y0 = this.R0[1]+""; 
	values.Z0 = this.R0[2]+"";
	values.tolerance = this.tolerance+""; 
	values.nsegments = this.nsegments+""; 
	values.interval = this.interval+""; 
	values.showlabel = this.showlabel;

	return values;
}

Line.prototype.initialize = function(){

	for (var i=0; i<3; i++)
		this.R[i] = this.R0[i];

	//var dir = new THREE.Vector3( AnimationScale*World.AxisScale[0]*this.V[0], AnimationScale*World.AxisScale[1]*this.V[1], AnimationScale*World.AxisScale[2]*this.V[2]);
	//var VelLen = Math.sqrt(this.V[0]*this.V[0] + this.V[1]*this.V[1]+ this.V[2]*this.V[2]);
	//dir.normalize();
	//this.arrow = new THREE.ArrowHelper( new THREE.Vector3( 0, 0, 0 ), dir, Math.max(VelLen, 0.001) );
	//this.arrow.position.set( AnimationScale*World.AxisScale[0]*this.R[0], AnimationScale*World.AxisScale[1]*this.R[1], AnimationScale*World.AxisScale[2]*this.R[2]);
	//this.arrow.line.material.color.set(this.color);
	//this.arrow.cone.material.color.set(this.color);

	this.traceGeo = new THREE.BufferGeometry();
	this.traceXYZ = new Float32Array( this.MAX_POINTS * 3 ); // 3 vertices per point
	this.tracePos = new Float32Array( this.MAX_POINTS * 3 ); // 3 vertices per point					
	this.traceGeo.addAttribute('position', new THREE.BufferAttribute(this.tracePos, 3));
    var lineMaterial = new THREE.LineBasicMaterial({color:this.color});  
	this.traceLine = new THREE.Line(this.traceGeo, lineMaterial);

	for (var i=0; i<3; i++)
		this.traceXYZ[i] = this.R[i];
	this.traceLine.geometry.setDrawRange(0, 1);
	this.traceLine.geometry.dynamic = true;
    
    var positions = this.traceLine.geometry.attributes.position.array;
    for (var i=0; i<3; i++)
        positions[i]=AnimationScale*World.AxisScale[i]*this.traceXYZ[i];
    this.DisplayStep = 1;

    // required after the first render
	this.traceLine.geometry.attributes.position.needsUpdate = true; 
	this.traceLine.frustumCulled = false;
	scene.add(this.traceLine);
}

Line.prototype.cleanup = function(){
	for (var ii =  0; ii < views.length; ii++ ){
		if(this.textLabels[ii] != null){
			document.body.removeChild(this.textLabels[ii].element);
			this.textLabels.splice(ii,1);
		}
	}
	for(var i=this.arrows.length-1; i>=0; i--){
		scene.remove( this.arrows[i] );
		this.Ra.splice(i,1);
		this.arrows.splice(i,1);
	}
	scene.remove(this.traceLine);
}

Line.prototype.addLabel = function(){
	if(this.arrows.length>0)
	for (var ii =  0; ii < views.length; ii++ ) {
		var ptext = new createTextLabel(document);
		ptext.setHTML(this.label);
		ptext.setParent(this.arrows[this.ti-1], views[ii].camera, 1/views.length, ii, this.showlabel);
		document.body.appendChild(ptext.element);
		this.textLabels.push(ptext);
	}
}

Line.prototype.draw = function(){
		if((this.stop == 0)&&(this.t%this.interval==0)&&(this.t>0)){
			this.tmp = new THREE.Vector3(this.R[0], this.R[1], this.R[2]);
			this.ds = 1;
		}

		this.step_dprk(this.t, this.t+this.ds);
		this.t+=this.ds;

		if((this.stop == 0)&&((this.t-3)%this.interval==0)){
			this.Ra[this.ti] = {};
			this.Ra[this.ti].R = new THREE.Vector3(this.tmp.x, this.tmp.y, this.tmp.z);	
			this.Ra[this.ti].D = new THREE.Vector3(this.R[0], this.R[1], this.R[2]);
			this.Ra[this.ti].D.sub(this.Ra[this.ti].R);
			this.Ra[this.ti].len = this.Ra[this.ti].D.length();

			var dir = new THREE.Vector3( AnimationScale*World.AxisScale[0]*this.Ra[this.ti].D.x, AnimationScale*World.AxisScale[1]*this.Ra[this.ti].D.y, AnimationScale*World.AxisScale[2]*this.Ra[this.ti].D.z);
			dir.normalize();

			this.arrows[this.ti] = new THREE.ArrowHelper(dir, new THREE.Vector3(0, 0, 0), AnimationScale*this.Ra[this.ti].len*1.5, this.color, AnimationScale*this.Ra[this.ti].len, AnimationScale*5*this.radius );
			this.arrows[this.ti].position.set( AnimationScale*World.AxisScale[0]*this.Ra[this.ti].R.x, AnimationScale*World.AxisScale[1]*this.Ra[this.ti].R.y, AnimationScale*World.AxisScale[2]*this.Ra[this.ti].R.z);
	//this.arrow.line.material.color.set(this.color);

			this.arrows[this.ti].cone.material.color.set(this.color);
			scene.add( this.arrows[this.ti] );
			this.ti++;

			if(this.ti==this.nsegments){
				this.stop = 2;
				this.addLabel();
			}

			this.step_dprk(this.t, this.t+this.interval/10-3);
			this.t+=this.interval/10-3;

			this.ds = this.interval/10;
		}
}



Line.prototype.step_dprk = function(t0, t1){


	var t_out=t0;

	var i,m,l,k=1; 
	var FF=[0.0, 0.0, 0.0];
	var xs=[0.0, 0.0, 0.0];
	var ts = 0.0;
	var y_tmp=[0.0, 0.0, 0.0], z_tmp=[0.0, 0.0, 0.0];
	var flag = 0, error = 0.0, delta = 0.0;
	
	this.h=this.hmax;

	while ((k<this.MAX_POINTS)&&(t_out < t1)&&(this.stop==0)) {

		this.K=[[ 0, 0, 0, 0, 0, 0, 0],
		   [ 0, 0, 0, 0, 0, 0, 0],				
		   [ 0, 0, 0, 0, 0, 0, 0]];

		for(m=0; m<7; m++){
			ts = t_out+this.h*this.c[m];

			for(i=0; i<3; i++){
				xs[i] = this.R[i];
				for(l=0; l<7; l++)
					xs[i]+=this.h*this.c[m]*this.K[i][l]*this.A[m][l];
			}
		
    		FF=this.getForce(xs);
    		for(i=0; i<3; i++)
    			this.K[i][m]=FF[i];
    	}
    
    	for(i=0; i<3; i++){
    		y_tmp[i] = this.R[i];
    		z_tmp[i] = this.R[i];
    		for(m=0; m<7; m++){
    			y_tmp[i] += this.h*this.K[i][m]*this.by[m];
    			z_tmp[i] += this.h*this.K[i][m]*this.bz[m];
    		}
		}
		error=0.0;
		for(i=0; i<3; i++)
    	   error+=(y_tmp[i]-z_tmp[i])*(y_tmp[i]-z_tmp[i]);
    	error=Math.sqrt(error);

    	//var n = Math.sqrt(FF[0]*FF[0]+FF[1]*FF[1]+FF[2]*FF[2]);
		//if(n>1e+12)
		//	this.stop = 1;
    
    	delta = 0.84 * Math.pow(this.tolerance/error,0.2); flag=0;
    	
    	if (error < this.tolerance){
        	t_out += this.h;
        	for(var i=0; i<3; i++)
        		this.R[i] = y_tmp[i];
        	this.updateTrace();
        	flag=1;
    	}
    
  		if (delta <= 0.1)
        	this.h = this.h * 0.1;
    	else if (delta >= 4 )
        	this.h = this.h * 4;
    	else
        	this.h = delta * this.h;

        if(this.h < this.hmax*1e-6)
        	this.stop = 2;
    
    	if(flag >0){
        	if (this.h > this.hmax)
        		 this.h = this.hmax;
        
        	error=0.0;
			for(i=0; i<3; i++)
    	   		error+=(this.R[i]-this.R0[i])*(this.R[i]-this.R0[i]);
    		error=Math.sqrt(error);
			if((error<2*this.hmax)&&(t_out>this.hmax*2))
    	   		this.h = Math.min(this.hmax/10, this.h);

        	if((error <= 0.1*this.hmax)&&(t_out>this.hmax)){
            	this.stop = 1;
            	this.updateTrace();
            	this.addLabel();
            	//alert('closed @ t='+t_out);
        	}
        	
        	if(t_out + this.h > t1)
            	this.h = t1 - t_out;
        
        	k=k+1;
    	}
	}
	//alert("k="+k+" t_out"+t_out);
}

Line.prototype.updateTrace = function (){
	if(this.stop == 2)
		return;

	if(this.stop == 1)
		for (var i=0; i<3; i++)
			this.R[i] = this.R0[i];

	if(this.DisplayStep<this.MAX_POINTS)
		for (var i=0; i<3; i++){
			this.traceXYZ[this.DisplayStep*3+i] = this.R[i];
			this.traceLine.geometry.attributes.position.array[this.DisplayStep*3+i]=AnimationScale*World.AxisScale[i]*this.R[i];
		}
	this.DisplayStep++;
	if((this.DisplayStep>this.MAX_POINTS)||(this.stop == 1)) this.stop=2;

	//this.arrow.position.x = AnimationScale*World.AxisScale[0]*this.R[0];
	//this.arrow.position.y = AnimationScale*World.AxisScale[1]*this.R[1];
	//this.arrow.position.z = AnimationScale*World.AxisScale[2]*this.R[2];

	//var dir = new THREE.Vector3( AnimationScale*World.AxisScale[0]*this.V[0], AnimationScale*World.AxisScale[1]*this.V[1], AnimationScale*World.AxisScale[2]*this.V[2]);
	//var VelLen = Math.sqrt(this.V[0]*this.V[0] + this.V[1]*this.V[1]+ this.V[2]*this.V[2]);
	//dir.normalize();
	//this.arrow.setDirection(dir);
	//this.arrow.setLength(World.VelocityScale*Math.max(VelLen,0.001));
	       										
	this.traceLine.geometry.setDrawRange( 0, Math.min(this.DisplayStep,this.MAX_POINTS) );
	this.traceLine.geometry.dynamic = true;
	this.traceLine.geometry.attributes.position.needsUpdate = true; 
	this.traceLine.frustumCulled = false;
}

Line.prototype.updateScale = function (){
	for (var i = 0; i < Math.min(this.DisplayStep,this.MAX_POINTS); i++)
		for (var j=0; j<3; j++)
			this.traceLine.geometry.attributes.position.array[i*3+j]=AnimationScale*World.AxisScale[j]*this.traceXYZ[i*3+j];
	this.traceLine.geometry.setDrawRange( 0, Math.min(this.DisplayStep,this.MAX_POINTS) );
	this.traceLine.geometry.dynamic = true;
	this.traceLine.geometry.attributes.position.needsUpdate = true; 
	this.traceLine.frustumCulled = false;

	for(var i=0; i<this.arrows.length; i++){
		var dir = new THREE.Vector3( AnimationScale*World.AxisScale[0]*this.Ra[i].D.x, AnimationScale*World.AxisScale[1]*this.Ra[i].D.y, AnimationScale*World.AxisScale[2]*this.Ra[i].D.z);
		dir.normalize();

		this.arrows[i].position.x = AnimationScale*World.AxisScale[0]*this.Ra[i].R.x;
		this.arrows[i].position.y = AnimationScale*World.AxisScale[1]*this.Ra[i].R.y;
		this.arrows[i].position.z = AnimationScale*World.AxisScale[2]*this.Ra[i].R.z;
		this.arrows[i].setDirection(dir);
		this.arrows[i].setLength(AnimationScale*this.Ra[i].len*1.5, AnimationScale*this.Ra[i].len, AnimationScale*5*this.radius);
	}
}

Line.prototype.getForce = function(R){
	var F   = [0.0, 0.0, 0.0];
	var tmp = [0.0, 0.0, 0.0];

	if(this.type == 'B')
		for (var i=0; i<listRings.length; i++){
			tmp = listRings[i].getB(R);
			for(var j=0; j<3; j++)
				F[j] += tmp[j];
		}
	if(this.type == 'A')
		for (var i=0; i<listRings.length; i++){
			tmp = listRings[i].getA(R);
			for(var j=0; j<3; j++)
				F[j] += tmp[j];
		}

	tmp = [0.0, 0.0, 0.0];
	for (var i = 0; i<fields.length; i++)
		if(fields[i].type == this.type){
			if(!fields[i].numeric)	fields[i].updateValues(R, tmp, 0.0);
			for(var j=0; j<3; j++)
				F[j] += fields[i].F[j];
		}

	if(this.type == 'E')
		for (var i = 0; i<ListParticles.length; i++)
			if(ListParticles[i].type == 'P'){
				var DELTA_R = 0.0;
				for (var j=0; j<3; j++)
					DELTA_R += (R[j]-ListParticles[i].R[j])*(R[j]-ListParticles[i].R[j]);
				DELTA_R = Math.sqrt(DELTA_R);

				for (var j=0; j<3; j++)
					F[j] += (R[j]-ListParticles[i].R[j])*ListParticles[i].Q/(DELTA_R*DELTA_R*DELTA_R);

				if((DELTA_R<ListParticles[i].radius)&&(ListParticles[i].Q<0)){
					this.updateTrace();
            		this.addLabel();
					this.stop = 2;
				}
			}
	

	var n = Math.sqrt(F[0]*F[0]+F[1]*F[1]+F[2]*F[2]);
	n = Math.max(n, 1e-12);	
	if(n>1e10) this.stop = 2;

	for(var i=0; i<3; i++)
		F[i] /= n;
	
	return F;	
}

Line.prototype.restart = function(){
	for (var i=0; i<3; i++){
		this.R[i] = this.R0[i];
		this.traceXYZ[i] = this.R[i];
	}
	this.DisplayStep = 1;
	this.stop = 0;
	this.t = 0;
	this.ti = 0;

	for (var j=0; j<3; j++)
		this.traceLine.geometry.attributes.position.array[j]=AnimationScale*World.AxisScale[j]*this.traceXYZ[j];
	this.traceLine.geometry.setDrawRange( 0, 1);
	this.traceLine.geometry.dynamic = true;
	this.traceLine.geometry.attributes.position.needsUpdate = true; 
	this.traceLine.frustumCulled = false;

	for(var i=this.arrows.length-1; i>=0; i--){
		scene.remove( this.arrows[i] );
		this.Ra.splice(i,1);
		this.arrows.splice(i,1);
	}
	for (var ii =  0; ii < this.textLabels.length; ii++ ){
		document.body.removeChild(this.textLabels[ii].element);
		this.textLabels.splice(ii,1);
	}
}

Line.prototype.display = function(value){
	this.traceLine.visible = value;
	for(var i=this.arrows.length-1; i>=0; i--){
		this.arrows[i].visible = value;
	}
	for (var ii =  0; ii < this.textLabels.length; ii++ )
		if(value)
			this.textLabels[ii].element.style.visibility = "visible";			
		else
			this.textLabels[ii].element.style.visibility = "hidden";
}
