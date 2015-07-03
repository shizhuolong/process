package org.apdplat.selfrpt.util;

import org.apdplat.selfrpt.model.Excel;
import org.apdplat.selfrpt.model.Report;


public class StringUtil {
	public static String getRptSql(Report r) {
		String frameID=r.getFrameID();
		String levelMain=r.getLevels();
		String levelTable=r.getLevelsTable();
		String isFirst=r.getIsFirst();
		String sql=r.getSql();
		String selConfig=r.getSelConfig();
		sql = sql.toLowerCase(); 
		sql = sql.replaceAll("\n", " ");
		sql = sql.replaceAll("=", " = ");
		sql = sql.replaceAll(" {2,}", " "); 
		// 为了更通用，需要获取下拉框码表的 tableName
		String tableName = "", id = "", name = "";
		if (frameID.equals("101")|| frameID.equals("110") ) {
			tableName = "";
			id = "";
			name = "";
		} else if (frameID.equals("102")) {
			tableName = "pods.t_cde_chl_cls_tree";
			id = "chn_cde";
			name = "chn_name";
			sql=sql.replaceAll("b.order_id", "1");//删除营销架构的排序字段
		} else if (frameID.equals("103")) {
			tableName = "pods.t_cde_pdt_cls_tree";
			id = "pdt_id";
			name = "pdt_name";
			sql=sql.replaceAll("b.order_id", "1");//删除营销架构的排序字段 
		}
		String groupIndex=getGroupIndex(sql);//获取sql分组(结果表)数字下标,省分报表从0开始,地市报表从1开始 
		if (!tableName.equals("")) {
			sql = sql.replaceAll("pods.t_cde_chl_msg_tree", tableName);
			sql = sql.replaceAll("group_id", id);
			sql = sql.replaceAll("group_name", name);
		}   
		if(groupIndex.equals("-1")){  
			if(levelMain.equals("0")){
				levelMain=Integer.valueOf(levelMain)+2+"";
			} 
			sql = sql.replaceAll(id + "_1", id + "_" + (levelMain));
		}else{
			sql = sql.replaceAll(id + "_"+groupIndex, id + "_" + (levelMain));
		} 
		String select = sql.substring(0, sql.lastIndexOf("from"));
		String from="",where="",group="";
		if(sql.indexOf("where")>=0){
			select = sql.substring(0, sql.lastIndexOf("from"));
			from = sql.substring(sql.lastIndexOf("from") , sql.lastIndexOf("where")).trim();  
			where = sql.substring(sql.lastIndexOf("where"), sql.lastIndexOf("group by")); 
		}else{
			 
		}
		group = sql.substring(sql.lastIndexOf("group by"), sql.length()); 
		if(!levelTable.equals("")){
			if(groupIndex.equals("0")){
				from=from.replaceAll("_0", "_" + (levelTable));
			}else{
				int levelTable2=Integer.valueOf(levelTable);
				if(levelTable2>1 && isFirst.equals("1")){ 
				}else{
					levelTable2=Integer.valueOf(levelMain)+1;
				}
				String from1=from.substring(from.lastIndexOf("from") , from.lastIndexOf("join"));
				String from2=from.substring(from.lastIndexOf("join") , from.length());
				from1=from1.replaceAll("_1", "_" + levelTable2);//(Integer.valueOf(levelMain)+1)
				from=from1+from2; 
			}
		}
		String[] where2 = where.split("#");
		String  wheres = where2[0], andOr = ""; 
		System.out.println("--levelMain="+levelMain+",levelTable="+levelTable+",groupIndex="+groupIndex+",from="+from);
		String[] selConfigs = selConfig.split("@");
		for (int i = 0; i < selConfigs.length; i++) {
			String tmp[] = selConfigs[i].split(";");
			if (tmp[0].equals("s")) { 
				if (where2[i].lastIndexOf("and") >= 0) { // 若首个不是and
					andOr = " and ";// 有or？会被后面截掉覆盖
				} else if (i < selConfigs.length - 1) {// 最后一个不能加
					andOr = " or ";
				}
				if (tmp[4].equals("''") || tmp[4].equals("")) {
					wheres += andOr + "1=1";
				} else {
					tmp[4] = tmp[4].replaceAll(",", "','"); 
					if ("101,110".indexOf(tmp[1]) >= 0) {// 营销架构和最后1个父级 level=level-1 i == selConfigs.length - 1 || 
						if ((tmp[4].equals("40000001") || tmp[4].equals(""))) {// 营销架构查询条件,levels不变
							if(!groupIndex.equals("-1")){
								tmp[3] = "0";
							}else{
								tmp[3] = "1";//地市纵表省从1开始? @s;101;group_id;0;16109
							} 
						}else if(i == selConfigs.length - 1 && Integer.valueOf(tmp[3])>0 && i>1){//省分报表,最后一个是下钻,需-1
							tmp[3] = String.valueOf(Integer.valueOf(tmp[3]) - 1); //暂时注释
							 
							if(Integer.valueOf(tmp[3])<Integer.valueOf(groupIndex) && !tmp[4].equals("40000001")){// 
								tmp[3]=groupIndex;
							}
							if(groupIndex.equals("-1")){
								tmp[3] = String.valueOf(Integer.valueOf(levelMain));
							}  							
						}else{
							tmp[3]=String.valueOf(Integer.valueOf(tmp[3]) - Integer.valueOf(groupIndex));
						}
					}
						wheres += andOr + tmp[2] + "_" + tmp[3] + " in ('" + tmp[4] + "')";
				}
			} else { 
				if(!tmp[1].equals("''") && !tmp[1].equals("")){ 
					wheres += "'" + tmp[1] + "'";
				}				
			}
		} 
		sql = select + from + wheres + group; 
		return sql;
	}
	
