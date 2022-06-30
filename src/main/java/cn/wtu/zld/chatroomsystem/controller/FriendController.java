package cn.wtu.zld.chatroomsystem.controller;

import cn.wtu.zld.chatroomsystem.entity.User;
import cn.wtu.zld.chatroomsystem.service.CurdFriendService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 用作好友管理的Controller层接口。处理和好友相关的请求
 * @author CodeDan
 * @time 2022年04月25日
 * **/
@RestController
public class FriendController {

    @Autowired
    private CurdFriendService curdFriendService;

    private int i = 0;

    @GetMapping("getUser")
    public String getUserList(String inputText){
        //查询指定用户
        System.out.println(inputText);
        List<User> userList = curdFriendService.getUserListByService(inputText);
        System.out.println(userList);
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(userList);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * URL请求，格式为GET，请求内容为获取当前登录用户账号
     * @Return string
     **/
    @GetMapping("getStatus")
    public String getUserState(String userAccount){
        return curdFriendService.getFriendStatusByService(userAccount);
    }

    /**
     * URL请求，格式为GET，请求内容为在线好友列表
     * @param userAccount s
     * @Return string
     **/
    @GetMapping("getFriendList")
    public String getOnlineFriendList(String userAccount){
        System.out.println("这是第"+i+"次");
        List<String> list = curdFriendService.getOnlineFriendListByService(userAccount);
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return null;
    }


    @GetMapping("addOnlineFrined")
    public String addOnlineFriend(String userAccount, String friendAccount){
        curdFriendService.addFriendByService(userAccount,friendAccount);
        return "true";
    }

    @GetMapping("deleteUserFrinedList")
    public String deleteOnlineFrined(String userAccount){
        curdFriendService.deleteAllByService(userAccount);
        return "true";
    }

    @GetMapping("deleteOnlineFriend")
    public String deleteOnlineFriend(String userAccount, String friendAccount){
        curdFriendService.deleteFriendByService(userAccount,friendAccount);
        return "true";
    }

    @GetMapping("addFriendRequest")
    public String addFriendRequest(String userAccount,String friendAccount){
        curdFriendService.addFrendRequestByService(userAccount,friendAccount);
        return "true";
    }

    @GetMapping("deleteFriendRequest")
    public String deleteFriendReqeust(String userAccount, String friendAccount){
        curdFriendService.deleteFriendRequestByService(userAccount,friendAccount);
        return "true";
    }

    @GetMapping("addFriendList")
    public String addFriendList(String userAccount, String friendAccount){
        curdFriendService.updateFriendAndRequestByService(userAccount, friendAccount);
        return "true";
    }

    @GetMapping("deleteFriend")
    public String deleteFriend(String userAccount, String friendAccount){
        curdFriendService.deleteFriendListByService(userAccount,friendAccount);
        return "true";
    }

}
