package org.apdplat.platform.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.persistence.Query;

import org.apdplat.module.module.model.Command;
import org.apdplat.module.module.model.Module;
import org.apdplat.module.security.model.Role;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.criteria.OrderCriteria;
import org.apdplat.platform.criteria.PageCriteria;
import org.apdplat.platform.criteria.Property;
import org.apdplat.platform.criteria.PropertyCriteria;
import org.apdplat.platform.model.Model;
import org.apdplat.platform.result.Page;
import org.apdplat.platform.util.ReflectionUtils;
import org.springframework.stereotype.Repository;
/**
 * 对任何继承自Model的类进行数据存储操作
 * @author sun
 *
 */
@Repository
public  class DaoFacade extends DaoSupport{
        /**
         * 使用默认数据库
         */
        public DaoFacade(){
            super(MultiDatabase.APDPlat);
        }
        /**
         * 使用默认日志数据库
         * @param multiDatabase 
         */
        public DaoFacade(MultiDatabase multiDatabase){
            super(multiDatabase);
        }
        
        public void clear(){
            getEntityManager().clear();
        }

	public <T extends Model> void create(T model) {
		getEntityManager().persist(model);
		/*if(model!=null&&model instanceof Module){
     	   Module m=(Module) model;
     	  
     	   Module pm=null;
     	   Role parent=null;
     	   if(m.getParentModule()!=null){
     		  pm=m.getParentModule();
     		  Query query = getEntityManager()
 					.createQuery(
 							"select r from  Role as r  where r.des='与菜单同步' and r.roleName=?1",Role.class);
 			  query.setParameter(1, pm.getChinese());
 			  List roles=query.getResultList();
 			  if(roles!=null&&roles.size()>0){
 				 parent=(Role)roles.get(0);
 			  }
     	   }
     	  
     	   
     	   
     	   Role r=new Role();
     	   r.setCreateTime(m.getCreateTime());
     	   r.setVersion(0);
     	   r.setDes("菜单同与步");
     	   r.setRoleName(m.getChinese());
     	   r.setSuperManager(false);
     	   r.setOwnerUser(UserHolder.getCurrentLoginUser());
     	   r.setParent(parent);
     	   create(r);
        }
        if(model!=null&&model instanceof Command){
     	   Command c=(Command) model;
     	   String pName="";
     	   Module pm=null;
    	   Role parent=null;
    	   if(c.getModule()!=null){
    		  pm=c.getModule();
    		  Query query = getEntityManager()
					.createQuery(
							"select r from  Role as r  where r.des='与菜单同步' and r.roleName=?1",Role.class);
			  query.setParameter(1, pm.getChinese());
			  List roles=query.getResultList();
			  if(roles!=null&&roles.size()>0){
				 parent=(Role)roles.get(0);
				 pName=parent.getRoleName();
			  }
    	   }
    	   List<Command> commands=new ArrayList<Command>();
    	   commands.add(c);
    	   Role r=new Role();
     	   r.setCreateTime(c.getCreateTime());
     	   r.setVersion(0);
     	   r.setDes("与菜单同步");
     	   r.setRoleName(pName+"("+c.getChinese()+")");
     	   r.setSuperManager(false);
     	   r.setOwnerUser(UserHolder.getCurrentLoginUser());
     	   r.setParent(parent);
     	   r.setCommands(commands);
     	   create(r);
        }*/
	}
	public void createMemuRole(Module model){
		/*String sql="";
		sql+=" insert into portal.apdp_role                                    ";
		sql+=" select * from(                                                  ";
		sql+="   select                                                        ";
		sql+="     m.id id,                                                    ";
		sql+="     sysdate createtime,                                         ";
		sql+="     null updatetime,                                            ";
		sql+="     0 version,                                                  ";
		sql+="     '与菜单同步' des,                                               ";
		sql+="     m.chinese rolename,                                         ";
		sql+="     0 supermanager,                                             ";
		sql+="     1 owneruser_id,                                             ";
		sql+="     m.parentmodule_id parent_id                                 ";
		sql+="   from portal.apdp_module m                                     ";
		sql+="   where m.display=1                                             ";
		sql+="   and m.id='"+model.getId()+"'                                  ";
		sql+="                                                                 ";
		sql+="   union                                                         ";
		sql+="                                                                 ";
		sql+="   select                                                        ";
		sql+="     c.id id,                                                    ";
		sql+="     sysdate createtime,                                         ";
		sql+="     null updatetime,                                            ";
		sql+="     0 version,                                                  ";
		sql+="     '与菜单同步' des,                                               ";
		sql+="     m.chinese||'('||c.chinese||')' rolename,                    ";
		sql+="     0 supermanager,                                             ";
		sql+="     1 owneruser_id,                                             ";
		sql+="     m.id parent_id                                              ";
		sql+="   from portal.apdp_module m                                     ";
		sql+="   join portal.apdp_command c                                    ";
		sql+="   on m.id=c.module_id                                           ";
		sql+="   and m.display=1                                               ";
		sql+="   and m.id='"+model.getId()+"'                                  ";
		sql+="                                                                 ";
		sql+=" )                                                               ";
		
		 Query query = getEntityManager()
 					.createNativeQuery(sql);
		 query.executeUpdate();
		 sql="";
		 sql+=" insert into portal.apdp_role_command             ";
		 sql+="   select id roleid, id commandid                 ";
		 sql+="     from (select c.id id,                        ";
		 sql+="                  sysdate createtime,             ";
		 sql+="                  null updatetime,                ";
		 sql+="                  0 version,                      ";
		 sql+="                  '与菜单同步' des,               ";
		 sql+="                  c.chinese rolename,             ";
		 sql+="                  0 supermanager,                 ";
		 sql+="                  1 owneruser_id,                 ";
		 sql+="                  m.id parent_id                  ";
		 sql+="             from portal.apdp_module m            ";
		 sql+="             join portal.apdp_command c           ";
		 sql+="               on m.id = c.module_id              ";
		 sql+="              and m.display = 1                   ";
		 sql+="              and m.id='"+model.getId()+"'        ";
		 sql+="           )                                      ";
		 
		 Query cquery = getEntityManager()
					.createNativeQuery(sql);
		 cquery.executeUpdate();*/
	}
	public <T extends Model>  T retrieve(Class<T> modelClass,Long modelId) {
                T model=getEntityManager().find(modelClass, modelId);

                return model;
            /*
                //权限控制
                User user=UserHolder.getCurrentLoginUser();
                if(user!=null && !user.isSuperManager() && needPrivilege(modelClass) && model.getOwnerUser()!=null){
                    if(user.getId().intValue()==model.getOwnerUser().getId().intValue()){
                        return model;
                    }
                    if(OrgService.isParentOf(user.getOrg(), model.getOwnerUser().getOrg())){
                        return model;
                    }
                    return null;
                }else{
                    return model;
                }
             * 
             */
	}