	//非下钻，直接替换符号即可
	public static String getRptSql2(Report r) { 
		String sql=r.getSql();
		String selConfig=r.getSelConfig();
		
		String selConfigs[]=selConfig.split("@");
		sql = sql.replaceAll("\n", " ");
		sql = sql.replaceAll(" {2,}", " ");
		sql = sql.replaceAll(" =", "="); // 删除空格,便于定位
		sql = sql.replaceAll("//WHERE", "where");// 保持原样，便于核对SQL?
		sql = sql.replaceAll("//AND", "and");// 保持原样
		sql = sql.replaceAll("//OR", "or");// 保持原样
		sql = sql.replace("where", "where 1=1 and"); // 规律化,防止替换报错
		String temp = "", signType = "", value = "";
		String sqlArr[] = sql.split("\\#"); 
		String sql2 = sqlArr[0];
		String andOr = "";
		for (int i = 1; i < sqlArr.length; i++) {
			temp = sqlArr[i].trim();
			String []dataTemp=selConfigs[i-1].split(";");
			signType = temp.substring(0, 1);
			value = ""; 
			if (signType.equals("s")) { 
				if (!dataTemp[4].equals("''") && !dataTemp[4].equals("")) { 
					value = "('" + dataTemp[4].replaceAll(",", "','") + "')";
				}
			} else if ("d,n".indexOf(signType) >= 0) { 
				if (!dataTemp[1].equals("''") && !dataTemp[1].trim().equals("''")) { 
					value = "'" + dataTemp[1] + "'";
				}
			} else if ("c".indexOf(signType) >= 0) {// 模糊查询 
				if (!dataTemp[1].trim().equals("''") && !dataTemp[1].trim().equals("''")) { 
					value = "'%" + dataTemp[1].trim() + "%'";
				}
			}
			if (!value.equals("")) {
				sqlArr[i] = sqlArr[i].substring(1, sqlArr[i].length());
				temp = value + sqlArr[i];
			} else {
				sql2 = sql2.trim();
				if (sqlArr[i - 1].lastIndexOf("and") >= 0) { // 若首个不是and 有or？会被后面截掉覆盖
					andOr = "and";
				} else {
					andOr = "or";
				}
				sql2 = sql2.substring(0, sql2.lastIndexOf(andOr)); // 删除上一个and或or
				temp = andOr + " 1=1 " + sqlArr[i].substring(1, sqlArr[i].length()); // 保留下一个and或or
			}
			sql2 += temp;
		}
		sql2 = sql2.replace("where 1=1 and", " where ");// 还原
		sql2 = sql2.replaceAll("=", " = "); // 还原空格
		sql2 = sql2.replaceAll(" {2,}", " ");
		return sql2;
	}
	
