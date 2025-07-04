// package com.bezier.bezier_backend;

// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RestController;

// @RestController
// public class HelloController {

//     @GetMapping("/hello")
//     public String sayHello() {
//         return "HELLO, Backend is working!";
//     }
// }



//DAY-5
// package com.bezier.bezier_backend;

// import com.bezier.bezier_backend.model.EllipseInput;
// import org.springframework.web.bind.annotation.*;

// @RestController
// @CrossOrigin(origins = "http://localhost:4200") // Allow requests from Angular
// public class HelloController {

//     @GetMapping("/hello")
//     public String hello() {
//         return "Hello from Spring Boot backend!";
//     }

//     @PostMapping("/ellipse")
//     public String receiveEllipseData(@RequestBody EllipseInput input) {
//         return "Received ellipse with semiMajor: " + input.getSemiMajor() +
//                ", semiMinor: " + input.getSemiMinor() +
//                ", center: (" + input.getCenterX() + ", " + input.getCenterY() + ")";
//     }
// }




// 20 june 2025 (up(working fine but only 1 segment))

// 


//21 June 2025 (working well(no height elevation data rn))


package com.bezier.bezier_backend;

import com.bezier.bezier_backend.model.EllipseInput;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200") // Allow requests from Angular app
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello from Spring Boot backend!";
    }

    @PostMapping("/ellipse")
    public String receiveEllipseData(@RequestBody EllipseInput input) {
        return "Received ellipse with semiMajor: " + input.getSemiMajor() +
               ", semiMinor: " + input.getSemiMinor() +
               ", center: (" + input.getCenterX() + ", " + input.getCenterY() + ")";
    }

    @PostMapping("/bezier")
    public ResponseEntity<Map<String, List<List<List<Double>>>>> getBezierCurve(@RequestBody EllipseInput input) {
        double a = input.getSemiMajor();
        double b = input.getSemiMinor();
        double cx = input.getCenterX();
        double cy = input.getCenterY();

        double k = 4 * (Math.sqrt(2) - 1) / 3;
        List<List<List<Double>>> bezierSegments = new ArrayList<>();

        bezierSegments.add(Arrays.asList(
            Arrays.asList(cx + a, cy),
            Arrays.asList(cx + a, cy + k * b),
            Arrays.asList(cx + k * a, cy + b),
            Arrays.asList(cx, cy + b)
        ));

        bezierSegments.add(Arrays.asList(
            Arrays.asList(cx, cy + b),
            Arrays.asList(cx - k * a, cy + b),
            Arrays.asList(cx - a, cy + k * b),
            Arrays.asList(cx - a, cy)
        ));

        bezierSegments.add(Arrays.asList(
            Arrays.asList(cx - a, cy),
            Arrays.asList(cx - a, cy - k * b),
            Arrays.asList(cx - k * a, cy - b),
            Arrays.asList(cx, cy - b)
        ));

        bezierSegments.add(Arrays.asList(
            Arrays.asList(cx, cy - b),
            Arrays.asList(cx + k * a, cy - b),
            Arrays.asList(cx + a, cy - k * b),
            Arrays.asList(cx + a, cy)
        ));

        Map<String, List<List<List<Double>>>> response = new HashMap<>();
        response.put("bezierCurve", bezierSegments);

        return ResponseEntity.ok(response);
    }
    @GetMapping("/bezier")
public String explainBezier() {
    return "Use POST with JSON body to get Bezier curve.";
}

    // ✅ Elevation endpoint expected by Angular: /api/check-elevation
    @GetMapping("/api/check-elevation")
    public ResponseEntity<String> checkElevation(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(defaultValue = "2000") double threshold
    ) {
        String url = String.format("http://localhost:8001/check?lat=%f&lon=%f&threshold=%f", lat, lon, threshold);
        RestTemplate restTemplate = new RestTemplate();

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to fetch elevation: " + e.getMessage());
        }
    }
}
