package org.apdplat.selfrpt.action;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apdplat.module.module.model.Command;
import org.apdplat.module.module.model.Module;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.service.ServiceFacade;
import org.apdplat.selfrpt.model.Config;
import org.apdplat.selfrpt.model.Excel;
import org.apdplat.selfrpt.model.Page;
import org.apdplat.selfrpt.model.Report;
import org.apdplat.selfrpt.model.Select;
import org.apdplat.selfrpt.util.DateUtil;
import org.apdplat.selfrpt.util.JdbcUtil;
import org.springframework.beans.factory.annotation.Autowired;

//报表配置工具
public class ReportConfigAction {	
	private Page page=new Page();
	private String reportID=""; //报表id
	private String groupNo="";  
	private int levels=-1;      
	private int levelsMax=0;    
	private String sql="";
	private String owner="";//数据库用户
	private String tableType="";//表或视图类型
	private String tableName="";//表或视图名称
	private String reportName=""; //报表名称
	private String reportPath=""; //报表路径
	private String pageTitle="";//报表显示头
	private String isMoreHead="";//是否是多表头
	private String importIndex="";
	private String checkIndex="";
	private String onlyIndex=""; //数据唯一性验证
	private String showIndex="";
	private String orderIndex="";
	private String groupIndex="";
	private String dataFormat="";
	private String whereInfo="";
	private String tripInfo="";  //下钻
	private String colName="";   //字段名称
	private String funcIndex = "";//函数
	private String datafuncIndex="";//千分位
	private String isMoreWhere="";
	private String editInfo="";//编辑时表单类型  
	private String operateType=""; //功能权限update;add;delete
	private String operateData=""; //数据权限
	private String modelExcel="";
	private String reportExplain=""; 
	private String parId;//目录树父节点id
	private int beginRow;
	private int flag=0; 
	private int isSave=-1; //是保存还是预览 -1预览，1保存
	private int isLike=0;
	private String  type=""; 
	private String loginno=""; //登陆账号
	private String loginno2=""; //页面输入 
	private String isAddCol=""; //是否追加字段
	private String isUpdate=""; //导入数据：1覆盖更新/0追加插入
	private int pageSize = 50;  //每页显示记录数
	private int currentPage = 1;//当前页
	private String tripDown="";//下钻按层级下钻下载的字段
	@Autowired
	private ServiceFacade serviceFacade;//菜单管理
	@Autowired
	private JdbcUtil jdbc;	   
	final Log logger = LogFactory.getLog(getClass());
	//新增初始化数据 
	public String initAddExcel() { 
		String querySql = "select max(groupno)+1 from report_config"; 
		groupNo = jdbc.findOneData(querySql);   
		Excel e = new Excel(); 
		e.setGroupNo(groupNo);  
		page.setExcel(e); 
		querySql="select id,chinese,parentmodule_id pid from APDP_MODULE where url is null ";
		if(parId!=null&&!parId.equals("")){
			querySql+="AND PARENTMODULE_ID="+parId;
		}
		List<String[]> listTmp=jdbc.findList(querySql);
		List<Map<String,String>> list = new ArrayList<Map<String,String>>();   
		for (int i = 0; i < listTmp.size(); i++) {
			Map<String,String>map=new HashMap<String,String>();
			String[] str = listTmp.get(i);  
			map.put("id", str[0]);
			map.put("name", str[1]);
			map.put("pid", str[2]);
			list.add(map); 
		}   
		page.setList(list); 
		return "JsonDate";		
	} 
	