	//非下钻，直接替换符号即可
	public static String getRptSql3(Excel e) {  
		String colNames[] = e.getColNames().split(";");
		String whereInfo[] = e.getWhereInfo().split(";");
		String selConfig[] = e.getSelConfig().split("@"); 
		String where = "", signType = "", value = "";
		String reportID=e.getReportID();
		for (int i = 0; i < selConfig.length; i++) {
			if (!whereInfo[i].equals("0")) { 
				String[] dataTemp = selConfig[i].split(";");
				signType = dataTemp[0];
				value = "";
				if ("s".indexOf(signType) >= 0) { 
					if (!dataTemp[4].equals("''") && !dataTemp[4].equals("")) { 
						value = " in('" + dataTemp[4].replaceAll(",", "','") + "')";
					}
				} else if ("d,n".indexOf(signType) >= 0) { 
					if (!dataTemp[1].trim().equals("''") && !dataTemp[1].trim().equals("")) {  
						value = " = '" + dataTemp[1] + "'";
						if(reportID.equals("164") && whereInfo[i].indexOf("yyyy-MM-dd")>0){
							value = " like '%" + dataTemp[1] + "%'";
						}
					}
				} else if ("c2,c3".indexOf(signType) >= 0) { //c2智能匹配,c3数据权限 
					if (!dataTemp[1].trim().equals("''") && !dataTemp[1].trim().equals("")) { 
						if((signType.equals("c2") && dataTemp[2].equals("1")) ||  signType.equals("c3")){//精确匹配 //"c2".indexOf(selConfig[i].substring(0, 2))>= 0 && 
							value = " in ('" + dataTemp[1].replaceAll(",", "','") + "')"; //.trim(),不能删除，否则in查询不到
						}else{// 模糊匹配 
							value = " like '%" + dataTemp[1].trim() + "%'";
						} 
					}
				}  
				
				if (!value.equals("")) {
					where += " and " + colNames[i] + value;
				} else {
					where += " and 1=1";
				}
			}
		}
		return where;
	}
	
	public static String getDateColName(Excel e) {   
		String colNames[] = e.getColNames().split(",");
		String whereInfo[] = e.getWhereInfo().split(";"); 
		String signType = "";
		for (int i = 0; i < whereInfo.length; i++) {
			if (!whereInfo[i].equals("0")) {  
				signType = whereInfo[i].substring(0, 1); 
				if ("d".indexOf(signType) >= 0) {  
					return colNames[i];
				}  
			}
		} 
		return "";
	}
	
	public static String getDateColVale(String selConfig) {   //分区使用首个月份
		String selConfigs[]=selConfig.split("@");  
		for (int i = 0; i < selConfigs.length; i++) { 
			String []temp=selConfigs[i].split(";");  
			if ("d".indexOf(temp[0]) >= 0 && temp[1].length()==6) { //首个月份
				return temp[1]; 
			}   
		} 
		return "";
	}
	
	
	public static String getTableName(String sql) {
		sql = sql.toLowerCase(); 
		sql = sql.replaceAll("\n", " ");
		sql = sql.replaceAll("=", " = ");
		sql = sql.replaceAll(" {2,}", " "); 
		String from = sql.substring(sql.lastIndexOf("from")+4 , sql.length()).trim(); //删除form前
		if(from.indexOf("where")>=0){ //删除where
			from = from.substring(0,from.lastIndexOf("where")).trim();
		}
		if(from.indexOf("group")>=0){ //删除group
			from = from.substring(0,from.lastIndexOf("group")).trim();
		}
		from=from.trim();
		if(from.indexOf(" ")>0){
			String from1 = from.substring(0 , from.indexOf(" ")); //删除表别名
			String from2=from.substring(from.indexOf(" ")+1,from.length());
			from2=from2.trim();
			if(from2.indexOf(" ")==-1){ //单表，没有关联其他表
				if(from1.indexOf(".")>0){//有数据库名
					if(from1.indexOf("@")>=0){
						from=from1.substring(0,from1.indexOf("@"));
					}
					return from1;
				}
			}
		}else{
			return from;
		} 
		return "";   
	}
	
