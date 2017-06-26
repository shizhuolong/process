package org.apdplat.portal.order2i2c.dao;

import java.util.Map;

public interface OptionsManagerDao {
	
	public void insert(Map<String, String> params);

	public void save(Map<String, String> resultMap);
	
}
