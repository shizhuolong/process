package org.apdplat.selfrpt.model;

import java.io.File;

public class Excel extends Page {
	private String reportID="";
	private String reportName=""; 
	private String reportPath="";  
	private String groupNo="";       //分组编号(多个sheet)
	private String levels="";        //第几个sheet  
	private String owner="" ;//数据库用户
	private String tableType="" ;//表或视图类型
	private String tableName=""; //表或视图名称 
	private String reportSql="";  
	private String pageTitles=""; 
	private String isMoreHead="";   //是否复杂表头-1单行,1多行
	private String importIndex=""; 
	private String checkIndex="";
	private String onlyIndex; //数据唯一性验证
	private String showIndex="";
	private String orderIndex="";
	private String orderIndexCol="";
	private String groupIndex="";
	private String dataFormat="";
	private String whereInfo=""; 
	private String isMoreWhere="";  
	private String whereColname="";
	private String editInfo="";//编辑时表单类型  
	private String operateType=""; //功能权限:操作类型update;add;delete
	private String operateData=""; //数据权限:0表示查询/修改/增加/删除权限限制某个用户,1;colName;表示根据地市用户归属地字段值限制
	private String modelExcel=""; //下载模板文件名 
	private int beginRow=1;	 
	private int isAdd=-1; //是否增加字段 
	private int isUpdate=1; //导入数据：1覆盖更新/0追加插入
	private int isSave=-1;
	private int isPartition=-1; //是否分区
	private String colWidth=""; //表格宽度
	private String reportExplain="";
	private String createUserid="";
	private String createTime="";  
	private String appUrl;      //url地址
	private String clickNum;    //点击次数
	
	private String colNames="";
	private String userID="";
	private String userName=""; 
	
	private int sheetIndex=0;
	private File file; 
	private String filePath=""; 
	private String sp=""; //预留扩展接口，导入个性化处理,url传递&sp=1参数即可  	
		 
	private String beginDate;       
	private String endDate;         
	private String reportUsername1; //应导负责人姓名
	private String reportUsername2; //导入人姓名
	private String dealDate;        //导入账期
	private String operateTime;     
	private String inform;          //导入说明或通知信息  
	private String selectVal=""; 
	private String selectText=""; 
	private String groupID; //用户归属地
	private String selConfig;
	private String tripIndex;//下钻
	private String tripWhere;
	private String colName;  //字段名称
	private String funcIndex;//函数
	private String colComment;//字段注释
	private String datafuncIndex;//qianfenwei
	private String tripDown;//下钻下载显示名
	public String getReportID() {
		return reportID;
	}
	public void setReportID(String reportID) {
		this.reportID = reportID;
	}
	public String getReportName() {
		return reportName;
	}
	public void setReportName(String reportName) {
		this.reportName = reportName;
	}
	public String getReportPath() {
		return reportPath;
	}
	public void setReportPath(String reportPath) {
		this.reportPath = reportPath;
	}
	public String getGroupNo() {
		return groupNo;
	}
	public void setGroupNo(String groupNo) {
		this.groupNo = groupNo;
	}
	public String getLevels() {
		return levels;
	}
	public void setLevels(String levels) {
		this.levels = levels;
	}
	public String getOwner() {
		return owner;
	}
	public void setOwner(String owner) {
		this.owner = owner;
	}
	public String getTableType() {
		return tableType;
	}
	public void setTableType(String tableType) {
		this.tableType = tableType;
	}
	public String getTableName() {
		return tableName;
	}
	public void setTableName(String tableName) {
		this.tableName = tableName;
	}
	public String getReportSql() {
		return reportSql;
	}
	public void setReportSql(String reportSql) {
		this.reportSql = reportSql;
	}
	public String getPageTitles() {
		return pageTitles;
	}
	public void setPageTitles(String pageTitles) {
		this.pageTitles = pageTitles;
	} 
	public String getIsMoreHead() {
		return isMoreHead;
	}
	public void setIsMoreHead(String isMoreHead) {
		this.isMoreHead = isMoreHead;
	}
	public String getImportIndex() {
		return importIndex;
	}
	public void setImportIndex(String importIndex) {
		this.importIndex = importIndex;
	}
	public String getCheckIndex() {
		return checkIndex;
	}
	public void setCheckIndex(String checkIndex) {
		this.checkIndex = checkIndex;
	}
	public String getShowIndex() {
		return showIndex;
	}
	public void setShowIndex(String showIndex) {
		this.showIndex = showIndex;
	}
	
	public String getOnlyIndex() {
		return onlyIndex;
	}
	public void setOnlyIndex(String onlyIndex) {
		this.onlyIndex = onlyIndex;
	}
	public String getOrderIndex() {
		return orderIndex;
	}
	public void setOrderIndex(String orderIndex) {
		this.orderIndex = orderIndex;
	}
	public String getOrderIndexCol() {
		return orderIndexCol;
	}
	public void setOrderIndexCol(String orderIndexCol) {
		this.orderIndexCol = orderIndexCol;
	}
	public String getGroupIndex() {
		return groupIndex;
	}
	public void setGroupIndex(String groupIndex) {
		this.groupIndex = groupIndex;
	}
	public String getWhereInfo() {
		return whereInfo;
	}
	public void setWhereInfo(String whereInfo) {
		this.whereInfo = whereInfo;
	}
	
