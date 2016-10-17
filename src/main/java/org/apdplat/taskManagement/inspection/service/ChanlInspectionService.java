package org.apdplat.taskManagement.inspection.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.portal.common.util.UUIDGeneratorUtils;
import org.apdplat.taskManagement.inspection.bean.InspectionBean;
import org.apdplat.taskManagement.inspection.dao.ChanlInspectionDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class ChanlInspectionService {
	
	@Autowired
	private ChanlInspectionDao chanlInspectionDao;
	
	/**
	 * 查询日常巡检人员
	 * @param params
	 * @return
	 */
	public Object queryRcPerson(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = chanlInspectionDao.queryRcPerson(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}

	/**
	 * 查询日常巡检渠道
	 * @param params
	 * @return
	 */
	public Object queryRcChanl(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = chanlInspectionDao.queryRcChanl(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	/**
	 * 查询登录用户是否是营服中心管理员
	 * @param params
	 * @return
	 */
	public boolean ismanager(Map<String, String> params) {
		Integer count = chanlInspectionDao.ismanager(params);
		return count>0?true:false;
	}
	
	
	/**
	 * 查询渠道巡检列表数据
	 * @param params
	 * @return
	 */
	public Object list(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = chanlInspectionDao.list(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	/**
	 * 查询活动巡检人员
	 * @param params
	 * @return
	 */
	public Object queryHdPerson(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = chanlInspectionDao.queryHdPerson(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	/**
	 * 查询活动巡检渠道
	 * @param params
	 * @return
	 */
	public Object queryHdChanl(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = chanlInspectionDao.queryHdChanl(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	/**
	 * 添加活动巡检
	 * @param list
	 */
	@Transactional(rollbackFor=Exception.class)
	public void saveHdInspection(List<InspectionBean> list) {
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String inspec_id = UUIDGeneratorUtils.getUUID();
		for(InspectionBean bean : list) {
			bean.setId(UUIDGeneratorUtils.getUUID());
			bean.setInspec_id(inspec_id);
			bean.setC_user_id(String.valueOf(user.getId()));
			bean.setC_user_name(user.getRealName());
			bean.setC_user_region(org.getCode());
			bean.setC_phone(user.getPhone());
			bean.setC_user_region_level(org.getOrgLevel());
			chanlInspectionDao.saveHdInspection(bean);
		}
	}
	
	/**
	 * 更新活动巡检
	 * @param list
	 */
	@Transactional(rollbackFor=Exception.class)
	public void updateHdInspec(List<InspectionBean> list, String old_inspec_id) {
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		for(InspectionBean bean : list) {
			bean.setId(UUIDGeneratorUtils.getUUID());
			bean.setInspec_id(old_inspec_id);
			bean.setC_user_id(String.valueOf(user.getId()));
			bean.setC_user_name(user.getRealName());
			bean.setC_user_region(org.getCode());
			bean.setC_phone(user.getPhone());
			bean.setC_user_region_level(org.getOrgLevel());
			bean.setOld_inspec_id(old_inspec_id);
			chanlInspectionDao.updateHdInspec(bean);
		}
	}
	
	@Transactional(rollbackFor=Exception.class)
	public void delHdInspection(String id) {
		chanlInspectionDao.delHdInspection(id);
	}
	
	public List<Map<String, Object>> queryInspectionChanl(String inspec_id) {
		return chanlInspectionDao.queryInspectionChanl(inspec_id);
	}

	
}