	public static String getGroupIndex(String sql) {
		sql = sql.toLowerCase(); 
		sql = sql.replaceAll("\n", " ");
		sql = sql.replaceAll("=", " = ");
		sql = sql.replaceAll(" {2,}", " ");		
		String groupIndex="-1"; //获取sql分组(结果表)数字下标,省分报表从0开始 ,地市报表从1开始(中文表结尾也是1开始?) 
		if(sql.indexOf("group by")>=0){
			String group=sql.substring(sql.indexOf("group"),sql.length());  
			if(group.indexOf("group_id")>=0){
				String groupidIndex=group.substring(group.indexOf("group_id_")+9,group.indexOf("group_id_")+10);
				groupIndex=groupidIndex;
			} 
		} 
		return groupIndex;
	}
	
	
	//下拉框码表和图片配置
	public static String replaceSql(String sql, String nextData) { 
		if(nextData.indexOf(":")>0){//参数字段名:字段值
			sql=replaceSql1( sql, nextData);
		}else{
			sql=replaceSql2( sql, nextData);
		}
		return sql;
	}
	
	@SuppressWarnings("unused")
	public static String replaceSql1(String sql, String nextData) { 
		if (nextData == null) {
			nextData = "";
		}
		String nextDatas[] = nextData.split(";");
		sql = formatSql2(sql);
		sql = sql.toLowerCase();
		System.out.println("替换前sql=" + sql);
		String temp = "", colName = "", value = "";
		String sqlArr[] = sql.split("=:"); 
		String sql2 = sqlArr[0]; 
		for (int i = 1; i < sqlArr.length; i++) {
			temp=sqlArr[i - 1].trim();
			colName = temp.substring(temp.lastIndexOf(" ") + 1, temp.length()); 
			value = "";
			for(int j=0;j<nextDatas.length;j++){
				String[] temp2 = nextDatas[j].split(":");
				System.out.println("colName=" + colName+",temp2[0]="+temp2[0]);				
				value = temp2[1];
				break;
			} 
			if(sqlArr[i].indexOf(" ")>0){
				temp = sqlArr[i].substring(0, sqlArr[i].indexOf(" "));
			}else{
				temp = sqlArr[i];
			}
			if (value.equals("")) { 
				value = temp.replaceAll("'", "");
			}
			value = "'" + value.replaceAll(",", "','") + "'";  //不替换,拼接sql时含字符间隔?
			if(sqlArr[i].indexOf(" ")>0){
				sqlArr[i] = sqlArr[i].substring(sqlArr[i].indexOf(" "), sqlArr[i].length());
				
			}else{
				sqlArr[i] ="";
			}
			temp = " in (" + value + ") " + sqlArr[i]; 
			sql2 += temp; 
		} 
		System.out.println("替换后sql=" + sql2);
		return sql2;
	}
	
	public static String replaceSql2(String sql, String nextData) { 
		if (nextData == null) {
			nextData = "";
		}
		String nextDatas[] = nextData.split(",");
		sql = formatSql2(sql);
		System.out.println("替换前sql=" + sql);
		String temp = "", sql2 = "";
		String sqlArr[] = sql.split(":");
		sql2 = sqlArr[0];  
		for (int i = 1; i < sqlArr.length; i++) { 
			temp = sqlArr[i].substring(0, sqlArr[i].indexOf(" ")); 
			sqlArr[i] = sqlArr[i].substring(sqlArr[i].indexOf(" "), sqlArr[i].length());
			temp = "'" + nextDatas[i - 1] + "' " + sqlArr[i]; 
			sql2 = sql2 + " " + temp; 
		}
		System.out.println("替换后sql=" + sql2);
		return sql2;
	}
	
