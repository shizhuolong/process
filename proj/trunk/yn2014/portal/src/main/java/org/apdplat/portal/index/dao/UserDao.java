package org.apdplat.portal.index.dao;

import java.util.List;

import org.apdplat.portal.index.bean.User;

public interface UserDao {
		
	public List<User> getUser(String username);
		
}