	public String getIsMoreWhere() {
		return isMoreWhere;
	}
	public void setIsMoreWhere(String isMoreWhere) {
		this.isMoreWhere = isMoreWhere;
	}
	public String getWhereColname() {
		return whereColname;
	}
	public void setWhereColname(String whereColname) {
		this.whereColname = whereColname;
	}
	public String getEditInfo() {
		return editInfo;
	}
	public void setEditInfo(String editInfo) {
		this.editInfo = editInfo;
	}
	public String getOperateType() {
		return operateType;
	}
	public void setOperateType(String operateType) {
		this.operateType = operateType;
	}
	public String getOperateData() {
		return operateData;
	}
	public void setOperateData(String operateData) {
		this.operateData = operateData;
	}
	public String getModelExcel() {
		return modelExcel;
	}
	public void setModelExcel(String modelExcel) {
		this.modelExcel = modelExcel;
	}
	public int getBeginRow() {
		return beginRow;
	}
	public void setBeginRow(int beginRow) {
		this.beginRow = beginRow;
	}
	public int getIsAdd() {
		return isAdd;
	}
	public void setIsAdd(int isAdd) {
		this.isAdd = isAdd;
	}
	
	public int getIsUpdate() {
		return isUpdate;
	}
	public void setIsUpdate(int isUpdate) {
		this.isUpdate = isUpdate;
	}
	public int getIsSave() {
		return isSave;
	}
	public void setIsSave(int isSave) {
		this.isSave = isSave;
	}
	public int getIsPartition() {
		return isPartition;
	}
	public void setIsPartition(int isPartition) {
		this.isPartition = isPartition;
	}
	public String getColWidth() {
		return colWidth;
	}
	public void setColWidth(String colWidth) {
		this.colWidth = colWidth;
	}
	public String getReportExplain() {
		return reportExplain;
	}
	public void setReportExplain(String reportExplain) {
		this.reportExplain = reportExplain;
	}
	public String getCreateUserid() {
		return createUserid;
	}
	public void setCreateUserid(String createUserid) {
		this.createUserid = createUserid;
	}
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	public String getColNames() {
		return colNames;
	}
	public void setColNames(String colNames) {
		this.colNames = colNames;
	}
	public String getUserID() {
		return userID;
	}
	public void setUserID(String userID) {
		this.userID = userID;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public int getSheetIndex() {
		return sheetIndex;
	}
	public void setSheetIndex(int sheetIndex) {
		this.sheetIndex = sheetIndex;
	}
	public File getFile() {
		return file;
	}
	public void setFile(File file) {
		this.file = file;
	}
	public String getFilePath() {
		return filePath;
	}
	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}
	public String getSp() {
		return sp;
	}
	public void setSp(String sp) {
		this.sp = sp;
	}
	public String getBeginDate() {
		return beginDate;
	}
	public void setBeginDate(String beginDate) {
		this.beginDate = beginDate;
	}
	public String getEndDate() {
		return endDate;
	}
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
	public String getReportUsername1() {
		return reportUsername1;
	}
	public void setReportUsername1(String reportUsername1) {
		this.reportUsername1 = reportUsername1;
	}
	public String getReportUsername2() {
		return reportUsername2;
	}
	public void setReportUsername2(String reportUsername2) {
		this.reportUsername2 = reportUsername2;
	}
	public String getDealDate() {
		return dealDate;
	}
	public void setDealDate(String dealDate) {
		this.dealDate = dealDate;
	}
	public String getOperateTime() {
		return operateTime;
	}
	public void setOperateTime(String operateTime) {
		this.operateTime = operateTime;
	}
	public String getInform() {
		return inform;
	}
	public void setInform(String inform) {
		this.inform = inform;
	}
	public String getSelectVal() {
		return selectVal;
	}
	public void setSelectVal(String selectVal) {
		this.selectVal = selectVal;
	}
	public String getSelectText() {
		return selectText;
	}
	public void setSelectText(String selectText) {
		this.selectText = selectText;
	}
	public String getGroupID() {
		return groupID;
	}
	public void setGroupID(String groupID) {
		this.groupID = groupID;
	}
	public String getSelConfig() {
		return selConfig;
	}
	public void setSelConfig(String selConfig) {
		this.selConfig = selConfig;
	}
	public String getTripIndex() {
		return tripIndex;
	}
	public void setTripIndex(String tripIndex) {
		this.tripIndex = tripIndex;
	}
	public String getColName() {
		return colName;
	}
	public void setColName(String colName) {
		this.colName = colName;
	}
	public String getFuncIndex() {
		return funcIndex;
	}
	public void setFuncIndex(String funcIndex) {
		this.funcIndex = funcIndex;
	}
	public String getTripWhere() {
		return tripWhere;
	}
	public void setTripWhere(String tripWhere) {
		this.tripWhere = tripWhere;
	}
	public String getColComment() {
		return colComment;
	}
	public void setColComment(String colComment) {
		this.colComment = colComment;
	}
	public String getDatafuncIndex() {
		return datafuncIndex;
	}
	public void setDatafuncIndex(String datafuncIndex) {
		this.datafuncIndex = datafuncIndex;
	}
	
	public String getAppUrl() {
		return appUrl;
	}
	public void setAppUrl(String appUrl) {
		this.appUrl = appUrl;
	}
	public String getClickNum() {
		return clickNum;
	}
	public void setClickNum(String clickNum) {
		this.clickNum = clickNum;
	}
	public String getDataFormat() {
		return dataFormat;
	}
	public void setDataFormat(String dataFormat) {
		this.dataFormat = dataFormat;
	}
	public String getTripDown() {
		return tripDown;
	}
	public void setTripDown(String tripDown) {
		this.tripDown = tripDown;
	}	
	
}
