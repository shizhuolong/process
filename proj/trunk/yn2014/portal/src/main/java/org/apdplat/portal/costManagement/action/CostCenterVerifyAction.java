package org.apdplat.portal.costManagement.action;

import java.io.File;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.costManagement.service.CostCenterVerifyService;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 成本中心确认
 * @author xuxuejiang
 *
 */
@SuppressWarnings("serial")
public class CostCenterVerifyAction extends BaseAction{
	private String  regionCode  ;//地市编码
	private String  unitCode    ;//营服编码
	private String  unitName    ;//营服名称
	private String  centerCode  ;//成本中心编码
	private String  centerName  ;//成本中心名称
	private String  orgLevel    ;//组织架构层级
	private String  orgCode     ;//组织架构编码
	private String  isMarking	;//是否打标
	
	private String  rows        ;//每页显示的记录数  
	private String  page        ;//当前第几页  
	
	private File[] myFile		;//导入Excel文件
	private String myFileFileName;//Excel导入名称
	

	@Autowired
	private CostCenterVerifyService service;
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	/**
	 * 成本中心列表
	 */
	public void findCostCenterList(){
		Map<String, String> paramsMap = new HashMap<String,String>();
		if(null!=regionCode&&!"".equals(regionCode)){
			paramsMap.put("regionCode", regionCode);
		}
		if (null!=unitCode&&!"".equals(unitCode)) {
			paramsMap.put("unitCode", unitCode);
		}
		if (null!=centerCode&&!"".equals(centerCode)) {
			paramsMap.put("centerCode", centerCode);
		}
		if (null!=centerName&&!"".equals(centerName)) {
			paramsMap.put("centerName", centerName);
		}
		if (null!=orgLevel&&!"".equals(orgLevel)) {
			paramsMap.put("orgLevel", orgLevel);
		}
		if (null!=orgCode&&!"".equals(orgCode)) {
			paramsMap.put("orgCode", orgCode);
		}
		if (null!=isMarking&&!"".equals(isMarking)) {
			paramsMap.put("isMarking", isMarking);
		}
		if (null!=rows&&!"".equals(rows)) {
			paramsMap.put("rows", rows);
		}
		if (null!=page&&!"".equals(page)) {
			paramsMap.put("page", page);
		}
		
		try {
			Map<String, Object> resultMap = service.findCostCenterList(paramsMap);
			this.reponseJson(resultMap);
		} catch (Exception e) {
			logger.error("查询成本中心列表数据失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询成本中心列表数据失败\"}");
		}
	}

	/**
	 * 根据地市编码获取地市下所有营服中心
	 */
	public void findUnitList(){
		try {
			List<Map<String,String>> unitList = service.findUnitList(orgCode);
			System.out.println(unitList);
			this.reponseJson(unitList);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("查询营服信息失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询营服信息失败\"}");
		}
	}

	/**
	 * 修改一行成本中心信息
	 */
	public void saveRow(){
		Map<String, String> paramsMap = new HashMap<String, String>();
		if(null!=regionCode&&!"".equals(regionCode)){
			paramsMap.put("regionCode", regionCode);
		}
		if (null!=unitCode&&!"".equals(unitCode)) {
			paramsMap.put("unitCode", unitCode);
		}
		if (null!=unitName&&!"".equals(unitName)) {
			paramsMap.put("unitName", unitName);
		}
		if (null!=centerCode&&!"".equals(centerCode)) {
			paramsMap.put("centerCode", centerCode);
		}
		int num =0;
		try {
			 num = service.saveRow(paramsMap);
			 System.out.println("修改条数======》》》"+num);
			 this.reponseJson(num);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("修改营服信息失败",e);
			outJsonPlainString(response,"{\"msg\":\"修改营服信息失败\"}");
		}
	}
	
