package org.apdplat.report.devIncome.service;

import java.util.List;
import java.util.Map;

import org.apdplat.report.devIncome.dao.ComboboxDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ComboboxService {
	@Autowired
	private ComboboxDao dao;

	public List<Map<String, Object>> listOutBounds(String name) {
		return dao.listOutBounds(name);
	}
	
}
