package org.apdplat.selfrpt.action;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apdplat.selfrpt.model.Config;
import org.apdplat.selfrpt.model.Page;
import org.apdplat.selfrpt.model.Select;
import org.apdplat.selfrpt.util.JdbcUtil;
import org.apdplat.selfrpt.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;

//查询条件配置
public class SelectConfigAction extends PortalBaseAction {	
	private Page page=new Page();
	private String selID; //查询条件id
	private String selName;//条件名称  
	private String selType; 
	private String selValue;  
	private String selText;     
	private String isMore;       
	private String isFuzzyQuery=""; 
	private String useType;     
	private String selExplain;  
	private String colNames;    
	private String createGroupid="1"; 
	private String dataTitles=""; 
	private int levels=-1;        
	private String sql;    
	private int levelsMax=0;       
	private String nextData="";  //下钻传递的参数 
	private String loginno=""; 
	private String dataLevel=""; //数据权限，-1 否; 0 是;1 地市(第1级);2 区县(第2级)
	private int pageSize = 15;   //每页显示记录数
	private int currentPage = 1; //当前页  
	private int flag=0;        
	@Autowired
	private JdbcUtil jdbc;
	final Log logger = LogFactory.getLog(getClass());
	/**
	 * 新增初始化数据 
	 * @return
	 */
	public String initAddSelect() {   
		String userid=getUserAccount(); 
		if(userid==null || userid.equals("")){
			userid="admin";
		}
		String querySql ="select max(sel_id)+1 from report_sel_config";	
		List<String[]> list = jdbc.findList(querySql);  
		if(list.size()>0){
			String[] data= (String[]) list.get(0);  
			selID=data[0];			
		}	 
		Select s=new Select();
		s.setSelID(selID);
		page.setSelect(s); 
		return "JsonDate";		
	} 
	
	/**
	 * 更新初始化数据
	 * @return
	 */
	public String initUpdateSelect() { 
		String userid=getUserAccount(); 
		if(userid==null || userid.equals("")){
			userid="admin";
		}
		//某组图片的级数 
		String querySql ="select max(levels) from report_sel_sql where sel_id="+selID;
		List<String[]> list = jdbc.findList(querySql);   
		String levels="0";
		if(list.size()>0){
			String[] data = (String[]) list.get(0);  
			levels=data[0];			
		}	  
		Select s=new Select();
		s.setSelID(selID);
		s.setLevels(levels); 
		querySql="select " + Config.getColNameSel()+ " from report_sel_config A,report_sel_sql B "+
	         "where A.sel_id=B.sel_id and A.sel_id="+selID+" and use_type!=-1 order by B.levels";//必须排序
		List<String[]> listTmp=jdbc.findList(querySql);
		List<Select> sList = new ArrayList<Select>();   
		for (int i = 0; i < listTmp.size(); i++) {
			String[] data = (String[]) listTmp.get(i);   
			Select select=new Select();
			select=Config.setSelect(data); 
			sList.add(select); 
		} 
		page.setSelect(s);
		page.setList(sList);  
		return "JsonDate";
	}	 
	
	/**
	 * 测试SQL
	 * @return
	 */
	public String testSql() {
		//根据页面sql查找数据
		sql = sql.replaceAll("\\##", "\\%"); //还原%  
		sql = sql.replaceAll("''", "'");//mysql
		if(nextData.equals("")){ 
			sql = sql.replaceAll(":", "");
		}else{
			sql=StringUtil.replaceSql(sql, nextData); 
		} 
		Page form = new Page(); 
		form.set(currentPage, pageSize,sql); // 设置当前页和每页大小  
		page = jdbc.findPage(form);   
		return "JsonDate";
	} 
	 
