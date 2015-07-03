package org.apdplat.wgreport.action;

import java.util.ArrayList;
import java.util.List;




import org.apache.struts2.convention.annotation.Namespace;
import org.apdplat.wgreport.util.DbHelper;
import org.apdplat.wgreport.util.JSONUtil;
import org.apdplat.wgreport.util.Struts2Utils;
import org.springframework.stereotype.Controller;

import com.opensymphony.xwork2.ActionSupport;

@Controller
public class PublicAction extends ActionSupport {
	private String sql = "";
	
	/**
	 * 查询sql，返回list的JSON
	 */
	public String queryList(){
		System.out.println("***********public actin***********");
		System.out.println("sql*******"+sql);
		List result = new ArrayList();
		result = DbHelper.getBySQL(sql, "");
		String json = JSONUtil.toJson(result);
		Struts2Utils.renderJson(json, "no-cache");
		return null;
	}
	
	public String getSql() {
		return sql;
	}
	public void setSql(String sql) {
		this.sql = sql;
	}

}
