import { Migration } from '@mikro-orm/migrations';

export class Migration20210703071734 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `user` (`id` int unsigned not null auto_increment primary key, `name` varchar(255) not null, `password` varchar(255) not null, `email` varchar(255) not null, `role` enum(\'User\', \'Admin\') not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `user` add unique `user_email_unique`(`email`);');

    this.addSql('create table `reset_password_token` (`id` varchar(255) not null, `user_id` int(11) unsigned not null, `time` datetime not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `reset_password_token` add primary key `reset_password_token_pkey`(`id`);');
    this.addSql('alter table `reset_password_token` add index `reset_password_token_user_id_index`(`user_id`);');
    this.addSql('alter table `reset_password_token` add unique `reset_password_token_user_id_unique`(`user_id`);');

    this.addSql('create table `uploaded_file` (`id` int unsigned not null auto_increment primary key, `user_id` int(11) unsigned not null, `file_path` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `uploaded_file` add index `uploaded_file_user_id_index`(`user_id`);');

    this.addSql('create table `article` (`id` int unsigned not null auto_increment primary key, `create_time` datetime not null, `last_update_time` datetime not null, `latest_revision_id` int(11) unsigned null, `owner_set_publicity` tinyint(1) not null, `admin_set_publicity` tinyint(1) not null, `owner_id` int(11) unsigned null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `article` add index `article_latest_revision_id_index`(`latest_revision_id`);');
    this.addSql('alter table `article` add unique `article_latest_revision_id_unique`(`latest_revision_id`);');
    this.addSql('alter table `article` add index `article_owner_id_index`(`owner_id`);');

    this.addSql('create table `article_revision` (`id` int unsigned not null auto_increment primary key, `revision_number` int(11) not null, `time` datetime not null, `title` varchar(255) not null, `authors` json not null, `keywords` text not null, `abstract` varchar(500) not null, `category` varchar(255) not null, `pdf_id` int(11) unsigned not null, `article_id` int(11) unsigned not null, `code_link` varchar(255) null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `article_revision` add index `article_revision_pdf_id_index`(`pdf_id`);');
    this.addSql('alter table `article_revision` add index `article_revision_article_id_index`(`article_id`);');

    this.addSql('alter table `reset_password_token` add constraint `reset_password_token_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade;');

    this.addSql('alter table `uploaded_file` add constraint `uploaded_file_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade on delete cascade;');

    this.addSql('alter table `article` add constraint `article_latest_revision_id_foreign` foreign key (`latest_revision_id`) references `article_revision` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `article` add constraint `article_owner_id_foreign` foreign key (`owner_id`) references `user` (`id`) on update cascade on delete cascade;');

    this.addSql('alter table `article_revision` add constraint `article_revision_pdf_id_foreign` foreign key (`pdf_id`) references `uploaded_file` (`id`) on update cascade;');
    this.addSql('alter table `article_revision` add constraint `article_revision_article_id_foreign` foreign key (`article_id`) references `article` (`id`) on update cascade on delete cascade;');
  }

}
