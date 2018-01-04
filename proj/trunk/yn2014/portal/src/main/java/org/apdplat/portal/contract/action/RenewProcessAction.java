package org.apdplat.portal.contract.action;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.sql.DataSource;

import org.apache.commons.lang3.StringUtils;
import org.apache.struts2.convention.annotation.Namespace;
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.exception.BusiException;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.platform.util.ResultInfo;
import org.apdplat.portal.common.util.UUIDGeneratorUtils;
import org.apdplat.portal.contract.service.RenewProcessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

@SuppressWarnings("serial")
@Controller
@Namespace("/renew")
@Scope("prototype")
public class RenewProcessAction extends BaseAction {
	@Autowired
    private RenewProcessService service;
	@Resource
	DataSource dataSource;
	
	private Map<String, String> resultMap=new HashMap<String,String>();
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	private String isHavingFile;

	public void list() {
        User user = UserHolder.getCurrentLoginUser();
        Org org = user.getOrg();
        String code = org.getCode();
        resultMap.put("code", code);
        Object result = service.list(resultMap);
        this.reponseJson(result);
	}
	
	//根据id查询
	public void findById(){
	    String id=request.getParameter("id");
	    Map<String, Object> map = service.findById(id);
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
        Map<String,String> message=new HashMap<String,String>();
        try {
            service.renew(resultMap);
            message.put("msg", "保存成功！");
            message.put("id", uuid);
            message.put("state", "1");
        } catch (Exception e) {
        	message.put("msg", "保存失败！");
        	 message.put("state", "0");
        }
        this.reponseJson(message);
	}
	
	//根据多个id查询
	public void findByIds(){
	    String ids=request.getParameter("id");	    
	    ids = "(" + ids + ")";
	    resultMap.put("id", ids);
	    Object map = service.findByIds(resultMap);
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
	
	/**
	 * 提交审批 
	 */
	public void doSubmitTask() {
		ResultInfo info = new ResultInfo();
		try {
			String theme = request.getParameter("theme");
			String nextDealer = request.getParameter("nextDealer");
			String id=request.getParameter("id");	
			String type=request.getParameter("type");
			if(StringUtils.isBlank(theme)) {
				throw new BusiException("工单主题不能为空！");
			}
			if(StringUtils.isBlank(nextDealer)) {
				throw new BusiException("请选择下一步审批人！");
			}
			Map<String, String> map = new HashMap<String, String>();
			map.put("title", theme);
			map.put("nextDealer", nextDealer);
			map.put("isHavingFile", isHavingFile);
			map.put("id", id);
			map.put("type", type);
			service.doSendOrder(map);
			info.setCode(ResultInfo._CODE_OK_);
		} catch (BusiException e) {
			logger.error(e.getMessage(), e);
			info.setCode(ResultInfo._CODE_FAIL_);
			info.setMsg(e.getMessage());
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			info.setCode(ResultInfo._CODE_FAIL_);
			info.setMsg("工单提交审批失败！");
		}
		this.reponseJson(info);
	}
	
	//通过工单编号查询列表,用于非发起工单界面
		public void listByWorkNo() {
			try {
				String businessKey = request.getParameter("businessKey");
				if(businessKey == null || "".equals(businessKey)) {
					throw new BusiException("工单编号不空，查询数据失败！");
				}
				
				resultMap.put("businessKey", businessKey);
				Object result = service.listByWorkNo(resultMap);
				this.reponseJson(result);
			} catch(BusiException e) {
				logger.error(e.getMessage(), e);
				outJsonPlainString(response,"{\"msg\":\""+e.getMessage()+"\"}");
			}catch (Exception e) {
				logger.error(e.getMessage(), e);
				logger.error("查询数据失败！",e);
				outJsonPlainString(response,"{\"msg\":\"查询数据失败！\"}");
			}
		}
		
		public void queryFiles(){
			String businessKey=request.getParameter("businessKey");
			List<Map<String,Object>> fileInformation = service.queryFiles(businessKey);
			this.reponseJson(fileInformation);
		}

		public Map<String, String> getResultMap() {
			return resultMap;
		}

		public void setResultMap(Map<String, String> resultMap) {
			this.resultMap = resultMap;
		}

		public String getIsHavingFile() {
			return isHavingFile;
		}

		public void setIsHavingFile(String isHavingFile) {
			this.isHavingFile = isHavingFile;
		}
		
		
		
}
