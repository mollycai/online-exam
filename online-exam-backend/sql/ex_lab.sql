-- 题库表
CREATE TABLE `wechat_app`.`ex_lab`(
	·`id` INT PRIMARY KEY AUTO_INCREMENT,
	·`lab_name` VARCHAR(20),
) AUTO_INCREMENT=1;

-- 题目表
CREATE TABLE `wechat_app`.`ex_question`(
	`id` INT PRIMARY KEY AUTO_INCREMENT,
	`lid` INT NOT NULL,
	`qid` INT NOT NULL,
	`type` VARCHAR(20) NOT NULL,
	`stem` VARCHAR(255) NOT NULL,
	`options` VARCHAR(255),
	`answer` VARCHAR(255) NOT NULL,
	CONSTRAINT `id_fk` FOREIGN KEY (`lid`) REFERENCES `ex_lab`(`id`)
) AUTO_INCREMENT=1;

-- 答题记录表
CREATE TABLE `wechat_app`.`ex_record`(
	`id` INT PRIMARY KEY AUTO_INCREMENT ,
	`lid` INT NOT NULL,
	`time` DATETIME NOT NULL,
	`rate` VARCHAR(20) NOT NULL,
	CONSTRAINT `id_fk2` FOREIGN KEY (`lid`) REFERENCES `ex_lab`(`id`)
) AUTO_INCREMENT=1;