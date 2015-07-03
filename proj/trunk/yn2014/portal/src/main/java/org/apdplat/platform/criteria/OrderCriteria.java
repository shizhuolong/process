package org.apdplat.platform.criteria;

import java.util.LinkedList;
/**
 * 包含多个排序条件
 * @author sun
 */
public class OrderCriteria {
	private LinkedList<Order> orders=new LinkedList<>();

	public LinkedList<Order> getOrders() {
		return orders;
	}

	public void addOrder(Order order) {
		this.orders.add(order);
	}
}