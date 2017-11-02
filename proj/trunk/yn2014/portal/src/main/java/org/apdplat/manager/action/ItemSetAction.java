package org.apdplat.manager.action;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.struts2.convention.annotation.Namespace;
import org.apdplat.manager.dao.ItemSetDao;
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@SuppressWarnings("serial")
@Controller
@Namespace("/itemSet")
@Scope("prototype")
public class ItemSetAction extends BaseAction {

	@Autowired
	private ItemSetDao dao;
	private String dealDate;
	private String dataString;

	@ResponseBody
	@RequestMapping(value = "/listItem")
	public void listItem() {
		List<Map<String, Object>> list = dao.listItem();
		List<Map<String,Object>> ids=getCheckIds();
		for(Map<String, Object> m:ids){
			for(Map<String, Object> l:list){
				if(l.get("id").equals(m.get("INDEX_ID"))){
					l.put("checked", "true");
					break;
				}
			}
		}
		this.reponseJson(list);
	}

	public void save() {
		Map<String, Object> result = new HashMap<String, Object>();
		Connection conn = null;
		PreparedStatement addpre = null;
		PreparedStatement updatepre = null;
		String fields = "INSERT_TIME,DEAL_DATE,GROUP_ID_1,GROUP_ID_1_NAME,INDEX_ID,INDEX_NAME,KRI_WEIGHT,MIN_PROP,MIN_VALUE,MAX_PROP,MAX_VALUE,FULL_MARKS,UPDATE_TIME,OPERATE_NAME";
		String table = "PMRT.TAB_MRT_INDEX_DEPLOY_MON";
		try {
			User user = UserHolder.getCurrentLoginUser();
			Org org = user.getOrg();
			String username = user.getUsername();
			String group_id_1 = org.getRegionCode();
			String group_id_1_name = org.getRegionName();
			conn = this.getCon();
			String[] data = dataString.split(",");
			String addSql = "INSERT INTO " + table + "(" + fields
					+ ") VALUES(SYSDATE," + dealDate + ",'"
					+ group_id_1 + "','" + group_id_1_name
					+ "',?,?,?,?,?,?,?,?,'','" + username + "')";
			String updateSql = "UPDATE "
					+ table
					+ " SET KRI_WEIGHT=?,MIN_PROP=?,MIN_VALUE=?,MAX_PROP=?,MAX_VALUE=?,FULL_MARKS=?,UPDATE_TIME=SYSDATE,OPERATE_NAME='"
					+ username + "' WHERE DEAL_DATE=" + dealDate
					+ " AND GROUP_ID_1='" + group_id_1
					+ "' AND INDEX_ID=?";
			addpre = conn.prepareStatement(addSql);
			updatepre = conn.prepareStatement(updateSql);
			for (int i = 0; i < data.length; i++) {
				String[] s = data[i].split("\\|");
				if (s[0].equals("add")) {
					addpre.setString(1, s[1].trim());
					addpre.setString(2, s[2].trim());
					addpre.setString(3, s[3].trim() + "%");
					addpre.setString(4, s[4].trim() + "%");
					addpre.setString(5, s[5].trim());
					addpre.setString(6, s[6].trim() + "%");
					addpre.setString(7, s[7].trim());
					addpre.setString(8, s[8].trim());
					addpre.addBatch();
				} else {
					updatepre.setString(1, s[3].trim() + "%");
					updatepre.setString(2, s[4].trim() + "%");
					updatepre.setString(3, s[5].trim());
					updatepre.setString(4, s[6].trim() + "%");
					updatepre.setString(5, s[7].trim());
					updatepre.setString(6, s[8].trim());
					updatepre.setString(7, s[1].trim());
					updatepre.addBatch();
				}
			}
			addpre.executeBatch();
			updatepre.executeBatch();
			conn.commit();
			conn.setAutoCommit(true);
			addpre.clearBatch();
			updatepre.clearBatch();
			result.put("ok", "true");
			result.put("msg", "保存成功！");
		} catch (Exception e) {
			result.put("ok", "false");
			result.put("msg", "出现异常，保存失败！");
			e.printStackTrace();
		} finally {
			try {
				if (conn != null)
					conn.close();
				if (addpre != null)
					addpre.close();
				if (updatepre != null)
					updatepre.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		this.reponseJson(result);
	}

	public List<Map<String, Object>> getCheckIds(){
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String group_id_1 = org.getRegionCode();
		Map<String,Object> m=new HashMap<String,Object>();
		m.put("group_id_1", group_id_1);
		m.put("dealDate", dealDate);
		List<Map<String, Object>> ids = dao.getCheckIds(m);
		return ids;
	}
	
	public void del(){
		Map<String, Object> result = new HashMap<String, Object>();
		try {
			User user = UserHolder.getCurrentLoginUser();
			Org org = user.getOrg();
			String group_id_1 = org.getRegionCode();
			Map<String,Object> m=new HashMap<String,Object>();
			String id=request.getParameter("id");
			m.put("group_id_1", group_id_1);
			m.put("dealDate", dealDate);
			m.put("id", id);
			dao.delete(m);
			result.put("msg", "删除成功！");
		} catch (Exception e) {
			result.put("msg", "删除失败！");
		}
		
		this.reponseJson(result);
	}
	
	public String getDealDate() {
		return dealDate;
	}
   
	public void setDealDate(String dealDate) {
		this.dealDate = dealDate;
	}

	public String getDataString() {
		return dataString;
	}

	public void setDataString(String dataString) {
		this.dataString = dataString;
	}

}
