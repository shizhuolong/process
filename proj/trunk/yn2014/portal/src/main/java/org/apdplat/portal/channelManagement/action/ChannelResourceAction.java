package org.apdplat.portal.channelManagement.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.struts2.ServletActionContext;
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.channelManagement.service.ChannelResourceService;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 渠道资源管理
 * 
 * @author wcyong
 * 
 */
@SuppressWarnings("serial")
public class ChannelResourceAction extends BaseAction {

	private final APDPlatLogger logger = new APDPlatLogger(getClass());

	@Autowired
	private ChannelResourceService channelResourceService;
	private String orgId;
	private String orgLevel;
	private String code;
	private Map<String, String> resultMap;

	/**
	 * 查询渠道经理及营服中心负责人组织架构
	 */
	public void listTreeNode() {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("orgId", orgId);
		params.put("orgLevel", orgLevel);
		params.put("code", code);
		List<Map<String, Object>> list = channelResourceService.listTreeNode(params);
		this.reponseJson(list);
	}
	
	/**
	 * 查询渠道信息列表
	 */
	public void listChannel() {
		try {
			String hq_chan_code = request.getParameter("hq_chan_code");
			String hq_chan_name = request.getParameter("hq_chan_name");
			String is_default = request.getParameter("is_default");
			String chn_cde_1_name = request.getParameter("chn_cde_1_name");
			String chn_cde_2_name = request.getParameter("chn_cde_2_name");
			String chn_cde_3_name = request.getParameter("chn_cde_3_name");
			String chn_cde_4_name = request.getParameter("chn_cde_4_name");
			String isMark=request.getParameter("isMark");
			String isAgent=request.getParameter("isAgent");
			String isStart=request.getParameter("isStart");
			String isfy=request.getParameter("isfy");
			if (hq_chan_code != null && !"".equals(hq_chan_code.trim())) {
				resultMap.put("hq_chan_code", hq_chan_code);
			}
			if (hq_chan_name != null && !"".equals(hq_chan_name.trim())) {
				resultMap.put("hq_chan_name", "%" + hq_chan_name + "%");
			}
			if (is_default != null && !"".equals(is_default.trim())) {
				resultMap.put("is_default", is_default);
			}
			if (chn_cde_1_name != null && !"".equals(chn_cde_1_name.trim())) {
				resultMap.put("chn_cde_1_name", "%"+chn_cde_1_name+"%");
			}
			if (chn_cde_2_name != null && !"".equals(chn_cde_2_name.trim())) {
				resultMap.put("chn_cde_2_name", "%"+chn_cde_2_name+"%");
			}
			if (chn_cde_3_name != null && !"".equals(chn_cde_3_name.trim())) {
				resultMap.put("chn_cde_3_name", "%"+chn_cde_3_name+"%");
			}
			if (chn_cde_4_name != null && !"".equals(chn_cde_4_name.trim())) {
				resultMap.put("chn_cde_4_name", "%"+chn_cde_4_name+"%");
			}
			if (isMark != null && !"".equals(isMark.trim())) {
				resultMap.put("isMark", isMark);
			}
			if (isAgent != null && !"".equals(isAgent.trim())) {
				resultMap.put("isAgent", isAgent);
			}
			if (isStart != null && !"".equals(isStart.trim())) {
                resultMap.put("isStart", isStart);
            }
			if (isfy != null && !"".equals(isfy.trim())) {
                resultMap.put("isfy", isfy);
            }
			Object result = channelResourceService.listChannel(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询渠道信息失败", e);
			outJsonPlainString(response, "{\"msg\":\"查询渠道信息失败\"}");
		}
	}

	public void listChnlDetail() {
		Object result = channelResourceService
				.listChnlDetail(resultMap);
		this.reponseJson(result);
	}

	public void listTownDetail() {
		String city_id=request.getParameter("city_id");
		resultMap.put("city_id",city_id);
		Object result = channelResourceService
				.listTownDetail(resultMap);
		this.reponseJson(result);
	}
	
	/**
	 * 查询营服中心
	 */
	public void listUnit() {
		try {
			String group_id_1 = request.getParameter("group_id_1");
			String group_id_4 = request.getParameter("group_id_4");
			String unit_name = request.getParameter("unit_name");
			resultMap.put("group_id_1", group_id_1);
			resultMap.put("group_id_4", group_id_4);
			if (unit_name != null && !"".equals(unit_name.trim())) {
				resultMap.put("unit_name", "%" + unit_name + "%");
			}
			Object result = channelResourceService.listUnit(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询营服中心信息失败", e);
			outJsonPlainString(response, "{\"msg\":\"查询营服中心信息失败\"}");
		}
	}

	/**
	 * 将渠道划分到营服中心
	 */
	public void saveDivideChannel() {
		// 步骤:
		// 1.更新PCDE.TAB_CDE_CHANL_HQ_CODE表中的unit_id,unit_name
		// 2.更新PORTAL.APDP_ORG表中的parent_id
		// 3.将渠道的渠道负责人解绑，需要更新PORTAL.TAB_PORTAL_MOB_PERSON表中的userid,name,account,phone,hr_id,unit_id,unit_name
		// 4.更新PORTAL.TAB_PORTAL_GRP_PERSON表中的unit_id,unit_name
		// 5.更新PORTAL.TAB_PORTAL_MAG_PERSON表中的unit_id,unit_name
		try {
			String unit_id = request.getParameter("unit_id");
			String unit_name = request.getParameter("unit_name");
			String group_id_4 = request.getParameter("group_id_4");
			String orgId = request.getParameter("orgId");
			String login_name = request.getParameter("login_name");
			Map<String, String> params = new HashMap<String, String>();
			params.put("unit_id", unit_id);
			params.put("unit_name", unit_name);
			params.put("group_id_4", group_id_4);
			params.put("orgId", orgId);
			params.put("login_name", login_name);
			channelResourceService.saveDivideChannel(params);
			outJsonPlainString(response, "{\"msg\":\"操作成功\"}");
		} catch (Exception e) {
			logger.error("将渠道划分营服中心操作失败", e);
			outJsonPlainString(response, "{\"msg\":\"渠道划分失败\"}");
		}
	}

	/**
	 * 查询渠道信息
	 */
	public void queryChanelInfo() {
		String group_id_4 = request.getParameter("group_id_4");
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("group_id_4", group_id_4);
		List<Map<String, Object>> list = channelResourceService
				.queryChanelInfo(params);
		this.reponseJson(list);
	}

	/**
	 * 打开查询渠道明细界面
	 */
	public String loadChanlInfo() {
		String group_id_4 = request.getParameter("group_id_4");
		String chnl_id = request.getParameter("chnl_id");
		ServletActionContext.getContext().put("group_id_4", group_id_4);
		ServletActionContext.getContext().put("chnl_id", chnl_id);
		return "chanlInfo";
	}

	public void loadChanlDetails() {
		String group_id_4 = request.getParameter("group_id_4");
		List<Map<String, Object>> list = channelResourceService
				.loadChanlDetails(group_id_4);
		this.reponseJson(list);

	}

	public void addChnlType() {
		Map m = new HashMap<String, String>();
		try {
			String type_name = request.getParameter("type_name");
			channelResourceService.addChnlType(type_name);
			m.put("msg", "添加成功！");
		} catch (Exception e) {
			logger.error("出现异常，添加失败！", e);
			m.put("msg", "出现异常,添加失败！");
		}
		this.reponseJson(m);
	}
	
	public void addTownType() {
		Map m = new HashMap<String, String>();
		try {
			Map<String,String> params = new HashMap<String, String>();
			String town_name = request.getParameter("town_name");
			String group_id_1_name = request.getParameter("group_id_1_name");
			String city_name = request.getParameter("city_name");
			String group_id_1 = request.getParameter("group_id_1");
			String city_id = request.getParameter("city_id");
			
			params.put("town_name", town_name);
			params.put("group_id_1_name", group_id_1_name);
			params.put("city_name", city_name);
			params.put("group_id_1", group_id_1);
			params.put("city_id", city_id);
			channelResourceService.addTownType(params);
			m.put("msg", "添加成功！");
		} catch (Exception e) {
			logger.error("出现异常，添加失败！", e);
			m.put("msg", "出现异常,添加失败！");
		}
		this.reponseJson(m);
	}
	

	public void isExist() {
		Map m = new HashMap<String, String>();
		String type_name = request.getParameter("type_name");
		List<Map<String, Object>> list = channelResourceService
				.isExist(type_name);
		if (list != null && !list.isEmpty()) {
			m.put("msg", "代理点名称已存在,编辑失败！");
		}
		this.reponseJson(m);
	}
	
	public void isTownExist() {
		Map m = new HashMap<String, String>();
		Map<String, String> params = new HashMap<String, String>();
		String town_name = request.getParameter("town_name");
		String city_id = request.getParameter("city_id");
		params.put("town_name", town_name);
		params.put("city_id", city_id);
		List<Map<String, Object>> list = channelResourceService
				.isTownExist(params);
		if (list != null && !list.isEmpty()) {
			m.put("msg", "乡镇名称已存在,编辑失败！");
		}
		this.reponseJson(m);
	}
	
	
	public void loadChnlType() {
		List<Map<String, Object>> list = channelResourceService
				.loadChnlType();
		this.reponseJson(list);
	}
	
	public void loadCityType() {
		String hq_chan_code=request.getParameter("hq_chan_code");
		List<Map<String, Object>> list = channelResourceService
				.loadCityType(hq_chan_code);
		this.reponseJson(list);
	}
	
	public void loadTownType() {
		String city_id=request.getParameter("city_id");
		Map<String,String> params=new HashMap<String,String>();
		params.put("city_id",city_id);
		List<Map<String, Object>> list = channelResourceService
				.loadTownType(params);
		this.reponseJson(list);
	}
	
	//获取商圈名称
	public void loadBusinessName() {
        String businessName=request.getParameter("business_name");
        String group_id_1=request.getParameter("group_id_1");
        Map<String,String> params=new HashMap<String,String>();
        params.put("businessName",businessName);
        params.put("group_id_1",group_id_1);
        List<Map<String, Object>> list = channelResourceService
                .loadBusinessName(params);
        this.reponseJson(list);
    }
	
	//获取学校名称
	public void loadSchoolName() {
        String schoolName=request.getParameter("school_name");
        String group_id_1=request.getParameter("group_id_1");
        Map<String,String> params=new HashMap<String,String>();
        params.put("schoolName",schoolName);
        params.put("group_id_1",group_id_1);
        List<Map<String, Object>> list = channelResourceService
                .loadSchoolName(params);
        this.reponseJson(list);
    }
	
	public void updateAgent() {
		Map m = new HashMap<String, String>();
		try {
			Map<String, String> params = new HashMap<String, String>();
			String chnl_type = request.getParameter("chnl_type");
			String chnl_id = request.getParameter("chnl_id");
			String hq_chan_code = request.getParameter("hq_chan_code");
			String city_id = request.getParameter("city_id");
			String city_name = request.getParameter("city_name");
			String town_id = request.getParameter("town_id");
			String town_name = request.getParameter("town_name");
			String business_id=request.getParameter("business_id");
			String business_name=request.getParameter("business_name");
			String school_id=request.getParameter("school_id");
			String school_name=request.getParameter("school_name");
			params.put("chnl_id", chnl_id);
			params.put("chnl_type", chnl_type);
			params.put("city_id", city_id);
			params.put("city_name", city_name);
			params.put("town_id", town_id);
			params.put("town_name", town_name);
			params.put("hq_chan_code", hq_chan_code);
			params.put("business_id", business_id);
			params.put("business_name", business_name);
			params.put("school_id", school_id);
			params.put("school_name", school_name);
			channelResourceService.updateAgent(params);
			m.put("msg", "修改成功！");
		} catch (Exception e) {
			logger.error("出现异常，修改失败！", e);
			m.put("msg", "出现异常,修改失败！");
		}
		this.reponseJson(m);
	}

	public void updateNotAgent() {
		Map m = new HashMap<String, String>();
		try {
			Map<String, String> params = new HashMap<String, String>();
			String hq_chan_code = request.getParameter("hq_chan_code");
			String city_id = request.getParameter("city_id");
			String city_name = request.getParameter("city_name");
			String town_id = request.getParameter("town_id");
			String town_name = request.getParameter("town_name");
			String business_id = request.getParameter("business_id");
			String business_name = request.getParameter("business_name");
			String school_id = request.getParameter("school_id");
			String school_name = request.getParameter("school_name");
			params.put("city_id", city_id);
			params.put("city_name", city_name);
			params.put("town_id", town_id);
			params.put("town_name", town_name);
			params.put("business_id", business_id);
			params.put("business_name", business_name);
			params.put("school_id", school_id);
			params.put("school_name", school_name);
			params.put("hq_chan_code", hq_chan_code);
			channelResourceService.updateNotAgent(params);
			m.put("msg", "修改成功！");
		} catch (Exception e) {
			logger.error("出现异常，修改失败！", e);
			m.put("msg", "出现异常,修改失败！");
		}
		this.reponseJson(m);
	}
	
	public void updateChnlDetail(){
		Map m=new HashMap<String,String>();
		try {
			Map<String,String> params=new HashMap<String,String>();
			String id = request.getParameter("id");
			String type_name=request.getParameter("type_name");
			params.put("id",id);
			params.put("type_name",type_name);
			channelResourceService.updateChnlDetail(params);
			channelResourceService.updateChnlInMain(params);
			m.put("msg","修改成功！");
		} catch (Exception e) {
			logger.error("出现异常，修改失败！", e);
			m.put("msg","出现异常,修改失败！");
		}
		this.reponseJson(m);
	}
	
	public void updateTownDetail(){
		Map m=new HashMap<String,String>();
		try {
			Map<String,String> params=new HashMap<String,String>();
			String id = request.getParameter("id");
			String town_name=request.getParameter("town_name");
			params.put("id",id);
			params.put("town_name",town_name);
			channelResourceService.updateTownDetail(params);
			channelResourceService.updateTownInMain(params);
			m.put("msg","修改成功！");
		} catch (Exception e) {
			logger.error("出现异常，修改失败！", e);
			m.put("msg","出现异常,修改失败！");
		}
		this.reponseJson(m);
	}
	
	public void delChnlDetail() {
		try {
			String id = request.getParameter("id");
			channelResourceService.delChnlDetail(id);
			this.reponseJson("删除成功！");
		} catch (Exception e) {
			logger.error("出现异常，删除失败！", e);
			this.reponseJson("删除失败！");
		}
	}
	
	public void beforeDelChnlDetail() {
		try {
			String id = request.getParameter("id");
			List<Map<String, Object>> list=channelResourceService.beforeDelChnlDetail(id);
			if(list!=null&&list.size()>0){
				this.reponseJson("该代理点已被渠道打标，无法删除！");
			}
			this.reponseJson("ok");
		} catch (Exception e) {
			logger.error("出现异常，验证失败！", e);
			this.reponseJson("验证失败！");
		}
	}
	
	public void delTownDetail() {
		try {
			String id = request.getParameter("id");
			channelResourceService.delTownDetail(id);
			this.reponseJson("删除成功！");
		} catch (Exception e) {
			logger.error("出现异常，删除失败！", e);
			this.reponseJson("删除失败！");
		}
	}
		
	public void beforeDelTownDetail() {
		try {
			String id = request.getParameter("id");
			List<Map<String, Object>> list=channelResourceService.beforeDelTownDetail(id);
			if(list!=null&&list.size()>0){
				this.reponseJson("该乡镇已被渠道打标，无法删除！");
			}
			this.reponseJson("ok");
		} catch (Exception e) {
			logger.error("出现异常，验证失败！", e);
			this.reponseJson("验证失败！");
		}
	}
	
    public void isAgentPoint(){
    	String hq_chan_code=request.getParameter("hq_chan_code");
    	Map<String,String> params=new HashMap<String,String>();
    	params.put("hq_chan_code", hq_chan_code);
      	List<Map<String,String>> l=channelResourceService.isAgentPoint(params);
      	if(l!=null&&!l.isEmpty()){
      		this.reponseJson("isAgentPoint");
      	}
      	this.reponseJson("notAgentPoint");
    }
    
    public void isHavingMark(){
    	String type=request.getParameter("type");
    	String hq_chan_code=request.getParameter("hq_chan_code");
    	Map<String,String> params=new HashMap<String,String>();
    	params.put("hq_chan_code", hq_chan_code);
    	params.put("type", type);
      	List<Map<String,String>> l=channelResourceService.isHavingMark(params);
      	if(l!=null&&!l.isEmpty()){
      		this.reponseJson("notHavingMark");
      	}
      	this.reponseJson("isHavingMark");
    }
    
    public void count(){
    	Map<String, Object> params = new HashMap<String,Object>();
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String orgCode = org.getCode();
		String orgLevel = org.getOrgLevel();
		params.put("orgCode", orgCode);
		params.put("orgLevel",orgLevel);
		int count = channelResourceService.count(params);
		this.reponseJson(count);
    }
    
    public void fymark() {
		Map m = new HashMap<String, String>();
		try {
			String hq_chan_code = request.getParameter("hq_chan_code");
			String type = request.getParameter("type");
			Map<String,Object> params=new HashMap<String,Object>();
			params.put("hq_chan_code", hq_chan_code);
			params.put("type", type);
			channelResourceService.fymark(params);
			m.put("msg", "操作成功！");
			m.put("state", "1");
		} catch (Exception e) {
			logger.error("出现异常，操作失败！", e);
			m.put("state", "0");
			m.put("msg", "出现异常,操作失败！");
		}
		this.reponseJson(m);
	}
    
	public Map<String, String> getResultMap() {
		return resultMap;
	}

	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}

	public String getOrgId() {
		return orgId;
	}

	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}

	public String getOrgLevel() {
		return orgLevel;
	}

	public void setOrgLevel(String orgLevel) {
		this.orgLevel = orgLevel;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

}
