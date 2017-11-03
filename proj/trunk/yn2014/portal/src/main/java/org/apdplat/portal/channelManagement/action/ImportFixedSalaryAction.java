package org.apdplat.portal.channelManagement.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.platform.util.Struts2Utils;
import org.apdplat.portal.channelManagement.service.ImportFixedSalaryService;
import org.apdplat.portal.channelManagement.service.UnitMangerService;
import org.apdplat.wgreport.common.SpringManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

@SuppressWarnings("serial")
@Controller
@Namespace("/fixedSalary")
@Scope("prototype")
@Results({
	@Result(name="success", location="/portal/channelManagement/jsp/import_fixed_salary_list.jsp"),
	@Result(name="error", location="/portal/channelManagement/jsp/import_fixed_salary.jsp")
})
public class ImportFixedSalaryAction extends BaseAction {
	private File uploadFile;
	private String time;
	private Map<String, String> resultMap;
	@Autowired
	private ImportFixedSalaryService importFixedSalaryService;
	@Resource
	DataSource dataSource;
	private final APDPlatLogger logger = new APDPlatLogger(getClass());

	/*public void importToResult() {
		String delRepeat = "DELETE PMRT.TAB_MRT_RENT_ALL_MON WHERE DEAL_DATE='"	+ time+ "' AND GROUP_ID_1='"+regionCode+"'";
		SpringManager.getUpdateDao().update(delRepeat);
		String importToResult = "INSERT INTO PMRT.TAB_MRT_RENT_ALL_MON SELECT * FROM PMRT.TAB_MRT_RENT_ALL_MON_TEMP WHERE DEAL_DATE='"+time+"' AND GROUP_ID_1='"+regionCode+"'";
		SpringManager.getUpdateDao().update(importToResult);
		Connection conn =null;
		CallableStatement stmt=null;
		Connection conn1 =null;
		CallableStatement stmt1=null;
		//调用存储过程
		try {
			conn = dataSource.getConnection();
			stmt = conn.prepareCall("{call PMRT.PRC_MRT_IRON_IMPORT_GROUP(?,?,?,?)}");
			
			stmt.setString(1,time);
			stmt.setString(2,"TAB_MRT_RENT_ALL_MON_TEMP");
			stmt.setString(3,"TAB_MRT_RENT_ALL_MON");
			stmt.registerOutParameter(4,java.sql.Types.DECIMAL);
			stmt.executeUpdate();
			//调用存储过程
			conn1 = dataSource.getConnection();
			stmt1 = conn1.prepareCall("{call PMRT.PRC_MRT_IRON_UNIT_REFRESH(?,?)}");
			stmt1.setString(1,time);
			stmt1.registerOutParameter(2,java.sql.Types.DECIMAL);
			stmt1.executeUpdate();
			conn1.close();
			stmt1.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}*/
	