	/**
	 * 保存条件
	 * @return
	 */
	public String saveConfig() {  
		String userid=getUserAccount(); 
		if(userid==null || userid.equals("")){
			userid="admin";
		}
		createGroupid="1";//创建用户的归属地
		sql = sql.replaceAll("\\##", "\\%");
		sql = sql.replaceAll("\\'", "''");//mysql使用
		dataTitles = dataTitles.replaceAll("\\##", "\\%"); 
         
		levels=levels+1;//页面tab从0开始 
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String time=sdf.format(new Date());    
		
		String querySql ="select sel_id from report_sel_config where sel_id="+selID;		
		List<String[]> list = jdbc.findList(querySql);  
		if(list.size()>0 && levels==1 && !selID.equals("0")){//更新,第1次更新，避免重复更新. selID==0说明是新增？
			String[] data = (String[]) list.get(0); 
			selID=data[0];  
			levels=levels-1;
			flag=updateConfig(); 
		}else{//增加 
		   if(selID.equals("0")){
			   querySql ="select max(sel_id)+1 from report_sel_config";		
				list = jdbc.findList(querySql);  
				if(list.size()>0){
					String[] data= (String[]) list.get(0);  
					selID=data[0];			
				}		
			}
			
           if(levels==1){ //首次插入，避免重复插入
        	   querySql="insert into report_sel_config (sel_id,sel_name,sel_type,is_more,is_fuzzy_query,"+
				"use_type,level_max,is_update,sel_explain,create_userid,create_time,create_groupid,order_no) values ("+selID+",'"+selName+"','"+
				 selType+"','"+isMore+"','"+isFuzzyQuery+"','"+useType+"','"+levelsMax+"',1,'"+selExplain+"','"+userid+"','"+time+"','"+createGroupid+"',"+selID+")";
				flag=jdbc.add(querySql); 
			}			
		} 		
		querySql ="select sel_id from report_sel_sql where sel_id="+selID+" and levels="+levels;		
		list = jdbc.findList(querySql);  
		if(list.size()>0){//更新
			String[] data1 = (String[]) list.get(0); 
			selID=data1[0];  
			levels=levels-1;
			flag=updateConfig2(); 
		}else{//增加 
			querySql="insert into report_sel_sql (sel_id,levels,sel_sql,col_names,sel_value,sel_text,nextid,data_level) values ("+
				 selID+",'"+levels+"','"+sql+"','"+colNames+"','"+selValue+"','"+selText+"','"+selValue+"','"+dataLevel+"')"; //"+nextID+"
			flag=jdbc.add(querySql); 
		}
		//根据最大级别是否需要删除数据 
		querySql ="select max(levels) from report_sel_sql where sel_id="+selID; 
		list = jdbc.findList(querySql); 
		String[] data = (String[]) list.get(0); 
		int levelsMax2=Integer.valueOf(data[0]);   
		if(levelsMax<levelsMax2){//删除以前的 
			querySql="delete from report_sel_sql  where sel_id="+selID+" and levels>"+levelsMax;  
			jdbc.delete(querySql);
		} 		
		page.setFlag(flag);  
		Select s=new Select();
		s.setSelID(selID);
		page.setSelect(s);
		return "JsonDate";
	} 
	
	/**
	 * 更新条件
	 * @return
	 */
	public int updateConfig() {	
		String userid=getUserAccount(); 
		if(userid==null || userid.equals("")){
			userid="admin";
		}
		createGroupid="1";//登陆用户级别
		sql = sql.replaceAll("\\##", "\\%");  
		dataTitles = dataTitles.replaceAll("\\##", "\\%"); 
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String time=sdf.format(new Date()); 
		levels=levels+1;//页面tab从0开始
     	String updSql="update report_sel_config set sel_name='"+selName+"', sel_type='"+selType+"', is_more='"+isMore+"', is_fuzzy_query='"+isFuzzyQuery+
				    "', use_type='"+useType+"', level_max='"+levelsMax+"', sel_explain='"+selExplain+"', update_time='"+time+"' where sel_id="+selID;
		int flag=jdbc.update(updSql);  
		return flag;
	} 	
	
	public int updateConfig2() {	
		String userid=getUserAccount(); 
		if(userid==null || userid.equals("")){
			userid="admin";
		}
		sql = sql.replaceAll("\\##", "\\%");  
		dataTitles = dataTitles.replaceAll("\\##", "\\%"); 
		levels=levels+1;//页面tab从0开始 
		String updSql="update report_sel_sql set sel_sql='"+sql+"', col_names='"+colNames+"', sel_value='"+selValue+
				    "', sel_text='"+selText+"', nextid='"+selValue+"', data_level='"+dataLevel+"' where sel_id="+selID+" and levels="+levels; //nextid='"+nextID+"'
		int flag=jdbc.update(updSql);  
		return flag;
	}

