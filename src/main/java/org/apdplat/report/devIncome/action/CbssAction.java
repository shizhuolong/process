package org.apdplat.report.devIncome.action;

import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;
import javax.annotation.Resource;

import org.apache.struts2.convention.annotation.Namespace;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.wgreport.common.SpringManager;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

@SuppressWarnings("serial")
@Controller
@Namespace("/cbss")
@Scope("prototype")
public class CbssAction extends BaseAction {
 
	@Resource
	DataSource dataSource;
	
	private String channel_id;
    private String user_code;
    private String jf_2cfp;
    
	public void save(){
		Map<String,Object> result=new HashMap<String,Object>();
		try {
			String sql="UPDATE PMRT.TAB_MRT_TS_R_CBSS_2CFP SET JF_2CFP='"+jf_2cfp+
					"' WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(SYSDATE,-1),'YYYYMM') AND "
					+ "CHANNEL_ID='"+channel_id+"' AND USER_CODE='"+user_code+"'";
			SpringManager.getUpdateDao().update(sql);
			result.put("ok", "true");
			result.put("msg", "修改成功！");
		} catch (Exception e) {
			result.put("ok", "false");
			result.put("msg", "出现异常，修改失败！");
			e.printStackTrace();
		}
		this.reponseJson(result);
	}

	public String getChannel_id() {
		return channel_id;
	}

	public void setChannel_id(String channel_id) {
		this.channel_id = channel_id;
	}

	public String getUser_code() {
		return user_code;
	}

	public void setUser_code(String user_code) {
		this.user_code = user_code;
	}

	public String getJf_2cfp() {
		return jf_2cfp;
	}

	public void setJf_2cfp(String jf_2cfp) {
		this.jf_2cfp = jf_2cfp;
	}

	
}
