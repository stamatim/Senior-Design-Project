import java.io.BufferedReader; 
import java.io.InputStreamReader;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.*;
import java.io.OutputStream;
import java.io.File;
import java.io.IOException;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
import java.net.MalformedURLException;
import com.cyberbotics.webots.controller.Robot;
import com.cyberbotics.webots.controller.Motor;
import com.cyberbotics.webots.controller.Camera;
import com.cyberbotics.webots.controller.Compass;
import com.cyberbotics.webots.controller.GPS;
import com.cyberbotics.webots.controller.Gyro;
import com.cyberbotics.webots.controller.InertialUnit;
import com.cyberbotics.webots.controller.Keyboard;
import com.cyberbotics.webots.controller.LED;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;
import com.google.zxing.BinaryBitmap;
import com.google.zxing.ChecksumException;
import com.google.zxing.FormatException;
import com.google.zxing.NotFoundException;
import com.google.zxing.RGBLuminanceSource;
import com.google.zxing.Result;
import com.google.zxing.common.HybridBinarizer;
import com.google.zxing.qrcode.QRCodeReader;

public class mavicJavaTest {
  public static void main(String[] args) {
    Robot drone = new Robot();
    int timeStep = (int) Math.round(drone.getBasicTimeStep());
    
    //get and enable devices
    Camera camera = drone.getCamera("camera");
    camera.enable(timeStep);
    LED frontLeftLED = drone.getLED("front left led");
    LED frontRightLED = drone.getLED("front right led");
    InertialUnit imu = drone.getInertialUnit("inertial unit");
    imu.enable(timeStep);
    GPS gps = drone.getGPS("gps");
    gps.enable(timeStep);
    Compass compass = drone.getCompass("compass");
    compass.enable(timeStep);
    Gyro gyro = drone.getGyro("gyro");
    gyro.enable(timeStep);
    Keyboard keyboard = new Keyboard();
    keyboard.enable(timeStep);
    Motor cameraRollMotor = drone.getMotor("camera roll");
    Motor cameraPitchMotor = drone.getMotor("camera pitch");
    // Motor cameraYawMotor = drone.getMotor("camera yaw"); // Not used in this example.
    
    // Get propeller motors and set them to velocity mode.
    Motor frontLeftMotor = drone.getMotor("front left propeller");
    frontLeftMotor.setPosition(Double.POSITIVE_INFINITY);
    frontLeftMotor.setVelocity(1.0); 
    Motor frontRightMotor = drone.getMotor("front right propeller");
    frontRightMotor.setPosition(Double.POSITIVE_INFINITY);
    frontRightMotor.setVelocity(1.0);    
    Motor rearLeftMotor = drone.getMotor("rear left propeller");
    rearLeftMotor.setPosition(Double.POSITIVE_INFINITY);
    rearLeftMotor.setVelocity(1.0);    
    Motor rearRightMotor = drone.getMotor("rear right propeller");
    rearRightMotor.setPosition(Double.POSITIVE_INFINITY);
    rearRightMotor.setVelocity(1.0); 

    
    System.out.println("Start the drone...");
      sendStatus("Online");
    //wait 1 seconds
    while (drone.step(timeStep) != -1) {
      if(drone.getTime() > 1)
        break;
    }
    
    // Display manual control message.
    System.out.println("You can control the drone with your computer keyboard");
    System.out.println("- 'up': move forward.");
    System.out.println("- 'down': move backward.");
    System.out.println("- 'right': turn right.");
    System.out.println("- 'left': turn left.");
    System.out.println("- 'shift + up': increase the target altitude.");
    System.out.println("- 'shift + down': decrease the target altitude.");
    System.out.println("- 'shift + right': strafe right.");
    System.out.println("- 'shift + left': strafe left.");
    System.out.println("- 'control + down': save image");
    System.out.println("- 'control + left': start automation left");
    System.out.println("- 'control + right': start automation right");
    System.out.println("- 'control + up': cancel automation");
    
    // Constants, empirically found.
    final double k_vertical_thrust = 68.5;  // with this thrust, the drone lifts.
    final double k_vertical_offset = 0.6;   // Vertical offset where the robot actually targets to stabilize itself.
    final double k_vertical_p = 3.0;        // P constant of the vertical PID.
    final double k_roll_p = 50.0;           // P constant of the roll PID.
    final double k_pitch_p = 30.0;          // P constant of the pitch PID.
    
    // Variables.
    double target_altitude = 1.21;
    double time;
    double roll;
    double pitch;
    double altitude;
    double roll_acceleration;
    double pitch_acceleration;
    int led_state;
    double roll_disturbance;
    double pitch_disturbance = 0;
    double yaw_disturbance;
    int key;
    double roll_input;
    double pitch_input;
    double yaw_input;
    double clamped_difference_altitude;
    double vertical_input;
    double front_left_motor_input;
    double front_right_motor_input;
    double rear_left_motor_input;
    double rear_right_motor_input;
    //image variables
    String picFileName="";
    int i = 0;
    int startAuto = 100001;
    int picsTakenSinceAuto = 0;
    boolean imageSuccess = false;
    boolean isRight = true;
    // Main Loop
    while (drone.step(timeStep) != -1) {
      time = drone.getTime();
      if(target_altitude < .2)
        sendStatus("Offline");    
      
      // Retrieve robot position using the sensors.
      roll = imu.getRollPitchYaw()[0] + Math.PI / 2.0;
      pitch = imu.getRollPitchYaw()[1];
      altitude = gps.getValues()[1];
      roll_acceleration = gyro.getValues()[0];
      pitch_acceleration = gyro.getValues()[1];
      
      // Blink the front LEDs alternatively with a 1 second rate.
      //1 == on; 2 == off
      led_state = ((int)time) % 2;
      frontLeftLED.set(led_state);
      frontRightLED.set(led_state);
      
      // Stabilize the Camera by actuating the camera motors according to the gyro feedback.
      cameraRollMotor.setPosition(-0.115 * roll_acceleration);
      cameraPitchMotor.setPosition(-0.1 * pitch_acceleration);
      
      // Transform the keyboard input to disturbances on the stabilization algorithm.
      roll_disturbance = 0.05;
      pitch_disturbance = -0.15;
      yaw_disturbance = 0.001;
      key = keyboard.getKey();
      if(startAuto < 10000){
          if(startAuto == 0){
            if(isProcessed(camera, i, picFileName)){
              if(isRight)
                roll_disturbance = -.8;
              else
                roll_disturbance = 1;
              startAuto++;
              picsTakenSinceAuto++;
            }else{
              roll_disturbance = 0.05;
            }         
          }else if(key == (Keyboard.CONTROL + Keyboard.UP)){
            startAuto = 10001;
            sendStatus("Online");
          }else if(picsTakenSinceAuto == 1){
            if(startAuto % 550 == 0){       
              if(isProcessed(camera, i, picFileName)){
                if(isRight)
                  roll_disturbance = -.8;
                else
                  roll_disturbance = 1;
                startAuto++; 
                picsTakenSinceAuto++; 
            }else{
              roll_disturbance = 0.05;
            }
          }else{
            if(isRight)
              roll_disturbance = -1;
            else
              roll_disturbance = 1.2;
            startAuto++;
          }
        }else if(picsTakenSinceAuto % 6 == 0 ){ 
          if(startAuto % 950 == 0){
            if(isProcessed(camera, i, picFileName)){
              if(isRight)
                roll_disturbance = -.8;
              else
                roll_disturbance = 1;
              startAuto++; 
              picsTakenSinceAuto++; 
            }else{
              roll_disturbance = 0.05;
            }
          }else{
            if(isRight)
              roll_disturbance = -1;
            else
              roll_disturbance = 1.2;
            startAuto++;
          }     
        }else if(startAuto % 450 == 0 && picsTakenSinceAuto % 6 != 0){
          if(isProcessed(camera, i, picFileName)){
            if(isRight)
              roll_disturbance = -.8;
            else
              roll_disturbance = 1;
            startAuto++; 
            picsTakenSinceAuto++; 
          }else{
            roll_disturbance = 0.05;
          }
        }else{
          if(isRight)
            roll_disturbance = -1;
          else
            roll_disturbance = 1.1;
          startAuto++; 
        }
      }else{
        while (key > 0) {        
          switch (key) {
            case Keyboard.UP:
              pitch_disturbance = 1.0;
              break;
            case Keyboard.DOWN:
              pitch_disturbance = -1.0;
              break;
            case Keyboard.RIGHT:
              yaw_disturbance = 1.0;
              break;
            case Keyboard.LEFT:		  
              yaw_disturbance = -1.0;
              break;
            case (Keyboard.SHIFT + Keyboard.RIGHT):
              roll_disturbance = -1;
              break;
            case (Keyboard.SHIFT + Keyboard.LEFT):
              roll_disturbance = 1;
              break;
            case (Keyboard.SHIFT + Keyboard.UP):
              target_altitude += 0.05;
              System.out.println("target altitude: " + target_altitude);
              break;
            case (Keyboard.SHIFT + Keyboard.DOWN):
              target_altitude -= 0.05;
              System.out.println("target altitude: " + target_altitude);
              break;
            case (Keyboard.CONTROL + Keyboard.DOWN):              
              isProcessed(camera, i, picFileName);
              sendStatus("Scanning Inventory");
              break;
            case(Keyboard.CONTROL + Keyboard.RIGHT):
              System.out.println("start automation");  
              sendStatus("Autonomy Started");
              startAuto = 0;
              picsTakenSinceAuto = 0;   
              isRight = true;                   
              break;
            case(Keyboard.CONTROL + Keyboard.LEFT):
              System.out.println("start automation"); 
              sendStatus("Autonomy Started");
              startAuto = 0;
              picsTakenSinceAuto = 0;   
              isRight = false;                    
              break;              
            }        
          key = keyboard.getKey();
        }
      }
      // Compute the roll, pitch, yaw and vertical inputs.
      roll_input = k_roll_p * clamp(roll, -1.0, 1.0) + roll_acceleration + roll_disturbance;
      pitch_input = k_pitch_p * clamp(pitch, -1.0, 1.0) - pitch_acceleration + pitch_disturbance;
      yaw_input = yaw_disturbance;
      clamped_difference_altitude = clamp(target_altitude - altitude + k_vertical_offset, -1.0, 1.0);
      vertical_input = k_vertical_p * Math.pow(clamped_difference_altitude, 3.0);
      
      // Actuate the motors taking into consideration all the computed inputs.
      front_left_motor_input = k_vertical_thrust + vertical_input - roll_input - pitch_input + yaw_input;
      front_right_motor_input = k_vertical_thrust + vertical_input + roll_input - pitch_input - yaw_input;
      rear_left_motor_input = k_vertical_thrust + vertical_input - roll_input + pitch_input - yaw_input;
      rear_right_motor_input = k_vertical_thrust + vertical_input + roll_input + pitch_input + yaw_input;
      frontLeftMotor.setVelocity(front_left_motor_input);
      frontRightMotor.setVelocity(-front_right_motor_input);
      rearLeftMotor.setVelocity(-rear_left_motor_input);
      rearRightMotor.setVelocity(rear_right_motor_input);       
    }
  }
  