	//更新初始化数据
	public String initUpdateExcel() {  
		String querySql = "select max(levels) from report_config where groupNo="+groupNo; 
		String levels = jdbc.findOneData(querySql);  
		if(levels.equals("")){
			levels="0";			
		}	 
		Excel e = new Excel();
		e.setGroupNo(groupNo);
		e.setLevels(levels);
		querySql="select "+Config.getColNameExcel()+" from report_config where groupNo="+groupNo+" and is_save=1 order by levels"; //必须排序
		List<String[]> listTmp=jdbc.findList(querySql);
		List<Excel> list4 = new ArrayList<Excel>();   
		for (int i = 0; i < listTmp.size(); i++) {
			String[] data1 = (String[]) listTmp.get(i); 
			Excel e2=new Excel();
			e2=Config.setExcel(data1); 
			String colName[]=e2.getColName().split(";");
			page=jdbc.getTableInfo(e2.getTableName());
			
			String[]name=page.getColNames().split(";");
			String[]remark=page.getColRemarks().split(";");
			String[]colType=page.getColTypes().split(";");
			Map<String,String>map=new HashMap<String,String>();
			for(int m=0;m<name.length;m++){
				if(remark==null||remark.length<(1+m)||remark[m]==null){
					map.put(name[m], "&@&"+colType[m]);
				}else{
					map.put(name[m], remark[m]+"&@&"+colType[m]);
				}
			}
			String _remark="";
			String _colType="";
			for(int n=0;n<colName.length;n++){
				_remark+=map.get(colName[n]).split("&@&")[0]+";";
				_colType+=map.get(colName[n]).split("&@&")[1]+";";
			}
			_remark=_remark.substring(0,_remark.length()-1);
			_colType=_colType.substring(0,_colType.length()-1);
			
			
			if(page.getFlag()==1){
				tableName=e2.getTableName(); 
				e2.setColNames(e2.getColName()); 
				e2.setColTypes(_colType); 
				e2.setColRemarks(_remark);
			}else{
				logger.debug(e2.getTableName()+"表不存在");
			} 
			list4.add(e2);  
		}  
		
		//获取1级目录
		querySql="select id,parentmodule_id pid,chinese from APDP_MODULE where url is null";
		listTmp=jdbc.findList(querySql);
		List<Report> list5 = new ArrayList<Report>();   
		for (int i = 0; i < listTmp.size(); i++) {
			String[] data1 = (String[]) listTmp.get(i);  
			Report r2=new Report();
			r2.setAppid(data1[0]);
			r2.setAppname(data1[1]);
			list5.add(r2); 
		} 	  
		
		List<Select> list =getSelWhere(); //查询条件
		List<Select> list2 =getSelEdit(); //字段编辑 
		List<Select> list3 =getSelFormat(); //数据格式
		page.setExcel(e);  
		List<?> lists[]={list,list2,list3,list4,list5};
		page.setLists(lists);
		return "JsonDate";
	}	

	//查询表名
	public String findTabelName() {
		page=jdbc.getTableInfo(tableName);  
		List<Select> list =getSelWhere(); //查询条件
		List<Select> list2 =getSelEdit();  //字段编辑 
		List<Select> list3 =getSelFormat(); //数据格式
		List<?> lists[]={list,list2,list3};
		page.setLists(lists);
		return "JsonDate";
	}
	
