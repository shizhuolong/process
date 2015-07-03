package org.apdplat.wgreport.detail;

public abstract interface DetailDownload
{
  public abstract boolean if_immediate_download(String paramString1, String paramString2, Object[] paramArrayOfObject, String paramString3, String paramString4);
  
  public abstract String doDownLoad(String paramString1, String paramString2, String paramString3, Object[] paramArrayOfObject);
  
  public abstract void addDownloadTask(String paramString1, String paramString2, Object[] paramArrayOfObject, String paramString3, String paramString4, String paramString5, String paramString6);
}
