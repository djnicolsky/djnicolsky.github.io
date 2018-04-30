if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
    position = position || 0;
    return this.substr(position, searchString.length) === searchString;
    };
}

function ModelSetup(Section, Key, Source){
    var Flag = true;
    var id;

    while(Source.length>0 && Flag){
        Flag = ! Source.startsWith(Section);
        Source = Source.substring(1);
    }

    Flag=true;
    while(Source.length>0 && Flag){
        Source = Source.substring(1);
        Flag = ! Source.startsWith(Key);
    }
    id = Source.indexOf('\n');
    Source = Source.substring(0, id-1);
    id = Source.indexOf('=');
    return Source.substring(id+1);
}
                

var ModelScenario=opener.document.getElementById("MBoxID").value.split(',');
var ModelScript='', ModelSliders='', ModelStreams='';

if(ModelScenario != 'none'){
    var request = new XMLHttpRequest();
    request.overrideMimeType('text/plain; charset=x-user-defined');
    request.open("GET", "/scenarios/"+ModelScenario[0]+".model", false);
    request.send(null);
    ModelScript = request.responseText;

    if(ModelScenario[1] == 'y'){
      	request.open("GET", "/scenarios/"+ModelScenario[0]+".slider", false);
        request.overrideMimeType('text/plain; charset=x-user-defined');
   	    request.send(null);
   	    ModelSliders = request.responseText;
    }

    if(ModelScenario[2] == 'y'){
        request.open("GET", "/scenarios/"+ModelScenario[0]+".stream", false);
        request.overrideMimeType('text/plain; charset=x-user-defined');
        request.send(null);
        ModelStreams = request.responseText;
    }
}
else{
    ModelScript = parent.opener.ScriptModel;
    ModelSliders = parent.opener.ScriptSlider;
    ModelStreams = parent.opener.ScriptStream;

    parent.opener.ScriptModel = '';
    parent.opener.ScriptSlider = '';
    parent.opener.ScriptStream = '';
    parent.opener.r1=0; 
    parent.opener.r2=0; 
    parent.opener.r3=0; 
    parent.opener.holder.innerHTML = 'Started';
}

