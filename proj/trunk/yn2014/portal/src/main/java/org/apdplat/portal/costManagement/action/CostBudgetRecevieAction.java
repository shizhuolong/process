package org.apdplat.portal.costManagement.action;

import java.util.HashMap;
import java.util.Map;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.exception.BusiException;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.platform.util.ResultInfo;
import org.apdplat.portal.costManagement.service.CostBudgetReceiveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

/**
 * 成本预算接收
 * @author wcyong
 *
 */
@SuppressWarnings("serial")
@Controller
@Namespace("/costBudgetRecevie")
@Scope("prototype")
@Results({
	@Result(name="index", location="/portal/costManagement/jsp/cost_budget_receive_list.jsp"),
	@Result(name="listDetails", location="/portal/costManagement/jsp/cost_budget_details_list.jsp")
})
public class CostBudgetRecevieAction extends BaseAction{
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private CostBudgetReceiveService costBudgetReceiveService;
	private Map<String, String> resultMap;

	public String index() {
		return "index";
	}
	
	/**
	 * 成本预算收入列表
	 */
	public void list() {
		try {
			User user = UserHolder.getCurrentLoginUser();
			Org org = user.getOrg();
			String code = org.getCode();
			String deal_date = request.getParameter("deal_date");
			String unit_name = request.getParameter("unit_name");
			String is_confirm = request.getParameter("is_confirm");
			if(deal_date != null && !"".equals(deal_date.trim())) {
				resultMap.put("deal_date", "%"+deal_date+"%");
			}
			if(unit_name != null && !"".equals(unit_name.trim())) {
				resultMap.put("unit_name", "%"+unit_name+"%");
			}
			if(is_confirm != null && !"".equals(is_confirm.trim())) {
				resultMap.put("is_confirm", is_confirm);
			}
			resultMap.put("code", code);
			resultMap.put("orgLevel", org.getOrgLevel());
			Object result = costBudgetReceiveService.list(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("查询成本预算接收数据信息失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询成本预算接收数据信息失败\"}");
		}
	}
	
	/**
	 * 确认成本预算
	 */
	public void confirmTask() {
		ResultInfo info = new ResultInfo();
		User user = UserHolder.getCurrentLoginUser();
		try {
			String unit_id = request.getParameter("unit_id");
			String init_id = request.getParameter("init_id");
			String deal_date = request.getParameter("deal_date");
			if(unit_id == null || "".equals(unit_id)) {
				throw new BusiException("成本预算确认失败(unit_id为空)!");
			}
			if(deal_date == null || "".equals(deal_date)) {
				throw new BusiException("成本预算确认失败(deal_date为空)!");
			}
			Map<String, String> params = new HashMap<String, String>();
			params.put("unit_id", unit_id);
			params.put("init_id", init_id);
			params.put("deal_date", deal_date);
			params.put("confirm_user", String.valueOf(user.getId()));
			costBudgetReceiveService.confirmTask(params);
			info.setCode(ResultInfo._CODE_OK_);
		} catch (BusiException e) {
			logger.error(e.getMessage(), e);
			info.setCode(ResultInfo._CODE_FAIL_);
			info.setMsg(e.getMessage());
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			info.setCode(ResultInfo._CODE_FAIL_);
			info.setMsg("成本预算确认失败！");
		}
		this.reponseJson(info);
	}
	
	/**
	 * 拒绝成本预算
	 */
	public void refuseCostBudget() {
		ResultInfo info = new ResultInfo();
		User user = UserHolder.getCurrentLoginUser();
		try {
			String unit_id = request.getParameter("unit_id");
			String init_id = request.getParameter("init_id");
			String deal_date = request.getParameter("deal_date");
			String refuseReason = request.getParameter("refuseReason");
			if(refuseReason == null || "".equals(refuseReason.trim())) {
				throw new BusiException("成本预算拒绝原因不能为空!");
			}
			if(unit_id == null || "".equals(unit_id)) {
				throw new BusiException("成本预算拒绝操作失败(unit_id为空)!");
			}
			if(deal_date == null || "".equals(deal_date)) {
				throw new BusiException("成本预算拒绝操作失败(deal_date为空)!");
			}
			Map<String, String> params = new HashMap<String, String>();
			params.put("unit_id", unit_id);
			params.put("init_id", init_id);
			params.put("deal_date", deal_date);
			params.put("confirm_user", String.valueOf(user.getId()));
			params.put("refuseReason", refuseReason);
			costBudgetReceiveService.refuseCostBudget(params);
			info.setCode(ResultInfo._CODE_OK_);
		} catch (BusiException e) {
			logger.error(e.getMessage(), e);
			info.setCode(ResultInfo._CODE_FAIL_);
			info.setMsg(e.getMessage());
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			info.setCode(ResultInfo._CODE_FAIL_);
			info.setMsg("成本预算拒绝操作失败！");
		}
		this.reponseJson(info);
	}
	
	/**
	 * 明细界面
	 * @return
	 */
	public String listDetails() {
		String unit_id = request.getParameter("unit_id");
		String init_id = request.getParameter("init_id");
		String deal_date = request.getParameter("deal_date");
		ServletActionContext.getContext().put("unit_id", unit_id);
		ServletActionContext.getContext().put("init_id", init_id);
		ServletActionContext.getContext().put("deal_date", deal_date);
		return "listDetails";
	}
	
	/**
	 * 查询成本预算明细
	 */
	public void listDetailsInfo() {
		ResultInfo info = new ResultInfo();
		try {
			String unit_id = request.getParameter("unit_id");
			String init_id = request.getParameter("init_id");
			String deal_date = request.getParameter("deal_date");
			String cost_center_name = request.getParameter("cost_center_name");
			if(unit_id == null || "".equals(unit_id)) {
				throw new BusiException("成本预算拒绝操作失败(unit_id为空)!");
			}
			if(deal_date == null || "".equals(deal_date)) {
				throw new BusiException("成本预算拒绝操作失败(deal_date为空)!");
			}
			resultMap.put("unit_id", unit_id);
			resultMap.put("init_id", init_id);
			resultMap.put("deal_date", deal_date);
			if(cost_center_name != null && !"".equals(cost_center_name.trim())) {
				resultMap.put("cost_center_name", "%"+cost_center_name+"%");
			}
			Object result = costBudgetReceiveService.listDetailsInfo(resultMap);
			this.reponseJson(result);
		} catch(BusiException e){
			logger.error(e.getMessage(), e);
			info.setCode(ResultInfo._CODE_FAIL_);
			info.setMsg(e.getMessage());
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			info.setCode(ResultInfo._CODE_FAIL_);
			info.setMsg("成本预算明细查询失败！");
		}
		this.reponseJson(info);
	}
	
	public void selectRegion() {
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String level = org.getOrgLevel();
		Map<String, String> map = new HashMap<String,String>();
		map.put("level", level);
		map.put("code", org.getCode());
		Object result = costBudgetReceiveService.selectRegion(map);
		this.reponseJson(result);
	}
	

	public Map<String, String> getResultMap() {
		return resultMap;
	}

	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}
	
	
	
}
