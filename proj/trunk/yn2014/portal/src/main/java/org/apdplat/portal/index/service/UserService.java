package org.apdplat.portal.index.service;

import java.util.List;
import org.apdplat.portal.index.bean.User;
import org.apdplat.portal.index.dao.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
	@Autowired
	private UserDao dao;
	public List<User> getUser(String username){
		List<User> user=dao.getUser(username);
		return user;
	}
	
}
