			var fields = [];

			var NF = ModelSetup('GLOBAL','Fields',ModelScript);
			for(var i=0; i<=NF-1; i++){
				var values={};
				values["name"] = ModelSetup('Field'+i,'Name',ModelScript);
				values["F1"] = ModelSetup('Field'+i,'Fx',ModelScript);
				values["F2"] = ModelSetup('Field'+i,'Fy',ModelScript);
				values["F3"] = ModelSetup('Field'+i,'Fz',ModelScript);
				values["S1"] = ModelSetup('Field'+i,'Shift1',ModelScript);
				values["S2"] = ModelSetup('Field'+i,'Shift2',ModelScript);
				values["S3"] = ModelSetup('Field'+i,'Shift3',ModelScript);	
				var tmp = ModelSetup('Field'+i,'Coordinate',ModelScript);
				values["crd"] = 'C'; if(tmp == 'S') values["crd"] = 'S';
				values["type"] = ModelSetup('Field'+i,'Type',ModelScript);

				addNewField(values);
			}


			function addNewField(values){
				var F = new Field(values);
				fields.push(F);
			}