package org.apdplat.selfrpt.model;

public class Select extends Page {  
	private String selID;       //下拉框查询ID
	private String selName;     //下拉框名称  
	private String selType;     //下拉框分3类:简单/多级/级联查询
	private String selValue;    //下拉框值字段序号
	private String selText;     //下拉框显示值字段序号
	private String selTitle;    //下拉框option title属性
	private String selOrder;    //排序字段序号
	private String nextID;      //传参字段序号或=:指定
	private String isMore;      //是否多选
	private String isFuzzyQuery;//是否模糊查询
	private String useType;     //使用类型: -1禁用,0个人使用,1公共使用
	private String selExplain;  //下拉框备注
	private String createUserid;//创建人id
	private String createGroupid;//创建人id归属地,使用/修改配置权限.
	private String createTime;  //创建时间
	private String isLeaf;      //是否有叶子节点
	private String colNames;    //下拉框字段名称
	private String selSql; 	    //下拉框查询sql
	private String selGroup;    //下拉框分组
	private String signType;    //s下拉框,d日期,c字符,n数字 
	private String dateType;    //日期类型 
	private String levelsMax="";//查询条件最大层级
	private String levelsNow="";//查询条件当前级数
	private String findData=""; //查询条件值 
	private String dataLevel="";//数据权限，-1 否; 0 是;1 地市(第1级);2 区县(第2级)
	private String dataLevelType="";//数据权限类别 2,code;2,name;8,loginno;
	
	public String getSelID() {
		return selID;
	}

	public void setSelID(String selID) {
		this.selID = selID;
	} 

	public String getSelName() {
		return selName;
	}

	public void setSelName(String selName) {
		this.selName = selName;
	}  

	public String getSelType() {
		return this.selType;
	}

	public void setSelType(String selType) {
		this.selType = selType;
	}  

	public String getSelValue() {
		return this.selValue;
	}

	public void setSelValue(String selValue) {
		this.selValue = selValue;
	}

	public String getSelText() {
		return this.selText;
	}

	public void setSelText(String selText) {
		this.selText = selText;
	}

	public String getSelTitle() {
		return selTitle;
	}

	public void setSelTitle(String selTitle) {
		this.selTitle = selTitle;
	}

	public String getSelOrder() {
		return this.selOrder;
	}

	public void setSelOrder(String selOrder) {
		this.selOrder = selOrder;
	} 

	public String getNextID() {
		return nextID;
	}

	public void setNextID(String nextID) {
		this.nextID = nextID;
	}

	public String getIsMore() {
		return this.isMore;
	}

	public void setIsMore(String isMore) {
		this.isMore = isMore;
	}

	public String getIsFuzzyQuery() {
		return this.isFuzzyQuery;
	}

	public void setIsFuzzyQuery(String isFuzzyQuery) {
		this.isFuzzyQuery = isFuzzyQuery;
	}

	public String getUseType() {
		return this.useType;
	}

	public void setUseType(String useType) {
		this.useType = useType;
	} 

	public String getSelExplain() {
		return this.selExplain;
	}

	public void setSelExplain(String selExplain) {
		this.selExplain = selExplain;
	}

	public String getCreateUserid() {
		return this.createUserid;
	}

	public void setCreateUserid(String createUserid) {
		this.createUserid = createUserid;
	}

	public String getCreateGroupid() {
		return createGroupid;
	}

	public void setCreateGroupid(String createGroupid) {
		this.createGroupid = createGroupid;
	}

	public String getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	} 
	
	public String getSelSql() {
		return selSql;
	}

	public void setSelSql(String selSql) {
		this.selSql = selSql;
	}

	public String getSelGroup() {
		return selGroup;
	}

	public void setSelGroup(String selGroup) {
		this.selGroup = selGroup;
	}

	public String getColNames() {
		return colNames;
	}

	public void setColNames(String colNames) {
		this.colNames = colNames;
	}

	public String getSignType() {
		return signType;
	}

	public void setSignType(String signType) {
		this.signType = signType;
	}

	public String getFindData() {
		return findData;
	}

	public void setFindData(String findData) {
		this.findData = findData;
	}

	public String getDateType() {
		return dateType;
	}

	public void setDateType(String dateType) {
		this.dateType = dateType;
	}

	public String getIsLeaf() {
		return isLeaf;
	}

	public void setIsLeaf(String isLeaf) {
		this.isLeaf = isLeaf;
	}

	public String getLevelsMax() {
		return levelsMax;
	}

	public void setLevelsMax(String levelsMax) {
		this.levelsMax = levelsMax;
	}

	public String getLevelsNow() {
		return levelsNow;
	}

	public void setLevelsNow(String levelsNow) {
		this.levelsNow = levelsNow;
	}

	public String getDataLevel() {
		return dataLevel;
	}

	public void setDataLevel(String dataLevel) {
		this.dataLevel = dataLevel;
	}

	public String getDataLevelType() {
		return dataLevelType;
	}

	public void setDataLevelType(String dataLevelType) {
		this.dataLevelType = dataLevelType;
	} 
	
}