package org.apdplat.portal.bullManagement.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.sql.Timestamp;
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
import org.apdplat.portal.bullManagement.service.BullService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;


/**
 * 公告管里
 * @author lyz
 *
 */
@SuppressWarnings("serial")
@Controller
@Scope("prototype")
public class BullAction extends BaseAction {

	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private BullService service;
	
	private Map<String, String> resultMap;
	
	private String isShow;/////////////
	private String isAlert;//是否是弹窗公告
	private String isTop;
	private String isManage;
	private String bullName;
	private String content;
	private String oldUrls;
	private String oldNames;
	private String id;
	private String oldUrls0;//原来的附件路径
	private String[] fileName;
	private String downUrl;
	private String downName;
	
	private File image;
	private String localUrl;
	
	/**
	 * 获取公告列表
	 */
	public void listBulls() {
		if(bullName!=null&&!bullName.trim().equals("")){
			resultMap.put("bullName", bullName);
		}
		if(isAlert!=null&&!isAlert.trim().equals("")){
			resultMap.put("isAlert", isAlert);
		}
		if(isTop!=null&&!isTop.trim().equals("")){
			resultMap.put("isTop", isTop);
		}
		if(isManage!=null&&!isManage.trim().equals("")){
			resultMap.put("isManage", isManage);
		}
		Object list = service.listBulls(resultMap);
		this.reponseJson(list);
	}
	/**
	 * 下载附件
	 * @throws IOException 
	 */
	public void downfile() {
		File f=new File(this.request.getRealPath(downUrl));
		HttpServletResponse resp=ServletActionContext.getResponse();
		OutputStream os=null;
		InputStream is=null;
		try{
			os=resp.getOutputStream();
			is=new FileInputStream(f);
			String defileName=java.net.URLDecoder.decode(downName,"UTF-8");
			String agent = request.getHeader("User-Agent");
			logger.debug("User-Agent:"+agent);
			boolean isFirefox = (agent != null && agent.indexOf("Firefox") != -1);
			if (!isFirefox) {
				defileName= URLEncoder.encode(defileName, "UTF-8");
			} else {
				defileName= new String(defileName.getBytes("UTF-8"), "ISO-8859-1");
			}
			logger.debug("解码后的文件名："+defileName);
			resp.addHeader("content-disposition", "attachment;filename="+defileName);
			
			byte[] b=new byte[1024];
			int size=is.read(b);
			
			while(size>0){
				os.write(b,0,size);
				size=is.read(b);
			}
		}catch(IOException e){
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
				//os.write("<script>  alert('所下载的附件已经不存在！');history.go(-1);</script>".getBytes());
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
	/**
	 * editor上传图片文件
	 * @throws IOException 
	 */
	public void uploadfile() {
		String imagesDir="/upload/bulletin/images/";
		logger.debug("上传图片："+image);
		logger.debug("图片路径："+imagesDir);
		Map<String,Object> result=new HashMap<String,Object>();
		try{
			if(image!=null)
	        {  
	        	String fileName=UUID.randomUUID().toString()+localUrl;       	
	        	String realPath =  ServletActionContext.getServletContext().getRealPath(imagesDir+fileName);
	        	File destFile=new File(realPath);
	        	FileUtils.copyFile(image, destFile); 
	        	result.put("error", 0);
	        	String url= ServletActionContext.getServletContext().getContextPath();
	        	url=url+"/bullManagement/bullManager_downfile.action?downUrl="+imagesDir+fileName+"&downName="+URLDecoder.decode(localUrl);
	        	result.put("url", url);
	        }
		}catch(Exception e){
			result.put("error", 1);
	    	result.put("message", "文件上传错误");
		}
        this.reponseJson(result);
	}
	/**
	 * 增加公告
	 */
	public void addBull() {
		String newUrls="";
		String newNames="";
		String attachmentsDir="/upload/bulletin/";
		String result="保存成功";
		// 复制文件和删除文件
		if (null == file) {
			logger.debug("公告无附件。");
		} else {
			List<String> fns=new ArrayList<String>();
			if(null!=fileName){
				for(String s:fileName){
					if(s!=null&&!s.trim().equals("")){
						fns.add(s);
					}
				}
			}
			for(int i=0;i<file.length;i++){
				String thisFileName=fns.get(i);
				String suffix=thisFileName.substring(thisFileName.lastIndexOf("."));
				String url=UUID.randomUUID().toString()+suffix;
				File destFile=new File(this.request.getRealPath(attachmentsDir+url));
				try {
					FileUtils.copyFile(file[i], destFile);
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				url=attachmentsDir+url;
				if(newNames.length()>0){
					newNames+="&&";
					newUrls+="&&";
				}
				newNames+=thisFileName;
				newUrls+=url;
			}
		}
		if(newNames.length()>0&&oldNames!=null&&oldNames.length()>0){
			newNames+="&&"+oldNames;
		}else if(newNames.length()<=0){
			newNames=oldNames;
		}
		if(newUrls.length()>0&&oldUrls!=null&&oldUrls.length()>0){
			newUrls+="&&"+oldUrls;
		}else if(newUrls.length()<=0){
			newUrls=oldUrls;
		}
		logger.debug("公告附件文件名："+newNames);
		logger.debug("公告附件路径："+newUrls);
		Map<String, Object> params=new HashMap<String,Object>();
		
		params.put("bullName",bullName );
		params.put("isShow",isShow );
		params.put("isTop",isTop );
		params.put("isManage",isManage );
		params.put("content",content );
		params.put("creator",UserHolder.getCurrentLoginUser().getRealName());
		params.put("createTime",new Timestamp(new Date().getTime()) );
		params.put("newUrls",newUrls );
		params.put("newNames",newNames );
		params.put("isAlert",isAlert );
		int n=0;
		//加入数据库
		if(id==null||id.trim().equals("")){
			params.put("id",UUID.randomUUID().toString().replaceAll("-", ""));
			n=service.addBull(params);
		}else{
			params.put("id",id);
			//更新前删除现在已经删除的原有附件
			if(null!=oldUrls0){
				String url0s[] =oldUrls0.split("&&");
				if(null==oldUrls||oldUrls.trim().equals("")){
					for(String s:url0s){
						deleteFile(s);
					}
				}else{
					for(String s:url0s){
						if(!oldUrls.contains(s)){
							deleteFile(s);
						}
					}
				}
			}
			
			////////////////////////
			n=service.updateBull(params);
		}
		if(n<=0){
			result="保存失败";
		}
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
	public void delBull() {
		if(null!=id){
			//删除数据库
			int r=service.delBull(id);
			Map<String, Boolean> result=new HashMap<String, Boolean>();
			if(r>0){
				result.put("ok", true);
			}else{
				result.put("ok", false);
			}
			//删除文件
			if(null!=oldUrls){
				String[] urls=oldUrls.split("&&");
				for(String url:urls){
					deleteFile(url);
				}
			}
			this.reponseJson(result);
		}
	}
	private void deleteFile(String url){
		if(url==null||url.trim().equals("")){
			return;
		}
		String realPath=this.request.getRealPath(url);
		logger.debug("删除公告文件："+realPath);
		File f=new File(realPath);
		try{
			f.delete();
		}catch(Exception e){
			
		}
	}
	
	
	public String getLocalUrl() {
		return localUrl;
	}

	public void setLocalUrl(String localUrl) {
		this.localUrl = localUrl;
	}

	public File getImage() {
		return image;
	}

	public void setImage(File image) {
		this.image = image;
	}

	public String getDownName() {
		return downName;
	}

	public void setDownName(String downName) {
		this.downName = downName;
	}

	public String getDownUrl() {
		return downUrl;
	}

	public void setDownUrl(String downUrl) {
		this.downUrl = downUrl;
	}

	public String[] getFileName() {
		return fileName;
	}

	public void setFileName(String[] fileName) {
		this.fileName = fileName;
	}

	public String getOldUrls0() {
		return oldUrls0;
	}

	public void setOldUrls0(String oldUrls0) {
		this.oldUrls0 = oldUrls0;
	}

	public String getBullName() {
		return bullName;
	}

	public void setBullName(String bullName) {
		this.bullName = bullName;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getOldUrls() {
		return oldUrls;
	}

	public void setOldUrls(String oldUrls) {
		this.oldUrls = oldUrls;
	}

	public String getOldNames() {
		return oldNames;
	}

	public void setOldNames(String oldNames) {
		this.oldNames = oldNames;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
	private File[] file;
	
	public File[] getFile() {
		return file;
	}

	public void setFile(File[] file) {
		this.file = file;
	}

	public String getIsShow() {
		return isShow;
	}

	public void setIsShow(String isShow) {
		this.isShow = isShow;
	}

	public String getIsTop() {
		return isTop;
	}

	public void setIsTop(String isTop) {
		this.isTop = isTop;
	}

	public String getIsManage() {
		return isManage;
	}

	public void setIsManage(String isManage) {
		this.isManage = isManage;
	}

	public Map<String, String> getResultMap() {
		return resultMap;
	}

	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}
	public String getIsAlert() {
		return isAlert;
	}
	public void setIsAlert(String isAlert) {
		this.isAlert = isAlert;
	}
	
}
