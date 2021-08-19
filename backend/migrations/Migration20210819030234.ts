import { Migration } from '@mikro-orm/migrations';

export class Migration20210819030234 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `metadata` (`key` varchar(255) not null, `value` varchar(255) null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `metadata` add primary key `metadata_pkey`(`key`);');

    this.addSql('create table `user` (`id` int unsigned not null auto_increment primary key, `name` varchar(255) not null, `password` varchar(255) not null, `email` varchar(255) not null, `role` enum(\'User\', \'Admin\') not null, `validated` tinyint(1) not null, `honor` varchar(255) not null default \'\', `honor_public` tinyint(1) not null default true, `job_title` varchar(255) not null default \'\', `job_title_public` tinyint(1) not null default true, `institution` varchar(255) not null default \'\', `institution_public` tinyint(1) not null default true, `academic_keywords` json not null, `research_labels` json not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `user` add unique `user_email_unique`(`email`);');

    this.addSql('create table `reset_password_token` (`id` int unsigned not null auto_increment primary key, `token` varchar(255) not null, `user_id` int(11) unsigned not null, `time` DATETIME(6) not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `reset_password_token` add unique `reset_password_token_token_unique`(`token`);');
    this.addSql('alter table `reset_password_token` add index `reset_password_token_user_id_index`(`user_id`);');
    this.addSql('alter table `reset_password_token` add unique `reset_password_token_user_id_unique`(`user_id`);');

    this.addSql('create table `email_validation_token` (`id` int unsigned not null auto_increment primary key, `token` varchar(255) not null, `time` DATETIME(6) not null, `last_sent` DATETIME(6) not null, `user_id` int(11) unsigned not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `email_validation_token` add unique `email_validation_token_token_unique`(`token`);');
    this.addSql('alter table `email_validation_token` add index `email_validation_token_user_id_index`(`user_id`);');
    this.addSql('alter table `email_validation_token` add unique `email_validation_token_user_id_unique`(`user_id`);');

    this.addSql('create table `uploaded_file` (`id` int unsigned not null auto_increment primary key, `user_id` int(11) unsigned not null, `file_path` varchar(255) not null, `time` DATETIME(6) not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `uploaded_file` add index `uploaded_file_user_id_index`(`user_id`);');

    this.addSql('create table `article` (`id` int unsigned not null auto_increment primary key, `create_time` DATETIME(6) not null, `last_update_time` DATETIME(6) not null, `owner_set_publicity` tinyint(1) not null, `admin_set_publicity` tinyint(1) not null, `owner_id` int(11) unsigned not null, `retracted_by_id` int(11) unsigned null, `retract_time` DATETIME(6) null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `article` add index `article_owner_id_index`(`owner_id`);');
    this.addSql('alter table `article` add index `article_retracted_by_id_index`(`retracted_by_id`);');

    this.addSql('create table `article_revision` (`id` int unsigned not null auto_increment primary key, `revision_number` int(11) not null, `time` DATETIME(6) not null, `authors` json not null, `cn_title` varchar(100) null, `cn_keywords` json null, `en_title` varchar(100) null, `en_keywords` json null, `abstract` varchar(2000) not null, `category` varchar(255) not null, `script_id` int(11) unsigned not null, `article_id` int(11) unsigned not null, `latest_revision_of_id` int(11) unsigned null, `code_link` varchar(255) null, `doi` varchar(255) null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `article_revision` add index `article_revision_script_id_index`(`script_id`);');
    this.addSql('alter table `article_revision` add index `article_revision_article_id_index`(`article_id`);');
    this.addSql('alter table `article_revision` add index `article_revision_latest_revision_of_id_index`(`latest_revision_of_id`);');
    this.addSql('alter table `article_revision` add unique `article_revision_latest_revision_of_id_unique`(`latest_revision_of_id`);');

    this.addSql('alter table `reset_password_token` add constraint `reset_password_token_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade on delete CASCADE;');

    this.addSql('alter table `email_validation_token` add constraint `email_validation_token_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade;');

    this.addSql('alter table `uploaded_file` add constraint `uploaded_file_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade on delete CASCADE;');

    this.addSql('alter table `article` add constraint `article_owner_id_foreign` foreign key (`owner_id`) references `user` (`id`) on update cascade on delete CASCADE;');
    this.addSql('alter table `article` add constraint `article_retracted_by_id_foreign` foreign key (`retracted_by_id`) references `user` (`id`) on update cascade on delete CASCADE;');

    this.addSql('alter table `article_revision` add constraint `article_revision_script_id_foreign` foreign key (`script_id`) references `uploaded_file` (`id`) on update cascade;');
    this.addSql('alter table `article_revision` add constraint `article_revision_article_id_foreign` foreign key (`article_id`) references `article` (`id`) on update cascade on delete CASCADE;');
    this.addSql('alter table `article_revision` add constraint `article_revision_latest_revision_of_id_foreign` foreign key (`latest_revision_of_id`) references `article` (`id`) on update cascade on delete CASCADE;');
  }

}
