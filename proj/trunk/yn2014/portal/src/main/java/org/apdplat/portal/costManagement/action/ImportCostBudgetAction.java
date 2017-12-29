package org.apdplat.portal.costManagement.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

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
import org.apdplat.portal.costManagement.service.ImportCostBudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

/**
 * 成本预算导入
 * 
 * @author wcyong
 * 
 */
@SuppressWarnings("serial")
@Controller
@Namespace("/importCostBudget")
@Scope("prototype")
@Results({ @Result(name = "index", location = "/portal/costManagement/jsp/import_cost_budget_list.jsp") })
public class ImportCostBudgetAction extends BaseAction {
	private final APDPlatLogger logger = new APDPlatLogger(getClass());

	@Autowired
	private ImportCostBudgetService importCostBudgetService;
	private Map<String, String> resultMap;
	private File[] myFile;
	private String myFileFileName;
	private String dealDate;

	public String index() {
		return "index";
	}

	/**
	 * 成本预算导入列表
	 */
	public void list() {
		try {
			User user = UserHolder.getCurrentLoginUser();
			Org org = user.getOrg();
			String code = org.getCode();
			String region_code = org.getRegionCode();
			String cost_center_name = request.getParameter("cost_center_name");
			String deal_date = request.getParameter("deal_date");
			resultMap.put("code", code);
			resultMap.put("region_code", region_code);
			resultMap.put("orgLevel", org.getOrgLevel());
			if (cost_center_name != null && !"".equals(cost_center_name.trim())) {
				resultMap.put("cost_center_name", "%" + cost_center_name + "%");
			}
			if (deal_date != null && !"".equals(deal_date.trim())) {
				resultMap.put("deal_date", deal_date);
			}
			Object result = importCostBudgetService.list(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询成本预算导入信息失败", e);
			outJsonPlainString(response, "{\"msg\":\"查询成本预算导入信息失败\"}");
		}
	}

	/**
	 * excel数据导入
	 */
	public void importExcel() {
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String resultMsg = "";
		if (myFile != null && myFile.length > 0) {
			// 删除临时表数据
			Map<String, String> tmp = new HashMap<String, String>();
			tmp.put("area_name", org.getCode());
			importCostBudgetService.deleteCostTemp(tmp);

			List<String[]> list = this.getExcel(myFile[0], 0);
			// 验证成本中心名称和帐期不能为空
			for (int i = 1; i < list.size(); i++) {
				String[] str = list.get(i);
				String str1 = str[1];
				String str8 = str[8];
				if (str1 == null || "".equals(str1.trim())) {
					resultMsg = "成本中心名称不能为空!";
					break;
				}
				if (str8 == null || "".equals(str8.trim())) {
					resultMsg = "帐期不能为空!";
					break;
				}
			}
			// 导入操作
			if ("".equals(resultMsg)) {
				Connection conn = null;
				PreparedStatement pre = null;
				try {
					conn = this.getCon();
					conn.setAutoCommit(false);
					String sql = "INSERT INTO PORTAL.TAB_PORTAL_COST_BUDGET_TEMP(COST_CENTER_CODE,"
							+ "COST_CENTER_NAME,UNIT_ITEM,BUDGET_ITEM_CODE,BUDGET_ITEM_NAME,"
							+ "BUDGET_MONEY,ZSB_RATE,FLAG,DEAL_DATE,AREA_NAME,ACT_ID,ID) "
							+ "VALUES(?,?,?,?,?,?,?,?,?,?,?,?)";
					pre = conn.prepareStatement(sql);
					for (int i = 1; i < list.size(); i++) {
						String[] str = list.get(i);
						int j = 1;
						pre.setString(j++, str[0]);
						pre.setString(j++, str[1]);
						pre.setString(j++, str[2]);
						pre.setString(j++, str[3]);
						pre.setString(j++, str[4]);
						pre.setString(j++, str[5]);
						pre.setString(j++, str[6]);
						pre.setString(j++, str[7]);
						pre.setString(j++, str[8]);
						pre.setString(j++, org.getCode());
						pre.setString(j++, user.getUsername());
						String uuid = UUID.randomUUID().toString()
								.replace("-", "");
						pre.setString(j++, uuid);
						pre.addBatch();
					}
					pre.executeBatch();
					conn.commit();
					conn.setAutoCommit(true);
					conn.close();

					// 验证是否有成本中心名称与码表营服中心名称不一致的数据
					Map<String, String> params = new HashMap<String, String>();
					params.put("code", org.getCode());
					List<Map<String, Object>> datas = importCostBudgetService
							.queryNotExistsUnit(params);
					if (datas.size() > 0) {
						resultMsg = "成本中心名称【";
						for (int i = 0; i < datas.size(); i++) {
							Map<String, Object> m = datas.get(i);
							String unit_name = m.get("COST_CENTER_NAME")
									.toString();
							resultMsg += unit_name + "、";
						}
						resultMsg += "】不正确，不能进行导入。";
					}
					// 验证是否重复导入
					if ("".equals(resultMsg)) {
						Map<String, String> p = new HashMap<String, String>();
						p.put("code", org.getCode());
						List<Map<String, Object>> existsDatas = importCostBudgetService
								.queryExistsCostName(p);
						if (existsDatas.size() > 0) {
							for (int i = 0; i < existsDatas.size(); i++) {
								Map<String, Object> exis = existsDatas.get(i);
								String deal_date = String.valueOf(exis
										.get("DEAL_DATE"));
								String cost_center_name = String.valueOf(exis
										.get("COST_CENTER_NAME"));
								resultMsg += deal_date + "帐期"
										+ cost_center_name + "、";
							}
							resultMsg += "已经存在了，不能进行重复导入。";
						}
					}
					if ("".equals(resultMsg)) {
						// 将临时表数据关联出地市和营服中心信息导入到结果表中
						Map<String, String> map = new HashMap<String, String>();
						map.put("code", org.getCode());
						importCostBudgetService.importCostData(map);
					}
					this.reponseJson(resultMsg);
				} catch (Exception e) {
					e.printStackTrace();
					logger.error("成本预算导入失败", e);
					try {
						conn.rollback();
						conn.setAutoCommit(true);
						conn.close();
					} catch (SQLException e1) {
						e1.printStackTrace();
					}
					this.reponseJson("成本预算导入失败");
				} finally {
					if (conn != null) {
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

	}

	/**
	 * 新版excel数据导入
	 */
	public void importNewExcel() {
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String resultMsg = "";
		if (myFile != null && myFile.length > 0) {
			// 删除临时表数据
			Map<String, String> tmp = new HashMap<String, String>();
			tmp.put("area_name", org.getCode());
			importCostBudgetService.deleteCostTemp(tmp);

			List<String[]> list = this.getExcel(myFile[0], 0);
			// 验证成本中心名称和帐期不能为空
			for (int i = 1; i < list.size(); i++) {
				String[] str = list.get(i);
				String str1 = str[1]; 
				if (str1 == null || "".equals(str1.trim())) {
					resultMsg = "成本中心名称不能为空!";
					break;
				}
			}
			// 导入操作
			if ("".equals(resultMsg)) {
				Connection conn = null;
				PreparedStatement pre = null;
				try {
					conn = this.getCon();
					conn.setAutoCommit(false);
					String sql = "INSERT INTO PORTAL.TAB_PORTAL_COST_BUDGET_TEMP(COST_CENTER_CODE,"
							+ "COST_CENTER_NAME,UNIT_ITEM,BUDGET_ITEM_CODE,BUDGET_ITEM_NAME,"
							+ "BUDGET_MONEY,ZSB_RATE,FLAG,DEAL_DATE,AREA_NAME,ACT_ID,ID) "
							+ "VALUES(?,?,?,?,?,?,?,?,?,?,?,?)";
					pre = conn.prepareStatement(sql);
					for (int i = 1; i < list.size(); i++) {
						String[] str = list.get(i);
						int j = 1;
						pre.setString(j++, str[0]);
						pre.setString(j++, str[1]);
						pre.setString(j++, str[2]);
						pre.setString(j++, str[3]);
						pre.setString(j++, str[4]);
						pre.setString(j++, str[5]);
						pre.setString(j++, str[6]);
						pre.setString(j++, str[7]);
						pre.setString(j++, dealDate);
						pre.setString(j++, org.getCode());
						pre.setString(j++, user.getUsername());
						String uuid = UUID.randomUUID().toString()
								.replace("-", "");
						pre.setString(j++, uuid);
						pre.addBatch();
					}
					pre.executeBatch();
					conn.commit();
					conn.setAutoCommit(true);
					conn.close();

					// 验证是否有成本中心名称与码表营服中心名称不一致的数据
					Map<String, String> params = new HashMap<String, String>();
					params.put("code", org.getCode());
					List<Map<String, Object>> datas = importCostBudgetService
							.queryNotExistsUnit(params);
					if (datas.size() > 0) {
						resultMsg = "营服名称【";
						for (int i = 0; i < datas.size(); i++) {
							Map<String, Object> m = datas.get(i);
							String unit_name = m.get("COST_CENTER_NAME")
									.toString();
							resultMsg += unit_name + "、";
						}
						resultMsg += "】不正确，不能进行导入。";
					}
					// 验证是否重复导入
					if ("".equals(resultMsg)) {
						Map<String, String> p = new HashMap<String, String>();
						p.put("code", org.getCode());
						List<Map<String, Object>> existsDatas = importCostBudgetService
								.queryExistsCostName(p);
						if (existsDatas.size() > 0) {
							for (int i = 0; i < existsDatas.size(); i++) {
								Map<String, Object> exis = existsDatas.get(i);
								String cost_center_name = String.valueOf(exis
										.get("COST_CENTER_NAME"));
								resultMsg += dealDate + "帐期"
										+ cost_center_name + "、";
							}
							resultMsg += "已经存在了，不能进行重复导入。";
						}
					}
					if ("".equals(resultMsg)) {
						// 将临时表数据关联出地市和营服中心信息导入到结果表中
						Map<String, String> map = new HashMap<String, String>();
						map.put("code", org.getCode());
						importCostBudgetService.importCostData(map);
					}
					this.reponseJson(resultMsg);
				} catch (Exception e) {
					e.printStackTrace();
					logger.error("成本预算导入失败", e);
					try {
						conn.rollback();
						conn.setAutoCommit(true);
						conn.close();
					} catch (SQLException e1) {
						e1.printStackTrace();
					}
					this.reponseJson("成本预算导入失败");
				} finally {
					if (conn != null) {
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

	}

	/**
	 * 通过id获取成本预算
	 */
	public void loadById() {
		String id = request.getParameter("id");
		Map<String, String> params = new HashMap<String, String>();
		params.put("id", id);
		List<Map<String, Object>> list = importCostBudgetService
				.loadById(params);
		this.reponseJson(list);
	}

	/**
	 * 更新成本预算
	 */
	public void update() {
		try {
			String id = request.getParameter("id");
			String f = request.getParameter("f");
			String budget_money = request.getParameter("budget_money");
			String zsb_rate = request.getParameter("zsb_rate");
			Map<String, String> params = new HashMap<String, String>();
			params.put("id", id);
			params.put("f", f);
			params.put("budget_money", budget_money);
			params.put("zsb_rate", zsb_rate);
			importCostBudgetService.update(params);
			outJsonPlainString(response, "{\"msg\":\"操作成功\"}");
		} catch (Exception e) {
			logger.error("修改成功预算信息失败", e);
			outJsonPlainString(response, "{\"msg\":\"修改成功预算信息失败\"}");
		}
	}

	/**
	 * 模板下载
	 */
	public void downloadTemplate() {
		String path = "portal/costManagement/template/template.xls";
		String fileName = "template.xls";
		try {
			this.download(path, fileName);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 新模板下载
	 */
	public void downloadNewTemplate() {
		String path = "portal/costManagement/template/templateNew.xls";
		String fileName = "templateNew.xls";
		try {
			this.download(path, fileName);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 文件下载
	 * 
	 * @param filePath
	 * @param fileName
	 * @throws IOException
	 */
	public void download(String filePath, String fileName) throws IOException {
		HttpServletResponse response = ServletActionContext.getResponse();
		OutputStream outStream = null;
		InputStream inStream = null;
		try {
			filePath = URLDecoder.decode(filePath, "UTF-8");
			fileName = URLDecoder.decode(fileName, "UTF-8");
			response.setContentType("application/x-msdownload");
			response.setHeader("Content-Disposition", "attachment; filename=\""
					+ fileName + "\"");
			File ff = null;
			String dd = ServletActionContext.getServletContext().getRealPath(
					filePath);
			ff = new File(dd);
			if (ff.exists()) {
				long filelength = ff.length();
				inStream = new FileInputStream(dd);
				outStream = response.getOutputStream();
				// 设置输出的格式
				response.reset();
				response.setContentType("application/x-msdownload");
				response.setContentLength((int) filelength);
				response.addHeader(
						"Content-Disposition",
						"attachment; filename=\""
								+ (new String(fileName.getBytes("gb2312"),
										"iso8859-1")) + "\"");
				// 循环取出流中的数据
				byte[] buffers = new byte[1024];
				int len = 0;
				while ((len = inStream.read(buffers)) != -1) {
					outStream.write(buffers, 0, len);
				}
			}
		} catch (UnsupportedEncodingException e) {
			logger.error(e.getMessage(), e);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		} finally {
			try {
				if (inStream != null) {
					inStream.close();
				}
				if (outStream != null) {
					outStream.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
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
			String deal_date = request.getParameter("deal_date");
			if (StringUtils.isBlank(theme)) {
				throw new BusiException("工单主题不能为空！");
			}
			if (StringUtils.isBlank(nextDealer)) {
				throw new BusiException("请选择下一步审批人！");
			}
			Map<String, String> map = new HashMap<String, String>();
			map.put("title", theme);
			map.put("nextDealer", nextDealer);
			map.put("deal_date", deal_date);
			importCostBudgetService.doSendOrder(map);
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

	/**
	 * 通过工单编号查询成本预算数据
	 */
	public void listByWorkNo() {
		try {
			String businessKey = request.getParameter("businessKey");
			String deal_date = request.getParameter("deal_date");
			String cost_center_name = request.getParameter("cost_center_name");
			if (businessKey == null || "".equals(businessKey)) {
				throw new BusiException("工单编号不空，查询数据失败！");
			}
			if (deal_date != null && !"".equals(deal_date)) {
				resultMap.put("deal_date", deal_date);
			}
			if (cost_center_name != null && !"".equals(cost_center_name.trim())) {
				resultMap.put("cost_center_name", "%" + cost_center_name + "%");
			}
			resultMap.put("businessKey", businessKey);
			Object result = importCostBudgetService.listByWorkNo(resultMap);
			this.reponseJson(result);
		} catch (BusiException e) {
			logger.error(e.getMessage(), e);
			outJsonPlainString(response, "{\"msg\":\"" + e.getMessage() + "\"}");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			logger.error("查询数据失败！", e);
			outJsonPlainString(response, "{\"msg\":\"查询数据失败\"}");
		}
	}

	/**
	 * 查询拒绝原因
	 */
	public void getRrefuseInfo() {
		ResultInfo info = new ResultInfo();
		try {
			String id = request.getParameter("id");
			if (id == null || "".equals(id)) {
				throw new BusiException("拒绝原因查询失败");
			}
			Object result = importCostBudgetService.getRrefuseInfo(id);
			this.reponseJson(result);
		} catch (BusiException e) {
			logger.error(e.getMessage(), e);
			info.setCode(ResultInfo._CODE_FAIL_);
			info.setMsg(e.getMessage());
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			info.setCode(ResultInfo._CODE_FAIL_);
			info.setMsg("拒绝原因查询失败！");
		}
		this.reponseJson(info);
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

	public String getDealDate() {
		return dealDate;
	}

	public void setDealDate(String dealDate) {
		this.dealDate = dealDate;
	}

}
