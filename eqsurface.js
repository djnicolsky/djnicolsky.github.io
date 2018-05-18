"use strict";

function EqSurface(values){
// number of cubes along a side
	this.level = parseFloat(values.level);
	this.size = parseFloat(values.size);
	this.color = values.color;
	this.fstr = values.fstr;
	this.name = values.name;
	this.label = values.label;

	this.size2 = this.size * this.size;
	this.axisMinX = parseFloat(values.minX);	this.axisMaxX = parseFloat(values.maxX);
	this.axisMinY = parseFloat(values.minY);	this.axisMaxY = parseFloat(values.maxY);
	this.axisMinZ = parseFloat(values.minZ);	this.axisMaxZ = parseFloat(values.maxZ);

	this.opacity = parseFloat(values.opacity);
	this.geometry = new THREE.Geometry();
	this.vertices = [];
	this.faces = [];
	this.mesh = null;
}

EqSurface.prototype.returnValues = function(){
	var values={};
	values.name = this.name;
	values.label = this.label;

	values.level = this.level;
	values.size = this.size;
	values.fstr = this.fstr;
	values.minX = this.axisMinX;
	values.minY = this.axisMinY;
	values.minZ = this.axisMinZ;
	values.maxX = this.axisMaxX;
	values.maxY = this.axisMaxY;
	values.maxZ = this.axisMaxZ;
	values.color = this.color;
	values.opacity = this.opacity;

	return values;
}

EqSurface.prototype.init = function(){
	this.marchingCubes();
	this.update();

	var colorMaterial =  new THREE.MeshLambertMaterial( {color: this.color, side: THREE.DoubleSide, transparent: true, opacity: this.opacity} );
	this.mesh = new THREE.Mesh( this.geometry, colorMaterial );
	scene.add(this.mesh);
}

EqSurface.prototype.cleanup = function(){
	scene.remove(this.mesh);
	this.mesh.geometry.dispose();
	this.mesh.material.dispose();
	this.mesh = null;

	this.geometry.dispose();
	this.vertices = [];
	this.faces = [];
}

