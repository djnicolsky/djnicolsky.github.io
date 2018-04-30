var listRings = [];
var listLines = [];
var listSLines = [];
var listDLines = [];
var listBLines = [];

var NWW = parseInt(ModelSetup('GLOBAL','Wires',ModelStreams));
for(var i=0; i<NWW; i++){
	var values={};
	values.name = ModelSetup('Wire'+i,'Name',ModelStreams);
	values.label = values.name;  
	values.type = 'Segment';
	values.X0 = ModelSetup('Wire'+i,'X0',ModelStreams);
	values.Y0 = ModelSetup('Wire'+i,'Y0',ModelStreams); 
	values.Z0 = ModelSetup('Wire'+i,'Z0',ModelStreams);
	values.X1 = ModelSetup('Wire'+i,'X1',ModelStreams);  
	values.Y1 = ModelSetup('Wire'+i,'Y1',ModelStreams); 
	values.Z1 = ModelSetup('Wire'+i,'Z1',ModelStreams);
	values.current = ModelSetup('Wire'+i,'Current',ModelStreams);
	values.Nx = 1;   values.Ny = 0;   values.Nz = 0; 	values.radius = 0;

	listRings.push(new Ring(values));
}

var NRR = parseInt(ModelSetup('GLOBAL','Rings',ModelStreams));
for(var i=0; i<NRR; i++){
	var values={};
	values.name = ModelSetup('Ring'+i,'Name',ModelStreams);
	values.label = values.name;
	values.type = 'Ring';
	values.X0 = ModelSetup('Ring'+i,'X0',ModelStreams);
	values.Y0 = ModelSetup('Ring'+i,'Y0',ModelStreams); 
	values.Z0 = ModelSetup('Ring'+i,'Z0',ModelStreams);
	values.Nx = ModelSetup('Ring'+i,'Nx',ModelStreams);  
	values.Ny = ModelSetup('Ring'+i,'Ny',ModelStreams); 
	values.Nz = ModelSetup('Ring'+i,'Nz',ModelStreams);
	values.current = ModelSetup('Ring'+i,'Current',ModelStreams);	
	values.radius = ModelSetup('Ring'+i,'Radius',ModelStreams);

	listRings.push(new Ring(values));
}

var NLL = parseInt(ModelSetup('GLOBAL','Lines',ModelStreams));
for(var i=0; i<NLL; i++){
	var values={};
	values.name = ModelSetup('Line'+i,'Name',ModelStreams);
	values.label = values.name;
	values.type = ModelSetup('Line'+i,'Type',ModelStreams);
	values.X0 = ModelSetup('Line'+i,'X0',ModelStreams);
	values.Y0 = ModelSetup('Line'+i,'Y0',ModelStreams); 
	values.Z0 = ModelSetup('Line'+i,'Z0',ModelStreams);
	values.tolerance = ModelSetup('Line'+i,'Tolerance',ModelStreams); 
	values.interval = ModelSetup('Line'+i,'Inverval',ModelStreams); 
	values.nsegments = ModelSetup('Line'+i,'NSegments',ModelStreams); 

	var pcolor = ModelSetup('Line'+i,'Color',ModelStreams);
	var prgb = pcolor.split(",");
	values.color = '#'+ (0x100 | parseInt(prgb[0])).toString(16).substr(1) +
					    (0x100 | parseInt(prgb[1])).toString(16).substr(1) +
					    (0x100 | parseInt(prgb[2])).toString(16).substr(1);

	var ptrace = ModelSetup('Line'+i,'ShowLabel',ModelStreams);
	if(ptrace == '-')
		values.showlabel="N";
	else
		values.showlabel="Y";

	listLines.push(new Line(values));
}


