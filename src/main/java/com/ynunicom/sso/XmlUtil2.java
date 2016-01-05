package com.ynunicom.sso;

import java.security.cert.Certificate;

import javax.xml.crypto.dom.DOMStructure;
import javax.xml.crypto.dsig.XMLSignature;
import javax.xml.crypto.dsig.XMLSignatureFactory;
import javax.xml.crypto.dsig.dom.DOMValidateContext;

import org.dom4j.Document;
import org.w3c.dom.NodeList;

import com.sso.hp.utils.CertUtil;
import com.sso.hp.utils.XmlUtil;

public class XmlUtil2 {
    public static boolean CheckSign(Document doc, String certPath)
    {
        boolean retvalue = false;
        try
        {
            if(validateXmlSign(doc, CertUtil.getCert(certPath)))
                retvalue = true;
        }
        catch(Exception exception) { }
        return retvalue;
    }
    
    public static boolean validateXmlSign(Document doc, Certificate cert)
    throws Exception
{
    XMLSignatureFactory fac = XMLSignatureFactory.getInstance("DOM");
    org.w3c.dom.Document w3cDom = XmlUtil.parse(doc);
    NodeList list = w3cDom.getElementsByTagNameNS("http://www.w3.org/2000/09/xmldsig#", "Signature");
    java.security.PublicKey pKey = cert.getPublicKey();
    DOMValidateContext valContext = new DOMValidateContext(pKey, list.item(0));
    XMLSignature signature = fac.unmarshalXMLSignature(new DOMStructure(list.item(0)));
    return signature.validate(valContext);
}
}