	public static String replaceSql3(String sql, String nextData) {//nextData用户归属地  
		if (nextData == null) {
			nextData = "";
		}
		String nextDatas[] = nextData.split(",");
		sql = formatSql2(sql);
		System.out.println("替换前sql=" + sql);
		String temp = "", sql2 = "";
		String sqlArr[] = sql.split(":");
		sql2 = sqlArr[0];  
		for (int i = 1; i < sqlArr.length; i++) { 
			temp = sqlArr[i].substring(0, sqlArr[i].indexOf(" ")); 
			sqlArr[i] = sqlArr[i].substring(sqlArr[i].indexOf(" "), sqlArr[i].length());
			if(!nextDatas[i - 1].equals("40000001")){
				temp = "'" + nextDatas[i - 1] + "' " + sqlArr[i];  
			}else{ //省用户不作限制
				sql2=sql2.trim();
				sql2=sql2.substring(0,sql2.lastIndexOf(" "));//删除归属地条件
				temp=" 1=1 "+ sqlArr[i]; ;
			}
			sql2 = sql2 + " " + temp; 
		}
		System.out.println("替换后sql=" + sql2);
		return sql2;
	}
	
	 //查询条件配置
	public static String replaceSql4(String sql, String sql1, String loginno) {//nextData用户归属地  
		sql = formatSql2(sql);
		System.out.println("替换前sql=" + sql);
		String temp = "", sql2 = "";
		String sqlArr[] = sql.split("=:");
		sql2 = sqlArr[0];  
		for (int i = 1; i < sqlArr.length; i++) {  
			sqlArr[i] = sqlArr[i].substring(sqlArr[i].indexOf(" "), sqlArr[i].length()); 
			if(i==1){
				temp = " in (" + sql1 + ") " + sqlArr[i];  
			}else if(i==2){ 
			} 
			sql2 = sql2 + " " + temp; 
		}
		System.out.println("替换后sql=" + sql2);
		return sql2;
	}
	
	public static String replaceSql5(String sql,  String loginno) {//nextData用户归属地  
		sql = formatSql2(sql);
		System.out.println("替换前sql=" + sql);
		String temp = "", sql2 = "";
		String sqlArr[] = sql.split("=:");
		sql2 = sqlArr[0];  
		sql2=sql2.replaceAll("AND", "and");
		if(sql2.indexOf("and")>0){//删除第一个下钻where条件
		   sql2=sql2.substring(0,sql2.lastIndexOf("and"));//没传递值,删除  and t1.type_id =: '1' 
		}else{
			sql2=sql2.trim();
			sql2 = sql2.substring(0, sql2.lastIndexOf(" "))+" 1=1 "; 
		}
		System.out.println("sqlArr[0]" + sql2);
		for (int i = 1; i < sqlArr.length; i++) {  
			if(sqlArr[i].indexOf(" ")>0){ //可以没有order by 结尾
				sqlArr[i] = sqlArr[i].substring(sqlArr[i].indexOf(" "), sqlArr[i].length()); 
			}else{
				sqlArr[i]="";//仅值比如'admin'，舍弃.
			} 
			System.out.println("sqlArr["+i+"]" + sqlArr[i]);
			if(i==1 && !loginno.equals("admin")){ //管理员不限制, 查看所有导入用户?
				temp =  sqlArr[i]+" in ('" + loginno + "') "; 
				sql2 = sql2 + " " + temp; 
			}else if(i==2){
				temp =  sqlArr[i];
			} 
			
		}
		System.out.println("替换后sql=" + sql2);
		return sql2;
	}
	
	public static String getSelConfig(String selConfig, int end) { //获取智能匹配第1到第end个，清除其他智能匹配的值
		String sels[] = selConfig.split("@");
		selConfig = "";
		boolean isAdd = true;
		for (int i = 0; i < sels.length; i++) {
			String tmp[] = sels[i].split(";");
			if (i > end) {// 智能匹配查询 break不能退出 ,否则后面的日期等类型的查询条件无法获取?
				isAdd = false;
			}
			if (tmp[0].equals("c2") && tmp[1] != null && !tmp[1].equals("")) {
				if (!isAdd) {// 删除值
					sels[i] = tmp[0] + ";'';" + tmp[2];
				}
			}
			selConfig += sels[i] + "@";
		}
		if (selConfig.length() > 1) {
			selConfig = selConfig.substring(0, selConfig.length() - 1);
		}
		return selConfig;
	}
	
