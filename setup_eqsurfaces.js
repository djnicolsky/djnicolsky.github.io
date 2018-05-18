var listSurfaces = [];


var NES = parseInt(ModelSetup('GLOBAL','Surfaces',ModelStreams));
for(var i=0; i<NES; i++){
	var values={};
	values.name = ModelSetup('Surface'+i,'Name',ModelStreams);
	values.label = values.name;
	values.level = ModelSetup('Surface'+i,'Level',ModelStreams);
	values.fstr = ModelSetup('Surface'+i,'Expr',ModelStreams);
	values.fstr = 'E';
	values.size = ModelSetup('Surface'+i,'Size',ModelStreams);	
	values.minX = ModelSetup('Surface'+i,'MinX',ModelStreams);
	values.minY = ModelSetup('Surface'+i,'MinY',ModelStreams); 
	values.minZ = ModelSetup('Surface'+i,'MinZ',ModelStreams);
	values.maxX = ModelSetup('Surface'+i,'MaxX',ModelStreams);
	values.maxY = ModelSetup('Surface'+i,'MaxY',ModelStreams); 
	values.maxZ = ModelSetup('Surface'+i,'MaxZ',ModelStreams);

	var pcolor = ModelSetup('Surface'+i,'Color',ModelStreams);
	var prgb = pcolor.split(",");
	values.color = '#'+ (0x100 | parseInt(prgb[0])).toString(16).substr(1) +
					    (0x100 | parseInt(prgb[1])).toString(16).substr(1) +
					    (0x100 | parseInt(prgb[2])).toString(16).substr(1);
	values.opacity = ModelSetup('Surface'+i,'Opacity',ModelStreams);

	listSurfaces.push(new EqSurface(values));
}

function restartEqSurfaces(){
	var list = [];
	for(var i=listSurfaces.length-1;i>=0;i--){
		var v = listSurfaces[i].returnValues();
		list.push(v);
		listSurfaces[i].cleanup();
		listSurfaces.splice(i,1);
	}
	for(var i=0; i<list.length;i++)
		addNewSurface(list[i])

	list=[];
}

function addNewSurface(value){
	var eqs = new EqSurface(value);
	eqs.init();
	listSurfaces.push(eqs);
}