	//增加字段和字段备注
	public String addTableCol() { 
		if(isAddCol.equals("1")){//导入 需要增加字段
			page=jdbc.getTableInfo(tableName);  
			String colNames=page.getColNames().trim().toLowerCase();
			logger.debug("tableName ="+tableName);
			if(colNames.indexOf("in_time;in_user_name;in_user_id;in_id")==-1){ //若4个字段都有,则不删除,防止数据丢失
				String colNames2 []={"in_time", "in_user_name", "in_user_id", "in_id"}; 
				for(int i=0;i<colNames2.length;i++){
					if(colNames.indexOf(colNames2[i])>=0){ //存在则删除
						sql="alter table "+tableName+" drop column "+colNames2[i];
						flag=jdbc.update(sql);
					} 
				}  
				String colNames3[] ={"in_time varchar2(20)", "in_user_name varchar2(20)", "in_user_id varchar2(20)", "in_id number(10)"};	
				String comments []={"导入时间","导入用户名","导入用户ID","导入ID"};
				for(int i=0;i<colNames2.length;i++){  
					sql="alter table "+tableName+" add "+colNames3[i]; //mysql(add column)
					flag=jdbc.update(sql); //测试环境暂时注释
					sql="comment on column "+tableName+"."+colNames2[i]+" is '"+comments[i]+"'";
					flag=jdbc.update(sql); //测试环境暂时注释
				}	 
			}else{
				flag=1;
			}		
			page.setFlag(flag); 
		}
		
		return "JsonDate";
	}

	
	//保存配置
	public String saveConfig() {  
		pageTitle = pageTitle.replaceAll("\\#", "\\%");         
		levels=levels+1;//页面tab从0开始    
		if(reportID==null||reportID.equals("")){//如果为空随便给reportID赋个值（不然下面sql报错）确保以前没有记录为新增
			reportID="-11";
		}
		String querySql ="select report_id,is_save from report_config t where t.report_id='"+reportID+"'"; 
		List<String[]> list = jdbc.findList(querySql); 
		if(list!=null&&list.size()>0){
			String[] data = (String[]) list.get(0); 
			isSave=Integer.valueOf(data[1]); 
			if(type.equals("save") && isSave==-1){ //修改状态
				querySql="update report_config set is_save=1 where groupNo="+groupNo+" and levels="+levels;
				flag=jdbc.update(querySql);   
			} 
			levels=levels-1;
			flag=updateConfig(); //更新
			
			//根据最大级别是否需要删除多余层级数据
			querySql ="select count(report_id) from report_config t where t.groupno="+groupNo; 
			int levelsMax2=Integer.valueOf(jdbc.findOneData(querySql));  
			logger.debug("levelsMax=" + levelsMax+",levelsMax2="+levelsMax2); 
			if(levelsMax<levelsMax2){//删除以前的
				querySql="delete from report_config  where groupno="+groupNo+" and levels>"+levelsMax; 
				jdbc.delete(querySql);
			}
		}else{//增加
			if(type.equals("view")){
				isSave=-1;//预览
			}else{
				isSave=1;//保存
			}
			querySql ="select max(report_id)+1 from report_config t"; 
			reportID = "".equals(jdbc.findOneData(querySql))?"1":jdbc.findOneData(querySql);   //及时获取最新的，避免多人同时获取会出现相同的id,互相影响!
			querySql = "select max(groupno)+1 from report_config"; 
			groupNo = "".equals(jdbc.findOneData(querySql))?"0":jdbc.findOneData(querySql);   
			User user = UserHolder.getCurrentLoginUser();
			String userid =user.getUsername();
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String nowDate =  sdf.format(new Date());  
			if(orderIndex.equals("")){
				orderIndex="1,2";//默认是前2个字段排序.
			}
			if(isAddCol.equals("true")){
				isAddCol="1";
			}else{
				isAddCol="-1";
			}
			modelExcel = modelExcel.replaceAll("\\##", "\\%");
			modelExcel = modelExcel.replaceAll("\\'", "''");
			querySql="insert into report_config("+Config.getColNameExcel()+") values ("+reportID+",'"+reportName+"','"+reportPath+"', "+groupNo+", "+levels+", '"+tableType+"', '"+tableName.toUpperCase()+"','sql', '"+pageTitle+"','"+importIndex+"','"+checkIndex+
				 "','"+showIndex+"','"+orderIndex+"','"+groupIndex+"','"+whereInfo+"','"+editInfo+"','"+operateType+"','"+operateData+"','"+modelExcel+"',"+beginRow+",'"+reportExplain+"','"+userid+"','"+nowDate+"',"+isAddCol+","+isSave+",'-1','','"+onlyIndex+"',"+isUpdate+","+isMoreHead+",'"+isMoreWhere+"','"+tripInfo+"','"+colName+"','"+funcIndex+"','','"+datafuncIndex+"',0,'"+dataFormat+"','"+tripDown+"')";
			flag=jdbc.add(querySql);
			querySql="delete from report_config where is_save=-1 and create_time like '%"+DateUtil.getLastDay()+"%'"; //自动删除前2天预览的数据
			flag=jdbc.delete(querySql);
		} 	 
		if(type.equals("save")){ //首次进入页面预览不需要?
			flag=reportPath(); //保存或更新目录 
		}
		page.setFlag(flag);
		Excel c = new Excel();
		c.setReportID(reportID);
		c.setGroupNo(groupNo);
		c.setReportName(reportName);
		page.setExcel(c);
		return "JsonDate";
	} 
	
