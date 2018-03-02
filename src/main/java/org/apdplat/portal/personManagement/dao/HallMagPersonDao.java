package org.apdplat.portal.personManagement.dao;

import java.util.List;
import java.util.Map;





























import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface HallMagPersonDao {

	public PageList<Map<String, Object>> queryMagPerson(Map<String, String> params);
	
	public void del(Map<String, String> m);
	
	public void insertToResult(Map<String, String> m);
    
	public void updateToResult(Map<String, String> m);

    public void updateGroupId();

    public List<Map<String, Object>> query(Map<String, String> params);

    public int getDataListCount(Map<String, String> map);

    public void updateDataWorkNo(Map<String, String> map);

    public void updateFileTempKey(Map<String, String> map);

    public void insertToFileResult(Map<String, String> map);

    public PageList<Map<String, Object>> listByWorkNo(Map<String, String> params);

    public PageList<Map<String, Object>> listPerson(Map<String, String> resultMap);
    
    List<Map<String, Object>> queryFiles(String businessKey);

    public void updateStatus(Map<String, String> params);

    public void delResultByKey(Map<String, String> params);

    public void deleteFilesByKey(String businessKey);
}
