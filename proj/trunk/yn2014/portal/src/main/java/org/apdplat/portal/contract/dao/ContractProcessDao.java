package org.apdplat.portal.contract.dao;

import java.util.List;
import java.util.Map;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface ContractProcessDao {

    PageList<Map<String, Object>> list(Map<String, String> params);

    void addChannel(Map<String, String> params);

    Map<String, Object> findById(String id);

    void updateChannel(Map<String, String> params);

	int getDataListCount(Map<String, String> map);
	
    public void update(Map<String, String> params);

	public void updateDataWorkNo(Map<String, String> params);

	PageList<Map<String, Object>> listByWorkNo(Map<String, String> params);
	
	public void updateStatus(Map<String, String> params);

	public void updateInitId(Map<String, String> params);
	
	void delTemp(String regionCode);

	void delResultByKey(Map<String, String> params);
	
	void delResultNotKey(Map<String, String> params);

	void importToResult(Map<String, String> params);

	List<Map<String, Object>> queryFiles(String businessKey);

	void updateFileTempKey(Map<String, String> map);

	void insertToFileResult(Map<String, String> map);

	void deleteFilesByKey(String businessKey);

    Map<String, Object> findByChanCode(Map<String, String> resultMap);

    void updateChanName();

}