	/**
	 * 查询查询条件
	 * @return
	 */
	public String findSelect() {  
		int levels2=levels;
		if(levels>levelsMax && levelsMax>0){
			levels=levelsMax;
		}
		String querySql="select " + Config.getColNameSel()+ " from report_sel_config A,report_sel_sql B "+
        "where A.sel_id=B.sel_id and A.sel_id="+selID+" and B.levels="+levels+" and use_type!=-1";
		List<String[]> list=jdbc.findList(querySql); 
		Select s=new Select();
		if(list.size()>0){
			String[] data= (String[]) list.get(0);    
			s=Config.setSelect(data);  
		}	 
		sql=s.getSelSql();
		String colNames[]=s.getColNames().split(";");
		int colIndex=Integer.valueOf(s.getSelValue());//.getSelText() 
		nextData=colNames[colIndex]+":"+nextData; //字段名:字段值
		sql = sql.replaceAll("\\#", "\\%"); //还原%  
		sql = sql.replaceAll("''", "'");//mysql
		if(nextData.equals("") || levels==1){  
			sql = sql.replaceAll(":", "");
		}else{
			if(s.getSelID().equals("116") && !s.getDataLevel().equals("-1") && levels2>1){ //地市单层中文,特殊处理 
				sql="select group_id,group_name from pods.t_cde_chl_msg_tree where denorm_level=1 and group_name =:'广州' order by order_id,group_name";
			}
			sql=StringUtil.replaceSql(sql, nextData); //nextData可以有多个"字段名1:字段值1;字段名2:字段值2",分号分隔
		} 
		List<String[]> list1=jdbc.findList(sql); 
		page.setSelect(s);
		page.setList(list1);  
		return "JsonDate";
	}
	
	/**
	 * 查询条件
	 * @return
	 */
	public String findAllSelConfig() {	
		String querySql="select " + Config.getColNameSel()+ " from report_sel_config A,report_sel_sql B "+
        "where A.sel_id=B.sel_id and B.levels=1 and use_type!=-1";//必须排序 and A.sel_id="+selID+" and B.levels="+levels+" 
		if(!loginno.equals("admin")){//管理员可以看所有. 地市管理员(单独表?)可以看该地市所有用户配置的报表，分配权限?
			querySql+=" and create_userid='"+loginno+"'";
		}
		if(!selName.equals("")){
			querySql+=" and sel_name like '%"+selName+"%'";
		} 
		querySql+=" order by A.sel_id";
		page.set(currentPage, 30, querySql); 
		page=jdbc.findPage(page);
		List<?> listTmp=page.getList();
		List<Select> list = new ArrayList<Select>();   
		for (int i = 0; i < listTmp.size(); i++) {
			String[] data1 = (String[]) listTmp.get(i);  
			Select s=new Select();
			s=Config.setSelect(data1);  
			 
			if(s.getSelType().equals("1")){
				s.setSelType("层级(树)");
			}else if(s.getSelType().equals("2")){
				s.setSelType("级联");
			} 
			if(s.getIsMore().equals("1")){
				s.setIsMore("多选");
			}else if(s.getIsMore().equals("-1")){
				s.setIsMore("单选");
			}
			
			if(s.getDataLevel().equals("-1")){
				s.setDataLevel("无");
			}else if(s.getDataLevel().equals("0")){
				s.setDataLevel("有");
			}else if(s.getDataLevel().equals("2,code")){
				s.setDataLevel("2级(地市ID)");
			}else if(s.getDataLevel().equals("3,code")){
				s.setDataLevel("3级(区县ID)");
			}else if(s.getDataLevel().equals("4,code")){
				s.setDataLevel("4级(营服中心ID)");
			}else if(s.getDataLevel().equals("5,code")){
				s.setDataLevel("5级(网格ID)");
			}else if(s.getDataLevel().equals("6,code")){
				s.setDataLevel("6级(网点ID)");
			}else if(s.getDataLevel().equals("2,name")){
				s.setDataLevel("2级(地市名称)");
			}else if(s.getDataLevel().equals("3,name")){
				s.setDataLevel("3级(区县名称)");
			}else if(s.getDataLevel().equals("8,loginno")){
				s.setDataLevel("用户账号");
			}
			list.add(s); 
		}   
		page.setList(list);
		return "JsonDate";
	} 	
	/**
	 * 删除条件
	 * @return
	 */
	public String delSel() {	
		String querySql="select create_userid report_sel_config where sel_id="+selID;
		String userid=jdbc.findOneData(querySql);
		if(userid.equals(loginno) || loginno.equals("admin")){
			querySql="update report_sel_config set use_type=-1 where sel_id="+selID; 
			flag=jdbc.update(querySql);
		}
		page.setFlag(flag); 
		return "JsonDate";
	}
	/**
	 * 查找日期和数据权限下拉列表
	 * @param jdbc
	 * @param groupID
	 * @return
	 */
	public List<Select> getSelSys(JdbcUtil jdbc,String groupID) {			
		String querySql="select t.sel_group,t.sel_value, t.sel_text, t.sel_title from report_sel_value t "+
			 "where t.sel_group in ("+groupID+") and t.is_use = 1 order by t.sel_group,sel_order"; 
		List<String[]> listTmp=jdbc.findList(querySql);
		List<Select> list = new ArrayList<Select>();   
		for (int i = 0; i < listTmp.size(); i++) {
			String[] data= (String[]) listTmp.get(i); 
			Select s = new Select();  
			s.setSelGroup(data[0]);
			s.setSelValue(data[1]);
			s.setSelText(data[2]);
			s.setSelTitle(data[3]);
			list.add(s); 
		}
		return list;
	}
	/**
	 * 下拉框码表
	 * @param jdbc
	 * @param loginno
	 * @return
	 */
	public List<Select> getSelCfg(JdbcUtil jdbc,String loginno) {	
		String querySql="select t.sel_id,t.sel_name,t2.col_names,t2.sel_value,t2.data_level from report_sel_config t ,report_sel_sql t2 "+
					"where t.sel_id=t2.sel_id and t.use_type=1 and t2.levels=1 order by sel_id";//查询公用和自己创建的  or t.create_userid='"+loginno+"'
		List<String[]> listTmp=jdbc.findList(querySql);
		List<Select> list = new ArrayList<Select>();   
		for (int i = 0; i < listTmp.size(); i++) {
			String[] data1 = (String[]) listTmp.get(i); 
			Select s = new Select();   
			s.setSelID(data1[0]);
			s.setSelName(data1[1]); 
			String colNames[]=data1[2].split(";"); 
			int selValue=Integer.valueOf(data1[3]);
			int dataLevel=0;
			if(data1[4].indexOf(",")>0){
				dataLevel=Integer.valueOf(data1[4].substring(0,data1[4].indexOf(",")));;
			}else{
				dataLevel=Integer.valueOf(data1[4]);
			}
			if(dataLevel>=0){
				s.setSelName(data1[1]+"[权限]"); 
			}
			s.setColNames(colNames[selValue]);
			list.add(s); 
		} 
		return list;
	}

