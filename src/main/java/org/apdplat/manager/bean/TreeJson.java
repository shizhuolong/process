package org.apdplat.manager.bean;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class TreeJson implements Serializable {
   
    private static final long serialVersionUID = 1L;

    private String id; 
    private String pid; 
    private String text; 
    private List<TreeJson> children = new ArrayList<TreeJson>();

public static List<TreeJson> formatTree(List<TreeJson> list) {

        TreeJson root = new TreeJson();
        TreeJson node = new TreeJson();
        List<TreeJson> treelist = new ArrayList<TreeJson>();// 拼凑好的json格式的数据
        List<TreeJson> parentnodes = new ArrayList<TreeJson>();// parentnodes存放所有的父节点
        
        if (list != null && list.size() > 0) {
            root = list.get(0) ;
            //循环遍历oracle树查询的所有节点
            for (int i = 1; i < list.size(); i++) {
                node = list.get(i);
                if(null!=node.getPid()&&node.getPid().equals(root.getId())){
                    //为tree root 增加子节点
                    parentnodes.add(node) ;
                    root.getChildren().add(node) ;
                }else{//获取root子节点的孩子节点
                    getChildrenNodes(parentnodes, node);
                    parentnodes.add(node) ;
                }
            }    
        }
        treelist.add(root) ;
        return treelist ;

    }

    private static void getChildrenNodes(List<TreeJson> parentnodes, TreeJson node) {
        //循环遍历所有父节点和node进行匹配，确定父子关系
        for (int i = parentnodes.size() - 1; i >= 0; i--) {
            
            TreeJson pnode = parentnodes.get(i);
            //如果是父子关系，为父节点增加子节点，退出for循环
            if (pnode.getId().equals(node.getPid())) {
                //pnode.setState("closed") ;//关闭二级树
                pnode.getChildren().add(node) ;
                return ;
            } else {
                //如果不是父子关系，删除父节点栈里当前的节点，
                //继续此次循环，直到确定父子关系或不存在退出for循环
                //parentnodes.remove(i) ;
            }
        }
    }

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public List<TreeJson> getChildren() {
		return children;
	}

	public void setChildren(List<TreeJson> children) {
		this.children = children;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		TreeJson other = (TreeJson) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}
    
	public static String createTreeJson(List<TreeJson> list) {
        JSONArray rootArray = new JSONArray();
        for (int i = 0; i < list.size(); i++) {
        	TreeJson cc = list.get(i);
            // PARENT_ID=0 表示是根节点
            if (cc.getPid() == null || "".equals(cc.getPid())||cc.getPid().contains("null")) {
                JSONObject rootObj = createBranch(list, cc);
                rootArray.add(rootObj);
            }
        }
        String s1 = rootArray.toString();
        return rootArray.toString();
    }

    private static JSONObject createBranch(List<TreeJson> list, TreeJson currentNode) {
        JSONObject currentObj = JSONObject.fromObject(currentNode);
        JSONArray childArray = new JSONArray();
        for (int i = 0; i < list.size(); i++) {
        	TreeJson newNode = list.get(i);
            if (newNode.getPid() != null && newNode.getPid().compareTo(currentNode.getId()) == 0) {
                JSONObject childObj = createBranch(list, newNode);
                childArray.add(childObj);
            }
        }
        /*
         * 判断当前子节点数组是否为空，不为空将子节点数组加入children字段中
		 */
        if (!childArray.isEmpty()) {
            currentObj.put("children", childArray);
        }
        return currentObj;
    }
    
}