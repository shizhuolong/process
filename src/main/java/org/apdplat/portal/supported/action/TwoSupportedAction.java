package org.apdplat.portal.supported.action;

import java.io.File;
import java.util.HashMap;
import java.util.Map;


import org.apache.commons.lang3.StringUtils;
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
import org.apdplat.portal.supported.service.TwoSupportedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

/**
 * 系统支撑2G补贴审批
 * @author shizl
 *
 */
@SuppressWarnings("serial")
@Controller
@Namespace("/twoSupported")
@Scope("prototype")
@Results({
	@Result(name="index", location="/portal/supported/jsp/import_twoSupported_list.jsp")
})
public class TwoSupportedAction extends BaseAction{
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private TwoSupportedService twoSupportedService;
	private Map<String, String> resultMap=new HashMap<String,String>();
	private File[] myFile;
	private String myFileFileName;
    
	public String index() {
		return "index";
	}
	
	/**
	 * 列表
	 */
	public void list() {
			User user = UserHolder.getCurrentLoginUser();
			Org org = user.getOrg();
			String code = org.getCode();
			String username=user.getUsername();
			resultMap.put("code", code);
			resultMap.put("orgLevel", org.getOrgLevel());
			resultMap.put("username", username);
			
			Object result = twoSupportedService.list(resultMap);
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
		
		double result = twoSupportedService.queryTotalFee(resultMap);
		this.reponseJson(result);
   }
	
	public void queryTotalFeeByInitId() {
		String workNo=request.getParameter("workNo");
		if(workNo != null && !"".equals(workNo.trim())) {
			resultMap.put("workNo", workNo);
		}
		double result = twoSupportedService.queryTotalFeeByInitId(resultMap);
		this.reponseJson(result);
   }
	
	/**
	 * excel数据导入
	 *//*
	public void importExcel() {
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String username=user.getUsername();
		String businessKey = request.getParameter("businessKey");
		String pay_address = request.getParameter("pay_address");
		
		String code=org.getCode();
		String resultMsg = "";
		String resultTableName="PAPP.TAB_GSM_COMM_IMPORT_TEMP";
		if(myFile != null && myFile.length > 0) {
			
			Map<String, String> resultMap=new HashMap<String,String>();
			resultMap.put("code", code);
			resultMap.put("username", username);
			resultMap.put("businessKey", businessKey);
			List<String[]> list = this.getExcel(myFile[0], 0);
						
			String [] columnsId = {"BILLINGCYCLID","AGENTID","DEPT_PTYPE","CHANNEL_NAME","REGION","COUNTY_ID","SUBSCRIPTION_ID","JOB_ID","FEE","TOTALFEE","NETFEE","SVCNUM","COMM_TYPE","SUBJECTID","SVCTP","REMARK","NET_TYPE","PAY_FLAG","PAY_ADDRESS"};
			StringBuffer buf=new StringBuffer();
			buf.append("insert into "+resultTableName+"(insert_date,group_id,account_id,bill_id,");
			for(int i=0;i<columnsId.length;i++){
				if(i==columnsId.length-1){
					buf.append(""+columnsId[i]+")");
				}else{
					buf.append(""+columnsId[i]+",");
				}
			}
			String base_sql=buf.toString();
		    String value_sql="values(sysdate,'"+code+"','"+username+"',gsmSupported_import.nextval,";
		    //删除临时表数据
		    twoSupportedService.deleteTemp(resultMap);
		    //导入操作
			if("".equals(resultMsg)) {
				Connection conn = null;
				PreparedStatement pre = null;
				try {
					pay_address=URLDecoder.decode(pay_address,"UTF-8");
					conn = this.getCon();
					conn.setAutoCommit(false);
					String sql=base_sql+value_sql+"?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
					System.out.println(sql);
					pre = conn.prepareStatement(sql);
					for(int i=1; i<list.size(); i++) {
						//System.out.println(list.get(0)[0]);
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
						pre.setDouble(j++, Double.valueOf(str[9]));
						pre.setDouble(j++, Double.valueOf(str[10]));
						pre.setString(j++, str[11]);
						pre.setString(j++, str[12]);
						pre.setString(j++, str[13]);
						pre.setString(j++, str[14]);
						pre.setString(j++, str[15]);
						pre.setString(j++, str[16]);
						pre.setString(j++, str[17]);
						pre.setString(j++, pay_address);
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
						//将临时表数据关联出地市和营服中心信息导入到结果表中
						Map<String, String> map = new HashMap<String, String>();
						map.put("code", org.getCode());
						if(businessKey!=null&&!businessKey.equals("")&&!businessKey.equals("undefined")){
							twoSupportedService.deleteResultByEdit(resultMap);
							twoSupportedService.importData(resultMap);
							twoSupportedService.updateInitId(resultMap);//重导将工单编号保留
						}else{
							twoSupportedService.deleteResult(resultMap);
							twoSupportedService.importData(resultMap);
						}
					}
					this.reponseJson(resultMsg);
				} catch (Exception e) {
					e.printStackTrace();
					logger.error("格式错误，系统支撑2G导入失败!",e);
					try {
						conn.rollback();
						conn.setAutoCommit(true);
						conn.close();
					} catch (SQLException e1) {
						e1.printStackTrace();
					}
					this.reponseJson("格式错误，系统支撑2G导入失败!");
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
			this.reponseJson("文件不能为空");
		}
	}*/

