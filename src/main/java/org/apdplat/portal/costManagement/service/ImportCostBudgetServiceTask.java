package org.apdplat.portal.costManagement.service;

import org.activiti.engine.delegate.DelegateExecution;
import org.apdplat.platform.exception.BusiException;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.costManagement.dao.ImportCostBudgetDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 审批成功后，将成本预算结果表中的状态修改为审批通过
 * @author wcyong
 *
 */
@Service
public class ImportCostBudgetServiceTask {
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	@Autowired
	private ImportCostBudgetDao importCostBudgetDao;
	
	@Transactional(rollbackFor=Exception.class)
	public void updateStatus(DelegateExecution delegateExecution) throws Exception {
		try{
			String workNo = delegateExecution.getProcessBusinessKey();
			importCostBudgetDao.updateStatus(workNo);
		}catch(Exception e){
			logger.error(e.getMessage(), e);
			throw new BusiException("更新审核状态失败！！！");
		}
	}
	
	@Transactional(rollbackFor=Exception.class)
	public void cancleApply(DelegateExecution delegateExecution) throws BusiException {
		try{
			String workNo = delegateExecution.getProcessBusinessKey();
			importCostBudgetDao.cancleApply(workNo);
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.getMessage(), e);
			throw new BusiException("作废并更新审核状态失败！！！");
		}
	}
}