	//更新修改配置
	public int updateConfig() {	 //与保存相同  
		pageTitle = pageTitle.replaceAll("\\#", "\\%"); 
		levels=levels+1;//页面tab从0开始 
		if(isAddCol.equals("true")){
			isAddCol="1";
		}else{
			isAddCol="-1";
		}
		modelExcel = modelExcel.replaceAll("##","%"); 
		modelExcel = modelExcel.replaceAll("\\'", "''");
		String querySql="update report_config set table_type='"+tableType+"', table_name='"+tableName.toUpperCase()+"', report_name='"+reportName+"', report_path='"+reportPath+"', report_sql='sql', page_titles='"+pageTitle+"', is_more_head='"+isMoreHead+"', show_index='"+showIndex+"', import_index='"+importIndex+
					"', order_index='"+orderIndex+"', group_index='"+groupIndex+"', data_format='"+dataFormat+"', check_index='"+checkIndex+"', where_info='"+whereInfo+"', is_more_where='"+isMoreWhere+"', edit_info='"+editInfo+"', operate_type='"+operateType+"', operate_data='"+operateData+
					"', model_excel='"+modelExcel+"', begin_row="+beginRow+", report_explain='"+reportExplain+"', is_add='"+isAddCol+"', is_update='"+isUpdate+"', only_index='"+onlyIndex+"',col_name='"+colName+"',trip_index='"+tripInfo+"',func_index='"+funcIndex+"',datafunc_index='"+datafuncIndex+"',trip_down='"+tripDown+"' where groupNo="+groupNo+" and levels="+levels;
		int flag=jdbc.update(querySql);  
		return flag;
	}  	
	
	//查找导入配置信息列表
	public String findConfig() { 
		String querySql = "select "+Config.getColNameExcel()+" from report_config where levels=1 and is_save=1 ";
		if(!loginno2.trim().equals("")){//地市管理员可以看该地市所有用户配置的报表，分配权限?
			querySql+=" and create_userid='"+loginno2+"'"; 
		}else if(!loginno.equals("admin")){//管理员可以看所有. 
			querySql+=" and create_userid='"+loginno+"'";
		} 
		if(!reportName.equals("")){
			querySql+=" and report_name like '%"+reportName+"%'"; 
		} 
		querySql += " order by groupno,levels,report_id"; 
		page.set(currentPage, pageSize, querySql);
		page=jdbc.findPage(page);
		List<?> listTmp=page.getList();
		List<Excel> list = new ArrayList<Excel>();   
		for (int i = 0; i < listTmp.size(); i++) {
			String[] data = (String[]) listTmp.get(i); 
			Excel e=new Excel();
			e=Config.setExcel(data); 
			String path=e.getReportPath();
			e.setReportPath(path);
			if(e.getTableType().equals("view")){
				e.setTableType("报表[视图]");
			}else if(e.getTableType().equals("table")){
				if(e.getIsAdd()==1){
					e.setTableType("导入[表]");
				}else{
					e.setTableType("报表[表]");
				}
			}
			e.setAppUrl("/page/jsp/excel_config.html?op=update&groupNo="+e.getGroupNo()+"&reportID="+e.getReportID());
			String time=e.getCreateTime();
			if(time!=null && !time.trim().equals("")){
				time=time.substring(0,time.indexOf(" "));
			}else{
				time="";
			}  
			e.setCreateTime(time); 
			list.add(e);  
		}   
		page.setList(list); 
		return "JsonDate";		
	}
			
