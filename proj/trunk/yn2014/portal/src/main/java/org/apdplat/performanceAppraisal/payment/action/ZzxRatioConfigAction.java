package org.apdplat.performanceAppraisal.payment.action;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.performanceAppraisal.payment.service.ZzxRatioConfigService;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 专租线提成系数配置
 * @author shizl
 *
 */
@SuppressWarnings("serial")
public class ZzxRatioConfigAction extends BaseAction {
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private ZzxRatioConfigService zzxRatioConfigService;
	private String orgLevel;
	private String code;
	
	public void list() {
		try {
			String orgLevel = request.getParameter("orgLevel");
			String code = request.getParameter("code");
			Map<String,Object> m=new HashMap<String,Object>();
			m.put("orgLevel",orgLevel);
			m.put("code",code);
			List<Map<String,Object>> result = zzxRatioConfigService.list(m);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询专租线提成系数信息失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询专租线提成系数信息失败\"}");
		}
	}
	public void update() {
		try {
			String group_id_1 = request.getParameter("group_id_1");
			String ratio = request.getParameter("ratio");
			Map<String,Object> m=new HashMap<String,Object>();
			m.put("group_id_1",group_id_1);
			m.put("ratio",ratio);
			zzxRatioConfigService.update(m);
			this.reponseJson("操作成功");
		} catch (Exception e) {
			logger.error("修改专租线提成系数信息失败",e);
			this.reponseJson("修改专租线提成系数信息失败");
		}
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
