package cn.wtu.zld.chatroomsystem;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan(basePackages="cn.wtu.zld.chatroomsystem.mapper")
public class ChatRoomSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChatRoomSystemApplication.class, args);
    }

}
