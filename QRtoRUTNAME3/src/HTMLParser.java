



import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;

public class HTMLParser {

    public String GetName(String rut,String dv){
    	
        Document doc;
        try {

            // need http protocol
            //doc = Jsoup.connect("https://zeus.sii.cl/cvc_cgi/nar/nar_consulta?RUT=21779539&DV=7&ACEPTAR=Consultar").get();
        	doc = Jsoup.connect("https://zeus.sii.cl/cvc_cgi/nar/nar_consulta?RUT="+rut+"&DV="+dv+"&ACEPTAR=Consultar").get();

            // get page title
            String title = doc.title();
            System.out.println("title : " + title);

            // get all links
            Elements links = doc.select("font[class]");
            Object[] objects = links.toArray();
            /*for (Element link : links) {

                // get the value from href attribute
                System.out.println("\nlink : " + link.attr("class"));
                System.out.println("text : " + link.text());

            }*/
            
            Element link  = (Element) objects [3];
            
            Element rutResponse  = (Element) objects [5];
            
            if(rutResponse.text().equalsIgnoreCase(rut +"-"+dv)){
            	return link.text();
            }                                    

        } catch (IOException e) {
            e.printStackTrace();
        }
        
        return null;
    	
    }
}
