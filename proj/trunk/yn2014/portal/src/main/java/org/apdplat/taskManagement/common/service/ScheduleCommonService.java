package org.apdplat.taskManagement.common.service;

import java.util.List;
import java.util.Map;

import org.apdplat.taskManagement.common.dao.ScheduleCommonDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author suyi
 * @date 2015年3月23日
 */
@Service
public class ScheduleCommonService {
	
	@Autowired
	private ScheduleCommonDao scheduleCommonDao;
	
	/**
	 * 查询排产指标信息（tab_target_sale）
	 * @param code1
	 * @return
	 */
	public List<Map<String,String>> qryIndexInfoList(String code1) {
		
		return scheduleCommonDao.qryIndexInfoList(code1);
	}
	
	/**
	 * 从org表中根据code查询下级区域信息
	 * @param code
	 * @return
	 */
	public List<Map<String,String>> qrySubordinateAreaByCode(String code) {
		
		return scheduleCommonDao.qrySubordinateAreaByCode(code);
	}
	
	/**
	 * 通过营服中心unit_id查询负责人
	 * @param params
	 * 	unit_id: 营服中心编码
	 *  type 1:营服中心责任人,2:渠道经理,3:集客经理,4:营业员,5:固网专员
	 * @return
	 */
	public List<Map<String, String>> qryChanlManager(Map<String, Object> params) {
		return scheduleCommonDao.qryChanlManager(params);
	}
	
	/**
	 * 通过人员类型查询下级地域
	 * @param params
	 * @return
	 */
	public List<Map<String, String>> qryRegionByManager(Map<String, Object> params) {
		return scheduleCommonDao.qryRegionByManager(params);
	}
	
	public List<Map<String, String>> selectRegion(Map<String, String> params) {
		return scheduleCommonDao.selectRegion(params);
	}
	
}
