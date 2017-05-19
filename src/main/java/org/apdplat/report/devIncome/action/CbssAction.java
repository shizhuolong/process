package org.apdplat.report.devIncome.action;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.sql.DataSource;

import org.apache.struts2.convention.annotation.Namespace;
import org.apdplat.platform.action.BaseAction;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

@SuppressWarnings("serial")
@Controller
@Namespace("/cbss")
@Scope("prototype")
public class CbssAction extends BaseAction {
 
	private String channel_id="";
    private String dataString="";
    
	public void save(){
		Map<String,Object> result=new HashMap<String,Object>();
		Connection conn = null;
		PreparedStatement pre = null;
		try {
			conn = this.getCon();
			String[] data=dataString.split(",");
			String sql="UPDATE PMRT.TAB_MRT_TS_R_CBSS_2CFP SET JF_2CFP=?"+
					" WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(SYSDATE,-1),'YYYYMM') AND "+
					 "CHANNEL_ID='"+channel_id+"' AND USER_CODE=?";
			pre=conn.prepareStatement(sql);
			for(int i=0;i<data.length;i++){
				String[] s=data[i].split("\\|");
				pre.setString(1,s[1].trim());
				pre.setString(2,s[0].trim());
				pre.addBatch();
			}
			pre.executeBatch();
			conn.commit();
			conn.setAutoCommit(true);
			result.put("ok", "true");
			result.put("msg", "修改成功！");
		} catch (Exception e) {
			result.put("ok", "false");
			result.put("msg", "出现异常，修改失败！");
			e.printStackTrace();
		}finally{
			try {
				if(conn!=null)
				conn.close();
				if(pre!=null)
				pre.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
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
	
}
