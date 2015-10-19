package org.apdplat.portal.index.action;

import java.sql.Clob;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.platform.util.StringUtil;
import org.apdplat.portal.index.model.EchartsSeries;
import org.apdplat.portal.index.service.IndexService;
import org.apdplat.workflow.service.WorkOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;


/**
 * 首页工作台
 * @author wcyong
 *
 */
@SuppressWarnings("serial")
@Controller
@Scope("prototype")
public class IndexAction extends BaseAction {

	private final APDPlatLogger logger = new APDPlatLogger(getClass());//记录日志 
	
	@Autowired
	private IndexService indexService;
	@Autowired
	private WorkOrderService workOrderService;//????
	
	private String id;
	
	private String log;
	private String lat;
	private String status="'10'";
	
	private String moduleIds;
	public String getModuleIds() {
		return moduleIds;
	}

	public void setModuleIds(String moduleIds) {
		this.moduleIds = moduleIds;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	private double lat0;
	private double lat1;
	private double log0;
	private double log1;
	private int flag=0;
	private String group;
	

	public String getGroup() {
		return group;
	}

	public void setGroup(String group) {
		this.group = group;
	}

	public int getFlag() {
		return flag;
	}

	public void setFlag(int flag) {
		this.flag = flag;
	}

	public double getLat0() {
		return lat0;
	}

	public void setLat0(double lat0) {
		this.lat0 = lat0;
	}

	public double getLat1() {
		return lat1;
	}

	public void setLat1(double lat1) {
		this.lat1 = lat1;
	}

	public double getLog0() {
		return log0;
	}

	public void setLog0(double log0) {
		this.log0 = log0;
	}

	public double getLog1() {
		return log1;
	}

	public void setLog1(double log1) {
		this.log1 = log1;
	}

	public String getLog() {
		return log;
	}

	public void setLog(String log) {
		this.log = log;
	}

	public String getLat() {
		return lat;
	}

	public void setLat(String lat) {
		this.lat = lat;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	
	
	/**
	 * 进入工作台首页界面
	 * @return
	 */
	public String index() {
		return SUCCESS;
	}
	
	
	/**
	 * 查询收入与发展数据
	 * @return
	 */
	public void searchIncomeAndDev() {
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String orgLevel = org.getOrgLevel();
		String orgCode = org.getCode();
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("orgLevel", orgLevel);
		params.put("orgCode", orgCode);
		Calendar c = Calendar.getInstance();//获得当天时间
		c.add(Calendar.DATE, -1);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		String dealDate = sdf.format(c.getTime());
		params.put("dealDate", dealDate);
		List<Map<String, Object>> list = indexService.searchIncomeAndDev(params);
		//如果没有数据，再继续查询前一天数据
		if(list==null || list.size()<=0) {
			c.add(Calendar.DATE, -1);
			dealDate = sdf.format(c.getTime());
			params.put("dealDate", dealDate);
			list = indexService.searchIncomeAndDev(params);
		}
		this.reponseJson(list);
	}
	/**
	 * 查询佣金
	 * @return
	 */
	public void searchYj() {
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String orgLevel = org.getOrgLevel();
		String orgCode = org.getCode();
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("orgLevel", orgLevel);
		params.put("code", "86000"/*orgCode*/);
		Calendar c = Calendar.getInstance();//Calendar.getInstance()该方法返回一个日历Calendar
		c.add(Calendar.MONTH, -1);//这里的Calendar.MONTH获得当前月
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMM");
		String dealDate = sdf.format(c.getTime());
		params.put("dealDate", dealDate);
		List<Map<String, Object>> list = indexService.searchYj(params);
		//如果没有数据，再继续查询前一天数据
		if(list==null || list.size()<=0) {
			c.add(Calendar.MONTH, -1);
			dealDate = sdf.format(c.getTime());
			params.put("dealDate", dealDate);
			list = indexService.searchYj(params);
		}
		this.reponseJson(list);
	}
	/**
	 * 查询实时发展
	 * @return
	 */
	public void searchRealTimeDev() {
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String orgLevel = org.getOrgLevel();
		String orgCode = org.getCode();
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("orgLevel", orgLevel);
		params.put("code", "86000"/*orgCode*/);
		params.put("realTime", "sysdate");
		List<Map<String, Object>> list = indexService.searchRealTimeDev(params);
		
		if(list==null|| list.size()<=0){
			params.put("realTime", "sysdate-numtodsinterval(1,'hour')");
			list = indexService.searchRealTimeDev(params);
		}
		this.reponseJson(list);
	}
	
	/**
	 * 日发展用户数图表
	 */
	public void listIncomeAndDevChart() {
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String orgLevel = org.getOrgLevel();
		String orgCode = org.getCode();
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("orgLevel", orgLevel);
		params.put("code", orgCode);
		List<Map<String, Object>> list =  indexService.listIncomeAndDevChart(params);
		Map<String, Object> result = getChartData(list);
		this.reponseJson(result);
	}

	private Map<String, Object> getChartData(List<Map<String, Object>> list) {
		//设置legend数组,这里的名称必须和series的每一组series的name保持一致
		List<String> legend = new ArrayList<String>();
		legend.add("2G");
		legend.add("3G");
		legend.add("4G");
		List<String> categoryList = new ArrayList<String>();
		List<EchartsSeries> seriesList = new ArrayList<EchartsSeries>();
		EchartsSeries _2gEs = new EchartsSeries();
		_2gEs.setId(1);
		_2gEs.setName("2G");
		_2gEs.setType(EchartsSeries.SERIES_LINE);
		EchartsSeries _3gEs = new EchartsSeries();
		_3gEs.setId(2);
		_3gEs.setName("3G");
		_3gEs.setType(EchartsSeries.SERIES_LINE);
		EchartsSeries _4gEs = new EchartsSeries();
		_4gEs.setId(3);
		_4gEs.setName("4G");
		_4gEs.setType(EchartsSeries.SERIES_LINE);
		List<Double> _2GList = new ArrayList<Double>();
		List<Double> _3GList = new ArrayList<Double>();
		List<Double> _4GList = new ArrayList<Double>();
		for(int i=0; i<list.size(); i++) {
			Map<String, Object> m = list.get(i);
			categoryList.add(String.valueOf(m.get("X")));
			_2GList.add(Double.parseDouble(String.valueOf(m.get("Y1"))));
			_3GList.add(Double.parseDouble(String.valueOf(m.get("Y2"))));
			_4GList.add(Double.parseDouble(String.valueOf(m.get("Y3"))));
		}
		_2gEs.setData(_2GList);
		_3gEs.setData(_3GList);
		_4gEs.setData(_4GList);
		seriesList.add(_2gEs);
		seriesList.add(_3gEs);
		seriesList.add(_4gEs);
		Map<String, Object> result = new HashMap<String,Object>(); 
		result.put("legend", legend);
		result.put("categoryList", categoryList);
		result.put("seriesList", seriesList);
		return result;
	}
	
	/**
	 * 日净增收入图表
	 * @return
	 */
	public void listNetIncomeChart() {
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String orgLevel = org.getOrgLevel();
		String orgCode = org.getCode();
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("orgLevel", orgLevel);
		params.put("code", orgCode);
		List<Map<String, Object>> list = indexService.listNetIncomeChart(params);
		Map<String, Object> result = getChartData(list);
		this.reponseJson(result);
	}
	
	/**
	 * 查询渠道位置
	 * @param params
	 * @return
	 */
	public void listChanlPositions(){
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String orgLevel = org.getOrgLevel();
		String orgCode = org.getCode();
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("orgLevel", orgLevel);
		params.put("code", orgCode);
		if(group!=null&&!group.trim().equals("")){
			params.put("group", group);
		}	
		if(lat0 !=0) {
			params.put("lat0", lat0);
		}
		if(lat1 != 0) {
			params.put("lat1", lat1);
		}
		if(log0 != 0) {
			params.put("log0", log0);
		}
		if(log1 !=0) {
			params.put("log1", log1);
		}
		params.put("flag", flag);
		params.put("status", " in("+status+")");
		List<Map<String, Object>> list = indexService.listChanlPositions(params);
		this.reponseJson(list);
	}
	/**
	 * 根据位置获取渠道信息
	 * @param params
	 * @return
	 */
	public void getChanlPosition(){
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("log", log);
		params.put("lat", lat);
		List<Map<String, Object>> list = indexService.getChanlPosition(params);
		this.reponseJson(list);
	}
	/**
	 * 查询基站位置
	 * @param params
	 * @return
	 */
	public void listJZPositions(){
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String orgLevel = org.getOrgLevel();
		String orgCode = org.getCode();
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("orgLevel", orgLevel);
		params.put("code", orgCode);
		if(group!=null&&!group.trim().equals("")){
			params.put("group", group);
		}	
		if(lat0 !=0) {
			params.put("lat0", lat0);
		}
		if(lat1 != 0) {
			params.put("lat1", lat1);
		}
		if(log0 != 0) {
			params.put("log0", log0);
		}
		if(log1 !=0) {
			params.put("log1", log1);
		}
		params.put("flag", flag);
		params.put("status", " in("+status+")");
		List<Map<String, Object>> list = indexService.listJZPositions(params);
		this.reponseJson(list);
	}
	/**
	 * 根据位置获取渠道信息
	 * @param params
	 * @return
	 */
	public void getJZPosition(){
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("log", log);
		params.put("lat", lat);
		List<Map<String, Object>> list = indexService.getJZPosition(params);
		this.reponseJson(list);
	}
	
	/**
	 * 最新公告
	 */
	public void listBulls() {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("num", 5);
		List<Map<String, Object>> list = indexService.listBulls(params);
		this.reponseJson(list);
	}
	/**
	 * 销售排行
	 * @param params
	 * @return
	 */
	public void listXsph() {
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String orgLevel = org.getOrgLevel();
		String orgCode = org.getCode();
		String hrId=user.getHrId();
		
		Calendar c=Calendar.getInstance();
		c.add(Calendar.DATE, -1);
		String curMonth = new SimpleDateFormat("yyyyMM").format(c.getTime());
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("orgLevel", orgLevel);
		params.put("code", orgCode);
		params.put("hrId", hrId);
		params.put("dealDate", curMonth);
		this.reponseJson(indexService.listXsph(params));
	}
	/**
	 * 积分排行
	 * @param params
	 * @return
	 */
	public void listJfph() {
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String orgLevel = org.getOrgLevel();
		String orgCode = org.getCode();
		String hrId=user.getHrId();
		
		Calendar c=Calendar.getInstance();
		c.add(Calendar.DATE, -1);
		String curMonth = new SimpleDateFormat("yyyyMM").format(c.getTime());
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("orgLevel", orgLevel);
		params.put("code", orgCode);
		params.put("hrId", hrId);
		params.put("dealDate", curMonth);
		this.reponseJson(indexService.listJfph(params));
	}
	/**
	 * 获取公告内容
	 */
	public void getBullById() {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("id", id);
		List<Map<String, Object>> list = indexService.getBullById(params);
		if(null!=list){
			for(Map<String,Object> row:list){
				Object o=row.get("BULLETINDESC");
				if(o!=null&&o instanceof oracle.sql.CLOB){
					row.put("BULLETINDESC", StringUtil.ClobToString((Clob)o));
				}
			}
		}
		this.reponseJson(list);
	}
	
	/**
	 * 文件下载
	 */
	public void listDoc() {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("num", 5);
		List<Map<String, Object>> list = indexService.listDoc(params);
		this.reponseJson(list);
	}
	
	
	//查询待办工单数
	public void qryTodoWorkOrderNum() {
		
		long orderNum = workOrderService.qryTodoWorkOrderNum();
		this.reponseJson(orderNum);
	}
	
	/**
	 * 游离渠道
	 */
	public void freeChannel(){
		Map<String, Object> params = new HashMap<String,Object>();
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String orgCode = org.getCode();
		String orgLevel = org.getOrgLevel();
		params.put("orgCode", orgCode);
		params.put("orgLevel",orgLevel);
		int data = indexService.freeChannel(params);
		this.reponseJson(data);
	}
	
	/**
	 * 游离小区
	 */
	public void freeCommunity(){
		Map<String, Object> params = new HashMap<String,Object>();
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String orgCode = org.getCode();
		String orgLevel = org.getOrgLevel();
		params.put("orgCode", orgCode);
		params.put("orgLevel",orgLevel);
		int data = indexService.freeCommunity(params);
		this.reponseJson(data);
	}
	/**
	 * 保存工作台
	 * @param params
	 * @return
	 */
	public void saveDesk(){
		User user = UserHolder.getCurrentLoginUser();
		String userId=user.getId()+"";
		int r=indexService.saveDesk(moduleIds, userId);
		this.reponseJson(r);
	}
	/**
	 * 添加访问次数
	 */
	
	public void addAccessTimes(){
		User user = UserHolder.getCurrentLoginUser();
		String userId=user.getId()+"";
		String url=this.request.getParameter("url");
		String text=this.request.getParameter("text");
		int r=indexService.addAccessTimes(userId, url,text);
		this.reponseJson(r);
	}
	/**
	 * 访问统计列表
	 * @param params
	 * @return
	 */
	public void listAccess(){
		User user = UserHolder.getCurrentLoginUser();
		String userId=user.getId()+"";
		List<Map<String, Object>> list = indexService.listAccess(userId,5);
		this.reponseJson(list);
	}
}
