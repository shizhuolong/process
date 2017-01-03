package org.apdplat.portal.costManagement.dao;

import java.util.LinkedHashMap;
import java.util.List;

public interface IncomAndDevReportDao {

	
	public List<LinkedHashMap<String,Object>> getDataList(String rows);
}
