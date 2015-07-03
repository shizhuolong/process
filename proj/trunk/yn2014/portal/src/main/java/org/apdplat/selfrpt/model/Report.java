package org.apdplat.selfrpt.model;

public class Report extends Page {  
	private String reportID;     //报表ID
	private String reportName;   //报表名称
	private String reportPath;   //报表路径
	private String pageTitles;   //报表标题
	private String isMoreHead;   //是否复杂表头
	private String colTitles;    //sql字段名
	private String showIndex;    //显示字段序号
	private String filterIndex;  //数据筛选
	private String nextRptIndex; //下钻报表
	private String nextID;       //下钻字段序号
	private String modelExcel;   //excel模板文件
	private String beginRow;     //excel写入数据开始行 
	private String selTitles;    //查询条件提示信息
	private String selConfig;    //查询条件配置=4大类别s/d/c/n+下拉查询groupno+其他参数
	private String chartGroupNo; //插入图片分组编号
	private String reportExplain;//报表口径，指标说明
	private String powerExplain; //权限说明
	private String clickNum;     //报表点击次数
	private String updateTime;   //更新时间
	private String createTime;   //创建时间
	private String createUserid; //创建人ID
	private String createGroupID;//创建人ID
	private String isUse;        //是否使用:1使用,-1待审核,-2下线(逻辑删除删除)	 
	private String frameID;      //架构ID:1营销架构,2渠道属性,3品牌
	private String frameID2;     //次维度1;次维度2
	private String reportSql;    //报表SQL 
	private String levelsMax;    //报表最大层级 
	private String levelsTable;  //报表最大层级
	private String groupIndex;
	private String appid;
	private String appname;
	private String isFirst;  
	public String getReportID() {
		return reportID;
	}

	public void setReportID(String reportID) {
		this.reportID = reportID;
	}

	public String getReportName() {
		return this.reportName;
	}

	public void setReportName(String reportName) {
		this.reportName = reportName;
	}

	public String getReportPath() {
		return this.reportPath;
	}

	public void setReportPath(String reportPath) {
		this.reportPath = reportPath;
	} 

	public String getPageTitles() {
		return pageTitles;
	}

	public void setPageTitles(String pageTitles) {
		this.pageTitles = pageTitles;
	}

	public String getColTitles() {
		return colTitles;
	}

	public void setColTitles(String colTitles) {
		this.colTitles = colTitles;
	}

	public String getShowIndex() {
		return this.showIndex;
	}

	public void setShowIndex(String showIndex) {
		this.showIndex = showIndex;
	} 

	public String getFilterIndex() {
		return filterIndex;
	}

	public void setFilterIndex(String filterIndex) {
		this.filterIndex = filterIndex;
	}

	public String getNextRptIndex() {
		return nextRptIndex;
	}

	public void setNextRptIndex(String nextRptIndex) {
		this.nextRptIndex = nextRptIndex;
	}

	public String getNextID() {
		return nextID;
	}

	public void setNextID(String nextID) {
		this.nextID = nextID;
	}

	public String getModelExcel() {
		return this.modelExcel;
	}

	public void setModelExcel(String modelExcel) {
		this.modelExcel = modelExcel;
	}

	public String getBeginRow() {
		return this.beginRow;
	}

	public void setBeginRow(String beginRow) {
		this.beginRow = beginRow;
	}

	public String getIsMoreHead() {
		return this.isMoreHead;
	}

	public void setIsMoreHead(String isMoreHead) {
		this.isMoreHead = isMoreHead;
	}

	public String getSelTitles() {
		return this.selTitles;
	}

	public void setSelTitles(String selTitles) {
		this.selTitles = selTitles;
	}

	public String getSelConfig() {
		return this.selConfig;
	}

	public void setSelConfig(String selConfig) {
		this.selConfig = selConfig;
	} 

	public String getChartGroupNo() {
		return chartGroupNo;
	}

	public void setChartGroupNo(String chartGroupNo) {
		this.chartGroupNo = chartGroupNo;
	}

	public String getReportExplain() {
		return this.reportExplain;
	}

	public void setReportExplain(String reportExplain) {
		this.reportExplain = reportExplain;
	}

	public String getClickNum() {
		return clickNum;
	}

	public void setClickNum(String clickNum) {
		this.clickNum = clickNum;
	}

	public String getPowerExplain() {
		return powerExplain;
	}

	public void setPowerExplain(String powerExplain) {
		this.powerExplain = powerExplain;
	}

	public String getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(String updateTime) {
		this.updateTime = updateTime;
	}

	public String getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	public String getCreateUserid() {
		return this.createUserid;
	}

	public void setCreateUserid(String createUserid) {
		this.createUserid = createUserid;
	}

	public String getCreateGroupNo() {
		return createGroupID;
	}

	public void setCreateGroupNo(String createGroupNo) {
		this.createGroupID = createGroupNo;
	}

	public String getIsUse() {
		return this.isUse;
	}

	public void setIsUse(String isUse) {
		this.isUse = isUse;
	}

	 

//	public String getLevels() {
//		return levels;
//	}
//
//	public void setLevels(String levels) {
//		this.levels = levels;
//	}

	public String getFrameID() {
		return frameID;
	}

	public void setFrameID(String frameID) {
		this.frameID = frameID;
	}

	public String getReportSql() {
		return reportSql;
	}

	public void setReportSql(String reportSql) {
		this.reportSql = reportSql;
	}

	public String getLevelsMax() {
		return levelsMax;
	}

	public void setLevelsMax(String levelsMax) {
		this.levelsMax = levelsMax;
	}

	public String getFrameID2() {
		return frameID2;
	}

	public void setFrameID2(String frameID2) {
		this.frameID2 = frameID2;
	}

	public String getLevelsTable() {
		return levelsTable;
	}

	public void setLevelsTable(String levelsTable) {
		this.levelsTable = levelsTable;
	}

	public String getCreateGroupID() {
		return createGroupID;
	}

	public void setCreateGroupID(String createGroupID) {
		this.createGroupID = createGroupID;
	} 

	public String getAppid() {
		return appid;
	}

	public void setAppid(String appid) {
		this.appid = appid;
	}

	public String getGroupIndex() {
		return groupIndex;
	}

	public void setGroupIndex(String groupIndex) {
		this.groupIndex = groupIndex;
	}

	public String getAppname() {
		return appname;
	}

	public void setAppname(String appname) {
		this.appname = appname;
	}

	public String getIsFirst() {
		return isFirst;
	}

	public void setIsFirst(String isFirst) {
		this.isFirst = isFirst;
	} 
	
}