	/*public String checkByRex(String[] input){
		for(int i=8;i<input.length;i++){
			if(input[i]!=null&&input[i].equals("")){
				return "第"+(i+1)+"列数据为空,请编辑！";
			}
		}
		return null;
	}
	
	public void update() {
		try {
			String bill_id = request.getParameter("bill_id");
			String fee = request.getParameter("fee");
			Map<String, String> params = new HashMap<String,String>();
			params.put("bill_id", bill_id);
			params.put("fee", fee);
			twoSupportedService.update(params);
			outJsonPlainString(response,"{\"msg\":\"修改成功！\"}");
		} catch (Exception e) {
			logger.error("修改系统支撑2G信息失败",e);
			outJsonPlainString(response,"{\"msg\":\"修改系统支撑2G信息失败\"}");
		}
	}
	
	public String del(){
		try {
			String bill_id = request.getParameter("bill_id");
			Map<String, String> params = new HashMap<String,String>();
			params.put("bill_id", bill_id);
			twoSupportedService.delete(params);
		} catch (Exception e) {
			logger.error("删除系统支撑2G信息失败！",e);
		}
		return "index";
	}
	
	public void delEdit(){
		try {
			String bill_id = request.getParameter("bill_id");
			Map<String, String> params = new HashMap<String,String>();
			params.put("bill_id", bill_id);
			twoSupportedService.delete(params);
		} catch (Exception e) {
			logger.error("删除系统支撑2G信息失败！",e);
		}
	}
	
	*//**
	 * 模板下载
	 *//*
	public void downloadTemplate() {
		String path = "portal/supported/template/twoSupportedImport.xls";
		String fileName = "twoSupported.xls";
		try {
			this.download(path, fileName);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	*//**
	 * 文件下载
	 * @param filePath
	 * @param fileName
	 * @throws IOException
	 *//*
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
	*/
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
			twoSupportedService.doSendOrder(map);
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
			Object result = twoSupportedService.listByWorkNo(resultMap);
			this.reponseJson(result);
		} catch(BusiException e) {
			logger.error(e.getMessage(), e);
			outJsonPlainString(response,"{\"msg\":\""+e.getMessage()+"\"}");
		}catch (Exception e) {
			logger.error(e.getMessage(), e);
			logger.error("查询数据失败！",e);
			outJsonPlainString(response,"{\"msg\":\"查询数据失败\"}");
		}
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
