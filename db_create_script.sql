create table posts (
id int not null auto_increment,
title text not null,
url varchar(255) not null,
createdAt datetime,
score int default 0,
primary key (id)
);