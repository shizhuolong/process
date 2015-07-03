
//状态转换方法
function getStatusName(status) {
	var statusName = "";
	switch(status) {
		case 1:
			statusName = "审批中";
			break;
		case 2:
			statusName = "等待领取";
			break;
		case 3:
			statusName = "已作废";
			break;
		case 4:
			statusName = "<font color='green'>已领取</font>";
			break;
		case 5:
			statusName = "<font color='red'>已拒绝</font>";
			break;
		case 6:
			statusName = "已下发";
			break;
		default:
			statusName = "没定义的状态";
	}
	return statusName;
}

//浮点数相加 
function dcmAdd(arg1,arg2){
    var r1,r2,m; 
    try{r1=arg1.toString().split(".")[1].length;}catch(e){r1=0;}
    try{r2=arg2.toString().split(".")[1].length;}catch(e){r2=0;}
    m=Math.pow(10,Math.max(r1,r2));
    return (accMul(arg1,m)+accMul(arg2,m))/m;
}

//浮点数相减  
function dcmSub(arg1,arg2){ 
     return dcmAdd(arg1,-arg2);
}
/* 乘法函数，用来得到精确的乘法结果
说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
调用：accMul(arg1,arg2)
返回值：arg1乘以arg2的精确结果
*/
function accMul(arg1,arg2){
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{m+=s1.split(".")[1].length;}catch(e){}
    try{m+=s2.split(".")[1].length;}catch(e){}
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
} 