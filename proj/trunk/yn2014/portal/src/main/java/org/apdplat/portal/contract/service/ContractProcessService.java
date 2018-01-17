package org.apdplat.portal.contract.service;

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
import org.apdplat.portal.contract.dao.ContractProcessDao;
import org.apdplat.workflow.service.WorkOrderService;
import org.apdplat.workflow.vo.WorkOrderVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class ContractProcessService {
    @Autowired
    private ContractProcessDao dao;
    @Autowired
	private CommonParamService commonParamService;
    @Autowired
	private WorkOrderService workOrderService;
    private final APDPlatLogger logger = new APDPlatLogger(getClass());

    public Object list(Map<String, String> params) {
        Map<String,Object> result = new HashMap<String,Object>();
        PageList<Map<String, Object>> rows = dao.list(params);
        result.put("rows", rows);
        result.put("pagin", rows.getPaginator());
        return result;
    }
    
    @Transactional
    public void addChannel(Map<String, String> params) {
        dao.addChannel(params);
        updateChanName();
    }

    public Map<String, Object> findById(String id) {
        return dao.findById(id);
    }
    
    @Transactional
    public void updateChannel(Map<String, String> params) {
        dao.updateChannel(params);
    }
	
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
			map.put("businessKey", businessKey);
			map.put("userId", String.valueOf(user.getId()));
			map.put("username", user.getUsername());
			map.put("regionCode", org.getRegionCode());
			map.put("orgLevel", org.getOrgLevel());
			int count = dao.getDataListCount(map);
			if(count <= 0) {
				throw new BusiException("审核数据为空！");
			}
			dao.updateDataWorkNo(map);
			//activity流程key，在activity的bpmn文件中定义
			//activity流程key，在activity的bpmn文件中定义
			String processKey = PropertyHolder.getProperty("contractProcessKey");
			//流程审批中的可编辑页面，类似之前的拟稿人的编辑修改界面
			String editUrl = PropertyHolder.getProperty("contractProcessEditUrl");
			//流程审批中的查看界面
			String readUrl = PropertyHolder.getProperty("contractProcessReadUrl");
			WorkOrderVo workOrderVo = new WorkOrderVo();
			workOrderVo.setBusinessKey(businessKey);
			workOrderVo.setProcessKey(processKey);
			workOrderVo.setTitle(map.get("title").toString());
			workOrderVo.setEditUrl(editUrl);
			workOrderVo.setNoEditUrl(readUrl);
			workOrderVo.setNextDealer(map.get("nextDealer").toString());
			workOrderVo.setDesc(map.get("title").toString());
			workOrderVo.setStartMan(user.getId().toString());
			workOrderVo.setRegionName(org.getRegionName());
			ProcessInstance processInstance = workOrderService.startProcessInstanceByKey(workOrderVo);
			//发起人发起有附件的工单，update附件临时表的init_id
			if(map.get("isHavingFile").equals("withFile")){
				dao.updateFileTempKey(map);
				dao.insertToFileResult(map);
			}
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
		PageList<Map<String, Object>> rows = dao.listByWorkNo(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}

	@Transactional
	public void importToResult(Map<String,String> resultMap) {
		if(isBussinessNull(resultMap)){
			dao.delResultNotKey(resultMap);
			dao.importToResult(resultMap);
			updateChanName();
		}else{
			dao.delResultByKey(resultMap);
			dao.importToResult(resultMap);
			dao.updateInitId(resultMap);
			updateChanName();
		}
	}
	
	@Transactional
	public void delTemp(String regionCode) {
		dao.delTemp(regionCode);
	}
    
	public List<Map<String, Object>> queryFiles(String businessKey) {
		return dao.queryFiles(businessKey);
	}
	
	public boolean isBussinessNull(Map<String,String> resultMap){
		if(resultMap.get("businessKey")!=null&&
		   !resultMap.get("businessKey").toString().equals("")
		   ){
			   return false;
		}
		return true;
	}
	
	public static void main(String[] args) {
		String processKey = PropertyHolder.getProperty("contractProcessKey");
		System.out.println(processKey);
	}

    public Map<String, Object> findByChanCode(Map<String, String> resultMap) {
        return dao.findByChanCode(resultMap);
    }
    
    //更新渠道名称
    @Transactional
    public void updateChanName(){
        dao.updateChanName();
    }
}
