package org.apdplat.platform.model;

/**
 *
 * @author sun
 */
public class ModelFieldData {
    private String english;
    private String chinese;
    private String type;
    private String simpleDic;
    private String treeDic;
    private boolean manyToOne;
    private String manyToOneRef;

    public boolean isManyToOne() {
        return manyToOne;
    }

    public void setManyToOne(boolean manyToOne) {
        this.manyToOne = manyToOne;
    }

    public String getManyToOneRef() {
        return manyToOneRef;
    }

    public void setManyToOneRef(String manyToOneRef) {
        this.manyToOneRef = manyToOneRef;
    }

    public String getSimpleDic() {
        return simpleDic;
    }

    public void setSimpleDic(String simpleDic) {
        this.simpleDic = simpleDic;
    }

    public String getTreeDic() {
        return treeDic;
    }

    public void setTreeDic(String treeDic) {
        this.treeDic = treeDic;
    }


    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getChinese() {
        return chinese;
    }

    public void setChinese(String chinese) {
        this.chinese = chinese;
    }

    public String getEnglish() {
        return english;
    }

    public void setEnglish(String english) {
        this.english = english;
    }    
}