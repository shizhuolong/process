package org.apdplat.portal.channelSubsidyPay.service;

import java.util.HashMap;
import java.util.Map;

import org.apdplat.portal.channelSubsidyPay.dao.ChannelSubsidyDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.miemiedev.mybatis.paginator.domain.PageList;


@Service
public class ChannelSubsidyService {
	@Autowired
	private ChannelSubsidyDao dao;
	/**
	 * 修改
	 * @param params
	 * @return
	 * @throws Exception 
	 */
	public void updateSubsidy(Map<String, String> params) throws Exception {
			dao.updateSubsidy(params);
	}
	/**
	 * 验证渠道编码，本地市下是否存在，同时带出渠道名称
	 * @param params
	 * @return
	 * @throws Exception 
	 */
	public Map<String,String> checkCode(Map<String,String> params) throws Exception{
		return dao.checkCode(params);
	}
	public Map<String,String> existCode(Map<String,String> params) throws Exception{
		return dao.existCode(params);
	}
	
	/**
	 * 询集客的客户经理及渠道经理信息
	 * @param params
	 * @return
	 */
	public Object listSubsidy(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = dao.listSubsidy(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	/**
	 * 删除
	 * @param map
	 * @return 
	 */
	public int deleteSubsidy(Map<String, String> map) {
		return dao.deleteSubsidy(map);
	}
	/**
	 * 新增
	 * @param resultMap
	 * @return
	 */
	public int addSubsidy(Map<String, String> params) {
		return dao.addSubsidy(params);
	}
}
