package org.apdplat.wgreport.tools;

import com.jxcell.CellException;
import com.jxcell.View;
import java.util.Collection;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class JxcellExcelExporter
{
  static final Log logger = LogFactory.getLog(JxcellExcelExporter.class);
  Object title;
  Object data;
  String fileName;
  View jxView;
  int row;
  int col;
  int rowlimit = 65536;
  int numberOfsheets = 0;
  int colMax = -1;
  
  public static void main(String[] args)
  {
    Object[] title = { "标题1", "标题2", "标题3", "标题4", "标题5", 
      "标题6" };
    Object[] o = { "数据1", new Integer(1), new Integer(2), 
      new Integer(3), 0, new Integer(5) };
    Object[][] os = new Object[8000][];
    for (int i = 0; i < os.length; i++) {
      os[i] = o;
    }
    String sp = "d:/temp/测试.xls";
    JxcellExcelExporter jex = new JxcellExcelExporter();
    jex.setFileName(sp);
    jex.setTitle(title);
    for (int i = 0; i < 2; i++)
    {
      jex.setData(os);
      jex.print();
    }
    jex.close();
  }
  
  public void print()
  {
    logger.trace("print() call ...");
    try
    {
      open();
      printData(this.data);
    }
    catch (Exception e)
    {
      logger.error("发生了错误", e);
    }
    finally
    {
      this.data = null;
    }
  }
  
  public void close()
  {
    logger.trace("close() call ...");
    try
    {
      this.jxView.write(this.fileName, (short)4);
    }
    catch (Exception e)
    {
      e.printStackTrace();
      logger.error("发生了错误", e);
    }
    this.jxView.releaseLock();
  }
  
  protected void resetRow()
  {
    if (this.row == this.rowlimit) {
      this.row = 0;
    }
  }
  
  protected void setSheet()
    throws CellException
  {
    if (this.row == 0)
    {
      logger.debug("setSheet() 新建sheet");
      this.jxView.setNumSheets(++this.numberOfsheets);
      
      int sheetIndex = this.numberOfsheets - 1;
      String[] sn = this.fileName.split("\\/|\\\\");
      String sheetName = sn[(sn.length - 1)].replaceAll("(?i)(\\.xls)", "");
      this.jxView.setSheet(sheetIndex);
      this.jxView.setSheetName(sheetIndex, sheetName + this.numberOfsheets);
    }
  }
  
  protected void printTitle()
    throws CellException
  {
    printRow(this.title);
  }
  
  protected void printData(Object d)
    throws CellException
  {
    if ((d instanceof Collection)) {
      printData((Collection)d);
    } else if ((d instanceof Object[])) {
      printData((Object[])d);
    } else if ((d instanceof Map)) {
      printData((Map)d);
    }
  }
  
  protected void printData(Map d)
    throws CellException
  {
    printData(d.values());
  }
  
  protected void printData(Collection d)
    throws CellException
  {
    printData(d.toArray());
  }
  
  protected void printData(Object[] d)
    throws CellException
  {
    for (int i = 0; i < d.length; i++)
    {
      resetRow();
      setSheet();
      if ((isHaveTitle()) && (this.row == 0)) {
        printTitle();
      }
      printRow(d[i]);
    }
  }
  
  protected void printRow(Object o)
    throws CellException
  {
    if (o != null) {
      if ((o instanceof Collection)) {
        printRow((Collection)o);
      } else if ((o instanceof Object[])) {
        printRow((Object[])o);
      } else if ((o instanceof Map)) {
        printRow((Map)o);
      } else {
        throw new UnsupportedOperationException("数据类型不被支持");
      }
    }
  }
  
  protected void printRow(Map m)
    throws CellException
  {
    printRow(m.values());
  }
  
  protected void printRow(Collection c)
    throws CellException
  {
    printRow(c.toArray());
  }
  
  protected void printRow(Object[] d)
    throws CellException
  {
    if (d == null) {
      return;
    }
    int len = getColNum(d);
    for (this.col = 0; this.col < len; this.col += 1)
    {
      Object o = d[this.col];
      if (o != null) {
        if ((o instanceof Number)) {
          this.jxView.setNumber(this.row, this.col, Double.parseDouble(o.toString()));
        } else {
          this.jxView.setText(this.row, this.col, o.toString());
        }
      }
    }
    this.row += 1;
  }
  
  protected int getColNum(Object[] d)
  {
    int len = d.length;
    if ((this.colMax > 0) && (len > this.colMax)) {
      len = this.colMax;
    }
    return len;
  }
  
  protected void open()
  {
    if (this.jxView == null)
    {
      logger.trace("创建视图...");
      this.jxView = new View();
      this.jxView.getLock();
      this.jxView.setCompressed(true);
    }
  }
  
  protected boolean isHaveTitle()
  {
    return this.title != null;
  }
  
  protected void initColMax()
  {
    if ((this.title instanceof Object[])) {
      this.colMax = ((Object[])this.title).length;
    } else if ((this.title instanceof Collection)) {
      this.colMax = ((Collection)this.title).size();
    } else if ((this.title instanceof Map)) {
      this.colMax = ((Map)this.title).size();
    }
  }
  
  public void setTitle(Object title)
  {
    this.title = title;
    initColMax();
  }
  
  public void setData(Object data)
  {
    this.data = data;
  }
  
  public String getFileName()
  {
    return this.fileName;
  }
  
  public void setFileName(String fileName)
  {
    this.fileName = fileName;
  }
}