	public static String delSelConfig(String selConfig, int index) { //删除第index个智能匹配的值
		String sels[] = selConfig.split("@");
		selConfig = ""; 
		for (int i = 0; i < sels.length; i++) {
			String tmp[] = sels[i].split(";"); 
			if (tmp[0].equals("c2") && tmp[1] != null && !tmp[1].equals("")) {
				if (i==index) {// 删除值
					sels[i] = tmp[0] + ";'';" + tmp[2];
				}
			}
			selConfig += sels[i] + "@";
		}
		if (selConfig.length() > 1) {
			selConfig = selConfig.substring(0, selConfig.length() - 1);
		}
		return selConfig;
	}
	
	//测试sql使用
	public static String formatSql(String sql) { 
		sql = sql.replaceAll("\\##", "\\%"); //还原%  
		sql = sql.replaceAll("''", "'");//mysql
		sql = sql.toLowerCase();			
		sql = sql.replaceAll("\\#d", "''"); //替换符号 "20130726"
		sql = sql.replaceAll("\\#s", "('')");
		sql = sql.replaceAll("\\#c", "'%%'");
		sql = sql.replaceAll("\\#n", "''");
		return sql;
	}
	public static String formatSql2(String sql) { 
		if (sql == null) {
			sql = "";
		} 
		sql = sql.replaceAll("\n", " ");
		sql = sql.replaceAll(" {2,}", " ");
		sql = sql.replaceAll(": ", ":");
		sql = sql.replaceAll(" '", "'");
		return sql;
	}

	//使用查询条件中相同类型日期第1个日期值动态替换分区中的固定日期
	public static String getPartition(String sql, String selConfig) { 
		if(sql.indexOf("partition")==-1){
			return sql;
		} 
		String sql2=sql;
		String partition=sql.substring(sql.indexOf("partition")+10,sql.length()); //若sql含有多个partition分区?
		partition=partition.substring(0,partition.indexOf(")"));
		char partitions[]=partition.toCharArray();
		int begin=0;
		for(int i=0;i<partitions.length;i++){ 
			String str=String.valueOf(partitions[i]);
			if(PoiUtil.isNumber(str)){
				begin=i;
				break;
			}
		}  
		String partition1=partition.substring(0,begin);
		String partition2=partition.substring(begin,partition.length());
		
		String date="";
		String[] selConfigs = selConfig.split("@");
		for (int i = 0; i < selConfigs.length; i++) { 
			String tmp[] = selConfigs[i].split(";");
			tmp[1]=tmp[1].replaceAll("-", ""); ////删除日期中的符号 
			if (tmp[0].equals("d") && tmp[1].length()==partition2.length()) { //使用查询条件中相同类型日期第1个日期值动态替换分区中的固定日期
				date=tmp[1];
				break;
			}
		} 
		
		partition2=date; //覆盖(替换)原来的数字
		if(!partition2.equals("")){
			sql2=sql2.replace(partition, partition1+partition2); 
		} 
		return sql2;
	}
	
	public static void main(String[] args) { 
		String retXml = "123456";
		System.out.println("Client Rece:" + retXml);
	    String[] mainArray = retXml.split("\\|", -1);
	    System.out.println(mainArray[0]);
	}
	
	//下钻字段处理
	public static Excel dealTrip(Excel e,String[] lastTirpIndex){
		boolean flag = true;
		String[] commonIndexs;
		String[] showIndexs = e.getShowIndex().split(";");
		String[] tripIndexs = e.getTripIndex().split(";");
		String tripIndex = "",showIndex = "",commonIndex = "";
		for(int i=0;i<tripIndexs.length;i++){
			for(int j=0;j<showIndexs.length;j++){
				if(tripIndexs[i].equals(showIndexs[j])){
					tripIndex += i+"`"+ tripIndexs[i]+";";					
				}
				if(!"-1".equals(lastTirpIndex[1])&&tripIndexs[i].equals(showIndexs[j])){
					commonIndex += i+";"+tripIndexs[i]+";";
					commonIndex = commonIndex.replace(lastTirpIndex[1], "");
				}else if(tripIndexs[i].equals(showIndexs[j])){
					commonIndex += tripIndexs[i]+";";
				}
			}
		}
		tripIndex = tripIndex.substring(0, tripIndex.length()-1);
		commonIndex = commonIndex.substring(0, commonIndex.length()-1);
		commonIndexs = commonIndex.split(";");
		for(int m=0;m<showIndexs.length;m++){
			flag = true;
			for(int n=0;n<commonIndexs.length;n++){
				if(commonIndexs[n].equals(showIndexs[m])){
					flag = false;
				}
			}
			if(flag){
				showIndex += showIndexs[m]+";";
			}
		}
		showIndex = showIndex.substring(0, showIndex.length()-1);
		e.setShowIndex(showIndex);
		e.setTripIndex(tripIndex);
		return e;
	}
	
