package org.apdplat.portal.order2i2c.service;

import java.util.Map;

import org.apdplat.portal.order2i2c.dao.OptionsManagerDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OptionsManagerService {

	@Autowired
	private OptionsManagerDao dao;
	
	@Transactional
	public void insert(Map<String, String> params) {
		dao.insert(params);
	}

	public void save(Map<String, String> resultMap) {
		dao.save(resultMap);
	}
	
}
