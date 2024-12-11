package org.example.sri;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;

@SpringBootApplication
@PropertySource("file:.env")
public class SriApplication {

    public static void main(String[] args) {
        SpringApplication.run(SriApplication.class, args);
    }

}