  private static int automation(int startAuto, double roll_disturbance, Camera camera, int i, String picFileName, int picsTakenSinceAuto, boolean isRight, int key){
      
    return startAuto;     
  }
  
  private static void sendStatus(String status){
    try{
      URL url = new URL("http://localhost:5000/Status");
      HttpURLConnection con = (HttpURLConnection)url.openConnection();  
      con.setDoOutput(true);
      con.setDoInput(true);
      con.setRequestProperty("Content-Type", "application/json");
      con.setRequestProperty("Method", "POST");
      OutputStream os = con.getOutputStream();
      String json = "{\"status\":\"" + status + "\"}";
      os.write(json.toString().getBytes("UTF-8"));
      os.close();
      
      int HttpResult = con.getResponseCode();
      if(HttpResult != HttpURLConnection.HTTP_OK){
        System.out.println(con.getResponseCode());
        System.out.println(con.getResponseMessage());
      }
    }catch(Exception e){
      e.printStackTrace();
    }		
  }
  
  private static Boolean isProcessed(Camera camera, int i, String picFileName){
    try{
      //Take and Save Image
      picFileName = SaveImage(camera, i);
      i++;              
      String qrData = getQRCode(picFileName);
      sendImageTest(picFileName, qrData);
      Thread.sleep(1000);
      return true;
    }catch(Exception e){
      e.printStackTrace();
      i--;
      return false;
    }
  }
  
