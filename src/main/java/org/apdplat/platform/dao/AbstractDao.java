package org.apdplat.platform.dao;

import org.apdplat.platform.criteria.OrderCriteria;
import org.apdplat.platform.criteria.PageCriteria;
import org.apdplat.platform.criteria.Property;
import org.apdplat.platform.criteria.PropertyCriteria;
import org.apdplat.platform.model.Model;
import org.apdplat.platform.result.Page;
import org.apdplat.platform.util.ReflectionUtils;
import java.util.List;


public abstract class AbstractDao<T extends Model> extends DaoSupport implements Dao<T> {
	
	protected Class<T> modelClass;
	
	public AbstractDao(){
            super(MultiDatabase.APDPlat);
            this.modelClass = ReflectionUtils.getSuperClassGenricType(getClass());
        }
        public AbstractDao(MultiDatabase multiDatabase){
            super(multiDatabase);
            this.modelClass = ReflectionUtils.getSuperClassGenricType(getClass());
        }
    
	@Override
	public void create(T model) {
		getEntityManager().persist(model);
	}
	@Override
	public T retrieve(Long modelId) {
		return getEntityManager().find(modelClass, modelId);
	}

	@Override
	public void update(T model) {
		getEntityManager().merge(model);
	}

	@Override
	public void update(Long modelId, List<Property> properties) {
		T model=retrieve(modelId);
		for(Property property : properties){
			ReflectionUtils.setFieldValue(model, property.getName(), property.getValue());
		}
		update(model);
	}

	@Override
	public void delete(Long modelId) {
		getEntityManager().remove(getEntityManager().getReference(modelClass, modelId));
	}

	@Override
	public Page<T> query() {
		return query(null);
	}

	@Override
	public Page<T> query(PageCriteria pageCriteria) {
		return query(pageCriteria,null,defaultOrderCriteria);
	}

	@Override
	public Page<T> query(PageCriteria pageCriteria, PropertyCriteria propertyCriteria) {
		return query(pageCriteria,propertyCriteria,defaultOrderCriteria);
	}
	
	@Override
	public Page<T> query(PageCriteria pageCriteria, PropertyCriteria propertyCriteria, OrderCriteria orderCriteria) {
		return super.queryData(modelClass,pageCriteria, propertyCriteria, orderCriteria);
	}
}