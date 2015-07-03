package org.apdplat.platform.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.persistence.Query;

import org.apdplat.module.module.model.Module;
import org.apdplat.platform.criteria.OrderCriteria;
import org.apdplat.platform.criteria.PageCriteria;
import org.apdplat.platform.criteria.Property;
import org.apdplat.platform.criteria.PropertyCriteria;
import org.apdplat.platform.dao.DaoFacade;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.platform.model.Model;
import org.apdplat.platform.result.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
/**
 * 对任何继承自Model的类进行数据存储操作
 * @author sun
 *
 */
@Service
public  class ServiceFacade{
        protected final APDPlatLogger LOG = new APDPlatLogger(getClass());   
    
	@Resource(name="daoFacade")
	private DaoFacade dao = null;     

        public void setDao(DaoFacade dao) {
            this.dao = dao;
        }

        public void clear(){
            dao.clear();
        }

	@Transactional
	public <T extends Model> void create(T model) {
		dao.create(model);
	}
	@Transactional
	public void createMenuRole(Module model){
			dao.createMemuRole(model);
	}

	public <T extends Model> T retrieve(Class<T> modelClass,Long modelId) {
		T model = dao.retrieve(modelClass,modelId);

                if(model==null){
                    return null;
                }
                return model;
	}

	@Transactional
	public <T extends Model> void update(T model) {
		dao.update(model);
	}

	@Transactional
	public <T extends Model> void update(Class<T> modelClass,Long modelId, List<Property> properties) {
		dao.update(modelClass,modelId, properties);
	}

	@Transactional
	public <T extends Model> void delete(Class<T> modelClass,Long modelId) {
		dao.delete(modelClass,modelId);
	}
	@Transactional
	public <T extends Model> List<Long> delete(Class<T> modelClass,Long[] modelIds) {
                List<Long> ids=new ArrayList<>();
		for(Long modelId : modelIds){
			try{
				this.delete(modelClass,modelId);
                                ids.add(modelId);
			}catch(Exception e){
				LOG.error("删除模型出错",e);
			}
		}
                return ids;
	}

	public <T extends Model> Page<T> query(Class<T> modelClass) {
		Page<T> page = dao.query(modelClass,null);
                return page;
	}

	public <T extends Model> Page<T> query(Class<T> modelClass,PageCriteria pageCriteria) {
		Page<T> page = dao.query(modelClass,pageCriteria,null);
                return page;
	}

	public <T extends Model> Page<T> query(Class<T> modelClass,PageCriteria pageCriteria, PropertyCriteria propertyCriteria) {
		Page<T> page = dao.query(modelClass,pageCriteria, propertyCriteria);
                return page;
	}

	public <T extends Model> Page<T> query(Class<T> modelClass,PageCriteria pageCriteria, PropertyCriteria propertyCriteria, OrderCriteria orderCriteria) {
                Page<T> page = dao.query(modelClass,pageCriteria, propertyCriteria,orderCriteria);
                return page;
	}

	
	public List<Map> queryForMap(String sqlString,Object ...values) {
		return dao.queryForMap(sqlString, values);
	}
	
	public Long getCountBySql(String sql, Object... values) {
		 return dao.getCountBySql(sql, values);
	 }
	
	
}