	public String importToTemp() {
		User user = UserHolder.getCurrentLoginUser();
		String username=user.getUsername();
		List<String> err = new ArrayList<String>();
		String resultTableName = "TAB_MRT_CHNL_SALAY_AWARD_MON";
		String field="DEAL_DATE,GROUP_ID_1_NAME,UNIT_NAME,HR_ID,NMAE,SALAY_NUM,AWARD_NUM,UPDATE_TIME,OPERATE_NAME";
		if (uploadFile == null) {
			err.add("上传文件为空！");
		} else {
			String fileType=request.getParameter("fileType");
			FileInputStream in =null;
		    Workbook wb = null;
			Connection conn = null;
			PreparedStatement pre = null;
			try {
				conn = this.getCon();
				conn.setAutoCommit(false); 
				// 上传时覆盖
				/*String delSql = "DELETE FROM " + resultTableName
				        + " WHERE DEAL_DATE='" + time+"'";
				SpringManager.getUpdateDao().update(delSql);*/
				in = new FileInputStream(uploadFile);
				wb = WorkbookFactory.create(in);
				/*if(fileType.equals(".xlsx")){
					wb = new XSSFWorkbook(in);
				}else{
					wb = new HSSFWorkbook(in);
				}*/
				int sheetNum = wb.getNumberOfSheets();// 得到sheet数量
				System.out.println("准备导入...");
				if (sheetNum > 0) {
					Sheet sheet = wb.getSheetAt(0);
					System.out.println("导入Sheet页0:" + sheet.getSheetName());
					int start = sheet.getFirstRowNum() +1 ;// 去前1行标题
					int end = sheet.getLastRowNum();
					Row row;
					String sql = "UPDATE PMRT.TAB_MRT_CHNL_SALAY_AWARD_MON "
					        + "SET SALAY_NUM = ?, AWARD_NUM = ?,OPERATE_NAME='"+username+"',UPDATE_TIME=SYSDATE "
					        + "WHERE DEAL_DATE>=? AND GROUP_ID_1_NAME=? AND UNIT_NAME=? AND HR_ID=? AND NMAE=?";
					pre=conn.prepareStatement(sql);
					for (int y = start; y <= end; y++) {
						row = sheet.getRow(y);
						if (row == null)
							continue;
						int cstart = row.getFirstCellNum();//排除第一列
						int cend = row.getLastCellNum();
						System.out.println(cstart + "：" + cend);
						for (int i = cstart; i < cend; i++) {
							
							if(i==5||i==6){
							    Pattern p = Pattern.compile("([0-9]\\d*\\.?\\d*)|(0\\.\\d*[1-9])");
							    Matcher isNum = p.matcher(getCellValue(row.getCell(i)));
						           if(isNum.matches()){
						               Float s=Float.valueOf(getCellValue(row.getCell(i)));
						               pre.setFloat(i-4, s);
						           }else{ err.add("检查上传文件第"+(y+1)+"行"+(i+1)+"列是否为合法数字！");}
							}else{
							pre.setString(i+3,getCellValue(row.getCell(i)));
							}
						}
						pre.addBatch();
					}
					pre.executeBatch();
					conn.commit();
					conn.setAutoCommit(true);
//					importToResult();
				}
			} catch (Exception e) {
				e.printStackTrace();
				err.add(e.getMessage());
			}finally{
				try {
				    conn.rollback();
					conn.close();
					if(wb instanceof XSSFWorkbook){
						in.close();
					}else{
						 wb.close();
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
		if(err.size()>0){
		   Struts2Utils.getRequest().setAttribute("err", err);
		   return "error";
		}
		return "success";
	}

	public void downfile() {
		File f=new File(this.request.getRealPath("/portal/channelManagement/down/import_fixed_salary.xls"));
		HttpServletResponse resp=ServletActionContext.getResponse();
		OutputStream os=null;
		InputStream is=null;
		try{
			os=resp.getOutputStream();
			is=new FileInputStream(f);
			resp.addHeader("content-disposition", "attachment;filename=import_fixed_salary.xls");
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
		}finally{
			if(is!=null){
				try{ is.close();}catch(Exception e1){}
			}
			if(os!=null){
				try{ os.close();}catch(Exception e2){}
			}
		}
	}
	
	public File getUploadFile() {
		return uploadFile;
	}

	public void setUploadFile(File uploadFile) {
		this.uploadFile = uploadFile;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public Map<String, String> getResultMap() {
        return resultMap;
    }

    public void setResultMap(Map<String, String> resultMap) {
        this.resultMap = resultMap;
    }

    private String getCellValue(Cell cell){
		String value="";
		if(cell==null){
			return value;
		}
		int cellType=cell.getCellType();
		if(cellType==HSSFCell.CELL_TYPE_STRING){
			value=cell.getStringCellValue()+"";
		}else if(cellType==HSSFCell.CELL_TYPE_NUMERIC){
			if(HSSFDateUtil.isCellDateFormatted(cell)){
				value=new SimpleDateFormat("yyyy年MM月dd日").format(cell.getDateCellValue())+"";
			}else{
				value=cell.getNumericCellValue()+"";
			}
		}else if(cellType==HSSFCell.CELL_TYPE_BLANK){
			
		}else if(HSSFCell.CELL_TYPE_FORMULA==cellType){
			try {
				value = String.valueOf(cell.getNumericCellValue());
			} catch (IllegalStateException e) {
				value = String.valueOf(cell.getRichStringCellValue());
			}
			System.out.print("\t" + value);
		}
		return value;
	}
	
	public void list() {
        try {
            String name = request.getParameter("name");
            String unit_name = request.getParameter("unit_name");
            String deal_date = request.getParameter("deal_date");
            String regionCode = request.getParameter("regionCode");
            if(unit_name != null && !"".equals(unit_name.trim())) {
                resultMap.put("unit_name", unit_name);
            }
            if(deal_date != null && !"".equals(deal_date.trim())) {
                resultMap.put("deal_date", deal_date);
            }
            if(name != null && !"".equals(name.trim())) {
                resultMap.put("name", "%"+name+"%");
            }
            if(regionCode != null && !"".equals(regionCode.trim())) {
                resultMap.put("regionCode",regionCode);
            }
            Object result = importFixedSalaryService.list(resultMap);
            this.reponseJson(result);
        } catch (Exception e) {
            logger.error("查询信息失败",e);
            outJsonPlainString(response,"{\"msg\":\"查询信息失败\"}");
        }
    }
	
	public void list1() {
        try {
            String hr_id = request.getParameter("hr_id");
            String deal_date = request.getParameter("deal_date");
            Map<String, String> params=new HashMap<String, String>();
            if(deal_date != null && !"".equals(deal_date.trim())) {
                params.put("deal_date", deal_date);
            }
            if(hr_id != null && !"".equals(hr_id.trim())) {
                params.put("hr_id", hr_id);
            }
            Object result = importFixedSalaryService.list1(params);
            this.reponseJson(result);
        } catch (Exception e) {
            logger.error("查询失败",e);
            outJsonPlainString(response,"{\"msg\":\"查询失败\"}");
        }
    }
	
	public void update() {
        try {
            Map<String, String> params = new HashMap<String, String>();
            String nmae = request.getParameter("nmae");
            String unit_name = request.getParameter("unit_name");
            String deal_date = request.getParameter("deal_date");
            String username = request.getParameter("username");
            String group_id_name = request.getParameter("group_id_name");
            String hr_id = request.getParameter("hr_id");
            String salary_num = request.getParameter("salary_num");
            String award_num = request.getParameter("award_num");
            params.put("nmae", nmae);
            params.put("unit_name", unit_name);
            params.put("deal_date", deal_date);
            params.put("username", username);
            params.put("group_id_name", group_id_name);
            params.put("hr_id", hr_id);
            params.put("salary_num", salary_num);
            params.put("award_num", award_num);
            importFixedSalaryService.update(params);
            this.reponseJson("修改成功");
        } catch (Exception e) {
            this.reponseJson("修改失败");
        }
    }
}