EqSurface.prototype.marchingCubes = function(){
	var points = [];
	var values = [];

	var axisRangeX = this.axisMaxX - this.axisMinX;
	var axisRangeY = this.axisMaxY - this.axisMinY;
	var axisRangeZ = this.axisMaxZ - this.axisMinZ;

	// Generate a list of 3D points and values at those points
	for (var k = 0; k < this.size; k++)
	for (var j = 0; j < this.size; j++)
	for (var i = 0; i < this.size; i++)
	{
		// actual values
		var x = this.axisMinX + axisRangeX * i / (this.size - 1);
		var y = this.axisMinY + axisRangeY * j / (this.size - 1);
		var z = this.axisMinZ + axisRangeZ * k / (this.size - 1);
		points.push( new THREE.Vector3(x,y,z) );

		//var value = x*x + y*y +z*z - 25;

		var value = -this.level;
		for (var ii = 0; ii<ListParticles.length; ii++)
			if(ListParticles[ii].type == 'P'){
				var DELTA_R = (x-ListParticles[ii].R[0])*(x-ListParticles[ii].R[0]);
				DELTA_R += (y-ListParticles[ii].R[1])*(y-ListParticles[ii].R[1]);
				DELTA_R += (z-ListParticles[ii].R[2])*(z-ListParticles[ii].R[2]);
				DELTA_R = Math.sqrt(DELTA_R);

				value += ListParticles[ii].Q/DELTA_R;
			}

	    values.push( value );
	}

	// Marching Cubes Algorithm

	// Vertices may occur along edges of cube, when the values at the edge's endpoints
	//   straddle the isolevel value.
	// Actual position along edge weighted according to function values.
	var vlist = new Array(12);
	var vertexIndex = 0;
	
	for (var z = 0; z < this.size - 1; z++)
	for (var y = 0; y < this.size - 1; y++)
	for (var x = 0; x < this.size - 1; x++){
		// index of base point, and also adjacent points on cube
		var p    = x + this.size * y + this.size2 * z,
			px   = p   + 1,
			py   = p   + this.size,
			pxy  = py  + 1,
			pz   = p   + this.size2,
			pxz  = px  + this.size2,
			pyz  = py  + this.size2,
			pxyz = pxy + this.size2;
		
		// store scalar values corresponding to vertices
		var value0 = values[ p    ],
			value1 = values[ px   ],
			value2 = values[ py   ],
			value3 = values[ pxy  ],
			value4 = values[ pz   ],
			value5 = values[ pxz  ],
			value6 = values[ pyz  ],
			value7 = values[ pxyz ];
		
		// place a "1" in bit positions corresponding to vertices whose
		//   isovalue is less than given constant.
		
		var isolevel = 0;
		
		var cubeindex = 0;
		if ( value0 < isolevel ) cubeindex |= 1;
		if ( value1 < isolevel ) cubeindex |= 2;
		if ( value2 < isolevel ) cubeindex |= 8;
		if ( value3 < isolevel ) cubeindex |= 4;
		if ( value4 < isolevel ) cubeindex |= 16;
		if ( value5 < isolevel ) cubeindex |= 32;
		if ( value6 < isolevel ) cubeindex |= 128;
		if ( value7 < isolevel ) cubeindex |= 64;
		
		// bits = 12 bit number, indicates which edges are crossed by the isosurface
		var bits = THREE.edgeTable[ cubeindex ];
		
		// if none are crossed, proceed to next iteration
		if ( bits === 0 ) continue;
		
		// check which edges are crossed, and estimate the point location
		//    using a weighted average of scalar values at edge endpoints.
		// store the vertex in an array for use later.
		var mu = 0.5; 
		
		// bottom of the cube
		if ( bits & 1 ){		
			mu = ( isolevel - value0 ) / ( value1 - value0 );
			vlist[0] = points[p].clone().lerp( points[px], mu );
		}
		if ( bits & 2 ){
			mu = ( isolevel - value1 ) / ( value3 - value1 );
			vlist[1] = points[px].clone().lerp( points[pxy], mu );
		}
		if ( bits & 4 ){
			mu = ( isolevel - value2 ) / ( value3 - value2 );
			vlist[2] = points[py].clone().lerp( points[pxy], mu );
		}
		if ( bits & 8 ){
			mu = ( isolevel - value0 ) / ( value2 - value0 );
			vlist[3] = points[p].clone().lerp( points[py], mu );
		}
		// top of the cube
		if ( bits & 16 ){
			mu = ( isolevel - value4 ) / ( value5 - value4 );
			vlist[4] = points[pz].clone().lerp( points[pxz], mu );
		}
		if ( bits & 32 ){
			mu = ( isolevel - value5 ) / ( value7 - value5 );
			vlist[5] = points[pxz].clone().lerp( points[pxyz], mu );
		}
		if ( bits & 64 ){
			mu = ( isolevel - value6 ) / ( value7 - value6 );
			vlist[6] = points[pyz].clone().lerp( points[pxyz], mu );
		}
		if ( bits & 128 ){
			mu = ( isolevel - value4 ) / ( value6 - value4 );
			vlist[7] = points[pz].clone().lerp( points[pyz], mu );
		}
		// vertical lines of the cube
		if ( bits & 256 ){
			mu = ( isolevel - value0 ) / ( value4 - value0 );
			vlist[8] = points[p].clone().lerp( points[pz], mu );
		}
		if ( bits & 512 ){
			mu = ( isolevel - value1 ) / ( value5 - value1 );
			vlist[9] = points[px].clone().lerp( points[pxz], mu );
		}
		if ( bits & 1024 ){
			mu = ( isolevel - value3 ) / ( value7 - value3 );
			vlist[10] = points[pxy].clone().lerp( points[pxyz], mu );
		}
		if ( bits & 2048 ){
			mu = ( isolevel - value2 ) / ( value6 - value2 );
			vlist[11] = points[py].clone().lerp( points[pyz], mu );
		}
		
		// construct triangles -- get correct vertices from triTable.
		var i = 0;
		cubeindex <<= 4;  // multiply by 16... 
		// "Re-purpose cubeindex into an offset into triTable." 
		//  since each row really isn't a row.
		 
		// the while loop should run at most 5 times,
		//   since the 16th entry in each row is a -1.
		while ( THREE.triTable[ cubeindex + i ] != -1 ){
			var index1 = THREE.triTable[cubeindex + i];
			var index2 = THREE.triTable[cubeindex + i + 1];
			var index3 = THREE.triTable[cubeindex + i + 2];
			
			this.geometry.vertices.push( vlist[index1].clone() );
			this.geometry.vertices.push( vlist[index2].clone() );
			this.geometry.vertices.push( vlist[index3].clone() );
			var face = new THREE.Face3(vertexIndex, vertexIndex+1, vertexIndex+2);
			this.geometry.faces.push( face );

			this.geometry.faceVertexUvs[ 0 ].push( [ new THREE.Vector2(0,0), new THREE.Vector2(0,1), new THREE.Vector2(1,1) ] );

			vertexIndex += 3;
			i += 3;
		}
	}
	this.geometry.computeFaceNormals();
	this.geometry.computeVertexNormals();

	this.vertices = JSON.parse( JSON.stringify(this.geometry.vertices));
	this.faces = JSON.parse( JSON.stringify(this.geometry.faces));
}

EqSurface.prototype.restart = function(){
	for (var i=this.geometry.vertices.length-1; i>=0; i--){
		this.geometry.vertices.splice(i,1);	
		this.vertices.splice(i,1);
	}
	for (var i=this.geometry.faces.length-1; i>=0; i--){
		this.geometry.faces.splice(i,1);
		this.geometry.faceVertexUvs[0].splice(i,1);
		this.faces.splice(i,1);
	}
	this.marchingCubes();
	this.update();

	this.geometry.verticesNeedUpdate = true;
	this.geometry.elementsNeedUpdate = true;
	this.geometry.morphTargetsNeedUpdate = true;
	this.geometry.uvsNeedUpdate = true;
	this.geometry.normalsNeedUpdate = true;
	this.geometry.colorsNeedUpdate = true;
	this.geometry.tangentsNeedUpdate = true;
}
	
EqSurface.prototype.update = function(){
	for (var i=0; i<this.geometry.vertices.length; i++){
        this.geometry.vertices[i].x = AnimationScale*World.AxisScale[0]*this.vertices[i].x;
        this.geometry.vertices[i].y = AnimationScale*World.AxisScale[1]*this.vertices[i].y;
        this.geometry.vertices[i].z = AnimationScale*World.AxisScale[2]*this.vertices[i].z;                
	}
	this.geometry.verticesNeedUpdate=true;

	this.geometry.computeFaceNormals();
	this.geometry.computeVertexNormals();
}

EqSurface.prototype.updateTransparency = function(opacity){
	this.mesh.material.opacity = this.opacity*opacity;
}