var NSS = parseInt(ModelSetup('GLOBAL','Segments',ModelStreams));
for(var i=0; i<NSS; i++){
	var values={};
	values.name = ModelSetup('Segment'+i,'Name',ModelStreams);
	values.label = values.name;
	values.type = ModelSetup('Segment'+i,'Type',ModelStreams);
	values.X0 = ModelSetup('Segment'+i,'X0',ModelStreams);
	values.Y0 = ModelSetup('Segment'+i,'Y0',ModelStreams); 
	values.Z0 = ModelSetup('Segment'+i,'Z0',ModelStreams);
	values.X1 = ModelSetup('Segment'+i,'X1',ModelStreams);
	values.Y1 = ModelSetup('Segment'+i,'Y1',ModelStreams); 
	values.Z1 = ModelSetup('Segment'+i,'Z1',ModelStreams);
	values.NL = ModelSetup('Segment'+i,'NOLines',ModelStreams);	
	values.tolerance = ModelSetup('Segment'+i,'Tolerance',ModelStreams); 
	values.interval = ModelSetup('Segment'+i,'Inverval',ModelStreams); 
	values.nsegments = ModelSetup('Segment'+i,'NSegments',ModelStreams); 

	var pcolor = ModelSetup('Segment'+i,'Color',ModelStreams);
	var prgb = pcolor.split(",");
	values.color = '#'+ (0x100 | parseInt(prgb[0])).toString(16).substr(1) +
					    (0x100 | parseInt(prgb[1])).toString(16).substr(1) +
					    (0x100 | parseInt(prgb[2])).toString(16).substr(1);

	var ptrace = ModelSetup('Segment'+i,'ShowLabel',ModelStreams);
	if(ptrace == '-')
		values.showlabel="N";
	else
		values.showlabel="Y";

	listSLines.push(values);
	addNewSLines(values, false);
}

var NDD = parseInt(ModelSetup('GLOBAL','Disks',ModelStreams));
for(var i=0; i<NDD; i++){
	var values={};
	values.name = ModelSetup('Disk'+i,'Name',ModelStreams);
	values.label = values.name;
	values.type = ModelSetup('Disk'+i,'Type',ModelStreams);
	values.X0 = ModelSetup('Disk'+i,'X0',ModelStreams);
	values.Y0 = ModelSetup('Disk'+i,'Y0',ModelStreams); 
	values.Z0 = ModelSetup('Disk'+i,'Z0',ModelStreams);
	values.Nx = ModelSetup('Disk'+i,'Nx',ModelStreams);
	values.Ny = ModelSetup('Disk'+i,'Ny',ModelStreams); 
	values.Nz = ModelSetup('Disk'+i,'Nz',ModelStreams);
	values.R = ModelSetup('Disk'+i,'Radius',ModelStreams);	
	values.NL = ModelSetup('Disk'+i,'NOLines',ModelStreams);	
	values.NA = ModelSetup('Disk'+i,'NOAngles',ModelStreams);		
	values.tolerance = ModelSetup('Disk'+i,'Tolerance',ModelStreams); 
	values.interval = ModelSetup('Disk'+i,'Inverval',ModelStreams); 
	values.nsegments = ModelSetup('Disk'+i,'NSegments',ModelStreams); 

	var pcolor = ModelSetup('Disk'+i,'Color',ModelStreams);
	var prgb = pcolor.split(",");
	values.color = '#'+ (0x100 | parseInt(prgb[0])).toString(16).substr(1) +
					    (0x100 | parseInt(prgb[1])).toString(16).substr(1) +
					    (0x100 | parseInt(prgb[2])).toString(16).substr(1);

	var ptrace = ModelSetup('Disk'+i,'ShowLabel',ModelStreams);
	if(ptrace == '-')
		values.showlabel="N";
	else
		values.showlabel="Y";

	listDLines.push(values);
	addNewDLines(values, false);
}

