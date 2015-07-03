package org.apdplat.selfrpt.action;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.sql.SQLException;
import java.text.NumberFormat;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.struts2.interceptor.ServletRequestAware;
import org.apache.struts2.interceptor.ServletResponseAware;
import org.apdplat.selfrpt.model.Config;
import org.apdplat.selfrpt.model.Excel;
import org.apdplat.selfrpt.util.JdbcUtil;
import org.apdplat.selfrpt.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
/**
 * @author yangj
 * 导出EXCEL
 */
public class ExpExcelAction  extends PortalBaseAction implements ServletRequestAware,ServletResponseAware{

	@Autowired
	private JdbcUtil jdbc;
	private HttpServletRequest req;
	private HttpServletResponse res;
	private String reportID;//报表id
	private String tripIndex;
	private String columnName;//展示表头值
	private String tripWhere;//下钻带的条件
	private int tripLevel;//下钻层级
	private String whereValues;//where值
	private String selConfig=""; //选择的条件
	private String orderIndex="";//排序
	private String isMoreHead;//是否是多表头
	private String name;//点击下钻下载的显示报表名称
	
	private String colNames="";//表头
	private String operateData="";	
	private String groupIndex="";
	/**
	 * 下钻下载
	 */
	public void downExcel(){
		String tempSql="select "+Config.getColNameExcel()+" from report_config where report_id='"+reportID+"'"; 
		List<String[]> list =jdbc.findList(tempSql);
		Excel e=new Excel();
		if(list.size()>0){
			String[] data = (String[]) list.get(0);  
			e=Config.setExcel(data);
		}
		e.setColNames(e.getColName());
		String[] colNames = e.getColName().split(";");
		String[] tripIndexs = tripIndex.split("`");
		String[] sqlGroupBy = StringUtil.getRptSql1(e,tripLevel,tripIndexs).split("`");
		String sql=sqlGroupBy[0];
		if(selConfig!=null&&!selConfig.equals("")){
			try {
				selConfig=java.net.URLDecoder.decode(selConfig,"utf-8");
			} catch (UnsupportedEncodingException e1) {
				e1.printStackTrace();
			}
		}
		e.setSelConfig(selConfig);//必须传递d,s,c类型信息  
		String wheres=" where 1=1 ";
		if(!selConfig.equals("")){
			wheres+=StringUtil.getRptSql3(e);
		} 
		if(!"".equals(whereValues)&&null!=whereValues){
			String[] wereValues=whereValues.split(";");
			for(int i=0;i<wereValues.length;i++){
				String[] colAndValues = wereValues[i].split(":");
				wheres+=" and "+colNames[Integer.parseInt(colAndValues[0])]+" in( "+colAndValues[1]+")";
			}
		}
		orderIndex=e.getOrderIndex();
		if(orderIndex.equals("")){
			orderIndex="0;1";
		}
		String orderIndexs[]=orderIndex.split(";");
		for(int i=0;i<orderIndexs.length;i++){
			for(int j=i+1;j<orderIndexs.length;j++){
				if(orderIndexs[i].equals(orderIndexs[j])){
					orderIndexs[j]="";
				}
			}
		} 
		orderIndex="";
		for(int i=0;i<orderIndexs.length;i++){ 
			if(!orderIndexs[i].equals("")){
				orderIndex+=colNames[Integer.valueOf(orderIndexs[i])]+",";
			}
		}
		if(!orderIndex.equals("")){
			orderIndex=orderIndex.substring(0,orderIndex.length()-1); 
		}
		
		sql += wheres ;
		if(tripWhere!=null&&!tripWhere.equals("")){
			try {
				tripWhere=java.net.URLDecoder.decode(tripWhere,"utf-8");
			} catch (UnsupportedEncodingException e1) {
				e1.printStackTrace();
			}
		}
		if(name!=null&&!name.equals("")){
			try {
				name=java.net.URLDecoder.decode(name,"utf-8");
			} catch (UnsupportedEncodingException e1) {
				e1.printStackTrace();
			}
		}
		String[] tripWheres = tripWhere.split(";");
		String appWheres = "";
		for(String tripWhere:tripWheres){
			appWheres += " and "+colNames[Integer.parseInt(tripWhere.split(":")[0])]+"='"+tripWhere.split(":")[1]+"' ";
		}
		sql +=  appWheres;
		if(!"".equals(sqlGroupBy[1]))
			sql += sqlGroupBy[1];
		sql += " order by "+ orderIndex;
		List<String[]> dataList = jdbc.findList(sql);
        String [] isOrnotSum = isOrnotSum(sql);
    	exportExcel(res,dataList,name,columnName,isMoreHead,isOrnotSum);
	}
	/**
	 * 下钻的分层下载
	 * @return
	 * @throws Exception
	 */
	public String expExcel() throws Exception {
		String sql = req.getParameter("expSql");
		String orgValues = req.getParameter("orgValues");
		String orgNames = req.getParameter("orgNames");
		String columnName = req.getParameter("columnName");
		String isMoreHead = req.getParameter("isMoreHead");
		String location = req.getParameter("location");
		String reportId = req.getParameter("reportId");
		String tempSql="select "+Config.getColNameExcel()+" from report_config where report_id='"+reportId+"'"; 
		List<String[]> tempList =jdbc.findList(tempSql);
		Excel e=new Excel();
		if(tempList.size()>0){
			String[] data= (String[]) tempList.get(0);  
			e=Config.setExcel(data);
		}
		//非下钻sql处理
		String[] teSql = noTripSql(e,sql).split("`");
		sql = teSql[0];
		String isNotTrip = teSql[1];
		if(null != StringUtils.trimToNull(orgValues)){
			String sqlColname = dealSql(sql,orgValues,orgNames,columnName,isMoreHead,location,isNotTrip);
			String sqlColnames[] = sqlColname.split("`");
			sql = sqlColnames[0];
			columnName = sqlColnames[1];
		}
        String fileName = req.getParameter("fileName");
        List<String[]> list = jdbc.findList(sql);
        String [] isOrnotSum = isOrnotSum(sql);
    	exportExcel(res,list,fileName,columnName,isMoreHead,isOrnotSum);
		return null;
	}
	/**
	 * 生成Excel文件
	 * @param response
	 * @param list  数据
	 * @param fileName 文件名
	 * @param columnName  表头
	 * @param isMoreHead 是否是多表头
	 * @param isOrnotSum 是否是sum
	 */
	public  void exportExcel(HttpServletResponse response,List<String[]> list,String fileName,String columnName,String isMoreHead,String[] isOrnotSum) {
		try {
			fileName = new String((fileName+".xls").getBytes("gb2312"),"iso8859-1");
		} catch (UnsupportedEncodingException e1) {
			e1.printStackTrace();
		}
		response.reset();
		response.setContentType("application/x-msdownload;charset=utf-8");
		response.addHeader("Content-Disposition","attachment; filename=\"" +fileName + "\"");
		if(list != null&&list.size()>0){
			StringBuffer sb = new StringBuffer();
			Object[] o = (Object[]) list.get(0);
			try{		
			PrintWriter pw = response.getWriter();
			sb.append("<?xml version=\"1.0\"encoding=\"utf-8\"?>");
			sb.append("\n");
			sb.append("<?mso-application progid=\"Excel.Sheet\"?>");
			sb.append("\n");
			sb.append("<Workbook xmlns=\"urn:schemas-microsoft-com:office:spreadsheet\"");
			sb.append("\n");
			sb.append("  xmlns:o=\"urn:schemas-microsoft-com:office:office\"");
			sb.append("\n");
			sb.append(" xmlns:x=\"urn:schemas-microsoft-com:office:excel\"");
			sb.append("\n");
			sb.append(" xmlns:ss=\"urn:schemas-microsoft-com:office:spreadsheet\"");
			sb.append("\n");
			sb.append(" xmlns:html=\"http://www.w3.org/TR/REC-html40\">");
			sb.append("\n");
			sb.append(" <Styles>\n");
			sb.append("  <Style ss:ID=\"Default\" ss:Name=\"Normal\">\n");
			sb.append("   <Alignment ss:Vertical=\"Center\"/>\n");
			sb.append("   <Borders/>\n");
			sb.append("   <Font ss:FontName=\"宋体\" x:CharSet=\"134\" ss:Size=\"10\"/>\n");
			sb.append("   <Interior/>\n");
			sb.append("   <NumberFormat/>\n");
			sb.append("   <Protection/>\n");
			sb.append("  </Style>\n");
			
			sb.append(" <Style ss:ID=\"Head\">\n");
			sb.append(" <Alignment ss:Vertical=\"Center\" ss:Horizontal=\"Center\"/>\n");
			sb.append("  <Borders>\n");
			sb.append("  <Border ss:Position=\"Bottom\" ss:LineStyle=\"Continuous\" ss:Weight=\"1\"/>\n");
			sb.append("  <Border ss:Position=\"Left\" ss:LineStyle=\"Continuous\" ss:Weight=\"1\"/>\n");
			sb.append("  <Border ss:Position=\"Right\" ss:LineStyle=\"Continuous\" ss:Weight=\"1\"/>\n");
			sb.append("  <Border ss:Position=\"Top\" ss:LineStyle=\"Continuous\" ss:Weight=\"1\"/>\n");
			sb.append("  </Borders>\n");			
			sb.append("  <Font ss:FontName=\"宋体\" x:CharSet=\"134\" ss:Size=\"12\" ss:Bold=\"1\" />\n");     
			sb.append("  <Interior ss:Color=\"#D3D3D3\" ss:Pattern=\"Solid\"/>  \n");    
			sb.append("  <NumberFormat/>\n");   
			sb.append("  <Protection/>\n");  
			sb.append("  </Style>\n"); 
			
			sb.append(" <Style ss:ID=\"Body\">\n");
			sb.append(" <Alignment ss:Vertical=\"Center\" />\n");
			sb.append("  <Borders>\n");
			sb.append("  <Border ss:Position=\"Bottom\" ss:LineStyle=\"Continuous\" ss:Weight=\"1\"/>\n");
			sb.append("  <Border ss:Position=\"Left\" ss:LineStyle=\"Continuous\" ss:Weight=\"1\"/>\n");
			sb.append("  <Border ss:Position=\"Right\" ss:LineStyle=\"Continuous\" ss:Weight=\"1\"/>\n");
			sb.append("  <Border ss:Position=\"Top\" ss:LineStyle=\"Continuous\" ss:Weight=\"1\"/>\n");
			sb.append("  </Borders>\n");			
			sb.append("  <Font ss:FontName=\"宋体\" x:CharSet=\"134\" ss:Size=\"12\" />\n");     
			sb.append("  <Interior/>\n");  
			sb.append("  <NumberFormat/>\n");   
			sb.append("  <Protection/>\n");  
			sb.append("  </Style>\n"); 
			
			sb.append(" </Styles>\n");
			int recordcount = 50000;
			int currentRecord = 0;
			int i = 1;
			int col=o.length;//取得列数 
			for(int j=0;j<list.size();j++){
					if ((currentRecord == recordcount|| currentRecord == 0)
							&& i != 0) {
						currentRecord = 0;
						pw.write(sb.toString());
						sb.setLength(0);
						if(i>1){
							sb.append("</Table><WorksheetOptions xmlns=\"urn:schemas-microsoft-com:office:excel\">");
							sb.append("<ProtectObjects>False</ProtectObjects>");
							sb.append("<ProtectScenarios>False</ProtectScenarios>");
							sb.append("</WorksheetOptions></Worksheet>");
						}
						sb.append("<Worksheet ss:Name=\"Sheet" + i / recordcount
								+ "\">");
						sb.append("\n");
						sb.append("<Table ss:ExpandedColumnCount=\"" + col+5
								+ "\" ss:ExpandedRowCount=\"" + recordcount+5
								+ "\" x:FullColumns=\"1\" x:FullRows=\"1\">");
						sb.append("\n");
					}
					sb.append("<Row>");
					if(currentRecord == 0)						
						getColName(col,sb,columnName,isMoreHead);
					getData(col,sb,(String[])list.get(j),isOrnotSum);					
					sb.append("</Row>");
					if (i % 5000 == 0) {
						pw.write(sb.toString());
						pw.flush();
						sb.setLength(0);
					}
					sb.append("\n");
					currentRecord++;
					i++;
			}
			pw.write(sb.toString());
			sb.setLength(0);
			sb.append("</Table>");
			sb.append("<WorksheetOptions xmlns=\"urn:schemas-microsoft-com:office:excel\">");
			sb.append("\n");
			sb.append("<ProtectObjects>False</ProtectObjects>");
			sb.append("\n");
			sb.append("<ProtectScenarios>False</ProtectScenarios>");
			sb.append("\n");
			sb.append("</WorksheetOptions>");
			sb.append("\n");
			sb.append("</Worksheet>");
			sb.append("</Workbook>");
			sb.append("\n");
			pw.write(sb.toString());
			pw.flush();
			pw.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}catch(SQLException e){
			e.printStackTrace();
		}catch(Exception e){
			e.printStackTrace();
		}finally{
		}
	}  		
}
	
