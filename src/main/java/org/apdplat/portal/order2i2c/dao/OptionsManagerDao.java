package org.apdplat.portal.order2i2c.dao;

import java.util.Map;

public interface OptionsManagerDao {
	
	public void insertToAgents(Map<String, String> params);

	public void saveToAgents(Map<String, String> resultMap);

	public void backZd(Map<String, String> resultMap);
	
}
