package org.apdplat.portal.costManagement.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.runtime.ProcessInstance;
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.module.system.service.PropertyHolder;
import org.apdplat.platform.exception.BusiException;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.common.service.CommonParamService;
import org.apdplat.portal.costManagement.dao.ImportCostBudgetDao;
import org.apdplat.workflow.service.WorkOrderService;
import org.apdplat.workflow.vo.WorkOrderVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.miemiedev.mybatis.paginator.domain.PageList;


@Service
public class ImportCostBudgetService {
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	@Autowired
	private ImportCostBudgetDao importCostBudgetDao;
	@Autowired
	private CommonParamService commonParamService;
	@Autowired
	private WorkOrderService workOrderService;
	
	/**
	 * 查询成本预算导入数据
	 * @param params
	 * @return
	 */
	public Object list(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = importCostBudgetDao.list(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	/**
	 * 查询导入的成本中心名称与码表中营服中心名称不一致的数据
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> queryNotExistsUnit(Map<String, String> params) {
		return importCostBudgetDao.queryNotExistsUnit(params);
	}
	
	/**
	 * 根据帐期和成本中心名称查询重复导入过的成本中心数据
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> queryExistsCostName(Map<String, String> params) {
		return importCostBudgetDao.queryExistsCostName(params);
	}
	
	/**
	 * 成本中心预算数据导入到结果表
	 */
	@Transactional
	public void importCostData(Map<String, String> params) throws Exception {
		importCostBudgetDao.importCostData(params);
	}
	
	/**
	 * 删除导入成本预算临时表数据
	 * @param params
	 */
	@Transactional
	public void deleteCostTemp(Map<String, String> params) {
		importCostBudgetDao.deleteCostTemp(params);
	}
	
	/**
	 * 通过id获取成本预算
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> loadById(Map<String, String> params) {
		return importCostBudgetDao.loadById(params);
	}
	
	/**
	 * 修改成本预算
	 * @param params
	 */
	@Transactional
	public void update(Map<String, String> params) throws Exception {
		importCostBudgetDao.update(params);
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
			map.put("code", org.getRegionCode());
			int count = importCostBudgetDao.getDataListCount(map);
			if(count <= 0) {
				throw new BusiException("审核数据为空！");
			}
			importCostBudgetDao.updateDataWorkNo(map);
			//activity流程key，在activity的bpmn文件中定义
			String processKey = PropertyHolder.getProperty("importCostBudgetKey");
			//流程审批中的可编辑页面，类似之前的拟稿人的编辑修改界面
			String importCostBudgetEditUrl = PropertyHolder.getProperty("importCostBudgetEditUrl");
			//流程审批中的查看界面
			String importCostBudgetReadUrl = PropertyHolder.getProperty("importCostBudgetReadUrl");
			WorkOrderVo workOrderVo = new WorkOrderVo();
			workOrderVo.setBusinessKey(businessKey);
			workOrderVo.setProcessKey(processKey);
			workOrderVo.setTitle(map.get("title").toString());
			workOrderVo.setEditUrl(importCostBudgetEditUrl);
			workOrderVo.setNoEditUrl(importCostBudgetReadUrl);
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
	
	/**
	 * 通过工单编号查询成本预算数据
	 * @param params
	 * @return
	 */
	public Object listByWorkNo(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = importCostBudgetDao.listByWorkNo(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	/**
	 * 查询成本预算拒绝原因
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> getRrefuseInfo(String id) {
		return importCostBudgetDao.getRrefuseInfo(id);
	}
}