	/**
	 * 导入Excel
	 * 只有地市人员能够导入数据，其他组织架构层级人员不能拥有Excel导入权限，在页面也不显示导入Excel按钮
	 */
	public void importExcel(){
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String orgLevel = org.getOrgLevel();
		String orgCode  = org.getCode();
		String resultMsg = "";
		if(null!=myFile&&myFile.length>0){
			//删除成本中心临时表数据(只有地市层级人员才能删除该地市的临时表数据)
			Map<String,String> tempParams = new HashMap<String, String>();
			tempParams.put("orgLevel", orgLevel);
			tempParams.put("orgCode",orgCode );
			try {
				service.deleteCostTemp(tempParams);
			} catch (Exception e2) {
				e2.printStackTrace();
				logger.error("删除临时表数据出错",e2);
				resultMsg ="删除临时表数据出错";
			}
			
			
			//获取导入Excel的第一个sheet页数据
			List<String[]> list = this.getExcel(myFile[0], 0);
			if("".equals(resultMsg)) {
				Connection conn = null;
				PreparedStatement pre = null;
				try {
					//1.建立链接
					conn = this.getCon();
					//2.不自动 Commit (瓜子不是一个一个吃,全部剥开放桌子上,然后一口舔了) 
					conn.setAutoCommit(false);
					String sql =" INSERT INTO PODS.TAB_ODS_GB_CENTER_UNIT_TEMP       			"+
								"   ( GROUP_ID_1,GROUP_ID_1_NAME,  CC_DESC,CC_CODE, UNIT_NAME)  "+
								" VALUES                                             			"+
								"   (?,?, ?, ?, ?)                                     			";
					//3.预编译SQL语句,只编译一回哦,效率高啊.(发明一个剥瓜子的方法,以后不要总想怎么剥瓜子好.就这样剥.) 
					pre = conn.prepareStatement(sql);
					//4.循环list生成一条一条记录
					for(int i=1; i<list.size(); i++) {
						String[] str = list.get(i);
						int j= 1;
						pre.setString(j++, str[0]);
						pre.setString(j++, str[1]);
						pre.setString(j++, str[2]);
						pre.setString(j++, str[3]);
						pre.setString(j++, str[4]);
						//把这条执行语句加到PreparedStatement对象的批处理命令中
						pre.addBatch();
					}
					//5.把以上添加到批处理命令中的所有命令一次过提交给数据库来执行
					pre.executeBatch();
					//6.提交到数据库
					conn.commit();
					conn.setAutoCommit(true);
					conn.close();
				} catch (Exception e) {
					e.printStackTrace();
					resultMsg ="成本中心确认导入数据出错";
					logger.error("成本中心确认导入失败",e);
					try {
						conn.rollback();
						conn.setAutoCommit(true);
						conn.close();
					} catch (SQLException e1) {
						e1.printStackTrace();
					}
					this.reponseJson("成本中心确认导入失败");
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
			
			//验证是否有成本中心名称与码表营服中心名称不一致的数据
			if("".equals(resultMsg)) {
				List<Map<String, Object>> datas = service.queryNotExistsUnits(tempParams);
				if(datas.size() > 1) {
					resultMsg = "成本中心名称【";
					for(int i=0; i<datas.size(); i++) {
						Map<String, Object> m = datas.get(i);
						String unit_name = m.get("UNIT_NAME").toString();
						resultMsg += unit_name+"、";
					}
					resultMsg += "】不正确，不能进行导入。";
				}
			}

			if("".equals(resultMsg)) {
				//使用临时表中的数据更新结果表
				try {
					service.updateCostData(tempParams);
				} catch (Exception e) {
					e.printStackTrace();
					resultMsg += "使用临时表中的数据更新结果表出错，不能进行导入。";
					logger.error("使用临时表中的数据更新结果表出错",e);
				}
			}
			this.reponseJson(resultMsg);
		}else{
			this.reponseJson("文件不能为空");
		}
	}
	
	/**
	 * 确认划分成本中心
	 */
	public void updateState(){
		String resultMsg = "";
		//1、根据地市编码查询成本中心表中是否有营服中心名称或编码为空的数据
		List<Map<String, Object>> centerNullList = service.queryNullUnit(regionCode);
		if(centerNullList.size()>0){
			resultMsg="成本中心【";
			for(int i=0;i<centerNullList.size();i++){
				Map<String, Object> m = centerNullList.get(i);
				String ccDesc = m.get("CC_DESC").toString();
				resultMsg += ccDesc+"、";
			}
			resultMsg+="】对应的应付中心名称或编码为空，不能划分成本中心";
		}else{//2、更新成本中心表数据(确认划分成本中心)
			try {
				service.updateState(regionCode);
				resultMsg="划分成本中心成功！";
			} catch (Exception e) {
				resultMsg="划分成本中心失败！";
				e.printStackTrace();
				logger.error("划分成本中心失败！",e);
			}
		}
		this.reponseJson(resultMsg);
	}
	
	//使用mybatis插入list集合
/*	public void importExcel(){
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
	String orgLevel = org.getOrgLevel();
	String orgCode  = org.getCode();
	String resultMsg = "";
	if(null!=myFile&&myFile.length>0){
		//删除成本中心临时表数据(只有地市层级人员才能删除该地市的临时表数据)
		Map<String,String> tempParams = new HashMap<String, String>();
		tempParams.put("orgLevel", orgLevel);
		tempParams.put("orgCode",orgCode );
		try {
			service.deleteCostTemp(tempParams);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		
		//获取导入Excel的第一个sheet页数据
		List<String[]> list = this.getExcel(myFile[0], 0);
		List<Map<String,String>> queryList = new ArrayList<Map<String,String>>();
		for(int i=1; i<list.size(); i++) {
			Map<String,String> map = new HashMap<String, String>();
			String[] str = list.get(i);
			for(int j=0;j<str.length;j++){
				map.put("GROUP_ID_1_NAME", str[0]);
				map.put("CC_CODE", str[1]);
				map.put("CC_DESC", str[2]);
				map.put("UNIT_NAME", str[3]);
			}
			queryList.add(map);
		}
		System.out.println("queryList-->"+queryList);
		//把Excel表格数据插入到临时表
		try {
			service.inserToTmp(queryList);
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("————————————————————————————>导入list出错");
		}
		
		//验证是否有成本中心名称与码表营服中心名称不一致的数据
		List<Map<String, Object>> datas = service.queryNotExistsUnits(tempParams);
		if(datas.size() > 0) {
			resultMsg = "成本中心名称【";
			for(int i=0; i<datas.size(); i++) {
				Map<String, Object> m = datas.get(i);
				String unit_name = m.get("UNIT_NAME").toString();
				resultMsg += unit_name+"、";
			}
			resultMsg += "】不正确，不能进行导入。";
		}
		
		if("".equals(resultMsg)) {
			//使用临时表中的数据更新结果表
			service.updateCostData(tempParams);
		}
		this.reponseJson(resultMsg);
	}else{
		this.reponseJson("文件不能为空");
	}
}*/
	
	public String getRegionCode() {
		return regionCode;
	}

	public void setRegionCode(String regionCode) {
		this.regionCode = regionCode;
	}

	public String getUnitCode() {
		return unitCode;
	}

	public void setUnitCode(String unitCode) {
		this.unitCode = unitCode;
	}

	public String getCenterCode() {
		return centerCode;
	}

	public void setCenterCode(String centerCode) {
		this.centerCode = centerCode;
	}

	public String getCenterName() {
		return centerName;
	}

	public void setCenterName(String centerName) {
		this.centerName = centerName;
	}

	public String getOrgLevel() {
		return orgLevel;
	}

	public void setOrgLevel(String orgLevel) {
		this.orgLevel = orgLevel;
	}

	public String getOrgCode() {
		return orgCode;
	}

	public void setOrgCode(String orgCode) {
		this.orgCode = orgCode;
	}

	public String getRows() {
		return rows;
	}

	public void setRows(String rows) {
		this.rows = rows;
	}


	public String getPage() {
		return page;
	}

	public void setPage(String page) {
		this.page = page;
	}

	public String getUnitName() {
		return unitName;
	}

	public void setUnitName(String unitName) {
		this.unitName = unitName;
	}

	public String getIsMarking() {
		return isMarking;
	}

	public void setIsMarking(String isMarking) {
		this.isMarking = isMarking;
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
