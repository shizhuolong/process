package org.apdplat.selfrpt.action;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import jxl.format.UnderlineStyle;
import jxl.write.WritableFont;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.struts2.ServletActionContext;
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.selfrpt.model.Config;
import org.apdplat.selfrpt.model.Excel;
import org.apdplat.selfrpt.model.Page;
import org.apdplat.selfrpt.model.Select;
import org.apdplat.selfrpt.model.User;
import org.apdplat.selfrpt.util.DateUtil;
import org.apdplat.selfrpt.util.JdbcUtil;
import org.apdplat.selfrpt.util.PoiUtil;
import org.apdplat.selfrpt.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import com.opensymphony.xwork2.ActionContext;


/** 
 * @author yangj
 *
 */
public class ReportAction extends PortalBaseAction { 	
	private String reportID="";	
	private String groupNo="";   //sheet分组(一个book工作薄)
	private String colNames=""; 
	private String colName=""; //distinct智能匹配 
	private String whereColname=""; 	
	private String orderIndex="";
	private String groupIndex="";
	private String operateType="";
	private String operateData="";	
	private String value="";
	private String sql="";
	private String selConfig="";  
	private String loginno="";   //当前登录账号
	private String index="";     //序号	
	private int begin=0;  
	private String selID="";
	private String dataLevel="0";
	private int pageSize=15;
	private int currentPage=1; // 当前页	
	private Page page=new Page();
	private String tripIndex;  //下钻相关
	private String tripWhere=""; 	
	private String whereValues="";//查询条件相关
	private int tripLevel = 1;
	private String lastTripIndex;
	private String expSql;
	@Autowired
	private JdbcUtil jdbc;
	final Log logger = LogFactory.getLog(getClass());   
	public String initPageGroupNo(){ 
		String sql="select "+Config.getColNameExcel()+" from report_config where groupno="+groupNo+" order by levels"; 
		List<String[]> list =jdbc.findList(sql);
		List<Excel> list2 =new ArrayList<Excel>();
		for(int i=0;i<list.size();i++){ 
			String[] data = (String[]) list.get(i);  
			Excel e=Config.setExcel(data);  
			list2.add(e);
		}
		page.setList(list2); 
		return "JsonDate";
	}		

