function convert(Input){
	tmp = Input; Input = "";
    while(tmp.search("e")>-1){
		var ii = tmp.search("e");
		Input += tmp.substr(0,ii)+2.718281828459045;
    	tmp = tmp.substr(ii+1,tmp.lenth);
    }
	Input += tmp;

	tmp = Input; Input = "";
    while(tmp.search("pi")>-1){
    	var ii = tmp.search("pi");
    	Input += tmp.substr(0,ii)+3.14159265358979;
    	tmp = tmp.substr(ii+2,tmp.lenth);
    }
	Input += tmp;

	tmp = Input; Input = "";
	while(tmp.search("cos")>-1){
    	var ii = tmp.search("cos");
    	Input += tmp.substr(0,ii)+'Math.cos';
    	tmp = tmp.substr(ii+3,tmp.lenth);
    }
	Input += tmp;

	tmp = Input; Input = "";
    while(tmp.search("sin")>-1){
    	var ii = tmp.search("sin");
    	Input += tmp.substr(0,ii)+'Math.sin';
    	tmp = tmp.substr(ii+3,tmp.lenth);
    }
	Input += tmp;

	tmp = Input; Input = "";
    while(tmp.search("ln")>-1){
    	var ii = tmp.search("ln");
    	Input += tmp.substr(0,ii)+'Math.log';
    	tmp = tmp.substr(ii+2,tmp.lenth);
    }
	Input += tmp;

	tmp = Input; Input = "";
    while(tmp.indexOf("{")>-1){
    	var ii = tmp.search("{");
    	Input += tmp.substr(0,ii)+'Heaviside(';
    	tmp = tmp.substr(ii+1,tmp.lenth);
    }
	Input += tmp;
	tmp = Input; Input = "";
    while(tmp.indexOf("}")>-1){
    	var ii = tmp.search("}");
    	Input += tmp.substr(0,ii)+')';
    	tmp = tmp.substr(ii+1,tmp.lenth);
    }
	Input += tmp;
	tmp = Input; Input = "";
    while(tmp.indexOf("#")>-1){
    	var ii = tmp.search("#");
    	Input += tmp.substr(0,ii)+',';
    	tmp = tmp.substr(ii+1,tmp.lenth);
    }
	Input += tmp;

	tmp = Input; Input = "";
    while(tmp.indexOf("|")>-1){
    	var ii = tmp.indexOf("|");
    	if(ii>0){
    		var ch = tmp.charAt(ii-1);
    		if('+-/*^(|'.indexOf(ch)>-1){
    			Input += tmp.substr(0,ii)+'Math.abs(';
	    		tmp = tmp.substr(ii+1,tmp.lenth);	
    		}else{
				Input += tmp.substr(0,ii)+')';
    			tmp = tmp.substr(ii+1,tmp.lenth);
    		}
    	}else{
			Input += 'Math.abs(';
	    	tmp = tmp.substr(ii+1,tmp.lenth);
    	}
    }
	Input += tmp;

    while(Input.indexOf("^")>-1){
    	tmp = Input; Input = "";
    	var ii = tmp.indexOf("^");

    	var i = ii-1; var level = 0; var flag = 0;
    	while((i>=0)&&(flag==0)){
    		var ch = tmp.charAt(i);
    		if(('+-/*^('.indexOf(ch)>-1)&&(level == 0)) 
    				flag = 1;
    		if(')'.indexOf(ch)>-1) level--; 
    		if('('.indexOf(ch)>-1) level++; 
    		i--;
    	}
    	i++;

    	var j = ii+1; var level = 0; var flag = 0;
    	while((j<=tmp.length)&&(flag==0)){
    		var ch = tmp.charAt(j);
    		if(('+-/*^)'.indexOf(ch)>-1)&&(level == 0)) 
    			flag = 1; 
    		if('('.indexOf(ch)>-1) level--; 
    		if(')'.indexOf(ch)>-1) level++; 
    		j++;
    	}
    	j--;

    	Input += tmp.substr(0,i+1)+'Math.pow('+tmp.substr(i+1,ii-i-1)+','+tmp.substr(ii+1,j-ii-1)+')';
    	Input += tmp.substr(j,tmp.length);
    }
    return Input;
}