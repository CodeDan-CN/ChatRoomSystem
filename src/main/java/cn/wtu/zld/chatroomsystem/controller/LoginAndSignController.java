package cn.wtu.zld.chatroomsystem.controller;

import cn.wtu.zld.chatroomsystem.entity.User;
import cn.wtu.zld.chatroomsystem.service.LoginAndSIgnService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * 用作登录注册使用的Controller层接口。处理登录注册相关请求
 * @author CodeDan
 * @time 2022年04月11日
 * **/
@Controller
public class LoginAndSignController {

    @Autowired
    private LoginAndSIgnService loginAndSIgnService;

    /**
     * URL请求，格式为GET请求，作用是跳转到的登录页面
     * @Return string
     **/
    @GetMapping("/toLogin")
    public String redirectLogin(){
        return "login";
    }

    /**
     * URL请求，格式为POST，请求内容为登录操作的校验
     * @Return string
     **/
    @PostMapping("login")
    @ResponseBody
    public String examUser(String username, String password, HttpServletRequest request){
       User user = loginAndSIgnService.examUserByService(username,password);
       if( user == null ){
           return "账号或者密码不正确，请重新输入";
       }
        HttpSession session = request.getSession();
        user.setPassword("");
        session.setAttribute("user",user);
        return "登录成功，正在跳转";
    }

    /**
     * URL请求，格式为Get，请求内容为跳转注册页面
     * @Return string
     **/
    @GetMapping("/toSign")
    public String redirectSign(){
        return "sign";
    }

    /**
     * URL请求，格式为Post，请求内容为注册用户请求
     * @Return string
     **/
    @PostMapping("/sign")
    @ResponseBody
    public String examSign(User user){
       return loginAndSIgnService.insertUserByService(user);
    }

    /**
     * URL请求，格式为Get，请求内容为获取指定用户信息请求
     * @Return JSON
     **/
    @GetMapping("/getUserData")
    @ResponseBody
    public String getUserData(String userAccount){
        User user = loginAndSIgnService.getUserDataByService(userAccount);
        user.setPassword("");
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(user);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return null;
    }


}
