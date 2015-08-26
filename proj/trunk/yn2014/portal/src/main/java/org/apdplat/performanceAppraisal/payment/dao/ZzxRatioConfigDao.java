package org.apdplat.performanceAppraisal.payment.dao;

import java.util.List;
import java.util.Map;

public interface ZzxRatioConfigDao {
	
	public List<Map<String, Object>> list();

	public void update(Map<String, Object> m);
	
}
