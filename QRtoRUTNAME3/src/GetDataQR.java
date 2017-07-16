

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.MalformedURLException;
import java.net.URL;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class GetDataQR
 */
@WebServlet("/GetDataQR")
public class GetDataQR extends HttpServlet {
	private static final long serialVersionUID = 1L;

	
	QREngine qrEngine = new QREngine();
	
	HTMLParser htmlParser = new HTMLParser();
    /**
     * Default constructor. 
     */
    public GetDataQR() {
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
//response.getWriter().append("Served at: ").append(request.getContextPath());
		
		String urlImage = request.getParameter("urlImage");
		String file = savedFile(urlImage) ;		
		String url = qrEngine.getURLConsultRut(file);		
		String rut = getRUT(url);
		
		String name = htmlParser.GetName(rut.split("-")[0],rut.split("-")[1]);
		
		
		response.getWriter().append("{\"nombre\":\""+name+"\",\"rut\":\""+rut+"\"}");;
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}
	
	
	
	public String getRUT(String url){
		System.out.println("url: " + url);
		
		int i = url.indexOf("=");		
		int f = url.indexOf("&t");
		
		String rut = url.substring((i+1), f);
		
		
		System.out.println("rut: " + rut );
		
		return rut;
	}
				
	public String savedFile(String url){
		
		 URL ficheroUrl = null;
		 //cheroUrl.getFile();
		try {
			ficheroUrl = new URL(url);
	
		   InputStream inputStream;
		
			inputStream = ficheroUrl.openStream();
		
		System.out.println("nombre: " + url.substring( url.lastIndexOf('/')+1, url.length()));
//   OutputStream outputStream = new FileOutputStream("C:\\var\\"+ url.substring( url.lastIndexOf('/')+1, url.length()));// path y nombre del nuevo fichero creado
		   OutputStream outputStream = new FileOutputStream("/var/img/"+ url.substring( url.lastIndexOf('/')+1, url.length()));// path y nombre del nuevo fichero creado
		 
		   byte[] b = new byte[2048];
		   int longitud;
		 
		   while ((longitud = inputStream.read(b)) != -1) {
		      outputStream.write(b, 0, longitud);
		   }
		 
		   inputStream.close();  // Cerramos la conexión entrada
		   outputStream.close(); //

		   return url.substring( url.lastIndexOf('/')+1, url.length());
		   
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return null;
	}

	
	
	
	
}
