package cn.wtu.zld.chatroomsystem.mapper;

import cn.wtu.zld.chatroomsystem.entity.ChatRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import javax.annotation.Resource;
import java.util.List;

@Resource
@Mapper
/**
 * 数据持久层接口，用于聊天记录的操作
 * @author CodeDan
 * @time 2022年04月11日
 * **/
public interface ChatRecordMapper {

    /**
     * 用于与指定好友的聊天记录
     * @param chatRecord
     * @return User
     * */
    public List<ChatRecord> getChatRecordToDataBase( ChatRecord chatRecord);

    /**
     * 用于写入与指定好友的聊天记录
     * @param chatRecord
     * @return void
     * */
    public void addChatRecordToDataBase(ChatRecord chatRecord);
}
