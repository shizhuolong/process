package org.apdplat.wgreport.detail;

public class ExcelExportServiceUtil
{
  private static ExcelExportService _service;
  
  public static ExcelExportService getService()
  {
    if (_service == null) {
      throw new RuntimeException("ExcelExportService is not set");
    }
    return _service;
  }
  
  public void setService(ExcelExportService service)
  {
    _service = service;
    System.out.println("ExcelExportService is set");
  }
}
