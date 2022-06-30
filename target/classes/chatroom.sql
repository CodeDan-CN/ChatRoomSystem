create table tb_user(
    user_id int auto_increment,
    user_account varchar(20) UNIQUE NOT NULL,
    user_password varchar(20) NOT NULL,
    user_photo varchar(50) not null,
    user_name varchar(20) not null,
    user_sex varchar(1) not null default '1',
    user_summary varchar(40) NOT NULL,
    CONSTRAINT tb_user_pri_key_id  PRIMARY KEY(user_id) 
)