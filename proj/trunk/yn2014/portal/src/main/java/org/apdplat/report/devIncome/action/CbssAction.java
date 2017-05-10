package org.apdplat.report.devIncome.action;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.sql.DataSource;

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
	
	private String channel_id="";
    private String dataString="";
    
	public void save(){
		Map<String,Object> result=new HashMap<String,Object>();
		String sql="";
		try {
			String[] data=dataString.split(",");
			for(int i=0;i<data.length;i++){
				String[] s=data[i].split("-");
				sql="UPDATE PMRT.TAB_MRT_TS_R_CBSS_2CFP SET JF_2CFP='"+s[1].trim()+
						"' WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(SYSDATE,-1),'YYYYMM') AND "
						+ "CHANNEL_ID='"+channel_id+"' AND USER_CODE='"+s[0].trim()+"'";
				SpringManager.getUpdateDao().update(sql);
			}
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

	public String getDataString() {
		return dataString;
	}

	public void setDataString(String dataString) {
		this.dataString = dataString;
	}
	
	public static void main(String[] args) {
	  String s="a,b,c";
	  String[] ss=s.split(",");
	  System.out.println(Arrays.toString(ss));
	}
}
