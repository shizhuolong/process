package org.apdplat.portal.personManagement.action;

import java.io.File;
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
import org.apdplat.portal.channelManagement.service.MagPersonService;
import org.apdplat.portal.contract.service.ContractProcessService;
import org.apdplat.portal.personManagement.service.HallMagPersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

@SuppressWarnings("serial")
@Controller
@Namespace("/personManagement")
@Scope("prototype")
public class HallMagPersonAction extends BaseAction {
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
    @Resource
    DataSource dataSource;
	@Autowired
	private HallMagPersonService magPersonService;

	private Map<String, String> resultMap;
	
	private File uploadFile;
    private String isHavingFile;

	public void queryMagPerson() {
	    User user = UserHolder.getCurrentLoginUser();
	    Org org = user.getOrg();
	    String region = org.getRegionCode();
	    String hrId=user.getHrId();
	    String orglevel = org.getOrgLevel();
	    String sql = "SELECT * FROM PCDE.TAB_CDE_YYT_PERSON_MON T "
	            + " WHERE T.F_HR_ID = '"+hrId+"'";
	    List<Map<String, Object>> list = query(sql);
	    if(list!=null&&list.size()>0){
        }else{
            hrId = null;
        }
	    resultMap.put("region", region);
	    resultMap.put("hrId", hrId);
	    resultMap.put("orglevel", orglevel);
		Object result = magPersonService.queryMagPerson(resultMap);
		this.reponseJson(result);
	}
	
	public void save(){
	    User user = UserHolder.getCurrentLoginUser();
        String username=user.getUsername();
		Map<String,String> m=new HashMap<String,String>();
		String chooseMonth = request.getParameter("chooseMonth").trim();
		String hq_chan_code = request.getParameter("hq_chan_code").trim();
		String hq_chan_name = request.getParameter("hq_chan_name").trim();
		String hr_id = request.getParameter("hr_id").trim();
		String name = request.getParameter("name").trim();
		String f_hr_id = request.getParameter("f_hr_id").trim();
		String f_user_name = request.getParameter("f_user_name").trim();
		Integer lev = 2;
		if(hr_id.equals(f_hr_id)){
		    lev = 1;
		}
		m.put("chooseMonth", chooseMonth);
		m.put("hq_chan_code", hq_chan_code);
		m.put("hq_chan_name", hq_chan_name);
		m.put("hr_id", hr_id);
		m.put("name", name);
		m.put("f_hr_id", f_hr_id);
		m.put("f_user_name", f_user_name);
		m.put("lev", lev.toString());
		m.put("username", username);
		//营业员在不在别的厅
		String sql = "SELECT HR_ID FROM PCDE.TAB_CDE_YYT_PERSON_MON T  "+
		             " WHERE T.HR_ID='"+hr_id+"'"+
		             " AND T.DEAL_DATE="+chooseMonth;
		String sql1 = " SELECT F_HR_ID FROM PCDE.TAB_CDE_YYT_PERSON_MON T "+
                " WHERE T.DEAL_DATE= "+chooseMonth
                +" AND T.F_HR_ID='"+f_hr_id+"' "
                +" AND T.HQ_CHAN_CODE<>'"+hq_chan_code+"' ";
		List<Map<String, Object>> list = query(sql);
		if(list!=null&&list.size()>0){
		    this.reponseJson("营业员已经存在，不能重复添加！");
		}else{
		    List<Map<String, Object>> list1 = query(sql1);
		    if(list1!=null&&list1.size()>0){
		        this.reponseJson("厅主任已经是其他厅的厅主任，不能重复添加！");
		    }else{
        		try {
        			magPersonService.insertToResult(m);
        			this.reponseJson("新增成功");
        		} catch (Exception e) {
        			this.reponseJson("新增失败");
        		}
		    }
		}
	}
	
