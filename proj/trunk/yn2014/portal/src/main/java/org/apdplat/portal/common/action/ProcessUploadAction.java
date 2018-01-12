package org.apdplat.portal.common.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Namespace;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.wgreport.common.SpringManager;
import org.apdplat.platform.log.APDPlatLogger;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;




@SuppressWarnings("serial")
@Controller
@Namespace("/processUpload")
@Scope("prototype")
public class ProcessUploadAction extends BaseAction {
	
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	private List<File> uploadify;//这里的"fileName"一定要与表单中的文件域名相同  
	private List<String> uploadifyContentType;//格式同上"fileName"+ContentType  
	private List<String> uploadifyFileName;//格式同上"fileName"+FileName  
	private String businessKey;
	private String filePath;
	private String jsessionid;
	
	@SuppressWarnings("unused")
	public void upload() throws UnsupportedEncodingException {
		User user = UserHolder.getCurrentLoginUser();
		String username=user.getUsername();
		if(businessKey==null||businessKey=="null"){
			businessKey="";
		}
		//设置接收的编码格式
		request.setCharacterEncoding("UTF-8");
		Date date = new Date();//获取当前时间
		SimpleDateFormat sdfFileName = new SimpleDateFormat("yyyyMMddHHmmss");
		SimpleDateFormat sdfFolder = new SimpleDateFormat("yyMM");
		//String newfileName = sdfFileName.format(date)+RandomUtil.getRandomBySixNum();//文件名称
		String newfileName = sdfFileName.format(date);//文件名称
		String fileRealPath = "";//文件存放真实地址
		String fileRealResistPath = "/upload/process/";//文件存放真实相对路径
		String firstFileName="";
		// 获得容器中上传文件夹所在的物理路径
		String savePath = ServletActionContext.getServletContext().getRealPath(fileRealResistPath);
		System.out.println("路径" + savePath);
		File file = new File(savePath);
		if (!file.isDirectory()) {
			file.mkdir();
		}
		FileOutputStream fos=null;
		FileInputStream fis=null;
		try {
			 List<File> files=getUploadify();  
			 for(int i=0;i<files.size();i++){  
				 firstFileName = getUploadifyFileName().get(i);
				 //String formatName = firstFileName.substring(firstFileName.lastIndexOf("."));//获取文件后缀名
				 fileRealPath = savePath +"/"+newfileName+"-"+firstFileName;//文件存放真实地址
				 //FileOutputStream fos=new FileOutputStream(savePath+"//"+newfileName+ formatName);  
				 fos=new FileOutputStream(fileRealPath);
				 System.out.println("-----------------------");
				 System.out.println(fileRealPath);
				 fis=new FileInputStream(getUploadify().get(i));  
				 byte []buffers=new byte[1024];  
				 int len=0;  
				 while((len=fis.read(buffers))!=-1){  
					 fos.write(buffers,0,len);  
				 } 
				//上传成功，则插入数据库
				if (new File(fileRealPath).exists()) {
					//虚拟路径赋值
					fileRealResistPath +=newfileName+"-"+firstFileName;
					//保存到数据库
					System.out.println("保存到数据库临时表:");
					//System.out.println("虚拟路径:"+fileRealResistPath);
					String uuid=UUID.randomUUID().toString();
					String addSql = "INSERT INTO PORTAL.TAB_INIT_FILE_MSG_TEMP(FILE_ID,INIT_ID,FILE_PATH,FILE_NAME,USERNAME) VALUES('"+uuid+"','"+businessKey+"','"+fileRealResistPath+"','"+firstFileName+"','"+username+"')";
					SpringManager.getUpdateDao().update(addSql);
				}
			 } 
			 this.outJsonPlainString(response,fileRealResistPath);
		}catch (IOException e) {
			e.printStackTrace();
			this.outJsonPlainString(response, "error");
		} finally{
			try {
			    if(fis!=null)
					fis.close();
			    if(fos!=null)
				    fos.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		} 
	}
	
	public void beforeUpload(){
		User user = UserHolder.getCurrentLoginUser();
		String username=user.getUsername();
		try{
		//清空操作人的临时数据
		String delSql="DELETE FROM PORTAL.TAB_INIT_FILE_MSG_TEMP WHERE USERNAME='"+username+"'";
		SpringManager.getUpdateDao().update(delSql);
		this.outJsonPlainString(response, "{\"success\":true}");
		}catch(Exception e) {
			e.printStackTrace();
			this.outJsonPlainString(response, "{\"error\":true}");
		}
	}
	
	public void deleteFile() {
		String path=ServletActionContext.getServletContext().getRealPath("/");
		if(!"".equals(filePath)) {
			try{
				String delTempSql = "DELETE PORTAL.TAB_INIT_FILE_MSG_TEMP WHERE FILE_PATH='"+filePath+"'";
				String delSql = "DELETE PORTAL.TAB_INIT_FILE_MSG WHERE FILE_PATH='"+filePath+"'";
				SpringManager.getUpdateDao().update(delTempSql);
				SpringManager.getUpdateDao().update(delSql);
				//删除服务器上的文件
				File f=new File(path+filePath);
				if(f.exists()){
					f.delete();
				}
				this.outJsonPlainString(response, "{\"success\":true}");
			}catch(Exception e) {
				e.printStackTrace();
				this.outJsonPlainString(response, "{\"error\":true}");
			}
		}
	}
	public void download() throws IOException{
		HttpServletResponse response = ServletActionContext.getResponse();
		String filePath=request.getParameter("filePath");
		String fileName=request.getParameter("fileName");
		OutputStream outStream = null;
		InputStream inStream = null;
    	try {
    		filePath = URLDecoder.decode(filePath, "UTF-8");
    		fileName = URLDecoder.decode(fileName, "UTF-8");
	    	response.setContentType("application/x-msdownload"); 
	    	response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\""); 
	    	File ff = null; 
		    String dd = ServletActionContext.getServletContext().getRealPath(filePath); 
	    	ff=new File(dd);
	    	if (ff.exists()) { 
			    long filelength = ff.length(); 
			    inStream=new FileInputStream(dd);
			    outStream = response.getOutputStream();
			    //设置输出的格式 
			    response.reset(); 
			    response.setContentType("application/x-msdownload"); 
			    response.setContentLength((int)filelength); 
			    response.addHeader("Content-Disposition","attachment; filename=\"" + (new String(fileName.getBytes("gb2312"),"iso8859-1")) + "\""); 
			    //循环取出流中的数据 
			    byte []buffers=new byte[1024];  
				 int len=0;  
				 while((len=inStream.read(buffers))!=-1){  
					 outStream.write(buffers,0,len);  
				 } 
		    } 
	    }catch (UnsupportedEncodingException e) {
	    	logger.error(e.getMessage(),e);
		}catch(Exception e){ 
			logger.error(e.getMessage(),e);
	    } finally{
    		try {
    			if(inStream != null) {
    				inStream.close();
    			}
				if(outStream != null) {
					outStream.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			} 
		}
    }

	public String getBusinessKey() {
		return businessKey;
	}

	public void setBusinessKey(String businessKey) {
		this.businessKey = businessKey;
	}

	public List<File> getUploadify() {
		return uploadify;
	}

	public void setUploadify(List<File> uploadify) {
		this.uploadify = uploadify;
	}

	public List<String> getUploadifyContentType() {
		return uploadifyContentType;
	}

	public void setUploadifyContentType(List<String> uploadifyContentType) {
		this.uploadifyContentType = uploadifyContentType;
	}

	public List<String> getUploadifyFileName() {
		return uploadifyFileName;
	}

	public void setUploadifyFileName(List<String> uploadifyFileName) {
		this.uploadifyFileName = uploadifyFileName;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}
	
	public String getJsessionid() {
		return jsessionid;
	}

	public void setJsessionid(String jsessionid) {
		this.jsessionid = jsessionid;
	}

	
}