	public Page getPage() {
		return page;
	}

	public void setPage(Page page) {
		this.page = page;
	}  
	
	public void setSelID(String selID) {
		this.selID = selID;
	}

	public void setSelName(String selName) {
		this.selName = selName;
	}

	public void setSelType(String selType) {
		this.selType = selType;
	}

	public void setSelValue(String selValue) {
		this.selValue = selValue;
	}

	public void setSelText(String selText) {
		this.selText = selText;
	}

	public void setIsMore(String isMore) {
		this.isMore = isMore;
	}

	public void setIsFuzzyQuery(String isFuzzyQuery) {
		this.isFuzzyQuery = isFuzzyQuery;
	}

	public void setUseType(String useType) {
		this.useType = useType;
	}

	public void setSelExplain(String selExplain) {
		this.selExplain = selExplain;
	}

	public void setColNames(String colNames) {
		this.colNames = colNames;
	}

	public void setCreateGroupid(String createGroupid) {
		this.createGroupid = createGroupid;
	}

	public void setDataTitles(String dataTitles) {
		this.dataTitles = dataTitles;
	}

	public void setLevels(int levels) {
		this.levels = levels;
	}

	public void setSql(String sql) {
		this.sql = sql;
	}
	public void setLevelsMax(int levelsMax) {
		this.levelsMax = levelsMax;
	}

	public void setNextData(String nextData) {
		this.nextData = nextData;
	}

	public void setLoginno(String loginno) {
		this.loginno = loginno;
	}

	public void setDataLevel(String dataLevel) {
		this.dataLevel = dataLevel;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;
	}

	public void setFlag(int flag) {
		this.flag = flag;
	}

	public void setJdbc(JdbcUtil jdbc) {
		this.jdbc = jdbc;
	}
	
}
