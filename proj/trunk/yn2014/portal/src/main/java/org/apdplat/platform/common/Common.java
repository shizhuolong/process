package org.apdplat.platform.common;

import org.apdplat.platform.criteria.OrderCriteria;
import org.apdplat.platform.criteria.PageCriteria;
import org.apdplat.platform.criteria.Property;
import org.apdplat.platform.criteria.PropertyCriteria;
import org.apdplat.platform.model.Model;
import org.apdplat.platform.result.Page;
import java.util.List;

public interface Common<T extends Model> {
	/**
	 * CRUD操作中的C
	 * @param model
	 */
    public void create(T model);
    /**
     * CRUD操作中的R
     * @param modelId
     * @return
     */
    public T retrieve(Long modelId);
    /**
     * CRUD操作中的U
     * @param model
     */
    public void update(T model);
    /**
     * CRUD操作中的D
     * @param modelId
     */
    public void delete(Long modelId);


    /**
     * 更新部分属性
     * @param modelId
     * @param propertys
     */
    public void update(Long modelId,List<Property> properties);
    /**
     * 查询第一页数据，默认最新添加的数据排在最前面
     * @return
     */
    public Page<T> query();
    /**
     * 分页查询数据，默认最新添加的数据排在最前面
     * @param pageCriteria 页面条件
     * @return
     */
    public Page<T> query(PageCriteria pageCriteria);
    /**
     *
     * @param pageCriteria 页面条件
     * @param filterCriteria 多个属性过滤条件
     * @param sortCriteria 多个排序条件
     * @return
     */
    public Page<T> query(PageCriteria pageCriteria,PropertyCriteria propertyCriteria);
    /**
     *
     * @param pageCriteria 页面条件
     * @param filterCriteria 多个属性过滤条件
     * @param sortCriteria 多个排序条件
     * @return
     */
    public Page<T> query(PageCriteria pageCriteria,PropertyCriteria propertyCriteria,OrderCriteria orderCriteria);
}