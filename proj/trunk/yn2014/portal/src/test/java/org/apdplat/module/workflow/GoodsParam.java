package org.apdplat.module.workflow;

public class GoodsParam {
	private int userId;
	private int goodsGroupId;
	private Goods[] goodsList;
	public int getUserId() {
		return userId;
	}
	public void setUserId(int userId) {
		this.userId = userId;
	}
	public int getGoodsGroupId() {
		return goodsGroupId;
	}
	public void setGoodsGroupId(int goodsGroupId) {
		this.goodsGroupId = goodsGroupId;
	}
	public Goods[] getGoodsList() {
		return goodsList;
	}
	public void setGoodsList(Goods[] goodsList) {
		this.goodsList = goodsList;
	}
}

class Goods{
	private String goodsId;
	private String productId;
	private String goodsNumber;
	public String getGoodsId() {
		return goodsId;
	}
	public void setGoodsId(String goodsId) {
		this.goodsId = goodsId;
	}
	public String getProductId() {
		return productId;
	}
	public void setProductId(String productId) {
		this.productId = productId;
	}
	public String getGoodsNumber() {
		return goodsNumber;
	}
	public void setGoodsNumber(String goodsNumber) {
		this.goodsNumber = goodsNumber;
	}
	
}
