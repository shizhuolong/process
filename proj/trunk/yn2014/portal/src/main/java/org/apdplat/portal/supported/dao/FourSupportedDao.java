package org.apdplat.portal.supported.dao;

import java.util.Map;

import com.github.miemiedev.mybatis.paginator.domain.PageList;


public interface FourSupportedDao {

	
	public PageList<Map<String, Object>> list(Map<String, String> params);
	
	public void importData(Map<String, String> params);
	
	public void update(Map<String, String> params);
	
	public int getDataListCount(Map<String, String> params);
	
	/**
	 * 将工单编号更新到表中
	 * @param params
	 */
	public void updateDataWorkNo(Map<String, String> params);
	
	/**
	 * 通过工单编号查询数据
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> listByWorkNo(Map<String, String> params);

	public void delete(Map<String, String> params);

	public double queryTotalFee(Map<String, String> params);

	public void deleteTemp(Map<String, String> params);

	public void deleteResult(Map<String, String> params);
	
	public void updateStatus(Map<String, String> params);

	public void updateInitId(Map<String, String> params);

	public void deleteResultByEdit(Map<String, String> params);

	public double queryTotalFeeByInitId(Map<String, String> params);
	
}
