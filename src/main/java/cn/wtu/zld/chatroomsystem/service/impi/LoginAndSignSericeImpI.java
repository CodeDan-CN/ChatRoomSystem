package cn.wtu.zld.chatroomsystem.service.impi;

import cn.wtu.zld.chatroomsystem.entity.User;
import cn.wtu.zld.chatroomsystem.mapper.LoginAndSignMapper;
import cn.wtu.zld.chatroomsystem.service.LoginAndSIgnService;
import cn.wtu.zld.chatroomsystem.utils.MD5Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 数据业务逻辑层接口实现类，主要是实现LoginAndSignService接口
 * @author CodeDan
 * @time 2022年04月11日
 * **/
@Service
public class LoginAndSignSericeImpI implements LoginAndSIgnService {

    @Autowired
    private LoginAndSignMapper loginAndSignMapper;


    @Override
    public User examUserByService(String userAccount, String password) {
        if( userAccount == null || password == null ){
            return null;
        }
        User user = new User();
        user.setUserAccount(userAccount);
        user.setPassword(MD5Util.MD5Encode(password,"utf-8",true));
        return loginAndSignMapper.selectUserFromDataBases(user);
    }

    @Override
    public String insertUserByService(User user) {
        //首先判断account和密码符合规则嘛
        String account = user.getUserAccount();
        String password = user.getPassword();
        if( account.length() != 10 ){
            return "账号格式不满足条件，请重新输入账号";
        }
        if( password.length() < 6 || password.length() > 20 ){
            return "密码位数不满足条件，请重新输入密码";
        }
        //符合规则之后来判断以下是否已存在
        User tempUser = loginAndSignMapper.getUserFromDataBases(user.getUserAccount());
        if( tempUser == null){
            //用户不存在，进行插入操作
            String newMD5password = MD5Util.MD5Encode(user.getPassword(),"utf-8",true);
            user.setPassword(newMD5password);
            System.out.println(newMD5password);
            user.setSex("1");
            user.setPhoto("userPhoto1.png");
            user.setSummary("这个人很懒，没有留下任何个人简介哦~");
            loginAndSignMapper.insertUserToDataBases(user);
            return "注册成功，即将跳转登录页面";
        }else{
            return "用户已存在，请重新输入正确的账号";
        }
    }

    @Override
    public User getUserDataByService(String userAccount) {
        return loginAndSignMapper.getUserFromDataBases(userAccount);
    }
}
