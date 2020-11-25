package test;


import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Base64;

public class test {

	public static String encoder(String imagePath) {
		  String base64Image = "";
		  File file = new File(imagePath);
		  try (FileInputStream imageInFile = new FileInputStream(file)) {
		    // Reading a Image file from file system
		    byte imageData[] = new byte[(int) file.length()];
		    imageInFile.read(imageData);
		    base64Image = Base64.getEncoder().encodeToString(imageData);
		  } catch (FileNotFoundException e) {
		    System.out.println("Image not found" + e);
		  } catch (IOException ioe) {
		    System.out.println("Exception while reading the Image " + ioe);
		  }
		  return base64Image;
		}
	 public static void main(String[] args) {
		 System.out.println(encoder("C:\\photo.png"));
	 }
}
