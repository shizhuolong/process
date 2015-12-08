package org.apdplat.portal.channelSubsidyPay.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.runtime.ProcessInstance;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.module.system.service.PropertyHolder;
import org.apdplat.platform.exception.BusiException;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.channelSubsidyPay.ChannelPayStatus;
import org.apdplat.portal.channelSubsidyPay.dao.ChannelSubsidyPayDao;
import org.apdplat.portal.common.service.CommonParamService;
import org.apdplat.workflow.service.WorkOrderService;
import org.apdplat.workflow.vo.WorkOrderVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.miemiedev.mybatis.paginator.domain.PageList;


@Service
public class ChannelSubsidyPayService {
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	@Autowired
	private ChannelSubsidyPayDao channelSubsidyPayDao;
	@Autowired
	private CommonParamService commonParamService;
	@Autowired
	private WorkOrderService workOrderService;
	/**
	 * 提交工单审批
	 * @param map
	 * @throws BusiException 
	 */
	@Transactional
	public void doSendOrder(String month,String title) throws BusiException {
		try {
			Map<String, String> map=new HashMap<>();
			
			map.put("dealDate", month);
			
			int count = channelSubsidyPayDao.getDataListCount(map);
			if(count > 0) {
				throw new BusiException("账期【"+month+"】已经生成过工单，不允许重复生成！");
			} 
			
			map.put("taskId", "commissionManagerAudit");//佣金管理员审核
			List<Map<String, Object>> allDealers=channelSubsidyPayDao.getAllRegionDealersByTaskId(map);
			//必须查询到结果，且结果中的所有记录的USERCOUNT==1，为0则说明没有配置该地市的
			//佣金管理员，大于1则说明配置了多个
			//必须满足每个地市都配置了佣金管理员且只配置了一个人才能生成工单
			if(allDealers==null||allDealers.size()==0){
				throw new BusiException("佣金管理员没有配置！");
			}
			String msg="";
			for(Map<String, Object> m:allDealers){
				String userCount=(String) m.get("USERCOUNT");
				if(userCount.trim().equals("0")){
					msg+="<"+m.get("REGION_NAME")+":没有配置佣金管理员>";
				}else if(userCount.trim().equals("1")){
					//不用处理
				}else{
					msg+="<"+m.get("REGION_NAME")+":配置了多个佣金管理员【"+m.get("USERNAMES")+"】>";
				}
			}
			if(msg.length()>0){
				throw new BusiException(msg);
			}
			User user = UserHolder.getCurrentLoginUser();
			//给每个地市的佣金管理员发送工单
			for(Map<String, Object> m:allDealers){
				Map<String, String> tmap=new  HashMap<>();
				
				//业务主键，先保存自己的业务数据生成此主键，然后传给activiti，用于和业务数据关联。
				String seqId = commonParamService.getId();
				SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
				String time = format.format(new Date());
				String businessKey = "YN-"+time+seqId; //工单编号
				
				map.put("workNo", businessKey);
				map.put("status",ChannelPayStatus.EDITED);
				map.put("code",(String) m.get("CODE"));
				map.put("dealDate",month);
				
				channelSubsidyPayDao.updateDataWorkNo(map);
				
				//activity流程key，在activity的bpmn文件中定义
				String processKey = PropertyHolder.getProperty("channelSubsidyPayKey");
				//流程审批中的可编辑页面，类似之前的拟稿人的编辑修改界面
				String editUrl = PropertyHolder.getProperty("channelSubsidyPayKeyEditUrl");
				//流程审批中的查看界面
				String readUrl = PropertyHolder.getProperty("channelSubsidyPayKeyReadUrl");
				
				WorkOrderVo workOrderVo = new WorkOrderVo();
				workOrderVo.setBusinessKey(businessKey);
				workOrderVo.setProcessKey(processKey);
				workOrderVo.setTitle("【"+m.get("REGION_NAME")+"】"+title);
				workOrderVo.setEditUrl(editUrl);
				workOrderVo.setNoEditUrl(readUrl);
				workOrderVo.setNextDealer(m.get("USERID").toString());
				workOrderVo.setDesc("【"+m.get("REGION_NAME")+"】"+title);
				workOrderVo.setStartMan(user.getId().toString());
				workOrderVo.setRegionName(m.get("REGION_NAME").toString());
				
				ProcessInstance processInstance = workOrderService.startProcessInstanceByKey(workOrderVo);
				if(null == processInstance) {
					throw new BusiException("发送失败！");
				}
			}
		} catch (BusiException e) {
			logger.error(e.getMessage(), e);
			throw new BusiException(e.getMessage());
		}catch (Exception e) {
			logger.error(e.getMessage(), e);
			throw new BusiException("工单发送失败，请刷新页面重试");
		}
	}
	/**
	 * 通过工单编号查询数据
	 * @param params
	 * @return
	 */
	public Object listByWorkNo(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = channelSubsidyPayDao.listByWorkNo(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	public void updateJf(Map<String, Object> m) {
		channelSubsidyPayDao.updateJf(m);
		String dealDate=channelSubsidyPayDao.getDealDateByWorkNo(m);
		m.put("dealDate", dealDate);
		channelSubsidyPayDao.updateJfLj(m);
	}
}