	private void getData(int col,StringBuffer sb,String[] obj,String[] isOrnotSum) throws SQLException{
		NumberFormat nf = NumberFormat.getNumberInstance();
        nf.setMaximumFractionDigits(2);
		for (int k = 0; k < col; k++) {	
			if("1".equals(isOrnotSum[k])){
				sb.append("<Cell ss:StyleID=\"Body\"><Data ss:Type=\"Number\">"+nf.format(Double.parseDouble(obj[k]))+"</Data></Cell>");
			}else{
				sb.append("<Cell ss:StyleID=\"Body\"><Data ss:Type=\"String\">"+obj[k]+"</Data></Cell>");
			}
			
			sb.append("\n");
		}
	}
	
	private void getColName(int col,StringBuffer sb,String columnName,String isMoreHead ){
			if("-1".equals(isMoreHead)){
				String[] columnNames = columnName.split(",");
				for (int j = 0; j < col; j++) {
	    			sb.append("<Cell><Data ss:Type=\"String\">"+columnNames[j]+"</Data></Cell>");
	    			sb.append("\n");
	    		}
				sb.append("</Row>\n<Row>");
			}else{
				String rowColumns[] = columnName.split("\\|");
				for(int i=0;i<rowColumns.length;i++){
					String columnNames[] = rowColumns[i].split(",");
					for(int j=0;j<columnNames.length;j++){
						int colLen=0,rowLen=0;
						//比较列
						if(!"".equals(columnNames[j])){                                
							for(int k=j+1;k<columnNames.length;k++){
								if((columnNames[j].equals(columnNames[k]))&&(columnNames[j].equals(columnNames[j+1])||"".equals(columnNames[j+1]))){
									columnNames[k] = "";
									colLen++;
								}								
							}
						}
						//比较行
						if(!"".equals(columnNames[j])){ 
							for(int m=i+1;m<rowColumns.length;m++){
								String temrowColumn = "";
								String colNames[] = rowColumns[m].split(",");
								for(int n=0;n<colNames.length;n++){
									if(columnNames[j].equals(colNames[n])&&(j==n)){
										rowLen++;
									}else{
										temrowColumn+=colNames[n];
									}
									if(n<colNames.length-1){temrowColumn+=",";}
								}
								rowColumns[m]=temrowColumn;
							}
						}
						
						if(colLen>0&&!"".equals(columnNames[j])){
							sb.append("<Cell ss:StyleID=\"Head\" ss:Index=\""+(j+1)+"\" ss:MergeAcross=\""+colLen+"\"><Data ss:Type=\"String\">"+columnNames[j]+"</Data></Cell>");
			    			sb.append("\n");
						}else if(rowLen>0&&!"".equals(columnNames[j])){
							sb.append("<Cell ss:StyleID=\"Head\" ss:Index=\""+(j+1)+"\" ss:MergeDown=\""+rowLen+"\"><Data ss:Type=\"String\">"+columnNames[j]+"</Data></Cell>");
			    			sb.append("\n");
						}else if(!"".equals(columnNames[j])){
							sb.append("<Cell ss:StyleID=\"Head\" ss:Index=\""+(j+1)+"\"><Data ss:Type=\"String\">"+columnNames[j]+"</Data></Cell>");
			    			sb.append("\n");
						}					
					}
					sb.append("</Row>\n<Row>");
				}
			}
	}
	
