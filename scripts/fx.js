var TOK_NUM = 0;
var TOK_SYM = 1;
var ERROR = -987987.987987;
var PI = 3.1415926535897932384626433832795;
var E =  2.7182818284590452353602874713527;
   
function fx(Input, Q1, M1, Rad1, R1, V1, Q2, M2, Rad2, R2, V2, t){
	var Result = 0.0;

	var str = '  '+Input+'  ';
	var T = MakeTokenList(str, T);
	var TL = new Array(T.length);
	for(var i=0;i<T.length;i++)
		TL[i]=[];

	var dx = R1[0]-R2[0];
	var dy = R1[1]-R2[1];
	var dz = R1[2]-R2[2];
	var r2 = dx*dx+dy*dy+dz*dz;
	var r = Math.exp(0.5*Math.log(r2));

	dx = V1[0]-V2[0];
	dy = V1[1]-V2[1];
	dz = V1[2]-V2[2];
	var v2 = dx*dx+dy*dy+dz*dz;
	var v = Math.exp(0.5*Math.log(v2));
	  
	if(T.length != 0){
		for(var i=0;i<T.length;i++){
			if (T[i].TokId==TOK_SYM){
				switch(T[i].Sym){
					case 'T': TL[i].TokId=TOK_NUM;
						TL[i].Num=t;
						break;
				  	case 'r': TL[i].TokId=TOK_NUM;
						 TL[i].Num=r;
					 	break;
				  	case 'v': TL[i].TokId=TOK_NUM;
						 TL[i].Num=v;
					 	break;

				  				  
				  	case 'X':
						if(T[i+1].TokId!=TOK_SYM) 
							break; 
					 	else if(T[i+1].Sym=='m')
							TL[i].Num=R1[0];
					 	else if(T[i+1].Sym=='s')
							TL[i].Num=R2[0];
					 	else 
					 		break;
					 	TL[i].TokId=TOK_NUM;
					 	TL[i+1].TokId=TOK_SYM;
					 	TL[i+1].Sym=' ';
					 	i++;
					 	break;
				  	case 'Y':
						if(T[i+1].TokId!=TOK_SYM) 
							break; 
					 	else if(T[i+1].Sym=='m')
							TL[i].Num=R1[1];
					 	else if(T[i+1].Sym=='s')
							TL[i].Num=R2[1];
					 	else 
					 		break;
					 	TL[i].TokId=TOK_NUM;
					 	TL[i+1].TokId=TOK_SYM;
					 	TL[i+1].Sym=' ';
					 	i++;
					 	break;
				  	case 'Z':
						if(T[i+1].TokId!=TOK_SYM) 
							break; 
					 	else if(T[i+1].Sym=='m')
							TL[i].Num=R1[2];
					 	else if(T[i+1].Sym=='s')
							TL[i].Num=R2[2];
					 	else 
					 		break;
					 	TL[i].TokId=TOK_NUM;
					 	TL[i+1].TokId=TOK_SYM;
					 	TL[i+1].Sym=' ';
					 	i++;
					 	break;
		  
				  	case 'U':
						if(T[i+1].TokId!=TOK_SYM) 
							break; 
					 	else if(T[i+1].Sym=='m')
							TL[i].Num=V1[0];
					 	else if(T[i+1].Sym=='s')
							TL[i].Num=V2[0];
					 	else
					 		break;
					 	TL[i].TokId=TOK_NUM;
					 	TL[i+1].TokId=TOK_SYM;
					 	TL[i+1].Sym=' ';
					 	i++;
					 	break;
				  	case 'V':
						if(T[i+1].TokId!=TOK_SYM) 
							break; 
					 	else if(T[i+1].Sym=='m')
							TL[i].Num=V1[1];
					 	else if(T[i+1].Sym=='s')
							TL[i].Num=V2[1];
					 	else 
					 		break;
					 	TL[i].TokId=TOK_NUM;
					 	TL[i+1].TokId=TOK_SYM;
					 	TL[i+1].Sym=' ';
					 	i++;
					 	break;
				  	case 'W':
						if(T[i+1].TokId!=TOK_SYM) 
							break; 
					 	else if(T[i+1].Sym=='m')
							TL[i].Num=V1[2];
					 	else if(T[i+1].Sym=='s')
							TL[i].Num=V2[2];
					 	else 
					 		break;
					 	TL[i].TokId=TOK_NUM;
					 	TL[i+1].TokId=TOK_SYM;
					 	TL[i+1].Sym=' ';
					 	i++;
					 	break;
			  
				  	case 'M':
						if(T[i+1].TokId!=TOK_SYM) 
							break; 
					 	else if(T[i+1].Sym=='m')
							TL[i].Num=M1;
					 	else if(T[i+1].Sym=='s')
							TL[i].Num=M2;
					 	else 
					 		break;
					 	TL[i].TokId=TOK_NUM;
					 	TL[i+1].TokId=TOK_SYM;
					 	TL[i+1].Sym=' ';
					 	i++;
					 	break;
				  	case 'Q':
						if(T[i+1].TokId!=TOK_SYM) 
							break; 
					 	else if(T[i+1].Sym=='m')
							TL[i].Num=Q1;
					 	else if(T[i+1].Sym=='s')
							TL[i].Num=Q2;
					 	else 
					 		break;
					 	TL[i].TokId=TOK_NUM;
					 	TL[i+1].TokId=TOK_SYM;
					 	TL[i+1].Sym=' ';
					 	i++;
					 	break;
				  	case 'D':
						if(T[i+1].TokId!=TOK_SYM) 
							break; 
					 	else if(T[i+1].Sym=='m')
							TL[i].Num=Rad1;
					 	else if(T[i+1].Sym=='s')
							TL[i].Num=Rad2;
					 	else 
					 		break;
					 	TL[i].TokId=TOK_NUM;
					 	TL[i+1].TokId=TOK_SYM;
					 	TL[i+1].Sym=' ';
					 	i++;
					 	break;

				  	default:  
				  		TL[i].TokId=TOK_SYM;
					  	TL[i].Sym=T[i].Sym;
					 	break;
				}
			}
			else if(T[i].TokId==TOK_NUM) {
				TL[i].TokId=TOK_NUM;
				TL[i].Num=T[i].Num;
			}
		}
		for(var i=0;i<TL.length;i++)
			if ((TL[i].TokId==TOK_SYM)&&(TL[i].Sym==' ')) 
				TL.splice(i,1);

	}
	TL = Evaluate(TL);
	Result = ERROR;
	if(TL.length == 1) 
		if(TL[0].TokId == TOK_NUM)
			Result = TL[0].Num;

	return Result;
}