	/**
	 * 进入页面初始化
	 * @return
	 */
	public String initPage(){ 
		String sql="select "+Config.getColNameExcel()+" from report_config where report_id='"+reportID+"'"; 
		List<String[]> list =jdbc.findList(sql); 
		String[] data = (String[]) list.get(0);  
		Excel e=Config.setExcel(data);
		logger.debug(e.getTripIndex());
		if(!"".equals(e.getTripIndex())&&null ==e.getTripIndex()&&!"null".equals(e.getTripIndex())){
			String location="-1";
			if(!"".equals(lastTripIndex)&&null!=lastTripIndex&&!"".equals(whereValues)&&null!=whereValues){
				location = lastTripIndex.split("`")[2];
			}
			String[] tripIndexs = {"-1","-1",location};
			String[] columnNames = e.getColName().split(";");
			tripIndexs = getLastTripIndex(columnNames,tripIndexs);
			e = StringUtil.dealTrip(e,tripIndexs);
		}
			
		e.setLoginno(loginno);
		page=jdbc.getTableInfo(e.getTableName());
		//colNames=page.getColNames(); //获取字段名 		
		colNames=e.getColName(); //获取字段名 	
		String colNames2[]=colNames.split(";");
		String whereInfo[]=e.getWhereInfo().split(";");
		whereColname="";
		for(int j=0;j<whereInfo.length;j++){
			if(!whereInfo[j].equals("0")){
				whereColname+=colNames2[j]+";";
			}
		}
		if(whereColname.length()>1){
			whereColname=whereColname.substring(0,whereColname.length()-1);
			logger.debug("whereColname ="+whereColname);
		}		
		e.setColNames(colNames);
		e.setWhereColname(whereColname);
		e.setUserID(getUserAccount()); 
		
		//修改点击次数
		int clickNum=0;
		if(!e.getClickNum().equals("")){
			clickNum=Integer.valueOf(e.getClickNum());
		}
		clickNum++;
		sql="update report_config set click_num="+clickNum+" where report_id="+reportID;
        jdbc.update(sql);
        
        //点击 记录日志表 
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String nowDate2 =  sdf.format(new Date()); 
		sql="insert into report_log(log_id,report_id,report_name,report_userid,report_username,operate_time,operate_type,fun_type) values"+
			"(report_log_seq.nextval,"+e.getReportID()+",'"+e.getReportName()+"','"+loginno+"','"+loginno+"','"+nowDate2+"',1,2)";
		jdbc.add(sql);
		page=getSelCfg2(jdbc, e);
		List<?> plist=page.getList();
		e.setWhereInfo(page.getResult());
		page.setList(plist);
		page.setExcel(e); 
		return "JsonDate";
	}	 
	/**
	 * 控制权限把用户组织架构信息存在user里面
	 * @return
	 */
	public String userInfoInit() { //报表初始化函数调用
		Map<String,Object> session = ActionContext.getContext().getSession();    
		User user=(User)session.get("userLogin");
		org.apdplat.module.security.model.User u = UserHolder.getCurrentLoginUser();
		Org org = u.getOrg();
		if(user==null){
			user = new User();
			user.setLoginno(u.getUsername()); //用户登录账号
			user.setGroupID1("Z");//省
			user.setGroupName1("云南省"); 
			if(!org.getOrgLevel().equals("1")){//不是省用户
				user.setGroupID2(org.getRegionCode());//地市
				user.setGroupName2(org.getRegionName());  
				user.setGroupID3(org.getCode());//营服中心
				user.setGroupName3(org.getOrgName()); 
			}
			user.setLevel(Integer.parseInt(org.getOrgLevel()));
			session.put("userLogin", user);
		} 
  	
		return "JsonDate";
	}
	/**
	 * 下拉框数据权限初始化，提取公共函数
	 * @param jdbc
	 * @param e
	 * @return
	 */
	public Page getSelCfg2(JdbcUtil jdbc,Excel e) {//页面初始化 下拉框码表,报表配置/通用录入平台使用
		String selConfig=e.getWhereInfo();//String selConfig="'d,yyyyMMdd,-1;s,101;s,102;s,103";
		String isMoreWhere[]=e.getIsMoreWhere().split(";");
		logger.debug("selConfig="+selConfig);
		String sels[]=selConfig.split(";");//根据selConfig获取selID下拉框码表ID 
		String data[]=new String[sels.length];
		userInfoInit() ;
		Map<String,Object> session = ActionContext.getContext().getSession(); 
		User u=(User)session.get("userLogin");  
		String level=u.getLevel()+"";  
		//查询条件(初始化信息和替换报表sql模板数据data)
		String selConfig2="";
		List<Select> list = new ArrayList<Select>();   
		for(int i=0;i<sels.length;i++){
			String tmp[]=sels[i].split(",");
			Select s = new Select();   
			//保留位置,便于获取对应字段标题，或者保留字段序号?
				if(tmp[0].equals("s")){  
					String querySql="select " + Config.getColNameSel()+ " from report_sel_config A,report_sel_sql B "+
			        "where A.sel_id=B.sel_id and A.sel_id in("+tmp[1]+") and use_type!=-1 and B.levels=1 order by B.levels"; //优化放在一条sql in(101,102),从list获取
					logger.debug("querySql="+querySql);
					List<String[]> listTmp=jdbc.findList(querySql);
					String[] data1 = (String[]) listTmp.get(0);   
					s=Config.setSelect(data1);  
					if(!s.getDataLevel().equals("-1")){//营销架构(数据权限,必须初始化)  tmp[1].equals("101") 
						String groupname=u.getGroupName2();
						s.setLevels(level); 
						if(s.getSelID().equals("116") && !s.getDataLevel().equals("-1") && Integer.valueOf(level)>1){ //地市单层中文,特殊处理 
							s.setFindData(groupname+";"+groupname);  
						} 
					}else{
						data[i]="";
						s.setFindData(data[i]); 
					} 
					String dataLevelType="",groupID="",groupName=""; 
					int dataLevel=0;
					if(s.getDataLevel().indexOf(",")>=0){//数据权限
						String tmp2[]=s.getDataLevel().split(","); 
						dataLevel=Integer.valueOf(tmp2[0]);
						dataLevelType=tmp2[1]; 
						s.setDataLevelType(dataLevelType);//数据权限类别 2,code;2,name;8,loginno;
					}else{
						dataLevel=Integer.valueOf(s.getDataLevel());
					} 
					//页面还需要判断使用，不能去掉类别
					if(dataLevel>=2){ //地市数据权限
						if(dataLevel<=Integer.valueOf(level)){//需要限制到<=登陆用户层级 if(dataLevel>0){  
				    		tmp[0]="c3";// 查询条件初始化类别判断 
							sels[i]=sels[i].replace("s,", "c3,"); //传递查询条件参数使用
				    	}else{//大于登陆用户的层级不限制
				    		tmp[0]="c2";
				    		sels[i]=sels[i].replace("s,", "c2,"); 
				    		s.setColNames(tmp[2]); //distinct使用
				    	} 
						if(dataLevel==2){//地市名称[权限] 
							groupID=u.getGroupID2();
							groupName=u.getGroupName2(); 
			    		}else if(dataLevel==3){
			    			groupID=u.getGroupID3();
							groupName=u.getGroupName3(); 
			    		}else if(dataLevel==4){
			    			groupID=u.getGroupID4();
							groupName=u.getGroupName4(); 
			    		}else if(dataLevel==5){
			    			groupID=u.getGroupID5();
							groupName=u.getGroupName5(); 
			    		}  
						
						if(dataLevelType.equals("code")){ 
							s.setFindData(groupID+";"+groupName); //传递地区ID
						}else if(dataLevelType.equals("name")){ //传递地区名称
							s.setFindData(groupName+";"+groupName);
						}else if(dataLevelType.equals("loginno")){ //用户登录账号 
							if(!u.getLoginno().equals("admin")){
								sql=StringUtil.replaceSql5( s.getSelSql(),u.getLoginno());
								List<String[]> listTmp2=jdbc.findList(sql);
								String ids="";
								for (int j=0;j<listTmp2.size();j++){
									data1 = (String[]) listTmp2.get(j);
									ids+=data1[1]+","; 
								}
								if(ids.length()>1){
									ids=ids.substring(0,ids.length()-1);
								}else{//没有分配生产中心
									ids="0000";
								}
								s.setFindData(ids);
							}else{
							} 
						}
					} 
				}else if(tmp[0].equals("d")){  
					s.setDateType(tmp[1]); 
					if(tmp[1].toLowerCase().indexOf("dd")>=0){
						data[i]=DateUtil.getLastDay(tmp[1]);
					}else if(tmp[1].toLowerCase().indexOf("mm")>=0){
						data[i]=DateUtil.getLastMonth();//tmp[1]
					}else if(tmp[1].toLowerCase().indexOf("yyyy")>=0){
						data[i]=DateUtil.getLastYear(tmp[1]);
					}   
					s.setFindData(data[i]); 
				}else if(tmp[0].equals("c") || tmp[0].equals("n")){  
					data[i]="";
					s.setFindData(data[i]);
				}else if(tmp[0].equals("c2")){  
					data[i]="";
					s.setColNames(tmp[1]); //字段序号
				}  
				s.setIsMore(isMoreWhere[i]);
				s.setSignType(tmp[0]);	
				s.setSelSql(""); 
				selConfig2+=sels[i]+";";
				list.add(s);
		}  
		page= new Page();
		page.setList(list);
		if(selConfig2.length()>1){
			selConfig2=selConfig2.substring(0,selConfig2.length()-1);
			page.setResult(selConfig2);
			logger.debug("selConfig="+selConfig2);
		} 
		return page;
	}
	/**
	 * 查询数据
	 * @return
	 */
	public String findData(){	 
		logger.debug("selConfig="+selConfig);
		String sql="select "+Config.getColNameExcel()+" from report_config where report_id='"+reportID+"'"; 
		logger.debug("sql="+sql);
		List<String[]> list =jdbc.findList(sql);
		Excel e=new Excel();
		if(list.size()>0){
			String[] data = (String[]) list.get(0);  
			e=Config.setExcel(data);
		}	
		String colName=e.getColName().replaceAll(";", ",");
		sql="select "+colName+" from "+e.getTableName();
		if(e.getIsPartition()==1){
			value=StringUtil.getDateColVale(selConfig);
			sql+=" partition(p"+value+") ";
		}
		e.setColNames(colNames);
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
				orderIndex+=Integer.valueOf(orderIndexs[i])+1+",";
			}
		}
		if(!orderIndex.equals("")){
			orderIndex=orderIndex.substring(0,orderIndex.length()-1); 
		}
		sql += wheres + " order by "+ orderIndex;  //从1开始  ,  分组优先排序? group+orderIndex,删除重复?
		page.set(currentPage, pageSize,sql); // 设置当前页和每页大小  
		page=jdbc.findPage(page);  
		page.setSql(sql);
		page.setExcel(e);  
		return "JsonDate";
	}
	
	/**
	 * 下钻查询数据
	 * @return
	 */
	public String newFindData(){
		String location="-1";
		if(!"".equals(lastTripIndex)&&null!=lastTripIndex&&!"".equals(whereValues)&&null!=whereValues){
			location = lastTripIndex.split("`")[2];
		}
		String[] tripIndexs = {"-1","-1",location};
		logger.debug("selConfig="+selConfig);
		String sql="select "+Config.getColNameExcel()+" from report_config where report_id='"+reportID+"'"; 
		List<String[]> list =jdbc.findList(sql);
		Excel e=new Excel();
		if(list.size()>0){
			String[] data1 = (String[]) list.get(0);  
			e=Config.setExcel(data1);
		}
		String[] columnNames = e.getColName().split(";");
		tripIndexs = getLastTripIndex(columnNames,tripIndexs);
		String[] sqlGroupBy = StringUtil.getRptSql1(e,tripLevel,tripIndexs).split("`");
		sql=sqlGroupBy[0];
		if(e.getIsPartition()==1){
			value=StringUtil.getDateColVale(selConfig);
			sql+=" partition(p"+value+") ";//分区
		}
		//e.setColNames(colNames);
		e.setColNames(e.getColName());
		e.setSelConfig(selConfig);//必须传递d,s,c类型信息  
		String wheres=" where 1=1";
		if(!selConfig.equals("")){
			wheres+=StringUtil.getRptSql3(e);
		} 
		if(!"".equals(whereValues)&&null!=whereValues){
			String[] wereValues=whereValues.split(";");
			for(int i=0;i<wereValues.length;i++){
				String[] colAndValues = wereValues[i].split(":");
				wheres+=" and "+columnNames[Integer.parseInt(colAndValues[0])]+" in( "+colAndValues[1]+")";
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
				orderIndex+=columnNames[Integer.valueOf(orderIndexs[i])]+",";
			}
		}
		if(!orderIndex.equals("")){
			orderIndex=orderIndex.substring(0,orderIndex.length()-1); 
		}
		sql += wheres ;
		if(!"".equals(sqlGroupBy[1]))
			sql += sqlGroupBy[1];
		sql += " order by "+ orderIndex;  //从1开始  ,  分组优先排序? group+orderIndex,删除重复?
		if(null != StringUtils.trimToNull(expSql)){
			sql = expSql;
		}
		page.set(currentPage, pageSize,sql); // 设置当前页和每页大小  
		page=jdbc.findPage(page);  
		page.setSql(sql);
		page.setExcel(e);  
		return "JsonDate";
	}
	/**
	 * 下钻查询
	 * @return
	 */
	public String showSub(){
		String tempSql="select "+Config.getColNameExcel()+" from report_config where report_id='"+reportID+"'"; 
		List<String[]> list =jdbc.findList(tempSql);
		Excel e=new Excel();
		if(list.size()>0){
			String[] data1 = (String[]) list.get(0);  
			e=Config.setExcel(data1);
		}
		e.setColNames(e.getColName());
		String[] colNames = e.getColName().split(";");
		String[] tripIndexs = tripIndex.split("`");
		String[] sqlGroupBy = StringUtil.getRptSql1(e,tripLevel,tripIndexs).split("`");
		sql=sqlGroupBy[0];
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
		String[] tripWheres = tripWhere.split(";");
		String appWheres = "";
		for(String tripWhere:tripWheres){
			appWheres += " and "+colNames[Integer.parseInt(tripWhere.split(":")[0])]+"='"+tripWhere.split(":")[1]+"' ";
		}
		sql +=  appWheres;
		if(!"".equals(sqlGroupBy[1]))
			sql += sqlGroupBy[1];
		sql += " order by "+ orderIndex;
		page.set(0,0,sql); // 设置当前页和每页大小  
		page=jdbc.newFindPage(page);  
		page.setSql(sql);
		page.setExcel(e);  
		return "JsonDate";
	}
	/**
	 * 智能匹配查询
	 * @return
	 */
	public String findDistinct(){	 
		logger.debug("selConfig="+selConfig);
		String sql="select "+Config.getColNameExcel()+" from report_config where report_id='"+reportID+"'"; // and is_save=1
		logger.debug("sql="+sql);
		List<String[]> list =jdbc.findList(sql);
		Excel e=new Excel();
		if(list.size()>0){
			String[] data1 = (String[]) list.get(0);  
			e=Config.setExcel(data1);
		}	
		if(operateType.equals("checkDistinct")){
			sql="select count(1) from "+e.getTableName();
		}else{
			sql="select distinct "+colName+" from "+e.getTableName(); 
		}
		
		if(e.getIsPartition()==1){
			String value=StringUtil.getDateColVale(selConfig); 
			sql+=" partition(p"+value+") "; 
		}
		e.setColNames(colNames);
		e.setSelConfig(selConfig);//必须传递d,s,c类型信息  
		String wheres=" where 1=1";
		if(!selConfig.equals("")){
			wheres+=StringUtil.getRptSql3(e);
		} 
		if(getOrgLevelInt()==2){ //省用户不限制，地市用户根据operateData类型限制
			wheres+=" and region_name='"+getRegionName()+"' ";
		}else if(getOrgLevelInt()==3){
			wheres+=" and city_name='"+getCityName()+"' ";
		}
		if(!value.trim().equals("")){//输入,若选择则查询用in
			wheres +=" and "+colName+" like '%"+value+"%'";
		}
		sql += wheres ;
		int dataLevel2=0;
		if(!dataLevel.equals("")){
			dataLevel2=Integer.valueOf(dataLevel);
		} 
		if(dataLevel2<2){//数据权限,嵌套查询不能排序
			sql +=" order by 1";
		} 
		if(operateType.equals("checkDistinct")){
			String maxRow=jdbc.findOneData(sql); 
			page.setMaxRow(Integer.valueOf(maxRow));
			page.setIndex(index);
		}else{
			if(dataLevel2>=2){//数据权限
				String sql2="select sel_sql from report_sel_sql where sel_id="+selID;
				sql2=jdbc.findOneData(sql2);
				sql=StringUtil.replaceSql4( sql2,sql,loginno);
			}
			page.set(currentPage, pageSize,sql); // 设置当前页和每页大小  
			page.setIsTrim(false);
			page=jdbc.findPage(page); 
		}
		return "JsonDate";
	}
	
	/**
	 * 智能匹配
	 * @return
	 */
	public String checkDistinct(){	
		String selConfig2=selConfig;
        String sels[]=selConfig.split("@");//根据selConfig获取selID下拉框码表ID 
		String clearIndex="";
		for(int i=begin;i<sels.length;i++){
			String tmp[]=sels[i].split(";"); 
			if(tmp[0].equals("c2") && tmp[1]!=null && !tmp[1].equals("''")){  
				selConfig=StringUtil.getSelConfig(selConfig2, i); //获取智能匹配第1到第end个，清除其他智能匹配的值
				findDistinct();
				int maxRow=page.getMaxRow();
				if(maxRow==0){//没有数据
					clearIndex+=i+","; //需要删除页面文本框值
					selConfig2=StringUtil.delSelConfig(selConfig2, i); //删除第index个智能匹配的值
				}
			}
		} 
		if (clearIndex.length() > 1) {
			clearIndex = clearIndex.substring(0, clearIndex.length() - 1);
		}
		page.setResult(clearIndex);
		return "JsonDate";
	}
	
	/**
	 * 导出excel文件根据groupno循环获取表+所有tab页面条件? 
	 * @return
	 */
	public String exportExcel(){   
		findData();
		sql=page.getSql();
		Excel e=page.getExcel();
		String indexs=e.getShowIndex();
		String titles=e.getPageTitles();
		String[] modelTitles =titles.split(";"); 
		String index2[]=indexs.split(";");
		int index[] =new int[index2.length];
		for(int i=0;i<index2.length;i++){
			index[i]=Integer.valueOf(index2[i]); 
		}
		String sql1 = "select count(*) from (" + sql + ")"; 
		int maxRow = Integer.valueOf(jdbc.findOneData(sql1)); 
		if (maxRow< 20000) { //(1)记录数小于2万行  
			pageSize=20000;
			findData();
			boolean isSameLen[]=page.getIsSameLen();
			String colTypes[]=page.getColTypes().split(";");  
			List<?> list = page.getList();   
			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss"); 
			String fileName =  sdf.format(new Date())+ ".xls";
			String filePath = ServletActionContext.getServletContext().getRealPath("/")+ "/page/down/" + fileName;
			// 宋体,12号字体, WritableFont可定义格式,字体,下划线, 斜体, 粗体, 颜色
			WritableFont wfont = new WritableFont(WritableFont.createFont("宋体"), 12, WritableFont.NO_BOLD,false,
								UnderlineStyle.NO_UNDERLINE, jxl.format.Colour.BLACK);  
			jxl.write.NumberFormat nf = new jxl.write.NumberFormat("0.00");// 设置显示几位小数,用于合计的单元格
			jxl.write.WritableCellFormat wcf_num = new jxl.write.WritableCellFormat(nf);
			wcf_num.setFont(wfont);// 设置字体 
			// (1)创建工作薄
			HSSFWorkbook book = new HSSFWorkbook();
			// (2)创建工作表 
			HSSFSheet sheet = book.createSheet(e.getReportName());
			// 设置列的宽度 
			float[] dataMaxLen = PoiUtil.getDataMaxLen(page.getDataMaxLen());  
			for (int i = 0; i < index.length ; i++) {  
				if(colTypes[index[i]].equals("varchar2")){//汉字宽一些
					dataMaxLen[index[i]]=dataMaxLen[index[i]]*1.3f; 
				}
				sheet.setColumnWidth((int) i, (int) dataMaxLen[index[i]]);
			}  
			int rows = 0; 
			// 添加标题,加粗显示  
			HSSFRow row = null;
			HSSFCell cell = null; 
			HSSFCellStyle cellStyle = PoiUtil.setBoldStyle(book); 
			row = sheet.createRow((short) rows);
			for (int i = 0; i < index.length ; i++) {
				PoiUtil.setCellStyle(row, cell, cellStyle); 
				PoiUtil.setValue(i, modelTitles[index[i]]); 
			}
			// 添加数据
			if (list.size() >= 0) { 
				rows++; 
				String[] data = null;
				cellStyle = PoiUtil.setCenterStyle(book); 
				for (int i = 0; i < list.size(); i++) { 
					data = (String[]) list.get(i);
					row = sheet.createRow((short) rows);   
					for (int j = 0; j < index.length ; j++) { 
						if(PoiUtil.isNumber(data[index[j]]) && j>0){ //数字右对齐
							cellStyle.setAlignment(HSSFCellStyle.ALIGN_RIGHT); 
							PoiUtil.setValue(j,Double.valueOf( data[index[j]]));
						}else{ //汉字 
							if(isSameLen[index[j]] && j>0){ //汉字长度相同则居中对齐
								cellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);
							}else{//第1列或汉字长度不同则左对齐
								cellStyle.setAlignment(HSSFCellStyle.ALIGN_LEFT); 
							}  
							PoiUtil.setCellStyle(row, cell, cellStyle);
							PoiUtil.setValue(j, data[index[j]]);
						}					
					} 
					rows++;
				}
			}
			PoiUtil.write(book, filePath);
			page.setFileName(fileName); 
			logger.debug("filePath="+filePath);
		}else{ //记录数大于2万行 
			Date time = new Date();
			pageSize=600000;//默认导出所有记录,最多60W行
			findData();
			List<?> list = page.getList();   
			logger.debug("find time:"+(new Date().getTime() - time.getTime())/1000+"s");
			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss"); 
			String fileName =  sdf.format(new Date());
			String filePath = ServletActionContext.getServletContext().getRealPath("/")+ "/page/down/"; //"d:\\";本地测试 
			time = new Date();
			Workbook book = null;
			Sheet sheet = null;
			BufferedOutputStream out = null;
			try {
				book = new SXSSFWorkbook(128); // 缓存128在内存。
				sheet = book.createSheet(e.getReportName()); //"Sheet1"
				org.apache.poi.ss.usermodel.Row sheetRow = sheet.createRow(0);
				for (int j = 0; j < index.length ; j++) { 
					org.apache.poi.ss.usermodel.Cell cell = sheetRow.createCell(j); 
					cell.setCellValue(modelTitles[index[j]]);
				}  
				for (int i = 0; i < list.size(); i++) { 
					String[] data = (String[]) list.get(i);  
					org.apache.poi.ss.usermodel.Row sheetRow2 = sheet.createRow(i+1); //+1不能覆盖标题
					for (int j = 0; j < index.length ; j++) { 
						org.apache.poi.ss.usermodel.Cell cell = sheetRow2.createCell(j); 
						cell.setCellValue(data[index[j]]);
					} 
				}
				out = new BufferedOutputStream(new FileOutputStream(filePath+fileName+ ".xlsx"));
				book.write(out);
			} catch (Exception ex) {
				ex.printStackTrace();
			} finally {
				if (out != null) {
					try {
						out.flush();
						out.close();
					} catch (Exception ex) {
						ex.printStackTrace();
					}
				}
			}
			File zip = new File(filePath + fileName + ".zip");
			filePath=filePath + fileName + ".xlsx";
			File srcfile[] = {new File(filePath)}; 
			org.apdplat.selfrpt.util.FileZip.ZipFiles(srcfile, zip); 
			page.setFileName(fileName+ ".zip");  
			logger.debug("filePath="+filePath+",export time:"+(new Date().getTime() - time.getTime())/1000+"s");
		} 
		page.setList(null);//清空数据
		return "JsonDate";
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
	public void setColNames(String colNames) {
		this.colNames = colNames;
	}

	public void setColName(String colName) {
		this.colName = colName;
	}
	public void setWhereColname(String whereColname) {
		this.whereColname = whereColname;
	}
	public void setOrderIndex(String orderIndex) {
		this.orderIndex = orderIndex;
	}

	public void setGroupIndex(String groupIndex) {
		this.groupIndex = groupIndex;
	}

	public void setOperateType(String operateType) {
		this.operateType = operateType;
	}

	public void setOperateData(String operateData) {
		this.operateData = operateData;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public void setSql(String sql) {
		this.sql = sql;
	}

	public void setSelConfig(String selConfig) {
		this.selConfig = selConfig;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;
	}

	public void setSelID(String selID) {
		this.selID = selID;
	} 

	public void setDataLevel(String dataLevel) {
		this.dataLevel = dataLevel;
	}

	public void setLoginno(String loginno) {
		this.loginno = loginno;
	}

	public void setIndex(String index) {
		this.index = index;
	}

	public void setBegin(int begin) {
		this.begin = begin;
	}


	public void setTripIndex(String tripIndex) {
		this.tripIndex = tripIndex;
	}

	public void setTripLevel(int tripLevel) {
		this.tripLevel = tripLevel;
	}

	public void setTripWhere(String tripWhere) {
		this.tripWhere = tripWhere;
	}

	public void setWhereValues(String whereValues) {
		this.whereValues = whereValues;
	}

	public void setLastTripIndex(String lastTripIndex) {
		this.lastTripIndex = lastTripIndex;
	}  

	public void setExpSql(String expSql) {
		this.expSql = expSql;
	}

	public String[] getLastTripIndex(String[] columnNames,String[] tripIndexs){
		whereValues = getOrgPmn(columnNames,whereValues);                                                             //无条件就取权限
		if(!"".equals(whereValues)&&null!=whereValues){
			String[] wereValues=whereValues.split(";");
			boolean flag1=false,flag2=false,flag3=false,flag4=false,flag5=false;
			String tripIndex1="",tripIndex2="",tripIndex3="",tripIndex4="",tripIndex5="";
			for(int i=0;i<wereValues.length;i++){
				String[] colAndValues = wereValues[i].split(":");
				if("chnl_name".equals(columnNames[Integer.parseInt(colAndValues[0])])){
					tripIndex5=colAndValues[0];
					flag5=true;
				}
				if("grid_name".equals(columnNames[Integer.parseInt(colAndValues[0])])){
					tripIndex4=colAndValues[0];
					flag4=true;
				}
				if("sale_cntr_name".equals(columnNames[Integer.parseInt(colAndValues[0])])){
					tripIndex3=colAndValues[0];
					flag3=true;
				}
				if("city_name".equals(columnNames[Integer.parseInt(colAndValues[0])])){
					tripIndex2=colAndValues[0];
					flag2=true;
				}
				if("city_cde".equals(columnNames[Integer.parseInt(colAndValues[0])])){
					for(int j=0;j<columnNames.length;j++){
						if("city_name".equals(columnNames[j])){
						tripIndex2=j+"";
						}	
					}
										
					flag2=true;
				}
				if("region_name".equals(columnNames[Integer.parseInt(colAndValues[0])])){
					tripIndex1=colAndValues[0];
					flag1=true;
				}
			}
			
			if(flag5){
				tripIndexs[1]=tripIndex5;
			}else if(flag4){
				tripIndexs[1]=tripIndex4;
			}else if(flag3){
				tripIndexs[1]=tripIndex3;
			}else if(flag2){
				tripIndexs[1]=tripIndex2;
			}else if(flag1){
				tripIndexs[1]=tripIndex1;
			}
		}
		return tripIndexs;
	}
	
}