	public static String getRptSql1(Excel e,int _level,String[] lastTirpIndex){
		e = dealTrip(e,lastTirpIndex);
		boolean flag = false;
		String colName = "",tempColName = "";
		String groupBy = "",tripIndex="0`0";
		String[] funcIndexs = e.getFuncIndex().split(";");
		String[] colNames = e.getColName().split(";");
		String[] _tripIndexs = e.getTripIndex().split(";");
		if(!"-1".equals(lastTirpIndex[1])){
			for(int i=0;i<_tripIndexs.length;i++){
				if(lastTirpIndex[1].equals(_tripIndexs[i].split("`")[0])){
					tripIndex = _tripIndexs[i];
				}				
			}
		}else{
			tripIndex = _tripIndexs[0];
		}
			
		String[] tripIndexs = tripIndex.split("`"); 
		String[] showIndexs = e.getShowIndex().split(";");
		for(String showIndex:showIndexs){
			if("0".equals(funcIndexs[Integer.parseInt(showIndex)])){
				flag = true;
				break;
			}
		}
		for(int i=0;i<showIndexs.length;i++){
			if("0".equals(funcIndexs[Integer.parseInt(showIndexs[i])])){
				tempColName += "sum("+colNames[Integer.parseInt(showIndexs[i])]+")";
				if(i<showIndexs.length-1)
					tempColName+=",";
			}else{
				tempColName += colNames[Integer.parseInt(showIndexs[i])];
				if(i<showIndexs.length-1)
					tempColName+=",";
				if(flag){
					groupBy += colNames[Integer.parseInt(showIndexs[i])];
					groupBy += ",";
				}	
			}
			//下钻实际列位置
			if(tripIndexs[0].equals(showIndexs[i])){				
				e.setTripIndex(tripIndex+"`"+i);
			}
		}
		if(groupBy!=null&&!groupBy.equals("")){
			groupBy = groupBy.substring(0, groupBy.length()-1);	
		}else{
			groupBy="''";
		}
		colName = tempColName;
		if(!"-1".equals(lastTirpIndex[1])&&!"-1".equals(lastTirpIndex[2])){
			colName = "";
			e.setTripIndex(tripIndex+"`"+lastTirpIndex[2]);
			String[] tempColNames = tempColName.split(",");
			for(int i=0;i<tempColNames.length;i++){
				if(i == Integer.parseInt(lastTirpIndex[2])){
					colName += colNames[Integer.parseInt(lastTirpIndex[1])];
					groupBy = groupBy.replace(tempColNames[i], colNames[Integer.parseInt(lastTirpIndex[1])]);
				}else
					colName += tempColNames[i];
				if(i<tempColNames.length-1)
					colName += ",";
			}
		}
		String sql = "select "+colName+" from "+e.getTableName();
		String orderIndexs[]=e.getOrderIndex().split(";");
		String groupBys[] = groupBy.split(",");
		for(String orderIndex:orderIndexs){
			flag=true;
			for(String groupBy1:groupBys){
				if(colNames[Integer.valueOf(orderIndex)].equals(groupBy1)){
					flag = false;
					break;
				}
			}
			if(flag){
				groupBy += ","+colNames[Integer.valueOf(orderIndex)];
			}
		}	
		groupBy = " group by "+groupBy;
		return sql+"`"+groupBy;
	}
}
