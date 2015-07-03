package org.apdplat.selfrpt.model;


//配置表pojo/bean
public class Config {
	//配置表(若增加字段需要修改插入和更新sql)
	public static String getColNameExcel() {
		String colNames="report_id,report_name,report_path,groupno,levels,table_type,table_name,report_sql,page_titles,import_index,check_index,show_index,order_index,group_index,"+
						"where_info,edit_info,operate_type,operate_data,model_excel,begin_row,report_explain,create_userid,create_time,is_add,is_save,is_partition,col_width,only_index,is_update,is_more_head,is_more_where,trip_index,col_name,func_index,col_comment,datafunc_index,click_num,data_format,trip_down"; //(若增加字段需要修改插入和更新sql)
		return colNames;
	}
	
	public static Excel setExcel(String data1[]){
		Excel e=new Excel();
		e.setReportID(data1[0]); 
		e.setReportName(data1[1]); 
		e.setReportPath(data1[2]);
		e.setGroupNo(data1[3]);
		e.setLevels(data1[4]);
		e.setTableType(data1[5]);
		e.setTableName(data1[6].toUpperCase()); 
		e.setReportSql(data1[7].replaceAll("，", ","));  //查询数据SQL,还原逗号
		e.setPageTitles(data1[8]);  
		e.setImportIndex(data1[9]); 
		e.setCheckIndex(data1[10]); 
		e.setShowIndex(data1[11]); 
		e.setOrderIndex(data1[12]); 
		e.setGroupIndex(data1[13]); 
		e.setWhereInfo(data1[14]);
		e.setEditInfo(data1[15]);
		e.setOperateType(data1[16]); 
		e.setOperateData(data1[17]); 
		e.setModelExcel(data1[18]);
		e.setBeginRow(Integer.valueOf(data1[19]));
		e.setReportExplain(data1[20]); 
		e.setCreateUserid(data1[21]); 
		e.setCreateTime(data1[22]); 
		e.setIsAdd(Integer.valueOf(data1[23]));
		e.setIsSave(Integer.valueOf(data1[24]));
		e.setIsPartition(Integer.valueOf(data1[25]));
		e.setColWidth(data1[26]);
		e.setOnlyIndex(data1[27]);
		e.setIsUpdate(Integer.valueOf(data1[28]));
		e.setIsMoreHead(data1[29]);
		e.setIsMoreWhere(data1[30]);
		e.setTripIndex(data1[31]);
		e.setColName(data1[32]);
		e.setFuncIndex(data1[33]);
		e.setColComment(data1[34]);
		e.setDatafuncIndex(data1[35]);
		e.setClickNum(data1[36]);
		e.setDataFormat(data1[37]);
		e.setTripDown(data1[38]);
		return e;		
	} 	
	
	
	//图片配置表
	public static String getColNameChart(){
		String colNames=" chartid,groupno,levels,title,A.pictypeid,chart_sql,data_titles,file_data,xdata,ydata,"+
					    "nextid,width,height,namey,showvalues,decimals,sign,canvaspadding,pagesize,roleid,create_time,memo ";
		return colNames;		
	}
	
	//报表配置表
	public static String getColNameRpt(){
		String colNames=" A.report_id,report_name,frame_id2,B.frame_id,B.levels,B.report_sql,report_path,page_titles,col_titles,show_index,filter_index,next_rpt_index,nextid,model_excel,begin_row,is_more_head,"+
						"sel_titles,sel_config,chart_groupno,report_explain,power_explain,click_num,update_time,create_time,create_userid,create_groupid,is_use ";
		return colNames;		
	}
	
	public  static Report setReport(String[] data){
		Report r = new Report();
		r.setReportID(data[0]);
		r.setReportName(data[1]);
		r.setFrameID2(data[2]);
		r.setFrameID(data[3]);
		r.setLevels(data[4]);
		r.setReportSql(data[5].replaceAll("，", ","));
		r.setReportPath(data[6]); 
		data[7] = data[7].replaceAll("\n", "");//多行表头删除换行和空格
		data[7] = data[7].replaceAll(" ", "");
		r.setPageTitles(data[7]);
		r.setColTitles(data[8]);
		r.setShowIndex(data[9]);
		r.setFilterIndex(data[10]);
		r.setNextRptIndex(data[11]);
		r.setNextID(data[12]);
		r.setModelExcel(data[13]);
		r.setBeginRow(data[14]);
		r.setIsMoreHead(data[15]);
		r.setSelTitles(data[16]);
		r.setSelConfig(data[17]);
		r.setChartGroupNo(data[18]);
		r.setReportExplain(data[19]);
		r.setPowerExplain(data[20]);
		r.setClickNum(data[21]);
		data[22]=data[22].substring(0,data[22].indexOf(" "));//只取年月日
		r.setUpdateTime(data[22]);
		r.setCreateTime(data[23]);
		r.setCreateUserid(data[24]);
		r.setCreateGroupNo(data[25]);
		r.setIsUse(data[26]); 
		return r; 
	} 
	
	//下拉框配置表
	public static String getColNameSel(){
		String colNames=" A.sel_id,sel_name,B.col_names,B.levels,B.sel_sql,A.sel_type,B.sel_value,B.sel_text,B.sel_order,B.nextid,is_more,is_fuzzy_query,"+
						"use_type,sel_explain,create_userid,create_time,create_groupid,level_max,B.is_leaf,B.data_level ";
		return colNames;		
	}
	public  static Select setSelect(String[] data){
		Select s=new Select();
		s.setSelID(data[0]);
		s.setSelName(data[1]);
		s.setColNames(data[2]);
		s.setLevels(data[3]);
		s.setSelSql(data[4]);
		s.setSelType(data[5]);
		s.setSelValue(data[6]);
		s.setSelText(data[7]);
		s.setSelOrder(data[8]);
		s.setNextID(data[9]);
		s.setIsMore(data[10]);
		s.setIsFuzzyQuery(data[11]);
		s.setUseType(data[12]); 
		s.setSelExplain(data[13]);
		s.setCreateUserid(data[14]);
		data[15]=data[15].substring(0,data[15].indexOf(" "));//只取年月日
		s.setCreateTime(data[15]); 
		s.setCreateGroupid(data[16]); 
		s.setLevelsMax(data[17]); 
		s.setIsLeaf(data[18]); 
		s.setDataLevel(data[19].replaceAll("，", ","));  //还原逗号; 
		return s; 
	}
}
