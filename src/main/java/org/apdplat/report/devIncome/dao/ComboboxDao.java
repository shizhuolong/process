package org.apdplat.report.devIncome.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

public interface ComboboxDao {
	
	public List<Map<String, Object>> listOutBounds(@Param("name")String name);
}
