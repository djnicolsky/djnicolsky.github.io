"use strict";

var filterFloat = function(value) {
    if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
      .test(value))
      return Number(value);
  return NaN;
}

function Field(values){
	this.values = values;

	this.name = values.name;
	this.type = values.type;
	this.crd  = values.crd;

	this.F = [0.0, 0.0, 0.0];
	this.S = [0.0, 0.0, 0.0];

	this.numeric = false;
	this.F1  = values.F1; 
	this.F2  = values.F2; 
	this.F3  = values.F3;

	if(this.crd == "C") //Cartesian
		if((!isNaN(filterFloat(values.F1)))&&(!isNaN(filterFloat(values.F2)))&&(!isNaN(filterFloat(values.F3)))) {
			this.numeric = true;
			this.F[0] = parseFloat(values.F1);
			this.F[1] = parseFloat(values.F2);
			this.F[2] = parseFloat(values.F3);
		}

	if(this.F1 == '') {this.F1 = '0'; this.values.F1 ='0'; this.numeric = false;}
    this.f1 = new Function('T', 'r', 'v', 'X', 'Y', 'Z', 'Vx', 'Vy', 'Vz', 'return '+convert(this.F1)+';');
	if(this.F2 == '') {this.F2 = '0'; this.values.F2 ='0'; this.numeric = false;}
    this.f2 = new Function('T', 'r', 'v', 'X', 'Y', 'Z', 'Vx', 'Vy', 'Vz', 'return '+convert(this.F2)+';');
	if(this.F3 == '') {this.F3 = '0'; this.values.F3 ='0'; this.numeric = false;}
    this.f3 = new Function('T', 'r', 'v', 'X', 'Y', 'Z', 'Vx', 'Vy', 'Vz', 'return '+convert(this.F3)+';');
	
	this.S[0]  = parseFloat(values.S1); 
	this.S[1]  = parseFloat(values.S2); 
	this.S[2]  = parseFloat(values.S3); 

	this.mR  = [0.0, 0.0, 0.0];
	this.toBeRemoved = 0;
}

Field.prototype.returnValues = function(){
	values.name = this.name;
	values.type = this.type;
	values.crd = this.crd;
	values.F1 = this.F1+""; 
	values.F2 = this.F2+""; 
	values.F3 = this.F3+"";
	values.S1 = this.S[0]+""; 
	values.S2 = this.S[1]+""; 
	values.S3 = this.S[2]+""; 

	return values;
}

Field.prototype.updateParameters = function(values){
	this.values = values;

	this.name = values.name;
	this.type = values.type;
	this.crd  = values.crd;

	this.numeric = false;
	this.F1  = convert(values.F1); 
	this.F2  = convert(values.F2); 
	this.F3  = convert(values.F3);

	if(this.crd == "C") //Cartesian
		if((!isNaN(filterFloat(values.F1)))&&(!isNaN(filterFloat(values.F2)))&&(!isNaN(filterFloat(values.F3)))) {
			this.numeric = true;
			this.F[0] = parseFloat(values.F1);
			this.F[1] = parseFloat(values.F2);
			this.F[2] = parseFloat(values.F3);
		}

	if(this.F1 == '') {this.F1 = '0'; this.values.F1 ='0'; this.numeric = false;}
    this.f1 = new Function('T', 'r', 'v', 'X', 'Y', 'Z', 'Vx', 'Vy', 'Vz', 'return '+this.F1+';');
	if(this.F2 == '') {this.F2 = '0'; this.values.F2 ='0'; this.numeric = false;}
    this.f2 = new Function('T', 'r', 'v', 'X', 'Y', 'Z', 'Vx', 'Vy', 'Vz', 'return '+this.F2+';');
	if(this.F3 == '') {this.F3 = '0'; this.values.F3 ='0'; this.numeric = false;}
    this.f3 = new Function('T', 'r', 'v', 'X', 'Y', 'Z', 'Vx', 'Vy', 'Vz', 'return '+this.F3+';');
	
	this.S[0]  = parseFloat(values.S1); 
	this.S[1]  = parseFloat(values.S2); 
	this.S[2]  = parseFloat(values.S3); 
}

function iaField(f, R, V, t){
	var r = Math.sqrt(R[0]*R[0]+R[1]*R[1]+R[2]*R[2]);
	var v = Math.sqrt(V[0]*V[0]+V[1]*V[1]+V[2]*V[2]);

	return f(t, r, v, R[0], R[1], R[2], V[0], V[1], V[2]);
}

Field.prototype.updateValues = function(TR, TV, time){
	if(this.crd == 'S')	{
		this.mR[0] = TR[0] - this.S[0]*Math.sin(this.S[1])*Math.cos(this.S[2]);
		this.mR[1] = TR[1] - this.S[0]*Math.sin(this.S[1])*Math.sin(this.S[2]);
		this.mR[2] = TR[2] - this.S[0]*Math.cos(this.S[1]);
	}
	else
		for(var i=0;i<3;i++)
			this.mR[i] = TR[i]- this.S[i];

	if(this.crd == 'C'){
		//this.F[0] = fPIN(this.F1, this.mR, TV, time);
		//this.F[1] = fPIN(this.F2, this.mR, TV, time);
		//this.F[2] = fPIN(this.F3, this.mR, TV, time);
		this.F[0] = iaField(this.f1, this.mR, TV, time);
		this.F[1] = iaField(this.f2, this.mR, TV, time);
		this.F[2] = iaField(this.f3, this.mR, TV, time);
	}
	else{
		var r = Math.sqrt(this.mR[0]*this.mR[0]+this.mR[1]*this.mR[1]+this.mR[2]*this.mR[2]);
		//var val = fPIN(this.F1, this.mR, TV, time);
		var val = iaField(this.f1, this.mR, TV, time);
		for(var i=0;i<3;i++)
			this.F[i]=val*this.mR[i]/r;
	}
}
