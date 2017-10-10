package org.apdplat.report.devIncome.action;

import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.platform.action.BaseAction;
import org.apdplat.report.devIncome.dao.CommanDao;
import org.apdplat.report.devIncome.service.ReportService;
import org.apdplat.report.util.ExcelUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

/**
 * 报表
 * 
 * @author lyz
 *
 */
@SuppressWarnings("serial")
@Controller
@Scope("prototype")
public class ReportAction extends BaseAction {
	@Autowired
	private ReportService service;
	@Autowired
	private CommanDao db;

	/**
	 * 公用查询
	 * 
	 * @param params
	 * @return
	 */
	public void query() {
		Map<String, String> params = new HashMap<String, String>();
		params.put("sql", sql);
		this.reponseJson(service.query(params));
	}

	/**
	 * 导出
	 * 
	 * @param params
	 * @return
	 */
	public void export() {
		OutputStream os=null;
		try {
			fileName = new String((fileName + ".xls").getBytes("gb2312"),
					"iso8859-1");
			response.reset();
			response.setContentType("application/x-msdownload;charset=utf-8");
			response.addHeader("Content-Disposition", "attachment; filename=\""
					+ fileName + "\"");
			String oneSheet=request.getParameter("oneSheet");
			System.out.println("------------"+oneSheet);

			String[] ts = tableTitle.split("\\|\\|");
			List<String[]> titles = new ArrayList<String[]>();
			for (String s : ts) {
				String[] ss = s.split(",", -1);
				titles.add(ss);
			}
			//List<String[]> datas = db.findList(sql);
			os = response.getOutputStream();
			//ExcelUtil.exportExcel(os, titles, datas);
			if(oneSheet!=null&&oneSheet.equals("true")){
				System.out.println("------------");
				List<String[]> datas=db.findList(sql);
				ExcelUtil.exportExcel(os, titles, datas);;
			}else{
				ExcelUtil.exportPageExcel(os,titles,db,sql);
			}
			os.close();
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			if(os!=null){
				try{ os.close();}catch(Exception e2){}
			}
		}
	}

	private String sql;

	private String tableTitle = "";
	private String fileName = "";

	public String getTableTitle() {
		return tableTitle;
	}

	public void setTableTitle(String tableTitle) {
		this.tableTitle = tableTitle;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String tableName) {
		this.fileName = tableName;
	}

	public String getSql() {
		return sql;
	}

	public void setSql(String sql) {
		this.sql = sql;
	}
}
