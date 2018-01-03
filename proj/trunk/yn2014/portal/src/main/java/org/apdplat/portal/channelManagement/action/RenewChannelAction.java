package org.apdplat.portal.channelManagement.action;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.sql.DataSource;

import org.apache.struts2.convention.annotation.Namespace;
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.portal.channelManagement.service.RenewChannelService;
import org.apdplat.portal.common.util.UUIDGeneratorUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

@SuppressWarnings("serial")
@Controller
@Namespace("/channel")
@Scope("prototype")
public class RenewChannelAction extends BaseAction {
	@Autowired
    private RenewChannelService renewChannelService;
	private Map<String, String> resultMap=new HashMap<String,String>();

	public Map<String, String> getResultMap() {
        return resultMap;
    }

    public void setResultMap(Map<String, String> resultMap) {
        this.resultMap = resultMap;
    }

    @Resource
	DataSource dataSource;

	public void list() {
        User user = UserHolder.getCurrentLoginUser();
        Org org = user.getOrg();
        String code = org.getCode();
        resultMap.put("code", code);
        Object result = renewChannelService.list(resultMap);
        this.reponseJson(result);
	}
	
	//根据id查询
	public void findById(){
	    String id=request.getParameter("id");
	    Map<String, Object> map = renewChannelService.findById(id);
	    this.reponseJson(map);
	}
	
	//续签
	public void renew(){
	    User user = UserHolder.getCurrentLoginUser();
        Org org = user.getOrg();
        String code = org.getCode();
        String username=user.getUsername();
        resultMap.put("code", code);
        resultMap.put("username", username);
        String uuid = UUIDGeneratorUtils.getUUID();
        resultMap.put("uuid", uuid);
        try {
            renewChannelService.renew(resultMap);
        } catch (Exception e) {
            this.reponseJson(e.getMessage());
        }
        
	}
	
	//根据多个id查询
	public void findByIds(){
	    String ids=request.getParameter("id");	    
	    ids = "(" + ids + ")";
	    resultMap.put("id", ids);
	    Object map = renewChannelService.findByIds(resultMap);
	    this.reponseJson(map);
	}
	
	//批量续签
	public void renewBatch(){
	    User user = UserHolder.getCurrentLoginUser();
	    String username=user.getUsername();
	    String param=request.getParameter("param");
	    Connection conn=null;
	    try {
            conn=this.getCon();
            conn.setAutoCommit(false);
            String sql = "INSERT INTO PMRT.TAB_MRT_YSDZ_NEW_CHANL         "+
                        "(GROUP_ID_1,GROUP_ID_1_NAME,HQ_CHAN_CODE,HQ_CHAN_NAME,ADD_STATE,  "+
                        "RENEW_STATE,CREATE_TIME,START_MONTH,IS_VALID,USERNAME,ID,HZ_YEAR,          "+
                        "END_MONTH,ASSESS_TARGET,RATE_THREE,  "+
                        "RATE_SIX,RATE_NINE,RATE_TWELVE,YSDZ_XS,ZX_BT,HZ_MS,FW_FEE) "+
                        "SELECT GROUP_ID_1,GROUP_ID_1_NAME,HQ_CHAN_CODE,HQ_CHAN_NAME,ADD_STATE, "+
                        "1,sysdate,START_MONTH,1,'"+username+"',?,?,?,?,?,?,?,?,?,?,?,? "+
                        "FROM PMRT.TAB_MRT_YSDZ_NEW_CHANL WHERE ID = ? ";
            PreparedStatement pre = conn.prepareStatement(sql);
            for (String params: param.split("\\|")){
                String [] s=params.split(",");
                for(int i=0;i<s.length;i++){
                    if(i==0){
                        String uuid = UUIDGeneratorUtils.getUUID();
                        pre.setString(i+1, uuid);
                        int hz_year=Integer.parseInt(s[i])+1;
                        pre.setString(i+2, Integer.toString(hz_year));
                    }else if(i==1){
                        String end_month = s[i].substring(0, 4);
                        int endMonth=Integer.parseInt(end_month.substring(0, 4))+1;
                        end_month=endMonth+end_month.substring(4);
                        pre.setString(i+2, end_month);
                    }else{
                        pre.setString(i+2, s[i]);
                    }
                }
                pre.addBatch();
            }
            pre.executeBatch();
            conn.commit();
            conn.setAutoCommit(true);
        } catch (Exception e) {
            e.printStackTrace();
            try {
                conn.rollback();
            } catch (Exception e1) {
                e1.printStackTrace();
            }
            this.reponseJson( e.getMessage());
        } finally{
            try {
                if(conn!=null){
                    conn.setAutoCommit(true);
                    conn.close();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
	}
}
