			
			var items=[];
			var belongs=[];

			var extraPLibrary = {"none":"Sphere", "electron":"Electron","proton":"Proton","neutron":"Neutron","deuter":"Deuterium","trit":"Tritium","stone":"Stone","apple":"Apple","x_kg_s":"Kettlebell"};
        var extraPictures = Object.keys(extraPLibrary);





			var ListParticles = [];
			var NP = parseInt(ModelSetup('GLOBAL','Particles',ModelScript));
			for(var i=0; i<NP; i++){
				var values={};
				values["id"] = i;
				values["name"] = ModelSetup('Particle'+i,'Name',ModelScript);
				values["label"] = values["name"];
				values["Q"] = ModelSetup('Particle'+i,'Charge',ModelScript);
				values["M0"] = ModelSetup('Particle'+i,'Mass',ModelScript);
				values["rx0"] = ModelSetup('Particle'+i,'Rxo',ModelScript);
				values["ry0"] = ModelSetup('Particle'+i,'Ryo',ModelScript);
				values["rz0"] = ModelSetup('Particle'+i,'Rzo',ModelScript);
				values["vx0"] = ModelSetup('Particle'+i,'Vxo',ModelScript);
				values["vy0"] = ModelSetup('Particle'+i,'Vyo',ModelScript);
				values["vz0"] = ModelSetup('Particle'+i,'Vzo',ModelScript);
				var ptype = ModelSetup('Particle'+i,'Type',ModelScript);
				if(ptype == 'C')
					values["type"]="N";
				else if(ptype == 'P')
					values["type"]="P";
				else
					values["type"]="R";
				values["radius"] = ModelSetup('Particle'+i,'Radius',ModelScript);
				var pcolor = ModelSetup('Particle'+i,'Color',ModelScript);
				var prgb = pcolor.split(",");

				values["color"] = '#'+ (0x100 | parseInt(prgb[0])).toString(16).substr(1) +
									   (0x100 | parseInt(prgb[1])).toString(16).substr(1) +
									   (0x100 | parseInt(prgb[2])).toString(16).substr(1);

				var imgname=ModelSetup('Particle'+i,'Picture',ModelScript);
				if(imgname != ""){
					if(imgname.indexOf("#") == -1){
						values["picture"] = imgname; //
						items.push(imgname);
						belongs.push(i);
						values["pimgs"]=1;
					}
					else{
						var tmp = imgname.slice(0,imgname.indexOf("#"));
						values["picture"] = tmp;
						values["pimgs"] = imgname.slice(imgname.indexOf("#")+1);
						for (var ii = 0; ii < values["pimgs"]; ii++){
							items.push(tmp+'/'+tmp+sprintf("%04d",ii+1));
							belongs.push(i);
						}						
					}
					if(document.getElementById("Canvas_"+values["picture"]) == null){
						var canvas = document.createElement('canvas');
						canvas.id     = "Canvas_"+values["picture"];
						var divcanvas = document.getElementById('myCanvases');
						divcanvas.appendChild(canvas);
					}
				}
				else{
					values["picture"] = 'none';
					values["pimgs"] = 1;
					var canvas=document.createElement("canvas");
					canvas.id = "Canvas_"+values["color"].replace('#','');
					var divcanvas = document.getElementById('myCanvases');
					divcanvas.appendChild(canvas);
				}

				var ptrace = ModelSetup('Particle'+i,'Trace',ModelScript);
				if(ptrace == '-')
					values["trace"]="N";
				else
					values["trace"]="Y";
				var pname = ModelSetup('Particle'+i,'ShowName',ModelScript);
				if(pname == '-')
					values["showlabel"]="N";
				else
					values["showlabel"]="Y";

				var P = new Particle(values);
				P.belongs = i;
			
				ListParticles.push(P);

				var flagAdd = 1;
				for (var j =  0; j < extraPictures.length; j++)
					if (values["picture"] == extraPictures[j])	flagAdd = 0;
				if(flagAdd)
					extraPLibrary[values["picture"]]=values["name"];
			}

			var maxBelongs;
			if(belongs.length > 0) 
				maxBelongs = Math.max.apply(null, belongs)+1;
			else
				maxBelongs = NP;

			var NB = parseInt(ModelSetup('GLOBAL','Bolds',ModelScript));
			for(var i=0; i<NB; i++){
				var values={};
				values["id"] = parseInt(NP)+i;
				values["name"] = ModelSetup('Bold'+i,'Name',ModelScript);
				values["label"] = values["name"];
				values["Q"] = ModelSetup('Bold'+i,'Charge',ModelScript);
				values["M0"] = ModelSetup('Bold'+i,'Mass',ModelScript);
				values["rx0"] = ModelSetup('Bold'+i,'Rxo',ModelScript);
				values["ry0"] = ModelSetup('Bold'+i,'Ryo',ModelScript);
				values["rz0"] = ModelSetup('Bold'+i,'Rzo',ModelScript);
				values["vx0"] = "0.0";
				values["vy0"] = "0.0";
				values["vz0"] = "0.0"
				values["type"]="P";

				values["radius"] = ModelSetup('Bold'+i,'Radius',ModelScript);
				var pcolor = ModelSetup('Bold'+i,'Color',ModelScript);
				var prgb = pcolor.split(",");

				values["color"] = '#'+ (0x100 | parseInt(prgb[0])).toString(16).substr(1) +
									   (0x100 | parseInt(prgb[1])).toString(16).substr(1) +
									   (0x100 | parseInt(prgb[2])).toString(16).substr(1);

				var imgname=ModelSetup('Bold'+i,'Picture',ModelScript);
				if(imgname != ""){
					if(imgname.indexOf("#") == -1){
						values["picture"] = imgname; //
						items.push(imgname);
						belongs.push(maxBelongs+i);
						values["pimgs"]=1;
					}
					else{
						var tmp = imgname.slice(0,imgname.indexOf("#"));
						values["picture"] = tmp;
						values["pimgs"] = imgname.slice(imgname.indexOf("#")+1);
						for (var ii = 0; ii < values["pimgs"]; ii++){
							items.push(tmp+'/'+tmp+sprintf("%04d",ii+1));
							belongs.push(maxBelongs+i);
						}						
					}
					if(document.getElementById("Canvas_"+values["picture"]) == null){
						var canvas = document.createElement('canvas');
						canvas.id     = "Canvas_"+values["picture"];
						var divcanvas = document.getElementById('myCanvases');
						divcanvas.appendChild(canvas);
					}
				}
				else{
					values["picture"] = 'none';
					values["pimgs"] = 1;
					var canvas=document.createElement("canvas");
					canvas.id = "Canvas_"+values["color"].replace('#','');
					var divcanvas = document.getElementById('myCanvases');
					divcanvas.appendChild(canvas);
				}

				var ptrace = ModelSetup('Bold'+i,'Trace',ModelScript);
				if(ptrace == '-')
					values["trace"]="N";
				else
					values["trace"]="Y";
				var pname = ModelSetup('Bold'+i,'ShowName',ModelScript);
				if(pname == '-')
					values["showlabel"]="N";
				else
					values["showlabel"]="Y";
			
				var P = new Particle(values);
				P.belongs = i;
				ListParticles.push(P);

				var flagAdd = 1;
				for (var j =  0; j < extraPictures.length; j++)
					if (values["picture"] == extraPictures[j])	flagAdd = 0;
				if(flagAdd)
					extraPLibrary[values["picture"]]=values["name"];
			}

			function restartAllParticles(){
				AnimationStep = 0;
				World.time = 0;

				for (var r = 0; r < ListParticles.length; r++)
					ListParticles[r].restart();
				for (var r = 0; r < ListParticles.length; r++)
					for (var ii = ListParticles[r].LocalListInteractions.length - 1; ii >= 0; ii--)
							if(ListParticles[r].LocalListInteractions[ii].iEE > -1)
								ListParticles[r].LocalListInteractions[ii].updateEndPoints(ListParticles);

				for(var iplt=0; iplt < plt.length; iplt++)
					if(plt[iplt].loaded)
						if(!plt[iplt].window.closed) 
							plt[iplt].drawAxis();
				for(var i=0; i<NSliders; i++)
					if(!sld.window.closed){
						var tname = sld.gui.__controllers[i].object.label + ":" + sld.gui.__controllers[i].property;
						sld.gui.__controllers[i].name(tname);
					}
			}

			function addNewParticle(values){
				var P = new Particle(values);
            	P.initialize(World.FlagVelocities);
            	P.updateTrace(0.0);

				var ptext = new createTextLabel(document);
				ptext.setHTML(P.label);
				ptext.setParent(P.sprite, camera, P.showlabel);
				document.body.appendChild(ptext.element);
				P.textLabels.push(ptext);

				ListParticles.push(P);
			}
			function cleanupParticle(r){
				for (var ii =  ListParticles[r].textLabels.length-1; ii >= 0; ii-- )
					document.body.removeChild(ListParticles[r].textLabels[ii].element);
				ListParticles[r].cleanup();
     			//AnimationStep=0;
			}