function fPIN(Input, R, V, t){
	var Result=0.0;

	var str = '  '+Input+'  ';
	var T = MakeTokenList(str, T);
	var TL = new Array(T.length);
	for(var i=0;i<T.length;i++)
		TL[i]=[];
	  
	if(T.length != 0){
		for(var i=0;i<T.length;i++){
			if (T[i].TokId==TOK_SYM){
				switch(T[i].Sym){
					case 'T': TL[i].TokId=TOK_NUM;
						TL[i].Num=t;
						break;
				  	case 'r': TL[i].TokId=TOK_NUM;
						 TL[i].Num=Math.exp(0.5*Math.log(R[0]*R[0]+R[1]*R[1]+R[2]*R[2]));
					 	break;
				  	case 'v': TL[i].TokId=TOK_NUM;
						 TL[i].Num=Math.exp(0.5*Math.log(V[0]*V[0]+V[1]*V[1]+V[2]*V[2]));
					 	break;
			  				  
				  	case 'X': TL[i].TokId=TOK_NUM;
				  		TL[i].Num=R[0];
					 	break;
				  	case 'Y': TL[i].TokId=TOK_NUM;
				  		TL[i].Num=R[1];
					 	break;
				  	case 'Z': TL[i].TokId=TOK_NUM;
				  		TL[i].Num=R[2];
					 	break;
				  	
		  
				  	case 'V':
						if(T[i+1].TokId!=TOK_SYM) 
							break; 
					 	else if(T[i+1].Sym=='x')
							TL[i].Num=V[0];
					 	else if(T[i+1].Sym=='y')
							TL[i].Num=V[1];
					 	else if(T[i+1].Sym=='z')
							TL[i].Num=V[2];
					 	else
					 		break;
					 	TL[i].TokId=TOK_NUM;
					 	TL[i+1].TokId=TOK_SYM;
					 	TL[i+1].Sym=' ';
					 	i++;
					 	break;
				  	default:  
				  		TL[i].TokId=TOK_SYM;
					  	TL[i].Sym=T[i].Sym;
					 	break;
				}
			}
			else if(T[i].TokId==TOK_NUM) {
				TL[i].TokId=TOK_NUM;
				TL[i].Num=T[i].Num;
			}
		}
		for(var i=0;i<TL.length;i++)
			if ((TL[i].TokId==TOK_SYM)&&(TL[i].Sym==' ')) 
				TL.splice(i,1);

	}
	TL = Evaluate(TL);
	Result = ERROR;
	if(TL.length == 1) 
		if(TL[0].TokId == TOK_NUM)
			Result = TL[0].Num;

	return Result;
}

