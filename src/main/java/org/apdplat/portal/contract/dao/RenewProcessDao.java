package org.apdplat.portal.contract.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface RenewProcessDao {

    PageList<Map<String, Object>> list(Map<String, String> resultMap);

    void renew(Map<String, String> resultMap);

    PageList<Map<String, Object>> findByIds(Map<String, String> param);

    Map<String, Object> findById(String id);
    
    public void update(Map<String, String> params);

	public void updateDataWorkNo(Map<String, String> params);
	
	void updateDataWorkNoByIds(Map<String, String> map); 

	PageList<Map<String, Object>> listByWorkNo(Map<String, String> params);
	
	public void updateStatus(Map<String, String> params);

	public void updateInitId(Map<String, String> params);
	
	public void updateInitIdByIds(Map<String, String> params);
	
	void delTemp(String regionCode);

	void delResultByKey(Map<String, String> params);
	
	void delResultNotKey(Map<String, String> params);

	void importToResult(Map<String, String> params);

	List<Map<String, Object>> queryFiles(String businessKey);

	void updateFileTempKey(Map<String, String> map);

	void insertToFileResult(Map<String, String> map);

	void deleteFilesByKey(String businessKey);

	void updateOldData(@Param(value="ids")String ids);

}
