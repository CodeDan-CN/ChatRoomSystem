package cn.wtu.zld.chatroomsystem.service.impi;

import cn.wtu.zld.chatroomsystem.entity.ChatRecord;
import cn.wtu.zld.chatroomsystem.mapper.ChatRecordMapper;
import cn.wtu.zld.chatroomsystem.service.ChatRecordService;
import cn.wtu.zld.chatroomsystem.service.CurdFriendService;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * 数据业务逻辑层接口实现类，主要是实现ChatRecordService接口
 * @author CodeDan
 * @time 2022年04月11日
 * **/
@Service
public class ChatRecordServiceImpI implements ChatRecordService {

    @Autowired
    private ChatRecordMapper chatRecordMapper;

    @Autowired
    private CurdFriendService curdFriendService;

    @Override
    public List<ChatRecord> getChatRecord(String userAccount, String newAccount) {
        ChatRecord chatRecord = new ChatRecord();
        chatRecord.setUserAccount(newAccount);
        chatRecord.setFriendAccount(userAccount);
        System.out.println(chatRecord);
        List<ChatRecord> recordList = chatRecordMapper.getChatRecordToDataBase(chatRecord);
        return recordList;
    }

    @Override
    public void addChatRecordByService(String userAccount, String friendAccount, String message) {
        //准备一下数据，主要是时间数据，格式为YYYY-MM-DD HH:MM:SS
        String nowtime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
        ChatRecord chatRecord = new ChatRecord();
        chatRecord.setUserAccount(userAccount);
        chatRecord.setFriendAccount(friendAccount);
        chatRecord.setText(message);
        chatRecord.setTime(nowtime);
        System.out.println(chatRecord);
        //注意：可以使用事务优化
        //首先插入到聊天记录表
        chatRecordMapper.addChatRecordToDataBase(chatRecord);
        //其次是修改好友列表中的最后一次发送的数据，以及发送时间
        curdFriendService.updateFriendMessageAndTimeByService(chatRecord);
    }
}
