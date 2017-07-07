package org.apdplat.portal.subsidyInput.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLDecoder;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.exception.BusiException;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.platform.util.ResultInfo;
import org.apdplat.portal.subsidyInput.service.SubsidyInputService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

/**
 * 渠道补贴
 * @author shizl
 *
 */
@SuppressWarnings("serial")
@Controller
@Namespace("/subsidyInput")
@Scope("prototype")
@Results({
	@Result(name="index", location="/portal/subsidyInput/jsp/import_subsidyInput_list.jsp")
})
public class SubsidyInputAction extends BaseAction{
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private SubsidyInputService subsidyInputService;
	private Map<String, String> resultMap=new HashMap<String,String>();
	private File[] myFile;
	private String myFileFileName;
	private String isHavingFile;
    
	public String index() {
		return "index";
	}
	
	public String getIsHavingFile() {
		return isHavingFile;
	}

	public void setIsHavingFile(String isHavingFile) {
		this.isHavingFile = isHavingFile;
	}

	/**
	 * 列表
	 */
	public void list() {
			User user = UserHolder.getCurrentLoginUser();
			String username=user.getUsername();
			resultMap.put("username", username);
			
			Object result = subsidyInputService.list(resultMap);
			this.reponseJson(result);
	}
	
	public void queryTotalFee() {
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String username=user.getUsername();
		String code = org.getCode();
		resultMap.put("code", code);
		resultMap.put("orgLevel", org.getOrgLevel());
		resultMap.put("username", username);
		double result = subsidyInputService.queryTotalFee(resultMap);
		this.reponseJson(result);
   }
	
	public void queryTotalFeeByInitId() {
		String workNo=request.getParameter("workNo");
		if(workNo != null && !"".equals(workNo.trim())) {
			resultMap.put("workNo", workNo);
		}
		double result = subsidyInputService.queryTotalFeeByInitId(resultMap);
		this.reponseJson(result);
   }
	
	public void queryTotalChnl() {
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String username=user.getUsername();
		String code = org.getCode();
		resultMap.put("code", code);
		resultMap.put("orgLevel", org.getOrgLevel());
		resultMap.put("username", username);
		double result = subsidyInputService.queryTotalChnl(resultMap);
		this.reponseJson(result);
   }
	
	public void queryTotalChnlByInitId() {
		String workNo=request.getParameter("workNo");
		if(workNo != null && !"".equals(workNo.trim())) {
			resultMap.put("workNo", workNo);
		}
		double result = subsidyInputService.queryTotalChnlByInitId(resultMap);
		this.reponseJson(result);
   }
	
	/**
	 * excel数据导入
	 */
	public void importExcel() {
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String username=user.getUsername();
		String businessKey = request.getParameter("businessKey");
		
		String resultMsg = "";
		String resultTableName="PAPP.TAB_COMMI_SUBSIDY_INFO_TEMP";
		if(myFile != null && myFile.length > 0) {
			
			Map<String, String> resultMap=new HashMap<String,String>();
			resultMap.put("username", username);
			resultMap.put("businessKey", businessKey);
			List<String[]> list = this.getExcel(myFile[0], 0);
						
			String [] columnsId = {"DEVELOP_CHNL_CODE","DEVELOP_CHNL_NAME","PAY_CHNL_CODE","PAY_CHNL_NAME","BILLINGCYCLID","CUST_TYPE","SUBSIDY_TYPE","SUBSIDY_WAY","SUBSIDY_FEE"};
			StringBuffer buf=new StringBuffer();
			buf.append("insert into "+resultTableName+"(insert_time,operator,seque_no,");
			for(int i=0;i<columnsId.length;i++){
				if(i==columnsId.length-1){
					buf.append(""+columnsId[i]+")");
				}else{
					buf.append(""+columnsId[i]+",");
				}
			}
			String base_sql=buf.toString();
		    String value_sql="values(sysdate,'"+username+"',COMMI_SUBSIDY_INFO.NEXTVAL,";
		    //删除临时表数据
		    subsidyInputService.deleteTemp(resultMap);
		    //导入操作
			if("".equals(resultMsg)) {
				Connection conn = null;
				PreparedStatement pre = null;
				try {
					conn = this.getCon();
					conn.setAutoCommit(false);
					String sql=base_sql+value_sql+"?,?,?,?,?,?,?,?,?)";
					System.out.println(sql);
					pre = conn.prepareStatement(sql);
					for(int i=1; i<list.size(); i++) {
						if(list.get(i)[0]==null||list.get(i)[0].equals("")){
							if(i==1){
								resultMsg+="【模板不能为空，请编辑后重新导入！】";
								this.reponseJson(resultMsg);
							}
							break;
						}
						String[] str = list.get(i);
						int j= 1;
						String result=checkByRex(str);
						if(result!=null){
							resultMsg+="【第"+(i+1)+"行,"+result+"】";
							this.reponseJson(resultMsg);
						}
						pre.setString(j++, str[0]);
						pre.setString(j++, str[1]);
						pre.setString(j++, str[2]);
						pre.setString(j++, str[3]);
						pre.setString(j++, str[4]);
						pre.setString(j++, str[5]);
						pre.setString(j++, str[6]);
						pre.setString(j++, str[7]);
						pre.setDouble(j++, Double.valueOf(str[8]));
						pre.addBatch();
					}
					if(resultMsg!=""){
						resultMsg+="】";
					}
					if("".equals(resultMsg)){
						pre.executeBatch();
						conn.commit();
						conn.setAutoCommit(true);
						conn.close();
					}
					
					if("".equals(resultMsg)) {
						Map<String, String> map = new HashMap<String, String>();
						map.put("code", org.getCode());
						if(businessKey!=null&&!businessKey.equals("")&&!businessKey.equals("undefined")){
							subsidyInputService.deleteResultByEdit(resultMap);
							subsidyInputService.importData(resultMap);
							subsidyInputService.updateInitId(resultMap);//重导将工单编号保留
						}else{
							subsidyInputService.deleteResult(resultMap);
							subsidyInputService.importData(resultMap);
						}
					}
					this.reponseJson(resultMsg);
				} catch (Exception e) {
					e.printStackTrace();
					logger.error("出现异常，渠道补贴导入失败!",e);
					try {
						conn.rollback();
						conn.setAutoCommit(true);
						conn.close();
					} catch (SQLException e1) {
						e1.printStackTrace();
					}
					this.reponseJson("出现异常，渠道补贴导入失败!");
				}finally {
					if(conn != null) {
						try {
							conn.close();
						} catch (SQLException e) {
							e.printStackTrace();
						}
					}
				}
			}
			this.reponseJson(resultMsg);
		} else {
			this.reponseJson("文件不能为空！");
		}
	}

