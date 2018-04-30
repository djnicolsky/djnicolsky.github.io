
			var ListInteractions = [];
			var NA = ModelSetup('GLOBAL','Actions',ModelScript);
			for(var i=0; i<=NA-1; i++){
				var values={};
				values.nEE = ModelSetup('Action'+i,'Master',ModelScript);
				values.nER = ModelSetup('Action'+i,'Slave',ModelScript);
				
				var tmp = ModelSetup('Action'+i,'FlagGravity',ModelScript);
				values.G=false; if(tmp == '+') values.G=true;
				var tmp = ModelSetup('Action'+i,'FlagElectric',ModelScript);
				values.E=false; if(tmp == '+') values.E=true;
				var tmp = ModelSetup('Action'+i,'FlagHook',ModelScript);
				values.H=false; if(tmp == '+') values.H=true;
				values.K=parseFloat(ModelSetup('Action'+i,'K',ModelScript));
				values.R=parseFloat(ModelSetup('Action'+i,'Ro',ModelScript));
				values.A=parseFloat(ModelSetup('Action'+i,'Friction',ModelScript));
				var tmp = ModelSetup('Action'+i,'FlagDefine',ModelScript);
				values.D=false; if(tmp == '+') values.D=true;
				values.Fx=ModelSetup('Action'+i,'Force',ModelScript);
				var tmp = ModelSetup('Action'+i,'Visible',ModelScript);
				values.trace=false; if(tmp == '+') values.trace=true;

				ListInteractions.push(new Interaction(values));
			}


			function setPInteractions(){
				for (var i = ListInteractions.length - 1; i >= 0; i--) {
					var iEE = getParticle(ListInteractions[i].nEE);
					var iER = getParticle(ListInteractions[i].nER);
					if((iEE<0)||(iER<0))
						ListInteractions.splice(i,1);
					else{
						var values = {};
						values = ListInteractions[i].returnValues();
						values.iEE = iEE;
						values.iER = iER;
						values.interaction = i;
						var I = new Interaction(values);
						I.initialize();
						ListParticles[iEE].LocalListInteractions.push(I);
					}
				}				
			}

			function cleanPInteractions(){
				for (var i = 0; i < ListParticles.length; i++){
					for (var ii = ListParticles[i].LocalListInteractions.length - 1; ii >= 0; ii--){
						scene.remove(ListParticles[i].LocalListInteractions[ii].line);
						ListParticles[i].LocalListInteractions.splice(ii,1);
					}
				}
			}

			function getParticle(name){
            	for (var i = ListParticles.length - 1; i >= 0; i--)
            		if (ListParticles[i].name == name)
            			return i;
            	return -1;
            }