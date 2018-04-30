


var World = {
			// Can be changed dynamically
			dt: 0.001,
			Scale: -3,
			FlagScaling : false,
			FlagCollision : false,
			FlagVelocities : false,
			VelocityScale : 1,
			VelocityScaleNonDim : 0,
			FlagAxis : true,
			FlagGrid : true,
			ColorAxis : "#0000CC",
			ColorGrid : "#888888",
			FlagBackGround : false,
			FileBackGround : "",
			LB: [0.0, 0.0, 0.0],
			UB: [0.0, 0.0, 0.0],
			BoundingBox : true,
			CollisionBoundary : true,
			ColorBB : "#0000CC",
			AxisScale: [1.0, 1.0, 1.0],
			FlagStreamLines: true
		};

		var PLT2D = [];
		
			var WRLD = {
				Rx: 0.0, Ry: 0.0, Rx: 0.0,
				Vx: 0.0, Vy: 0.0, Vz: 0.0,
				Ax: 0.0, Ay: 0.0, Az: 0.0
			};





			World.CollisionBoundary = true;
			World.LB[0]=parseFloat(ModelSetup('COLLISION','Lx1',ModelScript));
			World.LB[1]=parseFloat(ModelSetup('COLLISION','Ly1',ModelScript));
			World.LB[2]=parseFloat(ModelSetup('COLLISION','Lz1',ModelScript));
			World.UB[0]=parseFloat(ModelSetup('COLLISION','Lx2',ModelScript));
			World.UB[1]=parseFloat(ModelSetup('COLLISION','Ly2',ModelScript));
			World.UB[2]=parseFloat(ModelSetup('COLLISION','Lz2',ModelScript));

			var tmp = ModelSetup('COLLISION','Switch',ModelScript);
			if(tmp == '+')
				World.CollisionBoundary = true;
			else
				World.CollisionBoundary = false;

			var tmp = ModelSetup('COLLISION','Draw',ModelScript);
			if(tmp == '+')
				World.BoundingBox = true;
			else
				World.BoundingBox = false;


			PLT2D.AxisX = ModelSetup('PLOT','NameX',ModelScript);
			PLT2D.AxisY = ModelSetup('PLOT','NameY',ModelScript);
			PLT2D.Sx = parseFloat(ModelSetup('PLOT','ScaleX',ModelScript));
			PLT2D.Sy = parseFloat(ModelSetup('PLOT','ScaleY',ModelScript));
			PLT2D.OffsetX = ModelSetup('PLOT','OffsetX',ModelScript);
			PLT2D.OffsetY = ModelSetup('PLOT','OffsetY',ModelScript);
			var pcolor = ModelSetup('PLOT','Color',ModelScript);
			var prgb = pcolor.split(",");

			PLT2D.Color = '#'+ (0x100 | parseInt(prgb[0])).toString(16).substr(1) +
							   (0x100 | parseInt(prgb[1])).toString(16).substr(1) +
							   (0x100 | parseInt(prgb[2])).toString(16).substr(1);



			var tmp = ModelSetup('SPACE','FlagAxis',ModelScript);
			if(tmp == '+')
				World.FlagAxis = true;
			else
				World.FlagAxis = false;

			var tmp = ModelSetup('SPACE','FlagGrid',ModelScript);
			if(tmp == '+')
				World.FlagGrid = true;
			else
				World.FlagGrid = false;

			var tmp = ModelSetup('SPACE','FlagCollision',ModelScript);
			if(tmp == '+')
				World.FlagCollision = true;
			else
				World.FlagCollision = false;

			World.AxisScale[0] = parseFloat(ModelSetup('SPACE','Sx',ModelScript));
			World.AxisScale[1] = parseFloat(ModelSetup('SPACE','Sy',ModelScript));
			World.AxisScale[2] = parseFloat(ModelSetup('SPACE','Sz',ModelScript));

			/*var tmp = ModelSetup('SPACE','FlagBackGround',ModelScript);
			if(tmp == '+')
				World.FlagBackGround = true;
			else
				World.FlagBackGround = false;

			World.FileBackGround = ModelSetup('SPACE','FileBackGround',ModelScript);

			var tmp = ModelSetup('SPACE','FlagScalling',ModelScript);
			if(tmp == '+')
				World.FlagScalling = true;
			else
				World.FlagScalling = false;*/

			var tmp = ModelSetup('SPACE','ColorAxis',ModelScript);
			switch(tmp){
				case "Black":     World.ColorAxis = '#000000'; break;
				case "Blue":      World.ColorAxis = '#0000FF'; break;
				case "Cyan":      World.ColorAxis = '#00FFFF'; break;
				case "DarkGray":  World.ColorAxis = '#808080'; break;
				case "Gray":      World.ColorAxis = '#A9A9A9'; break;
				case "Green":     World.ColorAxis = '#00FF00'; break;
				case "LightGray": World.ColorAxis = '#D3D3D3'; break;
				case "Magenta":   World.ColorAxis = '#FF00FF'; break;
				case "Orange":    World.ColorAxis = '#FFA500'; break;
				case "Pink":      World.ColorAxis = '#FFC0CB'; break;
				case "Red":       World.ColorAxis = '#FF0000'; break;
				case "White":     World.ColorAxis = '#FFFFFF'; break;
				case "Yellow":    World.ColorAxis = '#FFFF00'; break;
				default: 		  World.ColorAxis = '#A9A9A9';
			}

			var tmp = ModelSetup('SPACE','ColorGrid',ModelScript);
			switch(tmp){
				case "Black":     World.ColorGrid = '#000000'; break;
				case "Blue":      World.ColorGrid = '#0000FF'; break;
				case "Cyan":      World.ColorGrid = '#00FFFF'; break;
				case "DarkGray":  World.ColorGrid = '#808080'; break;
				case "Gray":      World.ColorGrid = '#A9A9A9'; break;
				case "Green":     World.ColorGrid = '#00FF00'; break;
				case "LightGray": World.ColorGrid = '#D3D3D3'; break;
				case "Magenta":   World.ColorGrid = '#FF00FF'; break;
				case "Orange":    World.ColorGrid = '#FFA500'; break;
				case "Pink":      World.ColorGrid = '#FFC0CB'; break;
				case "Red":       World.ColorGrid = '#FF0000'; break;
				case "White":     World.ColorGrid = '#FFFFFF'; break;
				case "Yellow":    World.ColorGrid = '#FFFF00'; break;
				default: 		  World.ColorGrid = '#A9A9A9';
			}





			function addBoundingBox(){
				scene.add( World.lineBB1 );
				scene.add( World.lineBB2 );
				scene.add( World.lineBB3 );
				scene.add( World.lineBB4 );
			}

			function setupBoundingBox(){
				var material = new THREE.LineBasicMaterial({color: World.ColorBB});
				World.geometryCube = new THREE.Geometry();
				World.geometryCube.vertices.push(
					new THREE.Vector3( AnimationScale*World.AxisScale[0]*World.LB[0], AnimationScale*World.AxisScale[1]*World.UB[1], AnimationScale*World.AxisScale[2]*World.UB[2] ),
					new THREE.Vector3( AnimationScale*World.AxisScale[0]*World.UB[0], AnimationScale*World.AxisScale[1]*World.UB[1], AnimationScale*World.AxisScale[2]*World.UB[2] ),
					new THREE.Vector3( AnimationScale*World.AxisScale[0]*World.UB[0], AnimationScale*World.AxisScale[1]*World.LB[1], AnimationScale*World.AxisScale[2]*World.UB[2] ),
					new THREE.Vector3( AnimationScale*World.AxisScale[0]*World.LB[0], AnimationScale*World.AxisScale[1]*World.LB[1], AnimationScale*World.AxisScale[2]*World.UB[2] ),
					new THREE.Vector3( AnimationScale*World.AxisScale[0]*World.LB[0], AnimationScale*World.AxisScale[1]*World.UB[1], AnimationScale*World.AxisScale[2]*World.UB[2] ),
					new THREE.Vector3( AnimationScale*World.AxisScale[0]*World.LB[0], AnimationScale*World.AxisScale[1]*World.UB[1], AnimationScale*World.AxisScale[2]*World.LB[2] ),
					new THREE.Vector3( AnimationScale*World.AxisScale[0]*World.UB[0], AnimationScale*World.AxisScale[1]*World.UB[1], AnimationScale*World.AxisScale[2]*World.LB[2] ),
					new THREE.Vector3( AnimationScale*World.AxisScale[0]*World.UB[0], AnimationScale*World.AxisScale[1]*World.LB[1], AnimationScale*World.AxisScale[2]*World.LB[2] ),
					new THREE.Vector3( AnimationScale*World.AxisScale[0]*World.LB[0], AnimationScale*World.AxisScale[1]*World.LB[1], AnimationScale*World.AxisScale[2]*World.LB[2] ),
					new THREE.Vector3( AnimationScale*World.AxisScale[0]*World.LB[0], AnimationScale*World.AxisScale[1]*World.UB[1], AnimationScale*World.AxisScale[2]*World.LB[2] )
				);
				World.lineBB1 = new THREE.Line( World.geometryCube, material );
				
				World.geometryCube2 = new THREE.Geometry();
				World.geometryCube2.vertices.push(
					new THREE.Vector3( AnimationScale*World.AxisScale[0]*World.UB[0], AnimationScale*World.AxisScale[1]*World.UB[1], AnimationScale*World.AxisScale[2]*World.LB[2] ),
					new THREE.Vector3( AnimationScale*World.AxisScale[0]*World.UB[0], AnimationScale*World.AxisScale[1]*World.UB[1], AnimationScale*World.AxisScale[2]*World.UB[2] )
				);
				World.lineBB2 = new THREE.Line( World.geometryCube2, material );

				World.geometryCube3 = new THREE.Geometry();
				World.geometryCube3.vertices.push(
					new THREE.Vector3( AnimationScale*World.AxisScale[0]*World.UB[0], AnimationScale*World.AxisScale[1]*World.LB[1], AnimationScale*World.AxisScale[2]*World.LB[2] ),
					new THREE.Vector3( AnimationScale*World.AxisScale[0]*World.UB[0], AnimationScale*World.AxisScale[1]*World.LB[1], AnimationScale*World.AxisScale[2]*World.UB[2] )
				);
				World.lineBB3 = new THREE.Line( World.geometryCube3, material );

				World.geometryCube4 = new THREE.Geometry();
				World.geometryCube4.vertices.push(
					new THREE.Vector3(AnimationScale*World.AxisScale[0]*World.LB[0], AnimationScale*World.AxisScale[1]*World.LB[1], AnimationScale*World.AxisScale[2]*World.LB[2] ),
					new THREE.Vector3(AnimationScale*World.AxisScale[0]*World.LB[0], AnimationScale*World.AxisScale[1]*World.LB[1], AnimationScale*World.AxisScale[2]*World.UB[2] )
				);
				World.lineBB4 = new THREE.Line( World.geometryCube4, material );
			}





			function updateCube(){
				World.geometryCube.vertices[0].x= AnimationScale*World.AxisScale[0]*World.LB[0];
				World.geometryCube.vertices[0].y= AnimationScale*World.AxisScale[1]*World.UB[1];
				World.geometryCube.vertices[0].z= AnimationScale*World.AxisScale[2]*World.UB[2];
				World.geometryCube.vertices[1].x= AnimationScale*World.AxisScale[0]*World.UB[0];
				World.geometryCube.vertices[1].y= AnimationScale*World.AxisScale[1]*World.UB[1];
				World.geometryCube.vertices[1].z= AnimationScale*World.AxisScale[2]*World.UB[2];
				World.geometryCube.vertices[2].x= AnimationScale*World.AxisScale[0]*World.UB[0];
				World.geometryCube.vertices[2].y= AnimationScale*World.AxisScale[1]*World.LB[1];
				World.geometryCube.vertices[2].z= AnimationScale*World.AxisScale[2]*World.UB[2];				
				World.geometryCube.vertices[3].x= AnimationScale*World.AxisScale[0]*World.LB[0];
				World.geometryCube.vertices[3].y= AnimationScale*World.AxisScale[1]*World.LB[1];
				World.geometryCube.vertices[3].z= AnimationScale*World.AxisScale[2]*World.UB[2];				
				World.geometryCube.vertices[4].x= AnimationScale*World.AxisScale[0]*World.LB[0];
				World.geometryCube.vertices[4].y= AnimationScale*World.AxisScale[1]*World.UB[1];
				World.geometryCube.vertices[4].z= AnimationScale*World.AxisScale[2]*World.UB[2];

				World.geometryCube.vertices[5].x= AnimationScale*World.AxisScale[0]*World.LB[0];
				World.geometryCube.vertices[5].y= AnimationScale*World.AxisScale[1]*World.UB[1];
				World.geometryCube.vertices[5].z= AnimationScale*World.AxisScale[2]*World.LB[2];
				World.geometryCube.vertices[6].x= AnimationScale*World.AxisScale[0]*World.UB[0];
				World.geometryCube.vertices[6].y= AnimationScale*World.AxisScale[1]*World.UB[1];
				World.geometryCube.vertices[6].z= AnimationScale*World.AxisScale[2]*World.LB[2];
				World.geometryCube.vertices[7].x= AnimationScale*World.AxisScale[0]*World.UB[0];
				World.geometryCube.vertices[7].y= AnimationScale*World.AxisScale[1]*World.LB[1];
				World.geometryCube.vertices[7].z= AnimationScale*World.AxisScale[2]*World.LB[2];				
				World.geometryCube.vertices[8].x= AnimationScale*World.AxisScale[0]*World.LB[0];
				World.geometryCube.vertices[8].y= AnimationScale*World.AxisScale[1]*World.LB[1];
				World.geometryCube.vertices[8].z= AnimationScale*World.AxisScale[2]*World.LB[2];				
				World.geometryCube.vertices[9].x= AnimationScale*World.AxisScale[0]*World.LB[0];
				World.geometryCube.vertices[9].y= AnimationScale*World.AxisScale[1]*World.UB[1];
				World.geometryCube.vertices[9].z= AnimationScale*World.AxisScale[2]*World.LB[2];
				World.geometryCube.verticesNeedUpdate = true;

				World.geometryCube2.vertices[0].x= AnimationScale*World.AxisScale[0]*World.UB[0];
				World.geometryCube2.vertices[0].y= AnimationScale*World.AxisScale[1]*World.UB[1];
				World.geometryCube2.vertices[0].z= AnimationScale*World.AxisScale[2]*World.UB[2];
				World.geometryCube2.vertices[1].x= AnimationScale*World.AxisScale[0]*World.UB[0];
				World.geometryCube2.vertices[1].y= AnimationScale*World.AxisScale[1]*World.UB[1];
				World.geometryCube2.vertices[1].z= AnimationScale*World.AxisScale[2]*World.LB[2];
				World.geometryCube2.verticesNeedUpdate = true;
				World.geometryCube3.vertices[0].x= AnimationScale*World.AxisScale[0]*World.UB[0];
				World.geometryCube3.vertices[0].y= AnimationScale*World.AxisScale[1]*World.LB[1];
				World.geometryCube3.vertices[0].z= AnimationScale*World.AxisScale[2]*World.UB[2];
				World.geometryCube3.vertices[1].x= AnimationScale*World.AxisScale[0]*World.UB[0];
				World.geometryCube3.vertices[1].y= AnimationScale*World.AxisScale[1]*World.LB[1];
				World.geometryCube3.vertices[1].z= AnimationScale*World.AxisScale[2]*World.LB[2];
				World.geometryCube3.verticesNeedUpdate = true;
				World.geometryCube4.vertices[0].x= AnimationScale*World.AxisScale[0]*World.LB[0];
				World.geometryCube4.vertices[0].y= AnimationScale*World.AxisScale[1]*World.LB[1];
				World.geometryCube4.vertices[0].z= AnimationScale*World.AxisScale[2]*World.UB[2];
				World.geometryCube4.vertices[1].x= AnimationScale*World.AxisScale[0]*World.LB[0];
				World.geometryCube4.vertices[1].y= AnimationScale*World.AxisScale[1]*World.LB[1];
				World.geometryCube4.vertices[1].z= AnimationScale*World.AxisScale[2]*World.LB[2];
				World.geometryCube4.verticesNeedUpdate = true;
			}