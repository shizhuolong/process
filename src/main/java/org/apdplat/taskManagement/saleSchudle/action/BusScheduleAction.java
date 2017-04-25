package org.apdplat.taskManagement.saleSchudle.action;

import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.exception.BusiException;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.platform.util.ResultInfo;
import org.apdplat.taskManagement.saleSchudle.service.BusScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
public class BusScheduleAction extends BaseAction {

	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	private static final long serialVersionUID = -6012349865607538843L;
	
	@Autowired
	private BusScheduleService busScheduleService;
	
	private String dealDate;
	private String busCode;
	private Map<String,String> items;

	public void updateTask() {
		
		ResultInfo resultInfo = new ResultInfo();
		try{
			if(StringUtils.isBlank(dealDate)) {
				throw new BusiException("账期不能为空！");
			}
			if(StringUtils.isBlank(busCode)) {
				throw new BusiException("营业厅编码不能为空！");
			}
			String userName=UserHolder.getCurrentLoginUser().getUsername();
			
			String itemsSql="";
			if(null!=items){
				for(String itemName:items.keySet()){
					String itemValue=items.get(itemName);
					itemsSql+=","+itemName+" = "+itemValue;
				}
			}
			busScheduleService.updateTask(dealDate,busCode,userName,itemsSql);
			resultInfo.setCode(ResultInfo._CODE_OK_);
			resultInfo.setMsg("修改成功！");
		}catch(BusiException e) {
			logger.error(e.getMessage(),e);
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg(e.getMessage());
		}catch(Exception e) {
			logger.error(e.getMessage(),e);
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg("修改失败！");
		}
		this.reponseJson(resultInfo);
	}
	public String getDealDate() {
		return dealDate;
	}
	public void setDealDate(String dealDate) {
		this.dealDate = dealDate;
	}
	public String getBusCode() {
		return busCode;
	}
	public void setBusCode(String busCode) {
		this.busCode = busCode;
	}
	public Map<String, String> getItems() {
		return items;
	}
	public void setItems(Map<String, String> items) {
		this.items = items;
	}
}
