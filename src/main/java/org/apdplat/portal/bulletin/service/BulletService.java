package org.apdplat.portal.bulletin.service;

import java.util.Map;

import org.apdplat.portal.bulletin.dao.BulletDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class BulletService {
	
	@Autowired
	private BulletDao dao;

	public void update(Map<String, Object> m) {
		dao.update(m);
	}
}	
	
	
	
