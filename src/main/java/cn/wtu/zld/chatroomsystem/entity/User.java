package cn.wtu.zld.chatroomsystem.entity;


import lombok.Data;
import lombok.NonNull;

@Data
@NonNull
public class User {
    private Integer userId ;
    private String userAccount;
    private String password;
    private String photo;
    private String name;
    private String sex;
    private String summary;
}