var NBB = parseInt(ModelSetup('GLOBAL','Balls',ModelStreams));
for(var i=0; i<NBB; i++){
	var values={};
	values.name = ModelSetup('Ball'+i,'Name',ModelStreams);
	values.label = values.name;
	values.type = ModelSetup('Ball'+i,'Type',ModelStreams);
	values.X0 = ModelSetup('Ball'+i,'X0',ModelStreams);
	values.Y0 = ModelSetup('Ball'+i,'Y0',ModelStreams); 
	values.Z0 = ModelSetup('Ball'+i,'Z0',ModelStreams);
	values.R = ModelSetup('Ball'+i,'Radius',ModelStreams);	
	values.NL = ModelSetup('Ball'+i,'NOLines',ModelStreams);		
	values.tolerance = ModelSetup('Ball'+i,'Tolerance',ModelStreams); 
	values.interval = ModelSetup('Ball'+i,'Inverval',ModelStreams); 
	values.nsegments = ModelSetup('Ball'+i,'NSegments',ModelStreams); 

	var pcolor = ModelSetup('Ball'+i,'Color',ModelStreams);
	var prgb = pcolor.split(",");
	values.color = '#'+ (0x100 | parseInt(prgb[0])).toString(16).substr(1) +
					    (0x100 | parseInt(prgb[1])).toString(16).substr(1) +
					    (0x100 | parseInt(prgb[2])).toString(16).substr(1);

	var ptrace = ModelSetup('Ball'+i,'ShowLabel',ModelStreams);
	if(ptrace == '-')
		values.showlabel="N";
	else
		values.showlabel="Y";

	listBLines.push(values);
	addNewBLines(values, false);
}


function addNewSLines(values, initialize){
	if(values.NL == 1){
		var v={};
		v.name = 'SLine'; v.label = values.name; v.color = values.color; v.type  = values.type;
		v.X0 = (parseFloat(values.X0)+parseFloat(values.X1))/2; 
		v.Y0 = (parseFloat(values.Y0)+parseFloat(values.Y1))/2; 
		v.Z0 = (parseFloat(values.Z0)+parseFloat(values.Z1))/2; 

		v.tolerance = values.tolerance; v.interval = values.interval; 
		v.nsegments = values.nsegments; v.showlabel = values.showlabel;
		addNewLine(v, initialize);
	}
	else
		for(var i = 0; i < values.NL; i++){
			var v={};
			v.name = 'SLine'; v.label = values.name; v.color = values.color; v.type  = values.type;
			v.X0 = parseFloat(values.X0)+ (parseFloat(values.X1)-parseFloat(values.X0))/(parseFloat(values.NL)-1)*i; 
			v.Y0 = parseFloat(values.Y0)+ (parseFloat(values.Y1)-parseFloat(values.Y0))/(parseFloat(values.NL)-1)*i; 
			v.Z0 = parseFloat(values.Z0)+ (parseFloat(values.Z1)-parseFloat(values.Z0))/(parseFloat(values.NL)-1)*i; 

			v.tolerance = values.tolerance; v.interval = values.interval; 
			v.nsegments = values.nsegments; v.showlabel = values.showlabel;
			addNewLine(v, initialize);
		}
}