function MakeTokenList(str, T){     
	var T=[];                                
	var ch;
	var j=1;
	var ii=0, i=0;
	var len = str.length;
			
	while(i<len){
		ch = str.charAt(i);
		switch (ch){
			case '(':	  case ')':	  case '*':	  case '/':
			case '-':	  case '+':	  case '^':	  case '|':
			case 'T':	  case 'E':	  case 'B':	  case 'G':
			case 'X':	  case 'Y':	  case 'Z':	  case 'K':
			case 'V':	  case 'P':	  case 'Q':	  case 'M':
			case 'U':	  case 'W':   case 'D':	  case 'm':
			case 'x':	  case 'y':	  case 'z':	  case 'c':
			case 'e':	  case 'o':	  case 's':	  case 'i':
			case 'n':	  case 'p':	  case 'l':	  case 'h':   case 'v':
			case 'r':	  case '{':   case '}':	  case '#':
				T[ii]=[];
				T[ii].TokId=TOK_SYM;
				T[ii].Sym=ch;
				i++;
				ii++;
				break;
			case '0':	  case '1':	  case '2':	  case '3':
			case '4':	  case '5':	  case '6':	  case '7':
			case '8':	  case '9':	  case '.':
				T[ii]=[];
				T[ii].TokId=TOK_NUM;
				T[ii].Num=0;
				if(ch == '.'){
					i++;
					ch = str.charAt(i);
					while(ch >= '0' && ch <= '9' && i<len){	
						j*=10.0;
						T[ii].Num+=(ch-'0')/j;
						i++;
						ch=str.charAt(i);
					}
					j=1;
					ii++;
					break;
				} 
				while(ch >= '0' && ch <= '9' && i<len){
					T[ii].Num*=10.0;
					T[ii].Num+=(ch-'0');
					i++;
					ch=str.charAt(i);
				}
		 		if(ch == '.'){
					i++;
					ch = str.charAt(i);
					while(ch >= '0' && ch <= '9' && i<len){	
						j*=10.0;
						T[ii].Num+=(ch-'0')/j;
						i++;
						ch=str.charAt(i);														
					}
					j=1;
				}		
				ii++;
				break;
					
			case ' ':	  
				i++;
				break;
			default:
				T=[]; 
				return T;
		}
	}
	return T;
}


function IsNum(T){
	if(T.TokId == TOK_NUM) 
		return true;
	return false;
}
	
function IsSym(T, Ch){
	if(T.TokId == TOK_SYM && T.Sym==Ch) 
		return true;
	return false;
}

	

