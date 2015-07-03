package org.apdplat.selfrpt.model;
import java.util.List;

//其他bean/pojo继承
public class Page { 	
	private int currentPage; 
	private int maxPage; // 总页数
	private int maxRow; // 总记录数 
	private int pageSize; // 每页显示记录数  		
	private String filePath;
	private String fileName;   	
	private float dataMaxLen [];	
	private boolean isSameLen [] ;	
	private String tableName;	
	private String colNames;// 字段名  	
	private int colNum;// 字段数	
	private String colTypes;// 字段类型(字段长度)	
	private String colRemarks;//字段备注   	
	private int flag;//测试SQL是否成功,0表示失败,1表示成功	
	private String sql;	
	private String showSql;//显示SQL	
	private String errorMsg;//SQL错误信息 	
	private String result;//返回页面提示信息	 
	private String userid="";
	private String levels="";
	private String cityCode="";
	private String dealDate=""; 
	private String results[];  
	private String beginRows; // sheet的表头占行数
	private String loginno=""; //当前登录账号
	private String index="";     //序号	
	private boolean isTrim=true; //是否删除空格，select下拉框不能删除，因为需要用in()查询	
	
	private List<?> list; // 存放n条记录
	private List<?> list2; // 存放n条记录  
	private List<?> list3; // 存放n条记录  
	private List<?> lists[]; 
	
	private Excel excel;	
	private Report report;
	private Select select;
	private User user; 
	
	public void set(int currentPage, int size,String sql) {
		this.currentPage = currentPage;
		this.pageSize = size;
		this.sql=sql;
	}

	public void set(int currentPage, int size, int rows) { // 求最大页数,并设置总行数,当前页和每页大小
		int maxPage;
		if (rows == 0) {
			maxPage = 1;
		} else if (rows % size == 0) {
			maxPage = (int) (rows / size); // 求最大页数=总记录数/每页记录数
		} else {
			maxPage = (int) (rows / size + 1);
		}
		this.currentPage = currentPage;
		this.pageSize = size;
		this.maxRow = rows;
		this.maxPage = maxPage;
	}

	public int getCurrentPage() {
		return currentPage;
	}

	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;
	}

	public int getMaxPage() {
		return maxPage;
	}

	public void setMaxPage(int maxPage) {
		this.maxPage = maxPage;
	}

	public int getMaxRow() {
		return maxRow;
	}

	public void setMaxRow(int maxRow) {
		this.maxRow = maxRow;
	}

	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	} 
	
	public float[] getDataMaxLen() {
		return dataMaxLen;
	}

	public void setDataMaxLen(float[] dataMaxLen) {
		this.dataMaxLen = dataMaxLen;
	}

	public int getColNum() {
		return colNum;
	}

	public void setColNum(int colNum) {
		this.colNum = colNum;
	}

	public String getColNames() {
		return colNames;
	}

	public void setColNames(String colNames) {
		this.colNames = colNames;
	}

	public boolean[] getIsSameLen() {
		return isSameLen;
	}

	public void setIsSameLen(boolean[] isSameLen) {
		this.isSameLen = isSameLen;
	}

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public String getColTypes() {
		return colTypes;
	}

	public void setColTypes(String colTypes) {
		this.colTypes = colTypes;
	}

	public String getColRemarks() {
		return colRemarks;
	}

	public void setColRemarks(String colRemarks) {
		this.colRemarks = colRemarks;
	}

	public int getFlag() {
		return flag;
	}

	public void setFlag(int flag) {
		this.flag = flag;
	}

	public String getSql() {
		return sql;
	}

	public void setSql(String sql) {
		this.sql = sql;
	}

	public String getShowSql() {
		return showSql;
	}

	public void setShowSql(String showSql) {
		this.showSql = showSql;
	}

	public String getErrorMsg() {
		return errorMsg;
	}

	public void setErrorMsg(String errorMsg) {
		this.errorMsg = errorMsg;
	} 
	
	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	} 
	
	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getLevels() {
		return levels;
	}

	public void setLevels(String levels) {
		this.levels = levels;
	}

	public String getCityCode() {
		return cityCode;
	}

	public void setCityCode(String cityCode) {
		this.cityCode = cityCode;
	}

	public String getDealDate() {
		return dealDate;
	}

	public void setDealDate(String dealDate) {
		this.dealDate = dealDate;
	}
	
	public String[] getResults() {
		return results;
	}

	public void setResults(String[] results) {
		this.results = results;
	}  

	public String getBeginRows() {
		return beginRows;
	}

	public void setBeginRows(String beginRows) {
		this.beginRows = beginRows;
	}

	public String getLoginno() {
		return loginno;
	}

	public void setLoginno(String loginno) {
		this.loginno = loginno;
	}

	public String getIndex() {
		return index;
	}

	public void setIndex(String index) {
		this.index = index;
	}

	public void setIsTrim(boolean isTrim) {
		this.isTrim = isTrim;
	}

	public boolean getIsTrim() {
		return isTrim;
	}


	public List<?> getList() {
		return list;
	}

	public void setList(List<?> list) {
		this.list = list;
	}

	public List<?> getList2() {
		return list2;
	}

	public void setList2(List<?> list2) {
		this.list2 = list2;
	}

	public List<?> getList3() {
		return list3;
	}

	public void setList3(List<?> list3) {
		this.list3 = list3;
	}

	public List<?>[] getLists() {
		return lists;
	}

	public void setLists(List<?>[] lists) {
		this.lists = lists;
	}

	public void setTrim(boolean isTrim) {
		this.isTrim = isTrim;
	}

	public Excel getExcel() {
		return excel;
	}

	public void setExcel(Excel excel) {
		this.excel = excel;
	}

	public Report getReport() {
		return report;
	}

	public void setReport(Report report) {
		this.report = report;
	}

	public Select getSelect() {
		return select;
	}

	public void setSelect(Select select) {
		this.select = select;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	} 
}