	@Override
	public void setServletRequest(HttpServletRequest req) {
		// TODO Auto-generated method stub
		this.req = req;
	}

	@Override
	public void setServletResponse(HttpServletResponse res) {
		// TODO Auto-generated method stub
		this.res = res;
	} 
	
	public String dealSql(String sql,String orgValues,String orgNames,String columnName,String isMoreHead,String location,String isNotTrip){
		boolean flag = false;
		String replName="";
		String orgVals[] = orgValues.split(",");
		for(int i=0;i<orgVals.length;i++){
			if(sql.indexOf(orgVals[i]) > -1){
				flag = true;
				replName = orgVals[i];
			}			
		}
		
		int mid = sql.indexOf("from");	
		if("true".equals(isNotTrip)){
			if(sql.indexOf("region_name,city_name") > -1){
				sql = sql.replace("region_name,city_name", orgValues);
				columnName = columnName.replace("地市名称,区县名称",orgNames);							
			}else if(sql.indexOf("region_name") > -1){
				sql = sql.replace("region_name", orgValues);
				columnName = columnName.replace("地市名称",orgNames);
			}
		}else if(flag){
			sql = sql.substring(0,mid).replace(replName, orgValues)+sql.substring(mid, sql.length());
			if("-1".equals(isMoreHead)){
				String columnNames[] = columnName.split(",");
				columnName = columnName.replace(columnNames[Integer.parseInt(location)], orgNames);
			}else{
				String rowColumns[] = columnName.split("\\|");
				for(String rowColumn:rowColumns){
					String columnNames[] = rowColumn.split(",");
					columnName = columnName.replace(columnNames[Integer.parseInt(location)], orgNames);
				}
			}			
		}else{			
			sql = sql.substring(0, mid)+","+orgValues+" "+sql.substring(mid,sql.length());
			if("-1".equals(isMoreHead)){
				String columnNames[] = columnName.split(";");
				columnName = "";
				for(int i=0;i<columnNames.length;i++){
					columnName += columnNames[i];
					if(i == Integer.parseInt(location)){
						columnName += ";"+orgNames;
					}
					if(i < columnNames.length-1){
						columnName += ";";
					}
				}
			}else{
				String rowColumns[] = columnName.split("\\|");
				columnName = "";
				for (String rowColumn:rowColumns){
					String columnNames[] = rowColumn.split(",");
					for(int i=0;i<columnNames.length;i++){
						columnName += columnNames[i];
						if(i == Integer.parseInt(location)){
							columnName += ","+orgNames;
						}
						if(i < columnNames.length-1){
							columnName += ",";
						}
					}
				}
			}
		}		
		
		if(sql.indexOf("group by")>-1){
			int grpId = sql.indexOf("group by");
			if(flag){
				sql = sql.substring(0, grpId)+sql.substring(grpId, sql.length()).replace(replName, orgValues);
			}else{
				sql = sql.substring(0, grpId+9)+" "+orgValues+","+sql.substring(grpId+9, sql.length());
			}			
		}
				
		return sql+"`"+columnName;
	}
	
