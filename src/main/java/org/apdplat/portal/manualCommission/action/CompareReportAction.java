package org.apdplat.portal.manualCommission.action;

import java.util.Map;

import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.manualCommission.service.CompareReportService;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 对比报表
 * @author only
 *
 */
public class CompareReportAction extends BaseAction {
	private static final long serialVersionUID = 1L;
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	private Map<String, String> resultMap;
	@Autowired
	private CompareReportService compareReportService;
	/**
	 * 查询对比报表数据
	 */
	public void queryCompareData(){
		
		try {
			String regionCode = request.getParameter("regionCode");
			if(null!=regionCode&&!"".equals(regionCode)){
				resultMap.put("regionCode", regionCode);
			}
			Object result = compareReportService.queryCompareData(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询对比报表信息失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询对比报表信息失败\"}");
		}
	}
	public Map<String, String> getResultMap() {
		return resultMap;
	}
	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}
	
	
}