	public String checkByRex(String[] input){
		for(int i=8;i<input.length;i++){
			if(input[i]!=null&&input[i].equals("")){
				return "第"+(i+1)+"列数据为空,请编辑！";
			}
		}
		return null;
	}
	
	public void update() {
		try {
			String seque_no = request.getParameter("seque_no");
			String subsidy_type = request.getParameter("subsidy_type");
			String subsidy_way = request.getParameter("subsidy_way");
			String subsidy_fee = request.getParameter("subsidy_fee");
			Map<String, String> params = new HashMap<String,String>();
			params.put("seque_no", seque_no);
			params.put("subsidy_type", subsidy_type);
			params.put("subsidy_way", subsidy_way);
			params.put("subsidy_fee", subsidy_fee);
			subsidyInputService.update(params);
			outJsonPlainString(response,"{\"msg\":\"修改成功！\"}");
		} catch (Exception e) {
			logger.error("修改渠道补贴信息失败！",e);
			outJsonPlainString(response,"{\"msg\":\"修改渠道补贴信息失败！\"}");
		}
	}
	
	public String del(){
		try {
			String seque_no = request.getParameter("seque_no");
			Map<String, String> params = new HashMap<String,String>();
			params.put("seque_no", seque_no);
			subsidyInputService.delete(params);
		} catch (Exception e) {
			logger.error("删除渠道补贴信息失败！",e);
		}
		return "index";
	}
	
	public void delEdit(){
		try {
			String seque_no = request.getParameter("seque_no");
			Map<String, String> params = new HashMap<String,String>();
			params.put("seque_no", seque_no);
			subsidyInputService.delete(params);
		} catch (Exception e) {
			logger.error("删除渠道补贴信息失败！",e);
		}
	}
	
	/**
	 * 模板下载
	 */
	public void downloadTemplate() {
		String path = "portal/subsidyInput/template/subsidyInputImport.xls";
		String fileName = "subsidyInput.xls";
		try {
			this.download(path, fileName);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 文件下载
	 * @param filePath
	 * @param fileName
	 * @throws IOException
	 */
	public void download(String filePath, String fileName) throws IOException{
		HttpServletResponse response = ServletActionContext.getResponse();
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
	
	public void downloadFile() {
		String filePath = request.getParameter("filePath");
		String fileName = request.getParameter("fileName");
		try {
			filePath=URLDecoder.decode(filePath, "UTF-8"); 
			fileName=URLDecoder.decode(fileName, "UTF-8"); 
			this.download(filePath, fileName);
		} catch (Exception e) {
			e.printStackTrace();
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
			subsidyInputService.doSendOrder(map);
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
	
	//通过工单编号查询列表,只读界面
	public void listByWorkNo() {
		try {
			String businessKey = request.getParameter("businessKey");
			if(businessKey == null || "".equals(businessKey)) {
				throw new BusiException("工单编号为空，查询数据失败！");
			}
						
			resultMap.put("businessKey", businessKey);
			Object result = subsidyInputService.listByWorkNo(resultMap);
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
		String initId=request.getParameter("initId");
		List<Map<String,Object>> fileInformation = subsidyInputService.queryFiles(initId);
		this.reponseJson(fileInformation);
	}
	
	public Map<String, String> getResultMap() {
		return resultMap;
	}

	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}

	public File[] getMyFile() {
		return myFile;
	}

	public void setMyFile(File[] myFile) {
		this.myFile = myFile;
	}

	public String getMyFileFileName() {
		return myFileFileName;
	}

	public void setMyFileFileName(String myFileFileName) {
		this.myFileFileName = myFileFileName;
	}
	
	
}