  private static String getQRCode(String pathName) throws IOException, NotFoundException, ChecksumException, FormatException {
    File file = new File(pathName);
    BufferedImage image = null;
    BinaryBitmap bitmap = null;
    Result result = null;
    image = ImageIO.read(file);
    int[] pixels = image.getRGB(0, 0, image.getWidth(), image.getHeight(), null, 0, image.getWidth());
    RGBLuminanceSource source = new RGBLuminanceSource(image.getWidth(), image.getHeight(), pixels);
    bitmap = new BinaryBitmap(new HybridBinarizer(source));
    QRCodeReader reader = new QRCodeReader();
    result = reader.decode(bitmap);
    return result.getText();	  
  }
  
  private static String SaveImage(Camera camera, int picsTaken){
    String picFileName = "Image_" + picsTaken + ".jpg";
    camera.getImage();
    camera.saveImage(picFileName, 100);
    return picFileName;
  }
  
  private static void sendImageTest(String picFileName, String qrData) throws MalformedURLException, IOException {
    //TODO change to process_item after pulling
    //TODO change port to 5000 after pulling
    URL url = new URL("http://localhost:5000/process_item");
    HttpURLConnection con = (HttpURLConnection)url.openConnection();  
    con.setDoOutput(true);
    con.setDoInput(true);
    con.setRequestProperty("Content-Type", "application/json");
    con.setRequestProperty("Method", "POST");
    OutputStream os = con.getOutputStream();
    String json = "{\"title\":\"" + qrData + "\"}";
    os.write(json.toString().getBytes("UTF-8"));
    os.close();
      
    StringBuilder sb = new StringBuilder();  
    int HttpResult =con.getResponseCode();
    if(HttpResult ==HttpURLConnection.HTTP_OK){
      BufferedReader br = new BufferedReader(new   InputStreamReader(con.getInputStream(),"utf-8"));  
  
      String line = null;
      while ((line = br.readLine()) != null) {  
        sb.append(line + "\n");  
      }
      br.close(); 
      System.out.println(""+sb.toString());  
    }else{
      System.out.println(con.getResponseCode());
      System.out.println(con.getResponseMessage());  
    }  		
  }

  private static double clamp(double input, double low, double high){
    if(input < low){
      return low;   
    } else {
      if(input > high){
        return high;
      }else{
         return input;
      }
    }    
  }
}