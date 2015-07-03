package org.apdplat.module.info.model;

/**
 *
 * @author sun
 */
public enum Lang {
    zh("zh"),en("en");

    private Lang(String symbol) {
        this.symbol = symbol;
    }
    private String symbol;

    public String getSymbol() {
        return symbol;
    }
}