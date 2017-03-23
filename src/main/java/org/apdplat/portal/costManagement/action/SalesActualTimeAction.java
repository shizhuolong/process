package org.apdplat.portal.costManagement.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.costManagement.service.SalesActualTimeService;
import org.apdplat.portal.index.model.EchartsSeries;
import org.apdplat.report.devIncome.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;

public class SalesActualTimeAction extends BaseAction{
	private static final long serialVersionUID = 1L;
	@Autowired
	private SalesActualTimeService salesActualTimeService;
	@Autowired
	private ReportService service;
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	private String groupId;
	private String endDate;
	private String startDate;
	private String orgLevel;
	private String orgCode;
	private String hrId;
	private String devType;
	private String rows;//每页显示的记录数  
	private String page;//当前第几页  
	
	private String nextLevel;
	private String nextCode;
	/**
	 * 实时销量数据展现
	 */
	public void listSales(){
		try {
			Map<String,Object> paramsMap = new HashMap<String,Object>();
			if(groupId!=null&&!"".equals(groupId)){
				paramsMap.put("groupId", groupId);
			}
			if(endDate!=null&&!"".equals(endDate)){
				paramsMap.put("dealDate", endDate);
			}
			if(orgLevel!=null&&!"".equals(orgLevel)){
				paramsMap.put("orgLevel", orgLevel);
				if(orgLevel.equals("3")){
					paramsMap.put("hrIds", power(hrId,endDate));
				}
			}
			if(orgCode!=null&&!"".equals(orgCode)){
				paramsMap.put("orgCode", orgCode);
			}
			if(nextLevel!=null&&!"".equals(nextLevel)){
				paramsMap.put("nextLevel", nextLevel);
			}
			if(nextCode!=null&&!"".equals(nextCode)){
				paramsMap.put("nextCode", nextCode);
			}
			
			//System.out.println(paramsMap);
			List<Map<String,Object>> list = salesActualTimeService.listSales(paramsMap);
			this.reponseJson(list);
			//System.out.println(list);
		} catch (Exception e) {
			logger.error("查询实时销量数据失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询实时销量数据失败\"}");
		}
	}
	
	/**
	 * 查询渠道级实时销量明细
	 * 显示数据为(给定时间)当天零点到给定时间(到小时)之间的数据,传入参数startDate作为查询时候DEAL_DATE参数，endDate为入网时间JOIN_DATE的参数
	 */
	public void listChanlSalesDetail(){
		try {
			Map<String,String> params = new HashMap<String,String>();
			//截止至某小时的时间
			params.put("endDate", endDate);
			//某一天的时间
			params.put("startDate", startDate);
			params.put("orgCode", orgCode);
			params.put("orgLevel", orgLevel);
			params.put("devType", devType);
			params.put("rows", rows);
			params.put("page", page);
			Map<String,Object> result = salesActualTimeService.listChanlSalesDetail(params);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询实时销量明细数据失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询实时销量明细数据失败\"}");
		}
	}
	
	/**
	 * 实时销量明细图表数据查询
	 */
	public void showDataChart() {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("orgLevel", orgLevel);
		params.put("orgCode", orgCode);
		params.put("endDate", endDate);
		params.put("startDate", startDate);
		List<Map<String, Object>> list =  salesActualTimeService.showDataChart(params);
		Map<String, Object> result = getChartData(list);
		this.reponseJson(result);
	}
	
	/**
	 * 组装图标展示数据
	 * @param list
	 * @return
	 */
	private Map<String, Object> getChartData(List<Map<String, Object>> list) {
		//设置legend数组,这里的名称必须和series的每一组series的name保持一致
		List<String> legend = new ArrayList<String>();
		legend.add("2G");
		legend.add("3G");
		legend.add("4G");
		/*****************************/
		legend.add("上网卡");
		legend.add("宽带");
		/*****************************/
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
		/*********************************************/
		EchartsSeries _wifiEs = new EchartsSeries();
		_wifiEs.setId(4);
		_wifiEs.setName("上网卡");
		_wifiEs.setType(EchartsSeries.SERIES_LINE);
		EchartsSeries _kdEs = new EchartsSeries();
		_kdEs.setId(5);
		_kdEs.setName("宽带");
		_kdEs.setType(EchartsSeries.SERIES_LINE);
		/********************************************/
		
		List<Double> _2GList = new ArrayList<Double>();
		List<Double> _3GList = new ArrayList<Double>();
		List<Double> _4GList = new ArrayList<Double>();
		List<Double> _wifiList = new ArrayList<Double>();
		List<Double> _kdList = new ArrayList<Double>();
		for(int i=0; i<list.size(); i++) {
			Map<String, Object> m = list.get(i);
			categoryList.add(String.valueOf(m.get("X")));
			_2GList.add(Double.parseDouble(String.valueOf(m.get("Y1"))));
			_3GList.add(Double.parseDouble(String.valueOf(m.get("Y2"))));
			_4GList.add(Double.parseDouble(String.valueOf(m.get("Y3"))));
			/*****************************/
			_wifiList.add(Double.parseDouble(String.valueOf(m.get("Y4"))));
			_kdList.add(Double.parseDouble(String.valueOf(m.get("Y5"))));
			/*****************************/
		}
		_2gEs.setData(_2GList);
		_3gEs.setData(_3GList);
		_4gEs.setData(_4GList);
		/*****************************/
		_wifiEs.setData(_wifiList);
		_kdEs.setData(_kdList);
		/*****************************/
		seriesList.add(_2gEs);
		seriesList.add(_3gEs);
		seriesList.add(_4gEs);
		
		/*****************************/
		seriesList.add(_wifiEs);
		seriesList.add(_kdEs);
		/*****************************/
		Map<String, Object> result = new HashMap<String,Object>(); 
		result.put("legend", legend);
		result.put("categoryList", categoryList);
		result.put("seriesList", seriesList);
		return result;
	}
	
	public String power(String hrId,String month){
		month=month.substring(0,6);
		String sql="SELECT PORTAL.HR_PERM('"+hrId+"','"+month+"') HRIDS FROM DUAL";  
		Map<String,String> params=new HashMap<String,String>();
		params.put("sql", sql);
		List<Map<String, Object>> list=service.query(params);
		String r="''";
		if(list!=null&&list.size()>0){
			r=list.get(0).get("HRIDS").toString();
		}
		return "("+r+")";
	}
	
	public String getDevType() {
		return devType;
	}

	public void setDevType(String devType) {
		this.devType = devType;
	}

	public String getGroupId() {
		return groupId;
	}

	public void setGroupId(String groupId) {
		this.groupId = groupId;
	}

	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public String getOrgLevel() {
		return orgLevel;
	}

	public void setOrgLevel(String orgLevel) {
		this.orgLevel = orgLevel;
	}

	public String getOrgCode() {
		return orgCode;
	}

	public void setOrgCode(String orgCode) {
		this.orgCode = orgCode;
	}

	public String getRows() {
		return rows;
	}

	public void setRows(String rows) {
		this.rows = rows;
	}

	public String getPage() {
		return page;
	}

	public void setPage(String page) {
		this.page = page;
	}

	public String getNextLevel() {
		return nextLevel;
	}

	public void setNextLevel(String nextLevel) {
		this.nextLevel = nextLevel;
	}

	public String getNextCode() {
		return nextCode;
	}

	public void setNextCode(String nextCode) {
		this.nextCode = nextCode;
	}

	public String getHrId() {
		return hrId;
	}

	public void setHrId(String hrId) {
		this.hrId = hrId;
	}
	
	
}
