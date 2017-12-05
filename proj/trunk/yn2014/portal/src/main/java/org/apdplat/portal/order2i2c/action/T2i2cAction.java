package org.apdplat.portal.order2i2c.action;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.HashMap;
import java.util.Map;

import org.apache.struts2.convention.annotation.Namespace;
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.order2i2c.OrderUtil;
import org.apdplat.portal.order2i2c.model.DisDto;
import org.apdplat.portal.order2i2c.model.TeamOrderRalation;
import org.apdplat.portal.order2i2c.service.T2I2CService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.lch.report.util.JsonUtil;

@SuppressWarnings("serial")
@Controller
@Namespace("/t2i2c")
@Scope("prototype")
public class T2i2cAction extends BaseAction{
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	@Autowired
	private T2I2CService t2I2CService;
	private Map<String, String> resultMap;
	
	private String workNo;
	private String pId;
	
	private String jsonStr;
	
	
	public String getJsonStr() {
		return jsonStr;
	}
	public void setJsonStr(String jsonStr) {
		this.jsonStr = jsonStr;
	}
	public String getpId() {
		return pId;
	}
	public void setpId(String pId) {
		this.pId = pId;
	}
	public Map<String, String> getResultMap() {
		return resultMap;
	}
	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}
	public String getWorkNo() {
		return workNo;
	}
	public void setWorkNo(String workNo) {
		this.workNo = workNo;
	}
	/**
	 * 查询未分配订单列表
	 */
	public void undistributedOrderList(){
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String regionCode=org.getRegionCode();
		resultMap.put("regionCode", regionCode);
		this.reponseJson(t2I2CService.undistributedOrderList(resultMap));
	}
	public void topList(){
        User user = UserHolder.getCurrentLoginUser();
        Org org = user.getOrg();
        String regionCode=org.getRegionCode();
        resultMap.put("regionCode", regionCode);
        this.reponseJson(t2I2CService.undistributedOrderList(resultMap));
    }
	/**
	 * 查询任务明细
	 */
	public void taskListDetail(){
		this.reponseJson(t2I2CService.taskListDetail(resultMap));
	}
	/**
	 * 地市分配任务
	 */
	public void regionDistribute(){
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		
		Map<String,Object> r=new HashMap<String,Object>();
		logger.info(jsonStr);
		DisDto dto=JsonUtil.jsonToBean(jsonStr, DisDto.class);
		if(dto==null||dto.getDis()==null||dto.getDis().size()==0){
			r.put("ok", false);
			r.put("msg", "分配数据为空！");
			this.reponseJson(r);
			return ;
		}
		
		dto.setTaskNo(OrderUtil.randomTaskNo());
		dto.setTaskTitle(OrderUtil.getTaskTitle(org.getRegionName()));

		Connection conn = null;
		PreparedStatement pre = null;
		try {
			conn = this.getCon();
			conn.setAutoCommit(false);
			String workSql="insert into PODS.TAB_ODS_2I2C_ASS_TASK select sysdate,?,?,?,?,?,?,? from dual";
 			pre=conn.prepareStatement(workSql);
			pre.setString(1, dto.getTaskNo());
			pre.setString(2, dto.getTaskTitle());
			pre.setString(3, dto.getDisType());
			pre.setString(4, dto.getDisValue());
			pre.setString(5,org.getRegionName());
			pre.setString(6,org.getRegionCode());
			pre.setString(7,user.getUsername());
			pre.addBatch();
			pre.executeBatch();
			
			String 	detailSql=" insert into PODS.TAB_ODS_2I2C_ASS_TASK_DETAIL  ";
					detailSql+=" select sys_guid(),?,?,te.f_id,(select tee.name from TAB_PORTAL_2I2C_TEAM tee where tee.id = te.f_id),te.id,te.name ";
					detailSql+=" from TAB_PORTAL_2I2C_TEAM te where te.id = ? ";
			
			pre=conn.prepareStatement(detailSql);
			
			for(TeamOrderRalation dis:dto.getDis()){
				pre.setString(1, dto.getTaskNo());
				pre.setString(2, dis.getOrderNo());
				pre.setString(3, dis.getTeamId());
				pre.addBatch();
			}
			pre.executeBatch();
			
			conn.commit();
			r.put("ok", true);
			r.put("msg", "分配成功");
		} catch (Exception e) {
			e.printStackTrace();
			try{conn.rollback();}catch(Exception ee){}
			
			r.put("ok", false);
			r.put("msg", "分配失败");
		}finally{
			try {
				if(conn!=null)
				conn.setAutoCommit(true);
				conn.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		this.reponseJson(r);
	}
	/**
	 * 查询团队
	 */
	public void getTeamByParentId(){
		if(null==pId||pId.trim().equals("")) pId="-1";
		
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String regionCode=org.getRegionCode();
		
		this.reponseJson(t2I2CService.getTeamByParentId(pId,regionCode));
	}
	/**
	 * 查询团队
	 */
	public void getTeamByWorkNo(){
		this.reponseJson(t2I2CService.getTeamByWorkNo(workNo));
	}
}
