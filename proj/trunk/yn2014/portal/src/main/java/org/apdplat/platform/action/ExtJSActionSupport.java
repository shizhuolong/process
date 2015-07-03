package org.apdplat.platform.action;

import org.apdplat.platform.criteria.PageCriteria;

/**
 *支持Ext JS的分页请求参数
 * @author sun
 */
public abstract class ExtJSActionSupport extends ActionSupport{
    private int start=-1;
    private int limit=-1;

    public void convert(){
        if(start==-1 && limit!=-1){
            PageCriteria pageCriteria=new PageCriteria();
            pageCriteria.setSize(limit);
            super.setPageCriteria(pageCriteria);
        }
        if(start!=-1 && limit!=-1){
            PageCriteria pageCriteria=new PageCriteria();
            int page=(start+limit)/limit;
            int size=limit;
            pageCriteria.setPage(page);
            pageCriteria.setSize(size);
            super.setPageCriteria(pageCriteria);
        }
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
        convert();
    }

    public int getStart() {
        return start;
    }

    public void setStart(int start) {
        this.start = start;
        convert();
    }
}