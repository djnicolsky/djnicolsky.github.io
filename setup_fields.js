			var fields = [];

			var NF = ModelSetup('GLOBAL','Fields',ModelScript);
			for(var i=0; i<=NF-1; i++){
				var values2={};
				values2["name"] = ModelSetup('Field'+i,'Name',ModelScript);
				values2["F1"] = ModelSetup('Field'+i,'Fx',ModelScript);
				values2["F2"] = ModelSetup('Field'+i,'Fy',ModelScript);
				values2["F3"] = ModelSetup('Field'+i,'Fz',ModelScript);
				values2["S1"] = ModelSetup('Field'+i,'Shift1',ModelScript);
				values2["S2"] = ModelSetup('Field'+i,'Shift2',ModelScript);
				values2["S3"] = ModelSetup('Field'+i,'Shift3',ModelScript);	
				var tmp = ModelSetup('Field'+i,'Coordinate',ModelScript);
				values2["crd"] = 'C'; 
				if(tmp == 'S') values2["crd"] = 'S';
				values2["type"] = ModelSetup('Field'+i,'Type',ModelScript);

				addNewField(values2);
			}


			function addNewField(values){
				var F = new Field(values);
				fields.push(F);
			}