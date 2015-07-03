package org.apdplat.taskManagement.common.dao;

import java.util.List;
import java.util.Map;

/**
 * @author suyi
 * @date 2015年3月23日
 */
public interface ScheduleCommonDao {
	
	public List<Map<String,String>> qryIndexInfoList(String code1);
	
	public List<Map<String,String>> qrySubordinateAreaByCode(String code);
	
	/**
	 * 通过营服中心unit_id查询负责人
	 * @param params
	 * 	unit_id: 营服中心编码
	 *  type 1:营服中心责任人,2:渠道经理,3:集客经理,4:营业员,5:固网专员
	 * @return
	 */
	public List<Map<String, String>> qryChanlManager(Map<String, Object> params);
	
	/**
	 * 通过人员类型查询下级地域
	 * @param params
	 * @return
	 */
	public List<Map<String, String>> qryRegionByManager(Map<String, Object> params);
	
	public List<Map<String, String>> selectRegion(Map<String, String> params);
	
}
