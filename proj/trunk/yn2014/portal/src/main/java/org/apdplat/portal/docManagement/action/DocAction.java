package org.apdplat.portal.docManagement.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.sql.Timestamp;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.apache.struts2.ServletActionContext;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.docManagement.service.DocService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;


/**
 * 文件管里
 * @author lyz
 *
 */
@SuppressWarnings("serial")
@Controller
@Scope("prototype")
public class DocAction extends BaseAction {

	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private DocService service;
	
	
	
	
	/**
	 * 获取文件列表
	 */
	public void listDocs() {
		Object list = service.listDocs(resultMap);
		this.reponseJson(list);
	}
	/**
	 * 获取文件信息
	 */
	public void getDocById() {
		Object doc = service.getDocById(id);
		this.reponseJson(doc);
	}
	/**
	 * 下载文件
	 * @throws IOException 
	 */
	public void downfile() {
		Map<String,Object> doc=service.getDocById(id);
		File f=new File(this.request.getRealPath(docRoot+doc.get("NEWNAME")));
		HttpServletResponse resp=ServletActionContext.getResponse();
		OutputStream os=null;
		InputStream is=null;
		try{
			os=resp.getOutputStream();
			is=new FileInputStream(f);
			String fileName=(String)doc.get("OLDNAME");
			if(fileName==null||fileName.lastIndexOf(".")<0){
				fileName=fileName+"."+doc.get("CONTENTTYPE");
			}
			if(!fileName.endsWith((String)doc.get("CONTENTTYPE"))){
				fileName=fileName+"."+doc.get("CONTENTTYPE");
			}
			String agent = request.getHeader("User-Agent");
			logger.debug("User-Agent:"+agent);
			boolean isFirefox = (agent != null && agent.indexOf("Firefox") != -1);
			if (!isFirefox) {
				fileName= URLEncoder.encode(fileName, "UTF-8");
			} else {
				fileName= new String(fileName.getBytes("UTF-8"), "ISO-8859-1");
			}
			logger.debug("解码后的文件名："+fileName);
			resp.addHeader("content-disposition", "attachment;filename="+fileName);
			
			byte[] b=new byte[1024];
			int size=is.read(b);
			
			while(size>0){
				os.write(b,0,size);
				size=is.read(b);
			}
		}catch(IOException e){
			e.printStackTrace();
			if(null==os){
				try {
					os=resp.getOutputStream();
				} catch (IOException e1) {}
			}
			try {
				this.response.setContentType("text/html;charset=UTF-8");
				String js="";
				js+="function CloseWebPage(){";
				js+="	 if (navigator.userAgent.indexOf('MSIE') > 0){";
				js+="		if (navigator.userAgent.indexOf('MSIE 6.0') > 0) {";
				js+="			window.opener = null;";
				js+="			window.close();";
				js+="		} else {";
				js+="			window.open('', '_top');";
				js+="			window.top.close();";
				js+="		}";
				//js+="	}else if (navigator.userAgent.indexOf('Firefox') > 0) {";
				//js+=" 		window.location.href = 'about:blank ';";
				js+="	} else {";
				js+="  		window.opener = null;";
				js+="  		window.open('', '_self', '');";
				js+="  		window.close();";
				js+=" 	}";
				js+="}";
				os.write(("<script> "+js+" alert('所下载的附件已经不存在！');CloseWebPage();</script>").getBytes());
			} catch (IOException e1) {}
		}finally{
			if(is!=null){
				try{ is.close();}catch(Exception e1){}
			}
			if(os!=null){
				try{ os.close();}catch(Exception e2){}
			}
		}
	}
	