	//删除配置
	public String delConfig() {	  
		String sql="delete from report_config where report_id="+reportID; 
		int flag=jdbc.delete(sql); 
		if(flag==1){
			sql="update report_config set levels="+(levels-1)+" where groupno="+groupNo+" and levels >"+levels;
			flag=jdbc.update(sql);   
			String appUrl="/page/jsp/report.jsp?groupNo="+groupNo+"&reportID="+reportID;
			String querySql="select id from APDP_MODULE where url = '"+appUrl+"'"; 
			List<String[]> list = jdbc.findList(querySql);  
			String mId="";
			if(list!=null&&list.size()>0){//以前添加过这个链接是更新目录操作
				mId=list.get(0)[0];
				if(mId!=null&&!mId.equals("")){
					deleteMenu(mId);//删除菜单
					}
				}
			} 
		page.setFlag(flag);
		return "JsonDate";
	}
	/**
	 * 查询数据库用户
	 * @return
	 */
	public String findDBInfo() {	   
		String querySql="";
		if(owner.equals("")){ //数据库用户
			querySql="select t.username from sys.all_users t order by t.username";
			List<String[]> listTmp=jdbc.findList(querySql);
			List<Excel> list = new ArrayList<Excel>();   
			for (int i = 0; i < listTmp.size(); i++) {
				String[] data = (String[]) listTmp.get(i); 
				Excel e=new Excel();
				e.setOwner(data[0]);
				list.add(e);  
			}   
			page.setList(list); 
		}else{//查找某个用户下的表
			String where="",where2="";
			if(isLike==1 && !tableName.equals("")){
				where=" and t1.table_name like '%"+tableName.toUpperCase()+"%'";
				where2=" and t1.view_name like '%"+tableName.toUpperCase()+"%'";
			}
			if(tableType.equals("table")){
			}else if(tableType.equals("view")){
			}else{ //全部
				querySql="select * from( select t1.table_name || ' [表] ' || t2.comments from sys.all_tables t1 ,sys.all_tab_comments t2 "+
	                 "where t1.owner=t2.owner and t1.table_name=t2.table_name and t1.owner = '"+owner+"' and t2.table_type='TABLE' "+where+"union  "+
	                 "select t1.view_name || ' [视图] ' || t2.comments from sys.all_views t1 ,sys.all_tab_comments t2 "+
	                 "where t1.owner=t2.owner and t1.view_name=t2.table_name and t1.owner = '"+owner+"' and t2.table_type='VIEW' "+where2+")order by 1";
			}
			List<String[]> listTmp=jdbc.findList(querySql);
			List<Excel> list = new ArrayList<Excel>();   
			for (int i = 0; i < listTmp.size(); i++) {
				String[] data1 = (String[]) listTmp.get(i); 
				Excel e=new Excel();
				e.setTableName(data1[0]);
				list.add(e);  
			}   
			page.setList2(list);  
		}			
		return "JsonDate";
	}
	
	public List<Select> getSelCfg() {
		List<Select> list = new ArrayList<Select>();		
		SelectConfigAction selCfg=new SelectConfigAction();
		List<Select> sList=selCfg.getSelSys(jdbc,"10"); //日期和数据权限,11
		for (int i = 0; i < sList.size(); i++) {
			Select select = new Select(); 
			select =(Select)sList.get(i);
			if(select.getSelGroup().equals("10")){
				select.setSelValue("d,"+select.getSelValue()+",-1");
			} 
			list.add(select);//合并到一个list
		}
		sList = selCfg.getSelCfg(jdbc,loginno);//下拉框码表
		for (int i = 0; i < sList.size(); i++) {
			Select s = new Select(); 
			Select select =(Select)sList.get(i);
			s.setSelValue("s,"+select.getSelID());
			s.setSelText(select.getSelName()); 
			s.setColNames(select.getColNames()); //页面提示传递什么字段
			list.add(s);//合并到一个list
		} 
		return list;
	}
	