function addNewDLines(values, initialize){
	var n = [parseFloat(values.Nx), parseFloat(values.Ny), parseFloat(values.Nz)];
    var bn = [], bm = [];
	var n_ = Math.sqrt(n[0]*n[0]+n[1]*n[1]+n[2]*n[2]);
	n[0] /= n_; n[1] /= n_; n[2] /= n_;

	if(Math.abs(n[0])>0){
		bn[0]=-(n[2]+n[1])/n[0]; bn[1]=1; bn[2]=1;
	}
	else if(Math.abs(n[1])>0){
		bn[1]=-(n[2]+n[0])/n[1]; bn[0]=1; bn[2]=1;
	}
	else if(Math.abs(n[2])>0){
		bn[2]=-(n[1]+n[0])/n[2]; bn[0]=1; bn[1]=1;
	}
	var bn_ = Math.sqrt(bn[0]*bn[0]+bn[1]*bn[1]+bn[2]*bn[2]);
	bn[0] /= bn_; bn[1] /= bn_; bn[2] /= bn_;

	bm[0] = (bn[1]*n[2]-bn[2]*n[1]);
	bm[1] = (bn[2]*n[0]-bn[0]*n[2]);
	bm[2] = (bn[0]*n[1]-bn[1]*n[0]);
  
	var count = parseInt(values.NA);
	for(var k = 0; k < parseInt(values.NL); k++)
		for(var i = 0; i < count; i +=1 ) {
		//for(var i = 1; i==1; i +=2 ) {
			a = 2 * i / count * Math.PI + k*Math.PI/parseInt(values.NL);
		
   			var v={};
			v.name = 'DLine'; v.label = values.name; v.color = values.color; v.type  = values.type;
			v.X0 = (bn[0]*Math.cos(a)+bm[0]*Math.sin(a))*parseFloat(values.R)*(k+1)/parseInt(values.NL)+parseFloat(values.X0);
			v.Y0 = (bn[1]*Math.cos(a)+bm[1]*Math.sin(a))*parseFloat(values.R)*(k+1)/parseInt(values.NL)+parseFloat(values.Y0);
			v.Z0 = (bn[2]*Math.cos(a)+bm[2]*Math.sin(a))*parseFloat(values.R)*(k+1)/parseInt(values.NL)+parseFloat(values.Z0);
			
			v.tolerance = values.tolerance; v.interval = values.interval; 
			v.nsegments = values.nsegments; v.showlabel = values.showlabel;

			addNewLine(v, initialize);
   		}
}


function addNewBLines(values, initialize){
	  
	var count = 0;
	for(var k = 1; k < 2*parseInt(values.NL); k++)
		for(var i = 0; i <= 4*parseInt(values.NL); i +=1 ) {
			a = 2 * Math.PI / (4*parseInt(values.NL)) * i;
			b = (-1/2 + k/(2*parseInt(values.NL)))*Math.PI;
		
   			var v={};
			v.name = 'BLine'; v.label = values.name; v.color = values.color; v.type  = values.type;
			v.X0 = parseFloat(values.R)*Math.cos(a)*Math.cos(b)+parseFloat(values.X0);
			v.Y0 = parseFloat(values.R)*Math.sin(a)*Math.cos(b)+parseFloat(values.Y0);
			v.Z0 = parseFloat(values.R)*Math.sin(b)+parseFloat(values.Z0);
			
			v.tolerance = values.tolerance; v.interval = values.interval; 
			v.nsegments = values.nsegments; v.showlabel = values.showlabel;

			addNewLine(v, initialize);
   		}
   	for(var k = -1; k < 2; k+=2){ //add lines coming from the top and bottom
   		var v={};
		v.name = 'BLine'; v.label = values.name; v.color = values.color; v.type  = values.type;
		v.X0 = parseFloat(values.X0);
		v.Y0 = parseFloat(values.Y0);
		v.Z0 = parseFloat(values.R)*k+parseFloat(values.Z0);
			
		v.tolerance = values.tolerance; v.interval = values.interval; 
		v.nsegments = values.nsegments; v.showlabel = values.showlabel;

		addNewLine(v, initialize);
	}

}

function addNewRing(values){
    var R = new Ring(values);
   	R.initialize();
   	listRings.push(R);
}

function cleanupRing(r){
	listRings[r].cleanup();
}

function cleanupLine(r){
	listLines[r].cleanup();
}

function addNewLine(values,initialize){
    var L = new Line(values);
    if(initialize) 	L.initialize();
   	listLines.push(L);
}

function restartLines(){
	for(var i=0;i<listLines.length;i++){
		//listLines[i].cleanup();
		listLines[i].restart();
		//listLines[i].t=0;
		//listLines[i].DisplayStep = 1;
		//listLines[i].stop = 0;
		//listLines[i].ti = 0;
	}
}
