package cn.wtu.zld.chatroomsystem.controller;

import cn.wtu.zld.chatroomsystem.entity.ChatRecord;
import cn.wtu.zld.chatroomsystem.entity.FriendList;
import cn.wtu.zld.chatroomsystem.entity.User;
import cn.wtu.zld.chatroomsystem.service.ChatRecordService;
import cn.wtu.zld.chatroomsystem.service.CurdFriendService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * 用作聊天界面的管理Controller层接口。处理和聊天相关的请求
 * @author CodeDan
 * @time 2022年04月11日
 * **/
@Controller
public class ChatRoomController {

    @Autowired
    private CurdFriendService curdFriendService;

    @Autowired
    private ChatRecordService recordService;

    /**
     * URL请求，格式为GET，请求内容为跳转聊天页面请求
     * @Return string
     **/
    @GetMapping("toMain")
    public ModelAndView redirectMain(HttpServletRequest request){
        ModelAndView modelAndView = new ModelAndView();
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        System.out.println(user);
        modelAndView.addObject("user",user);
        //去获取好友列表
        FriendList friendList = curdFriendService.getFriendListByService(user.getUserAccount());
        //获取初始好友申请列表
        List<User> userList = curdFriendService.getFriendRequestListByService(user.getUserAccount());
        modelAndView.addObject("friendList",friendList);
        modelAndView.addObject("friendRequestList",userList);
        modelAndView.setViewName("main");
        return modelAndView;
    }


    /**
     * URL请求，格式为GET，请求内容为获取当前登录用户账号
     * @Return string
     **/
    @GetMapping("getUserAccount")
    @ResponseBody
    public String getUserAccount(HttpServletRequest request){
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        return user.getUserAccount();
    }


    /**
     * URL请求，格式为GET，请求内容为获取与指定用户的聊天记录
     * @param userAccount 指定用户账号
     * @Return string
     **/
    @GetMapping("getChatRecord")
    @ResponseBody
    public String getChatRecord(String userAccount,HttpServletRequest request){
        //获取当前登录用户
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        String newAccount = user.getUserAccount();
        List<ChatRecord> recordList = recordService.getChatRecord(userAccount, newAccount);
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(recordList);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return null;
    }

    @GetMapping("addChatRecord")
    @ResponseBody
    public String addChatRecord(String userAccount, String friendAccount, String message){
        recordService.addChatRecordByService(userAccount,friendAccount,message);
        return "true";
    }



}