	public List<Select> getSelWhere() {
		List<Select> list = new ArrayList<Select>();
		Select s = new Select();  
		s.setSelValue("0");
		s.setSelText("无");
		list.add(s);
		s = new Select();  
		s.setSelValue("c2");
		s.setSelText("智能匹配");//选择为精确匹配(1)，输入为模糊匹配(-1)
		s.setColNames("支持精确和模糊匹配"); //title提示
		list.add(s); 
		list.addAll(getSelCfg());//合并到一个list 
		return list;
	}
	
	public List<Select> getSelEdit() {
		List<Select> list = new ArrayList<Select>(); 
		Select s = new Select();  
		s = new Select();  
		s.setSelValue("noEdit");
		s.setSelText("不能修改");
		list.add(s);
		s.setSelValue("0");
		s.setSelText("文本框");
		s.setColNames("(单行输入)"); //title提示
		list.add(s);
		s = new Select();  
		s.setSelValue("textArea");
		s.setSelText("编辑框");
		s.setColNames("(多行输入)"); //title提示
		list.add(s); 
		list.addAll(getSelCfg());//合并到一个list 
		return list;
	}
	  
	public List<Select> getSelFormat() { 
		SelectConfigAction selCfg=new SelectConfigAction();
		List<Select> list=selCfg.getSelSys(jdbc,"14");
		return list;
	}
	  
	
	//保存或更新目录
	public int reportPath() {   
		String appUrl="/page/jsp/report.jsp?groupNo="+reportID+"&reportID="+reportID;
		String querySql="select id from APDP_MODULE where url = '"+appUrl+"'"; 
		List<String[]> list = jdbc.findList(querySql);  
		String mId="";
		if(list!=null&&list.size()>0){//以前添加过这个链接是更新目录操作
			mId=list.get(0)[0];
		}
		int flag=1;
		updConfMenu();//修改主表report_config的report_id值
		if(reportPath!=null&&!reportPath.equals("")){//保存目标
			Date date=new Date();
			String parId="";
			if(reportPath!=null&&!reportPath.equals("")){
				parId=reportPath.split(";")[0];
			}
			if(mId!=null&&!mId.equals("")){//说明是修改报表
				updateMenu(mId,parId,appUrl);//删除原来的菜单
			}else{
				try{
					//菜单插入
					Module parentModule=serviceFacade.retrieve(Module.class,Long.parseLong(parId));//得到父菜单
					Module module=new Module();
					module.setChinese(reportName);
					module.setVersion(1);
					module.setUrl(appUrl);
					module.setDisplay(true);
					module.setCreateTime(date);
					module.setParentModule(parentModule);
					module.setOrderNum(20);
					module.setEnglish("report");
					/**默认为每个新增的菜单添加一个查询(query)的command，用户在界面分配权限。**/
	        		Command command = new Command();
	        		command.setChinese("查询");
	        		command.setEnglish("query");
	        		command.setVersion(0);
	        		command.setOrderNum(1);
	        		command.setModule(module);
	        		module.addCommand(command);
					serviceFacade.create(module);
				}catch(Exception e){
					flag=0;
					e.printStackTrace();
				}
			}
		}
		return flag;
	}
	/**
	 * 修改主表report_config的report_id值
	 */
	public void updConfMenu(){
		if(reportID!=null&&!reportID.equals("")){
			String id=reportID.split(";")[0];
			String updSql="update report_config set report_path='"+reportPath+"' where report_id='"+id+"' "; 
			jdbc.update(updSql); 
		}
	}
	/**
	 * 修改原来的菜单
	 */
	public void updateMenu(String mId,String parId,String appUrl){
		Module parentModule=serviceFacade.retrieve(Module.class,Long.parseLong(parId));//得到父菜单
		Module module=serviceFacade.retrieve(Module.class,Long.parseLong(mId));
		module.setChinese(reportName);
		module.setUrl(appUrl);
		module.setParentModule(parentModule);
		serviceFacade.update(module);
	}
	/**
	 * 删除菜单
	 * @param mId
	 */
	public void deleteMenu(String mId){
		serviceFacade.delete(Module.class, Long.parseLong(mId));
	}
	public void setJdbc(JdbcUtil jdbc) {
		this.jdbc = jdbc;
	} 
	
