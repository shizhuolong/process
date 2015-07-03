package org.apdplat.portal.channelManagement.dao;

import java.util.List;
import java.util.Map;





import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface NotReatyManagerDao {

	/**
	 * 查询无协议渠道组织架构
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listTreeNode(Map<String, Object> params);
	
	/**
	 * 查询无协议渠道信息
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> list(Map<String, String> params) throws Exception;
	
	/**
	 * 查询地市
	 */
	public List<Map<String,String>> listArea(Map<String, String> params);
	/**
	 * 查询营服中心
	 */
	public List<Map<String,Object>> listServiceCenter(Map<String, String> params);
	/**
	 * 查询某地市下是否存在该渠道名称
	 * @return 
	 */
	public List<Map<String,Object>> hasChanlName(Map<String, String> params);
	/**
	 * 根据渠道编码获取渠道名称和编码
	 * @return 
	 */
	public List<Map<String,Object>> getChanlByCode(Map<String, String> params);
	
	/**
	 * 获取可以选择的渠道经理列表
	 * @return 
	 */
	public PageList<Map<String, Object>> listValidUsers(Map<String, String> params);
	
	/**
	 * 新增无协议渠道
	 * @param params
	 * @return
	 */
	public int addUnit(Map<String, String> params);
	/**
	 * 更新无协议渠道
	 * @param params
	 * @return
	 */
    public int updateUnit(Map<String, String> params);
    /**
	 * 失效无协议渠道
	 * @param params
	 * @return
	 */
    public int delUnit(Map<String, String> params);
    /**
	 * 获取无协议渠道
	 * @param params
	 * @return
	 */
	public Map<String, Object> getUnit(Map<String, String> params);
	/**
	 * 获取无协议渠道图片
	 * @param params
	 * @return
	 */
	public Map<String, Object> getPic(Map<String, String> params);
	
}
