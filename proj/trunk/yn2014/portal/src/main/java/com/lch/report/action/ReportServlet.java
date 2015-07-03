package com.lch.report.action;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;





import com.lch.report.dto.Column;
import com.lch.report.dto.Condition;
import com.lch.report.dto.Equal;
import com.lch.report.dto.Like;
import com.lch.report.dto.Pager;
import com.lch.report.dto.Report;
import com.lch.report.dto.Result;
import com.lch.report.dto.Table;
import com.lch.report.dto.TableNode;
import com.lch.report.dto.TreeAttribute;
import com.lch.report.util.ExcelUtil;
import com.lch.report.util.FileUtil;
import com.lch.report.util.JsonUtil;
import com.lch.report.util.ReportUtil;

public class ReportServlet extends HttpServlet {

	private static final long serialVersionUID = 101010101010101010L;

	@Override
	protected void service(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		req.setCharacterEncoding("UTF-8");
		String action=req.getParameter("action");
		if("dbtree".equals(action)){
			this.getDBTree(req, resp);
		}else if("reporttree".equals(action)){
			this.showReportTree(req, resp);
		}else if("reporttreeadd".equals(action)){
			this.showReportTreeAdd(req, resp);
		}else if("reporttreeedit".equals(action)){
			this.showReportTreeEdit(req, resp);
		}else if("reporttreedel".equals(action)){
			this.showReportTreeDel(req, resp);
		}else if("showreport".equals(action)){
			this.showReport(req, resp);
		}else if("savereport".equals(action)){
			this.saveReport(req, resp);
		}else if("listreport".equals(action)){
			this.listReportData(req, resp);
		}else if("listcolumn".equals(action)){
			this.listColumn(req, resp);
		}else if("downreport".equals(action)){
			this.downReportData(req, resp);
		}else{
			resp.getWriter().println("unresolved action!");
		}
	}
	protected void showReport(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException{
		String id=req.getParameter("id");
		if(id!=null&&!id.trim().equals("")){
			id=URLDecoder.decode(id,"UTF-8");
			Report report=FileUtil.getReport(new File(id));
			req.getSession().setAttribute("report", report);
			req.setAttribute("report", report);
			req.getRequestDispatcher("lchreport/show.jsp").forward(req, resp);
		}else{
			String rStr=req.getParameter("report");
			Report report=JsonUtil.jsonToBean(rStr, Report.class);
			req.getSession().setAttribute("report", report);
			req.setAttribute("report", report);
			req.getRequestDispatcher("lchreport/show.jsp").forward(req, resp);
		}
	}
	protected void saveReport(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException{
		String rStr=req.getParameter("report");
		String id=URLDecoder.decode(req.getParameter("id"),"UTF-8");
		Result r=new Result();
		r.setMsg("");
		r.setOk(FileUtil.saveReport(new File(id), rStr));
		this.reponseJson(r, resp);
	}
	protected void showReportTree(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException{
		String rootPath=req.getSession().getServletContext().getRealPath("lchreport/reports");
		List<TableNode> nodes=new ArrayList<TableNode>();
		String filePath=req.getParameter("id");
		if(filePath==null||filePath.trim().equals("")){
			filePath=rootPath;
		}
		File rootDir=new File(filePath);
		if(rootDir!=null){
			File[] files=rootDir.listFiles();
			if(files!=null){
				for(File file:files){
					TableNode node=new TableNode();
					node.setId(file.getAbsolutePath());
					node.setText(file.getName());
					if(!file.isDirectory()){
						node.setState("open");
					}
					nodes.add(node);
				}
			}
		}
		this.reponseJson(nodes, resp);
	}
	protected void showReportTreeAdd(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException{
		String filePath=req.getParameter("parentId");
		String rootPath=req.getSession().getServletContext().getRealPath("lchreport/reports");
		if(filePath==null||filePath.trim().equals("")||filePath.trim().equals("0")){
			filePath=rootPath;
		}
		File rootDir=new File(filePath);
		TableNode node=new TableNode();
		if(rootDir!=null){
			if(rootDir.isDirectory()){
				int n=1;
				File file=new File(rootDir,"新建报表"+n);
				while(file.exists()){
					n++;
					file=new File(rootDir,"新建报表"+n);
				}
				file.createNewFile();
				node.setId(file.getAbsolutePath());
				node.setText(file.getName());
				node.setState("open");
			}else{
				File newDir=new File(rootDir.getAbsolutePath());
				rootDir.delete();
				newDir.mkdirs();
				int n=1;
				File file=new File(newDir,"新建报表"+n);
				while(file.exists()){
					n++;
					file=new File(newDir,"新建报表"+n);
				}
				file.createNewFile();
				node.setId(file.getAbsolutePath());
				node.setText(file.getName());
				node.setState("open");
			}
		}
		this.reponseJson(node, resp);
	}
	protected void showReportTreeEdit(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException{
		String filePath=req.getParameter("id");
		String text=req.getParameter("text");
		File file=new File(filePath);
		TableNode node=new TableNode();
		if(file!=null){
			File newFile=new File(file.getParentFile(),text);
			file.renameTo(newFile);
			node.setId(file.getAbsolutePath());
			node.setText(file.getName());
		}
		this.reponseJson(node, resp);
	}
	protected void showReportTreeDel(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException{
		String filePath=req.getParameter("id");
		File file=new File(filePath);
		boolean r=false;
		if(file!=null){
			try{
				r=FileUtil.deleteDir(file);
			}catch(Exception e){
				
			}
		}
		this.reponseJson("{\"success\":"+r+"}", resp);
	}
	protected void listColumn(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException{
		String column=req.getParameter("column");
		String table=req.getParameter("table");
		String sql="select distinct \""+column+"\" from "+ table;
		this.reponseJson(ReportUtil.findList(sql), resp);
	}
	protected void listReportData(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException{
		Report report=(Report) req.getSession().getAttribute("report");
		//////////////////////////
		long pageSize=req.getParameter("pageSize")==null?15:Long.parseLong(req.getParameter("pageSize"));
		long pageNumber=req.getParameter("pageNumber")==null?0:Long.parseLong(req.getParameter("pageNumber"));
		
		long start=pageSize*pageNumber;
		long end=pageSize*(pageNumber+1);
		//////////////////////////
		//处理表
		String sql=ReportUtil.getSqlByReport(report, req, resp);
		
		
		List<String[]> tls=ReportUtil.findList("select count(*) from ("+sql+")");
		long total=Long.parseLong(tls.get(0)[0]);
		sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
				+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
		
		
		List<String[]> ls=ReportUtil.findList(sql);
		
		Pager  pager=new Pager();
		pager.setData(ls);
		pager.setTotal(total);
		this.reponseJson(pager, resp);
	}
	protected void downReportData(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException{
		Report report=JsonUtil.jsonToBean(req.getParameter("report"), Report.class);
		//////////////////////////
		//处理表
		String sql=ReportUtil.getSqlByReport(report, req, resp);
		
		OutputStream os=null;
		String fileName="";
		try {
			fileName = new String((report.getName() + ".xls").getBytes("gb2312"),
					"iso8859-1");
			resp.reset();
			resp.setContentType("application/x-msdownload;charset=utf-8");
			resp.addHeader("Content-Disposition", "attachment; filename=\""
					+ fileName + "\"");
			os = resp.getOutputStream();
			
			List<String[]> datas=ReportUtil.findList(sql);
			ExcelUtil.exportExcel(resp.getOutputStream(), report.getTopTitle(), datas);
			os.close();
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			if(os!=null){
				try{ os.close();}catch(Exception e2){}
			}
		}
	}
	protected void getDBTree(HttpServletRequest req, HttpServletResponse resp){
		String id=req.getParameter("id");
		String ownerName=req.getParameter("owner");
		String tableName=req.getParameter("tableName");
		String colName=req.getParameter("colName");
		if(id==null||id.trim().equals("")){
			List<String> owners=ReportUtil.getDbUserNames();
			List<TableNode> ownerNodes=new ArrayList<TableNode>();
			if(null!=owners){
				for(String owner:owners){
					TableNode ownerNode=new TableNode();
					TreeAttribute attr=new TreeAttribute();
					attr.setOwner(owner);
					ownerNode.setId(owner);
					ownerNode.setAttributes(attr);
					ownerNode.setText(owner);
					ownerNodes.add(ownerNode);
				}
			}
			this.reponseJson(ownerNodes, resp);
		}else if(tableName==null||tableName.trim().equals("")){
			List<Table> tables=ReportUtil.getAllTables(id);
			List<TableNode> tbNodes=new ArrayList<TableNode>();
			if(null!=tables){
				for(Table tb:tables){
					TableNode tbNode=new TableNode();
					TreeAttribute attr=new TreeAttribute();
					attr.setOwner(ownerName);
					attr.setTableName(tb.getName());
					tbNode.setAttributes(attr);
					tbNode.setId(tb.getName());
					tbNode.setText((tb.getComments()==null||tb.getComments().equals(""))?tb.getName():tb.getComments());
					tbNode.setState("closed");
					tbNodes.add(tbNode);
				}
			}
			this.reponseJson(tbNodes, resp);
		}else if(colName==null||colName.trim().equals("")){
			List<TableNode> colNodes=new ArrayList<TableNode>();
			Table table=ReportUtil.getTableInfo(tableName, ownerName);
			if(null!=table){
				List<Column> cols=table.getCols();
				if(null!=cols){
					for(Column col:cols){
						TableNode colNode=new TableNode();
						TreeAttribute attr=new TreeAttribute();
						attr.setOwner(table.getOwner());
						attr.setTableName(table.getName());
						attr.setColName(col.getColName());
						colNode.setId(col.getColName());
						colNode.setAttributes(attr);
						colNode.setText((col.getComments()==null||col.getComments().equals(""))?col.getColName():col.getComments());
						colNode.setState("open");
						colNodes.add(colNode);
					}
				}
			}
			this.reponseJson(colNodes, resp);
		}else{
			List<TableNode> colNodes=new ArrayList<TableNode>();
			this.reponseJson(colNodes, resp);
		}
	}
	protected  void reponseJson(Object object,HttpServletResponse response) {
		try {
		String text=JsonUtil.beanToJson(object);
		//设置编码及文件格式   
		response.setContentType("text/html;charset=UTF-8");
		//设置不使用缓存   
        response.setHeader("Cache-Control","no-cache"); 
			response.getWriter().write(text);
			response.getWriter().flush();   
	        response.getWriter().close(); 
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
