package org.apdplat.portal.supported.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.activiti.engine.runtime.ProcessInstance;
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.module.system.service.PropertyHolder;
import org.apdplat.platform.exception.BusiException;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.common.service.CommonParamService;
import org.apdplat.portal.supported.dao.ThreeSupportedDao;
import org.apdplat.workflow.service.WorkOrderService;
import org.apdplat.workflow.vo.WorkOrderVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.miemiedev.mybatis.paginator.domain.PageList;


@Service
public class ThreeSupportedService {
	
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private ThreeSupportedDao threeSupportedDao;
	@Autowired
	private CommonParamService commonParamService;
	@Autowired
	private WorkOrderService workOrderService;
	
	
	public Object list(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = threeSupportedDao.list(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	/**
	 * 提交工单审批
	 * @param map
	 * @throws BusiException 
	 */
	@Transactional
	public void doSendOrder(Map<String, String> map) throws BusiException {
		try {
			User user = UserHolder.getCurrentLoginUser();
			Org org = user.getOrg();
			//业务主键，先保存自己的业务数据生成此主键，然后传给activiti，用于和业务数据关联。
			String seqId = commonParamService.getId();
			SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
			String time = format.format(new Date());
			String businessKey = "YN-"+time+seqId; //工单编号
			map.put("workNo", businessKey);
			map.put("userId", String.valueOf(user.getId()));
			map.put("username", user.getUsername());
			map.put("code", org.getCode());
			map.put("orgLevel", org.getOrgLevel());
			int count = threeSupportedDao.getDataListCount(map);
			if(count <= 0) {
				throw new BusiException("审核数据为空！");
			}
			threeSupportedDao.updateDataWorkNo(map);
			//activity流程key，在activity的bpmn文件中定义
			String processKey = PropertyHolder.getProperty("threeSupportedKey");
			//流程审批中的可编辑页面，类似之前的拟稿人的编辑修改界面
			String threeSupportedEditUrl = PropertyHolder.getProperty("threeSupportedEditUrl");
			//流程审批中的查看界面
			String threeSupportedReadUrl = PropertyHolder.getProperty("threeSupportedReadUrl");
			WorkOrderVo workOrderVo = new WorkOrderVo();
			workOrderVo.setBusinessKey(businessKey);
			workOrderVo.setProcessKey(processKey);
			workOrderVo.setTitle(map.get("title").toString());
			workOrderVo.setEditUrl(threeSupportedEditUrl);
			workOrderVo.setNoEditUrl(threeSupportedReadUrl);
			workOrderVo.setNextDealer(map.get("nextDealer").toString());
			workOrderVo.setDesc(map.get("title").toString());
			workOrderVo.setStartMan(user.getId().toString());
			workOrderVo.setRegionName(org.getRegionName());
			
			ProcessInstance processInstance = workOrderService.startProcessInstanceByKey(workOrderVo);
			if(null == processInstance) {
				throw new BusiException("发送失败！");
			}
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			throw new BusiException("工单发送失败，请刷新页面重试");
		}
	}
	
	public Object listByWorkNo(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = threeSupportedDao.listByWorkNo(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	public double queryTotalFee(Map<String, String> params) {
		return threeSupportedDao.queryTotalFee(params);
	}
	
	@Transactional
	public void updateInitId(Map<String, String> params) {
		threeSupportedDao.updateInitId(params);
	}

	public double queryTotalFeeByInitId(Map<String, String> params) {
		return threeSupportedDao.queryTotalFeeByInitId(params);
	}

}
