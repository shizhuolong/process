package org.apdplat.portal.order2i2c.service;

import java.util.Map;

import org.apdplat.portal.order2i2c.dao.SalesManagerDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SalesManagerService {

	@Autowired
	private SalesManagerDao dao;
	
	@Transactional
	public void insert(Map<String, String> resultMap) {
		dao.insert(resultMap);
	}

	public void update(Map<String, String> resultMap) {
		dao.update(resultMap);
	}
	
}