	public String noTripSql(Excel e,String sql){
		boolean flag = true;
		if(e.getTripIndex()!=null && !e.getTripIndex().equals("")){
			String[] tripIndexs = e.getTripIndex().split(";");
			for(String tripIndex:tripIndexs){
				if(!"-1".equals(tripIndex)){
					flag = false;
					break;
				}
			}
			if(flag){
				String[] showIndexs = e.getShowIndex().split(";");
				String[] colNames = e.getColName().split(";");
				String colName = "";
				for(int i=0;i<showIndexs.length;i++){
					colName += colNames[Integer.parseInt(showIndexs[i])];
					if(i<showIndexs.length-1){
						colName += ",";
					}
				}
				sql = sql.replace("*", colName);
			}
		}		
		return sql+"`"+flag;
	}
	/**
	 * 下载多表头翻页Excel
	 */
	public void expMorePageExcel(){
		String sql="select "+Config.getColNameExcel()+" from report_config where report_id='"+reportID+"'"; 
		List<String[]> list =jdbc.findList(sql);
		Excel e=new Excel();
		if(list.size()>0){
			String[] data = (String[]) list.get(0);  
			e=Config.setExcel(data);
		}	
		String col[]=e.getColName().split(";");
		String showIndex[]=e.getShowIndex().split(";");
		String name="";
		for(int m=0;m<showIndex.length;m++){
			if(m==showIndex.length-1){
				name+=col[Integer.parseInt(showIndex[m])];
			}else{
				name+=col[Integer.parseInt(showIndex[m])]+",";
			}
			
		}
		sql="select "+name+" from "+e.getTableName();
		if(e.getIsPartition()==1){
			String value=StringUtil.getDateColVale(selConfig);
			sql+=" partition(p"+value+") ";
		}
		try {
			colNames=java.net.URLDecoder.decode(colNames,"utf-8");
			e.setColNames(colNames);
		} catch (UnsupportedEncodingException e1) {
			e1.printStackTrace();
		}
		e.setSelConfig(selConfig);//必须传递d,s,c类型信息  
		String wheres=" where 1=1";
		if(!selConfig.equals("")){
			wheres+=StringUtil.getRptSql3(e);
		} 
		String operateDatas[]=operateData.split(";");
		if(getOrgLevelInt()>1){ //省用户不限制，地市用户根据operateData类型限制
		   if(operateDatas.length==2 && operateDatas[0].equals("1")){ //限制地市
			   wheres+=" and "+operateDatas[1]+"='"+getOrgCode()+"'";
		   }else{ //数据权限限制某个用户
			   if(e.getIsAdd()==1 && !e.getOperateData().equals("-1")){ //会计科目等与费用项目关联关系维护不限制,允许所有用户查看
				   wheres+=" and in_user_id='"+getUserAccount()+"'"; //追加了字段+数据权限 限制
			   } 
		   }  
		}
		orderIndex=e.getOrderIndex();
		groupIndex=e.getGroupIndex(); 
		if(orderIndex.equals("")){
			orderIndex="0;1";
		}
		if(!groupIndex.equals("")){
			orderIndex=groupIndex+";"+orderIndex; 
		} 
		String orderIndexs[]=orderIndex.split(";");
		for(int i=0;i<orderIndexs.length;i++){
			for(int j=i+1;j<orderIndexs.length;j++){
				if(orderIndexs[i].equals(orderIndexs[j])){
					orderIndexs[j]="";
				}
			}
		} 
		orderIndex="";
		for(int i=0;i<orderIndexs.length;i++){ 
			if(!orderIndexs[i].equals("")){
				orderIndex+=col[Integer.valueOf(orderIndexs[i])]+",";
			}
		}
		if(!orderIndex.equals("")){
			orderIndex=orderIndex.substring(0,orderIndex.length()-1); 
		}
		sql += wheres + " order by "+ orderIndex;  //从1开始  ,  分组优先排序? group+orderIndex,删除重复?
		List<String[]> dataList = jdbc.findList(sql);
        String [] isOrnotSum = isOrnotSum(sql);
    	exportExcel(res,dataList,"data",e.getPageTitles(),isMoreHead,isOrnotSum);
	}
	/**
	 * 查询字段是否是sum
	 * @param sql
	 * @return
	 */
	public String[] isOrnotSum(String sql){
		String[] columns = sql.split(",");
		String[] tempValue = new String[columns.length];
		for(int i=0;i<columns.length;i++){
			if(columns[i].indexOf("sum") > -1){
				tempValue[i] = "1";
			}else{
				tempValue[i] = "0";
			}
		}
		return tempValue;
	}
	public void setReportID(String reportID) {
		this.reportID = reportID;
	}
	
	public void setColumnName(String columnName) {
		this.columnName = columnName;
	}
	public void setTripWhere(String tripWhere) {
		this.tripWhere = tripWhere;
	}
	
	public void setTripLevel(int tripLevel) {
		this.tripLevel = tripLevel;
	}
	public void setWhereValues(String whereValues) {
		this.whereValues = whereValues;
	}
	public void setTripIndex(String tripIndex) {
		this.tripIndex = tripIndex;
	}
	public void setSelConfig(String selConfig) {
		this.selConfig = selConfig;
	}
	public void setIsMoreHead(String isMoreHead) {
		this.isMoreHead = isMoreHead;
	}
	public void setName(String name) {
		this.name = name;
	}
	public void setColNames(String colNames) {
		this.colNames = colNames;
	}
	public void setOperateData(String operateData) {
		this.operateData = operateData;
	}
	public void setGroupIndex(String groupIndex) {
		this.groupIndex = groupIndex;
	}
	
}
