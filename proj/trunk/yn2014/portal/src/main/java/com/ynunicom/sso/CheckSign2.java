package com.ynunicom.sso;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.security.PublicKey;
import java.security.cert.Certificate;
import java.security.cert.CertificateFactory;

import javax.xml.crypto.dom.DOMStructure;
import javax.xml.crypto.dsig.XMLSignature;
import javax.xml.crypto.dsig.XMLSignatureFactory;
import javax.xml.crypto.dsig.dom.DOMValidateContext;

import org.apache.struts2.ServletActionContext;
import org.dom4j.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.sso.hp.utils.XmlUtil;

public class CheckSign2 {

	public  static boolean checkSign(Document doc) {
		try {
			XMLSignatureFactory fac = XMLSignatureFactory.getInstance("DOM");
			org.w3c.dom.Document w3cDom = XmlUtil.parse(doc);
			NodeList list = w3cDom.getElementsByTagNameNS(
					"http://www.w3.org/2000/09/xmldsig#", "Signature");
			Node node = list.item(0);
			String sePath = ServletActionContext.getServletContext().getRealPath("/security/server_rsa.cer");
			System.out.println("############:"+sePath);
			InputStream is = new FileInputStream(sePath);
			Certificate cert = CertificateFactory.getInstance("X.509")
					.generateCertificate(is);
			is.close();
			PublicKey pKey = cert.getPublicKey();

			DOMValidateContext valContext = new DOMValidateContext(pKey, node);
			XMLSignature signature = fac
					.unmarshalXMLSignature(new DOMStructure(node));
			System.out.println("############:"+signature.validate(valContext));
			return signature.validate(valContext);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	
}