	public Page getPage() {
		return page;
	}

	public void setPage(Page page) {
		this.page = page;
	}   
	
	public void setReportID(String reportID) {
		this.reportID = reportID;
	}

	public void setGroupNo(String groupNo) {
		this.groupNo = groupNo;
	}

	public void setLevels(int levels) {
		this.levels = levels;
	}

	public void setLevelsMax(int levelsMax) {
		this.levelsMax = levelsMax;
	}

	public void setSql(String sql) {
		this.sql = sql;
	}

	public void setOwner(String owner) {
		this.owner = owner;
	}

	public void setTableType(String tableType) {
		this.tableType = tableType;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public void setReportName(String reportName) {
		this.reportName = reportName;
	}

	public void setReportPath(String reportPath) {
		this.reportPath = reportPath;
	}

	public void setPageTitle(String pageTitle) {
		this.pageTitle = pageTitle;
	}

	public void setIsMoreHead(String isMoreHead) {
		this.isMoreHead = isMoreHead;
	}

	public void setImportIndex(String importIndex) {
		this.importIndex = importIndex;
	}

	public void setOnlyIndex(String onlyIndex) {
		this.onlyIndex = onlyIndex;
	}
	
	public void setCheckIndex(String checkIndex) {
		this.checkIndex = checkIndex;
	}	

	public void setShowIndex(String showIndex) {
		this.showIndex = showIndex;
	}

	public void setOrderIndex(String orderIndex) {
		this.orderIndex = orderIndex;
	}

	public void setGroupIndex(String groupIndex) {
		this.groupIndex = groupIndex;
	}

	public void setDataFormat(String dataFormat) {
		this.dataFormat = dataFormat;
	}

	public void setWhereInfo(String whereInfo) {
		this.whereInfo = whereInfo;
	}

	public void setIsMoreWhere(String isMoreWhere) {
		this.isMoreWhere = isMoreWhere;
	}

	public void setEditInfo(String editInfo) {
		this.editInfo = editInfo;
	}

	public void setOperateType(String operateType) {
		this.operateType = operateType;
	}

	public void setOperateData(String operateData) {
		this.operateData = operateData;
	}

	public void setModelExcel(String modelExcel) {
		this.modelExcel = modelExcel;
	}

	public void setReportExplain(String reportExplain) {
		this.reportExplain = reportExplain;
	}

	public void setBeginRow(int beginRow) {
		this.beginRow = beginRow;
	}

	public void setFlag(int flag) {
		this.flag = flag;
	}

	public void setIsSave(int isSave) {
		this.isSave = isSave;
	}

	public void setIsLike(int isLike) {
		this.isLike = isLike;
	}

	public void setType(String type) {
		this.type = type;
	}

	public void setLoginno(String loginno) {
		this.loginno = loginno;
	}

	public void setLoginno2(String loginno2) {
		this.loginno2 = loginno2;
	}

	public void setIsAddCol(String isAddCol) {
		this.isAddCol = isAddCol;
	}

	public void setIsUpdate(String isUpdate) {
		this.isUpdate = isUpdate;
	}

	public void setTripInfo(String tripInfo) {
		this.tripInfo = tripInfo;
	}

	public void setColName(String colName) {
		this.colName = colName;
	}

	public void setFuncIndex(String funcIndex) {
		this.funcIndex = funcIndex;
	}

	public void setDatafuncIndex(String datafuncIndex) {
		this.datafuncIndex = datafuncIndex;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;
	}

	public void setParId(String parId) {
		this.parId = parId;
	}

	public void setTripDown(String tripDown) {
		this.tripDown = tripDown;
	} 
	
}