	public void downDoc(){
		try {
			String docId = request.getParameter("id").trim();
			OutputStream outStream = response.getOutputStream();
			InputStream inStream = null;
			try {
				docId = URLDecoder.decode(docId, "UTF-8");
			} catch (UnsupportedEncodingException e1) {
				e1.printStackTrace();
			}
			Map<String,Object> doc=service.getDocById(id);
			String oldName = (String)doc.get("OLDNAME");
			String newName = (String)doc.get("NEWNAME");
			String ext = (String)doc.get("CONTENTTYPE");
			if(oldName.endsWith("."+ext)) {
			}else {
				oldName = oldName + "." + ext;
			}
			response.setContentType("application/x-msdownload"); 
			response.setHeader("Content-Disposition", "attachment; filename=\"file not find\""); 
			File ff = null; 
			String path = ServletActionContext.getServletContext().getRealPath(docRoot) + "/" + newName;
			try{ 
				ff=new File(path);
				if (ff.exists()) { 
				    long filelength = ff.length(); 
				    inStream=new FileInputStream(path);
				    
				    //设置输出的格式 
				    response.reset(); 
				    response.setContentType("application/x-msdownload"); 
				    response.setContentLength((int)filelength); 
				    response.addHeader("Content-Disposition","attachment; filename=\"" + (new String(oldName.getBytes("gb2312"),"iso8859-1")) + "\""); 
				    //循环取出流中的数据 
				    byte []buffers=new byte[1024];  
					int len=0;  
					while((len=inStream.read(buffers))!=-1){  
						outStream.write(buffers,0,len);  
					} 
			    } 
			} finally{
				if(inStream != null) inStream.close();
				if(outStream != null) outStream.close();
			}
		} catch (NullPointerException e){
			e.printStackTrace();
			logger.error("首页文件下载："+oldName+"("+id+")附件不存在!");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 增加/更新文件
	 */
	public void addDoc() {
		String result="保存成功";
		// 复制文件和删除文件
		if (null == docFile) {
			logger.debug("没有文件上传。");
			result="没有文件上传";
			if(id!=null){
				Map<String, Object> doc=service.getDocById(id);
				Map<String, Object> params=new HashMap<String,Object>();
				params.put("oldName",oldName0 );
				params.put("newName",doc.get("NEWNAME") );
				params.put("description",description);
				params.put("contentType",doc.get("CONTENTTYPE") );
				params.put("creator",UserHolder.getCurrentLoginUser().getRealName());
				params.put("sizeString",doc.get("SIZESTRING"));
				params.put("createTime",new Timestamp(new Date().getTime()) );
				params.put("isValid",isValid);
				params.put("id",id);
				if(service.updateDoc(params)<=0){
					result="更新失败！";
				}
			}
			//更新isValid、description、oldName0
		} else {
			String suffix=oldName.substring(oldName.lastIndexOf("."));
			if(suffix.startsWith(".")){
				suffix=suffix.substring(1);
			}
			String url=UUID.randomUUID().toString()+"."+suffix;
			File destFile=new File(ServletActionContext.getServletContext().getRealPath(docRoot+url));
			try {
				FileUtils.copyFile(docFile, destFile);
			} catch (IOException e) {
				e.printStackTrace();
			}
			
			Map<String, Object> params=new HashMap<String,Object>();
			if(oldName0!=null&&!oldName0.trim().equals("")){
				params.put("oldName",oldName0 );
			}else{
				params.put("oldName",oldName );
			}
			
			params.put("newName",url );
			params.put("description",description );
			params.put("contentType",suffix );
			params.put("creator",UserHolder.getCurrentLoginUser().getRealName());
			params.put("sizeString",toFileSizeString(docFile.length()));
			params.put("createTime",new Timestamp(new Date().getTime()) );
			params.put("isValid",isValid);
			
			if(id==null||id.trim().equals("")){
				params.put("id",UUID.randomUUID().toString().replaceAll("-", ""));
				if(service.addDoc(params)<=0){
					result="添加失败！";
				}
			}else{
				params.put("id",id);
				//更新前删除现在已经删除的原有文件
				Map<String,Object> oldDoc=service.getDocById(id);
				if(null!=oldDoc){
					String oldUrl=(String)oldDoc.get("NEWNAME");
					deleteFile(docRoot+oldUrl);
				}
				////////////////////////
				if(service.updateDoc(params)<=0){
					result="更新失败！";
				}
			}
			
		}
		logger.debug("文件名："+oldName);
		logger.debug("路径："+docRoot);
		try {
			this.response.getWriter().write("<script> var r='"+result+"'; alert(r);parent.location.reload();</script>");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	/**
	 * 删除公告
	 */
	public void delDoc() {
		if(null!=id){
			//删除文件
			Map<String,Object> doc=service.getDocById(id);
			if(doc!=null){
				String url=docRoot+doc.get("NEWNAME");
				deleteFile(url);
			}
			//删除数据库
			int r=service.delDoc(id);
			Map<String, Boolean> result=new HashMap<String, Boolean>();
			if(r>0){
				result.put("ok", true);
			}else{
				result.put("ok", false);
			}
			this.reponseJson(result);
		}
	}
	private void deleteFile(String url){
		if(url==null||url.trim().equals("")){
			return;
		}
		String realPath=this.request.getRealPath(url);
		logger.debug("删除文件："+realPath);
		File f=new File(realPath);
		try{
			f.delete();
		}catch(Exception e){
			
		}
	}
	private  String toFileSizeString(double fileSize)
	{
		String unit="B";
		double size=0.0d;
		size=fileSize<0?0:fileSize;
		if(fileSize>=1024){
			unit="KB";
			size=fileSize/1024;
		}
		if(fileSize>=1024*1024){
			unit="MB";
			size=fileSize/(1024*1024);
		}
		if(fileSize>=1024*1024*1024){
			unit="GB";
			size=fileSize/(1024*1024*1024);
		}
		if(fileSize>=1024*1024*1024*1024d){
			unit="TB";
			size=fileSize/(1024*1024*1024*1024);
		}
		return new DecimalFormat("#0.0").format(size)+" "+unit;
	}
	private final String docRoot="/upload/docs/";
	private Map<String, String> resultMap;
	private String id;
	private String oldName;
	private String newName;
	private String description;
	private String contentType;
	private String isValid;
	private File docFile;
	private String oldName0;




	public String getOldName0() {
		return oldName0;
	}
	public void setOldName0(String oldName0) {
		this.oldName0 = oldName0;
	}
	public Map<String, String> getResultMap() {
		return resultMap;
	}
	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getOldName() {
		return oldName;
	}
	public void setOldName(String oldName) {
		this.oldName = oldName;
	}
	public String getNewName() {
		return newName;
	}
	public void setNewName(String newName) {
		this.newName = newName;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getContentType() {
		return contentType;
	}
	public void setContentType(String contentType) {
		this.contentType = contentType;
	}
	public String getIsValid() {
		return isValid;
	}
	public void setIsValid(String isValid) {
		this.isValid = isValid;
	}
	public File getDocFile() {
		return docFile;
	}
	public void setDocFile(File docFile) {
		this.docFile = docFile;
	}
}