	public void update(){
	    User user = UserHolder.getCurrentLoginUser();
        String userName=user.getUsername();
        Map<String,String> m=new HashMap<String,String>();
        String chooseMonth= request.getParameter("chooseMonth");
        String f_hr_id = request.getParameter("f_hr_id").trim();
        String hq_chan_code = request.getParameter("hq_chan_code").trim();
        String hr_id = request.getParameter("hr_id").trim();
        String hrId = request.getParameter("hrId").trim();
        Integer lev = 2;
        if(hr_id.equals(f_hr_id)){
            lev = 1;
        }
        m.put("chooseMonth",chooseMonth);
        m.put("hr_id",hr_id);
        m.put("hq_chan_code",hq_chan_code);
        m.put("hq_chan_name",request.getParameter("hq_chan_name").trim());
        m.put("hr_name",request.getParameter("hr_name").trim());
        m.put("f_user_name",request.getParameter("f_user_name").trim());
        m.put("f_hr_id",f_hr_id);
        m.put("userName",userName);
        m.put("lev", lev.toString());
        m.put("hrId", hrId);
        String sql = " SELECT F_HR_ID FROM PCDE.TAB_CDE_YYT_PERSON_MON T "+
                     " WHERE T.DEAL_DATE= "+chooseMonth
                     +" AND T.F_HR_ID='"+f_hr_id+"' "
                     +" AND T.HQ_CHAN_CODE<>'"+hq_chan_code+"' ";
        String sql1 = " SELECT HR_ID FROM PCDE.TAB_CDE_YYT_PERSON_MON T "+
                " WHERE T.DEAL_DATE= "+chooseMonth
                +" AND T.HR_ID='"+hr_id+"' ";
        List<Map<String, Object>> list = query(sql);
        List<Map<String, Object>> list1 = null;
        if(!(hrId.equals(hr_id))){
            list1 = query(sql1);
        }
        if(list!=null&&list.size()>0){
            this.reponseJson("厅主任已经在其他厅，修改失败！");
        }else if(list1!=null&&list1.size()>0){
            this.reponseJson("营业员已经存在，修改失败！");
        }else{
            try {
                magPersonService.updateToResult(m);
                this.reponseJson("修改成功");
            } catch (Exception e) {
                this.reponseJson("修改失败");
            }
        }
        
    }
	
	public void delMagPerson(){
		Map<String, String> m=new HashMap<String,String>();
		m.put("hr_id",request.getParameter("hr_id"));
		m.put("chooseMonth",request.getParameter("chooseMonth"));
		m.put("hq_chan_code",request.getParameter("hq_chan_code"));
		try {
		    magPersonService.del(m);
		} catch (Exception e) {
			e.printStackTrace();
			this.reponseJson("删除失败！");
		}
		this.reponseJson("删除成功！");
	}
	
	
	public List<Map<String, Object>> query(String sql) {
        Map<String, String> params = new HashMap<String, String>();
        params.put("sql", sql);
        return magPersonService.query(params);
    }
   
	public Map<String, String> getResultMap() {
		return resultMap;
	}

	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}
	
	public File getUploadFile() {
        return uploadFile;
    }

    public void setUploadFile(File uploadFile) {
        this.uploadFile = uploadFile;
    }

    public String getIsHavingFile() {
        return isHavingFile;
    }

    public void setIsHavingFile(String isHavingFile) {
        this.isHavingFile = isHavingFile;
    }
	
	public void listPerson() {
        User user = UserHolder.getCurrentLoginUser();
        Org org = user.getOrg();
        String region = org.getRegionCode();
        String hrId=user.getHrId();
        String orglevel = org.getOrgLevel();
        resultMap.put("region", region);
        resultMap.put("hrId", hrId);
        resultMap.put("orglevel", orglevel);
        Object result = magPersonService.listPerson(resultMap);
        this.reponseJson(result);
    }
	
	/**
     * 提交审批 
     */
    public void doSubmitTask() {
        ResultInfo info = new ResultInfo();
        try {
            String theme = request.getParameter("theme");
            String nextDealer = request.getParameter("nextDealer");
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
            magPersonService.doSendOrder(map);
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
            Object result = magPersonService.listByWorkNo(resultMap);
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
        List<Map<String,Object>> fileInformation = magPersonService.queryFiles(businessKey);
        this.reponseJson(fileInformation);
    }
    
    
}