function Evaluate(T){
	var i,k,j;
	var Flag = true;
		
	while (Flag){
		Flag=false;
		for(i=0;i<T.length-6;i++)
			if (IsSym(T[i],'{')&&IsNum(T[i+1])&&IsSym(T[i+2],'#')&&IsNum(T[i+3])&&IsSym(T[i+4],'#')&&IsNum(T[i+5])&&IsSym(T[i+6],'}')){
				var D=0;
				if(T[i+1].Num<=T[i+3].Num && T[i+3].Num<=T[i+5].Num) 
					D=1;
				T[i].Num=D;
				T[i].TokId=TOK_NUM;
				T.splice(i+1,6);
				Flag=true;
			}
		if(Flag) continue;

		Flag=false;
		for(i=0;i<T.length-2;i++)
			if (IsSym(T[i],'|')&&IsNum(T[i+1])&&IsSym(T[i+2],'|')){
				T[i].Num=Math.abs(T[i+1].Num);
				T[i].TokId=TOK_NUM;
				T.splice(i+1,2);
				Flag=true;
			}
		if(Flag) continue;

		Flag=false;
		for(i=0;i<T.length-2;i++)
			if (IsNum(T[i])&&IsSym(T[i+1],'^')&&IsNum(T[i+2])){
				if (T[i].Num<0)	
					return T;
				T[i].Num=Math.exp(T[i+2].Num*Math.log(T[i].Num));
				T.splice(i+1,2);
				Flag=true;
			}
		if(Flag) continue;

		Flag=false;
		for(i=0;i<T.length-1;i++)
			if (IsSym(T[i],'p')&&IsSym(T[i+1],'i')){
				T[i].Num=PI;
				T[i].TokId=TOK_NUM;
				T.splice(i+1,1);
				Flag=true;
			}
		if(Flag) continue;

		Flag=false;
		for(i=0;i<T.length;i++)
			if (IsSym(T[i],'e')){
				T[i].Num=E;
				T[i].TokId=TOK_NUM;
				Flag=true;
			}
		if(Flag) continue;

		Flag=false;
		for(i=0;i<T.length-4;i++)
			if (IsSym(T[i],'l')&&IsSym(T[i+1],'n')&&IsSym(T[i+2],'(')&&IsNum(T[i+3])&&IsSym(T[i+4],')')){
				if (T[i+3].Num<0)
					return T;
				T[i].Num=Math.log(T[i+3].Num);
				T[i].TokId=TOK_NUM;
				T.splice(i+1,4);
				Flag=true;
			}
		if(Flag) continue;

		Flag=false;
		for(i=0;i<T.length-5;i++)
			if (IsSym(T[i],'c')&&IsSym(T[i+1],'o')&&IsSym(T[i+2],'s')&&IsSym(T[i+3],'(')&&IsNum(T[i+4])&&IsSym(T[i+5],')')){
				T[i].Num=Math.cos(T[i+4].Num);
				T[i].TokId=TOK_NUM;
				T.splice(i+1,5);
				Flag=true;
			}
		if(Flag) continue;

		Flag=false;
		for(i=0;i<T.length-5;i++)
			if (IsSym(T[i],'s')&&IsSym(T[i+1],'i')&&IsSym(T[i+2],'n')&&IsSym(T[i+3],'(')&&IsNum(T[i+4])&&IsSym(T[i+5],')')){
				T[i].Num=Math.sin(T[i+4].Num);
				T[i].TokId=TOK_NUM;
				T.splice(i+1,5);
				Flag=true;
			}
		if(Flag) continue;

		Flag=false;
		for(i=0;i<T.length-2;i++)
			if (IsNum(T[i])&&IsSym(T[i+1],'*')&&IsNum(T[i+2])){
				T[i].Num*=T[i+2].Num;
				T.splice(i+1,2);
				Flag=true;
			}
		if(Flag) continue;

		Flag=false;
		for(i=0;i<T.length-2;i++)
			if (IsNum(T[i])&&IsSym(T[i+1],'/')&&IsNum(T[i+2])){
				if (T[i+2].Num<0)
					return T;
				T[i].Num/=T[i+2].Num;
				T.splice(i+1,2);
				Flag=true;
			}
		if(Flag) continue;

		Flag=false;
		for(i=0;i<T.length-3;i++)
			if(IsSym(T[i],'(')&&IsSym(T[i+1],'-')&&IsNum(T[i+2])){
				T[i+2].Num=-T[i+2].Num;
				T.splice(i+1,1);
				Flag=true;
			}		
		if (Flag) continue;

		Flag=false;
		for (i=0;i<T.length-2;i++)
			if(IsSym(T[i],'(')&&IsNum(T[i+1])&&IsSym(T[i+2],')')){
				T[i].Num=T[i+1].Num;
				T[i].TokId=TOK_NUM;
				T.splice(i+1,2); 
				Flag=true;
			}
		if(Flag) continue;

		Flag=false;
		if(IsSym(T[0],'-')&&IsNum(T[1])){
			T[1].Num=-T[1].Num;
			T.splice(0,1);
			Flag=true;
		}
		if (Flag) continue;

		Flag=false;
		for(i=0;i<T.length-4;i++)
			if(IsSym(T[i],'(')&&IsNum(T[i+1])&&IsSym(T[i+2],'+')&&IsNum(T[i+3])&&!IsSym(T[i+4],'*')&&!IsSym(T[i+4],'/')){
				T[i+1].Num+=T[i+3].Num;
				T.splice(i+2,2);
				Flag=true;
			}
		if(Flag) continue;

		Flag=false;
		for(i=0;i<T.length-4;i++)
			if(IsSym(T[i],'(')&&IsNum(T[i+1])&&IsSym(T[i+2],'-')&&IsNum(T[i+3])&&!IsSym(T[i+4],'*')&&!IsSym(T[i+4],'/')){
				T[i+1].Num-=T[i+3].Num;
				T.splice(i+2,2);
				Flag=true;
			}
		if(Flag) continue;
			
		Flag=false;
		for(i=0;i<T.length-2;i++)
			if(IsNum(T[i])&&IsSym(T[i+1],'-')&&IsNum(T[i+2])){
				T[i].Num-=T[i+2].Num;
				T.splice(i+1,2);
				Flag=true;
			}
		if(Flag) continue;

		Flag=false;
		for(i=0;i<T.length-2;i++)
			if(IsNum(T[i])&&IsSym(T[i+1],'+')&&IsNum(T[i+2])){
				T[i].Num+=T[i+2].Num;
				T.splice(i+1,2);
				Flag=true;
			}
	}
	return T;
}
