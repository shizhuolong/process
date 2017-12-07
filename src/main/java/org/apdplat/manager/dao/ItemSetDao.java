package org.apdplat.manager.dao;

import java.util.List;
import java.util.Map;

import org.apdplat.manager.bean.TreeJson;

public interface ItemSetDao {

	List<Map<String, Object>> listItem();

	List<Map<String, Object>> getCheckIds(Map<String, Object> m);

	void delete(Map<String, Object> m);

	void updateStatus(Map<String, Object> m);

	List<TreeJson> listTreeData();
	
	List<TreeJson> listMenuData();

}
