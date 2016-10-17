package org.apdplat.taskManagement.inspection.dao;

import java.util.List;
import java.util.Map;

import org.apdplat.taskManagement.inspection.bean.InspectionBean;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface ChanlInspectionDao {

	/**
	 * 查询日常巡检人员 
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> queryRcPerson(Map<String, String> params);

	/**
	 * 查询日常巡检渠道
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> queryRcChanl(Map<String, String> params);
	
	/**
	 * 查询登录用户是否是营服中心管理员
	 * @param params
	 * @return
	 */
	public Integer ismanager(Map<String, String> params);
	
	/**
	 * 查询渠道巡检列表数据
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> list(Map<String, String> params);
	
	/**
	 * 查询活动巡检人员
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> queryHdPerson(Map<String, String> params);
	
	/**
	 * 查询活动巡检渠道
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> queryHdChanl(Map<String, String> params);
	
	public void saveHdInspection(InspectionBean inspectionBean);
	
	public void delHdInspection(String id);
	
	public List<Map<String, Object>> queryInspectionChanl(String inspec_id);
	
	public void updateHdInspec(InspectionBean inspectionBean);
	
}