	public <T extends Model>  void update(Class<T> modelClass,Long modelId, List<Property> properties) {
		T model=retrieve(modelClass,modelId);
		for(Property property : properties){
			ReflectionUtils.setFieldValue(model, property.getName(), property.getValue());
		}
		update(model);
	}
	public <T extends Model>  void update(T model) {
		getEntityManager().merge(model);
		if (model != null && model instanceof Module) {
			Module m = (Module) model;
			Module om = (Module) retrieve(Module.class, model.getId());
			Query query = getEntityManager()
					.createQuery(
							"update Role as r set r.roleName=?1 where r.des='与菜单同步' and r.roleName=?2");
			query.setParameter(1, m.getChinese());
			query.setParameter(2, om.getChinese());
			query.executeUpdate(); // 影响的记录数

			List<Command> cs = m.getCommands();

			for (Command c : cs) {
				query = getEntityManager()
						.createQuery(
								"update Role as r set r.roleName=?1 where r.des='与菜单同步' and r.roleName=?2");
				query.setParameter(1, m.getChinese() + "(" + c.getChinese()
						+ ")");
				query.setParameter(2, om.getChinese() + "(" + c.getChinese()
						+ ")");
				query.executeUpdate(); // 影响的记录数
			}
		}
		if (model != null && model instanceof Command) {
			Command c = (Command) model;
			Command oc = retrieve(Command.class, c.getId());
			Query query = getEntityManager()
					.createQuery(
							"update Role as r set r.roleName=?1 where r.des='与菜单同步' and r.roleName=?2");
			query.setParameter(1,
					c.getModule().getChinese() + "(" + c.getChinese() + ")");
			query.setParameter(2,
					oc.getModule().getChinese() + "(" + oc.getChinese() + ")");
			query.executeUpdate(); // 影响的记录数
		}
                
            /*
                User user=UserHolder.getCurrentLoginUser();
                if(user!=null && !user.isSuperManager() && needPrivilege(model.getClass())){
                    if(user.getId().intValue()==model.getOwnerUser().getId().intValue()){
                        em.merge(model);
                    }
                    if(OrgService.isParentOf(user.getOrg(), model.getOwnerUser().getOrg())){
                        em.merge(model);
                    }
                }else{
                    em.merge(model);
                }
             * 
             */
	}
	
	public <T extends Model> void delete(Class<T> modelClass,Long modelId) {
                T model=retrieve(modelClass,modelId);
                if(model!=null){
                    getEntityManager().remove(model);
                }
                /*
                User user=UserHolder.getCurrentLoginUser();
                if(user!=null && !user.isSuperManager() && needPrivilege(modelClass)){
                    if(user.getId().intValue()==model.getOwnerUser().getId().intValue()){
                        em.remove(model);
                    }
                    if(OrgService.isParentOf(user.getOrg(), model.getOwnerUser().getOrg())){
                        em.remove(model);
                    }
                }else{
                    em.remove(model);
                }
                 * 
                 */
               /// getEntityManager().
	}

	public <T extends Model>  Page<T> query(Class<T> modelClass) {
		return query(modelClass, null);
	}

	public <T extends Model>  Page<T> query(Class<T> modelClass,PageCriteria pageCriteria) {
		
		return query(modelClass, pageCriteria,null,defaultOrderCriteria);
	}

	public <T extends Model>  Page<T> query(Class<T> modelClass,PageCriteria pageCriteria, PropertyCriteria propertyCriteria) {
		return query(modelClass, pageCriteria,propertyCriteria,defaultOrderCriteria);
	}
	
	public <T extends Model>  Page<T> query(Class<T> modelClass,PageCriteria pageCriteria, PropertyCriteria propertyCriteria, OrderCriteria orderCriteria) {
		return super.queryData(modelClass,pageCriteria, propertyCriteria, orderCriteria);
	}
	
	
	public List<Map> queryForMap(String sqlString,Object ...values) {
		return super.queryForMap(sqlString, values);
	}
	
	 public Long getCountBySql(String sql, Object... values) {
		 return super.getCountBySql(sql, values);
	 }
	
	
}