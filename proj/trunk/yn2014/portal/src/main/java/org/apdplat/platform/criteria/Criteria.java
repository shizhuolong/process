package org.apdplat.platform.criteria;
/**
 * 条件符号定义
 * @author sun
 *
 */
public enum Criteria {
	and("and"),or("or");
	private Criteria(String symbol){
		this.symbol=symbol;
	}
	
	private String symbol;
	
	public String getSymbol() {
		return symbol;
	}
}