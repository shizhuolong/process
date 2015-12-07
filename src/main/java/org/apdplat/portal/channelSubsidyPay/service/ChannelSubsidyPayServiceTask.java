package org.apdplat.portal.channelSubsidyPay.service;

import org.activiti.engine.delegate.DelegateExecution;
import org.apdplat.platform.exception.BusiException;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.channelSubsidyPay.ChannelPayStatus;
import org.apdplat.portal.channelSubsidyPay.dao.ChannelSubsidyPayDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ChannelSubsidyPayServiceTask {
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	@Autowired
	ChannelSubsidyPayDao dao;
	@Transactional(rollbackFor=Exception.class)
	public void reject2CommissionManager(DelegateExecution delegateExecution) throws Exception {
		try{
			String workNo = delegateExecution.getProcessBusinessKey();
			dao.updateStatus(workNo, ChannelPayStatus.EDITED);
			logger.debug("退回到佣金管理员");
		}catch(Exception e){
			logger.error(e.getMessage(), e);
			throw new BusiException("退回失败！！！");
		}
	}
	@Transactional(rollbackFor=Exception.class)
	public void reject2MarketingManager(DelegateExecution delegateExecution) throws Exception {
		try{
			String workNo = delegateExecution.getProcessBusinessKey();
			dao.updateStatus(workNo, ChannelPayStatus.READ_ONLY);
			logger.debug("退回到市场部经理");
		}catch(Exception e){
			logger.error(e.getMessage(), e);
			throw new BusiException("退回失败！！！");
		}
	}
	@Transactional(rollbackFor=Exception.class)
	public void commitAndReadOnly(DelegateExecution delegateExecution) throws Exception {
		try{
			String workNo = delegateExecution.getProcessBusinessKey();
			dao.updateStatus(workNo, ChannelPayStatus.READ_ONLY);
			logger.debug("退回到市场部经理");
		}catch(Exception e){
			logger.error(e.getMessage(), e);
			throw new BusiException("退回失败！！！");
		}
	}
	@Transactional(rollbackFor=Exception.class)
	public void complete(DelegateExecution delegateExecution) throws Exception {
		try{
			String workNo = delegateExecution.getProcessBusinessKey();
			dao.updateStatus(workNo, ChannelPayStatus.COMPLETE);
			logger.debug("结束");
		}catch(Exception e){
			logger.error(e.getMessage(), e);
			throw new BusiException("退回失败！！！");
		}
	}
}
